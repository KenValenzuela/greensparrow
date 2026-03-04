'use client';

import {useEffect} from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ArtistPage() {
  const slug = 'river';

  const portraitFilename = 'river_portrait.webp';

  const workImages = [
    'river_1.webp',
    'river_2.webp',
    'river_3.webp',
    'river_4.webp',
    'river_5.webp',
    'river_6.webp',
    'river_7.webp',
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
          <h1 style={styles.name}>River</h1>
          <p style={styles.title}>Tattoo Artist</p>
          <div style={styles.tags}>
            {['Fine Line', 'Hyper-Realism', 'Geometric', 'Dot Work', 'Asian Traditions'].map((tag) => (
              <span key={tag} style={styles.tag}>{tag}</span>
            ))}
          </div>
          <p style={styles.bio}>
            River is from the province of Yunnan Kunming in China. Prior to the US, he also lived in Thailand. A lifelong illustrator and painter who adapted his artistic skill to the medium of tattooing. He refers to his work as Needle Therapy — a collaboration with the client of his craft realizing their vision. Ultimately, adorning the body with a form of permanent artistic and personal expression to share our stories. He specializes in fine line, hyper-realism, as well as geometric and dot work. His original work explores themes of cosmology especially, the intersection of nature, mysticism, and science and religion. While adept at any style, he is also very familiar with many Asian tattoo traditions.
          </p>
          <Link
            href="https://www.instagram.com/inkriver.daniel/"
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
