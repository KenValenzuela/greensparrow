'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ArtistPage() {
  const slug = 'axel'; // ✅ Artist folder name and slug

  // ✅ Set portrait file name (must be in slug folder, not /work)
    const portraitFilename = 'axel_portrait.webp';

  // ✅ List all portfolio work image filenames (inside /work/)
  const workImages = [
      'axel_1.webp', 'axel_2.webp', 'axel_3.webp',
      'axel_4.webp', 'axel_5.webp', 'axel_6.webp',
      'axel_7.webp', 'axel_9.webp', 'axel_10.webp',
      'axel_11.webp', 'axel_15.webp', 'axel_12.webp',
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
              alt={`${slug} portrait`}
              style={styles.portrait}
          />
          <div style={styles.creditInline}>
            Photo © RINDSTUDIO — Instagram @rindstudio | TikTok @officialrindstudio
          </div>
          <h1 style={styles.name}>Axel</h1>
          <p style={styles.title}>Piercing Specialist</p>
          <div style={styles.tags}>
            {['Piercing', 'Ear Curations', 'Implant-Grade Jewelry'].map((tag) => (
                <span key={tag} style={styles.tag}>{tag}</span>
            ))}
          </div>
          <p style={styles.bio}>
            Axel is the in-house award-winning piercer at Green Sparrow Tattoo Co., with over two years of experience. He's passionate
            about every aspect of the craft—from quality implant-grade jewelry to helping clients plan beautiful,
            long-term ear curation projects. Axel focuses on creating a safe, clean, and empowering experience for each
            client, always prioritizing education, comfort, and aesthetic vision.
          </p>
          <Link
              href="https://www.instagram.com/piercingsbyaxel/"
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
              <div
                  key={idx}
              style={styles.gridItemWrapper}
              data-aos="fade-up"
              data-aos-delay={idx * 50}
            >
              <img
                src={`/images/artists/${slug}/work/${file}`}
                alt={`Work ${idx + 1}`}
                style={styles.gridItem}
                loading="lazy"
              />

            </div>
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
  gridItemWrapper: {
    position: 'relative',        // enable overlay positioning
    overflow: 'hidden',          // ensure overlay stays within bounds
    borderRadius: '6px'          // match child border radius
  },
  gridItem: {
    width: '100%',
    aspectRatio: '1 / 1',
    objectFit: 'cover',
    borderRadius: '6px',
    transition: 'transform 0.3s ease',
    willChange: 'transform'
  },
  creditOverlay: {
    position: 'absolute',        // overlay atop the image
    bottom: '4px',
    left: '4px',
    right: '4px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    fontSize: '0.65rem',
    padding: '2px 4px',
    borderRadius: '4px',
    textAlign: 'center',
    lineHeight: 1.2,
    pointerEvents: 'none'        // allow clicks through to image if needed
  }
};
