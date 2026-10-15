"use client";

import { useState } from "react";
import { teamFlagSrc, teamOptions } from "./schedule-data";

export function FlagMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <section id="teams" className="flag-marquee" aria-label="參賽球隊國旗" data-paused={paused}>
      <p className="sr-only">參賽球隊：{teamOptions.join("、")}。</p>
      <button className="flag-marquee-window" type="button" aria-pressed={paused} aria-label={paused ? "播放國旗跑馬燈" : "暫停國旗跑馬燈"} onClick={() => setPaused(previous => !previous)}>
        <span className="flag-marquee-track" aria-hidden="true">
          {[0, 1].map(copy => (
            <span className="flag-marquee-group" key={copy}>
              {teamOptions.map(team => (
                <span className="flag-marquee-item" key={team}>
                  <img src={teamFlagSrc[team === "中華" ? "台灣" : team]} alt="" width={108} height={72} loading="lazy" />
                </span>
              ))}
            </span>
          ))}
        </span>
      </button>
    </section>
  );
}
