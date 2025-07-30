'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {motion} from 'framer-motion';

const artists = [
  {
    name: 'Joe',
    role: 'Black and Grey Realism',
      image: '/images/artists/joe/joe_portrait.webp',
    bio: 'Joe specializes in black and grey realism with fine detail and depth.',
    portfolio: '/artists/joe',
  },
  {
    name: 'Micky',
    role: 'Cyber Sigilism',
      image: '/images/artists/mickey/mickey_portrait.webp',
    bio: 'Micky brings a futuristic flair to her cyber sigilism tattoos, combining symbols with modern style.',
    portfolio: '/artists/mickey',
  },
  {
    name: 'T-Money',
    role: 'Anime Tattoos',
      image: '/images/artists/t/t_portait.webp',
    bio: 'T-Money brings your favorite anime characters to life with precision and flair.',
    portfolio: '/artists/t',
  },
  {
    name: 'Mia',
    role: 'Linework & Black and Grey',
      image: '/images/artists/mia/mia_portrait.webp',
    bio: 'Mia focuses on clean linework and subtle black and grey shading for timeless designs.',
    portfolio: '/artists/mia',
  },
  {
    name: 'Ki',
    role: 'Neo Traditional / Floral / Color',
      image: '/images/artists/ki/ki_portrait.webp',
    bio: 'Ki does it all – from vibrant florals to detailed neo-traditional color pieces.',
    portfolio: '/artists/ki',
  },
  {
    name: 'Axel',
    role: 'Piercer',
      image: '/images/artists/axel/axel_portrait.webp',
    bio: 'Axel is our studio piercer, known for a gentle approach and precise placement.',
    portfolio: '/artists/axel',
  },
  {
    name: 'Dallon Oracle',
    role: 'Apprentice',
      image: '/images/artists/dallon/dallon_portrait.webp',
    bio: 'Dallon Oracle is a new apprentice passionate about learning japanese and neo-traditional styles.',
    portfolio: '/artists/dallon',
  },
];

export default function TeamSection() {
    const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 600);
      handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section
      style={{
        width: '100%',
          padding: isMobile ? '48px 1rem 36px' : '72px 3rem 56px',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          boxSizing: 'border-box',
          overflowX: 'hidden',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
        <h2
          style={{
            fontFamily: 'Sancreek, cursive',
            fontSize: isMobile ? '32px' : '48px',
              color: '#e4938a',
            textTransform: 'uppercase',
            letterSpacing: '1px',
              marginBottom: '12px',
          }}
        >
          Meet Our Team
        </h2>
        <p
          style={{
            fontFamily: 'Lora, serif',
            fontSize: '16px',
              color: '#EDEAE2',
            margin: 0,
              lineHeight: 1.5,
              maxWidth: '600px',
              marginInline: 'auto',
          }}
        >
          Artists with passion, precision, and personality. Click their cards to view their work.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '24px',
        }}
      >
        {artists.map((artist) => (
          <Link
            href={artist.portfolio}
            key={artist.name}
            style={{ textDecoration: 'none', width: '100%', maxWidth: '320px' }}
          >
            <motion.div
                whileHover={{scale: 1.03}}
                transition={{type: 'spring', stiffness: 200, damping: 18}}
              style={cardStyle}
            >
                {!isMobile && (
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
    background: 'rgba(28,31,26,0.95)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  cursor: 'pointer',
    boxSizing: 'border-box',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
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
