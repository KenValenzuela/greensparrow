import { useEffect, useState } from 'react';

/**
 * Smart loading progress hook
 * - fills over `duration`
 * - only completes if `isReady` is true
 * @param {boolean} isReady - whether the content is ready
 * @param {number} duration - total duration in ms
 */
export default function useProgressBar(isReady, duration = 3000) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf;
    const start = performance.now();

    function animate(now) {
      const elapsed = now - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(Math.floor(pct * 100));
      if (pct < 1 || !isReady) {
        raf = requestAnimationFrame(animate);
      } else {
        setProgress(100);
        setDone(true);
      }
    }

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isReady, duration]);

  return { progress, done };
}
