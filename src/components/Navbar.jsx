'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiPhone } from 'react-icons/fi';

export default function Navbar({ show = true }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navItems = [
    ['/about', 'About'],
    ['/artists', 'Artists'],
    ['/gallery', 'Gallery'],
    ['/booking', 'Booking'],
    ['/faq', 'FAQ']
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkStyle = (href) => ({
    color: pathname === href ? '#e5948b' : '#F1EDE0',
    fontSize: '16px',
    fontFamily: '"Cormorant Garamond", serif',
    fontWeight: 600,
    textTransform: 'uppercase',
    padding: '0.75em 1em',
    textAlign: 'center',
    position: 'relative',
    transition: 'color 0.3s ease',
    whiteSpace: 'nowrap'
  });

  if (!show) return null;

  return (
    <>
      <header className="navbar">
        <div className="container">
          {/* Left nav (hidden on mobile) */}
          <nav className="desktop-nav left">
            {navItems.slice(0, 2).map(([href, label]) => (
              <Link key={href} href={href}>
                <span style={linkStyle(href)} className="hover-underline">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Logo + Home block */}
          <div className="logo-block">
            <Link href="/" style={{ zIndex: 2 }}>
              <img
                src="/images/green-sparrow-transparent.png"
                alt="Green Sparrow Tattoo Co."
                className="logo-img"
                style={{
                  objectFit: 'contain',
                  height: scrolled ? '80px' : '100px',
                  transition: 'all 0.3s ease',
                  filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.6))'
                }}
              />
            </Link>
            <Link href="/">
              <span style={{
                ...linkStyle('/'),
                fontSize: '14px',
                marginTop: '-0.5rem',
                display: 'block'
              }}>
                Home
              </span>
            </Link>
          </div>

          {/* Right nav (hidden on mobile) */}
          <nav className="desktop-nav right">
            {navItems.slice(2).map(([href, label]) => (
              <Link key={href} href={href}>
                <span style={linkStyle(href)} className="hover-underline">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile icons: only show hamburger on mobile; phone hidden via .phone-icon */}
          <div className="mobile-icons">
            <a href="tel:+16022093099" aria-label="Call us" className="phone-icon" style={{ padding: 8 }}>
              <FiPhone size={24} color="#F1EDE0" />
            </a>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="hamburger"
            >
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bar" />
              ))}
            </button>
          </div>
        </div>

        {/* Mobile menu: still lists all nav items when open */}
        <div className={`hamburger-menu ${open ? 'show' : ''}`}>
          {navItems.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              <span className="mobile-link">{label}</span>
            </Link>
          ))}
        </div>
      </header>

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 999;
          width: 100%;
          background-image:
            linear-gradient(rgba(44, 32, 22, 0.85), rgba(44, 32, 22, 0.85)),
            url('/images/background.png');
          background-size: cover;
          background-repeat: repeat-x;
          border-top: 2px solid #687357;
          border-bottom: 2px solid #687357;
          backdrop-filter: blur(6px);
        }

        .container {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .desktop-nav {
          display: flex;
          gap: 1.5em;
          justify-content: center;
          flex-wrap: wrap;
        }

        .logo-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .hover-underline::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: #e5948b;
          transform: scaleX(0);
          transform-origin: bottom left;
          transition: transform 0.25s ease-in-out;
        }

        .hover-underline:hover::after {
          transform: scaleX(1);
        }

        .mobile-icons {
          display: none;
          align-items: center;
          gap: 0.5rem;
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 36px;
          height: 36px;
          background: none;
          border: none;
          cursor: pointer;
        }

        .bar {
          width: 24px;
          height: 3px;
          background-color: #F1EDE0;
        }

        .hamburger-menu {
          display: none;
          flex-direction: column;
          align-items: center;
          background: #2C2016;
          padding: 1em 0;
        }

        .hamburger-menu.show {
          display: flex;
        }

        .mobile-link {
          color: #EDE7D9;
          font-size: 18px;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600;
          text-transform: uppercase;
          padding: 0.5em 1em;
          text-decoration: none;
          width: 100%;
          text-align: center;
        }

        @media (max-width: 767px) {
          /* Hide desktop nav links */
          .desktop-nav {
            display: none;
          }

          /* Adjust container to flex */
          .container {
            display: flex;
            justify-content: space-between;
            max-width: 100%;
            padding: 0 1rem;
          }

          /* Hide logo image but show Home text */
          .logo-img {
            display: none;
          }

          /* Show only hamburger (phone hidden via phone-icon rule) */
          .mobile-icons {
            display: flex;
          }

          .mobile-icons .phone-icon {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .logo-img {
            max-height: 60px;
          }
        }
      `}</style>
    </>
  );
}
