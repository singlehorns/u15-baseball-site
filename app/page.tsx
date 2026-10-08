"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const schedule = [
  ["08/17（日）", "13:30", "香港 vs 日本", "B組預賽", "1：14"],
  ["08/17（日）", "13:30", "斯里蘭卡 vs 菲律賓", "B組預賽", "1：11"],
  ["08/17（日）", "18:30", "韓國 vs 台灣", "A組預賽", "5：3"],
  ["08/17（日）", "19:30", "巴基斯坦 vs 泰國", "A組預賽", "16：2"],
  ["08/18（一）", "13:30", "香港 vs 菲律賓", "B組預賽", "2：3"],
  ["08/18（一）", "13:30", "日本 vs 斯里蘭卡", "B組預賽", "24：1"],
  ["08/18（一）", "18:30", "泰國 vs 韓國", "A組預賽", "0：16"],
  ["08/18（一）", "18:30", "台灣 vs 巴基斯坦", "A組預賽", "27：0"],
  ["08/19（二）", "13:30", "巴基斯坦 vs 韓國", "A組預賽", "0：24"],
  ["08/19（二）", "13:30", "菲律賓 vs 日本", "B組預賽", "0：10"],
  ["08/19（二）", "18:30", "斯里蘭卡 vs 香港", "B組預賽", "3：10"],
  ["08/19（二）", "18:30", "泰國 vs 台灣", "A組預賽", "0：18"],
  ["08/21（四）", "13:30", "日本 vs 韓國", "超級循環賽", "5：1"],
  ["08/21（四）", "13:30", "斯里蘭卡 vs 泰國", "排名賽", "7：3"],
  ["08/21（四）", "18:30", "台灣 vs 菲律賓", "超級循環賽", "10：0"],
  ["08/21（四）", "18:30", "巴基斯坦 vs 香港", "排名賽", "3：4"],
  ["08/22（五）", "13:30", "韓國 vs 菲律賓", "超級循環賽", "16：1"],
  ["08/22（五）", "13:30", "香港 vs 泰國", "排名賽", "12：2"],
  ["08/22（五）", "18:30", "日本 vs 台灣", "超級循環賽", "7：10"],
  ["08/22（五）", "18:30", "巴基斯坦 vs 斯里蘭卡", "排名賽", "9：5"],
  ["08/23（六）", "13:00", "菲律賓 vs 韓國", "季軍賽", "0：15"],
  ["08/23（六）", "18:30", "日本 vs 台灣", "冠軍賽", "0：3"],
];

const teamFlagSrc: Record<string, string> = {
  台灣: "/generated-scenes/flags/tw.svg",
  日本: "/generated-scenes/flags/jp.svg",
  韓國: "/generated-scenes/flags/kr.svg",
  香港: "/generated-scenes/flags/hk.svg",
  菲律賓: "/generated-scenes/flags/ph.svg",
  斯里蘭卡: "/generated-scenes/flags/lk.svg",
  巴基斯坦: "/generated-scenes/flags/pk.svg",
  泰國: "/generated-scenes/flags/th.svg",
};

const ticketNotes = [
  "未滿115公分的兒童可免費入場，但不得佔用座位。",
  "購票刷華南卡享85折優惠，記得提前準備卡片享有折扣優惠。",
  "每次最多選購4張票，請仔細選擇您的場次、票種及座位。",
  "購票時，隊伍名稱位於左側為主隊（3壘側），位於右側為客隊（1壘側）。",
  "預計比賽前1小時開放觀眾進場，現場售票於每場比賽開賽前1小時30分鐘開始。",
  "優待票與身障票需出示有效證件，若不符規定，請至現場售票處辦理補票。",
];

