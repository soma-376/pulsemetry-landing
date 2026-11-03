"use client";

import { type ReactNode, useRef } from "react";
import {
  GROUPS,
  HERO_AMOUNT,
  IDLE_USD,
  INSTALL_CMD,
  INSTALL_LINES,
  KPIS,
  LINKS,
  OS_LIST,
  SEAT_IDLE,
  SEAT_TOTAL,
  SEATS,
  SEC_KPIS,
  SHADOW,
  STEPS,
  VENDORS,
  WASTE,
  WASTE_USD,
} from "./data";
import s from "./Landing.module.css";
import { useLandingMotion } from "./useLandingMotion";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function Lines({
  first,
  second,
  attr,
}: {
  first: ReactNode;
  second: ReactNode;
  attr: "data-hline" | "data-line";
}) {
  const a = { [attr]: "" };
  return (
    <>
      <span className={s.lineMask}>
        <span className={s.line} {...a}>
          {first}
        </span>
      </span>
      <span className={s.lineMask}>
        <span className={`${s.line} ${s.muted}`} {...a}>
          {second}
        </span>
      </span>
    </>
  );
}

function Chrome({ url }: { url?: string }) {
  return (
    <div className={s.chrome}>
      <span className={s.chromeDot} />
      <span className={s.chromeDot} />
      <span className={s.chromeDot} />
      {url && <span className={s.chromeUrl}>{url}</span>}
    </div>
  );
}

// 숫자마다 0–9 세로 열을 두고 GSAP가 해당 칸으로 굴린다. SSR 기본값은 최종 숫자 위치.
function RollingAmount({ value }: { value: string }) {
  return (
    <span className={s.amount} aria-label={`${value} / 월`}>
      {value.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className={s.digit} aria-hidden="true">
            <span
              className={s.digitCol}
              data-roll={ch}
              style={{ transform: `translateY(-${Number(ch) * 10}%)` }}
            >
              {DIGITS.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} className={s.staticChar} aria-hidden="true">
            {ch}
          </span>
        ),
      )}
    </span>
  );
}

function Hero() {
  return (
    <section id="top" data-hero className={s.hero}>
      <div data-stage className={s.stage}>
        <canvas data-canvas aria-hidden="true" className={s.canvas} />
        <div className={s.heroCopy}>
          <span data-eyebrow className={s.heroEyebrow}>
            Claude Code · Codex · Cursor
          </span>
          <h1 className={s.h1}>
            <Lines
              attr="data-hline"
              first="AI에 쓰는 돈,"
              second="어디로 가는지."
            />
          </h1>
        </div>
        <div data-num className={s.heroNum}>
          <div className={s.heroNumRow}>
            <RollingAmount value={HERO_AMOUNT} />
            <span className={s.perMonth}>/ 월</span>
          </div>
          <span className={s.heroCaption}>매달 새는 AI 비용</span>
        </div>
        <div data-bar className={s.bar} />
        <div data-legend className={s.legend}>
          <span>
            <span
              className={s.swatch}
              style={{ width: 8, height: 8, background: "var(--idle)" }}
            />
            유휴 좌석 <b>${IDLE_USD}</b>
          </span>
          <span>
            <span
              className={s.swatch}
              style={{ width: 8, height: 8, background: "var(--use)" }}
            />
            사용 낭비 <b>${WASTE_USD}</b>
          </span>
        </div>
        <span data-hint className={s.hint}>
          스크롤
        </span>
      </div>
    </section>
  );
}

