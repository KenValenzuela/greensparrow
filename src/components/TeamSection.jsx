'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, A11y } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const artists = [
  { name: 'Joe', role: 'Black and Grey Realism', image: '/images/artists/joe/joe_portrait.jpg', bio: 'Joe specializes in black and grey realism with fine detail and depth.', portfolio: '/artists/joe' },
  { name: 'Mickey', role: 'Cyber Sigilism', image: '/images/artists/mickey/mickey_portrait.PNG', bio: 'Mickey brings a futuristic flair to her cyber sigilism tattoos, combining symbols with modern style.', portfolio: '/artists/mickey' },
  { name: 'T-Money', role: 'Anime Tattoos', image: '/images/artists/t/t_portait.jpg', bio: 'T-Money brings your favorite anime characters to life with precision and flair.', portfolio: '/artists/t' },
  { name: 'Mia', role: 'Linework & Black and Grey', image: '/images/artists/mia/mia_portrait.jpg', bio: 'Mia focuses on clean linework and subtle black and grey shading for timeless designs.', portfolio: '/artists/mia' },
  { name: 'Ki ', role: 'Neo Traditional / Floral / Color', image: '/images/artists/ki/ki_portrait.jpg', bio: 'Ki does it all – from vibrant florals to detailed neotraditional color pieces.', portfolio: '/artists/ki' },
  { name: 'Axel', role: 'Piercer', image: '/images/artists/axel/axel_portrait.jpeg', bio: 'Axel is our studio piercer, known for a gentle approach and precise placement.', portfolio: '/artists/axel' },
  { name: 'Dallon Oracle', role: 'Apprentice', image: '/images/artists/dallon/dallon_portrait.jpg', bio: 'Dallon Oracle is a new apprentice passionate about learning fine line and blackwork.', portfolio: '/artists/dallon' },
];

export default function TeamSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsCompact(width < 480);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <style jsx global>{`
        @media (max-width: 480px) {
          .swiper-wrapper > .swiper-slide {
            width: 100% !important;
            max-width: 100% !important;
            flex-shrink: 0 !important;
          }
        }

        @media (max-width: 340px) {
          .artist-image {
            display: none !important;
          }
        }
      `}</style>

      <section
        style={{
          width: '100%',
          padding: isCompact ? '48px 0 36px' : '72px 0 56px',
          position: 'relative',
          backgroundColor: 'rgba(126,82,24,0.61)', // soft beige background
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: isCompact ? '32px' : '48px' }}>
          <h2
            style={{
              fontFamily: 'Sancreek, cursive',
              fontSize: isCompact ? '32px' : '48px',
              color: '#1c1f1a',
              letterSpacing: '1px',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
            Meet Our Team
          </h2>
          <p
            style={{
              fontFamily: 'Lora, serif',
              fontSize: '16px',
              color: '#ffffff',
              marginTop: '0',
              lineHeight: 1.4,
            }}
          >
            Artists with passion, precision, and personality ; Click on their cards below to look at their work!
          </p>
        </div>

        <div className="swiper-button-prev" style={{
          color: '#333',
          position: 'absolute',
          top: '50%',
          left: '16px',
          zIndex: 10,
          transform: 'translateY(-50%)',
          fontSize: '32px',
          cursor: 'pointer',
          userSelect: 'none',
        }} />
        <div className="swiper-button-next" style={{
          color: '#333',
          position: 'absolute',
          top: '50%',
          right: '16px',
          zIndex: 10,
          transform: 'translateY(-50%)',
          fontSize: '32px',
          cursor: 'pointer',
          userSelect: 'none',
        }} />

        <Swiper
          modules={[Autoplay, Navigation, Pagination, A11y]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
          pagination={{ clickable: true }}
          spaceBetween={isCompact ? 12 : 24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          style={{ padding: '0 2%' }}
        >
          {artists.map((artist) => (
            <SwiperSlide key={artist.name}>
              <Link href={artist.portfolio} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{
                    scale: isMobile ? 1 : 1.025,
                    rotateX: isMobile ? 0 : 2,
                    rotateY: isMobile ? 0 : -2,
                    boxShadow: '0 16px 32px rgba(0,0,0,0.25)',
                  }}
                  transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '16px',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '320px',
                    margin: '0 auto',
                    position: 'relative',
                    cursor: 'pointer',
                    perspective: '1000px',
                    boxSizing: 'border-box',
                    background: 'rgb(28,31,26)', // #1C1F1A with opacity
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <div className="artist-image" style={{
                    position: 'relative',
                    width: '100%',
                    height: isCompact ? '200px' : '260px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#000',
                  }}>
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 320px"
                      loading="lazy"
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'top',
                        borderRadius: '12px',
                      }}
                    />
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: '12px 0 4px', color: '#FAF8EE' }}>
                    {artist.name}
                  </h3>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#ffffff', marginBottom: 8 }}>
                    {artist.role}
                  </p>
                  <p style={{
                    fontSize: 13,
                    lineHeight: 1.4,
                    color: '#E6E6E6',
                    textAlign: 'center',
                    marginBottom: 8,
                  }}>
                    {artist.bio}
                  </p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: isMobile ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(231,112,112,0.55)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: 16,
                      pointerEvents: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    Go to Portfolio
                  </motion.div>
                </motion.div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          style={{
            marginTop: isCompact ? '48px' : '64px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            padding: '0 24px',
          }}
        >
          <h3 style={{
            fontFamily: 'Sancreek, cursive',
            fontSize: isCompact ? '24px' : '36px',
            color: '#1c1f1a',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            margin: 0,
          }}>
            Explore the Ink Behind the Names
          </h3>

          <p style={{
            fontFamily: 'Lora, serif',
            fontSize: '16px',
            color: '#ffffff',
            maxWidth: '480px',
            lineHeight: '1.6',
          }}>
            Dive deeper into each artist’s style, story, and favorite works. Find the one who speaks your vision.
          </p>

          <Link href="/gallery">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: '#E5948B',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 600,
                fontFamily: 'Lora, serif',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                transition: 'background-color 0.3s ease',
              }}
            >
              Checkout our gallery!
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </>
  );
}
