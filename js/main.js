import { initBouquet } from "./animation.js";
import { initInteractions } from "./interactions.js";
import { initWatering } from "./watering.js";
import { initScrollReveal } from "./reveal.js";

function init() {
  initBouquet();
  initInteractions();
  initWatering();
  initScrollReveal();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
