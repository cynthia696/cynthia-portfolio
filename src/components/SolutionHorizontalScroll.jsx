import { motion, useScroll, useTransform } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';

import card1Bg from '../../images/solution-card1-bg.png';
import card3Bg from '../../images/solution-card3-bg.png';
import card5Bg from '../../images/solution-card5-bg.png';
import mobileDemo1 from '../../images/mobile-demo-1.webm';
import mobileDemo1Hevc from '../../images/mobile-demo-1.mov';
import mobileDemo3 from '../../images/mobile-demo-3.webm';
import mobileDemo3Hevc from '../../images/mobile-demo-3.mov';
import mobileDemo4 from '../../images/mobile-demo-4.webm';
import mobileDemo4Hevc from '../../images/mobile-demo-4.mov';
import mobileDemo5 from '../../images/mobile-demo-5.webm';
import mobileDemo5Hevc from '../../images/mobile-demo-5.mov';
import desktopDemo2 from '../../images/desktop-demo-2.webm';
import desktopDemo2Hevc from '../../images/desktop-demo-2.mov';
import permissionsFlexible1 from '../../images/permissions-flexible-group-1.png';
import permissionsFlexible2 from '../../images/permissions-flexible-group-2.png';
import permissionsDirectReporting from '../../images/permissions-direct-reporting.png';
import permissionsActivityLeft from '../../images/permissions-activity-left.png';
import permissionsActivityRight from '../../images/permissions-activity-right.png';
import wiwantFlavours from '../../images/wiwant-solution/01-flavours.png';
import wiwantExplore from '../../images/wiwant-solution/02-explore.png';
import wiwantCellarNotes from '../../images/wiwant-solution/03-cellar-notes.png';
import wiwantScan from '../../images/wiwant-solution/04-scan.png';
import wiwantSocialNotes from '../../images/wiwant-solution/05-social-notes.png';
import wiwantComments from '../../images/wiwant-solution/06-comments.png';
import wiwantDetail from '../../images/wiwant-solution/07-detail.png';

const autoCollectCustomerDataCard = {
  title: 'Auto-Collect Customer Data',
  description:
    'Before, customer data was manual. Now, warranty registration and one-tap scanning automatically link customers to assets with no paperwork.',
  image: card1Bg,
  video: mobileDemo1,
  videoHevc: mobileDemo1Hevc,
  hasAlpha: true,
  type: 'standard',
};

const centralizedClientInformationCard = {
  title: 'Centralized Client Information',
  description:
    'Before, Kristan juggled WhatsApp, iMessage, and Excel for clients. Now reports and add-ons live in one place, saving her 35% of her time every day.',
  background: 'linear-gradient(180deg, #F8F8F8 0%, #EDEDED 100%)',
  video: desktopDemo2,
  videoHevc: desktopDemo2Hevc,
  hasAlpha: true,
  type: 'desktop',
};

export const defaultSolutionCards = [
  {
    id: 1,
    ...autoCollectCustomerDataCard,
  },
  {
    id: 2,
    ...centralizedClientInformationCard,
  },
  {
    id: 3,
    title: 'Direct Manufacturer Reporting',
    description: 'Customers can report issues directly to manufacturers, who can view and resolve all reports in one place instead of juggling calls, emails, and messages.',
    image: card3Bg,
    video: mobileDemo3,
    videoHevc: mobileDemo3Hevc,
    hasAlpha: true,
    type: 'standard',
  },
  {
    id: 4,
    title: 'Direct Issue Capture',
    description: 'August can investigate issues directly and message customers for additional details, including real-time photos and videos—without relying on customer support.',
    background: 'linear-gradient(180deg, #F8F8F8 0%, #EDEDED 100%)',
    video: mobileDemo4,
    videoHevc: mobileDemo4Hevc,
    hasAlpha: true,
    type: 'standard',
  },
  {
    id: 5,
    title: 'Engage Customers Proactively',
    description: 'Manufacturers can preset maintenance routines while customers simply log usage. The system alerts both sides when service is due, extending product life and strengthening customer relationships.',
    image: card5Bg,
    video: mobileDemo5,
    videoHevc: mobileDemo5Hevc,
    hasAlpha: true,
    type: 'standard',
  },
];

/** Permissions: Flexible + Access Management desktop cards, then phone cards on matching light bg. */
const permissionsLightBg = 'linear-gradient(180deg, #F8F8F8 0%, #EDEDED 100%)';

