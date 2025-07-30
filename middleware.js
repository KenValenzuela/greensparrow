// middleware.js
import {NextResponse} from 'next/server';
import crypto from 'crypto';

const ipCache = new Map();

/* ─ rate-limit helper ───────────────────────────── */
function tooManyRequests(ip) {
  const now = Date.now();
  const WINDOW_MS = 60_000;   // 1 min
  const MAX_REQUESTS = 5;

  const history = ipCache.get(ip) || [];
  const recent = history.filter(t => now - t < WINDOW_MS);

  recent.push(now);
  ipCache.set(ip, recent);

  return recent.length > MAX_REQUESTS;
}

/* ─ middleware ───────────────────────────────────── */
export function middleware(req) {
  const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.ip ||
      'unknown';

  if (tooManyRequests(ip)) {
    return new NextResponse('Rate limit exceeded', { status: 429 });
  }

  /* CSP with per-request nonce */
  const nonce = crypto.randomBytes(16).toString('base64');
  const res = NextResponse.next();
  const csp = [
    "default-src 'self'",
    `script-src 'self' https://maps.googleapis.com 'nonce-${nonce}'`,
    `style-src  'self' 'nonce-${nonce}'`,
    "img-src    'self' https://images.unsplash.com data:",
    "font-src   'self' https://fonts.gstatic.com data:",
    "frame-ancestors 'none'"
  ].join('; ');

  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('x-nonce', nonce);                 // expose to React
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  res.headers.set('X-Frame-Options', 'DENY');

  return res;
}

/* apply to every route (adjust if needed) */
export const config = {
  matcher: ['/:path*']
};
