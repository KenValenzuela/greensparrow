'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>
      <footer
        className="footer"
        style={{
          backgroundImage:
            "linear-gradient(rgba(44,32,22,0.85), rgba(44,32,22,0.85)), url('/images/background.png')",
          backgroundColor: '#2C2016',
          backgroundSize: 'cover',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center top',
          borderTop: '2px solid #687357',
          color: '#FFFFFF',
          display: 'grid',
          gridTemplateAreas: `
            "nav     cta      socials"
            "nav     logo     socials"
            "nav     address  socials"
          `,
          gridTemplateColumns: '1fr auto 1fr',
          padding: '2.25rem 1.25rem',
          gap: '1.5rem 1rem',
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: '100vw',
        }}
      >
        {/* NAVIGATION */}
        <nav
          className="footer-nav"
          style={{
            gridArea: 'nav',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: 'Lora, serif',
            textTransform: 'uppercase',
            letterSpacing: '1.6px',
            fontSize: 'clamp(14px, 1.2vw, 16px)',
            gap: '0.6rem',
          }}
          aria-label="Footer navigation"
        >
          {[
            ['/gallery', 'Our Work'],
            ['/about', 'About Us'],
            ['/booking', 'Book Now'],
            ['/faq', 'FAQ'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              style={{
                color: '#FFFFFF',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div
          style={{
            gridArea: 'cta',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          <p
            style={{
              fontFamily: 'Lora, serif',
              fontSize: 'clamp(16px, 1.2vw, 20px)',
              color: '#E5948B',
              margin: 0,
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            Ready to book your next piece?
            <Link
              href="/booking"
              style={{
                fontFamily: 'Sancreek, serif',
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                color: '#FFFFFF',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'transform 0.2s ease',
                lineHeight: 1.1,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
            >
              Let&apos;s Chat →
            </Link>
          </p>
        </div>

        {/* SOCIALS */}
        <div
          className="footer-socials"
          style={{
            gridArea: 'socials',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignSelf: 'stretch',
            alignItems: 'flex-end',
            fontFamily: 'Sancreek, serif',
            fontSize: 'clamp(13px, 0.9vw, 16px)',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
          }}
        >
          {[
            ['https://www.instagram.com/greensparrowtattoo.co', 'Instagram'],
            ['https://www.facebook.com/people/Green-Sparrow-Tattoo-Co/61575630917427/', 'Facebook'],
            ['https://www.tiktok.com/@greensparrowtattooco', 'TikTok'],
          ].map(([href, label]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#FFFFFF', textDecoration: 'none' }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* SVG LOGO CENTERED */}
        <div
          style={{
            gridArea: 'logo',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: 0,
            marginTop: '-1rem',
          }}
        >
          <svg
            viewBox="0 0 2200 100"
            preserveAspectRatio="xMidYMid meet"
            style={{
              width: 'clamp(320px, 90vw, 1600px)',
              height: 'clamp(40px, 8vw, 100px)',
              fill: '#FFFFFF',
              stroke: '#FFFFFF',
              strokeWidth: 2,
              display: 'block',
            }}
            aria-hidden="true"
          >
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="'Sancreek', serif"
              fontSize="clamp(32px, 6vw, 72px)"
            >
              Green Sparrow Tattoo Co.
            </text>
          </svg>
        </div>

        {/* ADDRESS */}
        <address
          className="footer-address"
          style={{
            gridArea: 'address',
            fontFamily: 'Lora, serif',
            fontSize: 'clamp(13px,0.9vw,15px)',
            lineHeight: 1.5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '.25rem',
            textAlign: 'center',
          }}
        >
          430&nbsp;N.&nbsp;Dobson&nbsp;Rd.
          <span>Unit&nbsp;109</span>
          <span>Mesa,&nbsp;AZ&nbsp;85201</span>
          <a
            href="tel:+16022093099"
            style={{
              color: '#E5948B',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            (602)&nbsp;209-3099
          </a>
          <a
            href="https://maps.google.com/?q=Green+Sparrow+Tattoo+Co."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#E5948B',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Open&nbsp;in&nbsp;Maps&nbsp;→
          </a>
        </address>
      </footer>

      {/* MOBILE OVERRIDES */}
      <style jsx>{`
        @media (max-width: 768px) {
          .footer {
            display: flex !important;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 2rem 1rem !important;
            gap: 2rem !important;
          }

          .footer-nav,
          .footer-socials,
          .footer-address {
            align-items: center !important;
            text-align: center;
          }

          .footer-socials {
            flex-direction: row !important;
            justify-content: center !important;
            gap: 1.25rem !important;
          }

          svg {
            max-width: 92vw !important;
          }

          span,
          a,
          address {
            white-space: normal !important;
          }
        }
      `}</style>
    </div>
  );
}
