// src/app/gallery/page.jsx
'use client';

import React, {useState, useEffect, useMemo, useRef} from 'react';
import ReactDOM from 'react-dom/client';
import Image from 'next/image';
import ensureTurn from '@/lib/ensureTurn';

/* 1 ▸ DATA ------------------------------------------------------------ */
const artistImageMap = {
  Joe: ['joe_1.webp', 'joe_2.webp', 'joe_3.webp', 'joe_4.webp', 'joe_5.webp', 'joe_6.webp', 'joe_7.webp', 'joe_8.webp', 'joe_9.webp', 'joe_10.webp'],
  Mickey: ['mickey_1.webp', 'mickey_2.webp', 'mickey_3.webp', 'mickey_4.webp', 'mickey_6.webp', 'mickey_7.webp', 'mickey_8.webp', 'mickey_9.webp', 'mickey_10.webp', 'mickey_11.webp', 'mickey_12.webp', 'mickey_13.webp'],
  T: ['t_1.webp', 't_2.webp', 't_3.webp', 't_4.webp', 't_5.webp', 't_6.webp', 't_7.webp', 't_8.webp', 't_9.webp', 't_10.webp', 't_11.webp', 't_12.webp', 't_13.webp', 't_14.webp', 't_15.webp', 't_16.webp', 't_17.webp', 't_18.webp'],
  Ki: ['ki_1.webp', 'ki_2.webp', 'ki_3.webp', 'ki_4.webp', 'ki_5.webp', 'ki_6.webp', 'ki_7.webp', 'ki_8.webp', 'ki_9.webp', 'ki_10.webp', 'ki_11.webp', 'ki_12.webp', 'ki_13.webp', 'ki_14.webp', 'ki_15.webp', 'ki_16.webp', 'ki_17.webp'],
  Axel: ['axel_1.webp', 'axel_2.webp', 'axel_3.webp', 'axel_4.webp', 'axel_5.webp', 'axel_6.webp', 'axel_7.webp', 'axel_9.webp', 'axel_10.webp', 'axel_11.webp', 'axel_12.webp', 'axel_15.webp'],
  Dallon: ['dallon_1.webp', 'dallon_2.webp', 'dallon_3.webp', 'dallon_4.webp', 'dallon_5.webp', 'dallon_6.webp', 'dallon_7.webp', 'dallon_8.webp'],
  Mia: ['mia_1.webp', 'mia_2.webp', 'mia_3.webp', 'mia_4.webp', 'mia_5.webp', 'mia_6.webp']
};
const artists = Object.keys(artistImageMap);

/* grid rules                                                          */
const metaFor = w => (
    w <= 360 ? {cols: 1, rows: 1} :     // super-narrow phones = big cell
        w <= 480 ? {cols: 1, rows: 2} :
            w <= 767 ? {cols: 2, rows: 2} :
                {cols: 3, rows: 2}
);
const clampW = w => Math.max(320, Math.min(760, w * 0.94));

/* 2 ▸ COMPONENT ------------------------------------------------------- */
export default function GalleryPage() {
  const [artist, setArtist] = useState(null);
  const [meta, setMeta] = useState(() => metaFor(typeof window !== 'undefined' ? innerWidth : 1024));
  const [size, setSize] = useState(() => clampW(typeof window !== 'undefined' ? innerWidth : 1024));
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);        // {src,alt}
  const bookRef = useRef(null);

  /* resize listener */
  useEffect(() => {
    const fn = () => {
      const w = innerWidth;
      setMeta(metaFor(w));
      setSize(clampW(w));
    };
    addEventListener('resize', fn);
    return () => removeEventListener('resize', fn);
  }, []);

  /* image list */
  const images = useMemo(() => (
      artist
          ? artistImageMap[artist].map(f => ({
            src: `/images/artists/${artist.toLowerCase()}/work/${f}`,
            alt: `${artist} work`
          }))
          : artists.flatMap(a => artistImageMap[a].map(f => ({
            src: `/images/artists/${a.toLowerCase()}/work/${f}`,
            alt: `${a} work`
          })))
  ), [artist]);

  /* paginate */
  const per = meta.cols * meta.rows;
  const grids = useMemo(() => {
    const arr = [];
    for (let i = 0; i < images.length; i += per) arr.push(images.slice(i, i + per));
    return arr;
  }, [images, per]);

  /* sheets array */
  const sheets = useMemo(() => {
    const all = [{type: 'cover'}, ...grids.map(g => ({type: 'grid', data: g}))];
    if (all.length % 2) all.push({type: 'end'});
    return all;
  }, [grids]);

  /* flipbook build */
  useEffect(() => {
    let gone = false;
    (async () => {
      await ensureTurn();
      if (gone || !bookRef.current) return;

      const $ = window.$, $b = $(bookRef.current);
      try {
        if ($b.data('turn')) $b.turn('destroy');
      } catch {
      }
      $b.empty();

      sheets.forEach(sh => {
        const $sheet = $('<div/>', {class: 'page'});

        if (sh.type === 'cover') {
          $('<div/>', {class: 'centerText', html: '<span>📖 Welcome!<br/>Swipe / tap arrows</span>'}).appendTo($sheet);
        } else if (sh.type === 'end') {
          $('<div/>', {class: 'centerText', html: '<span>✨ Thanks for viewing ✨</span>'}).appendTo($sheet);
        } else {
          const $grid = $('<div/>', {
            class: 'grid', css: {
              gridTemplateColumns: `repeat(${meta.cols},1fr)`,
              gridTemplateRows: `repeat(${meta.rows},1fr)`
            }
          }).appendTo($sheet);

          sh.data.forEach(img => {
            const $cell = $('<div/>', {class: 'cell'}).appendTo($grid);
            const wrap = document.createElement('div');
            Object.assign(wrap.style, {position: 'relative', width: '100%', height: '100%', cursor: 'pointer'});
            ReactDOM.createRoot(wrap).render(
                <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width:480px) 90vw, (max-width:768px) 45vw, 30vw"
                    style={{objectFit: 'cover'}}
                    onClick={e => {
                      e.stopPropagation();
                      setModal(img);
                    }}
                />
            );
            $cell.append(wrap);
          });
        }

        $b.append($sheet);
      });

      $b.turn({
        width: size,
        height: size * (meta.rows / meta.cols),
        autoCenter: true,
        elevation: 70,
        duration: 460,
        easing: 'cubic-bezier(.25,1,.3,1)'
      }).bind('turned', (_, p) => setPage(p));
    })();

    return () => {
      gone = true;
      if (window.$) {
        try {
          window.$(bookRef.current).turn('destroy');
        } catch {
        }
      }
    };
  }, [sheets, meta, size]);

  /* nav helpers + key */
  const nav = dir => window.$?.(bookRef.current).turn(dir);
  useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowLeft') nav('previous');
      if (e.key === 'ArrowRight') nav('next');
      if (e.key === 'Escape') setModal(null);
    };
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, []);

  return (
      <main style={css.main}>
        <h1 style={css.h1}>Gallery</h1>
        <p style={css.sub}>{artist ? `Check out ${artist}’s work` : 'Check out work from all our artists'}</p>

        <div style={css.filters}>
          <button onClick={() => setArtist(null)} style={chip(!artist)}>All</button>
          {artists.map(a => (
              <button key={a} onClick={() => setArtist(a)} style={chip(artist === a)}>{a}</button>
        ))}
      </div>

        <div style={css.spread}>
          {/* faux margins / side-text */}
          <div style={css.marginLeft}><span>← swipe</span></div>

          <div style={css.bookWrap}>
            <div ref={bookRef}
                 style={{...css.book, width: size, height: size * (meta.rows / meta.cols)}}/>

            {sheets.length > 1 && (
                <>
                  <button style={{...css.arrow, left: 14}}
                          onClick={() => nav('previous')} disabled={page === 1}>‹
                  </button>
                  <button style={{...css.arrow, right: 14}}
                          onClick={() => nav('next')} disabled={page === sheets.length}>›
                  </button>
                </>
            )}
          </div>

          <div style={css.marginRight}><span>swipe →</span></div>
      </div>

        {modal && (
            <div style={css.modal} onClick={() => setModal(null)}>
              <img src={modal.src} alt={modal.alt} style={css.modalImg}/>
        </div>
      )}
    </main>
  );
}

