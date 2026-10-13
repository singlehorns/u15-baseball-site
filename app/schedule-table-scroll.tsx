"use client";

import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";

export function ScheduleTableScroll({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 0, max: 0 });
  const syncPosition = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    const max = Math.max(0, element.scrollWidth - element.clientWidth);
    const left = Math.min(max, Math.max(0, element.scrollLeft));
    setPosition(previous => previous.left === left && previous.max === max ? previous : { left, max });
  }, []);

  useLayoutEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    syncPosition();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", syncPosition);
      return () => window.removeEventListener("resize", syncPosition);
    }
    const observer = new ResizeObserver(syncPosition);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    return () => observer.disconnect();
  }, [syncPosition]);

  const percent = position.max > 0 ? (position.left / position.max) * 100 : 0;

  return (
    <>
      <input
        className="schedule-scroll-rail"
        type="range"
        aria-label="賽程表左右滑動"
        aria-valuetext={`${Math.round(percent)}%`}
        min={0}
        max={100}
        step={1}
        value={percent}
        hidden={position.max <= 1}
        onChange={event => {
          if (!scrollRef.current) return;
          scrollRef.current.scrollLeft = (event.currentTarget.valueAsNumber / 100) * position.max;
          syncPosition();
        }}
      />
      <div
        ref={scrollRef}
        className="schedule-table-scroll"
        role="region"
        aria-label="賽程戰績表，可左右捲動"
        tabIndex={0}
        onScroll={syncPosition}
      >
        {children}
      </div>
    </>
  );
}
