import { useEffect, useRef, useCallback } from 'react';
import { texts } from '../data/texts';
import './BackgroundMusic.scss';

const MUSIC_SRC = `${import.meta.env.BASE_URL}audio/${texts.music.filename}`;
const FADE_DURATION = 2500;
const TARGET_VOLUME = 0.35;

export default function BackgroundMusic({ active }) {
  const audioRef = useRef(null);
  const fadeRef = useRef(null);

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

    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    fadeRef.current = requestAnimationFrame(step);
  }, []);

  const playMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !active || !audio.paused) return;

    try {
      await audio.play();
      fadeIn();
    } catch {
      // Браузер запретил autoplay со звуком — запускаем при первом действии пользователя.
    }
  }, [active, fadeIn]);

  useEffect(() => {
    if (!active) return;

    playMusic();

    const resume = () => playMusic();
    window.addEventListener('pointerdown', resume, { once: true });
    window.addEventListener('keydown', resume, { once: true });
    window.addEventListener('touchstart', resume, { once: true });
    window.addEventListener('scroll', resume, { once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
      window.removeEventListener('touchstart', resume);
      window.removeEventListener('scroll', resume);
    };
  }, [active, playMusic]);

  useEffect(() => () => {
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
  }, []);

  return (
    <audio
      ref={audioRef}
      src={MUSIC_SRC}
      loop
      preload="auto"
      autoPlay
      aria-hidden="true"
    />
  );
}
