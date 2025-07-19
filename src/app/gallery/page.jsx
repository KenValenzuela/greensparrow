'use client';

import React, {useEffect, useMemo, useRef, useState} from 'react';
import ReactDOM from 'react-dom/client';
import Image from 'next/image';
import ensureTurn from '@/lib/ensureTurn';

// Artist image source map
const artistImageMap = {
  Joe: ['joe_1.webp', 'joe_2.webp', 'joe_3.webp', 'joe_4.webp', 'joe_5.webp', 'joe_6.webp', 'joe_7.webp', 'joe_8.webp', 'joe_9.webp', 'joe_10.webp'],
  Mickey: ['mickey_1.webp', 'mickey_2.webp', 'mickey_3.webp', 'mickey_4.webp', 'mickey_6.webp', 'mickey_7.webp', 'mickey_8.webp', 'mickey_9.webp', 'mickey_10.webp', 'mickey_11.webp', 'mickey_12.webp', 'mickey_13.webp'],
  T: ['t_1.webp', 't_2.webp', 't_3.webp', 't_4.webp', 't_5.webp', 't_6.webp', 't_7.webp', 't_8.webp', 't_9.webp', 't_10.webp', 't_11.webp', 't_12.webp', 't_13.webp', 't_14.webp', 't_15.webp', 't_16.webp', 't_17.webp', 't_18.webp'],
  Ki: ['ki_1.webp', 'ki_2.webp', 'ki_3.webp', 'ki_4.webp', 'ki_5.webp', 'ki_6.webp', 'ki_7.webp', 'ki_8.webp', 'ki_9.webp', 'ki_10.webp', 'ki_11.webp', 'ki_12.webp', 'ki_13.webp', 'ki_14.webp', 'ki_15.webp', 'ki_16.webp', 'ki_17.webp'],
  Axel: ['axel_1.webp', 'axel_2.webp', 'axel_3.webp', 'axel_4.webp', 'axel_5.webp', 'axel_6.webp', 'axel_7.webp', 'axel_9.webp', 'axel_10.webp', 'axel_11.webp', 'axel_12.webp', 'axel_15.webp'],
  Dallon: ['dallon_1.webp', 'dallon_2.webp', 'dallon_3.webp', 'dallon_4.webp', 'dallon_5.webp', 'dallon_6.webp', 'dallon_7.webp', 'dallon_8.webp'],
  Mia: ['mia_1.webp', 'mia_2.webp', 'mia_3.webp', 'mia_4.webp', 'mia_5.webp', 'mia_6.webp'],
};

const artists = Object.keys(artistImageMap);

const metaFor = w =>
    w <= 360 ? {cols: 1, rows: 1} :
        w <= 480 ? {cols: 1, rows: 2} :
            w <= 767 ? {cols: 2, rows: 2} :
                {cols: 3, rows: 2};

const clampW = w => Math.max(320, Math.min(720, w * 0.94));

