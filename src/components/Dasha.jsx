import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { texts } from '../data/texts';
import { photos } from '../data/photos';
import PhotoImage from './PhotoImage';
import './Dasha.scss';

gsap.registerPlugin(ScrollTrigger);

const layouts = [
  { className: 'dasha__item--large', span: 'wide' },
  { className: 'dasha__item--tall', span: 'tall' },
  { className: 'dasha__item--medium', span: 'normal' },
  { className: 'dasha__item--small', span: 'normal' },
  { className: 'dasha__item--wide', span: 'wide' },
];

export default function Dasha() {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const items = itemsRef.current.filter(Boolean);
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 60, rotate: (i % 2 === 0 ? -2 : 2) },
          {
            opacity: 1,
            y: 0,
            rotate: layouts[i]?.className.includes('small') ? -1.5 : 1.5,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="dasha" ref={sectionRef} id="dasha">
      <div className="dasha__inner">
        <header className="dasha__header">
          <span className="section-label">02</span>
          <h2 className="section-title">{texts.dasha.title}</h2>
          <p className="section-quote dasha__quote">{texts.dasha.quote}</p>
        </header>

        <div className="dasha__album">
          {photos.dasha.map((src, i) => (
            <div
              key={src}
              className={`dasha__item ${layouts[i]?.className || ''}`}
              ref={(el) => (itemsRef.current[i] = el)}
            >
              <PhotoImage src={src} alt={`Даша ${i + 1}`} className="dasha__photo" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
