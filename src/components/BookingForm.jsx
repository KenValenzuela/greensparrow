'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import toast from 'react-hot-toast';

const initial = {
    name: '',
    email: '',
    phone: '',
    preferred_artist: '',
    first_available: false,
    appointment_date: '',
    appointment_end: '',
    placement: '',
    preferred_style: [],
    customer_type: 'New',
    message: '',
    images: [],
};

const ARTISTS = ['Joe', 'Mickey', 'T', 'Mia', 'Ki', 'Axel'];
const STYLES = ['Black & Grey', 'Traditional', 'Neo-traditional', 'Fine Line', 'Color'];

export default function BookingForm() {
    const router = useRouter();
    const [form, setForm] = useState(initial);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState('');

    const set = (k, v) => setForm(prev => ({...prev, [k]: v}));

    const onStyleToggle = (val) => {
        setForm(prev => {
            const has = prev.preferred_style.includes(val);
            return {
                ...prev,
                preferred_style: has ? prev.preferred_style.filter(s => s !== val) : [...prev.preferred_style, val]
            };
        });
    };

    useEffect(() => {
        try {
            const saved = localStorage.getItem('booking_draft');
            if (saved) setForm(JSON.parse(saved));
        } catch {
        }
    }, []);
    useEffect(() => {
        try {
            localStorage.setItem('booking_draft', JSON.stringify(form));
        } catch {
        }
    }, [form]);

    async function handleSubmit(e) {
        e.preventDefault();
        setErr('');

        // Client-side checks for better UX
        if (!form.name || !form.email || !form.message || !form.appointment_date) {
            setErr('Please complete all required fields.');
            return;
        }
        if (!form.first_available && !form.preferred_artist) {
            setErr('Select an artist or choose “First available”.');
            return;
        }

        setBusy(true);
        toast.loading('Submitting…', {id: 'book'});
        try {
            const res = await fetch('/api/book', {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(form),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok || data?.ok === false) {
                const detail = data?.error || `Submit failed (${res.status})`;
                setErr(detail);
                toast.error(detail, {id: 'book'});
                setBusy(false);
                return;
            }

            toast.success('Request sent!', {id: 'book'});
            setForm(initial);
            try {
                localStorage.removeItem('booking_draft');
            } catch {
            }
            const id = data?.id ? `?id=${encodeURIComponent(data.id)}` : '';
            router.push(`/booking/success${id}`);
        } catch {
            setErr('Network error. Please try again.');
            toast.error('Network error', {id: 'book'});
        } finally {
            setBusy(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mx-auto grid gap-6">
            {/* Card: Heading / context */}
            <div className="mx-auto w-full max-w-2xl rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h2 className="mb-1 font-serif text-2xl text-[#F1EDE0]">Book an appointment</h2>
                <p className="text-sm text-white/70">Typical reply time: 1–2 business days.</p>

                {err && (
                    <div
                        role="alert"
                        className="mt-4 rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                    >
                        <strong className="block">Could not submit</strong>
                        <span className="opacity-90">{err}</span>
                    </div>
                )}

                {/* Grid: contact + placement */}
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Field label="Name" required>
                        <input
                            className="input"
                            value={form.name}
                            onChange={e => set('name', e.target.value)}
                            aria-invalid={!form.name ? 'true' : 'false'}
                        />
                    </Field>
                    <Field label="Email" required>
                        <input
                            className="input"
                            type="email"
                            value={form.email}
                            onChange={e => set('email', e.target.value)}
                            aria-invalid={!form.email ? 'true' : 'false'}
                        />
                    </Field>
                    <Field label="Phone">
                        <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)}/>
                    </Field>
                    <Field label="Placement">
                        <input className="input" value={form.placement} onChange={e => set('placement', e.target.value)}
                               placeholder="e.g., left forearm"/>
                    </Field>
                </div>

                {/* Grid: dates */}
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="Preferred date" required>
                        <input
                            className="input"
                            type="date"
                            value={form.appointment_date}
                            onChange={e => set('appointment_date', e.target.value)}
                            aria-invalid={!form.appointment_date ? 'true' : 'false'}
                        />
                    </Field>
                    <Field label="End time (optional)">
                        <input
                            className="input"
                            type="time"
                            value={form.appointment_end}
                            onChange={e => set('appointment_end', e.target.value)}
                        />
                    </Field>
                </div>

                {/* Artist section */}
                <fieldset className="mt-4 rounded-lg border border-white/10 p-3">
                    <legend className="px-1 text-sm text-white/80">Artist</legend>

                    <label className="mb-2 inline-flex cursor-pointer items-center gap-2 text-white/90">
                        <input
                            type="checkbox"
                            className="h-4 w-4 accent-[#2a8f5c]"
                            checked={form.first_available}
                            onChange={e => set('first_available', e.target.checked)}
                        />
                        First available
                    </label>

                    <div className="mt-2 flex flex-wrap gap-2">
                        {ARTISTS.map(a => {
                            const active = !form.first_available && form.preferred_artist === a;
                            return (
                                <button
                                    key={a}
                                    type="button"
                                    onClick={() => set('preferred_artist', active ? '' : a)}
                                    disabled={form.first_available}
                                    className={[
                                        'rounded-full border px-3 py-1 text-sm transition',
                                        form.first_available
                                            ? 'cursor-not-allowed border-white/10 text-white/30'
                                            : active
                                                ? 'border-[#2a8f5c]/70 bg-[#2a8f5c]/20 text-white'
                                                : 'border-white/15 text-white/80 hover:border-white/30',
                                    ].join(' ')}
                                    aria-pressed={active}
                                >
                                    {a}
                                </button>
                            );
                        })}
                    </div>
                </fieldset>

                {/* Styles section */}
                <fieldset className="mt-4 rounded-lg border border-white/10 p-3">
                    <legend className="px-1 text-sm text-white/80">Styles</legend>
                    <div className="flex flex-wrap gap-2">
                        {STYLES.map(s => {
                            const on = form.preferred_style.includes(s);
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => onStyleToggle(s)}
                                    className={[
                                        'rounded-full border px-3 py-1 text-sm transition',
                                        on
                                            ? 'border-[#e5948b]/70 bg-[#e5948b]/20 text-white'
                                            : 'border-white/15 text-white/80 hover:border-white/30',
                                    ].join(' ')}
                                    aria-pressed={on}
                                >
                                    {s}
                                </button>
                            );
                        })}
                    </div>
                </fieldset>

                {/* Message */}
                <Field className="mt-4" label="Describe your idea" required>
          <textarea
              className="input min-h-[120px]"
              value={form.message}
              onChange={e => set('message', e.target.value)}
              aria-invalid={!form.message ? 'true' : 'false'}
              placeholder="Size, placement, reference details…"
          />
                </Field>

                {/* Footer row */}
                <div className="mt-4 flex items-center justify-between gap-3">
                    <select
                        className="input max-w-[220px]"
                        value={form.customer_type}
                        onChange={e => set('customer_type', e.target.value)}
                    >
                        <option>New</option>
                        <option>Returning</option>
                    </select>

                    <div className="flex items-center gap-2">
                        <a href="tel:+16022093099"
                           className="rounded-md border border-white/15 px-3 py-2 text-white/80 hover:border-white/30">Call
                            the
                            shop</a>
                        <button
                            type="submit"
                            disabled={busy}
                            className="inline-flex items-center gap-2 rounded-md border border-[#2a8f5c]/60 bg-[#2a8f5c]/30 px-4 py-2 text-white transition disabled:opacity-60"
                        >
                            {busy && <Spinner/>}
                            {busy ? 'Submitting…' : 'Submit request'}
                        </button>
                    </div>
                </div>
            </div>

            {/* tiny style shim for inputs if you aren’t using a Tailwind plugin */}
            <style jsx>{`
                .input {
                    padding: 0.6rem 0.75rem;
                    border: 1px solid rgba(241, 237, 224, 0.14);
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 8px;
                    color: #f4f4f4;
                    outline: none;
                    width: 100%;
                }

                .input:focus {
                    border-color: #e5948b;
                }
            `}</style>
        </form>
    );
}

function Field({label, required, children, className = ''}) {
    return (
        <label className={`grid gap-1 ${className}`}>
      <span className="text-white/90">
        {label} {required && <span className="text-white/60">*</span>}
      </span>
            {children}
        </label>
    );
}

function Spinner() {
    return (
        <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
            aria-hidden="true"
        />
    );
}
