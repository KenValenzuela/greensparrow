// src/app/gallery/BookClient.jsx
'use client';

import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom/client';
import Image from 'next/image';
import ensureTurn from '@/lib/ensureTurn';

/* helpers ----------------------------------------------------------- */
const metaFor = w =>
    w <= 360
        ? {cols: 1, rows: 1}
        : w <= 480
            ? {cols: 1, rows: 2}
            : w <= 767
                ? {cols: 2, rows: 2}
                : {cols: 3, rows: 2};

const clampW = w => Math.max(320, Math.min(760, w * 0.94));

export default function Book({images}) {
    const [meta, setMeta] = useState(() => metaFor(innerWidth));
    const [size, setSize] = useState(() => clampW(innerWidth));
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);

    const bookRef = useRef(null);

    /* resize */
    useEffect(() => {
        const fn = () => {
            setMeta(metaFor(innerWidth));
            setSize(clampW(innerWidth));
        };
        addEventListener('resize', fn);
        return () => removeEventListener('resize', fn);
    }, []);

    /* paginate → sheets */
    const per = meta.cols * meta.rows;
    const grids = [];
    for (let i = 0; i < images.length; i += per) grids.push(images.slice(i, i + per));
    const sheets = [{type: 'cover'}, ...grids.map(g => ({type: 'grid', data: g}))];
    if (sheets.length % 2) sheets.push({type: 'end'});

    /* build turn.js */
    useEffect(() => {
        let disposed = false;
        (async () => {
            await ensureTurn();
            if (disposed || !bookRef.current) return;

            const $ = window.$;
            const $b = $(bookRef.current);
            try {
                if ($b.data('turn')) $b.turn('destroy');
            } catch {
            }
            $b.empty();

            sheets.forEach(sh => {
                const $p = $('<div/>', {class: 'page'});
                if (sh.type === 'cover') {
                    $('<div/>', {class: 'center', html: '<span>📖 Start<br/>tap arrows</span>'}).appendTo($p);
                } else if (sh.type === 'end') {
                    $('<div/>', {class: 'center', html: '<span>✨ End ✨</span>'}).appendTo($p);
                } else {
                    const $g = $('<div/>', {
                        class: 'grid',
                        css: {
                            gridTemplateColumns: `repeat(${meta.cols},1fr)`,
                            gridTemplateRows: `repeat(${meta.rows},1fr)`
                        }
                    }).appendTo($p);

                    sh.data.forEach(img => {
                        const $c = $('<div/>', {class: 'cell'}).appendTo($g);
                        const wrap = document.createElement('div');
                        Object.assign(wrap.style, {
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer'
                        });
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
                        $c.append(wrap);
                    });
                }
                $b.append($p);
            });

            $b.turn({
                width: size,
                height: size * (meta.rows / meta.cols),
                autoCenter: true,
                elevation: 70,
                duration: 450,
                easing: 'cubic-bezier(.25,1,.3,1)'
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
    }, [size, meta, images]);

    /* nav helpers */
    const nav = dir => window.$?.(bookRef.current).turn(dir);

    /* arrows & modal */
    return (
        <>
            <div ref={bookRef} style={bookStyle(size, meta)}/>

            {sheets.length > 1 && (
                <>
                    <button style={{...arrowStyle, left: 12}} onClick={() => nav('previous')} disabled={page === 1}>
                        ‹
                    </button>
                    <button
                        style={{...arrowStyle, right: 12}}
                        onClick={() => nav('next')}
                        disabled={page === sheets.length}
                    >
                        ›
                    </button>
                </>
            )}

            {modal && (
                <div style={modalStyle} onClick={() => setModal(null)}>
                    <img src={modal.src} alt={modal.alt} style={modalImg}/>
                </div>
            )}
        </>
    );
}

/* inline styles (book only) */
const pageBg = '#1A1715';
const bookStyle = (w, meta) => ({
    background: pageBg,
    padding: '1.1rem',
    borderRadius: '8px',
    boxShadow: '0 22px 48px rgba(0,0,0,.55)',
    width: w,
    height: w * (meta.rows / meta.cols)
});
const arrowStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '2.6rem',
    color: '#D6B46B',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    opacity: 0.3,
    transition: 'opacity .18s'
};
const modalStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,.92)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
};
const modalImg = {
    maxWidth: '96vw',
    maxHeight: '96vh',
    objectFit: 'contain',
    borderRadius: '10px'
};

/* one-time global sheet rules */
if (typeof window !== 'undefined' && !document.getElementById('flip-css')) {
    const css = `
    .page{background:${pageBg};padding:20px;box-sizing:border-box;border-radius:6px}
    .center{display:flex;justify-content:center;align-items:center;height:100%;
      font-family:'Sancreek',cursive;font-size:1.35rem;color:#D6B46B;text-align:center;padding:0 1rem}
    .grid{display:grid;gap:14px;width:100%;height:100%}
    .cell{border-radius:6px;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04)}
    button[disabled]{opacity:.17;cursor:default}
    button:hover:not([disabled]){opacity:.85;transform:scale(1.1)}
  `;
    const tag = document.createElement('style');
    tag.id = 'flip-css';
    tag.textContent = css;
    document.head.appendChild(tag);
}
