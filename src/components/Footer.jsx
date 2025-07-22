'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="footer-container">
        {/* LEFT COLUMN */}
        <nav className="footer-nav" aria-label="Footer navigation">
          {[
            ['/gallery', 'Our Work'],
            ['/about', 'About Us'],
            ['/booking', 'Book Now'],
            ['/faq', 'FAQ'],
          ].map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>

        {/* CENTER COLUMN */}
        <div className="footer-center">
          <p className="footer-logo-text">Green Sparrow Tattoo Co.</p>
          <p className="footer-cta">
            Ready to book your next piece?
            <br/>
            <Link href="/booking" className="cta-button">Book Now →</Link>
          </p>
        </div>

        {/* RIGHT COLUMN */}
        <div className="footer-right">
          <div className="footer-socials" aria-label="Social media links">
            {[
              ['https://instagram.com/greensparrowtattoo.co', 'Instagram'],
              ['https://facebook.com/Green-Sparrow-Tattoo-Co', 'Facebook'],
              ['https://tiktok.com/@greensparrowtattooco', 'TikTok'],
            ].map(([href, label]) => (
                <Link key={label} href={href} target="_blank" rel="noopener noreferrer">
                  {label}
                </Link>
            ))}
          </div>

          <address className="footer-address">
            430 N. Dobson Rd<br />
            Unit 109<br />
            Mesa, AZ 85201<br />
            <Link href="tel:+16022093099">(602) 209-3099</Link><br />
            <Link
              href="https://maps.google.com/?q=Green+Sparrow+Tattoo+Co."
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Maps →
            </Link>
          </address>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: linear-gradient(rgba(44, 32, 22, 0.85), rgba(44, 32, 22, 0.85)),
          url('/images/background.webp') center/cover no-repeat;
          color: #e4938a;
          border-top: 2px solid #687357;
        }

        .footer-container {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          grid-template-areas: "nav center right";
          padding: 2.5rem 3rem;
          gap: 2rem;
          align-items: start;
        }

        .footer-nav {
          grid-area: nav;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          font-family: 'Lora', serif;
          text-transform: uppercase;
        }

        .footer-nav a {
          color: #fff;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-nav a:hover {
          color: #e5948b;
        }

        .footer-center {
          grid-area: center;
          text-align: center;
        }

        .footer-logo-text {
          font-family: 'Sancreek', cursive;
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .footer-cta {
          font-family: 'Lora', serif;
          font-size: 1.125rem;
          color: #e5948b;
        }

        .cta-button {
          display: inline-block;
          margin-top: 0.5rem;
          font-family: 'Sancreek', cursive;
          font-size: 1.75rem;
          color: #fff;
          text-decoration: none;
          transition: transform 0.2s ease;
        }

        .cta-button:hover {
          transform: translateX(4px);
        }

        .footer-right {
          grid-area: right;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: flex-end;
        }

        .footer-socials {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-family: 'Sancreek', cursive;
        }

        .footer-socials a {
          color: #fff;
          text-decoration: none;
        }

        .footer-socials a:hover {
          color: #e5948b;
        }

        .footer-address {
          font-family: 'Lora', serif;
          font-size: 0.95rem;
          line-height: 1.4;
          text-align: right;
        }

        .footer-address a {
          color: #e5948b;
          text-decoration: none;
        }

        /* Mobile Responsive */
        @media (max-width: 640px) {
          .footer-container {
            flex-direction: column;
            display: flex;
            align-items: center;
            text-align: center;
            padding: 2rem 1rem;
            gap: 2rem;
          }

          .footer-nav,
          .footer-socials,
          .footer-address {
            align-items: center;
            text-align: center;
          }

          .footer-right {
            align-items: center;
          }

          .footer-logo-text {
            font-size: 2rem;
          }

          .cta-button {
            font-size: 1.5rem;
          }
        }

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
