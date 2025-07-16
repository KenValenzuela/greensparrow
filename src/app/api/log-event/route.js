// app/api/log-event/route.js   ← replace entire file
import {createClient} from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY   // service-role key bypasses RLS
);

export async function POST(req) {
  try {
    const {
      event_name,
      customer_email = null,
      artist = null,
      style = null,
      source = 'unknown',
      session_id = null,
      metadata = {},
    } = await req.json();

    if (!event_name)
      return new Response(JSON.stringify({error: 'event_name required'}), {status: 400});

    const {error} = await supabase.from('booking_events').insert([{
      event_name,
      customer_email,
      artist,
      style,
      source,
      session_id,
      metadata,
    }]);

    if (error)
      return new Response(JSON.stringify({error: error.message}), {status: 500});

    return new Response(JSON.stringify({ok: true}), {status: 200});
  } catch (err) {
    console.error('[log-event] error:', err);
    return new Response(JSON.stringify({error: err.message}), {status: 500});
  }
}
