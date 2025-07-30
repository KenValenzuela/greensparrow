'use client';

import Link from 'next/link';
import {FiFacebook, FiInstagram, FiMapPin, FiPhone} from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="footer" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Site footer</h2>

      <div className="wrap">
        {/* LEFT */}
        <nav className="nav" aria-label="Footer navigation">
          {[
            ['/gallery', 'Our Work'],
            ['/about', 'About Us'],
            ['/booking', 'Book Now'],
            ['/faq', 'FAQ'],
          ].map(([href, label]) => (
              <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>

        {/* CENTER */}
        <div className="brand">
          <p className="logo">Green Sparrow Tattoo Co.</p>
          <Link href="/booking" className="cta">Book Now →</Link>
          <p className="tag">Ready to book your next piece?</p>
        </div>

        {/* RIGHT */}
        <div className="contact">
          <address>
            <FiMapPin aria-hidden/> 430 N Dobson Rd #109<br/>
            Mesa, AZ 85201
          </address>

          <Link href="tel:+16022093099" className="phone">
            <FiPhone aria-hidden/> (602) 209‑3099
          </Link>

          <div className="social" aria-label="Social">
            <Link href="https://instagram.com/greensparrowtattoo.co" target="_blank" rel="noopener"
                  aria-label="Instagram">
              <FiInstagram size={20}/>
            </Link>
            <Link href="https://facebook.com/Green-Sparrow-Tattoo-Co" target="_blank" rel="noopener"
                  aria-label="Facebook">
              <FiFacebook size={20}/>
            </Link>
          </div>

          <Link
              href="https://maps.google.com/?q=Green+Sparrow+Tattoo+Co."
              target="_blank"
              rel="noopener"
              className="maps"
          >
            Open in Maps →
          </Link>
        </div>
      </div>

      <p className="copy">
        © {new Date().getFullYear()} Green Sparrow Tattoo Co. All rights reserved.
      </p>

      <style jsx>{`
        :global(body) {
          margin: 0;
        }

        /* ===== base ===== */
        .footer {
          background: #1b1b1b;
          color: #255130;
          border-top: 2px solid #255130;
          padding: 2rem 1rem 1.75rem;
          font-family: 'Lora', serif;
        }

        /* mobile‑first layout */
        .wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          width: 100%;
        }

        /* nav */
        .nav {
          display: flex;
          flex-direction: column;
          gap: .7rem;
          text-transform: uppercase;
          align-items: center;
        }

        .nav a,
        .nav a:visited { /* prevent blue/purple */
          font-size: .9rem;
          color: #ffffff;
          text-decoration: none;
          transition: color .2s;
        }

        .nav a:hover {
          color: #e5948b;
        }

        /* brand */
        .brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: .65rem;
          text-align: center;
        }

        .logo {
          font-family: 'Sancreek', cursive;
          font-size: clamp(1.7rem, 7vw, 2.1rem);
          line-height: 1.05;
        }

        .cta,
        .cta:visited {
          background: #e5948b;
          color: #1b1b1b;
          padding: .55rem 1.25rem;
          border-radius: 4px;
          font-family: 'Sancreek', cursive;
          font-size: 1.2rem;
          text-decoration: none;
          transition: transform .25s;
        }

        .cta:hover {
          transform: translateY(-3px);
        }

        .tag {
          font-size: .95rem;
          color: #e5948b;
        }

        /* contact block */
        .contact {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: .7rem;
        }

        address {
          font-style: normal;
          line-height: 1.35;
          text-align: center;
          display: flex;
          align-items: flex-start;
          gap: .35rem;
          font-size: .9rem;
        }

        .phone,
        .phone:visited {
          color: #e5948b;
          text-decoration: none;
          display: flex;
          gap: .35rem;
        }

        .social {
          display: flex;
          gap: .8rem;
        }

        .social a,
        .social a:visited {
          color: #ffffff;
        }

        .social a:hover {
          color: #e5948b;
        }

        .maps,
        .maps:visited {
          color: #e5948b;
          text-decoration: none;
          font-size: .9rem;
        }

        /* copyright */
        .copy {
          margin-top: 1.5rem;
          text-align: center;
          font-size: .8rem;
          color: #8b897f;
        }

        /* ===== desktop ≥900 px ===== */
        @media (min-width: 900px) {
          .wrap {
            flex-direction: row;
            justify-content: space-between; /* anchor to far edges */
            align-items: flex-start;
          }

          .nav {
            align-items: flex-start;
          }

          .contact {
            align-items: flex-end;
            text-align: right;
          }

          address {
            text-align: right;
            justify-content: flex-end;
          }

          .logo {
            font-size: 2.4rem;
          }

          .cta {
            font-size: 1.4rem;
          }
        }

        /* screen‑reader helper */
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
