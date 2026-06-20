// src/components/CircularScroll.jsx
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const CircularScroll = () => {
  // Refs for GSAP animations
  const containerRef = useRef(null);
  const backgroundRef = useRef(null);
  const circleRef = useRef(null);
  const cardsRef = useRef([]);
  
  // Card data
  const cards = [
    { 
      title: "Teilprojektleitung", 
      description: "(s. B. Catering, Geschmungsmart, Künstler, Logistik, Content etc.)" 
    },
    { title: "Gesamtprojektleitung" },
    { title: "Regie-Assistenz" },
    { title: "Event Konzeption" },
    { title: "Technische Leitung" },
  ];

  // Set up GSAP animations on component mount
  useEffect(() => {
    if (!containerRef.current || !backgroundRef.current || !circleRef.current) return;

    // Background zoom animation
    gsap.to(backgroundRef.current, {
      scale: 1.2,
      scrollTrigger: {
        trigger: containerRef.current,
        scrub: 1,
        start: "top top",
        end: "bottom bottom",
      }
    });

    // Circular card movement
    const circle = circleRef.current;
    const radius = window.innerWidth > 768 ? 500 : 300;
    const cards = cardsRef.current;
    
    // Position cards in a circle
    cards.forEach((card, i) => {
      const angle = (i * (360 / cards.length)) - 90; // Start from top
      const x = radius * Math.cos(angle * Math.PI / 180);
      const y = radius * Math.sin(angle * Math.PI / 180);
      
      gsap.set(card, {
        x: x,
        y: y,
        rotation: angle + 90 // Keep text upright
      });
    });

    // Rotate the circle container on scroll
    gsap.to(circle, {
      rotation: 360,
      scrollTrigger: {
        trigger: containerRef.current,
        scrub: 0.5,
        start: "top top",
        end: "bottom bottom",
      },
      ease: "none"
    });

    // Clean up ScrollTrigger on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="circular-scroll" ref={containerRef}>
      {/* Fixed background */}
      <div className="background" ref={backgroundRef}></div>
      
      {/* Navigation bar */}
      <nav className="navbar">
        <div className="logo">TIMES EVENT</div>
        <ul className="nav-links">
          <li>Start</li>
          <li>Über mich</li>
          <li>Services</li>
          <li>Testimonials</li>
          <li>Kontakt</li>
        </ul>
      </nav>
      
      {/* Circular card container */}
      <div className="circle-container" ref={circleRef}>
        {cards.map((card, index) => (
          <div 
            key={index}
            className="card"
            ref={el => cardsRef.current[index] = el}
          >
            <h3>{card.title}</h3>
            {card.description && <p>{card.description}</p>}
          </div>
        ))}
      </div>
      
      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <span>Scrollen</span>
        <div className="arrow"></div>
      </div>
    </div>
  );
};

export default CircularScroll;