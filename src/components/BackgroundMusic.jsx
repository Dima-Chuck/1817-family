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

  const playMusic = useCallback(async (withSound = true) => {
    const audio = audioRef.current;
    if (!audio || !active) return;

    try {
      // Autoplay policies allow a muted start. Once the page has received a
      // user gesture, immediately restore sound and fade it in.
      if (withSound) audio.muted = false;
      await audio.play();
      fadeIn();
    } catch {
      // If sound autoplay is blocked, keep the track ready and wait for the
      // first user gesture. This is a browser restriction, not a missing file.
      audio.muted = true;
      try {
        await audio.play();
      } catch {
        // Ignore until the next user interaction.
      }
    }
  }, [active, fadeIn]);

  useEffect(() => {
    if (!active) return undefined;

    const audio = audioRef.current;
    if (!audio) return undefined;

    // Start the track as soon as the intro finishes. Muted autoplay is allowed
    // by modern browsers and prevents the track from disappearing completely.
    audio.muted = true;
    audio.volume = 0;
    audio.play().then(() => {
      // If the browser permits scripted unmute after autoplay, fade in now.
      audio.muted = false;
      fadeIn();
    }).catch(() => {});

    const resumeWithSound = () => {
      playMusic(true);
    };

    window.addEventListener('pointerdown', resumeWithSound, { once: true });
    window.addEventListener('keydown', resumeWithSound, { once: true });
    window.addEventListener('touchstart', resumeWithSound, { once: true });

    return () => {
      window.removeEventListener('pointerdown', resumeWithSound);
      window.removeEventListener('keydown', resumeWithSound);
      window.removeEventListener('touchstart', resumeWithSound);
    };
  }, [active, fadeIn, playMusic]);

  useEffect(() => () => {
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
  }, []);

  return (
    <audio
      ref={audioRef}
      src={MUSIC_SRC}
      loop
      preload="auto"
      aria-hidden="true"
    />
  );
}
