import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const events = [
  {
    title: "JALLIKATU",
    subtitle: "50,000+ Crowds",
    image: "/jalikatu.jpg",
  },
  {
    title: "HAPPY STREET",
    subtitle: "50,000+ Crowds JCI Erode Presents",
    image: "/dance.jpg",
  },
  {
    title: "NANJIL VIJAYAN WEDDING",
    subtitle: "5000+ Crowds Vijay Television",
    image: "/merrange.jpg",
  },
  {
    title: "NANJIL VIJAY BABY SHOWER",
    subtitle: "2000+ Crowd",
    image: "/babyshovver.jpg",
  },
];

const SuccessStory = () => {
  const refs = useRef([]);
  const [mobilePopup, setMobilePopup] = useState(null);
  const [hoverPopup, setHoverPopup] = useState({ 
    show: false, 
    index: null, 
    position: { x: 0, y: 0 } 
  });

  useEffect(() => {
    refs.current.forEach((el) => {
      const line = el.querySelector(".line");

      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          duration: 0.8,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          duration: 1,
          ease: "power3.out",
        }
      );
    });
  }, []);

  const handleMouseMove = (e, index) => {
    setHoverPopup({
      show: true,
      index: index,
      position: { 
        x: e.clientX, 
        y: e.clientY 
      }
    });
  };

  const handleMouseLeave = () => {
    setHoverPopup({ show: false, index: null, position: { x: 0, y: 0 } });
  };

  const handleMobileImage = (index) => {
    setMobilePopup(mobilePopup === index ? null : index);
  };

  return (
    <div className="app">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }
        
        .app {
          background: #000;
          color: #fff;
          min-height: 100vh;
          padding: 2rem;
          position: relative;
        }
        
        header {
          text-align: center;
          margin-bottom: 4rem;
        }
        
        header h1 {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
          letter-spacing: -0.05em;
          background: linear-gradient(to right, #ffffff, #aaaaaa);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        header p {
          color: #aaa;
          font-size: 1.2rem;
        }
        
        .success-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          counter-reset: event-counter;
        }
        
        .heading {
          font-size: 1.5rem;
          margin-bottom: 3rem;
          text-align: center;
          color: #aaa;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        
        .event-block {
          position: relative;
          padding: 2rem 0;
          cursor: pointer;
          border-bottom: 1px solid #222;
          counter-increment: event-counter;
        }
        
        .line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: #333;
          transform-origin: left;
        }
        
        .event-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }
        
        .subtitle {
          color: #999;
          font-size: 1rem;
          max-width: 50%;
          transition: color 0.3s ease;
        }
        
        .event-content h3 {
          font-size: 3.5rem;
          font-weight: 700;
          letter-spacing: -0.05em;
          position: relative;
          margin-right: 1rem;
          background: linear-gradient(to right, #ffffff, #cccccc);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          transition: all 0.3s ease;
        }
        
        .event-content h3::before {
          content: counter(event-counter, decimal-leading-zero);
          position: absolute;
          left: -3rem;
          top: 0;
          font-size: 1rem;
          color: #666;
          font-weight: 400;
        }
        
        .event-block:hover .subtitle {
          color: #fff;
        }
        
        .event-block:hover h3 {
          background: linear-gradient(to right, #ffffff, #ffffff);
          -webkit-background-clip: text;
          background-clip: text;
        }
        
        /* Hover Popup */
        .hover-popup {
          position: fixed;
          width: 300px;
          height: 200px;
          background-size: cover;
          background-position: center;
          border-radius: 8px;
          pointer-events: none;
          z-index: 1000;
          transform: translate(-50%, -100%);
          opacity: 0;
          transition: opacity 0.3s ease, transform 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
          border: 2px solid rgba(255, 255, 255, 0.15);
          overflow: hidden;
        }
        
        .hover-popup.active {
          opacity: 1;
          transform: translate(-50%, calc(-100% - 20px));
        }
        
        .mobile-image-view {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        
        .mobile-image-view.active {
          opacity: 1;
          pointer-events: all;
        }
        
        .mobile-image-content {
          width: 90%;
          height: 70%;
          background-size: cover;
          background-position: center;
          border-radius: 10px;
          position: relative;
        }
        
        .close-button {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(10px);
        }
        
        .close-button::before,
        .close-button::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 2px;
          background: white;
        }
        
        .close-button::before {
          transform: rotate(45deg);
        }
        
        .close-button::after {
          transform: rotate(-45deg);
        }
        
        .mobile-notice {
          text-align: center;
          margin: 3rem 0;
          color: #aaa;
          display: none;
        }
        
        @media (max-width: 1024px) {
          .hover-popup {
            width: 250px;
            height: 170px;
          }
        }
        
        @media (max-width: 768px) {
          .hover-popup {
            display: none;
          }
          
          .mobile-notice {
            display: block;
          }
          
          .event-content {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .subtitle {
            max-width: 100%;
            margin-bottom: 0.5rem;
          }
          
          header h1 {
            font-size: 2.5rem;
          }
          
          .event-content h3 {
            font-size: 2.5rem;
          }
          
          .event-content h3::before {
            left: 0;
            top: -1.5rem;
          }
        }
        
        @media (max-width: 480px) {
          .app {
            padding: 1.5rem;
          }
          
          header h1 {
            font-size: 2rem;
          }
          
          .event-content h3 {
            font-size: 2rem;
          }
        }
      `}</style>
      
      
      <section className="success-container">
        <h2 className="heading">OUR SUCCESSFUL EVENTS</h2>
        {events.map((item, i) => (
          <div
            key={i}
            className="event-block"
            ref={(el) => (refs.current[i] = el)}
            onClick={() => handleMobileImage(i)}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="line"></div>
            <div className="event-content">
              <p className="subtitle">{item.subtitle}</p>
              <h3>{item.title}</h3>
            </div>
          </div>
        ))}
      </section>
      
      {/* Hover Preview */}
      {hoverPopup.show && (
        <div 
          className={`hover-popup active`}
          style={{
            left: `${hoverPopup.position.x}px`,
            top: `${hoverPopup.position.y}px`,
            backgroundImage: `url(${events[hoverPopup.index].image})`
          }}
        />
      )}
      
      <div className="mobile-notice">
        <p>Tap events to see the image preview</p>
      </div>
      
      {/* Mobile Image Fullscreen View */}
      {mobilePopup !== null && (
        <div className="mobile-image-view active">
          <div 
            className="mobile-image-content"
            style={{ backgroundImage: `url(${events[mobilePopup].image})` }}
          >
            <button 
              className="close-button"
              onClick={(e) => {
                e.stopPropagation();
                setMobilePopup(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessStory;