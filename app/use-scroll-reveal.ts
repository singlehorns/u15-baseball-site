"use client";

import { useEffect, type RefObject } from "react";

export function useScrollReveal(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const revealed = new Set<HTMLElement>();
    let observer: IntersectionObserver | null = null;

    const reset = () => {
      observer?.disconnect();
      targets.forEach((target) => delete target.dataset.revealState);
    };

    const setup = () => {
      reset();
      if (preference.matches) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const target = entry.target as HTMLElement;
            target.dataset.revealState = "visible";
            revealed.add(target);
            observer?.unobserve(target);
          });
        },
        { rootMargin: "0px 0px -32px 0px", threshold: 0 },
      );

      targets.forEach((target) => {
        // A restored scroll position must not replay content already passed.
        if (revealed.has(target) || target.getBoundingClientRect().bottom <= 0) {
          revealed.add(target);
          return;
        }
        target.dataset.revealState = "pending";
        observer?.observe(target);
      });
    };

    const showFocusedContent = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>("[data-reveal]");
      if (!target) return;
      revealed.add(target);
      observer?.unobserve(target);
      delete target.dataset.revealState;
    };

    setup();
    preference.addEventListener("change", setup);
    root.addEventListener("focusin", showFocusedContent);

    return () => {
      reset();
      preference.removeEventListener("change", setup);
      root.removeEventListener("focusin", showFocusedContent);
    };
  }, [rootRef]);
}
