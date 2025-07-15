// app/(admin)/page.jsx              ← replaces the entire file
'use client';

import {useEffect, useState} from 'react';
import {createClient} from '@supabase/supabase-js';
import {format} from 'date-fns';
import {Bar, Line, Pie} from 'react-chartjs-2';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(
    CategoryScale, LinearScale, ArcElement,
    BarElement, PointElement, LineElement,
    Tooltip, Legend,
);

/* ───────────────────────────────
   Supabase public client (anon)
   ─────────────────────────────── */
const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function AdminDashboard() {
  /* ───────── state ───────── */
  const [authed, setAuthed] = useState(false);
  const [load, setLoad] = useState(true);
  const [book, setBook] = useState([]);
  const [ev, setEv] = useState([]);
  const [edit, setEdit] = useState(null);          // edit booking modal
  const [compose, setCompose] = useState(null);          // email compose modal

  /* ───────── auth cookie ─── */
  useEffect(() => {
    setAuthed(document.cookie.includes('admin_auth='));
  }, []);

  /* ───────── login form ──── */
  async function login(e) {
    e.preventDefault();
    const r = await fetch('/api/login-admin', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({password: e.target.password.value}),
    });
    r.ok ? setAuthed(true) : alert('Wrong password');
  }

  /* ───────── fetch data ──── */
  useEffect(() => {
    if (!authed) return;

    (async () => {
      setLoad(true);
      const { data: bData } = await supa
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: eData } = await supa
        .from('booking_events')
        .select('*')
        .order('created_at', { ascending: false });

      setBook(bData || []);
      setEv(eData || []);
      setLoad(false);
    })();
  }, [authed]);

  /* ───────── mutate booking ─ */
  async function patch(id, changes) {
    const r = await fetch('/api/admin/update-booking', {
      method : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ id, changes }),
    });
    if (!r.ok) return alert('Update failed');
    setBook((b) => b.map((x) => (x.id === id ? { ...x, ...changes } : x)));
  }

  /* ───────── send email ───── */
  async function sendEmail({id, subject, message}) {
    const r = await fetch('/api/admin/send-email', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id, subject, message}),
    });
    if (!r.ok) return alert('Email failed');
    alert('Email sent');
    setCompose(null);
  }

  /* ───────── chart helpers ─ */
  const weekly = (() => {
    const map = {};
    book.forEach((b) => {
      const key = format(new Date(b.created_at), 'yyyy-ww');
      map[key] = (map[key] || 0) + 1;
    });
    return {
      labels   : Object.keys(map),
      datasets : [{ label: 'Bookings', data: Object.values(map), backgroundColor: '#e4938a' }],
    };
  })();

  const bySrc = (() => {
    const map = {};
    ev.filter((x) => x.event_name === 'booking_submitted')
        .forEach((e) => {
          map[e.source || 'Other'] = (map[e.source || 'Other'] || 0) + 1;
        });
    return {
      labels   : Object.keys(map),
      datasets : [{ data: Object.values(map), backgroundColor: ['#e4938a','#9ad0f5','#bada55','#e8b562'] }],
    };
  })();

  const byStyle = (() => {
    const map = {};
    book.forEach((b) => (b.preferred_style || [])
        .forEach((s) => {
          map[s] = (map[s] || 0) + 1;
        }));
    return {
      labels   : Object.keys(map),
      datasets : [{ label: 'Count', data: Object.values(map), backgroundColor: '#9ad0f5' }],
    };
  })();

  /* ───────── render ──────── */
  if (!authed) {
    return (
      <Section>
        <Panel>
          <h2 style={H}>Admin Access</h2>
          <form onSubmit={login}>
            <input name="password" type="password" style={I} />
            <button style={Btn}>Enter</button>
          </form>
        </Panel>
      </Section>
    );
  }

  if (load) return <Section><p style={T}>Loading…</p></Section>;

  return (
    <Section>
      <Panel>
        <h1 style={H}>Dashboard</h1>

        {/* KPI cards */}
        <div style={CardWrap}>
          <Card n={book.length} label="Bookings" />
          <Card n={ev.length}   label="Events" />
        </div>

        {/* Charts */}
        <div style={Charts}>
          <Chart><Line data={weekly} /></Chart>
          <Chart><Pie  data={bySrc}  /></Chart>
          <Chart><Bar  data={byStyle}/></Chart>
        </div>

        {/* Booking table */}
        <h2 style={Sub}>Bookings</h2>
        <table style={Table}>
          <thead>
            <tr>
              <th>Name</th><th>Artist</th><th>Status</th><th>Date</th><th colSpan={2}/>
            </tr>
          </thead>
          <tbody>
            {book.map((b) => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>{b.preferred_artist || '—'}</td>
                <td>{b.status}</td>
                <td>{format(new Date(b.appointment_date), 'MMM dd')}</td>
                <td><button onClick={() => setEdit(b)}>✏️</button></td>
                <td>
                  <button onClick={() => setCompose({...b, subject: 'Booking Update', message: ''})}>📧</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit modal */}
        {edit && (
          <Modal>
            <div style={ModalIn}>
              <h3>Edit Booking</h3>
              <label>
                Status{' '}
                <select
                  value={edit.status}
                  onChange={(e) => setEdit({ ...edit, status: e.target.value })}
                >
                  {['Pending', 'Confirmed', 'Follow-up Sent', 'Completed', 'Cancelled']
                      .map((s) => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label>
                Date{' '}
                <input
                  type="date"
                  value={format(new Date(edit.appointment_date), 'yyyy-MM-dd')}
                  onChange={(e) => setEdit({ ...edit, appointment_date: e.target.value })}
                />
              </label>
              <button
                  onClick={() => patch(edit.id, {
                    status: edit.status,
                    appointment_date: edit.appointment_date,
                  })}
                  style={Btn}
              >
                Save
              </button>
              <button onClick={() => setEdit(null)} style={Btn}>Cancel</button>
            </div>
          </Modal>
        )}

        {/* Compose-email modal */}
        {compose && (
            <Modal>
              <div style={ModalIn}>
                <h3>Send Email to {compose.name}</h3>
                <label>
                  Subject{' '}
                  <input
                      style={{...I, border: '1px solid #ccc'}}
                      value={compose.subject}
                      onChange={(e) => setCompose({...compose, subject: e.target.value})}
                  />
                </label>
                <label>
                  Message{' '}
                  <textarea
                      rows={6}
                      style={{...I, border: '1px solid #ccc', resize: 'vertical'}}
                      value={compose.message}
                      onChange={(e) => setCompose({...compose, message: e.target.value})}
                  />
                </label>
                <button
                    onClick={() => sendEmail({
                      id: compose.id,
                      subject: compose.subject,
                      message: compose.message,
                    })}
                    style={Btn}
                >
                  Send
                </button>
                <button onClick={() => setCompose(null)} style={Btn}>Cancel</button>
              </div>
            </Modal>
        )}
      </Panel>
    </Section>
  );
}

/* ───────── styling helpers (unchanged) ─ */
const Section = (p) => (
  <section
    style={{
      minHeight: '100vh',
      padding: '4rem 1rem',
      display: 'flex',
      justifyContent: 'center',
      backgroundImage:
        'linear-gradient(rgba(44,32,22,.95),rgba(44,32,22,.95)),url("/images/background.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
    {...p}
  />
);
const Panel = (p) => (
  <div
    style={{
      maxWidth: 1200,
      width: '100%',
      background: '#2C2016D9',
      padding: 32,
      borderRadius: 16,
      color: '#f1ede0',
      fontFamily: 'Lora,serif',
    }}
    {...p}
  />
);
const H    = { fontSize: '2rem', fontFamily: 'Sancreek,cursive', color: '#e4938a' };
const Sub  = { fontSize: '1.25rem', margin: '2rem 0 .5rem' };
const T    = { color: '#f1ede0' };
const I    = { width: '100%', padding: 8, borderRadius: 8, margin: '8px 0', border: 'none' };
const Btn  = { padding: '8px 16px', borderRadius: 8, margin: 4, background: '#e4938a', border: 'none', cursor: 'pointer' };
const Table     = { width: '100%', borderCollapse: 'collapse' };
const CardWrap  = { display: 'flex', gap: 16 };
const Charts    = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24, margin: '2rem 0' };
const Chart     = (p) => <div style={{ background: '#3b2a1e', padding: 16, borderRadius: 8 }} {...p} />;
const Card      = ({ n, label }) => (
  <div style={{ flex: 1, background: '#3b2a1e', padding: 16, borderRadius: 8, textAlign: 'center' }}>
    <strong style={{ fontSize: '1.5rem' }}>{n}</strong><br />{label}
  </div>
);
const Modal = (p) => (
  <div
    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    {...p}
  />
);
const ModalIn = {background: '#fff', color: '#000', padding: 24, borderRadius: 8, minWidth: 320};
