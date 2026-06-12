import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { t as toPng } from "../_libs/html-to-image.mjs";
import { T as TerminalHeader, f as formatTimestamp, t as timeAgo } from "./header-DypyDOR3.mjs";
import { S as SourceBadge, b as StatusBadge, I as ImpactBadge, c as SentimentBadge, R as RelevanceBar, a as NewsCard } from "./news-card-QtYm33Pl.mjs";
import { A as AdvancedRealTimeChart$1 } from "../_libs/react-ts-tradingview-widgets.mjs";
import { T as THEME_LABELS } from "./news-types-p-W0UZ89.mjs";
import { c as Route, f as fetchLatestNews, d as analyzeArticle, e as getAdvancedScore } from "./router-BFjZgRb5.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowLeft, c as Clock, t as Share, u as ExternalLink, g as CircleAlert, a as TrendingUp, v as Activity, i as TriangleAlert, M as Minus, b as TrendingDown } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function TradingViewChart({ symbol }) {
  const cleanSymbol = symbol.trim().toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-[400px] mt-6 rounded-lg overflow-hidden border border-border bg-black/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    AdvancedRealTimeChart$1,
    {
      symbol: cleanSymbol,
      theme: "dark",
      autosize: true,
      hide_side_toolbar: false,
      allow_symbol_change: false,
      save_image: false,
      timezone: "Europe/Bucharest"
    }
  ) });
}
const ShareCard = reactExports.forwardRef(
  ({ title, bottomLine, source, sentiment, impact }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref,
        className: "w-[1080px] h-[1080px] bg-[#0a0a0c] flex flex-col relative overflow-hidden",
        style: { fontFamily: "'Inter', sans-serif" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-teal/10 rounded-full blur-[120px]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-navy/20 rounded-full blur-[100px]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-12 border-b border-white/5 bg-white/[0.02] relative z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-teal rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.3)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-6 w-6 text-white" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-black text-white tracking-tight", children: "MarketScope" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-teal text-lg font-medium tracking-widest uppercase", children: "Intelligence" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-white/70 text-xl font-medium", children: [
              "Sursă: ",
              source
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 p-16 flex flex-col justify-center relative z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `px-6 py-2 rounded-full flex items-center gap-2 text-lg font-bold
              ${impact === "high" ? "bg-red-500/10 text-red-400 border border-red-500/20" : impact === "medium" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`, children: [
                impact === "high" && /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5" }),
                impact === "medium" && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5" }),
                impact === "low" && /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-5 h-5" }),
                "Impact ",
                impact === "high" ? "Major" : impact === "medium" ? "Mediu" : "Minor"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `px-6 py-2 rounded-full flex items-center gap-2 text-lg font-bold
              ${sentiment === "bullish" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : sentiment === "bearish" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"}`, children: [
                sentiment === "bullish" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-5 h-5" }) : sentiment === "bearish" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-5 h-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-5 h-5" }),
                "Sentiment ",
                sentiment === "bullish" ? "Bullish" : sentiment === "bearish" ? "Bearish" : "Neutru"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-6xl font-extrabold text-white leading-[1.15] tracking-tight mb-12 [text-wrap:balance]", children: title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-2 h-full bg-teal rounded-l-3xl" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-teal text-xl font-bold uppercase tracking-widest mb-4", children: "The Bottom Line" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl text-white/90 leading-relaxed font-serif", children: bottomLine })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 border-t border-white/5 bg-black/40 flex items-center justify-between relative z-10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white/40 text-xl font-medium", children: [
              "Generat cu AI • ",
              (/* @__PURE__ */ new Date()).toLocaleDateString("ro-RO")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/60 text-xl font-bold", children: "stiribursa.ro" })
          ] })
        ]
      }
    );
  }
);
ShareCard.displayName = "ShareCard";
function ArticlePage() {
  const loaderData = Route.useLoaderData();
  const {
    item
  } = loaderData;
  const {
    data: allNewsData
  } = useQuery({
    queryKey: ["news"],
    queryFn: () => fetchLatestNews(),
    staleTime: 1e3 * 60 * 5,
    refetchOnWindowFocus: false
  });
  if (!item) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TerminalHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto max-w-4xl px-4 py-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-semibold mb-2", children: "Articol indisponibil" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-sm font-medium text-teal hover:underline", children: "← Înapoi la feed" })
      ] }) })
    ] });
  }
  const {
    data: analysisData,
    isLoading: analysisLoading
  } = useQuery({
    queryKey: ["analysis", item.id],
    queryFn: () => analyzeArticle({
      data: {
        id: item.id,
        title: item.title,
        source: item.source,
        summary: item.summary,
        themes: item.themes,
        regions: item.regions
      }
    }),
    staleTime: Infinity,
    refetchOnWindowFocus: false
  });
  const {
    data: scoreData
  } = useQuery({
    queryKey: ["score", item.id],
    queryFn: () => getAdvancedScore({
      data: {
        id: item.id
      }
    }),
    staleTime: Infinity
  });
  const analysis = analysisData?.analysis;
  const analysisError = analysisData?.error;
  const scores = scoreData?.scores;
  const cardRef = reactExports.useRef(null);
  const [isSharing, setIsSharing] = reactExports.useState(false);
  const handleShare = async () => {
    if (!cardRef.current || !analysis) return;
    try {
      setIsSharing(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `marketscope-${item.id}.png`, {
        type: "image/png"
      });
      if (navigator.canShare && navigator.canShare({
        files: [file]
      })) {
        await navigator.share({
          files: [file],
          title: `Analiză MarketScope: ${item.title}`
        });
      } else {
        const link = document.createElement("a");
        link.download = `marketscope-${item.id}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (e) {
      console.error("Share error", e);
    } finally {
      setIsSharing(false);
    }
  };
  const relatedStories = reactExports.useMemo(() => {
    const allItems = allNewsData?.items ?? [];
    return allItems.filter((n) => n.id !== item.id).map((n) => {
      let score = 0;
      score += n.themes.filter((t) => item.themes.includes(t)).length * 3;
      score += n.regions.filter((r) => item.regions.includes(r)).length * 2;
      score += n.markets.filter((m) => item.markets.includes(m)).length;
      if (item.sectors && n.sectors) {
        score += n.sectors.filter((s) => item.sectors.includes(s)).length * 2;
      }
      return {
        ...n,
        _relScore: score
      };
    }).filter((n) => n._relScore > 0).sort((a, b) => b._relScore - a._relScore).slice(0, 3);
  }, [allNewsData, item]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TerminalHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
        " Înapoi la feed"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "ms-card p-6 sm:p-8 fade-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SourceBadge, { source: item.source }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: item.status }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ImpactBadge, { impact: item.impact }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SentimentBadge, { sentiment: item.sentiment })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-4 text-foreground [text-wrap:balance]", children: item.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-muted-foreground leading-relaxed mb-5", children: item.summary }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 mb-4", children: [
          item.markets.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-chip text-teal bg-teal/8", children: m }, m)),
          item.themes.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-chip", children: THEME_LABELS[t] }, t)),
          item.regions.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-chip text-navy/70 bg-navy/5", children: r }, r)),
          item.sectors?.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-chip", children: s }, s))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
            formatTimestamp(item.publishedAt),
            " · ",
            timeAgo(item.publishedAt)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            analysis && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleShare, disabled: isSharing, className: "inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-teal transition-colors disabled:opacity-50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Share, { className: "h-3.5 w-3.5" }),
              " ",
              isSharing ? "Generare..." : "Share Card"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(RelevanceBar, { score: item.relevanceScore }),
            item.url && /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: item.url, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:underline", children: [
              "Sursa originală ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3" })
            ] })
          ] })
        ] })
      ] }),
      scores && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "ms-card p-5 fade-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-teal", children: "Scoring Avansat" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-lg font-bold text-foreground tabular-nums", children: [
            scores.overall,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "/100" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreBar, { label: "Relevanță", value: scores.relevance }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreBar, { label: "Urgență", value: scores.urgency }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreBar, { label: "Impact", value: scores.marketImpact }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreBar, { label: "Încredere", value: scores.confidence })
        ] })
      ] }),
      analysisLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(AnalysisSkeleton, {}),
      analysisError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-5 border-impact-high/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-impact-high mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
          " Eroare analiză"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: analysisError })
      ] }),
      analysis && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        analysis.tickers && analysis.tickers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "fade-up mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TradingViewChart, { symbol: analysis.tickers[0] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { index: "01", title: "Ce s-a întâmplat", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProseBlock, { text: analysis.summarySimple }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { index: "02", title: "De ce contează", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProseBlock, { text: analysis.whyItMatters }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { index: "03", title: "Ce piețe afectează", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-xl border border-impact-medium/20 bg-gradient-to-br from-impact-medium/5 to-transparent p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-3 opacity-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-10 w-10 text-impact-medium" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold uppercase tracking-wider text-impact-medium mb-3", children: "Impact pe Termen Scurt" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[15px] font-serif leading-relaxed text-foreground/90 relative z-10", children: analysis.shortTermImpact })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-xl border border-teal/20 bg-gradient-to-br from-teal/5 to-transparent p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-3 opacity-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-10 w-10 text-teal" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold uppercase tracking-wider text-teal mb-3", children: "Impact pe Termen Mediu" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[15px] font-serif leading-relaxed text-foreground/90 relative z-10", children: analysis.mediumTermImpact })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProseBlock, { text: analysis.affectedMarkets }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { index: "04", title: "Ce ar trebui urmărit", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5", children: (analysis.watchPoints || []).map((wp, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3 text-sm leading-relaxed", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-teal font-mono text-xs tabular-nums flex-shrink-0 mt-0.5", children: String(i + 1).padStart(2, "0") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80", children: wp })
        ] }, i)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "ms-card p-6 sm:p-7 border-navy/10 bg-navy/[0.02] fade-up", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-navy", children: "Mini rezumat" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-navy/10" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5", children: (analysis.bottomLine || []).map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3 text-sm leading-relaxed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-teal flex-shrink-0 mt-0.5", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: b })
          ] }, i)) })
        ] })
      ] }),
      relatedStories.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4 fade-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-teal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Știri conexe" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: relatedStories.map((n, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(NewsCard, { item: n, index: i }, n.id)) })
      ] }),
      analysis && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed top-[-9999px] left-[-9999px] pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShareCard, { ref: cardRef, title: item.title, bottomLine: analysis.bottomLine?.[0] ?? analysis.summarySimple, source: item.source, sentiment: item.sentiment, impact: item.impact }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "pt-6 pb-4 text-center text-[11px] text-muted-foreground", children: "Analiză generată AI · Pentru scop educativ · Nu constituie sfat investițional" })
    ] })
  ] });
}
function Section({
  index,
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "ms-card p-6 sm:p-7 fade-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-teal tabular-nums", children: index }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold uppercase tracking-wide text-foreground", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose-finance", children })
  ] });
}
function ProseBlock({
  text
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: text.split(/\n\n+/).map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[15px] font-serif leading-[1.75] text-foreground/90 mb-4 last:mb-0", children: p }, i)) });
}
function ScoreBar({
  label,
  value
}) {
  const color = value >= 75 ? "bg-sentiment-positive" : value >= 50 ? "bg-impact-medium" : "bg-impact-low";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold tabular-nums text-foreground", children: value })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-full rounded-full transition-all", color), style: {
      width: `${value}%`
    } }) })
  ] });
}
function AnalysisSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-6 animate-pulse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-8 bg-muted rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-32 bg-muted rounded" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-full bg-muted rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-5/6 bg-muted rounded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-4/6 bg-muted rounded" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-[11px] text-teal", children: "Analiză AI în curs..." })
  ] }, i)) });
}
export {
  ArticlePage as component
};
