'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import ImageUpload from './ImageUpload';
import { toast } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

const stepLabels = [
  'Info', 'Contact Info', 'Select Artist', 'Select Style',
  'Customer Type', 'Preferred Date', 'Message',
  'Upload Images', 'Review & Submit'
];

const artists = ['Joe', 'Mickey', 'T', 'Mia', 'Ki', 'Axel'];
const styles = [
  'Black & Grey', 'Cyber Sigilism', 'Anime', 'Flora & Fauna',
  'Fineline', 'Neo Traditional', 'Portrait', 'Piercing'
];
const customerTypes = ['New', 'Returning'];

export default function BookingForm() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    message: '', placement: '',
    artist: [], style: [], customerType: []
  });
  const [dateType, setDateType] = useState('single');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    window?.gtag?.('event', 'form_step_view', {
      step,
      step_label: stepLabels[step]
    });
  }, [step]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const toggle = (key, val) => {
    setForm(f => {
      const selected = f[key];
      return {
        ...f,
        [key]: selected.includes(val)
          ? selected.filter(x => x !== val)
          : [...selected, val]
      };
    });
  };

  const uploadImages = async () => {
    const paths = [];
    for (let img of images) {
      const file = img.file;
      const ext = file.name.split('.').pop();
      const path = `booking_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage.from('booking-images').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

      if (error) throw new Error(error.message);
      paths.push(path); // secure storage reference
    }
    return paths;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message || (dateType === 'single' && !dateStart) || (dateType === 'range' && (!dateStart || !dateEnd))) {
      toast.error('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    let imagePaths = [];

    try {
      if (images.length > 0) {
        imagePaths = await uploadImages();
      }
    } catch (err) {
      toast.error(`Image upload failed: ${err.message}`);
      setSubmitting(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone?.trim(),
      message: form.message.trim(),
      placement: form.placement.trim(),
      appointment_date: new Date(dateStart).toISOString(),
      preferred_artist: form.artist[0] || null,
      preferred_style: form.style,
      customer_type: form.customerType[0] || 'New',
      images: imagePaths // storing bucket paths only
    };

    const res = await fetch('/api/book', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const { success, error } = await res.json();

    if (success) {
      toast.success('Booking submitted!');
      setForm({ name: '', email: '', phone: '', message: '', placement: '', artist: [], style: [], customerType: [] });
      setDateStart('');
      setDateEnd('');
      setImages([]);
      setStep(0);
    } else {
      toast.error('Submission failed: ' + error);
    }

    setSubmitting(false);
  };

  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const chipStyle = selected => ({
    margin: '0.3em',
    padding: '0.5em 1em',
    border: '2px solid #488955',
    borderRadius: '24px',
    background: selected ? '#e7b462' : '#1c1f1a',
    color: selected ? '#FFF' : '#ffffff',
    cursor: 'pointer'
  });

  const steps = [
    <div key="info"><h2>Before You Book</h2><p>Artists are appointment-only with occasional walk-ins.</p><p>Continue with the booking system—we’ll reach out within 24–48 hours.</p><button onClick={next}>Start Booking</button></div>,
    <div key="contact">
      <label>Name*</label><input name="name" value={form.name} onChange={handleChange} />
      <label>Email*</label><input name="email" type="email" value={form.email} onChange={handleChange} />
      <label>Phone (optional)</label><input name="phone" value={form.phone} onChange={handleChange} />
    </div>,
    <div key="artist"><h3>Preferred Artist</h3>{artists.map(a => <button key={a} onClick={() => toggle('artist', a)} style={chipStyle(form.artist.includes(a))}>{a}</button>)}</div>,
    <div key="style"><h3>Style</h3>{styles.map(s => <button key={s} onClick={() => toggle('style', s)} style={chipStyle(form.style.includes(s))}>{s}</button>)}</div>,
    <div key="type"><h3>Visited Us Before?</h3>{customerTypes.map(ct => <button key={ct} onClick={() => toggle('customerType', ct)} style={chipStyle(form.customerType.includes(ct))}>{ct}</button>)}</div>,
    <div key="preferred-date">
      <h3>Preferred Date</h3><p>Pick a day or a range.</p>
      <label><input type="radio" checked={dateType === 'single'} onChange={() => setDateType('single')} /> Specific</label>
      <label><input type="radio" checked={dateType === 'range'} onChange={() => setDateType('range')} /> Range</label>
      <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} />
      {dateType === 'range' && <input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} />}
    </div>,
    <div key="message"><label>Describe Your Idea*</label><textarea name="message" value={form.message} onChange={handleChange} placeholder="Size, placement, inspiration..." /></div>,
    <div key="images"><label>Reference Images (Optional)</label><ImageUpload images={images} setImages={setImages} max={5} /></div>,
    <div key="review"><h3>Review & Submit</h3><button type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit Booking'}</button></div>
  ];

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '0 auto', padding: '1.5rem 1rem' }}>
      <div style={{ marginBottom: '1rem', height: '8px', background: '#3a2323', borderRadius: '4px' }}>
        <div style={{ height: '100%', width: `${(step / (steps.length - 1)) * 100}%`, background: '#F1EDE0', transition: 'width 0.4s ease' }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }}>
          {steps[step]}
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        {step > 0 && <button type="button" onClick={back}>Back</button>}
        {step < steps.length - 1 && <button type="button" onClick={next}>Next</button>}
      </div>
    </form>
  );
}
