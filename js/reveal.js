/**
 * Scroll reveal: elements marked [data-reveal] (the letter card, the
 * footer) stay hidden until the visitor scrolls them into view, then play
 * their entrance animation via the .is-visible class. This is what makes
 * the page's animations "come out" as you scroll down, instead of firing
 * all at once on load regardless of what's actually on screen yet.
 */

export function initScrollReveal(root = document) {
  const targets = Array.from(root.querySelectorAll("[data-reveal]"));
  if (targets.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}