function Seats() {
  return (
    <section data-seats className={`${s.pinned} ${s.seats}`}>
      <div className={s.pin}>
        <div className={`${s.inner} ${s.seatsInner}`}>
          <div data-reveal className={s.heading}>
            <span className={s.eyebrowLabel} style={{ color: "var(--idle)" }}>
              좌석
            </span>
            <h2 className={s.h2}>
              <Lines
                attr="data-line"
                first={`${SEAT_TOTAL}석 계약.`}
                second={`${SEAT_IDLE}석은 한 달째 비어 있습니다.`}
              />
            </h2>
          </div>
          <div className={s.seatGrid}>
            {SEATS.map((idle, i) => (
              <span key={i} className={s.seat}>
                {idle && <span data-idle className={s.idleSwatch} />}
              </span>
            ))}
          </div>
          <div className={s.seatFoot}>
            <div className={s.seatLegend}>
              <span>
                <span
                  className={s.swatch}
                  style={{ width: 10, height: 10, background: "var(--use)" }}
                />
                사용
              </span>
              <span>
                <span
                  className={`${s.swatch} ${s.idleSwatch}`}
                  style={{ width: 10, height: 10 }}
                />
                유휴
              </span>
            </div>
            <div className={s.seatStat}>
              <span>유휴</span>
              <b data-idle-n>{SEAT_IDLE}</b>
              <span>석 ·</span>
              <b data-idle-usd className={s.idleUsd}>
                ${IDLE_USD}
              </b>
              <span>/ 월</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OverviewPanel() {
  return (
    <div data-panel className={s.panel}>
      <div className={s.panelHead}>
        <span className={s.panelTitle}>개요</span>
        <span className={s.panelMeta}>10/09 – 10/15</span>
      </div>
      <div className={s.k3}>
        {KPIS.map((k) => (
          <div key={k.label} className={`${s.card} ${s.kpi}`}>
            <span className={s.kpiLabel}>{k.label}</span>
            <span className={s.kpiValue}>
              {k.value}
              <span className={s.unit}> {k.unit}</span>
            </span>
          </div>
        ))}
      </div>
      <div className={`${s.card} ${s.wasteCard}`}>
        <span className={s.cardTitle}>낭비</span>
        {WASTE.map((w) => (
          <div key={w.label} className={s.meterRow}>
            <div className={s.meterHead}>
              <span>{w.label}</span>
              <b>{w.value}</b>
            </div>
            <span className={s.meterTrack}>
              <span
                data-wbar
                className={s.meterFill}
                style={{ background: w.color, width: w.width }}
              />
            </span>
          </div>
        ))}
        <div className={`${s.meterRow} ${s.vendors}`}>
          <div className={s.meterHead}>
            <span>벤더별 지출</span>
            <span className={s.panelMeta}>$7,840 / 월</span>
          </div>
          <div className={s.vendorBar}>
            {VENDORS.map((v) => (
              <span
                key={v.name}
                style={{ flex: v.share, background: v.color }}
              />
            ))}
          </div>
          <div className={s.vendorLegend}>
            {VENDORS.map((v) => (
              <span key={v.name}>
                {v.name} {v.share}%
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OutcomesPanel() {
  return (
    <div data-panel className={s.panel} style={{ opacity: 0 }}>
      <div className={s.panelHead}>
        <span className={s.panelTitle}>성과</span>
        <span className={s.panelMeta}>GitHub · 14개 팀</span>
      </div>
      <div className={`${s.card} ${s.outcomeTop}`}>
        <div className={s.outcome}>
          <span>사이클 타임</span>
          <span className={s.bigValue}>
            3.1<span className={s.unit}> 일</span>
          </span>
          <span className={`${s.delta} ${s.good}`}>
            −18.4% <span>이전 3.8일</span>
          </span>
        </div>
        <div className={s.outcome}>
          <span>사이클 비용</span>
          <span className={s.bigValue}>$30.09</span>
          <span className={`${s.delta} ${s.bad}`}>
            +20.7% <span>이전 $24.93</span>
          </span>
        </div>
      </div>
      <div className={s.pair}>
        <div className={`${s.card} ${s.pairItem}`}>
          <span>재작업 비용</span>
          <b>$1,940</b>
        </div>
        <div className={`${s.card} ${s.pairItem}`}>
          <span>릴리스 실패율</span>
          <b>2.5%</b>
        </div>
      </div>
      <div className={`${s.card} ${s.listCard}`}>
        {GROUPS.map((g) => (
          <div key={g.name} className={s.groupRow}>
            <span>
              <b>{g.name}</b> <small>{g.rule}</small>
            </span>
            <b className={s.num}>{g.lead}</b>
            <span className={s.num}>{g.rework}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecurityPanel() {
  return (
    <div data-panel className={s.panel} style={{ opacity: 0 }}>
      <div className={s.panelHead}>
        <span className={s.panelTitle}>보안</span>
      </div>
      <div className={s.k3}>
        {SEC_KPIS.map((k) => (
          <div key={k.label} className={`${s.card} ${s.kpi}`}>
            <span className={s.kpiLabel}>{k.label}</span>
            <span className={s.kpiValue} style={{ color: k.fg }}>
              {k.value}
              <span className={s.unit}> {k.unit}</span>
            </span>
          </div>
        ))}
      </div>
      <div className={`${s.card} ${s.listCard}`}>
        <div className={s.listTitle}>미승인 AI</div>
        {SHADOW.map((r) => (
          <div key={r.tool} className={s.shadowRow}>
            <span className={s.shadowTool}>
              <b>{r.tool}</b>
              <span>{r.ago}</span>
            </span>
            <b className={s.num}>{r.n}</b>
            <span className={s.actions}>
              <span>승인</span>
              <span className={s.bad}>차단</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Product() {
  return (
    <section id="product" data-product className={`${s.pinned} ${s.product}`}>
      <div className={s.pin}>
        <div className={`${s.inner} ${s.split}`}>
          <div className={s.stepCol}>
            <div className={s.ticks}>
              {STEPS.map((st) => (
                <span key={st.n} className={s.tickTrack}>
                  <span data-tick className={s.tick} />
                </span>
              ))}
            </div>
            <div className={s.steps}>
              {STEPS.map((st, i) => (
                <div
                  key={st.n}
                  data-step
                  className={s.step}
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <span className={s.stepNo}>
                    {st.n} · {st.page}
                  </span>
                  <h3 className={s.h3}>{st.title}</h3>
                  <span className={s.stepSub}>{st.sub}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={s.frame}>
            <Chrome url="app.pulsemetry.co.kr" />
            <OverviewPanel />
            <OutcomesPanel />
            <SecurityPanel />
          </div>
        </div>
      </div>
    </section>
  );
}

function Install() {
  return (
    <section id="install" data-install className={s.install}>
      <div className={`${s.inner} ${s.split}`}>
        <div data-reveal className={s.installCopy}>
          <span className={s.eyebrowLabel} style={{ color: "var(--use)" }}>
            설치
          </span>
          <h2 className={s.h2}>
            <Lines
              attr="data-line"
              first="명령어 한 줄."
              second="다음 날 첫 리포트."
            />
          </h2>
          <div className={s.chips}>
            {OS_LIST.map((o) => (
              <span key={o}>{o}</span>
            ))}
          </div>
        </div>
        <div className={s.terminal}>
          <Chrome />
          <div className={s.termBody}>
            <div className={s.termLine}>
              <span className={s.prompt}>$</span>
              <span data-cmd className={s.cmd}>
                {INSTALL_CMD}
              </span>
              <span data-caret className={s.caret} />
            </div>
            {INSTALL_LINES.map((t) => (
              <div key={t} data-tline className={s.okLine}>
                <span className={s.check}>✓</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
          <div className={s.termStatus}>
            <span data-st-dot className={s.statusDot} />
            <span data-st-ok className={s.statusOk}>
              연결됨
            </span>
            <span data-st-meta className={s.statusMeta}>
              MacBook-Pro · 코드웍스
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className={s.contact}>
      <div className={`${s.inner} ${s.contactInner}`}>
        <div data-reveal className={s.contactCopy}>
          <h2 className={s.h2Big}>
            <Lines
              attr="data-line"
              first="다음 달 AI 청구서를"
              second="열기 전에."
            />
          </h2>
          <div className={s.ctas}>
            <a href={LINKS.contact} className={`${s.pill} ${s.ctaPrimary}`}>
              도입 문의
            </a>
            <a href={LINKS.demo} className={`${s.pill} ${s.ctaGhost}`}>
              데모 보기
            </a>
          </div>
        </div>
        <footer className={s.footer}>
          <span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/appicon.png" alt="" width={14} height={14} />
            Pulsemetry
          </span>
          <span>© 2026 Pulsemetry</span>
        </footer>
      </div>
    </section>
  );
}

export function Landing() {
  const rootRef = useRef<HTMLDivElement>(null);
  useLandingMotion(rootRef);

  return (
    <div ref={rootRef} className={s.root}>
      <header className={s.header}>
        <a href="#top" className={s.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/appicon.png" alt="" width={20} height={20} />
          Pulsemetry
        </a>
        <nav className={s.nav}>
          <div className={s.navLinks}>
            <a href="#product">제품</a>
            <a href="#install">설치</a>
          </div>
          <a href={LINKS.contact} className={`${s.pill} ${s.headerCta}`}>
            도입 문의
          </a>
        </nav>
      </header>
      <main className={s.wrap}>
        <Hero />
        <Seats />
        <Product />
        <Install />
        <Contact />
      </main>
    </div>
  );
}
