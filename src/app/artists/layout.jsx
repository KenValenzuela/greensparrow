'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { artists } from '@/lib/artists';

export default function ArtistsLayout({ children }) {
  const path = usePathname() || '';
  const segments = path.split('/').filter(Boolean);
  const slug = segments[1]; // the current artist slug

  // --- begin responsive width state ---
  const [width, setWidth] = useState(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize(); // initial set
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (width === null) {
    // avoid rendering until width is known
    return null;
  }
  const isMobile = width <= 767;
  // --- end responsive width state ---

  const idx = artists.findIndex((a) => a.slug === slug);
  const showNav = idx >= 0;

  const prev = showNav
    ? artists[(idx - 1 + artists.length) % artists.length]
    : null;
  const next = showNav
    ? artists[(idx + 1) % artists.length]
    : null;

  // base nav style
  const baseNavStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'row' : 'column', // horizontal on mobile, vertical on desktop
    justifyContent: isMobile ? 'space-between' : 'flex-start',
    alignItems: 'center',
    gap: isMobile ? '0' : '24px',
    padding: isMobile ? '12px' : '0',
    backgroundColor: isMobile ? 'transparent' : 'none',
    // color and typography inherited below per link
  };

  // desktop fixed positioning
  const desktopNavPosition = {
    position: isMobile ? 'relative' : 'fixed',
    top: isMobile ? 'auto' : '50%',
    left: isMobile ? 'auto' : '16px',
    transform: isMobile ? 'none' : 'translateY(-50%)',
    zIndex: isMobile ? 'auto' : 1000,
  };

  // mobile margin to push below content
  const mobileMargin = isMobile
    ? { marginTop: '16px' }
    : {};

  return (
    <>
      {children}

      {showNav && (
        <nav
          style={{
            ...baseNavStyle,
            ...desktopNavPosition,
            ...mobileMargin,
          }}
        >
          <Link
            href={`/artists/${prev.slug}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#E5948B',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '1rem',
            }}
          >
            <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>←</span>
            {prev.name}
          </Link>

          <Link
            href="/artists"
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#E5948B',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '1rem',
            }}
          >
            Back to Team
          </Link>

          <Link
            href={`/artists/${next.slug}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#E5948B',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '1rem',
            }}
          >
            {next.name}
            <span style={{ fontSize: '1.5rem', marginLeft: '8px' }}>→</span>
          </Link>
        </nav>
      )}
    </>
  );
}
