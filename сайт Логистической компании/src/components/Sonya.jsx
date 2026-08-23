import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { texts } from '../data/texts';
import { photos } from '../data/photos';
import PhotoImage from './PhotoImage';
import './Sonya.scss';

gsap.registerPlugin(ScrollTrigger);

export default function Sonya() {
  const sectionRef = useRef(null);
  const slidesRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const slides = slidesRef.current.filter(Boolean);
      slides.forEach((slide, i) => {
        gsap.fromTo(
          slide,
          { opacity: 0, x: i % 2 === 0 ? -80 : 80 },
          {
            opacity: 1,
            x: 0,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: slide,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="sonya" ref={sectionRef} id="sonya">
      <div className="sonya__inner">
        <header className="sonya__header">
          <span className="section-label">04</span>
          <h2 className="section-title">{texts.sonya.title}</h2>
          <p className="section-quote sonya__quote">{texts.sonya.quote}</p>
        </header>

        <div className="sonya__sequence">
          {photos.sonya.map((src, i) => (
            <div
              key={src}
              className={`sonya__slide sonya__slide--${i + 1}`}
              ref={(el) => (slidesRef.current[i] = el)}
            >
              <PhotoImage src={src} alt={`Соня ${i + 1}`} className="sonya__photo" />
              <div className="sonya__slide-glow" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
