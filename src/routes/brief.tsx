import { createFileRoute } from "@tanstack/react-router";
import { getDailyBrief } from "../lib/news.functions";
import { useQuery } from "@tanstack/react-query";
import { TerminalHeader } from "@/components/terminal/header";

export const Route = createFileRoute("/brief")({
  component: BriefPage,
});

/* ─── Bloomberg CSS (injected via <style>) ─── */
const bloombergCSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --bb-bg: #0a0d10;
  --bb-panel: #10151a;
  --bb-panel2: #141a20;
  --bb-border: #232b32;
  --bb-border-soft: #1a2026;
  --bb-text: #e8edf2;
  --bb-text-dim: #8b98a5;
  --bb-text-faint: #5a6570;
  --bb-amber: #f0a830;
  --bb-green: #3ecf8e;
  --bb-red: #ef5757;
  --bb-blue: #4a9eff;
  --bb-purple: #a78bfa;
  --bb-mono: 'JetBrains Mono', monospace;
  --bb-sans: 'Inter', sans-serif;
}

.bb-page {
  background: var(--bb-bg);
  color: var(--bb-text);
  font-family: var(--bb-sans);
  line-height: 1.55;
  padding-bottom: 60px;
  min-height: 100vh;
}

.bb-wrap { max-width: 1180px; margin: 0 auto; padding: 0 20px; }

/* TICKER */
.bb-ticker-outer {
  background: #000;
  border-bottom: 1px solid var(--bb-border);
  overflow: hidden;
  white-space: nowrap;
  padding: 9px 0;
  position: sticky;
  top: 0;
  z-index: 50;
}
.bb-ticker-track {
  display: inline-block;
  animation: bb-scroll 55s linear infinite;
  font-family: var(--bb-mono);
  font-size: 12.5px;
}
.bb-ticker-track span { margin-right: 38px; color: var(--bb-text-dim); }
.bb-ticker-track .bb-up { color: var(--bb-green); }
.bb-ticker-track .bb-down { color: var(--bb-red); }
@keyframes bb-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* HEADER */
.bb-header { padding: 32px 0 22px; border-bottom: 1px solid var(--bb-border); }
.bb-eyebrow {
  font-family: var(--bb-mono); font-size: 11px; letter-spacing: 2px;
  color: var(--bb-amber); text-transform: uppercase; margin-bottom: 10px;
  display: flex; gap: 14px; align-items: center; flex-wrap: wrap;
}
.bb-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--bb-green); box-shadow: 0 0 8px var(--bb-green);
  animation: bb-pulse 2s infinite;
}
@keyframes bb-pulse { 0%,100%{opacity:1;} 50%{opacity:.35;} }
.bb-h1 {
  font-size: 30px; font-weight: 800; letter-spacing: -0.5px;
  margin-bottom: 8px; color: var(--bb-text); line-height: 1.3;
}
.bb-h1 .bb-accent { color: var(--bb-red); }
.bb-subhead { color: var(--bb-text-dim); font-size: 14.5px; max-width: 780px; line-height: 1.6; }

/* SECTIONS */
.bb-section { padding: 28px 0; border-bottom: 1px solid var(--bb-border-soft); }
.bb-section:last-of-type { border-bottom: none; }
.bb-sec-label {
  font-family: var(--bb-mono); font-size: 11px; letter-spacing: 2px; color: var(--bb-text-faint);
  text-transform: uppercase; margin-bottom: 14px; display: flex; align-items: center; gap: 10px;
}
.bb-sec-label::after { content:''; flex:1; height:1px; background: var(--bb-border); }
.bb-sec-num { color: var(--bb-amber); }
.bb-h2 { font-size: 20px; font-weight: 700; margin-bottom: 14px; color: var(--bb-text); }

/* BULLETS */
.bb-bullets { list-style: none; display: grid; gap: 8px; margin-bottom: 18px; padding: 0; }
.bb-bullets li { padding-left: 18px; position: relative; font-size: 14.5px; color: var(--bb-text); line-height: 1.6; }
.bb-bullets li::before { content:'▸'; position:absolute; left:0; color: var(--bb-amber); }

