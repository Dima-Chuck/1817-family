import { useEffect } from 'react';

/**
 * Keep native browser scrolling.
 * The previous wheel interpolation ran at the same time as GSAP ScrollTrigger
 * and caused visible lag/judder while pinned photo sections were changing.
 */
export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;

    // Native scrolling is GPU/browser optimized and works correctly with
    // ScrollTrigger, touchpads, mouse wheels and keyboard navigation.
    return undefined;
  }, [enabled]);
}
