import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const Footer = () => {
  const footerRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const goldLineRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const goldLine = goldLineRef.current;

    // Set initial state
    gsap.set([line1, line2], { y: 30, opacity: 0 });
    gsap.set(goldLine, { scaleX: 0, transformOrigin: "left center" });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const tl = gsap.timeline();
          
          tl.to(goldLine, {
            scaleX: 1,
            duration: 1.2,
            ease: "expo.out"
          })
          .to(line1, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "back.out(1.2)"
          }, "-=0.4")
          .to(line2, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "back.out(1.2)"
          }, "-=0.6");
          
          observer.unobserve(footer);
        }
      });
    }, { threshold: 0.1 });

    if (footer) observer.observe(footer);

    return () => {
      if (footer) observer.unobserve(footer);
    };
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer-content">
        <div ref={goldLineRef} className="gold-line"></div>
        
        <div ref={line1Ref} className="footer-line">
          <a href="tel:8778236613" className="phone-link">87782 36613</a>
          <span className="divider"> / </span>
          <a href="tel:9715877938" className="phone-link">9715877938</a>
        </div>
        
        <div ref={line2Ref} className="footer-line address">
          255. Mettur Road, Erode Fort, Opp. VS.P. Theater<br/>
          Erode, Tamilnadu - 638011
        </div>
      </div>
      
      <div className="copyright">
        © {new Date().getFullYear()} All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;