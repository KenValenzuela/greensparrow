import { supabase } from '@/utils/supabaseClient';

const EMAIL_FN_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/email-booking-confirm`;
const AUTH_HEADER   = { Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` };

// ───────── helpers ─────────
const parseCookies = (str = '') =>
  Object.fromEntries(
    str.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [decodeURIComponent(k), decodeURIComponent(v.join('='))];
    })
  );

export async function POST(req) {
  try {
    // ── 1. Inputs ──
    const {
      name,
      email,
      phone,
      message,
      preferred_artist,
      preferred_style,
      customer_type,
      appointment_date,
      images = [],
    } = await req.json();

    // ── 2. Upsert / lookup ──
    const [first_name, ...rest] = name.split(' ');
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
        { onConflict: 'email' }
      )
      .select('id')
      .single();

    if (custErr) throw custErr;
    const customer_id = customer.id;

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

    // ── 3. Insert booking ──
    const { data: booking, error: bookErr } = await supabase
      .from('bookings')
      .insert([
        {
          customer_id,
          preferred_artist: artist_id,
          message,
          appointment_date,
          images, // array of storage paths
        },
      ])
      .select('id')
      .single();
    if (bookErr) throw bookErr;
    const booking_id = booking.id;

    // ── 4. Link styles (pivot) ──
    if (Array.isArray(preferred_style) && preferred_style.length) {
      const { data: stylesRows, error: styleErr } = await supabase
        .from('styles')
        .select('id')
        .in('style_name', preferred_style);
      if (styleErr) throw styleErr;

      await supabase.from('booking_styles').insert(
        stylesRows.map(({ id }) => ({ booking_id, style_id: id }))
      );
    }

    // ── 5. Analytics event ──
    const cookies = parseCookies(req.headers.get('cookie'));
    const session_id = cookies.session_id ?? crypto.randomUUID(); // fallback
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

    // ── 6. Fire transactional email via Supabase Edge Function (Resend) ──
    await fetch(EMAIL_FN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...AUTH_HEADER },
      body: JSON.stringify({
        booking_id,
        name,
        email,
        phone,
        message,
        preferred_artist,
        preferred_style,
        appointment_date,
        images,
      }),
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('[book] API error:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}