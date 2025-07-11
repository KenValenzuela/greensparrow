'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { artists } from '../lib/artists';

export default function ArtistNav() {
  // get last segment as slug
  const path = usePathname();                       // e.g. "/artists/joe"
  const slug = path.split('/').filter(Boolean).pop();

  const idx  = artists.findIndex((a) => a.slug === slug);
  if (idx === -1) return null;                      // not on an artist page

  const prev = artists[(idx - 1 + artists.length) % artists.length];
  const next = artists[(idx + 1) % artists.length];

  return (
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

      <style jsx>{`
        .artist-nav {
          display: flex;
          justify-content: space-between;
          margin: 3rem 0 1rem;
        }
        .nav-link {
          color: #E5948B;
          font-weight: 600;
          text-decoration: none;
          font-size: 1rem;
        }
      `}</style>
    </nav>
  );
}
