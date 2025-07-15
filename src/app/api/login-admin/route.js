/* app/api/login-admin/route.js */

import { SignJWT } from 'jose';

const encoder = new TextEncoder();

/* ───────── helper to sign JWT ───────── */
async function signAdminJWT(secret) {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .sign(encoder.encode(secret));
}

/* ───────── route handler ────────────── */
export async function POST(req) {
  const PASS   = process.env.ADMIN_PASS;
  const SECRET = process.env.ADMIN_JWT_SECRET;

  if (!SECRET) {
    return new Response(
      JSON.stringify({ error: 'Missing ADMIN_JWT_SECRET' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!PASS) {
    return new Response(
      JSON.stringify({ error: 'Missing ADMIN_PASS' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ---------- 1. parse body --------------
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Body must be JSON: { "password": "..." }' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { password } = body || {};
  if (typeof password !== 'string') {
    return new Response(
      JSON.stringify({ error: 'Missing “password” field' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ---------- 2. verify pass -------------
  if (password !== PASS) {
    return new Response(
      JSON.stringify({ success: false, error: 'unauth' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ---------- 3. mint JWT ---------------
  const jwt = await signAdminJWT(SECRET);

  // ---------- 4. set cookie --------------
  const dev   = process.env.NODE_ENV !== 'production';
  const cookie = [
    `admin_auth=${jwt}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    dev ? '' : 'Secure',
    'Max-Age=7200',          // 2 hours
  ]
    .filter(Boolean)
    .join('; ');

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookie,
    },
  });
}

export const dynamic = 'force-dynamic';
