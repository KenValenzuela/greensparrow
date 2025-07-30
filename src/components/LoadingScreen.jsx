'use client';

import {useEffect, useState} from 'react';
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
const loadingDuration = 4000;

export default function LoadingScreen({ children }) {
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(false);
  const [phase, setPhase] = useState('loading');
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [showTyped, setShowTyped] = useState(false);
  const [skip, setSkip] = useState(false);

  // Set device type on load
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Skip logic
  useEffect(() => {
    const seen = typeof window !== 'undefined' && sessionStorage.getItem('seenLoader');
    const shouldShow = pathname === '/' && !seen;

    if (shouldShow) {
      sessionStorage.setItem('seenLoader', 'true');
    } else {
      setSkip(true);
      setLoaded(true);
    }
  }, [pathname]);

  // Progress bar update
  useEffect(() => {
    if (skip) return;
    let rafId;
    const start = performance.now();

    const update = (now) => {
      const pct = Math.min((now - start) / loadingDuration, 1);
      setProgress(Math.floor(pct * 100));
      if (pct < 1) rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [skip]);

  // Phase transitions
  useEffect(() => {
    if (skip) return;

    if (isMobile) {
      const t1 = setTimeout(() => {
        setPhase('welcome');
        setShowTyped(true);
      }, loadingDuration);
      const t2 = setTimeout(() => setPhase('exit'), loadingDuration + 2000);
      const t3 = setTimeout(() => setLoaded(true), loadingDuration + 3000);
      return () => [t1, t2, t3].forEach(clearTimeout);
    } else {
      const t1 = setTimeout(() => setPhase('stack'), loadingDuration);
      const t2 = setTimeout(() => setPhase('explode'), loadingDuration + 1500);
      const t3 = setTimeout(() => {
        setPhase('welcome');
        setShowTyped(true);
      }, loadingDuration + 3000);
      const t4 = setTimeout(() => setPhase('exit'), loadingDuration + 5000);
      const t5 = setTimeout(() => setLoaded(true), loadingDuration + 6000);
      return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
    }
  }, [skip, isMobile]);

  const typed = useTypewriter(showTyped ? 'ART IS FOOD. WE FEED THE HUNGRY.' : '', 40);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!skip && phase !== 'exit' && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,

              backgroundSize: 'cover',
              backgroundRepeat: 'repeat',
              backgroundPosition: 'center top',
              color: '#F1EDE0',
            }}
          >
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-black/20 overflow-hidden">
              <motion.div
                animate={{
                  width: `${progress}%`,
                  opacity: phase === 'welcome' ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="h-full bg-desert-rose"
              />
            </div>

            {/* Loader Body */}
            <div className="w-screen h-screen flex items-center justify-center px-4 text-center">
              {phase === 'welcome' ? (
                <p className="text-lg sm:text-xl font-sancreek typewriter-blink">{typed}</p>
              ) : !isMobile ? (
                <div className="text-center w-full max-w-xl">
                  <div className="relative w-full h-[18rem]">
                    {loadingImages.map((src, i) => {
                      const center = Math.floor(stackedCards / 2);
                      const spreadX = (i - center) * cardSpacing;
                      const angleSpread = Math.PI / 1.5;
                      const angle = ((i - center) / center) * (angleSpread / 2) - Math.PI / 2;
                      const radius = 500;

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
                          initial={{ y: -100, opacity: 0 }}
                          animate={animateProps}
                          transition={{
                            delay: i * 0.1,
                            duration: 0.6,
                            type: 'spring',
                          }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                     w-[12rem] h-[18rem] overflow-hidden rounded shadow-md
                                     border border-bone/10 bg-sparrow-gray/20"
                        >
                          <img
                            src={src}
                            alt={`Flash artwork ${i + 1}`}
                            className="w-full h-full object-cover"
                            loading="eager"
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                  <p className="mt-6 text-lg sm:text-xl font-sancreek">
                    Loading... {progress}%
                  </p>
                </div>
              ) : (
                <p className="text-sm font-sancreek">Loading... {progress}%</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dev Buttons */}


      {/* Reveal App Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 1 }}
        className={loaded ? 'opacity-100' : 'pointer-events-none'}
      >
        {children}
      </motion.div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Sancreek&display=swap');

        .font-sancreek {
          font-family: 'Sancreek', cursive;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .typewriter-blink::after {
          content: '|';
          animation: blink 1s step-start infinite;
          margin-left: 4px;
        }
      `}</style>
    </div>
  );
}
