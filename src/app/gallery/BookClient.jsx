// src/app/gallery/BookClient.jsx
'use client';

import React, {useMemo, useRef, useState} from 'react';
import Image from 'next/image';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------ */

/** Return ideal column / row counts for the current viewport width. */
const layoutFor = w =>
    w <= 360
        ? {cols: 1, rows: 1}
        : w <= 480
            ? {cols: 1, rows: 2}
            : w <= 767
                ? {cols: 2, rows: 2}
                : {cols: 3, rows: 2};

/** Chunk the images array into page-sized groups. */
const chunk = (arr, n) => {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
};

/* ------------------------------------------------------------------
   Arrow (custom nav - improves tap target on mobile)
------------------------------------------------------------------ */
const Arrow = ({dir, swiperRef}) => {
  const prev = dir === 'prev';

  return (
      <button
          aria-label={prev ? 'Previous' : 'Next'}
          onClick={e => {
            e.stopPropagation();
            const s = swiperRef.current;
            if (!s) return;
            prev ? s.slidePrev() : s.slideNext();
          }}
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            [prev ? 'left' : 'right']: 10,
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(0,0,0,.66)',
            color: '#D6B46B',
            fontSize: 26,
            lineHeight: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 40,
            touchAction: 'none',
          }}
      >
        {prev ? '‹' : '›'}
      </button>
  );
};

/* ------------------------------------------------------------------
   Main component
------------------------------------------------------------------ */
export default function BookClient({images}) {
  const [viewer, setViewer] = useState(null);        // modal viewer
  const swiperRef = useRef(null);

  /* Swiper supplies live width via render prop → memoised layout. */
  const renderSlides = vw => {
    const meta = layoutFor(vw || 480);
    const perPage = meta.cols * meta.rows;
    const pages = useMemo(() => chunk(images, perPage), [images, perPage]);

    return pages.map((pageImgs, i) => (
        <SwiperSlide key={i}>
          <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${meta.cols}, 1fr)`,
                gridTemplateRows: `repeat(${meta.rows}, 1fr)`,
                gap: 14,
                width: '100%',
                height: '100%',
              }}
          >
            {pageImgs.map(img => (
                <div
                    key={img.src}
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      borderRadius: 6,
                      overflow: 'hidden',
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.04)',
                    }}
                    onClick={() => setViewer(img)}
                >
                  <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width:480px) 90vw, (max-width:768px) 45vw, 30vw"
                      style={{objectFit: 'cover', cursor: 'pointer'}}
                      priority={i === 0}
                  />
                </div>
            ))}
          </div>
        </SwiperSlide>
    ));
  };

  return (
      <>
        <div style={shell}>
          <Swiper
              modules={[Navigation, Pagination]}
              pagination={{clickable: true}}
              threshold={10}                 /* tiny drags register */
              touchStartPreventDefault={false} /* allow native scroll */
              onSwiper={s => (swiperRef.current = s)}
              style={{width: '100%', height: '100%'}}
          >
            {({width}) => renderSlides(width)}
          </Swiper>

          {/* custom nav buttons (hidden on very small screens) */}
          <Arrow dir="prev" swiperRef={swiperRef}/>
          <Arrow dir="next" swiperRef={swiperRef}/>
        </div>

        {/* full-screen viewer */}
        {viewer && (
            <div style={backdrop} onClick={() => setViewer(null)}>
              <img src={viewer.src} alt={viewer.alt} style={viewerImg}/>
            </div>
        )}
      </>
  );
}

/* ------------------------------------------------------------------
   Inline styles
------------------------------------------------------------------ */
const shell = {
  position: 'relative',
  maxWidth: 760,
  width: '100%',
  aspectRatio: '3 / 2',
  marginInline: 'auto',
  padding: '1rem',
  background: '#1A1715',
  borderRadius: 8,
  boxShadow: '0 22px 48px rgba(0,0,0,.55)',
  boxSizing: 'border-box',
  touchAction: 'pan-y',  // horizontal handled by Swiper; vertical by browser
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
  maxWidth: '96vw',
  maxHeight: '96vh',
  objectFit: 'contain',
  borderRadius: 10,
};

/* ------------------------------------------------------------------
   One-time responsive rule: hide arrows on very small screens
------------------------------------------------------------------ */
if (typeof window !== 'undefined' && !document.getElementById('bookClientCSS')) {
  const tag = document.createElement('style');
  tag.id = 'bookClientCSS';
  tag.textContent = `
    @media (max-width: 440px) {
      button[aria-label="Previous"],
      button[aria-label="Next"] {
        display: none;
      }
    }
  `;
  document.head.appendChild(tag);
}
