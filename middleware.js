import {NextResponse} from 'next/server';
import crypto from 'crypto';

const hits = new Map();

/* ─ simple sliding-window limiter ─ */
function tooMany(ip) {
  const now = Date.now();
  const WINDOW = 60_000;     // 1 min
  const MAX = 5;

  const recent = (hits.get(ip) || []).filter(t => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);

  return recent.length > MAX;
}

export function middleware(req) {
  const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.ip ||
      'unknown';

  if (tooMany(ip)) {
    return new NextResponse('Rate limit exceeded', { status: 429 });
  }

  /* ─ CSP with per-request nonce ─ */
  const nonce = crypto.randomBytes(16).toString('base64');
  const res = NextResponse.next();

  const csp = [
    "default-src 'self'",
    `script-src 'self' https://maps.googleapis.com 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src  'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
    "img-src    'self' data: https://images.unsplash.com",
    "font-src   'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https://*.supabase.co https://maps.googleapis.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; ');

  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('x-nonce', nonce);          // expose for <script nonce={…}/>
  return res;
}

/* apply to all routes */
export const config = {
  matcher: ['/:path*'],
};