export default function GalleryPage() {
  const [vw, setVw] = useState(360);
  const [meta, setMeta] = useState(metaFor(360));
  const [size, setSize] = useState(clampW(360));
  const [artist, setArtist] = useState(null);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const bookRef = useRef(null);

  // Responsive layout
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setVw(w);
      setMeta(metaFor(w));
      setSize(clampW(w));
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Dynamically resolve images based on artist selection
  const images = useMemo(() =>
          artist
              ? artistImageMap[artist].map(f => ({
                src: `/images/artists/${artist.toLowerCase()}/work/${f}`,
                alt: `${artist} work`,
              }))
              : artists.flatMap(a =>
                      artistImageMap[a].map(f => ({
            src: `/images/artists/${a.toLowerCase()}/work/${f}`,
                        alt: `${a} work`,
                      }))
              )
      , [artist]);

  const perPage = meta.cols * meta.rows;

  const grids = useMemo(() => {
    const out = [];
    for (let i = 0; i < images.length; i += perPage) {
      out.push(images.slice(i, i + perPage));
    }
    return out;
  }, [images, perPage]);

  const sheets = useMemo(() => {
    const base = grids.map(g => ({type: 'grid', data: g}));
    return [
      {type: 'cover'},
      ...base,
      ...(base.length % 2 === 0 ? [{type: 'end'}] : [])
    ];
  }, [grids]);

  // Render book with Turn.js
  useEffect(() => {
    let disposed = false;

    (async () => {
      await ensureTurn();
      if (disposed || !bookRef.current) return;

      const $ = window.$;
      const $book = $(bookRef.current);

      try {
        if ($book.data('turn')) $book.turn('destroy');
      } catch {
      }

      $book.empty();

      sheets.forEach(sh => {
        const $sheet = $('<div/>').addClass('page');

        if (sh.type === 'cover') {
          const $left = $('<div/>').addClass('page hard');
          const $right = $('<div/>').addClass('page hard');

          $left.append(
              $('<div/>')
              .addClass('coverHalf coverLeft')
              .html(`<p><strong>Welcome to Green Sparrow Tattoo Co.</strong></p>
                     <p>Explore the pages to see our artist work.</p>`)
          );

          $right.append(
              $('<div/>')
              .addClass('coverHalf coverRight')
                  .text('📖 Tap arrows to begin')
          );

          $book.append($left, $right);
          return;
        }

        if (sh.type === 'end') {
          const $end = $('<div/>').addClass('page hard');
          $('<div/>')
              .addClass('centerText')
              .text('✨ Thanks for viewing ✨')
              .appendTo($end);
          $book.append($end);
          return;
        }

        const $grid = $('<div/>').addClass('grid').css({
          gridTemplateColumns: `repeat(${meta.cols}, 1fr)`,
          gridTemplateRows: `repeat(${meta.rows}, 1fr)`,
        }).appendTo($sheet);

        sh.data.forEach(img => {
          const $cell = $('<div/>').addClass('cell').css('position', 'relative').appendTo($grid);
          ReactDOM.createRoot($cell[0]).render(
              <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width:480px) 90vw, (max-width:768px) 45vw, 30vw"
                  style={{objectFit: 'cover', borderRadius: 6}}
                  onClick={e => {
                    e.stopPropagation();
                    setModal(img);
                  }}
              />
          );
        });

        $book.append($sheet);
      });

      $book.turn({
        width: size,
        height: size * (meta.rows / meta.cols),
        autoCenter: true,
        elevation: 60,
        duration: 440,
        easing: 'ease-in-out',
      }).bind('turned', (_, p) => setPage(p));
    })();

    return () => {
      disposed = true;
      if (window.$) {
        try {
          window.$(bookRef.current).turn('destroy');
        } catch {
        }
      }
    };
  }, [sheets, size, meta]);

  const nav = dir => window.$?.(bookRef.current).turn(dir);

  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'ArrowLeft') nav('previous');
      if (e.key === 'ArrowRight') nav('next');
      if (e.key === 'Escape') setModal(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const isMobile = vw <= 320;

  return (
      <main style={styles.main}>
        <style>{`
        .page {
          background: #1A1715;
          width: 50%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        .grid {
          display: grid;
          width: 100%;
          height: 100%;
          gap: 12px;
          padding: 1rem;
          box-sizing: border-box;
        }
        .cell {
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 6px;
          position: relative;
        }
        .centerText {
          font-family: 'Sancreek', cursive;
          font-size: 1.3rem;
          color: #D6B46B;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        .coverHalf {
          width: 100%;
          height: 100%;
          padding: 1.2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: 1rem;
          font-family: 'Lora', serif;
          color: #EFE7D9;
        }
        .coverLeft {
          text-align: right;
          padding-right: 2rem;
        }
        .coverRight {
          text-align: left;
          font-family: 'Sancreek', cursive;
          font-size: 1.3rem;
          color: #D6B46B;
        }
      `}</style>

        <h1 style={styles.h1}>Gallery</h1>
        <p style={styles.sub}>
          {artist ? `Check out ${artist}’s work` : 'Check out work from all our artists'}
        </p>

        <div style={styles.filters}>
          <button onClick={() => setArtist(null)} style={chip(!artist)}>All</button>
          {artists.map(a => (
              <button key={a} onClick={() => setArtist(a)} style={chip(artist === a)}>{a}</button>
        ))}
      </div>

        <div style={styles.spread}>
          <div style={styles.bookWrap}>
            <div ref={bookRef} style={{
              ...styles.book,
              width: size,
              height: size * (meta.rows / meta.cols)
            }}/>
          </div>
        </div>

        {sheets.length > 1 && (
            <div style={{
              marginTop: isMobile ? '1rem' : 14,
              display: 'flex',
              justifyContent: 'center',
              gap: 24,
              width: size,
              marginInline: 'auto',
            }}>
              <button onClick={() => nav('previous')} disabled={page === 1} style={styles.barBtn}>‹</button>
              <button onClick={() => nav('next')} disabled={page === sheets.length} style={styles.barBtn}>›</button>
            </div>
        )}

        {modal && (
            <div style={styles.modal} onClick={() => setModal(null)}>
              <img src={modal.src} alt={modal.alt} style={styles.modalImg}/>
        </div>
      )}
    </main>
  );
}

const palette = {
  brown: '#2B1E15',
  page: '#1A1715',
  cream: '#EFE7D9',
  gold: '#D6B46B',
  gray: '#6C6C6C',
};

const styles = {
  main: {
    padding: '3rem .8rem',
    minHeight: '100vh',
    background: `${palette.brown} url('/images/background.webp') center/cover`,
    color: palette.cream,
    fontFamily: 'Lora,serif',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  h1: {
    fontFamily: 'Sancreek,cursive',
    fontSize: '2.4rem',
    color: palette.gold,
    marginBottom: '.5rem',
  },
  sub: {
    fontSize: '1rem',
    opacity: 0.9,
    marginBottom: '1.3rem',
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '.7rem',
    marginBottom: '1.8rem',
  },
  spread: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    boxSizing: 'border-box',
  },
  bookWrap: {
    position: 'relative',
    width: '100%',
    maxWidth: 760,
    boxSizing: 'border-box',
  },
  book: {
    background: palette.page,
    borderRadius: 8,
    boxShadow: '0 22px 48px rgba(0,0,0,.55)',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  barBtn: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: 'none',
    background: '#292523',
    color: palette.gold,
    fontSize: 26,
    cursor: 'pointer',
  },
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,.92)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  modalImg: {
    maxWidth: '96vw',
    maxHeight: '96vh',
    objectFit: 'contain',
    borderRadius: 10,
  },
};

const chip = active => ({
  padding: '.72rem 1.45rem',
  borderRadius: 999,
  fontWeight: 600,
  fontSize: '.9rem',
  background: active ? palette.gold : palette.gray,
  color: active ? '#111' : palette.cream,
  border: 'none',
  cursor: 'pointer',
});
