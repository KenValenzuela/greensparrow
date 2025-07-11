'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { artists } from '@/lib/artists';

export default function ArtistsLayout({ children }) {
  const path = usePathname() || '';
  const segments = path.split('/').filter(Boolean);
  // segments[0] === 'artists'
  const slug = segments[1];

  // only show nav when slug matches one of our artists
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
        <nav className="artist-nav">
          <Link href={`/artists/${prev.slug}`} className="nav-link">
            ← {prev.name}
          </Link>

          <Link href="/artists" className="nav-link">
            Back to Team
          </Link>

          <Link href={`/artists/${next.slug}`} className="nav-link">
            {next.name} →
          </Link>
        </nav>
      )}

      <style jsx>{`
        .artist-nav {
          display: flex;
          justify-content: space-between;
          max-width: 800px;
          margin: 3rem auto;
          padding: 0 1rem;
        }
        .nav-link {
          color: #e5948b;
          font-weight: 600;
          text-decoration: none;
          font-size: 1rem;
        }
      `}</style>
    </>
  );
}
