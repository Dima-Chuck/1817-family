import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { texts } from '../data/texts';
import { photos } from '../data/photos';
import PhotoImage from './PhotoImage';
import './OurStory.scss';

gsap.registerPlugin(ScrollTrigger);

export default function OurStory() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const photosRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const ctx = gsap.context(() => {
      const photoEls = photosRef.current.filter(Boolean);
      if (photoEls.length === 0) return;

      gsap.set(photoEls[0], { opacity: 1, scale: 1 });
      gsap.set(photoEls.slice(1), { opacity: 0, scale: 1.05 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${photoEls.length * 100}%`,
          pin: pin,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      photoEls.forEach((el, i) => {
        if (i === 0) return;
        tl.to(
          photoEls[i - 1],
          { opacity: 0, scale: 0.95, duration: 1 },
          i
        ).fromTo(
          el,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: 1 },
          i
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="our-story" ref={sectionRef} id="our-story">
      <div className="our-story__pin" ref={pinRef}>
        <div className="our-story__header">
          <span className="section-label">01</span>
          <h2 className="section-title our-story__title">{texts.couple.title}</h2>
          <p className="section-quote our-story__quote">{texts.couple.quote}</p>
        </div>

        <div className="our-story__photos">
          {photos.couple.map((src, i) => (
            <div
              key={src}
              className="our-story__photo-layer"
              ref={(el) => (photosRef.current[i] = el)}
            >
              <PhotoImage src={src} alt={`Дима и Даша ${i + 1}`} className="our-story__photo" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