/* 3 ▸ STYLES ---------------------------------------------------------- */
const palette = {
  brown: '#2B1E15',
  page: '#1A1715',      // unified dark page background
  cream: '#EFE7D9',
  gold: '#D6B46B',
  gray: '#6C6C6C'
};

const css = {
  main: {
    padding: '3rem .8rem', minHeight: '100vh',
    background: `${palette.brown} url('/images/background.webp') center/cover`,
    color: palette.cream, fontFamily: 'Lora,serif', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center'
  },
  h1: {fontFamily: 'Sancreek,cursive', fontSize: '2.4rem', color: palette.gold, marginBottom: '.5rem'},
  sub: {fontSize: '1rem', opacity: .9, marginBottom: '1.3rem'},
  filters: {display: 'flex', flexWrap: 'wrap', gap: '.7rem', marginBottom: '1.8rem'},
  spread: {display: 'flex', alignItems: 'center', gap: '10px'},
  marginLeft: {
    writingMode: 'vertical-rl', textOrientation: 'upright', fontSize: '.8rem',
    opacity: .6, userSelect: 'none'
  },
  marginRight: {
    writingMode: 'vertical-rl', textOrientation: 'upright', fontSize: '.8rem',
    opacity: .6, userSelect: 'none'
  },
  bookWrap: {position: 'relative', display: 'inline-flex', justifyContent: 'center'},
  book: {
    background: palette.page, padding: '1.2rem', borderRadius: '8px',
    boxShadow: '0 22px 48px rgba(0,0,0,.55)', userSelect: 'none'
  },
  arrow: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    fontSize: '2.6rem', color: palette.gold, background: 'none', border: 'none',
    cursor: 'pointer', opacity: .32, transition: 'all .18s'
  },
  modal: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,.92)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000
  },
  modalImg: {maxWidth: '96vw', maxHeight: '96vh', objectFit: 'contain', borderRadius: '10px'}
};

const chip = active => ({
  padding: '.72rem 1.45rem', borderRadius: '999px', fontWeight: 600, fontSize: '.9rem',
  background: active ? palette.gold : palette.gray,
  color: active ? '#111' : palette.cream, border: 'none', cursor: 'pointer',
  transition: 'background .2s'
});

/* global sheet css (dark page; no white) */
if (typeof window !== 'undefined' && !document.getElementById('flip-css')) {
  const rules = `
    .page{background:${palette.page};padding:20px;box-sizing:border-box;border-radius:6px}
    .centerText,.sheetT{display:flex;justify-content:center;align-items:center;height:100%;
      font-family:'Sancreek',cursive;font-size:1.35rem;color:${palette.gold};text-align:center;padding:0 1rem}
    .grid{display:grid;gap:14px;width:100%;height:100%}
    .cell{border-radius:6px;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.03)}
    button[disabled]{opacity:.17;cursor:default}
    button:hover:not([disabled]){opacity:.85;transform:scale(1.1)}
  `;
  const style = document.createElement('style');
  style.id = 'flip-css';
  style.textContent = rules;
  document.head.appendChild(style);
}
