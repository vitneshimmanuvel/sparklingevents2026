import React, { useState, useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

const fallbackImages = [
  '/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg', '/5.jpg', '/6.jpg', '/7.jpg', '/8.jpg'
];

const ImageSlideshow = () => {
  const [images, setImages] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/slider-images`);
        if (res.ok) {
          const data = await res.json();
          if (data.images && data.images.length > 0) {
            setImages(data.images.map(img => img.image_url));
          } else {
            setImages(fallbackImages);
          }
        } else {
          setImages(fallbackImages);
        }
      } catch (err) {
        console.error('Failed to fetch slider images:', err);
        setImages(fallbackImages);
      }
    };
    fetchImages();
  }, []);

  const getMarqueeImages = () => {
    if (images.length === 0) return [];
    // Repeat to ensure marquee track width exceeds screen width
    let repeated = [];
    for (let i = 0; i < 4; i++) {
      repeated = [...repeated, ...images];
    }
    return repeated;
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  if (images.length === 0) return null;

  return (
    <section className="gallery-marquee-section">
      <div className="gallery-header">
        <h2 className="gallery-heading">OUR GALLERY</h2>
        <div className="gallery-gold-line" />
        <p className="gallery-subheading">Hover or click to pause. Moments that sparkle forever.</p>
      </div>

      <div 
        ref={containerRef}
        className="marquee-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={togglePause}
        style={{ cursor: 'pointer' }}
      >
        <div 
          className="marquee-track"
          style={{
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {getMarqueeImages().map((src, i) => (
            <img 
              key={`gallery-${i}`} 
              src={src} 
              alt="Gallery event" 
              className="marquee-img" 
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        .gallery-marquee-section {
          background: linear-gradient(180deg, #000000 0%, #0a0a0a 100%);
          padding: 4rem 0;
          overflow: hidden;
          position: relative;
        }

        .gallery-header {
          text-align: center;
          margin-bottom: 2.5rem;
          padding: 0 1rem;
        }

        .gallery-heading {
          color: #f9e076;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          letter-spacing: 4px;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
        }

        .gallery-gold-line {
          height: 2px;
          background: linear-gradient(90deg, transparent, #d4af37, #f9e076, #d4af37, transparent);
          width: 250px;
          margin: 0.5rem auto 1rem;
        }

        .gallery-subheading {
          color: #d4c7a2;
          font-size: clamp(0.85rem, 2vw, 1rem);
          letter-spacing: 0.5px;
          opacity: 0.8;
        }

        .marquee-container {
          width: 100%;
          overflow: hidden;
          padding: 1rem 0;
          position: relative;
        }

        .marquee-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: scrollLeftToRight 30s linear infinite;
        }

        .marquee-img {
          width: clamp(220px, 25vw, 320px);
          aspect-ratio: 16 / 10;
          object-fit: cover;
          border-radius: 12px;
          border: 1.5px solid rgba(212, 175, 55, 0.3);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .marquee-img:hover {
          transform: scale(1.04);
          border-color: #f9e076;
          box-shadow: 0 15px 30px rgba(212, 175, 55, 0.2);
        }

        @keyframes scrollLeftToRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
};

export default ImageSlideshow;
