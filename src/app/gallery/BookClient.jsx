'use client';

import React, {useEffect, useMemo, useRef, useState} from 'react';
import Image from 'next/image';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const layoutFor = w =>
    w <= 360 ? {cols: 1, rows: 1} :
        w <= 480 ? {cols: 1, rows: 2} :
            w <= 767 ? {cols: 2, rows: 2} :
                {cols: 3, rows: 2};

const chunk = (arr, n) => {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
};

export default function BookClient({images = []}) {
  const swiperRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [vw, setVw] = useState(480);

  useEffect(() => {
    const handleResize = () => setVw(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const meta = layoutFor(vw);
  const perPage = meta.cols * meta.rows;
  const pages = useMemo(() => chunk(images, perPage), [images, perPage]);

  const closedHeight = 110;
  const openSize = Math.min(760, vw * 0.94);
  const openHeight = openSize * (meta.rows / meta.cols);
  const bookHeight = isOpen ? openHeight : closedHeight;
  const isMobile = vw <= 320;

  const slides = pages.map((pageImgs, i) => (
      <SwiperSlide key={`slide-${i}`}>
        <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${meta.cols}, 1fr)`,
              gridTemplateRows: `repeat(${meta.rows}, 1fr)`,
              gap: 12,
              width: '100%',
              height: '100%',
              padding: '1rem',
              boxSizing: 'border-box',
            }}
        >
          {pageImgs.map((img, idx) => (
              <div
                  key={`${img.src}-${idx}`}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: 6,
                    overflow: 'hidden',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setViewer(img)}
              >
                <Image
                    src={img.src}
                    alt={img.alt || 'Tattoo work'}
                    fill
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                    style={{objectFit: 'cover', display: 'block'}}
                    loading="lazy"
                />
              </div>
          ))}
        </div>
      </SwiperSlide>
  ));

  return (
      <>
        <div style={{...shell, height: bookHeight}}>
          {isOpen ? (
          <Swiper
              modules={[Navigation, Pagination]}
              pagination={{clickable: true}}
              threshold={10}
              onSwiper={s => (swiperRef.current = s)}
              style={{width: '100%', height: '100%'}}
          >
            {slides}
          </Swiper>
          ) : (
              <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: 6,
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={() => setIsOpen(true)}
                  aria-label="Open image gallery"
              >
                <Image
                    src={images[0]?.src || '/fallback.jpg'}
                    alt={images[0]?.alt || 'Featured tattoo'}
                    fill
                    sizes="100vw"
                    style={{objectFit: 'cover', display: 'block'}}
                />
                <span style={coverText}>Tap to explore the book</span>
              </div>
          )}
        </div>

        <div style={isMobile ? {...navBar, marginTop: 16} : navBar}>
          <button
              onClick={() => {
                if (!swiperRef.current) return setIsOpen(true);
                swiperRef.current.slidePrev();
              }}
              style={navBtn}
              aria-label="Previous page"
          >
            ‹
          </button>

          <button
              onClick={() => {
                if (!swiperRef.current) return setIsOpen(true);
                swiperRef.current.slideNext();
              }}
              style={navBtn}
              aria-label="Next page"
          >
            ›
          </button>
        </div>

        {viewer && (
            <div style={backdrop} onClick={() => setViewer(null)} role="dialog" aria-modal="true">
              <Image
                  src={viewer.src}
                  alt={viewer.alt || 'Tattoo image'}
                  fill
                  sizes="95vw"
                  style={viewerImg}
              />
            </div>
        )}
      </>
  );
}

const shell = {
  position: 'relative',
  maxWidth: 760,
  width: '100%',
  marginInline: 'auto',
  background: '#1A1715',
  borderRadius: 8,
  boxShadow: '0 22px 48px rgba(0,0,0,.55)',
  boxSizing: 'border-box',
  overflow: 'hidden',
  touchAction: 'pan-y',
};

const coverText = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: `'Sancreek', cursive`,
  fontSize: '1.3rem',
  color: '#D6B46B',
  background: 'rgba(0,0,0,.35)',
  textAlign: 'center',
};

const navBar = {
  marginTop: 10,
  display: 'flex',
  justifyContent: 'center',
  gap: 24,
};

const navBtn = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  border: 'none',
  background: '#292523',
  color: '#D6B46B',
  fontSize: 26,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
};

const backdrop = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,.92)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

const viewerImg = {
  objectFit: 'contain',
  borderRadius: 10,
};
