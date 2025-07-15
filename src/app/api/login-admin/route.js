/* app/api/login-admin/route.js */

import { SignJWT } from 'jose';

const PASS   = process.env.ADMIN_PASS;          // server-only
const SECRET = process.env.ADMIN_JWT_SECRET;    // server-only

if (!SECRET) {
  throw new Error(
    'ADMIN_JWT_SECRET is missing. Set it in your `.env` / Vercel env vars.'
  );
}

/* ───────── helper to sign JWT ───────── */
const encoder = new TextEncoder();
async function signAdminJWT() {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .sign(encoder.encode(SECRET));
}

/* ───────── route handler ────────────── */
export async function POST(req) {
  /* ---------- 0. env-var sanity ---------- */
  if (!PASS)
    return new Response(
      JSON.stringify({ error: 'ADMIN_PASS env var not set' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );

  /* ---------- 1. parse body -------------- */
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

  /* ---------- 2. verify pass ------------- */
  if (password !== PASS)
    return new Response(
      JSON.stringify({ success: false, error: 'unauth' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );

  /* ---------- 3. mint JWT --------------- */
  const jwt = await signAdminJWT();

  /* ---------- 4. set cookie -------------- */
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

/* ───────── optional method guard (app router) ───────── */
export const dynamic = 'force-dynamic'; // ensure edge caching doesn’t interfere
