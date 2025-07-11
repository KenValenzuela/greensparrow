'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, A11y } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const artists = [
  {
    name: 'Joe',
    role: 'Black and Grey Realism',
    image: '/images/artists/joe/joe_portrait.jpg',
    bio: 'Joe specializes in black and grey realism with fine detail and depth.',
    portfolio: '/artists/joe',
  },
  {
    name: 'Mickey',
    role: 'Cyber Sigilism',
    image: '/images/artists/mickey/mickey_portrait.PNG',
    bio: 'Mickey brings a futuristic flair to her cyber sigilism tattoos, combining symbols with modern style.',
    portfolio: '/artists/mickey',
  },
  {
    name: 'T-Money',
    role: 'Anime Tattoos',
    image: '/images/artists/t/t_portait.jpg',
    bio: 'T-Money brings your favorite anime characters to life with precision and flair.',
    portfolio: '/artists/t',
  },
  {
    name: 'Mia',
    role: 'Linework & Black and Grey',
    image: '/images/artists/mia/mia_portrait.jpg',
    bio: 'Mia focuses on clean linework and subtle black and grey shading for timeless designs.',
    portfolio: '/artists/mia',
  },
  {
    name: 'Ki',
    role: 'Neo Traditional / Floral / Color',
    image: '/images/artists/ki/ki_portrait.jpg',
    bio: 'Ki does it all – from vibrant florals to detailed neotraditional color pieces.',
    portfolio: '/artists/ki',
  },
  {
    name: 'Axel',
    role: 'Piercer',
    image: '/images/artists/axel/axel_portrait.jpeg',
    bio: 'Axel is our studio piercer, known for a gentle approach and precise placement.',
    portfolio: '/artists/axel',
  },
  {
    name: 'Dallon Oracle',
    role: 'Apprentice',
    image: '/images/artists/dallon/dallon_portrait.jpg',
    bio: 'Dallon Oracle is a new apprentice passionate about learning fine line and blackwork.',
    portfolio: '/artists/dallon',
  },
];

export default function TeamSection() {
  const [width, setWidth] = useState(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize(); // initial set
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (width === null) return null;

  const isMobile = width <= 600;
  const showImages = width > 600;

  return (
    <section
      style={{
        width: '100%',
        padding: isMobile ? '48px 0 36px' : '72px 0 56px',
        backgroundColor: 'rgba(126,82,24,0.61)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
        <h2
          style={{
            fontFamily: 'Sancreek, cursive',
            fontSize: isMobile ? '32px' : '48px',
            color: '#1c1f1a',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '8px',
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
          Artists with passion, precision, and personality. Click their cards to view their work.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', padding: '0 24px' }}>
        {artists.map((artist) => (
          <Link href={artist.portfolio} key={artist.name} style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
              style={cardStyle}
            >
              {showImages && (
                <div style={imageContainerStyle}>
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    width={320}
                    height={260}
                    loading="lazy"
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                      borderRadius: '12px',
                    }}
                  />
                </div>
              )}

              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '12px 0 4px', color: '#FAF8EE' }}>
                {artist.name}
              </h3>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#ffffff', marginBottom: 8 }}>
                {artist.role}
              </p>
              <p style={{ fontSize: 13, lineHeight: 1.4, color: '#E6E6E6', textAlign: 'center' }}>
                {artist.bio}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}

const cardStyle = {
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
  background: 'rgb(28,31,26)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
};

const imageContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '260px',
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: '#000',
  flexShrink: 0,
};
