'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import toast from 'react-hot-toast';

/* ====================== BOOKING FORM (Customer select fixed) ======================
 * - Customer select now styled via data-attribute + class, with :has() CSS fallback.
 * - Compact calendar (no end-time input), strong spacing, non-overlapping fields.
 * - Error banner shows only after a submit attempt.
 * - Press-motion micro-interactions on buttons/chips.
 * - Stella added; Axel included; “Piercing” style present.
 * - Payload unchanged; no TypeScript.
 * ================================================================================
 */

const initial = {
    name: '',
    email: '',
    phone: '',
    preferred_artist: '',
    first_available: false,
    appointment_date: '',
    appointment_end: '',       // kept for API compatibility (no UI)
    placement: '',
    preferred_style: [],
    customer_type: 'New',
    message: '',
    images: [],
};

const ARTISTS = ['Joe', 'Mickey', 'T', 'Mia', 'Ki', 'Axel', 'Stella'];
const STYLES = ['Black & Grey', 'Traditional', 'Neo-traditional', 'Fine Line', 'Color', 'Piercing'];

/* -------------------- Press motion -------------------- */
function usePressMotion({dx = 3, dy = -3, scale = 0.985, impulseMs = 120} = {}) {
    const [pressed, setPressed] = useState(false);
    const press = () => {
        setPressed(true);
        clearTimeout(press._t);
        press._t = setTimeout(() => setPressed(false), impulseMs);
    };
    return {
        style: pressed ? {transform: `translate(${dx}px, ${dy}px) scale(${scale})`} : undefined,
        handlers: {
            onPointerDown: (e) => {
                if (e.pointerType !== 'mouse' || e.button === 0) press();
            },
            onPointerUp: () => setPressed(false),
            onPointerCancel: () => setPressed(false),
            onKeyDown: (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    press();
                }
            },
            onKeyUp: () => setPressed(false),
        },
    };
}

function Pressable({children, motion = 'diag', scale = 0.985, className = '', as = 'button', ...rest}) {
    const map = {
        right: {dx: 3, dy: 0},
        left: {dx: -3, dy: 0},
        up: {dx: 0, dy: -3},
        down: {dx: 0, dy: 3},
        diag: {dx: 3, dy: -3}
    };
    const preset = typeof motion === 'string' ? (map[motion] || map.diag) : motion;
    const {style, handlers} = usePressMotion({...preset, scale});
    const Comp = as;
    return (
        <Comp {...rest} {...handlers} style={style}
              className={`transition-transform duration-150 will-change-transform ${className}`}>
            {children}
        </Comp>
    );
}

