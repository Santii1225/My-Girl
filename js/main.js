import { initBouquet } from "./animation.js";
import { initInteractions } from "./interactions.js";

function init() {
  initBouquet();
  initInteractions();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
