// middleware.js
import { NextResponse } from 'next/server';

const ipCache = new Map();

export function middleware(req) {
  const ip = req.headers.get('x-forwarded-for') || req.ip;

  const now = Date.now();
  const limitWindow = 60 * 1000; // 1 min
  const maxRequests = 5;

  const recent = ipCache.get(ip) || [];

  const newRecent = recent.filter((timestamp) => now - timestamp < limitWindow);
  newRecent.push(now);

  ipCache.set(ip, newRecent);

  if (newRecent.length > maxRequests) {
    return new NextResponse('Rate limit exceeded', { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/book'], // adjust as needed
};
