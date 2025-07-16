'use client';

import {useEffect, useState} from 'react';
import {createClient} from '@supabase/supabase-js';
import {format} from 'date-fns';
import {Bar, Line} from 'react-chartjs-2';
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

const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [load, setLoad] = useState(true);

  const [book, setBook] = useState([]);
  const [ev, setEv] = useState([]);
  const [met, setMet] = useState([]);

  const [kpi, setKpi] = useState({today: 0, prev: 0});
  const [edit, setEdit] = useState(null);
  const [compose, setCompose] = useState(null);

  useEffect(() => {
    setAuthed(document.cookie.includes('admin_auth='));
  }, []);

  async function login(e) {
    e.preventDefault();
    const r = await fetch('/api/login-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({password: e.target.password.value}),
    });
    r.ok ? setAuthed(true) : alert('Wrong password');
  }

  useEffect(() => {
    if (!authed) return;

    (async () => {
      setLoad(true);
      const {data: b} = await supa.from('bookings').select('*').order('created_at', {ascending: false});
      const {data: e} = await supa.from('booking_events').select('*').order('created_at', {ascending: false});
      const {data: m} = await supa.from('admin_metrics').select('*').order('day', {ascending: true}).limit(30);

      const todayStr = new Date().toISOString().slice(0, 10);
      const yestStr = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
      const todayRow = m?.find(r => r.day === todayStr);
      const yRow = m?.find(r => r.day === yestStr);

      setBook(b || []);
      setEv(e || []);
      setMet(m || []);
      setKpi({
        today: todayRow?.data?.new_bookings ?? 0,
        prev: yRow?.data?.new_bookings ?? 0,
      });
      setLoad(false);
    })();
  }, [authed]);

  useEffect(() => {
    if (!authed) return;
    const ch = supa.channel('events')
        .on('postgres_changes', {event: 'INSERT', schema: 'public', table: 'booking_events'},
            ({new: row}) => setEv(ev => [row, ...ev])
        )
        .subscribe();
    return () => supa.removeChannel(ch);
  }, [authed]);

  async function patch(id, changes) {
    const r = await fetch('/api/admin/update-booking', {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id, changes}),
    });
    if (!r.ok) return alert('Update failed');
    setBook(b => b.map(x => x.id === id ? {...x, ...changes} : x));
  }

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

  const spark = (() => {
    const lbl = met.map(r => r.day.slice(5));
    const pts = met.map(r => r.data.new_bookings ?? 0);
    return {
      labels: lbl,
      datasets: [{data: pts, borderColor: '#e4938a', tension: 0.4, fill: false}],
    };
  })();

  const byStyle = (() => {
    const map = {};
    book.forEach(b => (b.preferred_style || []).forEach(s => {
      map[s] = (map[s] || 0) + 1;
    }));
    return {
      labels: Object.keys(map),
      datasets: [{label: 'Count', data: Object.values(map), backgroundColor: '#9ad0f5'}],
    };
  })();

  const funnelCounts = (name) => ev.filter(e => e.event_name === name).length;

  const Empty = ({icon = '📭', title = 'No data', hint = ''}) => (
      <div style={{
        textAlign: 'center', padding: '3rem 0',
        border: '2px dashed #555', borderRadius: 12,
        color: '#aaa', fontFamily: 'Lora,serif',
      }}>
        <div style={{fontSize: '2rem'}}>{icon}</div>
        <h4 style={{margin: '1rem 0 .25rem'}}>{title}</h4>
        {hint && <small>{hint}</small>}
      </div>
  );

  if (!authed) {
    return (
      <Section>
        <Panel>
          <h2 style={H}>Admin Access</h2>
          <form onSubmit={login}>
            <input name="password" type="password" style={I}/>
            <button style={Btn}>Enter</button>
          </form>
        </Panel>
      </Section>
    );
  }

  if (load) return <Section><p style={T}>Loading…</p></Section>;

  const delta = kpi.prev === 0 ? '—' : `${((kpi.today - kpi.prev) / kpi.prev * 100).toFixed(0)}%`;

  return (
    <Section>
      <Panel>
        <h1 style={H}>Dashboard</h1>

        <div style={CardWrap}>
          <Card n={book.length} label="Total bookings"/>
          <Card n={kpi.today} label={`Bookings today (${delta})`}/>
          <Card n={ev.length} label="Total events"/>
        </div>

        <h2 style={Sub}>Bookings – last 30 days</h2>
        <Chart><Line data={spark} options={{
          plugins: {legend: {display: false}}, scales: {y: {beginAtZero: true}},
        }}/></Chart>

        <h2 style={Sub}>Popular styles</h2>
        {book.length === 0
            ? <Empty title="No style data yet"/>
            : <Chart><Bar data={byStyle}/></Chart>}

        <h2 style={Sub}>Form Funnel</h2>
        {ev.length === 0 ? <Empty title="No usage data yet"/> : (
            <div style={{display: 'flex', gap: 16}}>
              <Card n={funnelCounts('form_opened')} label="Form Opened"/>
              <Card n={funnelCounts('upload_started')} label="Upload Started"/>
              <Card n={funnelCounts('booking_submitted')} label="Submitted"/>
              <Card n={funnelCounts('manual_email')} label="Follow-ups"/>
            </div>
        )}

        <h2 style={Sub}>Live events</h2>
        {ev.length === 0
            ? <Empty title="No events yet" hint="Events appear here in real-time."/>
            : (
                <ul style={{
                  maxHeight: 260, overflowY: 'auto',
                  background: '#3b2a1e', padding: 12, borderRadius: 8,
                  fontSize: '.9rem',
                }}>
                  {ev.slice(0, 50).map(e => (
                      <li key={e.id} style={{margin: '4px 0'}}>
                        <strong>{format(new Date(e.created_at), 'HH:mm')}</strong>{' '}
                        {e.event_name}
                      </li>
                  ))}
                </ul>
            )}

        <h2 style={Sub}>Bookings</h2>
        {book.length === 0 ? (
            <Empty title="No bookings yet" hint="Share your booking form to start collecting leads."/>
        ) : (
            <table style={Table}>
              <thead>
              <tr>
                <th>Name</th>
                <th>Artist</th>
                <th>Status</th>
                <th>Date</th>
                <th colSpan={2}/>
              </tr>
              </thead>
              <tbody>
              {book.map(b => (
                  <tr key={b.id}>
                    <td>{b.name}</td>
                    <td>{b.preferred_artist || '—'}</td>
                    <td>{b.status}</td>
                    <td>{b.appointment_date
                        ? format(new Date(b.appointment_date), 'MMM dd')
                        : '—'}
                    </td>
                    <td>
                      <button onClick={() => setEdit(b)}>✏️</button>
                    </td>
                    <td>
                      <button onClick={() => setCompose({...b, subject: 'Booking Update', message: ''})}>📧</button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}

        {edit && (
          <Modal>
            <div style={ModalIn}>
              <h3>Edit Booking</h3>
              <label>Status
                <select value={edit.status}
                        onChange={e => setEdit({...edit, status: e.target.value})}>
                  {['Pending', 'Confirmed', 'Follow-up Sent', 'Completed', 'Cancelled'].map(s => <option
                      key={s}>{s}</option>)}
                </select>
              </label>
              <label>Date
                <input type="date"
                       value={edit.appointment_date
                           ? format(new Date(edit.appointment_date), 'yyyy-MM-dd')
                           : ''}
                       onChange={e => setEdit({...edit, appointment_date: e.target.value})}/>
              </label>
              <button style={Btn} onClick={() => patch(edit.id, {
                status: edit.status,
                appointment_date: edit.appointment_date,
              })}>Save
              </button>
              <button style={Btn} onClick={() => setEdit(null)}>Cancel</button>
            </div>
          </Modal>
        )}

        {compose && (
            <Modal>
              <div style={ModalIn}>
                <h3>Email to {compose.name}</h3>
                <label>Subject
                  <input style={{...I, border: '1px solid #ccc'}}
                         value={compose.subject}
                         onChange={e => setCompose({...compose, subject: e.target.value})}/>
                </label>
                <label>Message
                  <textarea rows={6}
                            style={{...I, border: '1px solid #ccc', resize: 'vertical'}}
                            value={compose.message}
                            onChange={e => setCompose({...compose, message: e.target.value})}/>
                </label>
                <button style={Btn} onClick={() => sendEmail({
                  id: compose.id,
                  subject: compose.subject,
                  message: compose.message,
                })}>Send
                </button>
                <button style={Btn} onClick={() => setCompose(null)}>Cancel</button>
              </div>
            </Modal>
        )}
      </Panel>
    </Section>
  );
}

/* ───────── styling helpers ───────── */
const Section = p => (
    <section style={{
      minHeight: '100vh',
      padding: '4rem 1rem',
      display: 'flex',
      justifyContent: 'center',
      backgroundImage: 'linear-gradient(rgba(44,32,22,.95),rgba(44,32,22,.95)),url("/images/background.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }} {...p} />
);
const Panel = p => (
    <div style={{
      maxWidth: 1200, width: '100%',
      background: '#2C2016D9',
      padding: 32, borderRadius: 16,
      color: '#f1ede0', fontFamily: 'Lora,serif',
    }} {...p} />
);
const H = {fontSize: '2rem', fontFamily: 'Sancreek,cursive', color: '#e4938a'};
const Sub = {fontSize: '1.25rem', margin: '2rem 0 .5rem'};
const T = {color: '#f1ede0'};
const I = {width: '100%', padding: 8, borderRadius: 8, margin: '8px 0', border: 'none'};
const Btn = {padding: '8px 16px', borderRadius: 8, margin: 4, background: '#e4938a', border: 'none', cursor: 'pointer'};
const Table = {width: '100%', borderCollapse: 'collapse'};
const CardWrap = {display: 'flex', gap: 16, flexWrap: 'wrap'};
const Chart = p => <div style={{background: '#3b2a1e', padding: 16, borderRadius: 8}} {...p} />;
const Card = ({n, label}) => (
    <div style={{
      flex: '1 1 160px', background: '#3b2a1e', padding: 16,
      borderRadius: 8, textAlign: 'center',
    }}>
      <strong style={{fontSize: '1.5rem'}}>{n}</strong><br/>{label}
  </div>
);
const Modal = p => (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} {...p} />
);
const ModalIn = {
  background: '#fff', color: '#000', padding: 24,
  borderRadius: 8, minWidth: 320
};
