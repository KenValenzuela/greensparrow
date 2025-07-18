// app/api/admin/send-email/route.js
// POST /api/admin/send-email  ← manual follow-up from dashboard

import {createClient} from '@supabase/supabase-js';
import {Resend} from 'resend';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY, // bypass RLS
    {auth: {persistSession: false}},
);
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'Green Sparrow <noreply@greensparrow.app>';

/* tiny html helper */
const htmlWrap = (body) =>
    `<!doctype html><html><body style="font-family: sans-serif; line-height:1.6;">${body}</body></html>`;

export async function POST(req) {
    try {
        const {id, subject, message} = await req.json();
        if (!id || !subject || !message)
            return new Response(JSON.stringify({error: 'id, subject, message required'}), {status: 400});

        /* fetch booking + customer email */
        const {data: booking, error} = await supabase
            .from('bookings')
            .select('id, customer:customers ( email, first_name )')
            .eq('id', id)
            .single();
        if (error) throw error;

        const to = booking.customer.email;

        /* send email */
        await resend.emails.send({
            from: FROM,
            to,
            subject,
            html: htmlWrap(message.replace(/\n/g, '<br/>')),
        });

        /* log event so funnel updates */
        await supabase.from('booking_events').insert([
            {
                event_name: 'manual_email',
                customer_email: to,
                source: 'admin_dashboard',
                metadata: {booking_id: id, subject},
            },
        ]);

        return new Response(JSON.stringify({ok: true}), {status: 200});
    } catch (err) {
        console.error('[admin/send-email] error:', err);
        return new Response(JSON.stringify({error: err.message}), {status: 500});
    }
}
