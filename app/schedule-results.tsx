"use client";

import { useRef, useState } from "react";
import { ScheduleTableScroll } from "./schedule-table-scroll";
import { filterSchedule, schedule, stageOptions, teamFlagSrc, teamOptions } from "./schedule-data";

export function ScheduleResults() {
  const [team, setTeam] = useState("");
  const [stage, setStage] = useState("");
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const filtered = filterSchedule(schedule, { team, stage, search });
  const visible = new Set(filtered);
  const hasFilters = Boolean(team || stage || search);

  const reset = () => {
    setTeam("");
    setStage("");
    setSearch("");
  };

  const renderTeam = (name: string) => (
    <>
      <img className="team-flag" src={teamFlagSrc[name]} alt={`${name}國旗`} loading="lazy" />
      <span>{name}</span>
    </>
  );

  return (
    <>
      <form className="schedule-filters" role="search" aria-label="賽程篩選" onSubmit={event => event.preventDefault()}>
        <div className="schedule-filter-field schedule-filter-search">
          <label htmlFor="schedule-search">搜尋賽程</label>
          <div className="schedule-search-input">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
            <input ref={searchRef} id="schedule-search" type="search" placeholder="球隊、日期或賽事階段" value={search} onChange={event => setSearch(event.target.value)} aria-controls="schedule-results-table" />
          </div>
        </div>
        <div className="schedule-filter-field">
          <label htmlFor="schedule-team">球隊</label>
          <select id="schedule-team" value={team} onChange={event => setTeam(event.target.value)} aria-controls="schedule-results-table">
            <option value="">全部球隊</option>
            {teamOptions.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
        <div className="schedule-filter-field">
          <label htmlFor="schedule-stage">賽事階段</label>
          <select id="schedule-stage" value={stage} onChange={event => setStage(event.target.value)} aria-controls="schedule-results-table">
            <option value="">全部階段</option>
            {stageOptions.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
        <button className="schedule-filter-reset" type="button" onClick={reset} disabled={!hasFilters}>
          <span aria-hidden="true">↺</span> 清除篩選
        </button>
      </form>

      <p className="schedule-result-count" role="status" aria-live="polite" aria-atomic="true">顯示 <strong>{filtered.length}</strong> / {schedule.length} 場比賽</p>

      {filtered.length === 0 && (
        <div className="schedule-empty">
          <span className="schedule-empty-mark" aria-hidden="true">⚾</span>
          <h3>沒有符合條件的比賽</h3>
          <p>試試其他球隊、階段或關鍵字，也可以重設篩選查看全部賽程。</p>
          <button className="schedule-filter-reset" type="button" onClick={() => { reset(); searchRef.current?.focus(); }}>重設篩選</button>
        </div>
      )}

      <div hidden={filtered.length === 0}>
        <ScheduleTableScroll>
          <table id="schedule-results-table" className="schedule-table" aria-label="2025 U15亞洲青少棒賽程戰績">
            <thead>
              <tr>
                <th scope="col">日期</th>
                <th scope="col">時間</th>
                <th scope="col">對戰組合</th>
                <th scope="col">階段</th>
                <th scope="col">比分</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map(match => {
                const [date, time, matchup, matchStage, score] = match;
                const [teamA, teamB] = matchup.split(" vs ");
                const [scoreA, scoreB] = score.split("：");
                const stageClass = matchStage === "冠軍賽" ? "championship" : matchStage === "季軍賽" ? "third-place" : "";

                return (
                  <tr data-reveal="score" hidden={!visible.has(match)} className={stageClass ? `final-row ${stageClass}-row` : undefined} key={`${date}-${time}-${matchup}`}>
                    <td><span className="date-badge">{date}</span></td>
                    <td className="time-cell">{time}</td>
                    <td>
                      <div className="matchup-cell">
                        <strong>{renderTeam(teamA)}</strong>
                        <span>vs</span>
                        <strong>{renderTeam(teamB)}</strong>
                      </div>
                    </td>
                    <td><span className={`stage-pill${stageClass ? ` ${stageClass}` : ""}`}>{matchStage}</span></td>
                    <td className="score-cell"><span>{scoreA}</span><i>:</i><span>{scoreB}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ScheduleTableScroll>
      </div>
    </>
  );
}
