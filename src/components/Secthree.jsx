import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Secthree = () => {
  const sectionRef = useRef(null);
  const holdsoneRef = useRef(null);
  const holdstwoRef = useRef(null);
  const holdsthreeRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // Expand section from height 0 to 100dvh
    gsap.fromTo(
      sectionRef.current,
      { height: 0 },
      {
        height: "100dvh",
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 45%",
          end: "top top",
          scrub: 1,
          toggleActions: "play reverse play reverse",
        },
      }
    );

    gsap.to(holdsoneRef.current, {
      y: 300,
      ease: "power1.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    gsap.to(holdstwoRef.current, {
      y: -250,
      ease: "power1.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    // holdsthree move top to bottom
    gsap.to(holdsthreeRef.current, {
      y: 300,
      ease: "power1.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Text scale animation
    gsap.fromTo(
      textRef.current,
      { scale: 3, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 45%",
          end: "buttom top",
          scrub: 1,
        },
      }
    );
  }, []);
  
  return (
    <div className="sectionthree" ref={sectionRef}>
      <h2 ref={textRef} className="center-text">Make your moment</h2>
      <div className="holdsone hold" ref={holdsoneRef}>
        <img src="1.jpg" alt="" />
        <img src="2.jpg" alt="" />
        <img src="8.jpg" alt="" />
        <img src="4.jpg" alt="" />
        <img src="5.jpg" alt="" />
        <img src="6.jpg" alt="" />
          <img src="1.jpg" alt="" />
        <img src="5.jpg" alt="" />
        <img src="7.jpg" alt="" />
        <img src="8.jpg" alt="" />
      </div>
      <div className="holdstwo hold" ref={holdstwoRef}>
        <img src="2.jpg" alt="" />
        <img src="3.jpg" alt="" />
          <img src="1.jpg" alt="" />
        <img src="5.jpg" alt="" />
        <img src="7.jpg" alt="" />
        <img src="8.jpg" alt="" />
        <img src="1.jpg" alt="" />
        <img src="5.jpg" alt="" />
        <img src="7.jpg" alt="" />
        <img src="8.jpg" alt="" />
      </div>
      <div className="holdsthree hold" ref={holdsthreeRef}>
        <img src="7.jpg" alt="" />
        <img src="8.jpg" alt="" />
        <img src="2.jpg" alt="" />
        <img src="5.jpg" alt="" />
          <img src="1.jpg" alt="" />
        <img src="5.jpg" alt="" />
        <img src="7.jpg" alt="" />
        <img src="8.jpg" alt="" />
        <img src="3.jpg" alt="" />
        <img src="4.jpg" alt="" />
      </div>
    </div>
  );
};

export default Secthree;