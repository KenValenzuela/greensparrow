'use client';

import {useEffect, useState} from 'react';
import {motion} from 'framer-motion';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => {
            const diff = +new Date('2025-07-26T12:00:00') - Date.now();
            if (diff <= 0) {
                setTimeLeft({days: '00', hours: '00', minutes: '00', seconds: '00'});
                clearInterval(timer);
                return;
            }
            const fmt = (n) => String(n).padStart(2, '0');
            setTimeLeft({
                days: fmt(Math.floor(diff / 1000 / 60 / 60 / 24)),
                hours: fmt(Math.floor((diff / 1000 / 60 / 60) % 24)),
                minutes: fmt(Math.floor((diff / 1000 / 60) % 60)),
                seconds: fmt(Math.floor((diff / 1000) % 60)),
            });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
          padding: '2rem 1.25rem',
        backgroundImage:
            "linear-gradient(rgba(30,26,23,0.92), rgba(30,26,23,0.92)), url('/images/background.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        style={{
            backgroundColor: 'rgba(44,32,22,0.85)',
            padding: '2.5rem',
            borderRadius: '16px',
          textAlign: 'center',
            maxWidth: '600px',
          width: '100%',
        }}
      >
        <motion.h1
            initial={{opacity: 0, y: 20}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: '2.5rem',
            fontFamily: 'Sancreek, cursive',
            color: '#e4938a',
            textTransform: 'uppercase',
              letterSpacing: '1.5px',
            marginBottom: '0.75rem',
          }}
        >
          Bikinis, Babe!
        </motion.h1>

        <motion.p
            initial={{opacity: 0, y: 20}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
              fontSize: '1.125rem',
            fontFamily: 'Lora, serif',
            color: '#f1ede0',
            marginBottom: '1.5rem',
          }}
        >
          Join us July 26th • 12–6PM for flash tattoos, piercings, tooth gems, coffee & more!
        </motion.p>

        <motion.div
            initial={{opacity: 0, y: 20}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            padding: '16px 0',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              marginBottom: '1.5rem',
          }}
        >
          {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
            <div key={unit} style={{ color: '#f1ede0' }}>
              <div
                style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                suppressHydrationWarning
              >
                {mounted ? timeLeft[unit] : '00'}
              </div>
                <div
                    style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        opacity: 0.8,
                    }}
                >
                {unit}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.a
          href="/events"
          style={{
            background: '#e4938a',
            color: '#2c2016',
            fontFamily: 'Lora, serif',
            fontWeight: 'bold',
            padding: '12px 24px',
              borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1rem',
            display: 'inline-block',
              marginBottom: '1.25rem',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View Event Details
        </motion.a>

        <motion.p
            initial={{opacity: 0, y: 20}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
              fontSize: '0.95rem',
            fontFamily: 'Lora, serif',
            color: '#f1ede0',
          }}
        >
            430 N Dobson Rd #109 Mesa, AZ<br/>
          Hosted by @greensparrowtattoo.co
        </motion.p>
      </div>

        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.65}}
            style={{
                position: 'absolute',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: 'Lora, serif',
                fontSize: '0.95rem',
                color: '#f1ede0',
                opacity: 0.85,
            }}
        >
            Scroll Down ↓
        </motion.div>
    </section>
  );
}
