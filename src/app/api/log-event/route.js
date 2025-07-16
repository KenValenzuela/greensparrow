// app/api/log-event/route.js
// POST /api/log-event
import {createClient} from '@supabase/supabase-js';
import {NextResponse} from 'next/server';

/* ── sanity checks ──────────────────────────────────────────────── */
const {NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY} = process.env;
if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
      'Missing env vars: NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY'
  );
}

/* ── client ─────────────────────────────────────────────────────── */
const supabase = createClient(
    NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,          // service-role bypasses RLS
    {auth: {persistSession: false}} // don’t write cookies
);

/* ── route ──────────────────────────────────────────────────────── */
export async function POST(req) {
  try {
    /* 1️⃣ payload -------------------------------------------------- */
    const body = (await req.json?.()) ?? {};

    // allow either camelCase or snake_case
    const event_name = body.event_name ?? body.eventName;
    const customer_email = body.customer_email ?? body.customerEmail ?? null;
    const artist = body.artist ?? null;
    const style = body.style ?? null;
    const source = body.source ?? 'unknown';
    const session_id = body.session_id ?? body.sessionId ?? null;
    const metadata = body.metadata ?? {};

    if (!event_name) {
      return NextResponse.json(
          {error: 'event_name is required'},
          {status: 400}
      );
    }

    /* 2️⃣ insert --------------------------------------------------- */
    const {error} = await supabase.from('booking_events').insert([
      {
        event_name,
        customer_email,
        artist,
        style,
        source,
        session_id,
        metadata,
      },
    ]);

    if (error) {
      console.error('[log-event] Supabase insert error:', error);
      return NextResponse.json({error: error.message}, {status: 500});
    }

    /* 3️⃣ success -------------------------------------------------- */
    return NextResponse.json({ok: true});
  } catch (err) {
    console.error('[log-event] handler error:', err);
    return NextResponse.json({error: err.message}, {status: 500});
  }
}
