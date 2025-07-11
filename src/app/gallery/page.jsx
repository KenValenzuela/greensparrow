'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const artistImageMap = {
  Joe: ['joe_1.jpg', 'joe_2.jpg', 'joe_3.jpg', 'joe_4.jpg', 'joe_5.jpg', 'joe_6.jpg', 'joe_7.jpg', 'joe_8.jpg', 'joe_9.jpg', 'joe_10.jpg'],
  Mickey: ['mickey_1.jpeg', 'mickey_2.jpeg', 'mickey_3.jpeg', 'mickey_4.jpeg', 'mickey_6.jpeg', 'mickey_7.jpeg', 'mickey_8.jpeg', 'mickey_9.jpeg', 'mickey_10.jpeg', 'mickey_11.jpeg', 'mickey_12.jpeg', 'mickey_13.jpeg'],
  T: ['t_1.jpeg', 't_2.jpeg', 't_3.jpeg', 't_4.jpeg', 't_5.jpeg', 't_6.jpeg', 't_7.jpeg', 't_8.jpeg', 't_9.jpeg', 't_10.jpeg', 't_11.jpeg', 't_12.jpeg', 't_13.jpeg', 't_14.jpeg', 't_15.jpeg', 't_16.jpeg', 't_17.jpeg', 't_18.jpeg'],
  Ki: ['ki_1.jpeg', 'ki_2.jpeg', 'ki_3.jpeg', 'ki_4.jpeg', 'ki_5.jpeg', 'ki_6.jpeg', 'ki_7.jpeg', 'ki_8.jpeg', 'ki_9.jpeg', 'ki_10.jpeg', 'ki_11.jpeg', 'ki_12.jpeg', 'ki_13.jpeg', 'ki_14.jpeg', 'ki_15.jpeg', 'ki_16.jpeg', 'ki_17.jpeg'],
  Axel: ['axel_1.jpeg', 'axel_2.jpeg', 'axel_3.jpeg', 'axel_4.jpeg', 'axel_5.jpeg', 'axel_6.jpeg', 'axel_7.jpeg', 'axel_9.jpeg', 'axel_10.jpeg', 'axel_11.jpeg', 'axel_15.jpeg'],
  Dallon:['dallon_1.jpeg','dallon_2.jpeg','dallon_3.jpeg','dallon_4.jpeg','dallon_5.jpeg','dallon_6.jpeg','dallon_7.jpeg'],
  Mia:['mia_1.jpeg','mia_2.jpeg','mia_3.jpeg','mia_4.jpeg','mia_5.jpeg','mia_6.jpeg']
};

const artists = Object.keys(artistImageMap);

export default function GalleryPage() {
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalImage, setModalImage] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);

  const imagesPerPage = 15;

  const filteredImages = selectedArtist
    ? artistImageMap[selectedArtist].map((file) => ({
        src: `/images/artists/${selectedArtist.toLowerCase()}/work/${file}`,
        artist: selectedArtist
      }))
    : artists.flatMap((artist) =>
        artistImageMap[artist].map((file) => ({
          src: `/images/artists/${artist.toLowerCase()}/work/${file}`,
          artist
        }))
      );

  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
  const paginatedImages = filteredImages.slice(
    (currentPage - 1) * imagesPerPage,
    currentPage * imagesPerPage
  );

  const resetPagination = () => setCurrentPage(1);

  // Modal key listeners
  useEffect(() => {
    const handleKey = (e) => {
      if (!modalImage) return;
      if (e.key === 'Escape') setModalImage(null);
      if (e.key === 'ArrowRight') setModalIndex((i) => (i + 1) % filteredImages.length);
      if (e.key === 'ArrowLeft') setModalIndex((i) => (i - 1 + filteredImages.length) % filteredImages.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [modalImage]);

  useEffect(() => {
    if (modalImage) {
      setModalImage(filteredImages[modalIndex]);
    }
  }, [modalIndex]);

  return (
    <main style={styles.main}>
      <h1 style={styles.heading}>Gallery</h1>

      <div style={styles.filters}>
        <button onClick={() => { setSelectedArtist(null); resetPagination(); }} style={filterBtn(!selectedArtist)}>All</button>
        {artists.map((artist) => (
          <button
            key={artist}
            onClick={() => { setSelectedArtist(artist); resetPagination(); }}
            style={filterBtn(selectedArtist === artist)}
          >
            {artist}
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        <AnimatePresence>
          {paginatedImages.map(({ src, artist }, idx) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              style={styles.imageWrapper}
              onClick={() => {
                setModalIndex(filteredImages.findIndex((img) => img.src === src));
                setModalImage({ src, artist });
              }}
            >
              <img src={src} alt={`${artist} work ${idx + 1}`} loading="lazy" style={styles.image} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div style={styles.pagination}>
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} style={styles.pageBtn}>Previous</button>
        <span style={styles.pageCount}>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} style={styles.pageBtn}>Next</button>
      </div>

      {/* FULLSCREEN MODAL */}
      {modalImage && (
        <div style={styles.modal} onClick={() => setModalImage(null)}>
          <img src={modalImage.src} alt="fullscreen tattoo" style={styles.modalImg} />
        </div>
      )}
    </main>
  );
}

const styles = {
  main: {
    padding: '3rem 1rem',
    backgroundImage: "linear-gradient(rgba(15,15,15,0.85), rgba(15,15,15,0.85)), url('/images/background.png')",
    backgroundSize: 'cover',
    backgroundRepeat: 'repeat',
    minHeight: '100vh',
    fontFamily: 'Lora, serif',
    color: '#F1EDE0'
  },
  heading: {
    fontFamily: 'Sancreek, cursive',
    fontSize: '2.4rem',
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#E8B562'
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '2rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '1rem',
    justifyItems: 'center'
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: '1 / 1',
    overflow: 'hidden',
    borderRadius: '6px',
    backgroundColor: '#1e1e1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'zoom-in'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    border: '1px solid #444',
    borderRadius: '6px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem'
  },
  pageBtn: {
    padding: '0.5rem 1rem',
    fontFamily: 'Lora, serif',
    fontWeight: 'bold',
    backgroundColor: '#2a2a2a',
    color: '#F1EDE0',
    border: '1px solid #666',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  pageCount: {
    fontFamily: 'Lora, serif',
    fontSize: '0.95rem'
  },
  modal: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.95)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: '1rem',
    cursor: 'zoom-out'
  },
  modalImg: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: '8px',
    boxShadow: '0 0 16px rgba(0,0,0,0.8)'
  }
};

const filterBtn = (active) => ({
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  fontFamily: 'Lora, serif',
  background: active ? '#E8B562' : '#2a2a2a',
  color: active ? '#111' : '#F1EDE0',
  border: active ? '2px solid #E8B562' : '1px solid #666',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out'
});
