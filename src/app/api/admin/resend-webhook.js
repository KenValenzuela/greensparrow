// pages/api/admin/resend-webhook.js
import {buffer} from 'micro';

export const config = {api: {bodyParser: false}};
export default async function handler(req, res) {
    const raw = (await buffer(req)).toString();   // no verification for brevity
    const ev = JSON.parse(raw);
    // we only care about delivered/bounced
    await supa.from('booking_events').insert({
        booking_id: ev.metadata?.booking_id || null,
        event_name: ev.type,            // delivered | bounced | opened
        meta: ev,
    });
    res.status(200).end();
}