/* ----------------------- Calendar ----------------------- */
function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addMonths(date, n) {
    return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

function fmtISO(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
}

function isBeforeTodayISO(iso) {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const x = new Date(iso);
    x.setHours(0, 0, 0, 0);
    return x < t;
}

function Calendar({valueISO, onChange}) {
    const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
    const monthLabel = cursor.toLocaleString(undefined, {month: 'long', year: 'numeric'});

    const cells = useMemo(() => {
        const start = startOfMonth(cursor);
        const end = endOfMonth(cursor);
        const startDay = (start.getDay() + 6) % 7; // Mon=0
        const arr = [];
        for (let i = 0; i < startDay; i++) arr.push(null);
        for (let d = 1; d <= end.getDate(); d++) arr.push(fmtISO(new Date(cursor.getFullYear(), cursor.getMonth(), d)));
        while (arr.length % 7) arr.push(null);
        return arr;
    }, [cursor]);

    const select = (iso) => {
        if (!iso || isBeforeTodayISO(iso)) return;
        onChange(iso);
    };

    return (
        <div className="calendar">
            <div className="calendar__header">
                <Pressable as="button" type="button" motion="left" className="calendar__nav"
                           onClick={() => setCursor(m => addMonths(m, -1))} aria-label="Previous month">‹</Pressable>
                <div className="calendar__label">{monthLabel}</div>
                <Pressable as="button" type="button" motion="right" className="calendar__nav"
                           onClick={() => setCursor(m => addMonths(m, 1))} aria-label="Next month">›</Pressable>
            </div>
            <div className="calendar__weekdays">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="calendar__grid">
                {cells.map((iso, i) => {
                    const disabled = !iso || isBeforeTodayISO(iso);
                    const selected = !!iso && iso === valueISO;
                    return (
                        <button
                            key={i}
                            type="button"
                            disabled={disabled}
                            onClick={() => select(iso)}
                            className={`calendar__day ${disabled ? 'is-disabled' : ''} ${selected ? 'is-selected' : ''}`}
                            data-selected={selected ? 'true' : 'false'}
                            aria-pressed={selected || undefined}
                        >
                            {iso ? Number(iso.slice(-2)) : ''}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* ============================== Main ============================== */

export default function BookingForm() {
    const router = useRouter();
    const [form, setForm] = useState(initial);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState('');
    const [attemptedSubmit, setAttemptedSubmit] = useState(false);

    const set = (k, v) => setForm(prev => ({...prev, [k]: v}));

    // Draft persistence
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

    // Progress meter (visual only)
    const progress = useMemo(() => {
        const req = [
            Boolean(form.name),
            Boolean(form.email),
            Boolean(form.message),
            Boolean(form.appointment_date),
            form.first_available || Boolean(form.preferred_artist),
        ].filter(Boolean).length;
        return Math.max(10, (req / 5) * 100);
    }, [form]);

    // Uploader (data URLs)
    const dropRef = useRef(null);
    const toDataUrl = (file) => new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = reject;
        r.readAsDataURL(file);
    });

    async function handleFiles(files) {
        const list = Array.from(files || []);
        if (!list.length) return;
        try {
            const urls = await Promise.all(list.map(toDataUrl));
            set('images', [...form.images, ...urls].slice(0, 8));
        } catch {
            toast.error('Could not read one of the files.');
        }
    }

    const onDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer?.files;
        if (files?.length) await handleFiles(files);
    };
    const onPaste = async (e) => {
        const items = e.clipboardData?.items || [];
        const files = Array.from(items).filter(i => i.kind === 'file').map(i => i.getAsFile()).filter(Boolean);
        if (files.length) await handleFiles(files);
    };
    useEffect(() => {
        const node = dropRef.current;
        if (!node) return;
        const prevent = (evt) => {
            evt.preventDefault();
            evt.stopPropagation();
        };
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev => node.addEventListener(ev, prevent));
        return () => ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev => node.removeEventListener(ev, prevent));
    }, []);
    const removeImage = (i) => set('images', form.images.filter((_, idx) => idx !== i));

    // Submit
    async function handleSubmit(e) {
        e.preventDefault();
        setAttemptedSubmit(true);
        if (!form.name || !form.email || !/.+@.+\..+/.test(form.email) || !form.message || !form.appointment_date) {
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
                body: JSON.stringify(form)
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

    const inputBase =
        'w-full rounded-[var(--field-radius)] border border-[var(--hairline)] bg-[var(--field-surface)] ' +
        'px-[var(--field-pad-x)] py-[var(--field-pad-y)] text-[var(--field-fg)] placeholder-white/50 ' +
        'outline-none focus:border-[var(--cta-bg)] focus:ring-0';

    return (
        <div className="relative booking-surface">
            {/* Sticky header with progress */}
            <div
                className="sticky top-0 z-30 border-b border-[var(--hairline)] backdrop-blur supports-[backdrop-filter]:bg-black/30">
                <div className="mx-auto max-w-3xl px-[var(--container-pad-x)] py-[var(--container-pad-y)]">
                    <div className="flex items-center justify-between gap-[var(--gap-lg)]">
                        <div className="leading-tight">
                            <h2 className="font-serif text-[1.15rem] text-[#F1EDE0]">Book an appointment</h2>
                            <p className="text-xs text-white/70">Typical reply time: 1–2 business days.</p>
                        </div>
                        <div className="hidden sm:flex w-44 items-center gap-2">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                                <div className="h-2 rounded-full"
                                     style={{width: `${Math.round(progress)}%`, backgroundColor: 'var(--cta-bg)'}}/>
                            </div>
                            <span className="min-w-10 text-right text-xs text-white/70">{Math.round(progress)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}
                  className="mx-auto grid gap-[var(--block-gap)] px-[var(--container-pad-x)] pb-32 pt-[var(--container-pad-y)] sm:pb-[var(--container-pad-y)]"
                  noValidate>
                <div className="booking-card">
                    {attemptedSubmit && err && (
                        <div role="alert"
                             className="mb-[var(--block-gap)] rounded-[var(--field-radius)] border border-rose-400/40 bg-rose-500/10 px-[var(--pad)] py-[var(--pad-sm)] text-sm text-rose-200">
                            <strong className="block">Could not submit</strong>
                            <span className="opacity-90">{err}</span>
                        </div>
                    )}

                    {/* Customer select — now with robust color logic */}
                    <label className="field">
                        <span className="field-label">Customer</span>
                        <select
                            name="customer_type"
                            value={form.customer_type}
                            onChange={e => set('customer_type', e.target.value)}
                            // BOTH a class toggle and a data attribute (belt & suspenders)
                            className={`input-base select-vis select-variant ${form.customer_type === 'Returning' ? 'is-returning' : 'is-new'}`}
                            data-customer={form.customer_type === 'Returning' ? 'returning' : 'new'}
                        >
                            {/* explicit value attributes for reliable CSS targeting */}
                            <option value="New">New</option>
                            <option value="Returning">Returning</option>
                        </select>
                    </label>

                    {/* Contact */}
                    <div className="form-grid">
                        <Field label="Name" required><input className={inputBase} value={form.name}
                                                            onChange={e => set('name', e.target.value)}
                                                            autoComplete="name"/></Field>
                        <Field label="Email" required><input className={inputBase} type="email" value={form.email}
                                                             onChange={e => set('email', e.target.value)}
                                                             autoComplete="email" inputMode="email"/></Field>
                        <Field label="Phone"><input className={inputBase} value={form.phone}
                                                    onChange={e => set('phone', e.target.value)} inputMode="tel"
                                                    autoComplete="tel"/></Field>
                        <Field label="Placement"><input className={inputBase} value={form.placement}
                                                        onChange={e => set('placement', e.target.value)}
                                                        placeholder="e.g., left forearm"/></Field>
                    </div>

                    <hr className="section-divider"/>

                    {/* Date (calendar) */}
                    <label className="field">
                        <span className="field-label">Preferred date <span className="text-white/60">*</span></span>
                        <Calendar valueISO={form.appointment_date} onChange={(iso) => set('appointment_date', iso)}/>
                    </label>

                    {/* Artist */}
                    <fieldset className="fieldset fieldset--spacious">
                        <legend className="fieldset-legend">Artist</legend>
                        <label className="inline-flex cursor-pointer items-center gap-2 text-white/90 mb-2">
                            <input type="checkbox" className="h-4 w-4 accent-[var(--cta-bg)]"
                                   checked={form.first_available}
                                   onChange={e => set('first_available', e.target.checked)}/>
                            First available
                        </label>
                        <div className="chips">
                            {ARTISTS.map(a => {
                                const active = !form.first_available && form.preferred_artist === a;
                                return (
                                    <Chip
                                        key={a}
                                        label={a}
                                        active={active}
                                        disabled={form.first_available}
                                        onClick={() => set('preferred_artist', active ? '' : a)}
                                    />
                                );
                            })}
                        </div>
                    </fieldset>

                    {/* Styles (includes “Piercing”) */}
                    <fieldset className="fieldset fieldset--spacious">
                        <legend className="fieldset-legend">Styles</legend>
                        <div className="chips">
                            {STYLES.map(s => {
                                const on = form.preferred_style.includes(s);
                                return (
                                    <Chip
                                        key={s}
                                        label={s}
                                        active={on}
                                        onClick={() =>
                                            set('preferred_style', on ? form.preferred_style.filter(v => v !== s) : [...form.preferred_style, s])
                                        }
                                    />
                                );
                            })}
                        </div>
                    </fieldset>

                    {/* Message */}
                    <label className="field">
                        <span className="field-label">Describe your idea <span className="text-white/60">*</span></span>
                        <textarea className={`${inputBase} min-h-[140px]`} value={form.message}
                                  onChange={e => set('message', e.target.value)}
                                  placeholder="Size, placement, references…" maxLength={1200}/>
                    </label>

                    {/* Uploader */}
                    <section className="field">
                        <span className="field-label">Upload reference images (optional)</span>
                        <div ref={dropRef} onDrop={onDrop} className="uploader">
                            <div className="uploader-inner">
                                <input id="file" type="file" accept="image/*" multiple className="hidden"
                                       onChange={(e) => e.target.files && handleFiles(e.target.files)}/>
                                <Pressable as="label" htmlFor="file" className="btn-ghost">Browse files</Pressable>
                                <p className="text-xs text-white/80">…or drag &amp; drop images here (up to 8). You can
                                    also paste screenshots.</p>
                            </div>
                            {!!form.images.length && (
                                <ul className="thumbs">
                                    {form.images.map((src, i) => (
                                        <li key={i} className="thumb">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={src} alt={`Reference ${i + 1}`} className="thumb-img"/>
                                            <Pressable as="button" type="button" onClick={() => removeImage(i)}
                                                       className="thumb-remove">Remove</Pressable>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="footer-actions">
                        <Pressable as="a" href="tel:+16022093099" className="btn-ghost btn-ghost--solid">Call the
                            shop</Pressable>
                        <Pressable as="button" type="submit" className="btn-primary" disabled={busy}>
                            {busy ? 'Submitting…' : 'Submit request'}
                        </Pressable>
                    </div>
                </div>
            </form>
        </div>
    );
}

/* ---------------- Subcomponents ---------------- */
function Field({label, required, children, className = ''}) {
    return (
        <label className={`field ${className}`}>
            <span className="field-label">{label}{required && <span className="text-white/60"> *</span>}</span>
            {children}
        </label>
    );
}

function Chip({label, active, onClick, disabled}) {
    return (
        <Pressable
            as="button"
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={[
                'rounded-full px-[var(--chip-pad-x)] py-[var(--chip-pad-y)] text-sm select-none',
                disabled
                    ? 'cursor-not-allowed border border-[var(--hairline)] text-white/35'
                    : active
                        ? 'chip-selected'
                        : 'border border-[var(--hairline)] text-white/90 hover:border-white/50 hover:text-white',
            ].join(' ')}
        >
            {label}
        </Pressable>
    );
}
