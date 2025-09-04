// components/Spinner.jsx
export default function Spinner({size = 16}) {
    return (
        <span style={{
            width: size, height: size, border: '2px solid rgba(255,255,255,0.25)',
            borderTopColor: '#F1EDE0', borderRadius: '50%', display: 'inline-block',
            animation: 'spin 0.8s linear infinite', verticalAlign: 'text-bottom'
        }}/>
    );
}

// components/AlertBanner.jsx
export function AlertBanner({kind = 'error', title, message}) {
    const bg = kind === 'success' ? 'rgba(42,143,92,0.18)' : 'rgba(185,38,38,0.18)';
    const br = kind === 'success' ? '1px solid rgba(42,143,92,0.45)' : '1px solid rgba(185,38,38,0.45)';
    return (
        <div role="status"
             style={{background: bg, border: br, borderRadius: 10, padding: '0.75rem 1rem', margin: '0.75rem 0'}}>
            <strong style={{display: 'block', marginBottom: 4}}>{title}</strong>
            {message && <div style={{opacity: 0.9}}>{message}</div>}
        </div>
    );
}
