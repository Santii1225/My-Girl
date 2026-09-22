/**
 * Click microinteraction: tapping a flower sends up a heart.
 */

export function spawnHeart(target, { big = false } = {}) {
  const heart = document.createElement("span");
  heart.className = big ? "heart-pop heart-pop--big" : "heart-pop";
  heart.textContent = "♥";
  heart.setAttribute("aria-hidden", "true");
  target.appendChild(heart);
  heart.addEventListener("animationend", () => heart.remove(), { once: true });
}

export function initInteractions(root = document) {
  root.querySelectorAll(".bouquet-flower").forEach((el) => {
    el.addEventListener("click", () => spawnHeart(el));
  });
}
