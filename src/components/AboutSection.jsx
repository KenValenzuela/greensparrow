'use client';

import Image from 'next/image';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function AboutSection({ variant = 'preview' }) {
  const isPreview = variant === 'preview';

  const images = [
      '/images/inside-shop/entertainmentcenter.webp',
      '/images/inside-shop/entrance_left.webp',
      '/images/inside-shop/magazines.webp',
      '/images/inside-shop/restroom.webp',
      '/images/inside-shop/rooms.webp',
      '/images/inside-shop/hallway.webp',
      '/images/inside-shop/lobby.webp',
  ];

  return (
    <section
      id="about"
      className="about-section"
      style={{
        display: 'grid',
        gridTemplateColumns: isPreview ? '1fr 1fr' : 'repeat(12, 1fr)',
        gap: '2rem',
        padding: isPreview ? '4rem 1.5rem' : '6rem 1.5rem',
        color: '#F1EDE0',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
          backgroundRepeat: 'repeat',
      }}
    >
      {/* Image Carousel */}
      <div
        className="about-carousel"
        style={{
          gridColumn: isPreview ? '1 / span 1' : '2 / span 5',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '520px',
            aspectRatio: '16 / 10',
            border: '4px solid #fff',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,.15)',
          }}
        >
          <Swiper
            spaceBetween={8}
            slidesPerView={1}
            loop
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            modules={[Autoplay, Pagination]}
            style={{ width: '100%', height: '100%' }}
          >
            {images.map((src, i) => (
              <SwiperSlide key={i}>
                  <Image
                      src={src}
                      alt={`Studio photo ${i + 1}`}
                      fill
                      style={{objectFit: 'cover'}}
                      sizes="(max-width: 768px) 100vw, 520px"
                      priority={i === 0}
                      loading={i === 0 ? 'eager' : 'lazy'}
                  />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Text Content */}
      <div
        className="about-text"
        style={{
          gridColumn: isPreview ? '2 / span 1' : '7 / span 4',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: isPreview ? 'flex-start' : 'flex-start',
        }}
      >
        <h2
          style={{
              fontFamily: 'Sancreek, cursive',
              fontSize: '2.5rem',
              color: '#e39289',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '2rem',
          }}
        >
            Where Story&nbsp;&amp;&nbsp;Skin Meet
        </h2>

        <p
          style={{
            lineHeight: 1.6,
            marginBottom: '1.25rem',
            maxWidth: isPreview ? 'auto' : '52ch',
            width: '100%',
          }}
        >
            Green Sparrow Tattoo Co. is an all-inclusive, desert-rooted studio in Mesa, Arizona.
            We’re proud to offer a welcoming space for all identities, where each tattoo is
            built on connection, care, and creative storytelling.
        </p>

        {!isPreview && (
          <>
            <p
              style={{
                lineHeight: 1.6,
                marginBottom: '1rem',
                maxWidth: '52ch',
                width: '100%',
              }}
            >
                From black‑and‑grey realism to cyber‑sigilism, our team covers a broad range
              of styles. Private rooms keep sessions relaxed, while our renovated space
              showcases local art, antique curiosities, and just the right dose of
              taxidermy charm.
            </p>
            <p
              style={{
                lineHeight: 1.6,
                maxWidth: '52ch',
                width: '100%',
              }}
            >
                Tattooing is collaboration. Tell us your story, share your mood board, or
                show up with a sketch on a napkin—together we’ll design something you’ll
                love for life.
            </p>
          </>
        )}

        {isPreview && (
          <a
            href="/about"
            style={{
              alignSelf: 'flex-start',
              fontWeight: 600,
              color: '#E5948B',
              textDecoration: 'none',
              borderBottom: '2px solid transparent',
              transition: 'all .15s ease-out',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderBottomColor = '#E5948B')}
            onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'transparent')}
          >
            Learn&nbsp;more&nbsp;→
          </a>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .about-section {
            grid-template-columns: 1fr !important;
            padding: 3rem 1rem !important;
          }

          .about-carousel {
            display: none !important;
          }

          .about-text {
            grid-column: 1 / -1 !important;
            text-align: center !important;
            align-items: center !important;
          }

          .about-text h2 {
              font-size: 1.8rem !important;
          }

          .about-text p {
            font-size: 0.95rem !important;
            padding: 0 0.5rem !important;
            max-width: 90vw !important;
          }

          .about-text a {
            align-self: center !important;
          }
        }
      `}</style>
    </section>
  );
}
