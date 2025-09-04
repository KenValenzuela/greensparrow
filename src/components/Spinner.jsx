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