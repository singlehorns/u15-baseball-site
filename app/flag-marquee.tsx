"use client";

import { useState } from "react";
import { teamFlagSrc, teamOptions } from "./schedule-data";

export function FlagMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <section id="teams" className="flag-marquee" aria-label="參賽球隊國旗" data-paused={paused}>
      <div className="flag-marquee-toolbar">
        <p><span lang="en">TEAMS</span> 八隊齊聚，熱血開打</p>
        <span className="flag-marquee-hint">左右滑動查看球隊</span>
        <button className="flag-marquee-toggle" type="button" aria-pressed={paused} aria-label={paused ? "播放國旗跑馬燈" : "暫停國旗跑馬燈"} onClick={() => setPaused(previous => !previous)}>
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            {paused ? <path d="m7 4 9 6-9 6Z" /> : <><path d="M6 4h3v12H6Z" /><path d="M12 4h3v12h-3Z" /></>}
          </svg>
          {paused ? "播放" : "暫停"}
        </button>
      </div>
      <p className="sr-only">參賽球隊：{teamOptions.join("、")}。</p>
      <div className="flag-marquee-window" tabIndex={0} role="group" aria-label="國旗展示，聚焦時暫停跑動">
        <div className="flag-marquee-track" aria-hidden="true">
          {[0, 1].map(copy => (
            <div className="flag-marquee-group" key={copy}>
              {teamOptions.map(team => (
                <div className="flag-marquee-item" key={team}>
                  <img src={teamFlagSrc[team === "中華" ? "台灣" : team]} alt="" width={108} height={72} loading="lazy" />
                  <span>{team}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
