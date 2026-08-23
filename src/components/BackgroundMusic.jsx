import { useEffect, useRef, useState, useCallback } from 'react';
import { texts } from '../data/texts';
import './BackgroundMusic.scss';

const MUSIC_SRC = `/audio/${texts.music.filename}`;
const FADE_DURATION = 2500;
const TARGET_VOLUME = 0.35;

export default function BackgroundMusic({ active }) {
  const audioRef = useRef(null);
  const fadeRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [available, setAvailable] = useState(true);

  const fadeIn = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / FADE_DURATION, 1);
      audio.volume = progress * TARGET_VOLUME;
      if (progress < 1) fadeRef.current = requestAnimationFrame(step);
    };

    fadeRef.current = requestAnimationFrame(step);
  }, []);

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || playing) return;

    try {
      await audio.play();
      setPlaying(true);
      fadeIn();
    } catch {
      /* autoplay blocked — ждём взаимодействия */
    }
  }, [playing, fadeIn]);

  useEffect(() => {
    if (!active) return;
    tryPlay();

    const resume = () => tryPlay();
    window.addEventListener('pointerdown', resume, { once: true });
    window.addEventListener('touchstart', resume, { once: true });
    window.addEventListener('scroll', resume, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('touchstart', resume);
      window.removeEventListener('scroll', resume);
    };
  }, [active, tryPlay]);

  useEffect(() => {
    return () => {
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    };
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!playing) {
      tryPlay();
      return;
    }

    const next = !muted;
    audio.muted = next;
    setMuted(next);
  };

  if (!active) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={MUSIC_SRC}
        loop
        preload="auto"
        onError={() => setAvailable(false)}
      />
      <button
        type="button"
        className={`bg-music ${playing ? 'bg-music--playing' : ''} ${!available ? 'bg-music--missing' : ''}`}
        onClick={toggleMute}
        aria-label={muted ? 'Включить музыку' : 'Выключить музыку'}
        title={available ? (muted ? 'Включить музыку' : 'Выключить музыку') : 'Положите трек в public/audio/'}
      >
        <span className="bg-music__icon" aria-hidden="true">
          {muted || !playing ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
            </svg>
          )}
        </span>
      </button>
    </>
  );
}
