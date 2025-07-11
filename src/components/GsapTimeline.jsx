'use client';
import { useLayoutEffect } from 'react';
import { useReducedMotion } from '@/lib/hooks';

/**
 * Central adaptor: pass a builder `(gsap, ScrollTrigger)=>tl`
 * Cleans up on unmount.
 */
export default function GsapTimeline({ build }) {
  const prefersReduced = useReducedMotion();

  useLayoutEffect(() => {
    if (prefersReduced) return;

    let ctx;
    (async () => {
      const gsap = (await import('gsap')).default;
      const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => build(gsap, ScrollTrigger));
    })();

    return () => ctx?.revert();
  }, [build, prefersReduced]);

  return null;
}
