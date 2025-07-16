// pages/api/track.js
import {createClient} from '@supabase/supabase-js';

const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const {event, source = 'unknown', session = null} = req.body;
        if (!event) return res.status(400).json({error: 'Missing event'});

        await supa.from('booking_events').insert({
            event_name: event,
            source,
            meta: {session},
        });

        res.status(200).json({ok: true});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Failed to log event'});
    }
}