const rosterGroups = [
  {
    role: "投手",
    players: ["胡O威（桃園市）", "莊O濬（高雄市）", "楊O源（新北市）", "柯O捷（臺中市）", "高O瀚（屏東縣）", "趙O皓（桃園市）", "林O倫（臺東縣）"],
  },
  {
    role: "捕手",
    players: ["孫O彥（桃園市）", "王O翔（臺東縣）"],
  },
  {
    role: "內野手",
    players: ["江O澄（新北市）", "陳O佑（新北市）", "張O強（臺中市）", "黃O齊（臺北市）", "葉O福（宜蘭縣）"],
  },
  {
    role: "外野手",
    players: ["溫O恩（新北市）", "官O竣（臺北市）", "曾O喆（臺北市）", "陳O鑫（新北市）"],
  },
  {
    role: "教練團",
    players: ["總教練：邱O宇（新北市）", "教練：楊O鴻（新北市）", "教練：劉O威（新北市）"],
  },
];

const eventFacts = [
  ["賽事名稱", "2025 第十二屆亞洲青少棒錦標賽（XII Asian U15 Baseball Championship）"],
  ["比賽日期", "2025 年 8 月 17 日（日）至 8 月 23 日（六）"],
  ["比賽地點", "台南市"],
  ["比賽場地", "亞太國際棒球訓練中心（成棒主球場、副球場）"],
  ["參賽隊伍", "共 8 隊，分為 A、B 兩組"],
  ["主辦單位", "WBSC Asia"],
  ["承辦單位", "中華民國棒球協會"],
];

const tournamentGroups = [
  ["A 組", "韓國、巴基斯坦、泰國、中華"],
  ["B 組", "日本、菲律賓、香港、斯里蘭卡"],
];

const formatRows = [
  ["預賽", "8 隊分兩組單循環，各組前 2 名晉級四強複賽，各組後 2 名進行 5-8 名排名賽。"],
  ["複賽", "四強隊伍帶入預賽交手成績，前 2 名打冠軍賽，後 2 名打季軍賽。"],
  ["決賽日", "8/23 進行季軍賽與冠軍賽。"],
];

const pitchLimits = [
  ["1-35 球", "0 日"],
  ["36-50 球", "1 日"],
  ["51-65 球", "2 日"],
  ["66-80 球", "3 日"],
  ["81-95 球（單場上限 95）", "4 日"],
];

const tieBreakers = [
  "相互對戰勝負關係",
  "對戰優質率（TQB）高者在前",
  "對戰責失分率（ER-TQB）低者在前",
  "對戰打擊率高者在前",
  "擲銅板",
];

const awardNotes = [
  "團體：前三名球隊頒發獎盃，各隊職員授予金、銀、銅牌。",
  "個人：打擊王、防禦率王、勝率王、打點王、全壘打王、盜壘王、得分王、最佳守備、最有價值球員（MVP）。",
  "全明星隊：各位置表現優異者入選並授牌。",
  "前二名球隊取得 2026 年第七屆 U-15 世界盃棒球賽亞洲區參賽資格。",
];

const broadcastChannels = ["緯來電視網", "愛爾達體育台", "東森電視", "小公視", "GetWin Sport", "公視+", "緯來體育 YouTube", "Hami Video", "ELTA.tv"];

