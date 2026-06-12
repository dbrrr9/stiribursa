import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery, a as useMutation } from "../_libs/tanstack__react-query.mjs";
import { T as TerminalHeader, t as timeAgo } from "./header-DypyDOR3.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { T as THEME_LABELS } from "./news-types-p-W0UZ89.mjs";
import { N as NewsCardSkeleton, a as NewsCard, S as SourceBadge, b as StatusBadge, c as SentimentBadge, I as ImpactBadge } from "./news-card-QtYm33Pl.mjs";
import { R as Route$1, b as analyzeCustomNews, f as fetchLatestNews, a as getDailyBrief } from "./router-BFjZgRb5.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { C as ChartColumn, N as Newspaper, o as ArrowRight, h as CalendarDays, c as Clock, Z as Zap, p as Sparkles, G as GraduationCap, a as TrendingUp, q as Link$1, F as FileText, e as LoaderCircle, i as TriangleAlert, r as Search, X, s as SlidersHorizontal } from "../_libs/lucide-react.mjs";
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
function TickerBar({ items }) {
  const ticks = reactExports.useMemo(() => {
    const themes = /* @__PURE__ */ new Map();
    items.forEach((i) => {
      i.themes.forEach((t) => themes.set(t, (themes.get(t) ?? 0) + 1));
    });
    const arr = Array.from(themes.entries()).map(([t, c]) => ({
      label: t.replace(/-/g, " ").toUpperCase(),
      count: c,
      delta: Math.random() > 0.5 ? "+" : "-",
      pct: (Math.random() * 2.5).toFixed(2)
    }));
    return arr.length ? arr : [{ label: "MARKETS", count: 0, delta: "+", pct: "0.00" }];
  }, [items]);
  const doubled = [...ticks, ...ticks];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative overflow-hidden border-b border-border bg-card/60 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ticker-track py-2", children: doubled.map((t, idx) => {
    const up = t.delta === "+";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-5 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-medium", children: t.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/60 tabular-nums", children: t.count }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: up ? "text-sentiment-positive tabular-nums font-medium" : "text-sentiment-negative tabular-nums font-medium", children: [
        t.delta,
        t.pct,
        "%"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "·" })
    ] }, idx);
  }) }) });
}
const SOURCES = ["Reuters", "Bloomberg", "Investing.com", "Yahoo Finance", "CNBC", "MarketWatch"];
const THEMES = ["actiuni", "obligatiuni", "indici", "forex", "marfuri", "crypto", "macro", "earnings", "banci-centrale", "geopolitica"];
const IMPACTS = ["high", "medium", "low"];
function toggle(arr, v) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}
function FilterBar({ state, onChange, totalCount }) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const activeCount = state.sources.length + state.themes.length + state.impacts.length + (state.q ? 1 : 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: state.q,
            onChange: (e) => onChange({ ...state, q: e.target.value }),
            placeholder: "Caută titluri, teme, sectoare, companii...",
            className: "ms-input w-full pl-10 pr-10 py-2.5 text-sm placeholder:text-muted-foreground/50"
          }
        ),
        state.q && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onChange({ ...state, q: "" }), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", "aria-label": "șterge", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        ["newest", "relevance", "highest-impact"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => onChange({ ...state, sort: s }),
            className: cn(
              "px-3 py-2 text-xs font-medium rounded-md border transition-all whitespace-nowrap",
              state.sort === s ? "border-teal text-teal bg-teal/5" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
            ),
            children: s === "newest" ? "Recente" : s === "relevance" ? "Relevanță" : "Impact"
          },
          s
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setExpanded(!expanded),
            className: cn(
              "flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md border transition-all",
              expanded || activeCount > 0 ? "border-teal text-teal bg-teal/5" : "border-border text-muted-foreground hover:text-foreground"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "h-3.5 w-3.5" }),
              "Filtre",
              activeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-teal text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center", children: activeCount })
            ]
          }
        )
      ] })
    ] }),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-3 border-t border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterGroup, { label: "Surse", children: SOURCES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { label: s, active: state.sources.includes(s), onClick: () => onChange({ ...state, sources: toggle(state.sources, s) }) }, s)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterGroup, { label: "Impact", children: IMPACTS.map((imp) => /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { label: imp === "high" ? "High" : imp === "medium" ? "Medium" : "Low", active: state.impacts.includes(imp), onClick: () => onChange({ ...state, impacts: toggle(state.impacts, imp) }) }, imp)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FilterGroup, { label: "Teme", children: THEMES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { label: THEME_LABELS[t], active: state.themes.includes(t), onClick: () => onChange({ ...state, themes: toggle(state.themes, t) }) }, t)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground tabular-nums", children: totalCount }),
        " rezultate",
        activeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          " · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-teal tabular-nums", children: activeCount }),
          " filtre active"
        ] })
      ] }),
      activeCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onChange({ q: "", sources: [], themes: [], impacts: [], sort: state.sort }), className: "text-xs text-muted-foreground hover:text-foreground transition-colors", children: "Resetează filtrele" })
    ] })
  ] });
}
function FilterGroup({ label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-section-label w-16 sm:w-20 flex-shrink-0 text-[10px]", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children })
  ] });
}
function FilterChip({ label, active, onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      className: cn(
        "ms-chip cursor-pointer transition-all border",
        active ? "text-teal bg-teal/8 border-teal/30" : "border-transparent hover:bg-muted/80"
      ),
      children: label
    }
  );
}
function CustomAnalyzer() {
  const [input, setInput] = reactExports.useState("");
  const [result, setResult] = reactExports.useState(null);
  const mutation = useMutation({
    mutationFn: (raw) => analyzeCustomNews({ data: { input: raw } }),
    onSuccess: (data) => setResult(data)
  });
  const isUrl = /^https?:\/\/\S+$/i.test(input.trim());
  const charCount = input.length;
  const canSubmit = input.trim().length >= 10 && !mutation.isPending;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setResult(null);
    mutation.mutate(input.trim());
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "ms-card p-5 sm:p-6 space-y-4 fade-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal/8 text-teal", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", children: "Analizează o știre" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground hidden sm:inline", children: "AI · Română" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed", children: [
      "Lipește un ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-teal font-medium", children: "link" }),
      " sau direct",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-teal font-medium", children: "textul" }),
      " unei știri. AI-ul o explică și analizează impactul pe piețe."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: input,
            onChange: (e) => setInput(e.target.value),
            placeholder: "https://www.reuters.com/markets/... sau lipește textul știrii",
            rows: 3,
            maxLength: 8e3,
            className: cn(
              "w-full resize-none rounded-lg border bg-muted/30 px-3 py-2.5",
              "text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/40",
              "border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/10",
              "transition-colors"
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-2 right-2 flex items-center gap-2 text-[10px] text-muted-foreground", children: [
          input.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-1 px-1.5 py-0.5 rounded bg-card border border-border", children: isUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link$1, { className: "h-2.5 w-2.5" }),
            " URL"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-2.5 w-2.5" }),
            " TEXT"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
            charCount,
            "/8000"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: input.trim().length > 0 && input.trim().length < 10 ? "Minim 10 caractere" : "Lipește link sau text pentru analiză AI" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            disabled: !canSubmit,
            className: cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              canSubmit ? "bg-teal text-white hover:bg-teal/90 shadow-sm" : "bg-muted text-muted-foreground cursor-not-allowed"
            ),
            children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
              " Analizez..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
              " Analizează"
            ] })
          }
        )
      ] })
    ] }),
    mutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted rounded animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted rounded animate-pulse w-5/6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted rounded animate-pulse w-4/6" })
    ] }),
    result && result.analysis && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-4 border-t border-border", children: [
      result.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 rounded-lg bg-impact-medium/5 border border-impact-medium/20 text-impact-medium text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 flex-shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: result.error })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] uppercase tracking-wider text-muted-foreground mb-1", children: result.sourceLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold leading-tight text-foreground", children: result.title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnalysisBlock, { label: "Explicat simplu", body: result.analysis.summarySimple }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnalysisBlock, { label: "De ce contează", body: result.analysis.whyItMatters }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnalysisBlock, { label: "Impact termen scurt", body: result.analysis.shortTermImpact, accent: "amber" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnalysisBlock, { label: "Impact termen mediu", body: result.analysis.mediumTermImpact, accent: "teal" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnalysisBlock, { label: "Piețe afectate", body: result.analysis.affectedMarkets }),
      result.analysis.watchPoints.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-teal mb-2", children: "De urmărit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: result.analysis.watchPoints.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2 text-sm text-foreground/90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-teal font-mono text-xs", children: String(i + 1).padStart(2, "0") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p })
        ] }, i)) })
      ] }),
      result.analysis.bottomLine.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-navy/[0.03] border border-navy/10 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-semibold text-navy mb-2", children: "Bottom Line" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: result.analysis.bottomLine.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-sm text-foreground flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-teal", children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: b })
        ] }, i)) })
      ] })
    ] }),
    mutation.isError && !result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 rounded-lg bg-impact-high/5 border border-impact-high/20 text-impact-high text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 flex-shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Nu am putut analiza. Verifică linkul sau lipește direct textul știrii." })
    ] })
  ] });
}
function AnalysisBlock({ label, body, accent = "navy" }) {
  const colorMap = { navy: "text-navy", teal: "text-teal", amber: "text-impact-medium" };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("text-xs font-semibold mb-1.5", colorMap[accent]), children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80 leading-relaxed whitespace-pre-line", children: body })
  ] });
}
const COURSE_URL = "https://www.investorhood.ro/curs-gratuit/";
function PromoBanner() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "fade-up", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "a",
    {
      href: COURSE_URL,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "group relative block overflow-hidden rounded-2xl border border-border bg-[#0a0f0a] shadow-elevated transition-all duration-300 hover:shadow-[0_12px_48px_oklch(0.55_0.18_150/0.3)]",
      "aria-label": "Aplică la cursul gratuit de investiții InvestorHood",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: "/investorhood-hero.jpg",
              alt: "Curs gratuit de investiții la bursă cu InvestorHood — învață de la profesioniști",
              className: "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]",
              loading: "lazy"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-transparent via-transparent via-80% to-[#0a0f0a] lg:block" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0f0a]/70 via-transparent to-transparent lg:hidden" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -right-16 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[oklch(0.6_0.2_150/0.18)] blur-3xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.6_0.2_150/0.15)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[oklch(0.75_0.2_150)]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
              "Recomandat"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium uppercase tracking-wider text-white/50", children: "Parteneriat InvestorHood" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "relative text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl [text-wrap:balance]", children: [
            "Curs ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[oklch(0.75_0.2_150)]", children: "gratuit" }),
            " de investiții la bursă"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "relative max-w-md text-sm leading-relaxed text-white/70", children: "Înțelege piețele pe care le urmărești zilnic aici. Învață de la profesioniști cum să analizezi acțiuni, să construiești un portofoliu și să iei decizii informate — pas cu pas, fără costuri." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "relative grid gap-2 text-sm text-white/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-4 w-4 shrink-0 text-[oklch(0.75_0.2_150)]" }),
              "Educație financiară aplicată, de la zero la primul tău plan"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 shrink-0 text-[oklch(0.75_0.2_150)]" }),
              "Strategii reale de investiții, explicate pe înțelesul tuturor"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-2 flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-xl bg-[oklch(0.6_0.2_150)] px-5 py-2.5 text-sm font-semibold text-[#04140a] transition-all duration-300 group-hover:bg-[oklch(0.7_0.21_150)] group-hover:gap-3", children: [
              "Aplică gratuit acum",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-white/45", children: "investorhood.ro · 100% gratuit" })
          ] })
        ] })
      ] })
    }
  ) });
}
function HomePage() {
  const search = Route$1.useSearch();
  const navigate = useNavigate({
    from: "/"
  });
  const filterState = {
    q: search.q,
    sources: search.src,
    themes: search.th,
    impacts: search.imp,
    sort: search.sort
  };
  const setFilter = (next) => navigate({
    search: {
      q: next.q,
      src: next.sources,
      th: next.themes,
      imp: next.impacts,
      sort: next.sort
    },
    replace: true
  });
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["news"],
    queryFn: () => fetchLatestNews(),
    staleTime: 1e3 * 60 * 5,
    refetchOnWindowFocus: false
  });
  const {
    data: briefData
  } = useQuery({
    queryKey: ["daily-brief-heatmap"],
    queryFn: () => getDailyBrief(),
    staleTime: 1e3 * 60 * 60,
    refetchOnWindowFocus: false
  });
  const items = data?.items ?? [];
  const filtered = reactExports.useMemo(() => {
    let arr = [...items];
    if (filterState.q.trim()) {
      const q = filterState.q.toLowerCase();
      arr = arr.filter((n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q) || n.themes.some((t) => t.includes(q)) || n.sectors?.some((s) => s.toLowerCase().includes(q)));
    }
    if (filterState.sources.length) arr = arr.filter((n) => filterState.sources.includes(n.source));
    if (filterState.themes.length) arr = arr.filter((n) => n.themes.some((t) => filterState.themes.includes(t)));
    if (filterState.impacts.length) arr = arr.filter((n) => filterState.impacts.includes(n.impact));
    if (filterState.sort === "newest") {
      arr.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (filterState.sort === "highest-impact") {
      const w = {
        high: 3,
        medium: 2,
        low: 1
      };
      arr.sort((a, b) => w[b.impact] - w[a.impact] || b.relevanceScore - a.relevanceScore);
    } else {
      arr.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }
    return arr;
  }, [items, filterState]);
  const topStories = items.filter((n) => n.impact === "high").sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 3);
  items.filter((n) => n.impact === "high" && n.status !== "low-relevance").slice(0, 4);
  items.filter((n) => n.impact !== "low").sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 4);
  const hasActiveFilters = filterState.q || filterState.sources.length || filterState.themes.length || filterState.impacts.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TerminalHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TickerBar, { items }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "fade-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-section-label text-teal", children: "Market Intelligence" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground tabular-nums", children: data?.source === "live" ? "LIVE" : data?.source === "cache" ? "CACHED" : "SEED" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-foreground mb-3 [text-wrap:balance]", children: [
          "Știrile care mișcă piețele,",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-teal", children: "explicate clar" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed", children: "Agregăm Reuters, Bloomberg, Investing.com, CNBC, MarketWatch și Yahoo Finance. Filtrăm doar ce contează. Fiecare știre devine o analiză clară: ce s-a întâmplat, de ce contează, ce impact are." })
      ] }),
      !hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsx(PromoBanner, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-8 space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CustomAnalyzer, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { state: filterState, onChange: setFilter, totalCount: filtered.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-teal" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Market Feed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-chip text-teal bg-teal/8 ml-1", children: filtered.length })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground hidden sm:inline", children: filterState.sort === "newest" ? "Recente" : filterState.sort === "relevance" ? "Relevanță" : "Impact" })
            ] }),
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: Array.from({
              length: 6
            }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(NewsCardSkeleton, {}, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { onReset: () => setFilter({
              q: "",
              sources: [],
              themes: [],
              impacts: [],
              sort: filterState.sort
            }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: filtered.map((n, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(NewsCard, { item: n, index: i, featured: i === 0 || n.impact === "high" && i < 3 }, n.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-6 space-y-6", children: [
          !hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3 fade-up", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/brief", className: "ms-card p-4 flex items-center gap-3 group hover:border-teal/40 hover:shadow-[0_0_20px_-12px_rgba(20,184,166,0.3)] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-teal/10 text-teal", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Newspaper, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground group-hover:text-teal transition-colors", children: "Daily Brief" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Rezumatul zilnic AI al piețelor" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 text-muted-foreground/40 group-hover:text-teal transition-colors" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/calendar", className: "ms-card p-4 flex items-center gap-3 group hover:border-navy/40 hover:shadow-[0_0_20px_-12px_rgba(100,116,139,0.3)] transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-navy/10 text-navy", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground group-hover:text-navy transition-colors", children: "Catalyst Calendar" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Evenimente care mișcă piețele" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 text-muted-foreground/40 group-hover:text-navy transition-colors" })
            ] })
          ] }),
          !hasActiveFilters && briefData?.brief?.sectorHeatmap && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "fade-up ms-card p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-teal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Market Heatmap" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: briefData.brief.sectorHeatmap.map((s, i) => {
              const isBull = s.sentiment === "bullish";
              const isBear = s.sentiment === "bearish";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col p-2.5 rounded-lg border transition-all ${isBull ? "bg-sentiment-positive/10 border-sentiment-positive/20" : isBear ? "bg-impact-high/10 border-impact-high/20" : "bg-muted border-border"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground mb-1", children: s.sector }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mt-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[9px] font-bold uppercase ${isBull ? "text-sentiment-positive" : isBear ? "text-impact-high" : "text-muted-foreground"}`, children: s.sentiment }) })
              ] }, i);
            }) })
          ] }),
          !hasActiveFilters && !isLoading && topStories.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(SectionBlock, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5" }), title: "Top Stories", subtitle: "Live Feed", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: topStories.slice(0, 5).map((n) => {
            n.sentiment === "positive";
            n.sentiment === "negative";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/article/$id", params: {
              id: n.id
            }, className: "group ms-card p-3 flex flex-col gap-2 hover:border-teal/30 hover:shadow-sm transition-all relative overflow-hidden", children: [
              n.status === "breaking" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-1 h-full bg-impact-high" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SourceBadge, { source: n.source }),
                  n.status === "breaking" && /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: "breaking" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-2.5 w-2.5" }),
                  timeAgo(n.publishedAt)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground group-hover:text-teal transition-colors leading-snug line-clamp-3", children: n.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SentimentBadge, { sentiment: n.sentiment }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ImpactBadge, { impact: n.impact })
              ] })
            ] }, n.id);
          }) }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "pt-8 pb-4 text-center text-[11px] text-muted-foreground", children: "MarketScope v2.0 · Reuters · Bloomberg · Investing.com · CNBC · MarketWatch · Yahoo Finance · Explicații AI în română" })
    ] })
  ] });
}
function SectionBlock({
  icon,
  title,
  subtitle,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4 fade-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-teal", children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground hidden sm:inline", children: [
        "— ",
        subtitle
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" })
    ] }),
    children
  ] });
}
function EmptyState({
  onReset
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-12 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold text-foreground mb-2", children: "Niciun rezultat" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4", children: "Nu am găsit știri pentru filtrele curente." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onReset, className: "text-sm font-medium px-4 py-2 rounded-lg bg-teal text-white hover:bg-teal/90 transition-colors", children: "Resetează filtrele" })
  ] });
}
export {
  HomePage as component
};
