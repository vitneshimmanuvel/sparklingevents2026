import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const API_URL = import.meta.env.VITE_API_URL || '';

const ContactForm = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const formRef = useRef(null);
  const goldLineRef = useRef(null);
  const fieldsRef = useRef([]);
  const btnRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { opacity: 0, y: 40 });
      gsap.set(goldLineRef.current, { scaleX: 0, transformOrigin: 'center' });
      gsap.set(fieldsRef.current, { opacity: 0, y: 30 });
      gsap.set(btnRef.current, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      tl.to(goldLineRef.current, {
        scaleX: 1,
        duration: 1,
        ease: 'expo.out',
      })
        .to(
          headingRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'back.out(1.2)',
          },
          '-=0.5'
        )
        .to(
          fieldsRef.current,
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: 'power3.out',
          },
          '-=0.3'
        )
        .to(
          btnRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'back.out(1.4)',
          },
          '-=0.2'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
        // Reset after 4s
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  return (
    <section ref={sectionRef} className="contact-section">
      {/* Animated gold particles background */}
      <div className="contact-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="contact-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      <div className="contact-inner">
        <div ref={goldLineRef} className="contact-gold-line"></div>

        <h2 ref={headingRef} className="contact-heading">
          GET IN TOUCH
        </h2>

        <p className="contact-subheading" ref={(el) => fieldsRef.current[0] = el}>
          Let us make your event sparkle. Reach out to us and we'll get back to you shortly.
        </p>

        <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-row">
            <div className="contact-field" ref={(el) => (fieldsRef.current[1] = el)}>
              <label htmlFor="contact-name">Your Name *</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>
            <div className="contact-field" ref={(el) => (fieldsRef.current[2] = el)}>
              <label htmlFor="contact-phone">Phone Number *</label>
              <input
                id="contact-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="contact-field" ref={(el) => (fieldsRef.current[3] = el)}>
            <label htmlFor="contact-email">Email Address</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>

          <div className="contact-field" ref={(el) => (fieldsRef.current[4] = el)}>
            <label htmlFor="contact-message">Your Message</label>
            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us about your event..."
            />
          </div>

          <button
            ref={btnRef}
            type="submit"
            className={`contact-submit ${status === 'sending' ? 'sending' : ''}`}
            disabled={status === 'sending'}
          >
            {status === 'sending'
              ? 'Sending...'
              : status === 'success'
              ? '✓ Sent Successfully!'
              : 'Send Message'}
          </button>

          {status === 'error' && <p className="contact-error">{errorMsg}</p>}
          {status === 'success' && (
            <p className="contact-success">Thank you! We'll get back to you soon.</p>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
