/**
 * Mirrors mouse hover for touch screens: as a finger drags across the
 * bouquet, whichever flower is currently underneath it gets the same lift
 * and glow that :hover gives on desktop (via the .is-touched class),
 * instead of the flowers only reacting to a static tap.
 */

function flowerAt(x, y) {
  const el = document.elementFromPoint(x, y);
  return el ? el.closest(".bouquet-flower") : null;
}

export function initTouchHover(root = document) {
  const bouquet = root.querySelector("#bouquet");
  if (!bouquet || !("ontouchstart" in window)) return;

  let active = null;

  const setActive = (flower) => {
    if (active === flower) return;
    if (active) active.classList.remove("is-touched");
    active = flower;
    if (active) active.classList.add("is-touched");
  };

  const clear = () => setActive(null);

  bouquet.addEventListener(
    "touchstart",
    (e) => {
      const touch = e.touches[0];
      if (touch) setActive(flowerAt(touch.clientX, touch.clientY));
    },
    { passive: true }
  );

  bouquet.addEventListener(
    "touchmove",
    (e) => {
      const touch = e.touches[0];
      if (touch) setActive(flowerAt(touch.clientX, touch.clientY));
    },
    { passive: true }
  );

  bouquet.addEventListener("touchend", clear, { passive: true });
  bouquet.addEventListener("touchcancel", clear, { passive: true });
}
