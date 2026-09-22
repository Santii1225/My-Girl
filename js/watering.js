/**
 * The watering can: each press grows the bouquet a little more. Once it has
 * been watered enough times, the sunflowers settle into a gentle breathing
 * pulse and send up hearts to show they're well cared for.
 */

import { spawnHeart } from "./interactions.js";

const STORAGE_KEY = "girasoles-water-count";
const MAX_WATERS = 6;
const GROWTH_MAX = 0.4; // flowers grow up to 40% larger at full care

function readCount() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const value = raw === null ? 0 : parseInt(raw, 10);
    return Number.isFinite(value) ? Math.min(Math.max(value, 0), MAX_WATERS) : 0;
  } catch (err) {
    return 0;
  }
}

function writeCount(count) {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(count));
  } catch (err) {
    /* private browsing or blocked storage: growth just won't persist */
  }
}

function applyGrowth(bouquet, count) {
  const growth = 1 + (count / MAX_WATERS) * GROWTH_MAX;
  bouquet.style.setProperty("--growth", growth.toFixed(3));
}

function spawnDrops(bouquet) {
  for (let i = 0; i < 3; i++) {
    const drop = document.createElement("span");
    drop.className = "water-drop";
    drop.style.left = `${42 + i * 8}%`;
    drop.style.animationDelay = `${i * 0.08}s`;
    bouquet.appendChild(drop);
    drop.addEventListener("animationend", () => drop.remove(), { once: true });
  }
}

function celebrate(bouquet) {
  const flowers = bouquet.querySelectorAll(".bouquet-flower");
  flowers.forEach((flower, i) => {
    setTimeout(() => spawnHeart(flower, { big: true }), i * 140);
  });
}

export function initWatering(root = document) {
  const can = root.querySelector("#waterCan");
  const bouquet = root.querySelector("#bouquet");
  if (!can || !bouquet) return;

  let count = readCount();
  applyGrowth(bouquet, count);
  if (count >= MAX_WATERS) bouquet.classList.add("bouquet--loved");

  can.addEventListener("click", () => {
    const wasLoved = count >= MAX_WATERS;
    count = Math.min(count + 1, MAX_WATERS);
    writeCount(count);
    applyGrowth(bouquet, count);
    spawnDrops(bouquet);

    can.classList.remove("is-pouring");
    // eslint-disable-next-line no-unused-expressions
    can.offsetWidth; // restart the tilt animation on repeated clicks
    can.classList.add("is-pouring");

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
  });
}
