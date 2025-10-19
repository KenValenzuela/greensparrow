// src/components/Testimonials.jsx
'use client';

import {useMemo, useState} from 'react';
import {useReducedMotion} from 'framer-motion';

/* ---------- your reviews (extend freely) ---------- */
const REVIEWS = [
  {
    author: 'nerdymacandcheese',
    rating: 5,
    when: '4 weeks ago',
    text: 'Stella was absolutely amazing. Booked a free apprentice tattoo and the whole experience was wonderful. Skill is outstanding and the shop vibes were immaculate.',
    artists: ['Stella']
  },
  {
    author: 'E M',
    rating: 5,
    when: '6 months ago',
    text: 'Ki freehanded two large, detailed pieces and I get compliments everywhere. Super clean, skilled, and great energy. 10/10 recommend.',
    artists: ['Ki']
  },
  {
    author: 'Sam Landon',
    rating: 5,
    when: '2 months ago',
    text: 'First tattoo with Ki—looks great. Also got pierced at a flash event by Axel. Loved both experiences and will be back.',
    artists: ['Ki', 'Axel']
  },
  {
    author: 'Cait Foster',
    rating: 5,
    when: '6 months ago',
    text: 'T was AMAZING—best service I’ve had. Made me comfortable and the tattoos are flawless. Highly recommend.',
    artists: ['T']
  },
  {
    author: 'Tanisha Moore-Henry',
    rating: 5,
    when: '5 months ago',
    text: 'Joe is light-handed, detail-oriented, and checks in often. He’s done two pieces for me so far. I’ll be back for more.',
    artists: ['Joe']
  },
  {
    author: 'Paige Brayer',
    rating: 5,
    when: '2 months ago',
    text: 'Pieces by Ki and Mickey—mostly freehand—and I leave feeling like a masterpiece every time.',
    artists: ['Ki', 'Mickey']
  },
  {
    author: 'Gina Guerin',
    rating: 5,
    when: '6 months ago',
    text: 'Ki is the only one I trust. Cozy shop with lots of character, friendly staff, and very clean. Can’t wait to come back.',
    artists: ['Ki']
  },
  {
    author: 'Marisa Hernandez',
    rating: 5,
    when: '1 month ago',
    text: 'I always see T—four recent tattoos and every one is vibrant and amazing.',
    artists: ['T']
  },
  {
    author: 'Nicholas Magel',
    rating: 5,
    when: '2 months ago',
    text: 'Incredible artists. Incredible people. Immaculate vibes. Always an amazing time.',
    artists: []
  },
];

