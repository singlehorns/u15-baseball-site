"use client";

import { useLayoutEffect, useRef } from "react";

type TrackingTitleProps = {
  text: string;
  as?: "div" | "h2" | "h3";
  className?: string;
  delay?: number;
  hero?: boolean;
  active?: boolean;
};

export function TrackingTitle({ text, as: Tag = "h2", className = "", delay = 0, hero = false, active }: TrackingTitleProps) {
  const titleRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    let disposed = false;

    const measure = () => {
      if (disposed) return;
      const lines = new Map<number, HTMLElement[]>();
      title.querySelectorAll<HTMLElement>(".tracking-char").forEach((character) => {
        const top = character.offsetTop;
        const line = lines.get(top) ?? [];
        line.push(character);
        lines.set(top, line);
      });

      // Spread glyphs within each settled line without changing wrapping or height.
      const spread = window.innerWidth <= 820 ? 0.28 : 0.52;
      lines.forEach((characters) => {
        const first = characters[0];
        const last = characters[characters.length - 1];
        const center = (first.offsetLeft + last.offsetLeft + last.offsetWidth) / 2;
        const offsets = characters.map((character) => (character.offsetLeft + character.offsetWidth / 2 - center) * spread);
        characters.forEach((character, index) => {
          character.style.setProperty("--tracking-offset", `${offsets[index].toFixed(2)}px`);
        });
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(title);
    void document.fonts.ready.then(measure);
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, [text]);

  const characterClass = hero ? "tracking-char title-char" : "tracking-char";
  const tokens = text.match(/[A-Za-z0-9]+|[^A-Za-z0-9]/gu) ?? [];

  return (
    <Tag
      ref={(element) => { titleRef.current = element; }}
      className={`${className} tracking-title`}
      aria-label={text}
      role={Tag === "div" ? "heading" : undefined}
      aria-level={Tag === "div" ? 1 : undefined}
      data-reveal={active === undefined ? "tracking" : undefined}
      data-reveal-repeat={active === undefined ? true : undefined}
      data-reveal-delay={delay}
      data-reveal-state={active === undefined ? undefined : active ? "visible" : "pending"}
    >
      <span className="tracking-copy" aria-hidden="true">
        {tokens.map((token, tokenIndex) => {
          if (/\s/u.test(token)) return token;
          const characters = Array.from(token).map((character, index) => (
            <span className={characterClass} key={`${tokenIndex}-${index}`}>{character}</span>
          ));
          return token.length > 1
            ? <span className="tracking-word" key={tokenIndex}>{characters}</span>
            : characters;
        })}
      </span>
    </Tag>
  );
}
