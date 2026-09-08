import { createRoot } from 'react-dom/client';
import { animate } from 'framer-motion';
import CircularExpandTransition from './components/CircularExpandTransition';
import {
  PAGE_TRANSITION_DURATION,
  PAGE_TRANSITION_EASE,
  clearExpandHandoff,
  writeExpandHandoff,
} from './lib/circularExpandOrigin';
import './index.css';

const PERF_STYLE_ID = 'page-transition-perf-styles';

function ensurePerfStyles() {
  if (document.getElementById(PERF_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = PERF_STYLE_ID;
  style.textContent = `
    #page-transition-home-root {
      will-change: opacity;
      transform: translateZ(0);
    }
    html.is-page-transitioning,
    html.is-page-transitioning body {
      scrollbar-gutter: stable;
    }
  `;
  document.head.appendChild(style);
}

async function preloadImage(src) {
  if (!src) return;
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  try {
    if (img.decode) await img.decode();
  } catch {
    if (!img.complete) {
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }
  }
}

function wrapHomeForFade() {
  let homeRoot = document.getElementById('page-transition-home-root');
  if (homeRoot) return homeRoot;

  homeRoot = document.createElement('div');
  homeRoot.id = 'page-transition-home-root';
  [...document.body.childNodes].forEach((node) => homeRoot.appendChild(node));
  document.body.appendChild(homeRoot);
  return homeRoot;
}

function runCardExpand({ href, title, imageSrc }) {
  return new Promise(async (resolve, reject) => {
    try {
      ensurePerfStyles();
      await preloadImage(imageSrc);

      const homeRoot = wrapHomeForFade();
      document.documentElement.classList.add('is-page-transitioning');

      writeExpandHandoff({
        href,
        title,
        imageSrc,
        mode: 'overlay-complete',
      });

      const mount = document.createElement('div');
      mount.id = 'page-transition-react-root';
      document.body.appendChild(mount);
      const root = createRoot(mount);

      const homeMotion = {
        duration: PAGE_TRANSITION_DURATION,
        ease: PAGE_TRANSITION_EASE,
      };

      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const homeFade = animate(homeRoot, { opacity: 0 }, homeMotion);

      const expandDone = new Promise((done) => {
        root.render(
          <CircularExpandTransition
            title={title}
            imageSrc={imageSrc}
            onComplete={done}
          />
        );
      });

      await Promise.all([homeFade, expandDone]);
      resolve();
      window.location.assign(href);
    } catch (err) {
      reject(err);
    }
  });
}

function resolveCardMeta(link) {
  const title =
    link.dataset.expandTitle ||
    link.querySelector('.project-title')?.textContent?.trim() ||
    'Project';
  const imageSrc =
    link.dataset.expandImage ||
    link.querySelector('.project-cover')?.getAttribute('src') ||
    '';
  return { title, imageSrc };
}

function bindCardExpand() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let busy = false;

  document.addEventListener(
    'click',
    (event) => {
      const link = event.target.closest('a.project-card-link[href]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href === '#' || href.startsWith('#')) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.target === '_blank') return;

      event.preventDefault();
      if (busy) return;
      busy = true;

      const { title, imageSrc } = resolveCardMeta(link);

      if (reduceMotion || !imageSrc) {
        writeExpandHandoff({ href, title, imageSrc, mode: 'skip-motion' });
        window.location.assign(href);
        return;
      }

      runCardExpand({ href, title, imageSrc }).catch(() => {
        document.documentElement.classList.remove('is-page-transitioning');
        clearExpandHandoff();
        window.location.assign(href);
      });
    },
    true
  );
}

bindCardExpand();
