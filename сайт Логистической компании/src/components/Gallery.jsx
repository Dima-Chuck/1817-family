import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { texts } from '../data/texts';
import { photos } from '../data/photos';
import PhotoImage from './PhotoImage';
import Lightbox from './Lightbox';
import './Gallery.scss';

gsap.registerPlugin(ScrollTrigger);

const tilts = [-3, 2, -1.5, 3, -2, 1.5, -2.5, 2, -1, 2.5, -3, 1, -2, 2.5, -1.5, 3, -2, 1, -3, 2, -1.5, 2.5, -2, 1.5, -1];
const sizes = ['sm', 'md', 'lg', 'md', 'sm', 'lg', 'md', 'sm', 'lg', 'md', 'sm', 'md', 'lg', 'sm', 'md', 'lg', 'sm', 'md', 'lg', 'sm', 'md', 'lg', 'sm', 'md', 'lg'];

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const items = itemsRef.current.filter(Boolean);
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 40, rotate: tilts[i] * 2 },
          {
            opacity: 1,
            y: 0,
            rotate: tilts[i],
            duration: 0.9,
            delay: (i % 4) * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleHover = (index, entering) => {
    const items = itemsRef.current.filter(Boolean);
    items.forEach((item, i) => {
      if (i === index) {
        gsap.to(item, {
          scale: entering ? 1.08 : 1,
          zIndex: entering ? 10 : 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      } else {
        gsap.to(item, {
          scale: entering ? 0.95 : 1,
          opacity: entering ? 0.6 : 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    });
  };

  return (
    <section className="gallery" ref={sectionRef} id="gallery">
      <header className="gallery__header">
        <span className="section-label">06</span>
        <h2 className="section-title">{texts.gallery.title}</h2>
      </header>

      <div className="gallery__track" ref={trackRef}>
        {photos.gallery.map((src, i) => (
          <div
            key={src}
            className={`gallery__item gallery__item--${sizes[i % sizes.length]}`}
            ref={(el) => (itemsRef.current[i] = el)}
            style={{ '--tilt': `${tilts[i]}deg` }}
            onMouseEnter={() => handleHover(i, true)}
            onMouseLeave={() => handleHover(i, false)}
            onClick={() => setLightbox({ src, alt: `Момент ${i + 1}` })}
          >
            <PhotoImage src={src} alt={`Момент ${i + 1}`} className="gallery__photo" />
            <div className="gallery__glow" aria-hidden="true" />
          </div>
        ))}
      </div>

      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}
