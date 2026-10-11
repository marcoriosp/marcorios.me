"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __revealReady?: boolean;
  }
}

/**
 * Fades `.reveal` elements in as they scroll into view. The root layout hides them
 * (via the `js-reveal` class) before first paint, so this must reveal everything it finds.
 */
export function ScrollReveal() {
  useEffect(() => {
    window.__revealReady = true;
    const root = document.documentElement;
    if (!("IntersectionObserver" in window)) {
      root.classList.remove("js-reveal");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const scan = () => document.querySelectorAll(".reveal:not(.is-revealed)").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