export default function Home() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const max = rect.height - window.innerHeight;
      const next = max > 0 ? Math.min(1, Math.max(0, -rect.top / max)) : 0;
      setProgress(next);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const style = { "--p": progress } as CSSProperties;
  const renderTeam = (team: string) => (
    <>
      <img className="team-flag" src={teamFlagSrc[team]} alt={`${team}國旗`} loading="lazy" />
      <span>{team}</span>
    </>
  );

  return (
    <main className="site-shell">
      <header className="topbar" aria-label="主選單">
        <a className="brand" href="#top" aria-label="2025 WBSC在台南">
          <span>2025 WBSC在台南</span>
        </a>
        <nav>
          <a href="#about">
            <span className="nav-label">中華隊名單</span>
            <span className="nav-caption">Team Roster</span>
          </a>
          <a href="#schedule">
            <span className="nav-label">賽程戰績</span>
            <span className="nav-caption">Schedule</span>
          </a>
          <a href="#tickets">
            <span className="nav-label">票種座位</span>
            <span className="nav-caption">Tickets</span>
          </a>
        </nav>
      </header>

      <section id="top" ref={heroRef} className="scroll-hero" style={style}>
        <div className="hero-stage">
          <div className="kv-bg" aria-hidden="true" />
          <div className="stadium-vignette" aria-hidden="true" />

          <div className="pitcher-layer" aria-hidden="true">
            <img className="youth-pitcher" src="/generated-scenes/u15-youth-pitcher.png" alt="" />
          </div>
          <img className="pitch-ball" src="/generated-scenes/real-baseball.png" alt="" aria-hidden="true" />

          <div className="kv-content">
            <div className="kv-main">
              <div className="kv-title" aria-label="熱血青春 主場開打">
                <div className="title-row top">
                  {["熱", "血", "青", "春"].map((char) => (
                    <span className="title-char" key={char}>
                      {char}
                    </span>
                  ))}
                </div>
                <div className="title-row bottom">
                  {["主", "場", "開", "打"].map((char) => (
                    <span className="title-char" key={char}>
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              <div className="kv-subtitle">
                <p>U15亞洲青少棒</p>
                <strong>一起見證這場年輕棒球選手的巔峰對決</strong>
              </div>
            </div>
          </div>

          <div className="about-peek" aria-label="8/17-8/23 台南亞太國際棒球場舉行">
            <div className="peek-title">
              <div className="peek-line peek-date">8/17-8/23</div>
              <div className="peek-line peek-venue">台南亞太國際棒球場</div>
            </div>
            <div className="swing-layer scene-swing" aria-hidden="true">
              <div className="swing-bat">
                <img src="/generated-scenes/real-bat.png" alt="" />
              </div>
              <div className="baseball">
                <img src="/generated-scenes/real-baseball.png" alt="" />
              </div>
            </div>
            <div className="dot-arrow" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="scroll-hint">SCROLL</div>
        </div>
      </section>

      <section id="about" className="intro section-band">
        <div className="section-inner roster-section">
          <div className="roster-heading">
            <p className="section-kicker">Team Roster</p>
            <h2>2025 U15亞洲青少棒中華隊完整名單</h2>
            <p>
              中華隊目標直指賽會二連霸。這批選手在國內各大賽事屢創佳績，並在選拔賽中脫穎而出，從火力十足的王牌投手到穩定打擊手，展現出挑戰更高榮耀的完整戰力。
            </p>
          </div>

          <div className="roster-grid">
            {rosterGroups.map((group) => (
              <article className="roster-card" key={group.role}>
                <h3>{group.role}</h3>
                <ul>
                  {group.players.map((player) => (
                    <li key={player}>{player}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="schedule" className="schedule-block section-band">
        <img
          className="schedule-stadium-bg"
          src="/generated-scenes/baseball-stadium-hero.png"
          alt=""
          aria-hidden="true"
        />
        <img
          className="schedule-field-bg"
          src="/generated-scenes/baseball-stadium-hero.png"
          alt=""
          aria-hidden="true"
        />
        <img
          className="schedule-player-collage"
          src="/generated-scenes/u15-international-players.png"
          alt=""
          aria-hidden="true"
        />
        <div className="section-inner schedule-section">
          <div className="schedule-table-wrap">
            <div className="schedule-board-title">
              <p>Schedule / Results</p>
              <h2>2025 U15亞洲青少棒錦標賽賽程戰績表</h2>
            </div>
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>日期</th>
                  <th>時間</th>
                  <th>對戰組合</th>
                  <th>階段</th>
                  <th>比分</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map(([date, time, matchup, stage, score], index) => {
                  const [teamA, teamB] = matchup.split(" vs ");
                  const [scoreA, scoreB] = score.split("：");
                  const stageClass =
                    stage === "冠軍賽" ? "championship" : stage === "季軍賽" ? "third-place" : "";

                  return (
                    <tr className={stageClass ? `final-row ${stageClass}-row` : undefined} key={`${date}-${time}-${matchup}-${index}`}>
                      <td data-label="日期">
                        <span className="date-badge">{date}</span>
                      </td>
                      <td className="time-cell" data-label="時間">{time}</td>
                      <td data-label="對戰組合">
                        <div className="matchup-cell">
                          <strong>{renderTeam(teamA)}</strong>
                          <span>vs</span>
                          <strong>{renderTeam(teamB)}</strong>
                        </div>
                      </td>
                      <td data-label="階段">
                        <span className={`stage-pill${stageClass ? ` ${stageClass}` : ""}`}>{stage}</span>
                      </td>
                      <td className="score-cell" data-label="比分">
                        <span>{scoreA}</span>
                        <i>:</i>
                        <span>{scoreB}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="tickets" className="intro section-band">
        <div className="section-inner ticket-layout">
          <figure className="ticket-map">
            <img src="/generated-scenes/seat-map.jpg" alt="2025 U-15內野座位圖" />
            <figcaption>2025 U-15座位圖。（圖／翻攝自拓元售票系統）</figcaption>
          </figure>

          <div className="ticket-copy">
            <p className="section-kicker">Tickets</p>
            <h2>票種及座位圖</h2>
            <ul className="ticket-list">
              <li>
                <strong>內野票：全票300元</strong>
                <span>靠近場地的最佳觀賽位置。</span>
              </li>
              <li>
                <strong>外野票：目前未開放</strong>
                <span>目前未開放外野座位，僅提供內野座位。</span>
              </li>
              <li>
                <strong>優待票：240元</strong>
                <span>適用於65歲以上長者、學生及身高超過115公分的兒童，入場時需出示證件（身分證、學生證）。</span>
              </li>
              <li>
                <strong>身障票：150元</strong>
                <span>適用於持身障手冊的觀眾及其陪同者1名，需出示證件。輪椅席需至現場購票，數量有限。</span>
              </li>
            </ul>
          </div>

          <div className="ticket-notes">
            <h3>注意事項</h3>
            <ul>
              {ticketNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="details" className="details-block section-band">
        <div className="section-inner details-section">
          <div className="details-heading">
            <p className="section-kicker">Event Info</p>
            <h2>賽事基本資訊與規則</h2>
          </div>

          <div className="fact-grid">
            {eventFacts.map(([label, value]) => (
              <article className="fact-card" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>

          <div className="info-split">
            <article className="info-panel">
              <h3>參賽隊伍分組</h3>
              <div className="group-list">
                {tournamentGroups.map(([group, teams]) => (
                  <p key={group}>
                    <strong>{group}</strong>
                    <span>{teams}</span>
                  </p>
                ))}
              </div>
            </article>

            <article className="info-panel">
              <h3>轉播平台</h3>
              <div className="channel-tags">
                {broadcastChannels.map((channel) => (
                  <span key={channel}>{channel}</span>
                ))}
              </div>
            </article>
          </div>

          <article className="info-panel wide-panel">
            <h3>賽程設計</h3>
            <div className="format-list">
              {formatRows.map(([phase, desc]) => (
                <p key={phase}>
                  <strong>{phase}</strong>
                  <span>{desc}</span>
                </p>
              ))}
            </div>
          </article>

          <div className="info-split">
            <article className="info-panel">
              <h3>比賽規則</h3>
              <ul className="clean-list">
                <li>正規 7 局制；四局領先 15 分或五局領先 10 分可提前結束。</li>
                <li>七局和局時自第 8 局起採突破僵局制，一、二壘有人。</li>
              </ul>
            </article>

            <article className="info-panel">
              <h3>同分排名順序</h3>
              <ol className="rank-list">
                {tieBreakers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </article>
          </div>

          <div className="info-split">
            <article className="info-panel">
              <h3>投手投球限制</h3>
              <table className="compact-table">
                <thead>
                  <tr>
                    <th>用球數</th>
                    <th>休息天數</th>
                  </tr>
                </thead>
                <tbody>
                  {pitchLimits.map(([balls, rest]) => (
                    <tr key={balls}>
                      <td>{balls}</td>
                      <td>{rest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>

            <article className="info-panel">
              <h3>各類獎項與積分</h3>
              <ul className="clean-list">
                {awardNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
