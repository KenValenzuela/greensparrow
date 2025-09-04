import {NextResponse} from 'next/server';

const hits = new Map();

function tooMany(ip) {
  const now = Date.now();
  const WINDOW = 60_000; // 1 min
  const MAX = 120;       // generous in dev; tweak for prod
  const recent = (hits.get(ip) || []).filter(t => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX;
}

function makeNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export function middleware(req) {
  const xfwd = req.headers.get('x-forwarded-for');
  const ip =
      xfwd?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      req.ip ||
      'unknown';

  if (tooMany(ip)) return new NextResponse('Rate limit exceeded', {status: 429});

  const nonce = makeNonce();
  const res = NextResponse.next();

  const csp = [
    "default-src 'self'",
    `script-src 'self' https://maps.googleapis.com 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
    "img-src 'self' data: https://images.unsplash.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "connect-src 'self' https://*.supabase.co https://maps.googleapis.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; ');

  res.headers.set('Content-Security-Policy', csp);
  res.headers.set('x-nonce', nonce);
  return res;
}

export const config = {matcher: ['/:path*']};
