import { useEffect } from 'react';

/**
 * Lightweight smooth scroll via CSS + wheel easing.
 * Keeps bundle small without Lenis dependency.
 */
export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let rafId = null;
    const ease = 0.08;

    const onWheel = (e) => {
      target += e.deltaY;
      target = Math.max(0, Math.min(target, document.body.scrollHeight - window.innerHeight));
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const tick = () => {
      current += (target - current) * ease;
      if (Math.abs(target - current) < 0.5) {
        current = target;
        window.scrollTo(0, current);
        rafId = null;
        return;
      }
      window.scrollTo(0, current);
      rafId = requestAnimationFrame(tick);
    };

    // Only enable on desktop — native scroll is better on mobile
    const isDesktop = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches;
    if (!isDesktop) return;

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [enabled]);
}
