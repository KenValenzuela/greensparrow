// pages/api/admin/send-email.js    ← new (or replace existing) API route
import {Resend} from 'resend';
import {createClient} from '@supabase/supabase-js';

// init Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// service account (to fetch user email)
const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY, // service-role for RLS bypass
);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const {id, subject, message} = req.body;

        // 1. look up booking to grab client email
        const {data, error} = await supa
            .from('bookings')
            .select('email,name')
            .eq('id', id)
            .single();

        if (error || !data?.email)
            return res.status(400).json({error: 'Booking not found or missing email'});

        // 2. send the email
        await resend.emails.send({
            from: 'Green Sparrow <noreply@greensparrowtattoo.com>',
            to: data.email,
            subject: subject || 'Tattoo Booking Update',
            html: `
        <p>Hi ${data.name || ''},</p>
        <p>${message.replace(/\n/g, '<br />')}</p>
        <p style="margin-top:2rem">— Green Sparrow Tattoo Co.</p>
      `,
        });

        // 3. log event (optional)
        await supa.from('booking_events').insert({
            booking_id: id,
            event_name: 'manual_email',
            meta: {subject},
        });

        return res.status(200).json({ok: true});
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: 'Email failed'});
    }
}
