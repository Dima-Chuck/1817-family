import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { texts } from '../data/texts';
import { photos } from '../data/photos';
import PhotoImage from './PhotoImage';
import './Finale.scss';

gsap.registerPlugin(ScrollTrigger);

export default function Finale() {
  const sectionRef = useRef(null);
  const clockRef = useRef(null);
  const quoteRef = useRef(null);
  const closingRef = useRef(null);
  const sigRef = useRef(null);
  const photoRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
        },
      });

      tl.fromTo(
        clockRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out' }
      )
        .fromTo(
          quoteRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' },
          '-=0.5'
        )
        .fromTo(
          closingRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: 'power2.out' },
          '+=0.8'
        )
        .fromTo(
          sigRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
          '-=0.5'
        )
        .fromTo(
          photoRef.current,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out' },
          '-=0.3'
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="finale" ref={sectionRef} id="finale">
      <div className="finale__content">
        <div className="finale__clock" ref={clockRef}>
          <span className="finale__time">18:17</span>
        </div>

        <p className="finale__quote" ref={quoteRef}>
          {texts.finale.quote}
        </p>

        <p className="finale__closing" ref={closingRef}>
          {texts.finale.closing}
        </p>

        <div className="finale__signature" ref={sigRef}>
          <p className="finale__sig-main">{texts.finale.signature}</p>
          <p className="finale__sig-family">{texts.finale.family}</p>
        </div>

        <div className="finale__photo-wrap" ref={photoRef}>
          <PhotoImage
            src={photos.finale}
            alt="Наша семья"
            className="finale__photo"
          />
        </div>
      </div>
    </section>
  );
}
