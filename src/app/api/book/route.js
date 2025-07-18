// app/api/book/route.js
// POST /api/book  ← save booking + trigger confirm email

import { supabase } from '@/utils/supabaseClient';

const EMAIL_FN_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/email-booking-confirm`;
const AUTH_HEADER = {Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`};

/* cookie → object */
const parseCookies = (str = '') =>
  Object.fromEntries(
    str.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [decodeURIComponent(k), decodeURIComponent(v.join('='))];
    }),
  );

export async function POST(req) {
  try {
      /* 1. inputs */
    const {
      name,
      email,
      phone,
      message,
        placement,
      preferred_artist,
      preferred_style,
      customer_type,
      appointment_date,
        appointment_end,
      images = [],
    } = await req.json();

      /* 2. upsert customer */
      const [first_name, ...rest] = name.trim().split(' ');
    const { data: customer, error: custErr } = await supabase
      .from('customers')
      .upsert(
        {
          first_name,
          last_name: rest.join(' ') || null,
          email: email.toLowerCase(),
          phone,
          customer_type,
        },
          {onConflict: 'email'},
      )
      .select('id')
      .single();
    if (custErr) throw custErr;
    const customer_id = customer.id;

      /* 3. lookup artist (optional) */
    let artist_id = null;
    if (preferred_artist) {
      const { data: artist, error: artErr } = await supabase
        .from('artists')
        .select('id')
        .eq('name', preferred_artist)
        .maybeSingle();
      if (artErr) throw artErr;
      artist_id = artist?.id || null;
    }

      /* 4. insert booking */
    const { data: booking, error: bookErr } = await supabase
      .from('bookings')
      .insert([
        {
          customer_id,
          preferred_artist: artist_id,
            preferred_style,
          message,
            placement,
          appointment_date,
            appointment_end,
            images, // storage paths
        },
      ])
      .select('id')
      .single();
    if (bookErr) throw bookErr;
    const booking_id = booking.id;

      /* 5. analytics event */
      const cookies = parseCookies(req.headers.get('cookie'));
      const session_id = cookies.session_id ?? crypto.randomUUID();
      const source =
      cookies.utm_source ??
      new URL(req.headers.get('referer') || 'https://direct').hostname;

    await supabase.from('booking_events').insert([
      {
        event_name: 'booking_submitted',
        customer_email: email.toLowerCase(),
        artist: preferred_artist,
        style: preferred_style?.join(', ') || null,
        source,
        session_id,
        metadata: {
          referer: req.headers.get('referer') || null,
          user_agent: req.headers.get('user-agent') || null,
        },
      },
    ]);

      /* 6. fire confirm email (Edge Function → Resend) */
    await fetch(EMAIL_FN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
      body: JSON.stringify({
        booking_id,
        name,
        email,
        phone,
        message,
          placement,
        preferred_artist,
        preferred_style,
        appointment_date,
          appointment_end,
        images,
      }),
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('[book] API error:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
        {status: 500},
    );
  }
}
