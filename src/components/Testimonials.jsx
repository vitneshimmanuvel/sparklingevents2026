import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const API_URL = import.meta.env.VITE_API_URL || '';

const fallbackTestimonials = [
  { id: 1, client_name: 'Rajesh Kumar', designation: 'Corporate Client', message: 'Sparkling Events made our corporate event truly memorable. The team was professional and creative beyond our expectations!', rating: 5 },
  { id: 2, client_name: 'Priya Sharma', designation: 'Wedding Client', message: 'Our wedding was a dream come true thanks to Sparkling Events. Every detail was perfectly executed with such elegance.', rating: 5 },
  { id: 3, client_name: 'Arun Vijay', designation: 'College Fest Organizer', message: 'The college fest organized by Sparkling Events was the best we have ever had. Students loved every moment of it!', rating: 5 },
];

const StarRating = ({ rating }) => {
  return (
    <div className="testimonial-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`testimonial-star ${star <= rating ? 'filled' : ''}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(`${API_URL}/api/testimonials`);
        if (res.ok) {
          const data = await res.json();
          if (data.testimonials && data.testimonials.length > 0) {
            setTestimonials(data.testimonials);
          } else {
            setTestimonials(fallbackTestimonials);
          }
        } else {
          setTestimonials(fallbackTestimonials);
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // GSAP scroll animation
  useEffect(() => {
    if (loading || testimonials.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.testimonial-header',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        '.testimonial-card-wrapper',
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, testimonials]);

  // Auto-play for mobile carousel
  useEffect(() => {
    if (testimonials.length <= 1) return;
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(autoPlayRef.current);
  }, [testimonials.length]);

  if (loading || testimonials.length === 0) return null;

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section ref={sectionRef} className="testimonials-section">
      {/* Background decoration */}
      <div className="testimonials-bg-pattern" />

      <div className="testimonials-inner">
        {/* Header */}
        <div className="testimonial-header">
          <div className="testimonial-gold-line" />
          <h2 className="testimonial-heading">CLIENT TESTIMONIALS</h2>
          <p className="testimonial-subheading">
            What our clients say about their sparkling experiences
          </p>
        </div>

        {/* Cards Grid (Desktop) / Carousel (Mobile) */}
        <div ref={cardsRef} className="testimonials-grid">
          {testimonials.map((t, index) => (
            <div
              key={t.id || index}
              className={`testimonial-card-wrapper ${
                index === currentIndex ? 'mobile-active' : ''
              }`}
            >
              <div className="testimonial-card">
                {/* Quote icon */}
                <div className="testimonial-quote-icon">"</div>

                {/* Message */}
                <p className="testimonial-message">{t.message}</p>

                {/* Stars */}
                <StarRating rating={t.rating || 5} />

                {/* Client info */}
                <div className="testimonial-client">
                  <div className="testimonial-avatar">
                    {t.image_url ? (
                      <img
                        src={t.image_url}
                        alt={t.client_name}
                        className="testimonial-avatar-img"
                      />
                    ) : (
                      <span className="testimonial-avatar-initials">
                        {getInitials(t.client_name)}
                      </span>
                    )}
                  </div>
                  <div className="testimonial-client-info">
                    <h4 className="testimonial-client-name">{t.client_name}</h4>
                    {t.designation && (
                      <p className="testimonial-client-role">{t.designation}</p>
                    )}
                  </div>
                </div>

                {/* Gold accent */}
                <div className="testimonial-card-accent" />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile dots */}
        <div className="testimonial-mobile-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`testimonial-mobile-dot ${
                index === currentIndex ? 'active' : ''
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
