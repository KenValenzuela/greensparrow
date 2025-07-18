// ensureTurn.js

let turnReady;

export default async function ensureTurn() {
    if (typeof window === 'undefined') return;

    if (turnReady) return turnReady;

    turnReady = (async () => {
        if (!window.$) {
            const jq = (await import('jquery')).default;
            window.$ = window.jQuery = jq;
        }

        if (!window.$.fn.turn && !window.$.fn.turnjs) {
            await import('@ksedline/turnjs');

            // alias fallback
            if (window.$.fn.turnjs && !window.$.fn.turn) {
                window.$.fn.turn = window.$.fn.turnjs;
            }
        }
    })();

    return turnReady;
}
