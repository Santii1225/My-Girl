/**
 * Mirrors mouse hover for touch screens: as a finger drags across the
 * bouquet, whichever flower is underneath gets the same lift and glow
 * :hover gives on desktop.
 *
 * It also tells apart "petting" a flower (a small, mostly sideways touch)
 * from an actual swipe: once a gesture reveals itself as vertical, native
 * scrolling takes over and the page moves normally to the letter (or back
 * up), while a sideways caress blocks scrolling so the page doesn't drift
 * while you're just touching the flowers.
 */

const LOCK_THRESHOLD = 8; // px of movement before a gesture's direction is decided

function flowerAt(x, y) {
  const el = document.elementFromPoint(x, y);
  return el ? el.closest(".bouquet-flower") : null;
}

export function initTouchHover(root = document) {
  const bouquet = root.querySelector("#bouquet");
  if (!bouquet || !("ontouchstart" in window)) return;

  let active = null;
  let startX = 0;
  let startY = 0;
  let mode = "idle"; // "idle" | "undecided" | "pet" | "scroll"

  const setActive = (flower) => {
    if (active === flower) return;
    if (active) active.classList.remove("is-touched");
    active = flower;
    if (active) active.classList.add("is-touched");
  };

  const reset = () => {
    setActive(null);
    mode = "idle";
  };

  bouquet.addEventListener(
    "touchstart",
    (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      startX = touch.clientX;
      startY = touch.clientY;
      mode = "undecided";
      setActive(flowerAt(touch.clientX, touch.clientY));
    },
    { passive: true }
  );

  bouquet.addEventListener(
    "touchmove",
    (e) => {
      const touch = e.touches[0];
      if (!touch) return;

      if (mode === "undecided") {
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;
        if (Math.abs(dx) > LOCK_THRESHOLD || Math.abs(dy) > LOCK_THRESHOLD) {
          // more vertical than horizontal: this is a real swipe, let it scroll
          mode = Math.abs(dy) > Math.abs(dx) ? "scroll" : "pet";
        }
      }

      if (mode === "pet") {
        e.preventDefault();
        setActive(flowerAt(touch.clientX, touch.clientY));
      } else if (mode === "scroll") {
        setActive(null);
      }
    },
    { passive: false }
  );

  bouquet.addEventListener("touchend", reset, { passive: true });
  bouquet.addEventListener("touchcancel", reset, { passive: true });
}
