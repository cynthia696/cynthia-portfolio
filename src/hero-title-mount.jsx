import { createRoot } from 'react-dom/client';
import HeroTitleReveal from './components/HeroTitleReveal';

/** Hero title — play on load */
const titleEl = document.querySelector('.case-hero__title');
if (titleEl) {
  const text = (titleEl.textContent || 'Atlas Analytics').trim();
  titleEl.textContent = '';
  createRoot(titleEl).render(
    <HeroTitleReveal text={text} trigger="immediate" />
  );
}

/** Overview stats (~ 30%) — play when scrolled into view */
document.querySelectorAll('.stat__value--xl').forEach((el) => {
  const text = (el.textContent || '').trim();
  if (!text) return;
  el.textContent = '';
  createRoot(el).render(
    <HeroTitleReveal
      text={text}
      trigger="scroll"
      delayChildren={0.1}
      staggerChildren={0.05}
    />
  );
});
