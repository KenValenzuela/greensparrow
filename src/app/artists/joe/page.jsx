'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ArtistPage() {
  const slug = 'joe'; // ✅ Artist folder name and slug

  // ✅ Set portrait file name (must be in slug folder, not /work)
    const portraitFilename = 'joe_portrait.webp'; // ← your portrait file here

  // ✅ List all portfolio work image filenames (inside /work/)
    const workImages = ['joe_1.webp', 'joe_2.webp', 'joe_3.webp', 'joe_4.webp', 'joe_5.webp', 'joe_6.webp', 'joe_7.webp', 'joe_8.webp', 'joe_9.webp', 'joe_10.webp'];

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
          <div style={styles.creditInline}>
            Photo © RINDSTUDIO — Instagram @rindstudio | TikTok @officialrindstudio
          </div>
          <h1 style={styles.name}>Joe</h1>
          <p style={styles.title}>Tattoo Artist</p>
          <div style={styles.tags}>
            {['Black & Grey', 'Realism', 'Portraits',].map((tag) => (
                <span key={tag} style={styles.tag}>{tag}</span>
            ))}
          </div>
          <p style={styles.bio}>
            Joe is a Mesa-based tattoo artist focusing primarily on black and gray realism. He aims to create a
            comfortable, easygoing environment where clients feel welcome, respected, and excited to return. Joe’s style
            combines precision with a laid-back vibe that helps clients feel at ease throughout the process.
          </p>
          <Link
              href="https://www.instagram.com/joseffdubbe_tattoo/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.cta}
          >
            View More on Instagram
          </Link>
        </div>

        {/* Grid */}
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
      backgroundImage: "url('/images/background.webp')",
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
