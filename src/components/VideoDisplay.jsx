import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const API_URL = import.meta.env.VITE_API_URL || '';

const VideoCard = ({ video }) => {
  const videoRef = useRef(null);
  const [isVertical, setIsVertical] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleMetadata = () => {
    const v = videoRef.current;
    if (v && v.videoWidth && v.videoHeight) {
      setIsVertical(v.videoHeight > v.videoWidth);
      setLoaded(true);
    }
  };

  return (
    <div className={`video-card ${loaded ? (isVertical ? 'video-card--vertical' : 'video-card--horizontal') : ''}`}>
      <div className="video-card-wrapper">
        <video
          ref={videoRef}
          src={video.video_url}
          controls
          preload="metadata"
          poster={video.thumbnail_url || ''}
          className="video-player"
          onLoadedMetadata={handleMetadata}
          playsInline
        />
      </div>
      <div className="video-card-info">
        <h3 className="video-card-title">{video.title}</h3>
        <span className="video-card-date">
          {new Date(video.created_at).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
};

const VideoDisplay = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const goldLineRef = useRef(null);
  const videosContainerRef = useRef(null);

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/videos`);
      const data = await res.json();
      if (res.ok) {
        setVideos(data.videos);
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading || videos.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { opacity: 0, y: 40 });
      gsap.set(goldLineRef.current, { scaleX: 0, transformOrigin: 'center' });

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
        .to(headingRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(1.2)',
        }, '-=0.5');

      // Animate video cards
      const cards = videosContainerRef.current?.querySelectorAll('.video-card');
      if (cards && cards.length > 0) {
        gsap.set(cards, { opacity: 0, y: 40 });
        tl.to(cards, {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: 'power3.out',
        }, '-=0.3');
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, videos]);

  if (loading) return null;
  if (videos.length === 0) return null;

  return (
    <section ref={sectionRef} className="video-display-section">
      <div className="video-display-inner">
        <div ref={goldLineRef} className="video-gold-line"></div>
        <h2 ref={headingRef} className="video-display-heading">
          OUR EVENT HIGHLIGHTS
        </h2>

        <div ref={videosContainerRef} className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoDisplay;
