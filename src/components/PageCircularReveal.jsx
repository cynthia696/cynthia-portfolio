import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  PAGE_TRANSITION,
  PAGE_TRANSITION_SCALE_FROM,
} from '../lib/circularExpandOrigin';

/**
 * Full-page fade + scale entrance (no clip-path).
 */
export default function PageCircularReveal({
  children,
  className = '',
  heroImageSrc,
  skipAnimation = false,
}) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(!heroImageSrc || reduceMotion || skipAnimation);
  const instant = reduceMotion || skipAnimation;

  useEffect(() => {
    if (!heroImageSrc || ready) return;
    const img = new Image();
    img.src = heroImageSrc;
    const mark = () => setReady(true);
    img.decode?.().then(mark).catch(mark);
    img.onload = mark;
    img.onerror = mark;
  }, [heroImageSrc, ready]);

  return (
    <motion.div
      initial={instant ? false : { opacity: 0, scale: PAGE_TRANSITION_SCALE_FROM }}
      animate={
        instant || !ready
          ? instant
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: PAGE_TRANSITION_SCALE_FROM }
          : { opacity: 1, scale: 1 }
      }
      transition={PAGE_TRANSITION}
      className={[
        'w-full min-h-screen origin-center will-change-[opacity,transform]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-page-reveal
    >
      {children}
    </motion.div>
  );
}
