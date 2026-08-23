import { useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Intro from './components/Intro';
import FamilyHero from './components/FamilyHero';
import OurStory from './components/OurStory';
import Dasha from './components/Dasha';
import FamilySection from './components/FamilySection';
import Sonya from './components/Sonya';
import Nastya from './components/Nastya';
import FourPeople from './components/FourPeople';
import Gallery from './components/Gallery';
import Finale from './components/Finale';
import FilmGrain from './components/FilmGrain';
import BackgroundMusic from './components/BackgroundMusic';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import './App.scss';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroDone(true), []);

  useSmoothScroll(introDone);

  useEffect(() => {
    if (introDone) {
      ScrollTrigger.refresh();
    }
  }, [introDone]);

  return (
    <div className={`app ${introDone ? 'app--ready' : ''}`}>
      {!introDone && <Intro onComplete={handleIntroComplete} />}

      <FilmGrain />
      <BackgroundMusic active={introDone} />

      <main className="app__main" aria-hidden={!introDone}>
        <FamilyHero />
        <OurStory />
        <Dasha />
        <FamilySection />
        <Sonya />
        <Nastya />
        <FourPeople />
        <Gallery />
        <Finale />
      </main>
    </div>
  );
}
