import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { texts } from '../data/texts';
import { photos } from '../data/photos';
import PhotoImage from './PhotoImage';
import './FourPeople.scss';

gsap.registerPlugin(ScrollTrigger);

export default function FourPeople() {
  const sectionRef = useRef(null);
  const namesRef = useRef([]);
  const weRef = useRef(null);
  const heroRef = useRef(null);
  const quoteRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const names = namesRef.current.filter(Boolean);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
        },
      });

      names.forEach((name, i) => {
        tl.fromTo(
          name,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          i * 0.3
        );
      });

      tl.fromTo(
        weRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
        '-=0.2'
      );

      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { opacity: 0, scale: 1.1 },
          {
            opacity: 1,
            scale: 1,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      if (quoteRef.current) {
        gsap.fromTo(
          quoteRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: quoteRef.current,
              start: 'top 90%',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="four-people" ref={sectionRef} id="four">
      <div className="four-people__names">
        {texts.four.names.map((name, i) => (
          <span
            key={name}
            className="four-people__name"
            ref={(el) => (namesRef.current[i] = el)}
          >
            {name}
          </span>
        ))}
        <span className="four-people__we" ref={weRef}>
          {texts.four.we}
        </span>
      </div>

      <div className="four-people__hero" ref={heroRef}>
        <PhotoImage
          src={photos.fourHero}
          alt="Наша семья"
          className="four-people__photo"
        />
        <div className="four-people__overlay" aria-hidden="true" />
      </div>

      <p className="four-people__quote" ref={quoteRef}>
        {texts.four.quote}
      </p>
    </section>
  );
}
