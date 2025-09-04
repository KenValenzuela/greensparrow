import {NextResponse} from 'next/server';
import {Resend} from 'resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

const SHOP_INBOX = process.env.SHOP_INBOX || 'greensparrowtattooco@gmail.com';
const MAIL_FROM = process.env.MAIL_FROM || 'Green Sparrow Tattoo <booking@greensparrowtattoocompany.com>';
const OPEN = process.env.BOOKING_ENABLED !== '0';
const PUB = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));

const required = ['name', 'email', 'message', 'appointment_date'];

function isEmail(x) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(x || ''));
}

export async function POST(req) {
  if (!OPEN) return NextResponse.json({error: 'Online booking is temporarily disabled'}, {status: 503});
  if (!process.env.RESEND_API_KEY) return NextResponse.json({error: 'Email service not configured'}, {status: 503});
  if (!/@/.test(MAIL_FROM)) return NextResponse.json({error: 'MAIL_FROM is not a valid sender'}, {status: 503});

  // Parse + lightweight validate
  const b = await req.json().catch(() => ({}));
  for (const k of required) {
    if (!b?.[k]) return NextResponse.json({error: `Missing ${k}`}, {status: 400});
  }
  if (!isEmail(b.email)) return NextResponse.json({error: 'Invalid email'}, {status: 400});

  const imgs = Array.isArray(b.images) ? b.images : [];
  const imgLinks = (PUB && imgs.length)
      ? imgs.map((key) =>
          `<a href="${PUB}/storage/v1/object/public/booking-images/${encodeURIComponent(key)}">${esc(key)}</a>`
      ).join('<br/>')
      : (imgs.map(esc).join(', ') || '—');

  const subject =
      `[Booking Request] ${esc(b.name)} → ${b.first_available ? 'First available' : esc(b.preferred_artist || 'Unspecified')}`;

  const html = `
    <h3>New booking request</h3>
    <p>
      <b>Name:</b> ${esc(b.name)}<br/>
      <b>Email:</b> ${esc(b.email)}<br/>
      <b>Phone:</b> ${esc(b.phone || '—')}<br/>
      <b>Requested artist:</b> ${b.first_available ? 'First available' : esc(b.preferred_artist || '—')}<br/>
      <b>Preferred date:</b> ${esc(b.appointment_date)}${b.appointment_end ? ' – ' + esc(b.appointment_end) : ''}<br/>
      <b>Placement:</b> ${esc(b.placement || '—')}<br/>
      <b>Style(s):</b> ${(Array.isArray(b.preferred_style) && b.preferred_style.length) ? b.preferred_style.map(esc).join(', ') : '—'}<br/>
      <b>Customer type:</b> ${esc(b.customer_type || 'New')}<br/>
      <b>Description:</b> ${esc(b.message)}<br/>
      <b>Images:</b> ${imgLinks}
    </p>
    <p>Routed to shop inbox for assignment.</p>
  `.trim();

  const text =
      `New booking request

Name: ${b.name}
Email: ${b.email}
Phone: ${b.phone || '—'}
Requested artist: ${b.first_available ? 'First available' : (b.preferred_artist || '—')}
Preferred date: ${b.appointment_date}${b.appointment_end ? ' – ' + b.appointment_end : ''}
Placement: ${b.placement || '—'}
Style(s): ${Array.isArray(b.preferred_style) && b.preferred_style.length ? b.preferred_style.join(', ') : '—'}
Customer type: ${b.customer_type || 'New'}
Description: ${b.message}
Images: ${imgs.length ? imgs.join(', ') : '—'}
`;

  // Try with reply_to; if the SDK rejects the field name, retry with replyTo
  try {
    const sendPayload = {
      from: MAIL_FROM,                 // must be a verified sender domain
      to: [SHOP_INBOX],                // array form is fine, supports multiple recipients
      subject,
      html,
      text,
      reply_to: b.email,               // attempt 1
    };

    let res = await resend.emails.send(sendPayload);

    if (res?.error && String(res.error).toLowerCase().includes('reply')) {
      const retryPayload = {...sendPayload};
      delete retryPayload.reply_to;
      // Some SDK versions prefer camelCase:
      retryPayload.replyTo = b.email;  // attempt 2
      res = await resend.emails.send(retryPayload);
    }

    if (res?.error) {
      // Surface detailed error to client and logs for quick diagnosis
      console.error('RESEND_SEND_ERROR', res.error);
      return NextResponse.json({ok: false, error: res.error}, {status: 502});
    }

    return NextResponse.json({ok: true, id: res?.data?.id}, {status: 200});
  } catch (err) {
    console.error('RESEND_SEND_THROW', {
      name: err?.name,
      code: err?.code,
      message: err?.message,
    });
    return NextResponse.json({ok: false, error: 'EMAIL_SEND_FAILED'}, {status: 502});
  }
}
