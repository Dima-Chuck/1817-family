import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { texts } from '../data/texts';
import { photos } from '../data/photos';
import PhotoImage from './PhotoImage';
import './Intro.scss';

export default function Intro({ onComplete }) {
  const overlayRef = useRef(null);
  const clockRef = useRef(null);
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const photoRef = useRef(null);
  const [time, setTime] = useState('18:16:57');
  const [phase, setPhase] = useState('clock'); // clock | reveal | photo | done

  useEffect(() => {
    const times = ['18:16:57', '18:16:58', '18:16:59', '18:17:00'];
    let i = 0;

    const tick = setInterval(() => {
      i++;
      if (i < times.length) {
        setTime(times[i]);
      } else {
        clearInterval(tick);
        setPhase('reveal');
      }
    }, 700);

    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (phase !== 'reveal') return;

    const tl = gsap.timeline({
      onComplete: () => setPhase('photo'),
    });

    tl.to(clockRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: 'power2.inOut',
    })
      .fromTo(
        titleRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.4, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        '-=0.8'
      );

    return () => tl.kill();
  }, [phase]);

  useEffect(() => {
    if (phase !== 'photo') return;

    const tl = gsap.timeline({
      delay: 0.6,
      onComplete: () => {
        setPhase('done');
        setTimeout(onComplete, 400);
      },
    });

    tl.fromTo(
      photoRef.current,
      { opacity: 0, scale: 1.15 },
      { opacity: 1, scale: 1, duration: 2.5, ease: 'power2.out' }
    ).to(
      overlayRef.current,
      { opacity: 0, duration: 1.2, ease: 'power2.inOut' },
      '-=0.8'
    );

    return () => tl.kill();
  }, [phase, onComplete]);

  return (
    <div className="intro" ref={overlayRef}>
      <div className="intro__inner">
        {phase === 'clock' && (
          <div className="intro__clock" ref={clockRef}>
            <span className="intro__clock-time">{time}</span>
          </div>
        )}

        {(phase === 'reveal' || phase === 'photo' || phase === 'done') && (
          <div className="intro__text">
            <h1 className="intro__title" ref={titleRef}>
              18:17
            </h1>
            <p className="intro__subtitle">{texts.intro.subtitle}</p>
            <p className="intro__tagline" ref={taglineRef}>
              {texts.intro.tagline}
            </p>
          </div>
        )}

        {(phase === 'photo' || phase === 'done') && (
          <div className="intro__photo-wrap" ref={photoRef}>
            <PhotoImage
              src={photos.intro}
              alt="Дима и Даша"
              priority
              className="intro__photo"
            />
            <div className="intro__photo-glow" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
}
