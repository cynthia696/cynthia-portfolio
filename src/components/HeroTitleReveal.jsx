import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

const childVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      ease: EASE,
    },
  },
};

/**
 * Character-by-character staggered text reveal.
 * @param {'immediate' | 'scroll'} trigger — scroll = animate once when in view
 */
export default function HeroTitleReveal({
  text = 'Atlas Analytics',
  staggerChildren = 0.05,
  delayChildren = 0.3,
  trigger = 'immediate',
  className = '',
}) {
  const reduceMotion = useReducedMotion();
  const characters = Array.from(text);
  const scroll = trigger === 'scroll';

  if (reduceMotion) {
    return <>{text}</>;
  }

  return (
    <motion.span
      className={`hero-title-reveal ${className}`.trim()}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren, delayChildren },
        },
      }}
      initial="hidden"
      {...(scroll
        ? {
            whileInView: 'visible',
            viewport: { once: true, amount: 0.55, margin: '0px 0px -8% 0px' },
          }
        : { animate: 'visible' })}
      aria-label={text}
      style={{ display: 'inline-block' }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={`${index}-${char}`}
          className="hero-title-reveal__char"
          variants={childVariants}
          aria-hidden="true"
          style={{
            display: 'inline-block',
            whiteSpace: 'pre',
            willChange: 'opacity, transform, filter',
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}