/* TABLE */
.bb-table { width: 100%; border-collapse: collapse; font-family: var(--bb-mono); font-size: 13px; margin-top: 8px; }
.bb-table th {
  text-align: left; padding: 8px 10px; color: var(--bb-text-faint); font-weight: 500;
  font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid var(--bb-border);
}
.bb-table td { padding: 8px 10px; border-bottom: 1px solid var(--bb-border-soft); }
.bb-table tr:hover td { background: var(--bb-panel2); }
.bb-pos { color: var(--bb-green); font-weight: 600; }
.bb-neg { color: var(--bb-red); font-weight: 600; }
.bb-flat { color: var(--bb-text-dim); }

/* GRIDS */
.bb-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.bb-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 780px) { .bb-grid2, .bb-grid3 { grid-template-columns: 1fr; } }

/* PANEL */
.bb-panel {
  background: var(--bb-panel); border: 1px solid var(--bb-border);
  border-radius: 8px; padding: 18px;
}
.bb-panel-title {
  font-family: var(--bb-mono); font-size: 12px; color: var(--bb-amber);
  text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; font-weight: 600;
}
.bb-panel p { font-size: 14px; color: var(--bb-text); line-height: 1.6; }
.bb-panel .bb-detail { font-size: 13px; color: var(--bb-text-dim); margin-top: 8px; line-height: 1.55; }

/* MACRO */
.bb-macro-p { font-size: 14.5px; margin-bottom: 10px; color: var(--bb-text); line-height: 1.65; }
.bb-macro-p:last-child { margin-bottom: 0; }

/* NEWS CARDS */
.bb-news-card {
  background: var(--bb-panel); border: 1px solid var(--bb-border);
  border-radius: 10px; padding: 22px; margin-bottom: 18px;
}
.bb-news-tag {
  display: inline-block; font-family: var(--bb-mono); font-size: 10.5px;
  letter-spacing: 1px; padding: 3px 9px; border-radius: 20px;
  text-transform: uppercase; margin-bottom: 10px;
}
.bb-tag-geo { background: rgba(239,87,87,.12); color: var(--bb-red); border: 1px solid rgba(239,87,87,.3); }
.bb-tag-tech { background: rgba(74,158,255,.12); color: var(--bb-blue); border: 1px solid rgba(74,158,255,.3); }
.bb-tag-fed { background: rgba(167,139,250,.12); color: var(--bb-purple); border: 1px solid rgba(167,139,250,.3); }
.bb-tag-macro { background: rgba(240,168,48,.12); color: var(--bb-amber); border: 1px solid rgba(240,168,48,.3); }
.bb-tag-earnings { background: rgba(62,207,142,.12); color: var(--bb-green); border: 1px solid rgba(62,207,142,.3); }
.bb-news-card h3 { font-size: 18px; margin-bottom: 10px; color: var(--bb-text); }
.bb-news-card p { font-size: 14.5px; color: var(--bb-text); margin-bottom: 10px; line-height: 1.6; }
.bb-news-card .bb-label {
  font-family: var(--bb-mono); font-size: 11px; color: var(--bb-text-faint);
  text-transform: uppercase; letter-spacing: .5px; margin-top: 12px; margin-bottom: 4px;
}

/* SCENARIO GRID (in news) */
.bb-scenario-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
@media (max-width: 780px) { .bb-scenario-grid { grid-template-columns: 1fr; } }
.bb-scenario { border-radius: 8px; padding: 12px 14px; font-size: 13.5px; line-height: 1.55; }
.bb-scenario-bull { background: rgba(62,207,142,.07); border: 1px solid rgba(62,207,142,.25); }
.bb-scenario-bear { background: rgba(239,87,87,.07); border: 1px solid rgba(239,87,87,.25); }
.bb-scenario b {
  display: block; margin-bottom: 4px; font-family: var(--bb-mono);
  font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
}
.bb-scenario-bull b { color: var(--bb-green); }
.bb-scenario-bear b { color: var(--bb-red); }
.bb-instruments { font-family: var(--bb-mono); font-size: 12px; color: var(--bb-text-dim); margin-top: 10px; }
.bb-instruments span {
  background: var(--bb-panel2); border: 1px solid var(--bb-border); padding: 2px 8px;
  border-radius: 5px; margin-right: 6px; display: inline-block; margin-bottom: 4px;
}

