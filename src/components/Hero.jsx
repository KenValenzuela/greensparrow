'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen sm:h-[85vh] overflow-hidden bg-[#1e1a17]"
    >
      {/* Image fills entire section */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/wooden-birds.png"
          alt="Wooden birds over textured background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Fallback color if image fails */}
      <div className="absolute inset-0 bg-[#1e1a17] opacity-90 z-[-1]" />
    </section>
  );
}
