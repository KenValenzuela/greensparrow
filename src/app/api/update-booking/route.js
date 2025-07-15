/* app/api/admin/update-booking/route.js */

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { createClient } from '@supabase/supabase-js';

/* ───────── env & helpers ───────── */
const SECRET = process.env.ADMIN_JWT_SECRET;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!SECRET || !SERVICE_KEY || !URL)
  throw new Error('Missing Supabase env vars (URL, SERVICE_ROLE_KEY, or ADMIN_JWT_SECRET)');

const supa = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });
const encoder = new TextEncoder();

/** verify admin_auth cookie */
async function isAuthed() {
  const token = cookies().get('admin_auth')?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, encoder.encode(SECRET));
    return true;
  } catch {
    return false;
  }
}

/* fields admins are allowed to change */
const ALLOWED_FIELDS = new Set([
  'status',
  'appointment_date',
  'preferred_artist',
  'message',
]);

/* ───────── PATCH /admin/update-booking ───────── */
export async function PATCH(req) {
  /* 0) auth guard */
  if (!(await isAuthed()))
    return new Response(JSON.stringify({ error: 'unauth' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });

  /* 1) parse + validate body */
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'JSON body required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { id, changes } = body || {};
  if (!id || typeof id !== 'string')
    return new Response(JSON.stringify({ error: 'missing id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });

  /* 2) sanitise changes */
  if (!changes || typeof changes !== 'object')
    return new Response(JSON.stringify({ error: 'missing changes' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });

  const clean = {};
  for (const [k, v] of Object.entries(changes)) {
    if (ALLOWED_FIELDS.has(k)) clean[k] = v;
  }
  if (Object.keys(clean).length === 0)
    return new Response(JSON.stringify({ error: 'no valid fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });

  /* 3) update bookings table */
  const { error: updErr } = await supa.from('bookings').update(clean).eq('id', id);
  if (updErr)
    return new Response(JSON.stringify({ error: updErr.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });

  /* 4) audit trail */
  await supa.from('booking_events').insert([
    {
      event_name: 'booking_updated',
      customer_email: null,
      artist: clean.preferred_artist || null,
      style: null,
      source: 'admin_dashboard',
      session_id: null,
      metadata: { id, changes: clean },
    },
  ]);

  /* 5) done */
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

/* optional: ensure edge runtime doesn’t cache */
export const dynamic = 'force-dynamic';
