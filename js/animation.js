/**
 * Computes and assigns the stagger timing for the bouquet's growth sequence,
 * entirely within the hero: each flower's --d delay, then the paper wrap,
 * ribbon and hint delays that follow the last flower's bloom. The letter and
 * footer are no longer on this fixed timeline — see js/reveal.js, which
 * plays them in as the visitor scrolls down to them instead.
 */

const STAGGER = 0.28;
const LEAF_OFFSET = 0.22;
const BLOOM_OFFSET = 0.45;
const BLOOM_DURATION = 0.6;
const PAPER_GAP = 0.2;
const PAPER_DURATION = 0.9;
const RIBBON_GAP = 0.1;
const RIBBON_DURATION = 0.5;
const HINT_GAP = 0.15;

function seconds(value) {
  return `${value.toFixed(2)}s`;
}

export function initBouquet(root = document) {
  const flowers = Array.from(root.querySelectorAll(".bouquet-flower"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rootStyle = document.documentElement.style;

  if (reducedMotion || flowers.length === 0) {
    flowers.forEach((el) => el.style.setProperty("--d", "0s"));
    rootStyle.setProperty("--paper-delay", "0s");
    rootStyle.setProperty("--ribbon-delay", "0s");
    rootStyle.setProperty("--hint-delay", "0s");
    return;
  }

  flowers.forEach((el, index) => {
    el.style.setProperty("--d", seconds(index * STAGGER));
  });

  const lastDelay = (flowers.length - 1) * STAGGER;
  const bloomEnd = lastDelay + BLOOM_OFFSET + BLOOM_DURATION;
  const paperDelay = bloomEnd + PAPER_GAP;
  const ribbonDelay = paperDelay + PAPER_DURATION + RIBBON_GAP;
  const hintDelay = ribbonDelay + RIBBON_DURATION + HINT_GAP;

  rootStyle.setProperty("--paper-delay", seconds(paperDelay));
  rootStyle.setProperty("--ribbon-delay", seconds(ribbonDelay));
  rootStyle.setProperty("--hint-delay", seconds(hintDelay));
}

// exported for reuse/testing of the leaf offset constant elsewhere
export const TIMING = { STAGGER, LEAF_OFFSET, BLOOM_OFFSET, BLOOM_DURATION };
