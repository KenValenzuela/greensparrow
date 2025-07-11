'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function ImageUpload({ images, setImages, max = 3 }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const limited = acceptedFiles.slice(0, max - images.length);

      const newImageObjects = limited.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setImages((prev) => [...prev, ...newImageObjects]);
    },
    [images, setImages, max]
  );

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: max,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #F1EDE0',
          borderRadius: '8px',
          padding: '1rem',
          textAlign: 'center',
          backgroundColor: isDragActive ? '#333' : '#2a2a2a',
          color: '#F1EDE0',
          cursor: 'pointer',
          fontFamily: 'Lora, serif',
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop images here...</p>
        ) : (
          <p>Click or drag & drop up to {max} image{max > 1 ? 's' : ''}.</p>
        )}
      </div>

      {images.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            marginTop: '1rem',
          }}
        >
          {images.map(({ preview }, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                width: '100px',
                height: '100px',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <img
                src={preview}
                alt={`Preview ${i}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  background: '#E5948B',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
