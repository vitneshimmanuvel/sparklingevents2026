import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SpecializedComponent = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const headingRef = useRef(null);
  const subHeading1Ref = useRef(null);
  const subHeading2Ref = useRef(null);
  const institutionsRef = useRef([]);
  const trailContainerRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const throttleTimeout = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const images = [
    '/1.jpg',
    '/2.jpg',
    '/3.jpg',
    '/4.jpg',
    '/5.jpg',
    '/6.jpg',
    '/7.jpg',
    '/8.jpg'
  ];

  const institutions = [
    "VETINSTITUTION YUGA FEST",
    "KSR INSTITUTION",
    "NANDHA INSTITUTION",
    "SRI SHANMUGA INSTITUTION",
    "BUILDERS ENGINEERING COLLEGE",
    "PAVENTHAR INSTITUTION",
    "SRI VASAVI INSTITUTION"
  ];

  // Create golden blur elements
  const goldenBlurs = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 120 + 80,
    left: Math.random() * 100,
    top: Math.random() * 100,
    opacity: Math.random() * 0.3 + 0.1,
    blur: Math.random() * 20 + 10
  }));

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Set initial positions
    gsap.set([headingRef.current, subHeading1Ref.current, subHeading2Ref.current], {
      opacity: 0,
      y: 30
    });

    // Create timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        end: "bottom 30%",
        scrub: 0.8,
        markers: false
      }
    });

    // Animate text elements with stagger
    tl.to(headingRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, 0.2)
    .to(subHeading1Ref.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, 0.4)
    .to(subHeading2Ref.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, 0.6);

    // Animate institution items with modern entrance
    institutionsRef.current.forEach((el, i) => {
      tl.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      }, 0.8 + i * 0.15);
    });

    return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const container = containerRef.current;
    if (!container) return;

    const createImageTrail = (x, y) => {
      const img = document.createElement('img');
      const randomImage = images[Math.floor(Math.random() * images.length)];
      img.src = randomImage;
      img.className = 'trail-image';
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;
      trailContainerRef.current.appendChild(img);

      gsap.fromTo(img,
        { opacity: 0, scale: 0, x: "-50%", y: "-50%" },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.7)",
          onComplete: () => {
            gsap.to(img, {
              opacity: 0,
              scale: 0.5,
              duration: 0.4,
              onComplete: () => {
                if (trailContainerRef.current.contains(img)) {
                  trailContainerRef.current.removeChild(img);
                }
              }
            });
          }
        });
    };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      lastPos.current = { x, y };
      if (!throttleTimeout.current) {
        createImageTrail(x, y);
        throttleTimeout.current = setTimeout(() => {
          throttleTimeout.current = null;
        }, 100);
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      if (throttleTimeout.current) clearTimeout(throttleTimeout.current);
    };
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      className="specialized-container"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Golden blurs background */}
      {goldenBlurs.map(blur => (
        <div 
          key={blur.id}
          className="golden-blur"
          style={{
            position: 'absolute',
            left: `${blur.left}%`,
            top: `${blur.top}%`,
            width: `${blur.size}px`,
            height: `${blur.size}px`,
            background: 'radial-gradient(circle, rgba(212,175,55,0.5) 0%, rgba(212,175,55,0) 70%)',
            borderRadius: '50%',
            filter: `blur(${blur.blur}px)`,
            opacity: blur.opacity,
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* Mouse trail container */}
      <div
        ref={trailContainerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 2,
          overflow: 'hidden'
        }}
      />

      {/* Content container */}
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          maxWidth: '900px',
          width: '100%',
          textAlign: 'center',
          zIndex: 3,
          padding: '20px'
        }}
      >
        <h1 ref={headingRef} style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          marginBottom: '1.5rem',
          color: '#fff',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          lineHeight: 1.2
        }}>
          WE SPECIALISE IN
        </h1>
        
        <h2 ref={subHeading1Ref} style={{
          fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
          marginBottom: '0.5rem',
          color: '#fff',
          fontWeight: 600,
          opacity: 0.9
        }}>
          COLLEGE & CORPORATE EVENTS FOR
        </h2>
        
        <h2 ref={subHeading2Ref} style={{
          fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
          marginBottom: '3rem',
          color: '#fff',
          fontWeight: 600,
          opacity: 0.9
        }}>
          CELEBRITIES MANAGEMENT
        </h2>

        <div style={{ marginTop: '3rem' }}>
          <h3 style={{
            fontSize: 'clamp(1.5rem, 2.5vw, 1.8rem)',
            marginBottom: '1.5rem',
            color: '#fff',
            fontWeight: 500,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            opacity: 0.8
          }}>
            OUR ELITE INSTITUTIONS
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '700px',
            margin: '0 auto',
          }}>
            {institutions.map((institution, index) => (
              <div
                key={index}
                ref={el => institutionsRef.current[index] = el}
                style={{
                  position: 'relative',
                  fontSize: 'clamp(1.1rem, 1.8vw, 1.3rem)',
                  margin: '0.8rem 0',
                  padding: '1.5rem 2rem',
                  color: '#fff',
                  fontWeight: 500,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  width: '100%',
                  boxSizing: 'border-box',
                  opacity: 0,
                  transform: 'translateY(30px)',
                  zIndex: 4,
                  overflow: 'hidden',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid transparent',
                  borderTop: '1px solid rgba(212, 175, 55, 0.5)',
                  borderBottom: '1px solid rgba(212, 175, 55, 0.5)',
                  textAlign: 'center'
                }}
                className="institution-item"
              >
                {institution}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .trail-image {
          position: absolute;
          width: 140px;
          height: 140px;
          object-fit: cover;
          transform-origin: center;
          pointer-events: none;
          z-index: 10000;
          border: 2px solid #D4AF37;
          filter: brightness(1.1) saturate(1.2);
        }
        
        .institution-item {
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        .institution-item:hover {
          transform: translateY(-5px) !important;
          border-top: 1px solid #D4AF37 !important;
          border-bottom: 1px solid #D4AF37 !important;
          box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3);
          background: rgba(20, 20, 20, 0.9) !important;
        }

        @media (max-width: 768px) {
          .specialized-container {
            padding: 1.5rem !important;
          }
          
          .trail-image {
            width: 100px !important;
            height: 100px !important;
          }
          
          .institution-item {
            padding: 1.2rem !important;
          }
        }

        @media (max-width: 480px) {
          .specialized-container {
            padding: 1rem !important;
          }
          
          .institution-item {
            padding: 1rem !important;
          }
          
          .golden-blur {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default SpecializedComponent;