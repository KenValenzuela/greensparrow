import { supabase } from '@/utils/supabaseClient';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const {
      name,
      email,
      phone,
      message,
      preferred_artist,
      preferred_style,
      customer_type,
      appointment_date,
      images = []
    } = await req.json();

    // 1) Upsert customer by email
    const customerPayload = {
      first_name: name.split(' ')[0] || name,
      last_name: name.split(' ').slice(1).join(' ') || null,
      email: email.toLowerCase(),
      phone,
      customer_type
    };
    const { data: customer, error: custErr } = await supabase
      .from('customers')
      .upsert(customerPayload, { onConflict: 'email' })
      .select('id')
      .single();
    if (custErr) throw custErr;
    const customer_id = customer.id;

    // 2) Lookup artist UUID
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

    // 3) Insert booking
    const { data: booking, error: bookErr } = await supabase
      .from('bookings')
      .insert([{
        customer_id,
        preferred_artist: artist_id,
        message,
        appointment_date,
        images // array of storage paths
      }])
      .select('id')
      .single();
    if (bookErr) throw bookErr;
    const booking_id = booking.id;

    // 4) Link styles to booking
    if (Array.isArray(preferred_style) && preferred_style.length > 0) {
      const { data: stylesRows, error: styleErr } = await supabase
        .from('styles')
        .select('id')
        .in('style_name', preferred_style);
      if (styleErr) throw styleErr;

      const links = stylesRows.map(({ id }) => ({
        booking_id,
        style_id: id
      }));
      const { error: linkErr } = await supabase
        .from('booking_styles')
        .insert(links);
      if (linkErr) throw linkErr;
    }

    // 5) Generate signed URLs for image paths
    let imageLinksHtml = '';
    for (const path of images) {
      const { data, error } = await supabase
        .storage
        .from('booking-images')
        .createSignedUrl(path, 60 * 60); // 1 hour

      if (!error && data?.signedUrl) {
        imageLinksHtml += `<a href="${data.signedUrl}">${path}</a><br/>`;
      } else {
        imageLinksHtml += `<em>Could not sign: ${path}</em><br/>`;
      }
    }

    // 6) Send notification email
    await resend.emails.send({
      from: 'greensparrowtattooco@gmail.com',
      to: process.env.NOTIFY_EMAIL,
      subject: '🖋️ New Booking Request Submitted',
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Artist:</strong> ${preferred_artist || 'N/A'}</p>
        <p><strong>Styles:</strong> ${preferred_style?.join(', ') || 'N/A'}</p>
        <p><strong>Customer Type:</strong> ${customer_type}</p>
        <p><strong>Appointment:</strong> ${appointment_date}</p>
        <p><strong>Message:</strong><br/> ${message}</p>
        ${images.length > 0 ? `<p><strong>Images:</strong><br/>${imageLinksHtml}</p>` : ''}
        <hr/>
        <p>View booking in Supabase dashboard.</p>
      `
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error('API Error:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}
