'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';

export default function Hero() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true });
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState({
    days: '--',
    hours: '--',
    minutes: '--',
    seconds: '--',
  });

  useEffect(() => {
    const updateCountdown = () => {
      const targetDate = new Date('2025-07-26T12:00:00');
      const now = new Date();
      const diff = Math.max(0, targetDate - now);

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  return (
    <section
      ref={sectionRef}
      style={{
        width: '100%',
        background: isMobile
          ? '#2c2016'
          : "url('/images/background.png') center/cover no-repeat",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 16px',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ scale: 1.05, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          background: 'rgba(44,32,22,0.85)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 12px 28px rgba(0,0,0,0.4)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '720px',
          width: '100%',
          color: '#fff',
          textAlign: 'center',
          backdropFilter: 'blur(6px)',
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: '2.75rem',
            fontFamily: 'Sancreek, cursive',
            color: '#e4938a',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '0.75rem',
          }}
        >
          Bikinis, Babe!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            fontSize: '1.1rem',
            fontFamily: 'Lora, serif',
            color: '#f1ede0',
            marginBottom: '1.5rem',
          }}
        >
          Join us July 26th • 12–6PM for flash tattoos, piercings, tooth gems, coffee & more!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            fontSize: '1.25rem',
            fontWeight: '600',
            fontFamily: 'monospace',
            background: 'rgba(255,255,255,0.05)',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            marginBottom: '2rem',
          }}
        >
          {Object.entries(timeLeft).map(([label, value]) => (
            <div key={label} style={{ textAlign: 'center', minWidth: '60px' }}>
              <div style={{ fontSize: '1.75rem' }}>{value}</div>
              <div
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: '#c6baa4',
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          onClick={() => router.push('/events')}
          style={{
            fontSize: '1rem',
            padding: '12px 24px',
            background: '#e4938a',
            color: '#1c140f',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontFamily: 'Lora, serif',
            letterSpacing: '1px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            marginBottom: '1.5rem',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => (e.target.style.background = '#ffaca4')}
          onMouseLeave={(e) => (e.target.style.background = '#e4938a')}
        >
          View Event Details
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          style={{
            fontSize: '0.95rem',
            color: '#f6f2e9',
            lineHeight: 1.6,
          }}
        >
           430 N Dobson Rd #109 Mesa, AZ
          <br />

        </motion.div>
      </motion.div>
    </section>
  );
}
