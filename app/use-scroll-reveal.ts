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
    let replayObserver: IntersectionObserver | null = null;
    let exitObserver: IntersectionObserver | null = null;

    const reset = () => {
      observer?.disconnect();
      replayObserver?.disconnect();
      exitObserver?.disconnect();
      targets.forEach((target) => delete target.dataset.revealState);
    };

    const setup = () => {
      reset();
      if (preference.matches) return;

      const reveal = (entries: IntersectionObserverEntry[], source: IntersectionObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          target.dataset.revealState = "visible";
          revealed.add(target);
          source.unobserve(target);
        });
      };

      observer = new IntersectionObserver(
        reveal,
        { rootMargin: "0px 0px -32px 0px", threshold: 0 },
      );
      replayObserver = new IntersectionObserver(
        reveal,
        { rootMargin: `0px 0px -${Math.min(160, Math.round(window.innerHeight * 0.15))}px 0px`, threshold: 0 },
      );
      // Rearm only beyond the viewport so small scrolls cannot flash visible text.
      exitObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          if (target.contains(document.activeElement)) return;
          revealed.delete(target);
          target.dataset.revealState = "pending";
          (target.dataset.reveal === "tracking" ? replayObserver : observer)?.observe(target);
        });
      }, { rootMargin: "80px 0px 80px 0px", threshold: 0 });

      targets.forEach((target) => {
        const replay = target.hasAttribute("data-reveal-repeat");
        if (replay) exitObserver?.observe(target);
        // A restored scroll position must not replay content already passed.
        if (revealed.has(target) || target.getBoundingClientRect().bottom <= 0) {
          revealed.add(target);
          return;
        }
        target.dataset.revealState = "pending";
        (target.dataset.reveal === "tracking" ? replayObserver : observer)?.observe(target);
      });
    };

    const showFocusedContent = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>("[data-reveal]");
      if (!target) return;
      revealed.add(target);
      observer?.unobserve(target);
      replayObserver?.unobserve(target);
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
