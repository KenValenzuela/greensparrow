// lib/logEventSafe.js
export function logEventSafe(name, payload = {}) {
    try {
        const body = JSON.stringify({name, ...payload});
        if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/log-event', new Blob([body], {type: 'application/json'}));
        } else {
            fetch('/api/log-event', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body,
                keepalive: true
            })
                .catch(() => {
                });
        }
    } catch {
    }
}
