'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { artists } from '@/lib/artists';

export default function ArtistsLayout({ children }) {
  const path = usePathname() || '';
  const segments = path.split('/').filter(Boolean);
  const slug = segments[1];

  const idx = artists.findIndex((a) => a.slug === slug);
  const showNav = idx >= 0;

  const prev = showNav
    ? artists[(idx - 1 + artists.length) % artists.length]
    : null;
  const next = showNav
    ? artists[(idx + 1) % artists.length]
    : null;

  return (
    <div className="layout">
      <main className="content">
        {children}
      </main>

      {showNav && (
        <aside className="artist-nav">
          <Link href={`/artists/${prev.slug}`} className="nav-link">
            <span className="arrow">←</span> {prev.name}
          </Link>

          <Link href="/artists" className="nav-link center-link">
            Back to Team
          </Link>

          <Link href={`/artists/${next.slug}`} className="nav-link">
            {next.name} <span className="arrow">→</span>
          </Link>
        </aside>
      )}

      <style jsx>{`
        .layout {
          display: flex;
          flex-direction: column;
        }

        /* Desktop: nav on left, content on right */
        @media (min-width: 768px) {
          .layout {
            flex-direction: row;
          }
          .artist-nav {
            display: flex;
            flex: 0 0 200px;
            margin-right: 24px;
            flex-direction: column;
            gap: 16px;
          }
          .content {
            flex: 1;
          }
        }

        /* Mobile: nav below content, horizontal */
        @media (max-width: 767px) {
          .artist-nav {
            display: flex;
            justify-content: space-between;
            padding: 12px;
            margin-top: 16px;  /* push nav below content */
          }
        }

        

        .nav-link {
          color: #E5948B;
          font-weight: 600;
          text-decoration: none;
          font-size: 1rem;
          display: flex;
          align-items: center;
        }

        .arrow {
          font-size: 1.25rem;
        }

        .center-link {
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
