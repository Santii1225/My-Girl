/**
 * The watering can: pressing it sends a can on a visible journey out over
 * the bouquet, pouring on each flower in turn, then back to rest. Once that
 * finishes, the bouquet grows a little more; once it has been watered
 * enough times, the sunflowers settle into a gentle breathing pulse and
 * send up big hearts to show they're well cared for.
 *
 * Care is intentionally kept in memory only (not localStorage): every fresh
 * visit or reload starts the bouquet back at its resting size, so the
 * watering moment is always there to replay rather than staying maxed out
 * forever after the first visit.
 */

import { spawnHeart } from "./interactions.js";

const MAX_WATERS = 6;
const GROWTH_MAX = 0.4; // flowers grow up to 40% larger at full care
const JOURNEY_DURATION = 2600; // ms, must match the canJourney animation duration
const DROP_TIMES = [0.3, 0.7, 1.1, 1.5, 1.9, 2.3]; // seconds into the journey when a drop falls

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function applyGrowth(bouquet, count) {
  const growth = 1 + (count / MAX_WATERS) * GROWTH_MAX;
  bouquet.style.setProperty("--growth", growth.toFixed(3));
}

/** Spawns a drop at the can's real, current on-screen position (its spout). */
function spawnDropFromRig(rig, bouquet) {
  const rigRect = rig.getBoundingClientRect();
  const bouquetRect = bouquet.getBoundingClientRect();
  const x = rigRect.left + rigRect.width * 0.78 - bouquetRect.left;
  const y = rigRect.top + rigRect.height * 0.7 - bouquetRect.top;

  const drop = document.createElement("span");
  drop.className = "water-drop";
  drop.style.left = `${x}px`;
  drop.style.top = `${y}px`;
  bouquet.appendChild(drop);
  drop.addEventListener("animationend", () => drop.remove(), { once: true });
}

function celebrate(bouquet) {
  const flowers = bouquet.querySelectorAll(".bouquet-flower");
  flowers.forEach((flower, i) => {
    setTimeout(() => spawnHeart(flower, { big: true }), i * 140);
  });
}

/** Runs the can's pour-over-the-bouquet journey and resolves once it's done. */
function pourOverBouquet(rig, bouquet, reduced) {
  return new Promise((resolve) => {
    if (reduced) {
      resolve();
      return;
    }

    DROP_TIMES.forEach((t) => {
      setTimeout(() => spawnDropFromRig(rig, bouquet), t * 1000);
    });

    rig.classList.remove("is-active");
    void rig.offsetWidth; // restart the animation on repeated presses
    rig.classList.add("is-active");

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      rig.classList.remove("is-active");
      resolve();
    };
    rig.addEventListener("animationend", finish, { once: true });
    // safety net in case the animationend event is ever missed
    setTimeout(finish, JOURNEY_DURATION + 150);
  });
}

export function initWatering(root = document) {
  const can = root.querySelector("#waterCan");
  const rig = root.querySelector("#canRig");
  const bouquet = root.querySelector("#bouquet");
  if (!can || !rig || !bouquet) return;

  let count = 0;
  let busy = false;
  applyGrowth(bouquet, count);

  can.addEventListener("click", async () => {
    if (busy) return;
    busy = true;
    can.disabled = true;

    const reduced = prefersReducedMotion();
    const wasLoved = count >= MAX_WATERS;

    await pourOverBouquet(rig, bouquet, reduced);

    count = Math.min(count + 1, MAX_WATERS);
    applyGrowth(bouquet, count);

    if (count >= MAX_WATERS) {
      bouquet.classList.add("bouquet--loved");
      if (!wasLoved) {
        celebrate(bouquet);
      } else {
        const flowers = Array.from(bouquet.querySelectorAll(".bouquet-flower"));
        const lucky = flowers[Math.floor(Math.random() * flowers.length)];
        if (lucky) spawnHeart(lucky, { big: true });
      }
    }

    can.disabled = false;
    busy = false;
  });
}