/* ---------- helpers ---------- */
function dedupe(arr) {
  const seen = new Set();
  return arr.filter(r => {
    const key = `${(r.author || '').trim()}|${(r.text || '').trim()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function shuffle(arr, seed) {
  let s = seed || 1337;
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Testimonials() {
  const prefersReducedMotion = useReducedMotion();
  const [seed] = useState(() => Date.now() & 0xffff);

  const lane = useMemo(() => {
    const uniq = dedupe(REVIEWS);
    const shuffled = shuffle(uniq, seed);
    return [...shuffled, ...shuffled];
  }, [seed]);

  if (prefersReducedMotion) {
    // Fallback: manual horizontal scroll with snap (no autoplay)
    return (
        <section id="testimonials" aria-label="Customer testimonials" className="relative w-full px-6 py-16 md:py-20">
          <h2 className="text-center uppercase tracking-wide mb-8 md:mb-10 text-4xl md:text-5xl"
              style={{fontFamily: 'Sancreek, cursive', color: '#e39289'}}>
            Testimonials
          </h2>

          {/* REMOVED white outline: drop 'border border-white/10' */}
          <div className="mx-auto max-w-6xl rounded-xl bg-white/5 backdrop-blur">
            <div className="overflow-x-auto snap-x snap-mandatory px-6 py-8 md:px-8 md:py-10">
              <div className="flex gap-6 md:gap-8">
                {dedupe(REVIEWS).map((r, i) => (
                    <ReviewCard key={`${i}-${r.author}`} className="snap-start" review={r}/>
                ))}
              </div>
            </div>
          </div>
        </section>
    );
  }

  // Animated ONE-LANE marquee (leftward, easy on the eyes)
  return (
      <section id="testimonials" aria-label="Customer testimonials" className="relative w-full px-6 py-16 md:py-20">
        <h2 className="text-center uppercase tracking-wide mb-8 md:mb-10 text-4xl md:text-5xl"
            style={{fontFamily: 'Sancreek, cursive', color: '#e39289'}}>
          Testimonials
        </h2>

        {/* REMOVED white outline: drop 'border border-white/10' */}
        <div className="mx-auto max-w-6xl rounded-xl bg-white/5 backdrop-blur">
          <div className="marquee relative overflow-hidden group" aria-live="polite">
            {/* edge fades */}
            <div
                className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-14 bg-gradient-to-r from-black/60 to-transparent z-10"/>
            <div
                className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-14 bg-gradient-to-l from-black/60 to-transparent z-10"/>

            <div className="track" style={{'--dur': `${Math.max(36, lane.length * 4)}s`}}>
              {lane.map((r, i) => <ReviewCard key={`${i}-${r.author}`} review={r}/>)}
            </div>
          </div>
        </div>

        <style jsx global>{`
          .marquee {
            padding: 1.6rem 1rem 2rem;
          }

          .marquee .track {
            display: inline-flex;
            align-items: stretch;
            gap: 1.5rem;
            padding: 1.2rem;
            white-space: nowrap; /* single row */
            animation: slide-left var(--dur, 48s) linear infinite;
            will-change: transform;
          }

          .marquee:hover .track,
          .marquee :focus-within .track {
            animation-play-state: paused;
          }

          @keyframes slide-left {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
            /* array is duplicated */
          }

          /* Card sizing & readability — no truncation */
          .review-card {
            width: clamp(320px, 40vw, 440px);
            min-height: 260px;
            display: inline-flex;
            flex-direction: column;
            white-space: normal; /* wrap INSIDE cards */
          }

          .review-text {
            color: rgba(20, 20, 20, 0.95);
            background: #fff;
            border-radius: 12px;
            padding: 12px 14px;
            box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
            font-size: 15.5px;
            line-height: 1.62;
            overflow: visible; /* never truncate */
          }
        `}</style>
    </section>
  );
}

/* ---------- subcomponents ---------- */

function ReviewCard({review, className = ''}) {
  const {author, when, rating = 5, text, artists = []} = review || {};
  return (
      <article
          tabIndex={0}
          role="listitem"
          className={[
            'review-card rounded-xl bg-white/95 text-neutral-900',
            'shadow-[0_6px_28px_rgba(0,0,0,0.20)]',
            'px-6 py-6 md:px-7 md:py-7',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e39289]/70',
            className,
          ].join(' ')}
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <Stars rating={rating}/>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-neutral-700">
              <span className="font-semibold">{author}</span>
              {when ? <span className="whitespace-nowrap text-neutral-500">· {when}</span> : null}
            </div>
          </div>
          {!!artists.length && (
              <span
                  className="rounded-full bg-[#e39289]/20 border border-[#e39289]/40 text-[#e39289] px-3 py-1 text-xs font-medium">
            {artists.join(' • ')}
          </span>
          )}
        </header>

        <p className="review-text mt-4">{text}</p>
      </article>
  );
}

function Stars({rating = 5}) {
  const full = Math.floor(rating);
  const empty = 5 - full;
  return (
      <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
        {Array.from({length: full}).map((_, i) => <Star key={`f-${i}`}/>)}
        {Array.from({length: empty}).map((_, i) => <Star key={`e-${i}`} empty/>)}
      </div>
  );
}

function Star({empty}) {
  return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill={empty ? 'none' : '#f1df58'} stroke="#1e88e5" strokeWidth="1"
           aria-hidden="true">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.25l-7.19-.62L12 2 9.19 8.63 2 9.25l5.46 4.72L5.82 21z"/>
      </svg>
  );
}
