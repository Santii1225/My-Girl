import { initBouquet } from "./animation.js";
import { initInteractions } from "./interactions.js";
import { initWatering } from "./watering.js";

function init() {
  initBouquet();
  initInteractions();
  initWatering();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