/* SCENARIO CARDS (risk section) */
.bb-scen-card { border-radius: 10px; padding: 18px; border: 1px solid var(--bb-border); }
.bb-scen-card.bb-base { background: rgba(240,168,48,.05); border-color: rgba(240,168,48,.3); }
.bb-scen-card.bb-bullc { background: rgba(62,207,142,.05); border-color: rgba(62,207,142,.3); }
.bb-scen-card.bb-bearc { background: rgba(239,87,87,.05); border-color: rgba(239,87,87,.3); }
.bb-scen-card .bb-pct { font-family: var(--bb-mono); font-size: 26px; font-weight: 800; }
.bb-scen-card .bb-stitle {
  font-family: var(--bb-mono); font-size: 12px; text-transform: uppercase;
  letter-spacing: 1px; color: var(--bb-text-dim); margin-bottom: 2px;
}
.bb-scen-card p { font-size: 13.5px; margin-top: 10px; color: var(--bb-text); line-height: 1.55; }
.bb-scen-card .bb-invalidate {
  margin-top: 10px; font-size: 12.5px; color: var(--bb-text-faint);
  border-top: 1px dashed var(--bb-border); padding-top: 8px;
}
.bb-base .bb-pct { color: var(--bb-amber); }
.bb-bullc .bb-pct { color: var(--bb-green); }
.bb-bearc .bb-pct { color: var(--bb-red); }

/* PITCH BOX */
.bb-pitch-box {
  background: linear-gradient(135deg, rgba(240,168,48,.08), rgba(10,13,16,0));
  border: 1px solid rgba(240,168,48,.35); border-radius: 10px; padding: 24px;
}
.bb-pitch-box p { font-size: 15px; margin-bottom: 12px; color: var(--bb-text); line-height: 1.65; }
.bb-pitch-box p:last-child { margin-bottom: 0; }

/* TRANSPARENCY */
.bb-transp {
  font-family: var(--bb-mono); font-size: 12.5px; color: var(--bb-text-dim);
  background: var(--bb-panel); border: 1px solid var(--bb-border);
  border-radius: 8px; padding: 16px 18px; list-style: none;
}
.bb-transp li {
  margin-bottom: 6px; padding-left: 16px; position: relative; line-height: 1.6;
}
.bb-transp li::before { content:'*'; position:absolute; left:0; color: var(--bb-amber); }

/* FOOTER */
.bb-footer {
  padding-top: 24px; text-align: center; color: var(--bb-text-faint);
  font-family: var(--bb-mono); font-size: 11px;
}

