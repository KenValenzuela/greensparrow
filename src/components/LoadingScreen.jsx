'use client';

import {useEffect, useMemo, useState} from 'react';
import {Toaster} from 'react-hot-toast';
import {usePathname} from 'next/navigation';
import {AnimatePresence, motion} from 'framer-motion';
import Image from 'next/image';
import useTypewriter from '@/hooks/useTypewriter';

const loadingImages = [
  '/images/loading/axel_piercing.webp',
  '/images/loading/jjk-leg-sleeve-t.webp',
  '/images/loading/chameleon.webp',
  '/images/loading/joe-flower.webp',
  '/images/loading/fox-ki.webp',
];

const CARD_W = 192;
const CARD_H = 288;
const cardSpacing = 224;
const duration = 500;

export default function LoadingScreen({ children }) {
  const pathname = usePathname();
  const initialSkip = useMemo(() => pathname !== '/', [pathname]);
  const [skip, setSkip] = useState(initialSkip);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (pathname !== '/') {
      setSkip(true);
      return;
    }
    if (sessionStorage.getItem('seenLoader')) setSkip(true);
    else sessionStorage.setItem('seenLoader', 'true');
  }, [mounted, pathname]);

  const [phase, setPhase] = useState('loading');
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [showTyped, setShowTyped] = useState(false);

  const [vw, setVw] = useState(0);
  useEffect(() => {
    if (!mounted) return;
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [mounted]);
  const isMobile = vw > 0 && vw < 640;

  const typed = useTypewriter(showTyped ? 'ART IS FOOD. WE FEED THE HUNGRY.' : '', 40);

  useEffect(() => {
    if (!mounted || skip) return;
    const t0 = performance.now();
    let id;
    const raf = now => {
      const pct = Math.min(((now - t0) / duration) * 100, 100);
      setProgress(pct);
      if (pct < 100) id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(id);
  }, [mounted, skip]);

  useEffect(() => {
    if (!mounted || skip) return;
    const timers = [];
    const push = (fn, ms) => timers.push(setTimeout(fn, ms));
    if (isMobile) {
      push(() => {
        setPhase('welcome');
        setShowTyped(true);
      }, duration);
      push(() => setPhase('exit'), duration + 2000);
      push(() => setLoaded(true), duration + 3000);
    } else {
      push(() => setPhase('stack'), duration);
      push(() => setPhase('explode'), duration + 1500);
      push(() => {
        setPhase('welcome');
        setShowTyped(true);
      }, duration + 3000);
      push(() => setPhase('exit'), duration + 5000);
      push(() => setLoaded(true), duration + 6000);
    }
    return () => timers.forEach(clearTimeout);
  }, [mounted, skip, isMobile]);

  const meta = useMemo(() => {
    const center = Math.floor(loadingImages.length / 2);
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
      <AnimatePresence mode="wait">
        {mounted && !skip && phase !== 'exit' && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{duration: 0.8}}
            className="fixed inset-0 z-50 text-[#F1EDE0]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-black/20">
              <motion.div
                  animate={{width: `${progress}%`, opacity: phase === 'welcome' ? 0 : 1}}
                  transition={{duration: 0.25}}
                className="h-full bg-desert-rose"
              />
            </div>

            <div className="w-screen h-screen flex items-center justify-center px-4 text-center">
              {phase === 'welcome' ? (
                  <p className="text-lg sm:text-xl font-sancreek typewriter-blink">{typed}</p>
              ) : isMobile ? (
                  <p className="text-sm font-sancreek">Loading… {Math.floor(progress)}%</p>
              ) : (
                  <div className="w-full max-w-xl">
                    <div className="relative w-full h-[18rem]">
                      {meta.map(({src, i, spreadX, angle, radius, center}) => {
                        const anim =
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
                                animate={anim}
                                transition={{delay: i * 0.08, duration: 0.5, type: 'spring'}}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                     w-[12rem] h-[18rem] overflow-hidden rounded shadow-md
                                     border border-bone/10 bg-sparrow-gray/20"
                            >
                              <Image
                                  src={src}
                                  alt={`Flash artwork ${i + 1}`}
                                  width={CARD_W}
                                  height={CARD_H}
                                  quality={60}
                                  placeholder="empty"
                                  style={{objectFit: 'cover'}}
                              />
                            </motion.div>
                        );
                      })}
                    </div>
                    <p className="mt-6 text-lg sm:text-xl font-sancreek">
                      Loading… {Math.floor(progress)}%
                    </p>
                  </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{opacity: loaded || skip ? 1 : 0}}
        transition={{duration: 0.8}}
        className={loaded || skip ? 'opacity-100' : 'pointer-events-none'}
      >
        {children}
      </motion.div>

      <Toaster position="top-center"/>

      <style jsx>{`
        .font-sancreek {
          font-family: 'Sancreek', cursive;
        }

        @keyframes blink {
          0%, 100% {
            opacity: 1
          }
          50% {
            opacity: 0
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
