// app/booking/success/page.jsx  (no "use client")
import {use} from 'react';

export default function BookingSuccess({searchParams}) {
    const params = use(searchParams);               // 👈 unwrap
    const raw = params?.id;
    const id = Array.isArray(raw) ? raw[0] : (raw ?? null);

    return (
        <main style={{
            minHeight: '100vh',
            padding: '3rem 1rem',
            display: 'grid',
            placeItems: 'center',
            background: '#0d0d0d',
            color: '#F1EDE0'
        }}>
            <div style={{
                maxWidth: 720,
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '2rem'
            }}>
                <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1rem'}}>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 999,
                        background: '#2a8f5c',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 700
                    }}>✓
                    </div>
                    <h1 style={{margin: 0, fontFamily: 'Lora,serif', fontSize: '1.8rem'}}>Booking request received</h1>
                </div>

                {id && (
                    <div style={{
                        margin: '1rem 0',
                        padding: '0.75rem 1rem',
                        border: '1px dashed rgba(255,255,255,0.18)',
                        borderRadius: 10,
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo'
                    }}>
                        Reference ID: <strong>{id}</strong>
                    </div>
                )}

                <p style={{opacity: 0.9, marginTop: 0}}>
                    Thanks! We emailed the shop. You’ll get a reply to confirm details and time.
                </p>

                <div style={{display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: '1rem'}}>
                    <a href="/booking" style={btnOutline()}>Make another request</a>
                    <a href="tel:+16022093099" style={btnGhost()}>Call the shop!</a>
                    <a href="/" style={btnGhost()}>Back to home</a>
                </div>
            </div>
        </main>
    );
}

function btnOutline() {
    return {
        padding: '0.75rem 1rem',
        border: '1px solid #2a8f5c',
        borderRadius: 10,
        textDecoration: 'none',
        color: '#F1EDE0',
        background: 'transparent'
    };
}

function btnGhost() {
    return {
        padding: '0.75rem 1rem',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 10,
        textDecoration: 'none',
        color: '#F1EDE0',
        background: 'transparent'
    };
}
