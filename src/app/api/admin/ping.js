// pages/api/admin/ping.js

import {createClient} from '@supabase/supabase-js';

const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    try {
        const today = new Date().toISOString().slice(0, 10);

        // Count today's bookings
        const {count: bookingsToday} = await supa
            .from('bookings')
            .select('*', {count: 'exact', head: true})
            .gte('created_at', `${today}T00:00:00.000Z`);

        // Last event from booking_events
        const {data: lastEventRow} = await supa
            .from('booking_events')
            .select('event_name, created_at')
            .order('created_at', {ascending: false})
            .limit(1)
            .maybeSingle();

        // Most recent metrics roll-up
        const {data: lastMetricRow} = await supa
            .from('admin_metrics')
            .select('day')
            .order('day', {ascending: false})
            .limit(1)
            .maybeSingle();

        // Check cron job
        const {data: cronRows} = await supa
            .rpc('cron_get_jobs'); // only works if pg_cron is enabled

        const cronOk = cronRows?.some(j => j.command?.includes('rollup_metrics'));

        return res.status(200).json({
            bookings_today: bookingsToday ?? 0,
            last_event: lastEventRow?.event_name ?? null,
            last_event_time: lastEventRow?.created_at ?? null,
            last_rollup_day: lastMetricRow?.day ?? null,
            cron_job_ok: cronOk
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: 'Ping failed'});
    }
}
