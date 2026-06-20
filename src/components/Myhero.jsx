import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ModernHero = () => {
  const backRef = useRef();
  const textRef = useRef();
  const line1Ref = useRef();
  const line2Ref = useRef();
  const contactRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      // Contact animation
      tl.from(contactRef.current, {
        opacity: 0,
        x: -20,
        duration: 0.8,
        ease: "power2.out"
      });
      
      // Text reveal animation
      tl.from([line1Ref.current, line2Ref.current], {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 1.2,
        ease: "expo.out"
      }, "-=0.3");
      
      // Background animation
      tl.from(backRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 1.5,
        ease: "power2.out"
      }, "-=1.2");
      
      // Parallax effect
      gsap.to(backRef.current, {
        y: 100,
        ease: "power1.out",
        scrollTrigger: {
          trigger: ".modern-hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="modern-hero" style={styles.container}>
      {/* Background with parallax effect */}
      <img
        ref={backRef}
        src="backgorud.jpg"
        alt="Sparkling event background"
        style={styles.backgroundImage}
      />
      
      {/* Overlay for better text readability */}
      <div style={styles.overlay}></div>
      
      {/* Contact details with golden line */}
      <div ref={contactRef} style={styles.contactContainer}>
        <div style={styles.goldenLine}></div>
        <div style={styles.contactDetails}>
          <span style={styles.contactNumber}>87782 36613</span>
          <span style={styles.contactDivider}>/</span>
          <span style={styles.contactNumber}>9715877938</span>
        </div>
      </div>
      
      {/* Main heading with split text animation */}
      <h1 ref={textRef} style={styles.heading}>
        <div ref={line1Ref} style={styles.headingLine}>SPARKLING</div>
        <div ref={line2Ref} style={styles.headingLine}>EVENTS & ENTERTAINMENT</div>
      </h1>
      
      {/* Decorative elements */}
      <div style={styles.sparkle1}></div>
      <div style={styles.sparkle2}></div>
    </div>
  );
};

export default ModernHero;

// Styles
const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',
    fontFamily: "'Inter', sans-serif",
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1,
    willChange: 'transform',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(45deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)',
    zIndex: 2,
  },
  heading: {
    position: 'absolute',
    top: '35vh', // Positioned higher on the screen
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#ffffff',
    textAlign: 'center',
    textShadow: '0px 4px 15px rgba(0,0,0,0.8)',
    zIndex: 4,
    width: '90%',
    maxWidth: '1200px',
    padding: '0 1rem',
    margin: 0,
  },
  headingLine: {
    fontSize: 'clamp(2rem, 5vw, 4.5rem)', // Better mobile sizing
    fontWeight: 800,
    lineHeight: 1.1, // Tighter line height for mobile
    margin: '0.25rem 0', // Reduced margin for mobile
    letterSpacing: '-0.03em',
    textTransform: 'uppercase',
  },
  contactContainer: {
    position: 'absolute',
    top: '2rem',
    right: '2rem',
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
  },
  goldenLine: {
    height: '30px',
    width: '3px',
    background: 'linear-gradient(180deg, #D4AF37 0%, #FFD700 100%)',
    marginRight: '1rem',
  },
  contactDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: 'clamp(0.8rem, 1.2vw, 1.1rem)', // Better mobile sizing
    fontWeight: 500,
    color: '#fff',
    textShadow: '0px 1px 2px rgba(0,0,0,0.5)',
  },
  contactNumber: {
    letterSpacing: '0.05em',
  },
  contactDivider: {
    color: '#D4AF37',
    fontWeight: 700,
  },
  sparkle1: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    width: '10px',
    height: '10px',
    background: '#FFD700',
    borderRadius: '50%',
    boxShadow: '0 0 20px 8px rgba(255, 215, 0, 0.6)',
    zIndex: 3,
    animation: 'pulse 3s infinite',
  },
  sparkle2: {
    position: 'absolute',
    bottom: '25%',
    right: '25%',
    width: '8px',
    height: '8px',
    background: '#FFD700',
    borderRadius: '50%',
    boxShadow: '0 0 15px 5px rgba(255, 215, 0, 0.6)',
    zIndex: 3,
    animation: 'pulse 4s infinite 1s',
  },
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)', opacity: 0.8 },
    '50%': { transform: 'scale(1.3)', opacity: 1 },
    '100%': { transform: 'scale(1)', opacity: 0.8 },
  }
};