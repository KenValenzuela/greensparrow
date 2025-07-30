'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {FiMenu, FiPhone, FiX} from 'react-icons/fi';
import {usePathname} from 'next/navigation';

const LINKS = [
  ['/about', 'About'],
  ['/artists', 'Artists'],
  ['/gallery', 'Gallery'],
  ['/faq', 'FAQ'],
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  /* sticky shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 90);
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* lock body scroll on menu open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled ? 'shadow' : ''}`}>
        <div className="inner">
          {/* left links */}
          <nav className="d-menu">
            {LINKS.slice(0, 2).map(([href, label]) => (
                <Link key={href} href={href} className={pathname === href ? 'active' : ''}>
                  {label}
              </Link>
            ))}
          </nav>

          {/* logo */}
          <div className="logo">
            <Link href="/" aria-label="Home">
              <img
                  src="/images/green-sparrow-transparent.webp"
                  alt="Green Sparrow Tattoo Co."
              />
            </Link>
          </div>

          {/* right links + CTA */}
          <nav className="d-menu right">
            {LINKS.slice(2).map(([href, label]) => (
                <Link key={href} href={href} className={pathname === href ? 'active' : ''}>
                  {label}
              </Link>
            ))}
            <Link href="/booking" className="cta">Book Now</Link>
          </nav>

          {/* mobile buttons */}
          <div className="m-actions">
            <a href="tel:+16022093099" aria-label="Call us">
              <FiPhone size={26}/>
            </a>
            <button
                className="burger"
              aria-label="Toggle menu"
                onClick={() => setOpen(o => !o)}
            >
              {open ? <FiX size={30}/> : <FiMenu size={30}/>}
            </button>
          </div>
        </div>

        {/* mobile drawer */}
        <nav className={`m-drawer ${open ? 'show' : ''}`}>
          {[...LINKS, ['/booking', 'Book Now']].map(([href, label]) => (
              <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={pathname === href ? 'active' : ''}
              >
                {label}
            </Link>
          ))}
        </nav>
      </header>

      <style jsx>{`
        :global(body) {
          margin: 0;
        }

        /* NAV BAR */
        .nav {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 118px; /* taller bar */
          background: #1b1b1b;
          color: #f1ede0;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .shadow {
          box-shadow: 0 3px 8px rgba(0, 0, 0, .35);
        }

        .inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.25rem;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* DESKTOP LINKS */
        .d-menu {
          display: flex;
          gap: 2rem;
        }

        .d-menu.right {
          align-items: center;
        }

        .d-menu a,
        .d-menu a:visited {
          font-family: 'Lora', serif;
          text-transform: uppercase;
          font-size: 17px; /* larger text */
          color: #f1ede0;
          text-decoration: none;
          position: relative;
          padding: 6px 0;
        }

        .d-menu a::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -5px;
          width: 100%;
          height: 2px;
          background: #e5948b;
          transform: scaleX(0);
          transition: transform .25s;
        }

        .d-menu a:hover::after,
        .d-menu a.active::after {
          transform: scaleX(1);
        }

        /* CALL‑TO‑ACTION */
        .cta,
        .cta:visited {
          background: #e5948b;
          color: #1b1b1b;
          padding: .65rem 1.6rem; /* bolder button */
          border-radius: 4px;
          font-family: 'Sancreek', cursive;
          font-size: 1.15rem;
          text-decoration: none;
        }

        /* LOGO */
        .logo img {
          height: 102px; /* bigger logo */
          transition: transform .25s;
        }

        .shadow .logo img {
          transform: scale(.88);
        }

        /* subtle shrink */

        /* MOBILE */
        .m-actions {
          display: none;
          align-items: center;
          gap: 1.2rem;
        }

        .burger {
          background: none;
          border: 0;
          color: #f1ede0;
          cursor: pointer;
        }

        .m-drawer {
          position: fixed;
          top: 118px;
          left: 0;
          right: 0;
          background: #0e0e0e;
          display: none;
          flex-direction: column;
          align-items: center;
          padding: 2rem 0;
          gap: 1.4rem;
        }

        .m-drawer.show {
          display: flex;
        }

        .m-drawer a,
        .m-drawer a:visited {
          color: #fff;
          font-family: 'Sancreek', cursive;
          font-size: 1.7rem;
          text-decoration: none;
        }

        @media (max-width: 900px) {
          .d-menu {
            display: none;
          }

          .m-actions {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}
