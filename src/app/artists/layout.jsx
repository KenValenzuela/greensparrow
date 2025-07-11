'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { artists } from '@/lib/artists';

export default function ArtistsLayout({ children }) {
  const path = usePathname() || '';
  const segments = path.split('/').filter(Boolean);
  const slug = segments[1]; // the current artist slug

  const idx = artists.findIndex((a) => a.slug === slug);
  const showNav = idx >= 0;

  const prev = showNav
    ? artists[(idx - 1 + artists.length) % artists.length]
    : null;
  const next = showNav
    ? artists[(idx + 1) % artists.length]
    : null;

  return (
    <>
      {children}

      {showNav && (
        <nav
          style={{
            position: 'fixed',           // keep on screen during scroll
            top: '50%',                  // vertical center
            left: '16px',                // distance from left edge
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',     // stack arrows vertically
            alignItems: 'flex-start',
            gap: '24px',                 // space between items
            zIndex: 1000,                // above main content
          }}
        >
          <Link
            href={`/artists/${prev.slug}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#E5948B',          // pink text & arrows
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '1rem',
            }}
          >
            <span
              style={{
                fontSize: '1.5rem',    // larger arrow icon
                marginRight: '8px',
              }}
            >
              ←
            </span>
            {prev.name}
          </Link>

          <Link
            href="/artists"
            style={{
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
            <span
              style={{
                fontSize: '1.5rem',    // larger arrow icon
                marginLeft: '8px',
              }}
            >
              →
            </span>
          </Link>
        </nav>
      )}
    </>
  );
}
