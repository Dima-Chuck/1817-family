import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { texts } from '../data/texts';
import { photos } from '../data/photos';
import PhotoImage from './PhotoImage';
import './FamilySection.scss';

gsap.registerPlugin(ScrollTrigger);

export default function FamilySection() {
  const sectionRef = useRef(null);
  const transitionRef = useRef(null);
  const gridRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const transition = transitionRef.current;
      const items = itemsRef.current.filter(Boolean);

      if (transition) {
        gsap.fromTo(
          transition,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: transition,
              start: 'top 80%',
            },
          }
        );
      }

      if (items.length > 0 && gridRef.current) {
        gsap.fromTo(
          items,
          {
            opacity: 0,
            scale: 0.7,
            x: () => gsap.utils.random(-80, 80),
            y: () => gsap.utils.random(-40, 40),
            rotate: () => gsap.utils.random(-8, 8),
          },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotate: (i) => (i % 2 === 0 ? -1 : 1),
            duration: 1.2,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 75%',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="family-section" ref={sectionRef} id="family">
      <div className="family-section__transition" ref={transitionRef}>
        <p className="family-section__transition-text">{texts.family.transition}</p>
      </div>

      <div className="family-section__content">
        <header className="family-section__header">
          <span className="section-label">03</span>
          <h2 className="section-title family-section__title">{texts.family.title}</h2>
        </header>

        <div className="family-section__grid" ref={gridRef}>
          {photos.family.map((src, i) => (
            <div
              key={src}
              className={`family-section__item family-section__item--${(i % 3) + 1}`}
              ref={(el) => (itemsRef.current[i] = el)}
            >
              <PhotoImage src={src} alt={`Семья ${i + 1}`} className="family-section__photo" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
