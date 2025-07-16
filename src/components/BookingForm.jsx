// components/BookingForm.jsx
// Complete multi-step booking form with confirmation screen, analytics, and no placeholder comments.

'use client';

import {useEffect, useState} from 'react';
import {supabase} from '@/utils/supabaseClient';
import ImageUpload from './ImageUpload';
import {toast} from 'react-hot-toast';
import {AnimatePresence, motion} from 'framer-motion';

/* ── static lists ── */
const stepLabels = [
  'Info', 'Contact Info', 'Select Artist', 'Select Style',
  'Customer Type', 'Preferred Date', 'Message',
  'Upload Images', 'Review & Submit',
];
const artists = ['Joe', 'Mickey', 'T', 'Mia', 'Ki', 'Axel'];
const styles = [
  'Black & Grey', 'Cyber Sigilism', 'Anime', 'Flora & Fauna',
  'Fineline', 'Neo Traditional', 'Portrait', 'Piercing',
];
const customerTypes = ['New', 'Returning'];

export default function BookingForm() {
  /* form state */
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    message: '', placement: '',
    artist: [], style: [], customerType: [],
  });
  const [dateType, setDateType] = useState('single');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [images, setImages] = useState([]);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* seed anon session id */
  useEffect(() => {
    if (!localStorage.getItem('session_id'))
      localStorage.setItem('session_id', crypto.randomUUID());
  }, []);

  /* step analytics */
  useEffect(() => {
    if (step === 1) logEvent('booking_started');
    logEvent('booking_step_view', { step, step_label: stepLabels[step] });
    window?.gtag?.('event', 'form_step_view', { step, step_label: stepLabels[step] });
  }, [step]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({...p, [name]: value}));
  };

  const toggle = (key, value) => {
    setForm(p => {
      const arr = p[key];
      return {...p, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]};
    });
  };

  const chip = active => ({
    margin: '0.3em', padding: '0.5em 1em',
    border: '2px solid #488955', borderRadius: 24,
    background: active ? '#e7b462' : '#1c1f1a', color: '#fff', cursor: 'pointer',
  });

  /* image upload → bucket paths */
  const uploadImages = async () => {
    const paths = [];
    for (const item of images) {
      const file = item.file;
      const ext = file.name.split('.').pop();
      const key = `booking_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const {error} = await supabase
          .storage.from('booking-images')
          .upload(key, file, {cacheControl: '3600', upsert: false, contentType: file.type});
      if (error) throw new Error(error.message);
      paths.push(key);
    }
    return paths;
  };

  /* passive event log */
  const logEvent = async (event, metadata = {}) => {
    try {
      await fetch('/api/log-event', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          event_name: event,
          customer_email: form.email || null,
          artist: form.artist[0] || null,
          style: form.style[0] || null,
          source: 'booking_form',
          session_id: localStorage.getItem('session_id'),
          metadata,
        }),
      });
    } catch {/* ignore */
    }
  };

  /* submit */
  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message || !dateStart ||
        (dateType === 'range' && !dateEnd)) {
      toast.error('Please complete required fields');
      return;
    }

    setSubmitting(true);
    try {
      const imagePaths = images.length ? await uploadImages() : [];

      const res = await fetch('/api/book', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          message: form.message.trim(),
          placement: form.placement.trim(),
          appointment_date: dateStart,
          appointment_end: dateEnd || null,
          preferred_artist: form.artist[0] || null,
          preferred_style: form.style,
          customer_type: form.customerType[0] || 'New',
          images: imagePaths,
        }),
      });
      if (!res.ok) throw new Error('server error');

      toast.success('Booking submitted!');
      logEvent('booking_submitted');
      setSubmitted(true);
      window.scrollTo({top: 0, behavior: 'smooth'});
    } catch (err) {
      toast.error(`Submission failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  /* multi-step array */
  const steps = [
    <div key="info">
      <h2>Before You Book</h2>
      <p>Artists are appointment-only with occasional walk-ins.</p>
      <button type="button" onClick={() => setStep(1)}>Start Booking</button>
    </div>,

    <div key="contact">
      <label>Name*</label>
      <input name="name" value={form.name} onChange={handleChange}/>
      <label>Email*</label>
      <input type="email" name="email" value={form.email} onChange={handleChange}/>
      <label>Phone (optional)</label>
      <input name="phone" value={form.phone} onChange={handleChange}/>
    </div>,

    <div key="artist">
      <h3>Preferred Artist</h3>
      {artists.map(a => (
          <button key={a} type="button"
                  onClick={() => toggle('artist', a)}
                  style={chip(form.artist.includes(a))}>{a}</button>
      ))}
    </div>,

    <div key="style">
      <h3>Style</h3>
      {styles.map(s => (
          <button key={s} type="button"
                  onClick={() => toggle('style', s)}
                  style={chip(form.style.includes(s))}>{s}</button>
      ))}
    </div>,

    <div key="cust">
      <h3>Visited Before?</h3>
      {customerTypes.map(t => (
          <button key={t} type="button"
                  onClick={() => toggle('customerType', t)}
                  style={chip(form.customerType.includes(t))}>{t}</button>
      ))}
    </div>,

    <div key="date">
      <h3>Preferred Date</h3>
      <label><input type="radio" checked={dateType === 'single'}
                    onChange={() => setDateType('single')}/> Specific</label>
      <label><input type="radio" checked={dateType === 'range'}
                    onChange={() => setDateType('range')}/> Range</label>
      <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)}/>
      {dateType === 'range' &&
          <input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)}/>}
    </div>,

    <div key="msg">
      <label>Describe Your Idea*</label>
      <textarea name="message" value={form.message}
                onChange={handleChange} placeholder="Size, placement, inspiration…"/>
    </div>,

    <div key="img">
      <label>Reference Images (optional)</label>
      <ImageUpload images={images} setImages={setImages} max={5}/>
    </div>,

    <div key="review">
      <h3>Review &amp; Submit</h3>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Submit Booking'}
      </button>
    </div>,
  ];

  /* render */
  if (submitted) {
    return (
        <div style={confWrap}>
          <h2 style={confHead}>Thanks for booking!</h2>
          <p style={{marginTop: '1rem', fontSize: '1.1rem'}}>
            We’ll email you soon to confirm a time.
          </p>
        </div>
    );
  }

  return (
      <form onSubmit={handleSubmit} style={formWrap}>
        <div style={progOuter}>
          <div style={{...progInner, width: `${(step / (steps.length - 1)) * 100}%`}}/>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step}
                    initial={{opacity: 0, x: 50}}
                    animate={{opacity: 1, x: 0}}
                    exit={{opacity: 0, x: -50}}
                    transition={{duration: .35}}>
          {steps[step]}
        </motion.div>
      </AnimatePresence>

        <div style={navRow}>
          {step > 0 && <button type="button" onClick={() => setStep(s => s - 1)}>Back</button>}
          {step < steps.length - 1 &&
              <button type="button" onClick={() => setStep(s => s + 1)}>Next</button>}
      </div>
    </form>
  );
}

/* ── styles ── */
const formWrap = {maxWidth: 600, margin: '0 auto', padding: '1.5rem'};
const progOuter = {height: 8, background: '#3a2323', borderRadius: 4, marginBottom: '1rem'};
const progInner = {height: '100%', background: '#F1EDE0', transition: 'width .4s'};
const navRow = {marginTop: '1rem', display: 'flex', justifyContent: 'space-between'};
const confWrap = {...formWrap, padding: '3rem 1.5rem', background: '#2e2e2e', borderRadius: 12, textAlign: 'center'};
const confHead = {fontSize: '2rem', fontFamily: 'Sancreek,cursive', color: '#e4938a'};
