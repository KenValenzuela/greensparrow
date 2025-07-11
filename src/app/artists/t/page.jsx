'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ArtistPage() {
  const slug = 't'; // ✅ Artist folder name and slug

  // ✅ Portrait file (must be in slug folder)
  const portraitFilename = 't_portait.jpg';

  // ✅ Portfolio images (inside /work/)
  const workImages = [
    't_1.jpeg', 't_2.jpeg', 't_3.jpeg', 't_4.jpeg', 't_5.jpeg', 't_6.jpeg',
    't_7.jpeg', 't_8.jpeg', 't_9.jpeg', 't_10.jpeg', 't_11.jpeg', 't_12.jpeg',
    't_13.jpeg', 't_14.jpeg', 't_15.jpeg', 't_16.jpeg', 't_17.jpeg', 't_18.jpeg',
  ];

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.overlay} />
      <div style={styles.page}>
        {/* Header / Bio */}
        <div style={styles.profile}>
          <img
            src={`/images/artists/${slug}/${portraitFilename}`}
            alt={`${slug}-portrait`}
            style={styles.portrait}
          />
          <h1 style={styles.name}>T-Money</h1>
          <p style={styles.title}>Tattoo Artist</p>
          <div style={styles.tags}>
            {['Anime', 'Fine Line', 'Character Work'].map((tag) => (
              <span key={tag} style={styles.tag}>{tag}</span>
            ))}
          </div>
          <p style={styles.bio}>
            T-Money is a Phoenix-born tattoo artist with a background in academic fine art and a love for anime-inspired design. They hold an Associate’s in Art and a Bachelor’s in Studio Art, which inform their precise, clean linework and thoughtful compositions. T specializes in anime tattoos, fine line work, and portrait-based designs—bringing personality, detail, and storytelling into every piece.
          </p>
          <Link
            href="https://www.instagram.com/_.t._money/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.cta}
          >
            View More on Instagram
          </Link>
        </div>

        {/* Portfolio Grid */}
        <div style={styles.grid}>
          {workImages.map((file, idx) => (
            <img
              key={idx}
              src={`/images/artists/${slug}/work/${file}`}
              alt={`Work ${idx + 1}`}
              style={styles.gridItem}
              loading="lazy"
              data-aos="fade-up"
              data-aos-delay={idx * 50}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    backgroundImage: "url('/images/background.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    minHeight: '100vh',
    padding: '2rem 1rem'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(10,10,10,0.88)',
    zIndex: 0
  },
  page: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    color: '#F1EDE0',
    gap: '2rem'
  },
  profile: {
    textAlign: 'center',
    padding: '1rem'
  },
  portrait: {
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #F1EDE0',
    width: '220px',
    height: '220px',
    marginBottom: '1rem'
  },
  name: {
    fontFamily: 'Sancreek, serif',
    fontSize: '2.4rem',
    marginBottom: '0.25rem'
  },
  title: {
    fontSize: '1.1rem',
    color: '#dadada',
    marginBottom: '1rem'
  },
  tags: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  tag: {
    background: '#7e5218',
    padding: '0.4rem 0.85rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    color: '#eee'
  },
  bio: {
    fontSize: '1rem',
    lineHeight: 1.6,
    margin: '1rem 0'
  },
  cta: {
    display: 'inline-block',
    marginTop: '1rem',
    padding: '0.6rem 1.25rem',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    backgroundColor: 'rgba(76,175,96,0.67)',
    color: '#111',
    borderRadius: '6px',
    textDecoration: 'none'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1rem',
    padding: '1rem'
  },
  gridItem: {
    width: '100%',
    aspectRatio: '1 / 1',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #333',
    transition: 'transform 0.3s ease',
    willChange: 'transform'
  }
};
