import { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  PAGE_TRANSITION,
  PAGE_TRANSITION_SCALE_FROM,
} from '../lib/circularExpandOrigin';

/**
 * Full-page hero entrance — opacity + scale only (no clip-path).
 */
export default function CircularExpandTransition({
  title = 'Project',
  imageSrc,
  onComplete,
  className = '',
}) {
  const doneRef = useRef(false);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[10000] overflow-hidden bg-white ${className}`}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0 w-full min-h-screen origin-center will-change-[opacity,transform]"
        initial={{ opacity: 0, scale: PAGE_TRANSITION_SCALE_FROM }}
        animate={{ opacity: 1, scale: 1 }}
        transition={PAGE_TRANSITION}
        onAnimationComplete={() => {
          if (doneRef.current) return;
          doneRef.current = true;
          onComplete?.();
        }}
      >
        <header className="relative flex h-dvh min-h-screen w-full items-center justify-center overflow-hidden bg-[#1a1a1a]">
          <img
            src={imageSrc}
            alt=""
            decoding="async"
            fetchPriority="high"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/50"
            aria-hidden="true"
          />
          <h1 className="absolute left-1/2 top-1/2 z-10 max-w-[calc(100%-48px)] -translate-x-1/2 -translate-y-1/2 px-6 text-center text-[clamp(64px,10vw,136px)] font-medium leading-[1.05] tracking-[0.02em] text-white text-balance">
            {title}
          </h1>

          {/* Decorative curved bottom (static SVG, not an animated circle wipe) */}
          <svg
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[45%] w-full"
            viewBox="0 0 100 45"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M0 45 Q50 20 100 45 Z" fill="#ffffff" />
          </svg>
        </header>
      </motion.div>
    </div>
  );
}
