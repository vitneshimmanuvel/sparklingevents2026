import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Sectiontwo = () => {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const [cursorVisible, setCursorVisible] = useState(false);
  const topLineRef = useRef(null);
  const sectionRef = useRef(null);

  const whatWeDoLines = [
    "CELEBRITIES EVENT",
    "SHOP OPENING",
    "WEDDING FUNCTION",
    "ADS CELEBRITIES",
    "PROMOTION",
    "CORPORATE EVENT",
    "BEHIND WOOD INTERVIEW",
    "INSTAGRAM PROMOTIONS",
  ];

  useEffect(() => {
    // Top line animation with reverse
    gsap.fromTo(
      topLineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none reverse none", // Reverse on scroll back
          markers: false, // Set to true for debugging
        },
      }
    );

    // Text reveal animation with reverse
    const lines = gsap.utils.toArray(".what-we-do-line");
    
    lines.forEach((line, i) => {
      const words = line.querySelectorAll(".word");
      const underline = line.querySelector(".underline");
      
      // Set initial state
      gsap.set(words, { y: "100%", opacity: 0 });
      gsap.set(underline, { scaleX: 0 });
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: line,
          start: "top 85%",
          end: "bottom 60%",
          toggleActions: "play none reverse none", // Reverse on scroll back
          markers: false, // Set to true for debugging
        }
      });
      
      // Word reveal animation
      tl.to(words, {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: "power3.out"
      });
      
      // Underline animation
      tl.to(underline, {
        scaleX: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.3");
    });

    return () => ScrollTrigger.getAll().forEach(st => st.kill());
  }, []);

  useEffect(() => {
    // Cursor effect
    const cursor = cursorRef.current;
    if (!cursor || !containerRef.current) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId;

    const updatePosition = () => {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      rafId = requestAnimationFrame(updatePosition);
    };

    const mouseMoveHandler = (e) => {
      const bounds = containerRef.current.getBoundingClientRect();
      mouseX = e.clientX - bounds.left - 40;
      mouseY = e.clientY - bounds.top - 40;
    };

    const container = containerRef.current;
    container.addEventListener("mousemove", mouseMoveHandler);
    updatePosition();

    const enterHandler = () => setCursorVisible(true);
    const leaveHandler = () => setCursorVisible(false);
    container.addEventListener("mouseenter", enterHandler);
    container.addEventListener("mouseleave", leaveHandler);

    return () => {
      container.removeEventListener("mousemove", mouseMoveHandler);
      cancelAnimationFrame(rafId);
      container.removeEventListener("mouseenter", enterHandler);
      container.removeEventListener("mouseleave", leaveHandler);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        padding: "100px 20px",
        textAlign: "center",
        overflow: "hidden",
        maxWidth: "100%",
        margin: "0 auto",
        position: "relative",
        cursor: "none",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Container for cursor effect */}
      <div ref={containerRef} style={{ position: "relative", height: "100%" }}>
        {/* Top Line */}
        <div 
          ref={topLineRef}
          style={{
            position: "absolute",
            top: "50px",
            left: "20px",
            right: "20px",
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.3)",
            transformOrigin: "left center",
          }}
        />

        <h2
          style={{
            color: "gold",
            marginBottom: "50px",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}
        >
          WHAT WE DO ?
        </h2>

        {whatWeDoLines.map((line, i) => (
          <div 
            key={i} 
            className="what-we-do-line"
            style={{
              position: "relative",
              overflow: "hidden",
              padding: "20px 0",
              margin: "0 auto",
              maxWidth: "800px",
            }}
          >
            <div style={{ overflow: "hidden", display: "inline-block" }}>
              {line.split(" ").map((word, wordIndex) => (
                <span 
                  key={wordIndex} 
                  className="word"
                  style={{
                    display: "inline-block",
                    position: "relative",
                    padding: "0 5px",
                    fontWeight: 300,
                    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                    whiteSpace: "nowrap",
                    color: "#fff",
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
            
            {/* Underline */}
            <div 
              className="underline"
              style={{
                position: "absolute",
                bottom: "15px",
                left: 0,
                right: 0,
                height: "1px",
                backgroundColor: "rgba(255,255,255,0.3)",
                transformOrigin: "left center",
              }}
            />
          </div>
        ))}

        {/* Custom cursor */}
        <div
          ref={cursorRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "gold",
            pointerEvents: "none",
            mixBlendMode: "difference",
            zIndex: 9999,
            transform: "translate3d(0,0,0)",
            opacity: cursorVisible ? 1 : 0,
            transition: "opacity 0.3s ease, background-color 0.3s ease",
          }}
        />
      </div>
    </div>
  );
};

export default Sectiontwo;