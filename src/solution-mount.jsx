import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SolutionHorizontalScroll, {
  defaultSolutionCards,
  permissionsSolutionCards,
  wiwantSolutionCards,
} from './components/SolutionHorizontalScroll';
import './index.css';

const rootElement = document.getElementById('solution-scroll-root');

const isPermissionsWork =
  /permissions\.html/i.test(window.location.pathname) ||
  rootElement?.dataset?.variant === 'permissions';

const isWiwantWork =
  /wiwant\.html/i.test(window.location.pathname) ||
  rootElement?.dataset?.variant === 'wiwant';

const permissionsHeadline =
  "Introduced role-based permissions, allowing farmers to control access based on each user's role and responsibilities.";

const permissionsBody =
  'In 2025, over 35% of our clients requested access control to manage seasonal workers coming and going. As demand grew, we introduced the feature, achieving a 85% satisfaction rate among all adopting clients.';

const wiwantHeadline =
  'WIWANT helps drinkers discover wines that match their taste while helping the brand grow from accessories into wine itself.';

const wiwantBody =
  'Scroll down to move horizontally through the product surfaces. Each card shows a key moment in the WIWANT experience, from onboarding flavours to scanning a bottle and reading community notes.';

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <SolutionHorizontalScroll
        headline={
          isWiwantWork
            ? wiwantHeadline
            : isPermissionsWork
              ? permissionsHeadline
              : undefined
        }
        body={
          isWiwantWork
            ? wiwantBody
            : isPermissionsWork
              ? permissionsBody
              : undefined
        }
        cards={
          isWiwantWork
            ? wiwantSolutionCards
            : isPermissionsWork
              ? permissionsSolutionCards
              : defaultSolutionCards
        }
        scrollEnd={isWiwantWork ? '-72%' : '-58%'}
        sectionHeightClass={isWiwantWork ? 'h-[360vh]' : 'h-[300vh]'}
        alignEndWithText={isWiwantWork}
      />
    </StrictMode>
  );
}
