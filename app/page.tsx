"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const jobs = [
  ["製程技術員", "輪班津貼、完整培訓", "桃園 / 苗栗 / 高雄"],
  ["設備工程師", "專業加給、專案獎金", "新竹 / 台中"],
  ["物流司機", "安全獎金、穩定班表", "全台據點"],
];

const benefits = [
  ["19年", "穩定調薪制度"],
  ["3餐", "員工餐與加班點心"],
  ["30+", "社團與旅遊補助"],
  ["2050", "淨零轉型目標"],
];

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

  return (
    <main className="site-shell">
      <header className="topbar" aria-label="主選單">
        <a className="brand" href="#top" aria-label="森循紙業首頁">
          <span className="brand-mark">S</span>
          <span>森循紙業</span>
        </a>
        <nav>
          <a href="#about">認識森循</a>
          <a href="#jobs">加入我們</a>
          <a href="#future">永續未來</a>
        </nav>
      </header>

      <section id="top" ref={heroRef} className="scroll-hero" style={style}>
        <div className="hero-stage">
          <img
            className="hero-bg"
            src="https://envirotecmagazine.com/wp-content/uploads/2024/02/pulp-and-paper-mill.jpg"
            alt="紙業工廠中戴安全帽的工作者巡視大型紙卷"
          />
          <div className="hero-wash" />
          <div className="rings" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="leaf leaf-a" aria-hidden="true" />
          <div className="leaf leaf-b" aria-hidden="true" />
          <div className="leaf leaf-c" aria-hidden="true" />
          <div className="paper-roll roll-a" aria-hidden="true" />
          <div className="paper-roll roll-b" aria-hidden="true" />

          <div className="hero-copy">
            <p className="eyebrow">永續智造，紙向成就</p>
            <h1>加入循環製造的下一站</h1>
            <p>
              從再生紙源、智慧產線到低碳物流，讓每一張紙都成為更穩定的工作與更好的未來。
            </p>
            <a className="primary-action" href="#jobs">查看職缺</a>
          </div>

          <div className="scroll-card">
            <span>Scroll</span>
            <strong>{Math.round(progress * 100)}%</strong>
          </div>
        </div>
      </section>

      <section id="about" className="intro section-band">
        <div className="section-inner two-col">
          <div>
            <p className="section-kicker">About</p>
            <h2>一紙都在，從產線到生活</h2>
          </div>
          <p>
            森循紙業是示範用的企業招募頁品牌，頁面結構參考你提供的活動站：首屏先用滾動視覺建立記憶點，再把品牌實力、職涯誘因與永續承諾分段帶出。
          </p>
        </div>
        <div className="logo-strip" aria-label="產品與服務">
          {["工業用紙", "包裝紙器", "生活紙品", "智慧倉儲", "綠電製程"].map(
            (item) => (
              <span key={item}>{item}</span>
            ),
          )}
        </div>
      </section>

      <section id="jobs" className="jobs section-band">
        <div className="section-inner">
          <p className="section-kicker">Careers</p>
          <h2>未來，就紙要你</h2>
          <div className="job-grid">
            {jobs.map(([title, note, place]) => (
              <article className="job-card" key={title}>
                <span className="job-tag">{place}</span>
                <h3>{title}</h3>
                <p>{note}</p>
                <button type="button">立即應徵</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="benefits section-band">
        <div className="section-inner">
          <p className="section-kicker">Benefits</p>
          <h2>工作之餘，生活也要被照顧</h2>
          <div className="metric-grid">
            {benefits.map(([value, label]) => (
              <div className="metric" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="future" className="future">
        <img
          src="https://images.squarespace-cdn.com/content/v1/66209f2eb5bf63594348420d/b82b3be4-e38a-4386-8596-7886863e870a/shutterstock_1442015645.jpg"
          alt="紙類回收工廠的輸送帶與再生材料"
        />
        <div>
          <p className="section-kicker">Sustainability</p>
          <h2>永續，紙與未來</h2>
          <p>
            用循環原料、製程數據與能源管理，把大型製造變成可被持續改善的日常。這一段可依你的公司資料換成 ESG、獎項、福利或品牌故事。
          </p>
        </div>
      </section>
    </main>
  );
}
