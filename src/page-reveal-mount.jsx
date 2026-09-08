import { animate } from 'framer-motion';
import {
  PAGE_TRANSITION_DURATION,
  PAGE_TRANSITION_EASE,
  PAGE_TRANSITION_SCALE_FROM,
  clearExpandHandoff,
  readExpandHandoff,
} from './lib/circularExpandOrigin';

/**
 * Destination page entrance: opacity + scale only (no clip-path).
 */
const page = document.querySelector('[data-page-reveal], .page-reveal');

if (page) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroImg = page.querySelector('.case-hero__media');
  const handoff = readExpandHandoff();
  const fromOverlay =
    handoff?.mode === 'overlay-complete' || handoff?.mode === 'skip-motion';

  const finishLayout = () => {
    page.classList.add('is-hydrated', 'is-ready');
    page.style.opacity = '1';
    page.style.transform = 'none';
    page.style.willChange = 'auto';
    document.body.classList.add('is-page-ready');
    document.documentElement.classList.remove('expand-handoff', 'is-page-transitioning');
    clearExpandHandoff();
  };

  const preloadHero = async () => {
    if (!heroImg) return;
    if (!heroImg.complete) {
      await new Promise((resolve) => {
        heroImg.addEventListener('load', resolve, { once: true });
        heroImg.addEventListener('error', resolve, { once: true });
      });
    }
    try {
      if (typeof heroImg.decode === 'function') {
        await heroImg.decode();
      }
    } catch {
      /* continue */
    }
  };

  const waitTwoFrames = () =>
    new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

  const runReveal = async () => {
    document.documentElement.classList.add('is-page-transitioning');
    page.style.opacity = '0';
    page.style.transform = `scale(${PAGE_TRANSITION_SCALE_FROM})`;
    page.style.transformOrigin = 'center center';
    page.style.willChange = 'opacity, transform';

    await preloadHero();
    page.classList.add('is-hydrated');
    await waitTwoFrames();

    await animate(
      page,
      { opacity: 1, scale: 1 },
      {
        opacity: { duration: 1.0, ease: PAGE_TRANSITION_EASE },
        scale: { duration: 1.2, ease: PAGE_TRANSITION_EASE },
        duration: PAGE_TRANSITION_DURATION,
        ease: PAGE_TRANSITION_EASE,
      }
    );

    finishLayout();
  };

  if (fromOverlay || reduceMotion) {
    finishLayout();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runReveal, { once: true });
  } else {
    runReveal();
  }
}