/* VOLATILITY NOTE */
.bb-vol-note { margin-top: 18px; font-size: 14px; color: var(--bb-text-dim); line-height: 1.6; }
.bb-vol-note b { color: var(--bb-text); }
`;

/* ─── Tag color map ─── */
const tagClassMap: Record<string, string> = {
  geo: "bb-tag-geo",
  tech: "bb-tag-tech",
  fed: "bb-tag-fed",
  macro: "bb-tag-macro",
  earnings: "bb-tag-earnings",
};

/* ─── Helpers ─── */
function getChangeClass(change?: string): string {
  if (!change) return "bb-flat";
  const c = change.trim();
  if (c.startsWith("-") || c.toLowerCase().includes("neg")) return "bb-neg";
  if (c.startsWith("+") || c.toLowerCase().includes("pos") || c.toLowerCase().includes("ron +")) return "bb-pos";
  return "bb-flat";
}

function highlightAccent(text: string): JSX.Element {
  // Wrap text between «» or any part after the last dash/colon as accent — simple heuristic
  // For now, just return as-is; the HTML reference used a manual <span class="accent"> on "Fed Minutes"
  return <>{text}</>;
}

/* ─── Main Component ─── */
function BriefPage() {
  const {
    data: brief,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["dailyBrief"],
    queryFn: async () => {
      try {
        const res = await getDailyBrief();
        if (!res) throw new Error("Response is null/undefined. The server likely crashed or timed out (504).");
        if (res.error) throw new Error(res.error);
        if (!res.brief) throw new Error("No brief in response. Raw response: " + JSON.stringify(res));
        return res.brief;
      } catch (err: any) {
        throw new Error(err.message || "Eroare necunoscută la fetch");
      }
    },
    staleTime: 1000 * 60 * 30,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <TerminalHeader />
        <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center justify-center min-h-[70vh]">
          <div style={{
            background: "var(--bb-panel, #10151a)",
            border: "1px solid var(--bb-border, #232b32)",
            borderRadius: 12,
            padding: 48,
            textAlign: "center",
            maxWidth: 420,
            width: "100%",
          }}>
            <div style={{
              width: 40, height: 40, margin: "0 auto 20px",
              border: "3px solid #f0a830",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#e8edf2", marginBottom: 8 }}>
              Redactez Market Brief...
            </h2>
            <p style={{ fontSize: 14, color: "#8b98a5", lineHeight: 1.6 }}>
              Asamblez datele live și generez analiza instituțională prin GPT-4o-mini. Te rog așteaptă ~10 secunde.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !brief) {
    return (
      <div className="min-h-screen bg-background">
        <TerminalHeader />
        <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
          <div style={{
            background: "rgba(239,87,87,.05)",
            border: "1px solid rgba(239,87,87,.3)",
            borderRadius: 12,
            padding: 48,
            textAlign: "center",
            marginTop: 32,
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚠</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#e8edf2", marginBottom: 8 }}>Eroare la generare</h2>
            <p style={{ fontSize: 14, color: "#8b98a5" }}>{error instanceof Error ? error.message : "Eroare necunoscută."}</p>
          </div>
        </main>
      </div>
    );
  }

  /* ─── Build ticker items (duplicate for seamless loop) ─── */
  const tickerItems = brief.tickerItems ?? [];
  const tickerDuped = [...tickerItems, ...tickerItems];

  /* ─── Formatted date/time for eyebrow ─── */
  const briefDate = brief.date ?? "";
  const generatedAt = brief.generatedAt ?? "";
  let eyebrowTime = "";
  try {
    const d = new Date(generatedAt);
    eyebrowTime = d.toLocaleString("ro-RO", { dateStyle: "long", timeStyle: "short" });
  } catch {
    eyebrowTime = generatedAt;
  }

  return (
    <div className="bb-page">
      <style>{bloombergCSS}</style>
      <TerminalHeader />

      {/* ── TICKER TAPE ── */}
      <div className="bb-ticker-outer">
        <div className="bb-ticker-track">
          {tickerDuped.map((item, i) => (
            <span
              key={i}
              className={
                item.direction === "up" ? "bb-up" : item.direction === "down" ? "bb-down" : ""
              }
            >
              {item.text}
            </span>
          ))}
        </div>
      </div>

      <div className="bb-wrap">
        {/* ── HEADER ── */}
        <header className="bb-header">
          <div className="bb-eyebrow">
            <span className="bb-dot" />
            LIVE DESK BRIEF · {briefDate} · {eyebrowTime}
          </div>
          <h1 className="bb-h1">{highlightAccent(brief.headline ?? "")}</h1>
          {brief.subheadline && <p className="bb-subhead">{brief.subheadline}</p>}
        </header>

        {/* ── 01 SNAPSHOT ── */}
        <section className="bb-section">
          <div className="bb-sec-label">
            <span className="bb-sec-num">01</span> HEADLINE &amp; SNAPSHOT
          </div>

          {brief.snapshot?.bullets && brief.snapshot.bullets.length > 0 && (
            <ul className="bb-bullets">
              {brief.snapshot.bullets.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}

          {brief.snapshot?.instruments && brief.snapshot.instruments.length > 0 && (
            <table className="bb-table">
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Nivel</th>
                  <th>Var. %</th>
                  <th>Referință orară</th>
                </tr>
              </thead>
              <tbody>
                {brief.snapshot.instruments.map(
                  (inst: { name: string; value: string; change: string; timestamp: string }, i: number) => (
                    <tr key={i}>
                      <td>{inst.name}</td>
                      <td>{inst.value}</td>
                      <td className={getChangeClass(inst.change)}>{inst.change}</td>
                      <td className="bb-flat">{inst.timestamp}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </section>

        {/* ── 02 MACRO ── */}
        <section className="bb-section">
          <div className="bb-sec-label">
            <span className="bb-sec-num">02</span> MACRO &amp; SENTIMENT DE PIAȚĂ
          </div>
          {brief.macroSentiment?.paragraphs?.map((p: string, i: number) => (
            <p key={i} className="bb-macro-p">{p}</p>
          ))}
        </section>

        {/* ── 03 EQUITY MARKETS ── */}
        <section className="bb-section">
          <div className="bb-sec-label">
            <span className="bb-sec-num">03</span> EQUITY MARKETS — PIEȚE DE ACȚIUNI
          </div>
          <div className="bb-grid3">
            {/* US */}
            <div className="bb-panel">
              <div className="bb-panel-title">🇺🇸 US</div>
              <p>{brief.equityMarkets?.us?.summary}</p>
              {brief.equityMarkets?.us?.details && (
                <p className="bb-detail">{brief.equityMarkets.us.details}</p>
              )}
            </div>
            {/* Europe */}
            <div className="bb-panel">
              <div className="bb-panel-title">🇪🇺 EUROPA</div>
              <p>{brief.equityMarkets?.europe?.summary}</p>
              {brief.equityMarkets?.europe?.details && (
                <p className="bb-detail">{brief.equityMarkets.europe.details}</p>
              )}
            </div>
            {/* Asia */}
            <div className="bb-panel">
              <div className="bb-panel-title">🌏 ASIA</div>
              <p>{brief.equityMarkets?.asia?.summary}</p>
              {brief.equityMarkets?.asia?.details && (
                <p className="bb-detail">{brief.equityMarkets.asia.details}</p>
              )}
            </div>
          </div>
        </section>

        {/* ── 04 RATES & FX ── */}
        <section className="bb-section">
          <div className="bb-sec-label">
            <span className="bb-sec-num">04</span> RATES &amp; FX
          </div>
          <div className="bb-grid2">
            <div className="bb-panel">
              <div className="bb-panel-title">Curba de randamente</div>
              <p>{brief.ratesFx?.rates}</p>
            </div>
            <div className="bb-panel">
              <div className="bb-panel-title">FX</div>
              <p>{brief.ratesFx?.fx}</p>
            </div>
          </div>
        </section>

        {/* ── 05 COMMODITIES & CRYPTO ── */}
        <section className="bb-section">
          <div className="bb-sec-label">
            <span className="bb-sec-num">05</span> COMMODITIES &amp; CRYPTO
          </div>
          <div className="bb-grid3">
            <div className="bb-panel">
              <div className="bb-panel-title">Petrol</div>
              <p>{brief.commoditiesCrypto?.oil}</p>
            </div>
            <div className="bb-panel">
              <div className="bb-panel-title">Aur</div>
              <p>{brief.commoditiesCrypto?.gold}</p>
            </div>
            <div className="bb-panel">
              <div className="bb-panel-title">Crypto</div>
              <p>{brief.commoditiesCrypto?.crypto}</p>
            </div>
          </div>
        </section>

        {/* ── 06 TOP STORIES ── */}
        <section className="bb-section">
          <div className="bb-sec-label">
            <span className="bb-sec-num">06</span> TOP ȘTIRI CU IMPACT MAJOR
          </div>
          {brief.topStories?.map(
            (
              story: {
                tag: string;
                tagType: string;
                title: string;
                whatHappened: string;
                whyItMatters: string;
                instruments: string[];
                bullCase: string;
                bearCase: string;
              },
              i: number
            ) => (
              <div key={i} className="bb-news-card">
                <span className={`bb-news-tag ${tagClassMap[story.tagType] || "bb-tag-macro"}`}>
                  {story.tag}
                </span>
                <h3>{story.title}</h3>
                <p>
                  <b>Ce s-a întâmplat: </b>
                  {story.whatHappened}
                </p>
                <p>
                  <b>De ce contează: </b>
                  {story.whyItMatters}
                </p>

                {story.instruments && story.instruments.length > 0 && (
                  <div className="bb-instruments">
                    {story.instruments.map((inst: string, j: number) => (
                      <span key={j}>{inst}</span>
                    ))}
                  </div>
                )}

                <div className="bb-scenario-grid">
                  <div className="bb-scenario bb-scenario-bull">
                    <b>Bullish</b>
                    {story.bullCase}
                  </div>
                  <div className="bb-scenario bb-scenario-bear">
                    <b>Bearish</b>
                    {story.bearCase}
                  </div>
                </div>
              </div>
            )
          )}
        </section>

        {/* ── 07 RETAIL IMPACT ── */}
        <section className="bb-section">
          <div className="bb-sec-label">
            <span className="bb-sec-num">07</span> IMPACT PENTRU UN INVESTITOR DE RETAIL
          </div>
          {brief.retailImpact && brief.retailImpact.length > 0 && (
            <ul className="bb-bullets">
              {brief.retailImpact.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </section>

        {/* ── 08 RISK SCENARIOS ── */}
        <section className="bb-section">
          <div className="bb-sec-label">
            <span className="bb-sec-num">08</span> RISK MANAGEMENT &amp; SCENARII
          </div>
          <div className="bb-grid3">
            {/* Base */}
            <div className="bb-scen-card bb-base">
              <div className="bb-stitle">Scenariu de bază</div>
              <div className="bb-pct">{brief.riskScenarios?.base?.probability ?? 0}%</div>
              <p>{brief.riskScenarios?.base?.description}</p>
              {brief.riskScenarios?.base?.invalidatedBy && (
                <div className="bb-invalidate">
                  Invalidat de: {brief.riskScenarios.base.invalidatedBy}
                </div>
              )}
            </div>
            {/* Bull */}
            <div className="bb-scen-card bb-bullc">
              <div className="bb-stitle">Scenariu pozitiv</div>
              <div className="bb-pct">{brief.riskScenarios?.bull?.probability ?? 0}%</div>
              <p>{brief.riskScenarios?.bull?.description}</p>
              {brief.riskScenarios?.bull?.confirmedBy && (
                <div className="bb-invalidate">
                  Confirmat de: {brief.riskScenarios.bull.confirmedBy}
                </div>
              )}
            </div>
            {/* Bear */}
            <div className="bb-scen-card bb-bearc">
              <div className="bb-stitle">Scenariu negativ</div>
              <div className="bb-pct">{brief.riskScenarios?.bear?.probability ?? 0}%</div>
              <p>{brief.riskScenarios?.bear?.description}</p>
              {brief.riskScenarios?.bear?.confirmedBy && (
                <div className="bb-invalidate">
                  Confirmat de: {brief.riskScenarios.bear.confirmedBy}
                </div>
              )}
            </div>
          </div>

          {brief.riskScenarios?.volatilityNote && (
            <p className="bb-vol-note">{brief.riskScenarios.volatilityNote}</p>
          )}
        </section>

        {/* ── 09 CLIENT PITCH ── */}
        <section className="bb-section">
          <div className="bb-sec-label">
            <span className="bb-sec-num">09</span> MINI-REZUMAT PENTRU CLIENT
          </div>
          <div className="bb-pitch-box">
            {brief.clientPitch?.map((p: string, i: number) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* ── 10 TRANSPARENCY ── */}
        <section className="bb-section" style={{ borderBottom: "none" }}>
          <div className="bb-sec-label">
            <span className="bb-sec-num">10</span> NOTE TEHNICE &amp; TRANSPARENȚĂ
          </div>
          {brief.transparency && brief.transparency.length > 0 && (
            <ul className="bb-transp">
              {brief.transparency.map((note: string, i: number) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          )}
        </section>

        {/* ── FOOTER ── */}
        <footer className="bb-footer">
          MARKET &amp; NEWS BRIEF · uz intern desk / client-facing · generat {eyebrowTime} · nu constituie recomandare de investiții
        </footer>
      </div>
    </div>
  );
}
