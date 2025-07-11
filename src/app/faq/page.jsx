'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const sections = [
  {
    heading: 'General Questions',
    items: [
      {
        id: 'how-to-book',
        question: 'How do I book an appointment?',
        answer: 'Use our online booking form or email greensparrowtattooco@gmail.com. Include your idea, preferred artist, style, and references.',
      },
      {
        id: 'walk-ins',
        question: 'Do you take walk-ins?',
        answer: 'Our artists work by appointment. Walk-ins are occasionally accepted depending on availability but may be subject to long waits or cancellation.',
      },
      {
        id: 'pricing',
        question: 'What does a tattoo cost?',
        answer: 'Pricing depends on the artist, design complexity, and placement. Some charge hourly, others per piece. Estimates are discussed during consult.',
      },
      {
        id: 'age-limit',
        question: 'What’s the age requirement?',
        answer: 'You must be 18+ for tattoos. Piercings may be done for 16+ with a guardian and valid ID.',
      },
    ],
  },
  {
    heading: 'Tattoo Aftercare',
    items: [
      {
        id: 'day-one',
        question: 'What should I do on Day 1?',
        answer: 'Remove bandage after 2–4 hours. Wash with lukewarm water and mild soap. Pat dry and apply a thin layer of Aquaphor or balm.',
      },
      {
        id: 'healing-window',
        question: 'How long does healing take?',
        answer: '2–4 weeks typically. Avoid scratching, soaking, and excessive sun. Allow the skin to naturally peel and settle.',
      },
      {
        id: 'products',
        question: 'What products should I use?',
        answer: 'Unscented antibacterial soap, Aquaphor, Hustle Butter, or tattoo-specific balms. Avoid Vaseline, alcohol, and scented lotions.',
      },
      {
        id: 'aftercare-kit',
        question: 'Do you sell aftercare kits?',
        answer: (
          <>
            Yes! Our <strong>$5 kits</strong> include:
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.5rem' }}>
              <li>Aftercare instruction card</li>
              <li>Handmade hemp vegan soap bar</li>
              <li>Vitamin A+D ointment</li>
              <li>Studio contact info</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>
              <strong>Ingredients:</strong> Purified water, vegetable glycerin, olive oil, safflower oil, hemp seed
              oil, oat protein, propylene glycol, sorbitan oleate.
              <br />
              <em>Locally made. Vegan. Dye- and fragrance-free.</em>
            </p>
            <img
              loading="lazy"
              src="/images/shop-image.png"
              alt="Aftercare Kit"
              style={{
                marginTop: '1rem',
                borderRadius: '8px',
                maxWidth: '100%',
                border: '1px solid #333',
              }}
            />
          </>
        ),
      },
    ],
  },
  {
    heading: 'Studio Policies',
    items: [
      {
        id: 'consent-form',
        question: 'Do I need to sign a consent form?',
        answer: 'Yes. It’s required before any service. It covers risks, aftercare, policies, and confirms your understanding and condition.',
      },
      {
        id: 'refuse-service',
        question: 'Can you refuse service?',
        answer: 'Yes. We may refuse service for any reason, including inappropriate behavior or policy violations.',
      },
      {
        id: 'shop-minimum',
        question: 'Is there a shop minimum?',
        answer: 'Yes. $100 is our studio minimum. Designs under this amount may still be quoted directly with your artist.',
      },
      {
        id: 'guests',
        question: 'Can I bring guests?',
        answer: 'Yes, up to 2 guests are welcome. Additional guests may be asked to wait outside to keep the studio comfortable and safe.',
      },
      {
        id: 'pre-care',
        question: 'How do I prepare for my appointment?',
        answer: 'Eat, hydrate, and get rest before your session. Shower and wear clothing that allows easy access to the tattoo area.',
      },
      {
        id: 'accepted-id',
        question: 'What ID is accepted?',
        answer: 'U.S. driver’s license, passport, military ID, state ID (non-driver), and Tribal IDs with signature are all accepted in Arizona.',
      },
      {
        id: 'underage',
        question: 'What if I’m under 18?',
        answer: 'For piercings only. A parent/legal guardian must be present and complete the form on your behalf.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 500, once: true });
  }, []);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.overlay} />
      <div style={styles.page}>
        <aside style={styles.toc} className="hidden md:block">
          <div style={styles.tocInner}>
            <h3 style={styles.tocHeading}>Jump to</h3>
            {sections.map((section, idx) => (
              <a key={idx} href={`#section-${idx}`} style={styles.tocLink}>
                {section.heading}
              </a>
            ))}
          </div>
        </aside>

        <main style={styles.content}>
          <h1 style={styles.heading}>FAQs, Aftercare & Policies</h1>

          {sections.map((section, idx) => (
            <section key={idx} id={`section-${idx}`} data-aos="fade-up" style={{ marginBottom: '3rem' }}>
              <h2 style={styles.sectionHeading}>{section.heading}</h2>
              {section.items.map((item) => (
                <div key={item.id} style={styles.accordionItem}>
                  <button onClick={() => toggle(item.id)} style={styles.accordionButton}
                          aria-expanded={openId === item.id}>
                    <span>{item.question}</span>
                    <span style={styles.icon}>
  {openId === item.id ? (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round"
           strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
  ) : (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round"
           strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
  )}
</span>

                  </button>
                  <AnimatePresence initial={false}>
                    {openId === item.id && (
                        <motion.div
                            initial={{height: 0, opacity: 0}}
                            animate={{height: 'auto', opacity: 1}}
                            exit={{height: 0, opacity: 0}}
                            style={styles.answerWrapper}
                        >
                          <div style={styles.answer}>{item.answer}</div>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    backgroundImage: "url('/images/background.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(10,10,10,0.85)',
    zIndex: 0,
  },
  page: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'row',
    padding: '4rem 1rem',
    maxWidth: '1200px',
    margin: '0 auto',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  toc: {
    position: 'sticky',
    top: '6rem',
    minWidth: '220px',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  tocInner: {
    borderLeft: '2px solid #444',
    paddingLeft: '1rem',
  },
  tocHeading: {
    fontSize: '1rem',
    textTransform: 'uppercase',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#ccc',
  },
  tocLink: {
    display: 'block',
    fontSize: '0.95rem',
    margin: '0.4rem 0',
    textDecoration: 'none',
    color: '#aaa',
  },
  content: {
    flex: 1,
    minWidth: '0',
  },
  heading: {
    fontSize: '2.25rem',
    fontWeight: '600',
    marginBottom: '2.5rem',
    color: '#fff',
  },
  sectionHeading: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#ffffff',
  },
  accordionItem: {
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '6px',
    marginBottom: '1rem',
    overflow: 'hidden',
  },
  accordionButton: {
    width: '100%',
    textAlign: 'left',
    padding: '1rem',
    fontSize: '1.1rem',
    fontWeight: '500',
    color: '#fff',
    background: 'transparent',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  icon: {
    width: '20px',
    height: '20px',
  },
  answerWrapper: {
    padding: '0 1rem 1rem',
  },
  answer: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#ccc',
  },
};
