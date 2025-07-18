'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function EventsPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      !document.querySelector('script[src="https://www.instagram.com/embed.js"]')
    ) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

    const flyerImages = ['1.webp', '2.webp', '3.webp', '4.webp'];
  const artistLinks = [
    { name: 'Joe', url: 'https://www.instagram.com/joseffdubbe_tattoo/' },
    { name: 'Mickey', url: 'https://www.instagram.com/cyber_dreamcore/' },
    { name: 'T', url: 'https://www.instagram.com/_.t._money/' },
    { name: 'Mia', url: 'https://www.instagram.com/miachristattoo/' },
    { name: 'Ki', url: 'https://www.instagram.com/parksart._/' },
    { name: 'Axel', url: 'https://www.instagram.com/piercingsbyaxel/' },
    { name: 'Toasted Bean Coffee', url: 'https://www.instagram.com/toastedbeancoffeetruck/' },
    { name: 'Zen by Zanaya', url: 'https://www.instagram.com/zenbyzanaya/' },
  ];

  // match the same dimness as AboutSection: rgba alpha 0.92
  const backgroundStyle = {
    backgroundColor: '#1e1a17',
    backgroundImage:
        "linear-gradient(rgba(30,26,23,0.92), rgba(30,26,23,0.92)), url('/images/background.webp')",
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    padding: '64px 16px',
    color: '#F1EDE0',
    minHeight: '100vh',
    boxSizing: 'border-box',
  };

  return (
    <main style={backgroundStyle}>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          fontFamily: 'Sancreek, cursive',
          color: '#E4938A',
          marginBottom: '2rem',
        }}
      >
        July Flash Event
      </motion.h1>

      <section
        style={{
          maxWidth: '980px',
          margin: '0 auto 48px',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          style={{
            height: isMobile ? 'auto' : '70vh',
            maxHeight: '900px',
            minHeight: '640px',
          }}
        >
          {flyerImages.map((img, i) => (
            <SwiperSlide key={i}>
              <img
                src={`/events/${img}`}
                alt={`Flash flyer ${i + 1}`}
                style={{
                  width: '100%',
                  height: isMobile ? 'auto' : '100%',
                  objectFit: 'contain',
                  cursor: 'pointer',
                }}
                onClick={() => setModalImage(`/events/${img}`)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: '1.5rem',
            marginBottom: '16px',
            fontFamily: 'Lora, serif',
            color: '#F1EDE0',
          }}
        >
          Follow the Artists & Vendors
        </h2>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
            fontFamily: 'Lora, serif',
          }}
        >
          {artistLinks.map(({ name, url }) => (
            <li key={name}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#e1d5c1', textDecoration: 'underline' }}
              >
                @{url.split('/').filter(Boolean).pop()}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <AnimatePresence>
        {modalImage && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalImage(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 9999,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0, 0, 0, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              cursor: 'zoom-out',
            }}
          >
            <img
              src={modalImage}
              alt="Full Flyer"
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
