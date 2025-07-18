// components/BookingForm.jsx
// multi-step booking form (CSR)

'use client';

import {useEffect, useState} from 'react';
import {supabase} from '@/utils/supabaseClient';
import {toast} from 'react-hot-toast';
import ImageUpload from './ImageUpload';
import {AnimatePresence, motion} from 'framer-motion';

/* ── constants ── */
const STEP_LABELS = [
    'Intro', 'Contact', 'Artist', 'Style',
    'Customer Type', 'Date', 'Idea & Placement',
    'Images', 'Review',
];
const ARTISTS = ['Joe', 'Mickey', 'T', 'Mia', 'Ki', 'Axel'];
const STYLES = [
  'Black & Grey', 'Cyber Sigilism', 'Anime', 'Flora & Fauna',
  'Fineline', 'Neo Traditional', 'Portrait', 'Piercing',
];
const CUSTOMER_TYPE = ['New', 'Returning'];

/* ── helpers ── */
const chip = (active) => ({
    margin: '.3em', padding: '.5em 1em',
    border: '2px solid #488955', borderRadius: 24,
    background: active ? '#e7b462' : '#1c1f1a',
    color: '#fff', cursor: 'pointer',
});

/* ── component ── */
export default function BookingForm() {
    /* state */
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

    /* anon session id (for funnel) */
  useEffect(() => {
      if (!localStorage.getItem('session_id')) {
      localStorage.setItem('session_id', crypto.randomUUID());
      }
  }, []);

    /* analytics per step */
  useEffect(() => {
    if (step === 1) logEvent('booking_started');
      logEvent('booking_step_view', {step, step_label: STEP_LABELS[step]});
  }, [step]);

    /* field helpers */
    const handleChange = (e) =>
        setForm((p) => ({...p, [e.target.name]: e.target.value}));

    const toggle = (key, val) =>
        setForm((p) => {
      const arr = p[key];
            return {
                ...p,
                [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val],
            };
        });

    /* image upload → storage paths */
  const uploadImages = async () => {
    const paths = [];
      for (const {file} of images) {
          const ext = file.name.split('.').pop();
          const key = `booking_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
          const {error} = await supabase.storage
              .from('booking-images')
              .upload(key, file, {cacheControl: '3600', upsert: false, contentType: file.type});
      if (error) throw new Error(error.message);
      paths.push(key);
    }
    return paths;
  };

    /* generic event logger */
    const logEvent = async (event_name, metadata = {}) => {
    try {
      await fetch('/api/log-event', {
        method: 'POST',
          headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            event_name,
          customer_email: form.email || null,
          artist: form.artist[0] || null,
          style: form.style[0] || null,
          source: 'booking_form',
          session_id: localStorage.getItem('session_id'),
          metadata,
        }),
      });
    } catch {
        /* ignored */
    }
  };

  /* submit */
    const handleSubmit = async (e) => {
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
        if (!res.ok) throw new Error('Server error');

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

    /* step components */
  const steps = [
      /* 0 – intro */
      <div key="intro">
      <h2>Before You Book</h2>
          <p>Our artists work mainly by appointment; walk-ins are rare.</p>
          <button type="button" onClick={() => setStep(1)}>Start</button>
    </div>,

      /* 1 – contact */
    <div key="contact">
      <label>Name*</label>
        <input name="name" value={form.name} onChange={handleChange}/>
      <label>Email*</label>
        <input type="email" name="email" value={form.email} onChange={handleChange}/>
      <label>Phone (optional)</label>
        <input name="phone" value={form.phone} onChange={handleChange}/>
    </div>,

      /* 2 – artist */
    <div key="artist">
      <h3>Preferred Artist</h3>
        {ARTISTS.map((a) => (
            <button key={a} type="button"
                    onClick={() => toggle('artist', a)}
                    style={chip(form.artist.includes(a))}>{a}</button>
      ))}
    </div>,

      /* 3 – style */
    <div key="style">
      <h3>Style</h3>
        {STYLES.map((s) => (
            <button key={s} type="button"
                    onClick={() => toggle('style', s)}
                    style={chip(form.style.includes(s))}>{s}</button>
      ))}
    </div>,

      /* 4 – customer type */
    <div key="cust">
      <h3>Visited Before?</h3>
        {CUSTOMER_TYPE.map((t) => (
            <button key={t} type="button"
                    onClick={() => toggle('customerType', t)}
                    style={chip(form.customerType.includes(t))}>{t}</button>
      ))}
    </div>,

      /* 5 – date */
    <div key="date">
      <h3>Preferred Date</h3>
      <label><input type="radio" checked={dateType === 'single'}
                    onChange={() => setDateType('single')}/> Specific</label>
      <label><input type="radio" checked={dateType === 'range'}
                    onChange={() => setDateType('range')}/> Range</label>
        <input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)}/>
        {dateType === 'range' && (
            <input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)}/>
        )}
    </div>,

      /* 6 – idea & placement */
      <div key="idea">
      <label>Describe Your Idea*</label>
      <textarea name="message" value={form.message}
                onChange={handleChange} placeholder="Size, colours, etc."/>
          <label>Placement (e.g. forearm)</label>
          <input name="placement" value={form.placement} onChange={handleChange}/>
    </div>,

      /* 7 – images */
    <div key="img">
      <label>Reference Images (optional)</label>
        <ImageUpload images={images} setImages={setImages} max={5}/>
    </div>,

      /* 8 – review */
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
            <h2 style={confHead}>Thanks!</h2>
            <p>We’ll email you soon to confirm a time.</p>
        </div>
    );
  }

  return (
      <form onSubmit={handleSubmit} style={formWrap}>
          <div style={progOuter}>
              <div style={{...progInner, width: `${(step / (steps.length - 1)) * 100}%`}}/>
      </div>

      <AnimatePresence mode="wait">
          <motion.div
              key={step}
              initial={{opacity: 0, x: 40}}
              animate={{opacity: 1, x: 0}}
              exit={{opacity: 0, x: -40}}
              transition={{duration: .35}}
          >
          {steps[step]}
        </motion.div>
      </AnimatePresence>

          <div style={navRow}>
              {step > 0 && <button type="button" onClick={() => setStep((s) => s - 1)}>Back</button>}
              {step < steps.length - 1 && (
                  <button type="button" onClick={() => setStep((s) => s + 1)}>Next</button>
              )}
      </div>
    </form>
  );
}

/* ── styles ── */
const formWrap = {maxWidth: 600, margin: '0 auto', padding: '1.5rem'};
const progOuter = {height: 8, background: '#3a2323', borderRadius: 4, marginBottom: '1rem'};
const progInner = {height: '100%', background: '#F1EDE0'};
const navRow = {marginTop: '1rem', display: 'flex', justifyContent: 'space-between'};
const confWrap = {textAlign: 'center', padding: '3rem 0'};
const confHead = {fontSize: '1.75rem', margin: 0};