export const permissionsSolutionCards = [
  {
    id: 1,
    ...centralizedClientInformationCard,
    title: 'Flexible Access Control',
    description:
      'Based on client needs, Gripp can choose the right permission level when setting up client accounts.',
    video: undefined,
    videoHevc: undefined,
    mediaImage: permissionsFlexible1,
    hasAlpha: false,
  },
  {
    id: 2,
    ...centralizedClientInformationCard,
    title: 'Access Management',
    description:
      'Managers can now define account types for new hires and assign relevant assets and groups during onboarding.',
    video: undefined,
    videoHevc: undefined,
    mediaImage: permissionsFlexible2,
    hasAlpha: false,
  },
  {
    id: 3,
    title: 'Sharing by Account Type',
    description:
      'Before, Mariah shared everything. Now, she shares only what each employee needs. Seasonal workers see only what matters, so they can focus without extra explanation.',
    background: permissionsLightBg,
    video: undefined,
    mediaImage: permissionsDirectReporting,
    hasAlpha: false,
    type: 'standard',
  },
  {
    id: 6,
    title: 'Centralized Task Activity',
    description:
      'When Devin joins different workplaces, he can view All Activity to see his to-do tasks and what he has completed before. He can also filter by different workplaces.',
    background: permissionsLightBg,
    video: undefined,
    mediaImages: [permissionsActivityLeft, permissionsActivityRight],
    hasAlpha: true,
    type: 'wide-phones',
  },
];

export const wiwantSolutionCards = [
  {
    id: 1,
    title: 'Taste onboarding',
    description: 'New drinkers pick 5+ flavour profiles so WIWANT can start learning what they actually like.',
    screenshot: wiwantFlavours,
    background: 'transparent',
    type: 'phone-shot',
  },
  {
    id: 2,
    title: 'Personalized picks',
    description: 'Home explores wines by match rate, market rating, and price—curated from each drinker’s taste.',
    screenshot: wiwantExplore,
    background: 'transparent',
    type: 'phone-shot',
  },
  {
    id: 3,
    title: 'Cellar notes',
    description: 'Track your bottles with ratings, tasting notes, and photos—so preferences stay portable over time.',
    screenshot: wiwantCellarNotes,
    background: 'transparent',
    type: 'phone-shot',
  },
  {
    id: 4,
    title: 'Label scan',
    description: 'Point the camera at a bottle to identify the wine and see match vs market rates in seconds.',
    screenshot: wiwantScan,
    background: 'transparent',
    type: 'phone-shot',
  },
  {
    id: 5,
    title: 'Community notes',
    description: 'Browse what other drinkers are saying—ratings, pairings, and real photos from real bottles.',
    screenshot: wiwantSocialNotes,
    background: 'transparent',
    type: 'phone-shot',
  },
  {
    id: 6,
    title: 'Conversations',
    description: 'Dive into comments on a tasting to learn how others experience the same wine.',
    screenshot: wiwantComments,
    background: 'transparent',
    type: 'phone-shot',
  },
  {
    id: 7,
    title: 'Wine detail',
    description: 'See origin, grapes, tasting notes, and drinking suggestions—enough to buy with confidence.',
    screenshot: wiwantDetail,
    background: 'transparent',
    type: 'phone-shot',
  },
];

