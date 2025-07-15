/**
 * Generic client-side event logger.
 * Added defensive typing + default fallbacks.
 */

import { supabase } from '@/utils/supabaseClient';

export async function POST(req) {
  try {
    const {
      event_name       = 'unknown',
      customer_email   = null,
      artist           = null,
      style            = null,
      source           = 'unknown',
      session_id       = null,
      metadata         = {},
    } = await req.json();

    const { error } = await supabase.from('booking_events').insert([
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
    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('[log-event] error:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
