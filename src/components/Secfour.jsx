import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const API_URL = import.meta.env.VITE_API_URL || '';

const fallbackServices = [
  { name: "Wedding Budget Decor", price: "9,999", description: "Celebrate in style with our unique and creative touch designed exclusively for your special moments." },
  { name: "Birthday Surprise", price: "4,999", description: "Celebrate in style with our unique and creative touch designed exclusively for your special moments." },
  { name: "Unplug Live Band", price: "29,999", description: "Celebrate in style with our unique and creative touch designed exclusively for your special moments." },
  { name: "Theme Entry", price: "9,999", description: "Celebrate in style with our unique and creative touch designed exclusively for your special moments." },
  { name: "Welcome Dance DJ", price: "29,999", description: "Celebrate in style with our unique and creative touch designed exclusively for your special moments." },
  { name: "Chendamelam", price: "9,999", description: "Celebrate in style with our unique and creative touch designed exclusively for your special moments." },
];

const Secfour = () => {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const modalRef = useRef(null);
  const modalContentRef = useRef(null);

  const [services, setServices] = useState([]);
  const [visible, setVisible] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch settings first
        const settingsRes = await fetch(`${API_URL}/api/settings`);
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData.settings && settingsData.settings.services_section_visible === 'false') {
            setVisible(false);
            setLoading(false);
            return;
          }
        }

        // Fetch services
        const servicesRes = await fetch(`${API_URL}/api/services`);
        if (servicesRes.ok) {
          const data = await servicesRes.json();
          if (data.services && data.services.length > 0) {
            setServices(data.services);
          } else {
            setServices(fallbackServices);
          }
        } else {
          setServices(fallbackServices);
        }
      } catch (err) {
        console.error("Failed to fetch services or settings, using fallback", err);
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Card reveal animation when scroll triggers
  useEffect(() => {
    if (loading || !visible || services.length === 0) return;

    const cards = gridRef.current?.querySelectorAll(".service-card");
    if (!cards || cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, visible, services]);

  // Modal open animation
  const openModal = (service) => {
    setSelectedService(service);
    
    // Disable body scroll
    document.body.style.overflow = "hidden";

    // Use setTimeout to wait for modal to render in DOM
    setTimeout(() => {
      if (!modalRef.current || !modalContentRef.current) return;

      gsap.set(modalRef.current, { display: "flex", opacity: 0 });
      gsap.set(modalContentRef.current, { scale: 0.8, opacity: 0, y: 50 });

      const tl = gsap.timeline();
      tl.to(modalRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      }).to(
        modalContentRef.current,
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.4)",
        },
        "-=0.15"
      );
    }, 10);
  };

  const closeModal = () => {
    if (!modalRef.current || !modalContentRef.current) return;

    // Enable body scroll
    document.body.style.overflow = "auto";

    const tl = gsap.timeline({
      onComplete: () => {
        setSelectedService(null);
      }
    });

    tl.to(modalContentRef.current, {
      scale: 0.8,
      opacity: 0,
      y: 50,
      duration: 0.4,
      ease: "power3.in",
    }).to(
      modalRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      },
      "-=0.2"
    );
  };

  if (loading || !visible || services.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        padding: "100px 5%",
        background: "linear-gradient(to bottom, #000 0%, #0d0b07 100%)",
        minHeight: "100vh",
        overflow: "hidden",
        fontFamily: "'Poppins', 'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <h2
          style={{
            textAlign: "center",
            color: "#ffd700",
            marginBottom: "4rem",
            fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
            fontWeight: 800,
            letterSpacing: "2px",
            textTransform: "uppercase",
            background: "linear-gradient(135deg, #fff 30%, #ffd700 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 30px rgba(255, 215, 0, 0.1)",
          }}
        >
          Our Signature Services
        </h2>

        <div
          ref={gridRef}
          className="services-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "3rem 2rem",
            justifyContent: "center",
          }}
        >
          {services.map((service, index) => (
            <div
              key={service.id || index}
              className="service-card"
              onClick={() => openModal(service)}
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
                cursor: "pointer",
                background: "#080808",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "rgba(255, 215, 0, 0.1)",
                position: "relative",
                height: "420px",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-15px) scale(1.02)";
                e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.4)";
                e.currentTarget.style.boxShadow = "0 25px 50px rgba(255, 215, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.borderColor = "rgba(255, 215, 0, 0.1)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.4)";
              }}
            >
              {/* Gold Top Section */}
              <div
                style={{
                  height: "45%",
                  background: "linear-gradient(135deg, #ffd700 0%, #b8860b 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1.5rem",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 80%)",
                  }}
                />
                <h3
                  style={{
                    color: "#000",
                    fontSize: "clamp(1.3rem, 2vw, 1.8rem)",
                    fontWeight: 800,
                    textAlign: "center",
                    zIndex: 2,
                    letterSpacing: "0.5px",
                    lineHeight: 1.3,
                    textTransform: "uppercase",
                  }}
                >
                  {service.name}
                </h3>
              </div>

              {/* Black Bottom Section */}
              <div
                style={{
                  height: "55%",
                  background: "#080808",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                }}
              >
                <p
                  style={{
                    color: "#b0b0b0",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    fontWeight: 300,
                    margin: 0,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {service.description || "Celebrate in style with our unique and creative touch designed exclusively for your special moments."}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "1.5rem",
                  }}
                >
                  <span
                    style={{
                      color: "#ffd700",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    View Details →
                  </span>
                  
                  <div
                    style={{
                      background: "linear-gradient(135deg, #ffd700, #b8860b)",
                      color: "#000",
                      padding: "0.5rem 1.2rem",
                      fontWeight: 750,
                      fontSize: "1.1rem",
                      borderRadius: "8px",
                      boxShadow: "0 4px 15px rgba(218, 165, 32, 0.2)",
                    }}
                  >
                    Rs. {service.price}/-
                  </div>
                </div>
              </div>

              {/* Accent line */}
              <div
                style={{
                  position: "absolute",
                  top: "45%",
                  left: 0,
                  width: "100%",
                  height: "4px",
                  background: "#ffd700",
                  transform: "translateY(-50%)",
                  boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal Popup Overlay */}
      {selectedService && (
        <div
          ref={modalRef}
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 99999,
            display: "none", // Will be set to 'flex' by GSAP
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div
            ref={modalContentRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0c0b08",
              border: "1px solid rgba(255, 215, 0, 0.3)",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "750px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 50px rgba(255, 215, 0, 0.15)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 215, 0, 0.2)",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                color: "#ffd700",
                fontSize: "1.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ffd700";
                e.currentTarget.style.color = "#000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.color = "#ffd700";
              }}
            >
              &times;
            </button>

            {/* Modal Body */}
            <div style={{ padding: "2.5rem" }}>
              <h3
                style={{
                  fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                  fontWeight: 800,
                  color: "#ffd700",
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                  paddingRight: "50px",
                  borderBottom: "1px solid rgba(255, 215, 0, 0.15)",
                  paddingBottom: "1rem",
                }}
              >
                {selectedService.name}
              </h3>

              {/* Description */}
              <p
                style={{
                  color: "#e0e0e0",
                  fontSize: "1.1rem",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                  fontWeight: 300,
                }}
              >
                {selectedService.description || "Celebrate in style with our unique and creative touch designed exclusively for your special moments."}
              </p>

              {/* Video Section */}
              {selectedService.video_url ? (
                <div
                  style={{
                    width: "100%",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                    marginBottom: "2rem",
                    aspectRatio: "16/9",
                    background: "#000",
                  }}
                >
                  <video
                    src={selectedService.video_url}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "160px",
                    borderRadius: "16px",
                    border: "1px dashed rgba(255,215,0,0.2)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#8a7a4f",
                    marginBottom: "2rem",
                    background: "rgba(255,255,255,0.01)",
                  }}
                >
                  <span style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✨</span>
                  <span>Sparkling premium experience</span>
                </div>
              )}

              {/* Footer row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid rgba(255, 215, 0, 0.15)",
                  paddingTop: "1.5rem",
                }}
              >
                <div style={{ color: "#8a7a4f", fontSize: "0.9rem" }}>
                  Includes professional setup & service
                </div>
                
                <div
                  style={{
                    background: "linear-gradient(135deg, #ffd700, #b8860b)",
                    color: "#000",
                    padding: "0.8rem 2rem",
                    fontWeight: 800,
                    fontSize: "1.4rem",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(218, 165, 32, 0.3)",
                  }}
                >
                  Rs. {selectedService.price}/-
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Secfour;