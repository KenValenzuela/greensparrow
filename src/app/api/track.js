// pages/api/track.js
import {createClient} from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // server-only
const supa = (url && serviceKey) ? createClient(url, serviceKey) : null;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const {event, source = 'unknown', session = null} = req.body || {};
    if (supa && event) {
      await supa.from('booking_events').insert({
        event_name: String(event).slice(0, 64),
        source,
        meta: {session}
      });
    }
  } catch { /* swallow */
  }
  res.status(204).end();
}
