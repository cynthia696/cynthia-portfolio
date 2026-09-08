import HeroTitleReveal from './HeroTitleReveal';

/**
 * Project hero with optional decorative curved bottom (static SVG).
 * Title uses character-stagger reveal.
 */
export default function ProjectHeroFade({
  title = 'Atlas Analytics',
  imageSrc = '/images/atlas-wmb-dashboard.png',
  imageAlt = '',
  showCurve = true,
}) {
  return (
    <header className="case-hero relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#1a1a1a]">
      <img
        src={imageSrc}
        alt={imageAlt}
        aria-hidden={imageAlt ? undefined : true}
        fetchPriority="high"
        decoding="async"
        className="case-hero__media absolute inset-0 h-full w-full object-cover object-center"
      />
      <div
        className="case-hero__scrim absolute inset-0 bg-gradient-to-b from-black/40 to-black/50"
        aria-hidden="true"
      />
      <h1 className="case-hero__title absolute left-1/2 top-1/2 z-10 max-w-[calc(100%-48px)] -translate-x-1/2 -translate-y-1/2 px-6 text-center text-[clamp(64px,10vw,136px)] font-medium leading-[1.05] tracking-[0.02em] text-white text-balance">
        <HeroTitleReveal text={title} />
      </h1>

      {showCurve ? (
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[45%] w-full"
          viewBox="0 0 100 45"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M0 45 Q50 20 100 45 Z" fill="#ffffff" />
        </svg>
      ) : null}
    </header>
  );
}