function SolutionCard({ card }) {
  const isDesktop = card.type === 'desktop';
  const isPhoneShot = card.type === 'phone-shot';
  const isWidePhones = card.type === 'wide-phones';
  const isLargePhone = card.type === 'standard';
  const hasImageBackground = Boolean(card.image) && !isPhoneShot;
  const phoneStillImages = card.mediaImages?.length
    ? card.mediaImages
    : card.mediaImage
      ? [card.mediaImage]
      : [];

  // Oversized landscape frames: center-crop so the device fills the card.
  // Phone content is ~28% of frame width — ~980–1050px display keeps it large.
  const mediaClass = card.id === 5
    ? 'w-[980px] max-w-none'
    : isLargePhone
      ? 'w-[980px] max-w-none'
      : isDesktop
        ? 'w-[min(96%,960px)] max-w-[960px]'
        : 'w-[min(90%,420px)] max-w-[420px]';

  const mediaBottomClass =
    card.id === 1 || card.id === 3 || card.id === 4 || card.id === 5
      ? 'bottom-10'
      : isLargePhone
        ? 'bottom-0'
        : isDesktop
          ? 'bottom-8'
          : 'bottom-0';

  // WIWANT: bare phone mockups side-by-side — no card chrome, no captions
  if (isPhoneShot) {
    return (
      <article className="flex w-[300px] shrink-0 items-start justify-center bg-transparent sm:w-[320px] md:w-[340px]">
        <img
          src={card.screenshot}
          alt={card.title}
          className="h-auto w-full bg-transparent object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.18)]"
          draggable="false"
        />
      </article>
    );
  }

  return (
    <article
      className={[
        'relative h-[800px] shrink-0 overflow-hidden rounded-2xl',
        'shadow-[0_18px_50px_rgba(0,0,0,0.16)]',
        isDesktop
          ? 'w-[min(85vw,1000px)]'
          : isWidePhones
            ? 'w-[min(85vw,720px)]'
            : 'w-[435px] aspect-[9/16]',
      ].join(' ')}
    >
      {/* Clipped card chrome */}
      <div className="absolute inset-0">
        {hasImageBackground ? (
          <img
            src={card.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: card.background || 'linear-gradient(180deg, #F8F8F8 0%, #EDEDED 100%)' }}
          />
        )}

        {hasImageBackground && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-48 bg-gradient-to-b from-black/55 to-transparent"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Top text */}
      <div className={[
        'relative z-10 px-6 pb-2 pt-8',
        hasImageBackground ? 'text-white' : 'text-neutral-800',
      ].join(' ')}>
        <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
          {card.title}
        </h3>
        <p
          className={[
            'mt-2 text-sm leading-6',
            isDesktop || isWidePhones ? 'max-w-[520px]' : '',
            hasImageBackground ? 'text-white/95' : 'text-neutral-500',
          ].filter(Boolean).join(' ')}
        >
          {card.description}
        </p>
      </div>

      {/* True-alpha videos: HEVC/MOV for Safari, WebM for Chrome/Firefox */}
      {card.video && (
        <div
          className={[
            'pointer-events-none absolute left-1/2 z-[2] -translate-x-1/2',
            mediaBottomClass,
            mediaClass,
          ].join(' ')}
        >
          <video
            className="h-auto w-full object-contain object-bottom"
            autoPlay
            muted
            loop
            playsInline
          >
            {card.videoHevc ? (
              <source src={card.videoHevc} type='video/mp4; codecs="hvc1"' />
            ) : null}
            <source src={card.video} type="video/webm" />
          </video>
        </div>
      )}
      {!card.video && phoneStillImages.length > 0 && (
        <div
          className={[
            'absolute left-1/2 z-[2] flex -translate-x-1/2 items-end justify-center',
            isDesktop ? 'bottom-14' : 'bottom-8',
            isDesktop
              ? 'w-[92%] max-w-[960px]'
              : isWidePhones
                ? 'w-[88%] max-w-[620px] gap-4'
                : 'w-[72%] max-w-[280px]',
          ].join(' ')}
        >
          {phoneStillImages.map((src, index) => (
            <img
              key={`${src}-${index}`}
              src={src}
              alt=""
              className={[
                'h-auto object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.18)]',
                isWidePhones ? 'w-[calc(50%-0.5rem)] max-w-[280px]' : 'w-full',
              ].join(' ')}
              draggable="false"
            />
          ))}
        </div>
      )}
    </article>
  );
}

export default function SolutionHorizontalScroll({
  headline = 'Gripp Rendezvoo helps manufacturers build stronger customer relationships by connecting farmers, equipment, and service teams in one shared platform.',
  body = 'Scroll down to move horizontally through the product surfaces. The wider desktop card anchors the sequence while supporting mobile and workflow cards slide through as the section scrubs.',
  cards = defaultSolutionCards,
  scrollEnd = '-58%',
  sectionHeightClass = 'h-[300vh]',
  alignEndWithText = false,
}) {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [endX, setEndX] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useLayoutEffect(() => {
    if (!alignEndWithText) return undefined;

    const measure = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;
      // Keep the last phone's right edge flush with the text column (viewport width).
      const next = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setEndX(next);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (trackRef.current) ro.observe(trackRef.current);

    const imgs = trackRef.current?.querySelectorAll('img') ?? [];
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', measure);
    });

    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      imgs.forEach((img) => img.removeEventListener('load', measure));
    };
  }, [alignEndWithText, cards]);

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    alignEndWithText ? [0, -endX] : ['0%', scrollEnd]
  );

  return (
    <section ref={sectionRef} className={['relative', sectionHeightClass].join(' ')}>
      <div className="sticky top-0 overflow-hidden">
        <div className="flex min-h-screen w-full flex-col justify-center px-[clamp(24px,5vw,80px)] py-16">
          <div ref={viewportRef} className="mx-auto w-full max-w-[1120px]">
            <div className="mb-10 w-full">
              <p
                className="m-0 text-[14px] font-medium uppercase tracking-[0.04em]"
                style={{ fontFamily: '"Inter Medium", Inter, system-ui, sans-serif', color: '#56483b' }}
              >
                Solution
              </p>
              <h2
                className="m-0 mt-4 text-[36px] font-medium leading-[1.25] tracking-[-0.03em] text-[#222]"
                style={{ fontFamily: '"Inter Medium", Inter, system-ui, sans-serif' }}
              >
                {headline}
              </h2>
              <p
                className="mt-5 w-full text-base font-normal leading-[1.7] text-[#444]"
                style={{ fontFamily: '"Inter Regular", Inter, system-ui, sans-serif' }}
              >
                {body}
              </p>
            </div>

            <motion.div style={{ x }} className="w-max will-change-transform">
              <div
                ref={trackRef}
                className={[
                  'flex shrink-0 items-start',
                  alignEndWithText ? 'gap-6 md:gap-8' : 'gap-6 pr-6 md:gap-8',
                ].join(' ')}
              >
                {cards.map((card) => (
                  <SolutionCard key={card.id} card={card} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
