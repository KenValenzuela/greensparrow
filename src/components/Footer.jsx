'use client';

import Link from 'next/link';
import {FiFacebook, FiInstagram, FiMapPin, FiPhone} from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="footer" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Site footer</h2>

      <div className="wrap">
        {/* LEFT: Nav */}
        <nav className="col nav" aria-label="Footer navigation">
          <h3 className="hdr">Explore</h3>
          <ul className="list">
            {[
              ['/gallery', 'Our Work'],
              ['/about', 'About Us'],
              ['/booking', 'Book Now'],
              ['/faq', 'FAQ'],
            ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="link">{label}</Link>
                </li>
            ))}
          </ul>
        </nav>

        {/* CENTER: Brand / CTA */}
        <div className="col brand">
          <p className="logo">Green Sparrow Tattoo Co.</p>
          <p className="tag">Ready to book your next piece?</p>
          <Link href="/booking" className="cta">Book Now →</Link>
        </div>

        {/* RIGHT: Contact / Social */}
        <div className="col contact">
          <h3 className="hdr">Visit / Call</h3>
          <address className="addr">
            <FiMapPin aria-hidden className="ico"/> 430 N Dobson Rd #109<br/>
            Mesa, AZ 85201
          </address>

          <Link href="tel:+16022093099" className="tel">
            <FiPhone aria-hidden className="ico"/> (602) 209-3099
          </Link>

          <div className="social" aria-label="Social">
            <a
                href="https://instagram.com/greensparrowtattoo.co"
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className="social-link"
            >
              <FiInstagram/>
            </a>
            <a
                href="https://facebook.com/Green-Sparrow-Tattoo-Co"
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
                className="social-link"
            >
              <FiFacebook/>
            </a>
          </div>

          <a
              href="https://maps.google.com/?q=Green+Sparrow+Tattoo+Co."
              target="_blank"
              rel="noopener"
              className="maps"
          >
            Open in Maps →
          </a>
        </div>
      </div>

      <div className="legal">
        <p className="copy">© {new Date().getFullYear()} Green Sparrow Tattoo Co. All rights reserved.</p>
      </div>

      <style jsx>{`
        :global(body) {
          margin: 0;
        }

        /* ===== BASE ===== */
        .footer {
          background: var(--footer-bg, rgb(126, 82, 24));
          color: var(--nav-link, #f1ede0);
          border-top: 1px solid color-mix(in oklab, var(--footer-accent, #e5948b) 20%, #000);
          padding: 2.25rem 1.25rem 0;
          font-family: var(--font-sans, system-ui, -apple-system, Segoe UI, Roboto, sans-serif);
          backdrop-filter: saturate(140%) blur(6px);
        }

        /* Prevent default blue/purple & unify link behavior in footer */
        .footer :global(a) {
          color: inherit;
          text-decoration: none;
        }

        .wrap {
          max-width: 1200px;
          margin-inline: auto;
          display: grid;
          gap: 2rem;
          grid-template-columns: 1fr; /* mobile */
        }

        /* Columns */
        .col {
          display: grid;
          gap: .9rem;
        }

        .hdr {
          margin: 0;
          font-size: .95rem;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: color-mix(in oklab, var(--nav-link) 70%, #000);
        }

        /* Nav list */
        .list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: .55rem;
        }

        .link:any-link {
          color: color-mix(in oklab, var(--nav-link) 88%, #000);
          font-size: .98rem;
          transition: color .2s ease, text-underline-offset .2s ease;
        }

        .link:any-link:hover {
          color: var(--footer-accent, #e5948b);
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: var(--footer-accent, #e5948b);
        }

        .link:any-link:focus-visible {
          outline: 2px solid var(--footer-accent, #e5948b);
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* Brand / CTA */
        .brand {
          justify-items: center;
          text-align: center;
          gap: .6rem;
        }

        .logo {
          font-family: var(--font-display, 'Sancreek', cursive);
          font-size: clamp(1.7rem, 6vw, 2.3rem);
          line-height: 1.05;
        }

        .tag {
          color: color-mix(in oklab, var(--nav-link) 70%, #000);
          font-size: .98rem;
        }

        .cta:any-link {
          margin-top: .25rem;
          display: inline-block;
          background: var(--footer-accent, #e5948b);
          color: #1b1b1b;
          padding: .6rem 1.2rem;
          border-radius: 8px;
          font-weight: 700;
          transition: transform .18s ease, filter .18s ease;
        }

        .cta:any-link:hover {
          filter: brightness(1.06);
          transform: translateY(-1px);
        }

        .cta:any-link:active {
          transform: translateY(0);
        }

        /* Contact */
        .contact {
          justify-items: center;
          text-align: center;
        }

        .addr {
          font-style: normal;
          line-height: 1.35;
          font-size: .98rem;
          color: color-mix(in oklab, var(--nav-link) 85%, #000);
          display: grid;
          grid-auto-flow: column;
          align-items: start;
          justify-content: center;
          gap: .4rem;
        }

        .ico {
          margin-top: .2rem;
          flex: 0 0 auto;
        }

        .tel:any-link {
          display: inline-grid;
          grid-auto-flow: column;
          align-items: center;
          gap: .4rem;
          color: var(--footer-accent, #e5948b);
          font-weight: 600;
          transition: opacity .2s ease;
        }

        .tel:any-link:hover {
          opacity: .9;
        }

        .social {
          display: grid;
          grid-auto-flow: column;
          gap: .8rem;
          margin-top: .4rem;
        }

        .social-link {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: color-mix(in oklab, var(--footer-bg, #352619) 85%, #000);
          color: color-mix(in oklab, var(--nav-link) 85%, #000);
          transition: background .2s ease, color .2s ease, transform .12s ease;
        }

        .social-link:hover {
          background: color-mix(in oklab, var(--footer-accent, #e5948b) 30%, #000);
          color: var(--footer-accent, #e5948b);
          transform: translateY(-1px);
        }

        .social-link:focus-visible {
          outline: 2px solid var(--footer-accent, #e5948b);
          outline-offset: 2px;
        }

        .maps:any-link {
          margin-top: .4rem;
          color: var(--footer-accent, #e5948b);
          font-size: .95rem;
          transition: text-underline-offset .2s ease;
          text-decoration: underline;
          text-decoration-color: var(--footer-accent, #e5948b);
          text-underline-offset: 2px;
        }

        .maps:any-link:hover {
          text-underline-offset: 4px;
        }

        /* Legal strip */
        .legal {
          margin-top: 1.8rem;
          border-top: 1px solid color-mix(in oklab, var(--nav-link) 12%, #000);
          padding: .9rem 0 1.2rem;
        }

        .copy {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          font-size: .85rem;
          color: color-mix(in oklab, var(--nav-link) 60%, #000);
        }

        /* ===== LAYOUT ≥ 900 px ===== */
        @media (min-width: 900px) {
          .wrap {
            grid-template-columns: 1fr auto 1fr; /* nav | brand | contact */
            align-items: start;
          }

          .brand {
            justify-items: center;
            text-align: center;
          }

          .contact {
            justify-items: end;
            text-align: right;
          }

          .addr {
            justify-content: end;
          }
        }

        /* Screen-reader helper */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </footer>
  );
}
