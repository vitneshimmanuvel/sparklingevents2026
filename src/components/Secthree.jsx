import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const API_URL = import.meta.env.VITE_API_URL || '';

const Secthree = () => {
  const sectionRef = useRef(null);
  const holdsoneRef = useRef(null);
  const holdstwoRef = useRef(null);
  const holdsthreeRef = useRef(null);
  const textRef = useRef(null);

  const [columnImages, setColumnImages] = useState({
    1: ['/1.jpg', '/2.jpg', '/3.jpg'],
    2: ['/4.jpg', '/5.jpg', '/6.jpg'],
    3: ['/7.jpg', '/8.jpg', '/1.jpg']
  });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/grid-images`);
        if (res.ok) {
          const data = await res.json();
          if (data.images && data.images.length > 0) {
            const grouped = { 1: [], 2: [], 3: [] };
            data.images.forEach(img => {
              const col = img.col_index || 1;
              if (grouped[col]) {
                grouped[col].push(img.image_url);
              }
            });
            
            // Populate fallback values for any empty columns
            if (grouped[1].length === 0) grouped[1] = ['/1.jpg', '/2.jpg', '/3.jpg'];
            if (grouped[2].length === 0) grouped[2] = ['/4.jpg', '/5.jpg', '/6.jpg'];
            if (grouped[3].length === 0) grouped[3] = ['/7.jpg', '/8.jpg', '/1.jpg'];
            
            setColumnImages(grouped);
          }
        }
      } catch (err) {
        console.error('Failed to fetch images for grid:', err);
      }
    };
    fetchImages();
  }, []);

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

  // Distribute images across 3 columns, filling with repeats if needed
  const getColumnImages = (columnIndex) => {
    const colKey = columnIndex + 1; // 1-indexed (1, 2, 3)
    const list = columnImages[colKey] || [];
    if (list.length === 0) return [];
    
    // Support showing all uploaded images (up to 7 or more).
    // If the list is too short (e.g. less than 6), repeat it to ensure there are enough images
    // for a smooth vertical GSAP scroll animation without revealing empty space.
    let result = [...list];
    while (result.length < 6) {
      result = [...result, ...list];
    }
    return result;
  };

  return (
    <div className="sectionthree" ref={sectionRef}>
      <h2 ref={textRef} className="center-text">Make your moment</h2>
      <div className="holdsone hold" ref={holdsoneRef}>
        {getColumnImages(0).map((src, i) => (
          <img key={`col1-${i}`} src={src} alt="" />
        ))}
      </div>
      <div className="holdstwo hold" ref={holdstwoRef}>
        {getColumnImages(1).map((src, i) => (
          <img key={`col2-${i}`} src={src} alt="" />
        ))}
      </div>
      <div className="holdsthree hold" ref={holdsthreeRef}>
        {getColumnImages(2).map((src, i) => (
          <img key={`col3-${i}`} src={src} alt="" />
        ))}
      </div>
    </div>
  );
};

export default Secthree;