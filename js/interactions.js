/**
 * Click microinteraction: tapping a flower sends up a small heart.
 */

function spawnHeart(target) {
  const heart = document.createElement("span");
  heart.className = "heart-pop";
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
