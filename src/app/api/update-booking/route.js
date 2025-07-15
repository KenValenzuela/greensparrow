/* app/api/admin/update-booking/route.js */

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { createClient } from '@supabase/supabase-js';

/* ───────── static config ───────── */
const encoder = new TextEncoder();
const ALLOWED_FIELDS = new Set([
  'status',
  'appointment_date',
  'preferred_artist',
  'message',
]);

/** verify admin_auth cookie */
async function isAuthed(secret) {
  const token = cookies().get('admin_auth')?.value;
  if (!token || !secret) return false;
  try {
    await jwtVerify(token, encoder.encode(secret));
    return true;
  } catch {
    return false;
  }
}

/* ───────── PATCH /admin/update-booking ───────── */
export async function PATCH(req) {
  // ── 0. check env vars (only at runtime, not build time) ──
  const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const SECRET = process.env.ADMIN_JWT_SECRET;

  if (!URL || !SERVICE_KEY || !SECRET) {
    return new Response(JSON.stringify({
      error: 'Missing Supabase env vars (URL, SERVICE_ROLE_KEY, or ADMIN_JWT_SECRET)',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supa = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });

  // ── 1. auth guard ──
  if (!(await isAuthed(SECRET))) {
    return new Response(JSON.stringify({ error: 'unauth' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── 2. parse + validate body ──
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
  if (!id || typeof id !== 'string') {
    return new Response(JSON.stringify({ error: 'missing id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!changes || typeof changes !== 'object') {
    return new Response(JSON.stringify({ error: 'missing changes' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── 3. sanitise changes ──
  const clean = {};
  for (const [k, v] of Object.entries(changes)) {
    if (ALLOWED_FIELDS.has(k)) clean[k] = v;
  }

  if (Object.keys(clean).length === 0) {
    return new Response(JSON.stringify({ error: 'no valid fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── 4. update bookings ──
  const { error: updErr } = await supa.from('bookings').update(clean).eq('id', id);
  if (updErr) {
    return new Response(JSON.stringify({ error: updErr.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── 5. insert audit log ──
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

  // ── 6. done ──
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const dynamic = 'force-dynamic';
