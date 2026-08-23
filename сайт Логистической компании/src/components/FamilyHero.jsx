import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { texts } from '../data/texts';
import './FamilyHero.scss';

gsap.registerPlugin(ScrollTrigger);

export default function FamilyHero() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="family-hero" ref={sectionRef}>
      <div className="family-hero__inner">
        <p className="family-hero__time">18:17</p>
        <div className="family-hero__line" ref={lineRef} aria-hidden="true" />
        <p className="family-hero__hint">{texts.intro.subtitle}</p>
      </div>
    </section>
  );
}
