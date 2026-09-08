/** Shared page-transition handoff between home grid → project page */

export const PAGE_TRANSITION_KEY = 'portfolio-page-transition';

/** Soft glide — less snappy than expo-out */
export const PAGE_TRANSITION_EASE = [0.22, 1, 0.36, 1];
export const PAGE_TRANSITION_DURATION = 1.15;
/** Subtle zoom so the crossfade feels calmer */
export const PAGE_TRANSITION_SCALE_FROM = 1.02;

/**
 * Staggered opacity / scale for a smoother crossfade:
 * fade settles a touch ahead of the scale settle.
 */
export const PAGE_TRANSITION = {
  opacity: { duration: 1.0, ease: PAGE_TRANSITION_EASE },
  scale: { duration: 1.2, ease: PAGE_TRANSITION_EASE },
};

/** @deprecated use PAGE_TRANSITION_KEY */
export const CIRCULAR_EXPAND_KEY = PAGE_TRANSITION_KEY;
/** @deprecated use PAGE_TRANSITION_EASE */
export const CIRCULAR_EXPAND_EASE = PAGE_TRANSITION_EASE;
/** @deprecated use PAGE_TRANSITION_DURATION */
export const CIRCULAR_EXPAND_DURATION = PAGE_TRANSITION_DURATION;

export function writeExpandHandoff(payload) {
  try {
    sessionStorage.setItem(
      PAGE_TRANSITION_KEY,
      JSON.stringify({ ...payload, at: Date.now() })
    );
  } catch {
    /* private mode / quota */
  }
}

export function readExpandHandoff({ maxAgeMs = 8000 } = {}) {
  try {
    const raw = sessionStorage.getItem(PAGE_TRANSITION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    if (maxAgeMs && data.at && Date.now() - data.at > maxAgeMs) {
      sessionStorage.removeItem(PAGE_TRANSITION_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function clearExpandHandoff() {
  try {
    sessionStorage.removeItem(PAGE_TRANSITION_KEY);
    sessionStorage.removeItem('portfolio-circular-expand');
  } catch {
    /* ignore */
  }
}
