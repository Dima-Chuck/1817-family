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

      gsap.set(photoEls[0], { opacity: 1, scale: 1, zIndex: 1 });
      gsap.set(photoEls.slice(1), { opacity: 0, scale: 1.03, zIndex: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${Math.max(1, photoEls.length - 1) * 100}%`,
          pin,
          // The page already has smooth wheel scrolling. A large scrub value
          // here created a second smoothing layer and made the first images lag.
          scrub: 0.15,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      photoEls.forEach((el, i) => {
        if (i === 0) return;

        const previous = photoEls[i - 1];

        tl.to(
          previous,
          { opacity: 0, scale: 0.97, duration: 1, ease: 'none' },
          i - 1
        )
          .to(
            el,
            { opacity: 1, scale: 1, zIndex: 1, duration: 1, ease: 'none' },
            i - 1
          )
          .set(previous, { zIndex: 0 }, i);
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
              <PhotoImage
                src={src}
                alt={`Дима и Даша ${i + 1}`}
                className="our-story__photo"
                priority={i < 2}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
