import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { texts } from '../data/texts';
import { photos } from '../data/photos';
import PhotoImage from './PhotoImage';
import './Nastya.scss';

gsap.registerPlugin(ScrollTrigger);

export default function Nastya() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      if (!container) return;

      const frames = container.querySelectorAll('.nastya__frame');
      gsap.fromTo(
        frames,
        { opacity: 0, y: 50, rotateY: 15 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 75%',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="nastya" ref={sectionRef} id="nastya">
      <div className="nastya__inner">
        <header className="nastya__header">
          <span className="section-label">05</span>
          <h2 className="section-title nastya__title">{texts.nastya.title}</h2>
          <p className="section-quote nastya__quote">{texts.nastya.quote}</p>
        </header>

        <div className="nastya__gallery" ref={containerRef}>
          {photos.nastya.map((src, i) => (
            <div key={src} className={`nastya__frame nastya__frame--${i + 1}`}>
              <PhotoImage src={src} alt={`Настя ${i + 1}`} className="nastya__photo" />
              <div className="nastya__frame-border" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
