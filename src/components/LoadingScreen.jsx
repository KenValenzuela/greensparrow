'use client';

import {useEffect, useMemo, useState} from 'react';
import {usePathname} from 'next/navigation';
import {AnimatePresence, motion} from 'framer-motion';
import useTypewriter from '@/hooks/useTypewriter';

const loadingImages = [
  '/images/loading/axel_piercing.webp',
  '/images/loading/jjk-leg-sleeve-t.webp',
  '/images/loading/chameleon.webp',
  '/images/loading/joe-flower.webp',
  '/images/loading/fox-ki.webp',
];

const stackedCards = loadingImages.length;
const cardSpacing = 224;
const loadingDuration = 4_000;            // ms

export default function LoadingScreen({ children }) {
  const pathname = usePathname();

  /* ── State ───────────────────────────────────────── */
  const [isMobile, setIsMobile] = useState(false); // always false for SSR → no mismatch
  const [phase, setPhase] = useState('loading');
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [showTyped, setShowTyped] = useState(false);
  const [skip, setSkip] = useState(false);

  /* ── Device check (runs only on client) ──────────── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check, {passive: true});
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Skip if user already saw loader ─────────────── */
  useEffect(() => {
    const seen = sessionStorage.getItem('seenLoader');
    const showLoader = pathname === '/' && !seen;
    if (showLoader) sessionStorage.setItem('seenLoader', 'true');
    else {
      setSkip(true);
      setLoaded(true);
    }
  }, [pathname]);

  /* ── Progress bar ─────────────────────────────────  */
  useEffect(() => {
    if (skip) return;
    const start = performance.now();
    const tick = now => {
      const pct = Math.min(((now - start) / loadingDuration) * 100, 100);
      setProgress(Math.floor(pct));
      if (pct < 100) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [skip]);

  /* ── Phase timeline ──────────────────────────────── */
  useEffect(() => {
    if (skip) return;
    const timers = [];
    const add = (fn, ms) => timers.push(setTimeout(fn, ms));

    if (isMobile) {
      add(() => {
        setPhase('welcome');
        setShowTyped(true);
      }, loadingDuration);
      add(() => setPhase('exit'), loadingDuration + 2_000);
      add(() => setLoaded(true), loadingDuration + 3_000);
    } else {
      add(() => setPhase('stack'), loadingDuration);
      add(() => setPhase('explode'), loadingDuration + 1_500);
      add(() => {
        setPhase('welcome');
        setShowTyped(true);
      }, loadingDuration + 3_000);
      add(() => setPhase('exit'), loadingDuration + 5_000);
      add(() => setLoaded(true), loadingDuration + 6_000);
    }
    return () => timers.forEach(clearTimeout);
  }, [skip, isMobile]);

  const typed = useTypewriter(
      showTyped ? 'ART IS FOOD. WE FEED THE HUNGRY.' : '',
      40
  );

  /* ── Pre‑compute card geometry ───────────────────── */
  const cardMeta = useMemo(() => {
    const center = Math.floor(stackedCards / 2);
    const angleSpread = Math.PI / 1.5;
    const radius = 500;
    return loadingImages.map((src, i) => {
      const spreadX = (i - center) * cardSpacing;
      const angle = ((i - center) / center) * (angleSpread / 2) - Math.PI / 2;
      return {src, i, spreadX, angle, radius, center};
    });
  }, []);

  return (
    <div className="relative">
      {/* ── LOADER ───────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {!skip && phase !== 'exit' && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{duration: 0.8}}
            className="fixed inset-0 z-50 text-[#F1EDE0]"
          >
            {/* progress bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-black/20">
              <motion.div
                  animate={{width: `${progress}%`, opacity: phase === 'welcome' ? 0 : 1}}
                  transition={{duration: 0.25}}
                className="h-full bg-desert-rose"
              />
            </div>

            {/* body (single root keeps SSR ↔ CSR identical) */}
            <div className="w-screen h-screen flex items-center justify-center px-4 text-center">
              <div className="loader-inner w-full">
                {phase === 'welcome' ? (
                    <p className="text-lg sm:text-xl font-sancreek typewriter-blink">
                      {typed}
                    </p>
                ) : isMobile ? (
                    <p className="text-sm font-sancreek">Loading… {progress}%</p>
                ) : (
                    <div className="text-center w-full max-w-xl">
                      <div className="relative w-full h-[18rem]">
                        {cardMeta.map(({src, i, spreadX, angle, radius, center}) => {
                          const animateProps =
                              phase === 'explode'
                                  ? {
                                    x: Math.cos(angle) * radius,
                                    y: Math.sin(angle) * radius,
                                    rotate: angle * (180 / Math.PI),
                                    scale: 1.2,
                                    opacity: 0,
                                  }
                                  : {
                                    x: phase === 'stack' ? 0 : spreadX,
                                    y: phase === 'stack' ? i * 2 : 0,
                                    rotate: (i - center) * 5,
                                    scale: 1,
                                    opacity: 1,
                                  };
                          return (
                              <motion.div
                                  key={src}
                                  initial={{y: -100, opacity: 0}}
                                  animate={animateProps}
                                  transition={{delay: i * 0.08, duration: 0.5, type: 'spring'}}
                                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                       w-[12rem] h-[18rem] overflow-hidden rounded shadow-md
                                       border border-bone/10 bg-sparrow-gray/20"
                              >
                                <img
                                    src={src}
                                    alt={`Flash artwork ${i + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="eager"
                                    decoding="async"
                                />
                              </motion.div>
                          );
                        })}
                      </div>
                      <p className="mt-6 text-lg sm:text-xl font-sancreek">
                        Loading… {progress}%
                      </p>
                    </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── APP CONTENT ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{duration: 0.8}}
        className={loaded ? 'opacity-100' : 'pointer-events-none'}
      >
        {children}
      </motion.div>

      {/* ── Styles ───────────────────────────────────── */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Sancreek&display=swap');

        .font-sancreek {
          font-family: 'Sancreek', cursive;
        }

        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .typewriter-blink::after {
          content: '|';
          margin-left: 4px;
          animation: blink 1s step-start infinite;
        }
      `}</style>
    </div>
  );
}
