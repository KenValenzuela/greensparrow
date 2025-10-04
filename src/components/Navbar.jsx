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

  /* sticky shadow + blur */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* lock body scroll on menu open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  /* close drawer on route change */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="bar container">
          {/* LEFT: first two links (desktop only) */}
          <nav className="d-menu left">
            {LINKS.slice(0, 2).map(([href, label]) => (
                <Link key={href} href={href} className={pathname === href ? 'active' : ''}>
                  {label}
              </Link>
            ))}
          </nav>

          {/* CENTER: logo (fixed size, centered) */}
          <div className="logo">
            <Link href="/" aria-label="Home">
              <img
                  src="/images/green-sparrow-transparent.webp"
                  alt="Green Sparrow Tattoo Co."
              />
            </Link>
          </div>

          {/* RIGHT: desktop links + CTA */}
          <nav className="d-menu right">
            {LINKS.slice(2).map(([href, label]) => (
                <Link key={href} href={href} className={pathname === href ? 'active' : ''}>
                  {label}
              </Link>
            ))}
            <Link href="/booking" className="cta">Book Now</Link>
          </nav>

          {/* MOBILE actions: pinned far-right at >=320px */}
          <div className="m-actions">
            <a href="tel:+16022093099" aria-label="Call us" className="icon-btn">
              <FiPhone className="icon" aria-hidden="true"/>
            </a>
            <button
                className="icon-btn"
              aria-label="Toggle menu"
                aria-expanded={open}
                onClick={() => setOpen(o => !o)}
            >
              {open ? <FiX className="icon" aria-hidden="true"/> : <FiMenu className="icon" aria-hidden="true"/>}
            </button>
          </div>
        </div>

        {/* MOBILE drawer (sits directly under the header height per breakpoint) */}
        <nav className={`m-drawer ${open ? 'show' : ''}`}>
          {[...LINKS, ['/booking', 'Book Now']].map(([href, label]) => (
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
        :global(body) { margin: 0; }

        /* ------- NAV WRAPPER ------- */
        .nav {
          position: sticky; top: 0; left: 0; right: 0; z-index: 1000;
          background: var(--nav-bg);
          color: var(--nav-link);
          transition: background .25s ease, box-shadow .25s ease, backdrop-filter .25s ease;
        }
        .scrolled { box-shadow: 0 6px 18px rgba(0,0,0,.35); backdrop-filter: saturate(160%) blur(6px); }

        /* ------- BAR LAYOUT ------- */
        .bar.container {
          /* Uses your global .container grid: 1fr auto 1fr */
          height: 96px;                /* default (≥320px) */
          display: grid;
          grid-template-columns: 1fr auto 1fr; /* left | logo | right */
          align-items: center;
          gap: 1rem;
        }

        /* Ensure all links inherit color (fix blue/purple) */
        .nav :global(a) { color: inherit; text-decoration: none; }

        /* ------- DESKTOP MENUS ------- */
        .d-menu { display: none; gap: clamp(1.2rem, 2vw, 2rem); }
        .d-menu.left { justify-self: start; }
        .d-menu.right { justify-self: end; align-items: center; }

        .d-menu :global(a:any-link) {
          font-family: var(--font-sans);
          text-transform: uppercase;
          font-size: clamp(0.9rem, 1.1vw, 1.06rem);
          letter-spacing: .06em;
          position: relative;
          padding: 6px 0;
          outline: none;
        }
        .d-menu :global(a:any-link)::after {
          content: '';
          position: absolute; left: 0; bottom: -5px;
          width: 100%; height: 2px; background: var(--cta-bg);
          transform: scaleX(0); transform-origin: left;
          transition: transform .25s ease;
        }
        .d-menu :global(a:hover:any-link)::after,
        .d-menu :global(a.active:any-link)::after { transform: scaleX(1); }

        /* ------- CTA ------- */
        .cta:any-link {
          background: var(--cta-bg);
          color: var(--cta-text);
          padding: .65rem 1.4rem;
          border-radius: 6px;
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: clamp(0.95rem, 1.1vw, 1.05rem);
          transition: filter .2s ease;
          margin-left: .25rem;
        }
        .cta:any-link:hover { filter: brightness(1.08); }
        .cta:any-link:active { filter: brightness(.96); }

        /* ------- LOGO (centered, fixed size on desktop) ------- */
        .logo { justify-self: center; }
        .logo img {
          display: block; margin-inline: auto;
          height: 88px; width: auto;       /* ≥320 baseline */
          transition: transform .25s ease;
        }
        .scrolled .logo img { transform: scale(.92); }

        /* ------- MOBILE ACTIONS (≥320px pinned far right) ------- */
        .m-actions {
          display: flex; gap: .75rem; justify-self: end; align-items: center;
        }
        /* Button visuals: same background as navbar, icons inherit nav-link color */
        .icon-btn {
          appearance: none; border: 0; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
          width: 44px; height: 44px;           /* accessible tap target */
          background: var(--nav-bg);           /* matches bar background */
          color: var(--nav-link);              /* icon color = nav link color */
          border-radius: 8px;
          transition: filter .2s ease, transform .1s ease;
        }
        .icon-btn:hover { filter: brightness(1.08); }
        .icon-btn:active { transform: translateY(1px); }
        .icon { width: 22px; height: 22px; display: block; }

        /* ------- MOBILE DRAWER ------- */
        .m-drawer {
          position: fixed; left: 0; right: 0;
          top: 96px;                          /* matches small header height */
          background: #0e0e0e;
          display: none; flex-direction: column; align-items: center;
          padding: 1.5rem 0 2rem; gap: 1.1rem;
          border-top: 1px solid rgba(255,255,255,.08);
        }
        .m-drawer.show { display: flex; }
        .m-drawer :global(a:any-link) {
          color: #fff;
          font-family: var(--font-sans);
          font-size: clamp(1.1rem, 4vw, 1.35rem);
        }
        .m-drawer :global(a.active:any-link) {
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-color: var(--cta-bg);
        }

        /* ------- BREAKPOINTS ------- */
        @media (min-width: 641px) {
          .bar.container { height: 108px; }
          .m-drawer { top: 108px; }
          .logo img { height: 96px; }
        }
        @media (min-width: 901px) {
          .bar.container { height: 118px; }
          .m-drawer { top: 118px; }
          .logo img { height: 102px; }       /* your exact desktop size */
          .d-menu { display: flex; }
          .m-actions { display: none; }      /* hide mobile icons on desktop */
        }
      `}</style>
    </>
  );
}
