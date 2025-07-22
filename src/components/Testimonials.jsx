'use client';

import {useEffect, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';

const reviews = [
  {
    author: 'E M',
    text: "Ki is so talented! She freehanded two of my tattoos (large and detailed!) straight from her brain and I get complimented on them everywhere I go! She does a great job, has amazing skills, is knowledgeable, super clean and sanitary, and has great energy!! 10/10 recommend :)!",
      photos: ['/images/reviews/em-2.webp', '/images/reviews/em-1.webp'],
  },
  {
    author: 'Cinthya Tizoc',
    text: "My tattoo artist did a great job. She was transparent about the price and even went out of her ways to make my designs even more beautiful. She provided me with many design options. Overall it was an amazing experience. I highly recommend this tattoo shop. Great vibes.",
    photos: [],
  },
  // Add more reviews as needed
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const charIndexRef = useRef(0);
  const intervalRef = useRef(null);
  const currentReview = reviews[index] ?? {}; // prevent undefined errors

  useEffect(() => {
    if (!currentReview?.text) return;
    setDisplayedText('');
    setTypingDone(false);
    charIndexRef.current = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const nextChar = currentReview.text[charIndexRef.current];
      if (nextChar) {
        setDisplayedText((prev) => prev + nextChar);
        charIndexRef.current += 1;
      } else {
        clearInterval(intervalRef.current);
        setTypingDone(true);
      }
    }, 30);

    return () => clearInterval(intervalRef.current);
  }, [index]);

  useEffect(() => {
    if (!typingDone) return;
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 2500);
    return () => clearTimeout(timer);
  }, [typingDone]);

  return (
    <section
      style={{
          backgroundImage: "linear-gradient(rgba(30,26,23,0.92), rgba(30,26,23,0.92)), url('/images/background.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '5rem 1.5rem',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <h2
        style={{
          fontFamily: 'Sancreek, cursive',
          fontSize: '2.5rem',
            color: '#e39289',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '2rem',
        }}
      >
        Testimonials
      </h2>

      <div
        style={{
  maxWidth: '768px',
  margin: '0 auto',
  textAlign: 'center',
  background: 'rgba(25, 35, 30, 0.55)', // semi-transparent dark
  backdropFilter: 'blur(10px)',         // glass blur
  WebkitBackdropFilter: 'blur(10px)',   // Safari support
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
  padding: '2rem',
  borderRadius: '12px',
  minHeight: '340px',
  maxHeight: '400px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%' }}
          >
            <p
              style={{
                fontSize: '1.125rem',
                lineHeight: '1.75rem',
                fontWeight: '300',
                color: '#dadada',
                marginBottom: '0.75rem',
                maxWidth: '100%',
              }}
            >
              “{displayedText}
              <span
                style={{
                  display: 'inline-block',
                  width: '1ch',
                  animation: 'blink 1s steps(2, start) infinite',
                }}
              >
                |
              </span>
              ”
            </p>
            <p
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#dadada',
                marginBottom: '1.5rem',
              }}
            >
              – {currentReview?.author || ''}
            </p>

            {currentReview?.photos?.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  gap: '1rem',
                }}
              >
                {currentReview.photos.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Review photo ${i + 1}`}
                    style={{
                      maxWidth: '120px',
                      height: '120px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }

          @media (max-width: 600px) {
            img {
              max-width: 100px !important;
            }
          }
        `}
      </style>
    </section>
  );
}
