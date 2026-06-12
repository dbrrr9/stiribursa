import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { T as TerminalHeader } from "./header-DypyDOR3.mjs";
import { f as fetchLatestNews } from "./router-BFjZgRb5.mjs";
import { T as THEME_LABELS } from "./news-types-p-W0UZ89.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowLeft, C as ChartColumn, a as TrendingUp, b as TrendingDown, M as Minus } from "../_libs/lucide-react.mjs";
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
const THEME_ICONS = {
  actiuni: "📈",
  obligatiuni: "📊",
  indici: "📉",
  forex: "💱",
  marfuri: "🛢️",
  crypto: "₿",
  macro: "🏛️",
  earnings: "💰",
  "banci-centrale": "🏦",
  geopolitica: "🌍"
};
function ThemesPage() {
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["news"],
    queryFn: () => fetchLatestNews(),
    staleTime: 1e3 * 60 * 5,
    refetchOnWindowFocus: false
  });
  const items = data?.items ?? [];
  const themeStats = reactExports.useMemo(() => {
    const stats = {};
    const allThemes = ["actiuni", "obligatiuni", "indici", "forex", "marfuri", "crypto", "macro", "earnings", "banci-centrale", "geopolitica"];
    for (const t of allThemes) {
      stats[t] = {
        count: 0,
        highImpact: 0,
        sentiment: {
          pos: 0,
          neg: 0,
          mix: 0
        },
        items: []
      };
    }
    for (const item of items) {
      for (const theme of item.themes) {
        if (stats[theme]) {
          stats[theme].count++;
          stats[theme].items.push(item);
          if (item.impact === "high") stats[theme].highImpact++;
          if (item.sentiment === "positive") stats[theme].sentiment.pos++;
          else if (item.sentiment === "negative") stats[theme].sentiment.neg++;
          else stats[theme].sentiment.mix++;
        }
      }
    }
    return Object.entries(stats).map(([key, val]) => ({
      theme: key,
      ...val
    })).sort((a, b) => b.count - a.count);
  }, [items]);
  const dominantSentiment = (s) => {
    if (s.pos > s.neg && s.pos > s.mix) return "positive";
    if (s.neg > s.pos && s.neg > s.mix) return "negative";
    return "mixed";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TerminalHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
        " Înapoi la feed"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-5 w-5 text-teal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-foreground", children: "Market Themes" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-2xl", children: "Explorează temele principale ale pieței. Fiecare temă arată câte știri sunt active, impactul predominant și sentimentul general." })
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-5 animate-pulse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-1/3 bg-muted rounded mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-1/2 bg-muted rounded" })
      ] }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: themeStats.map(({
        theme,
        count,
        highImpact,
        sentiment,
        items: themeItems
      }) => {
        const dom = dominantSentiment(sentiment);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-5 space-y-3 fade-up", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: THEME_ICONS[theme] || "📰" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: THEME_LABELS[theme] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-chip text-teal bg-teal/8 font-semibold", children: count })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              dom === "positive" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5 text-sentiment-positive" }) : dom === "negative" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3.5 w-3.5 text-sentiment-negative" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3.5 w-3.5 text-sentiment-mixed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: dom === "positive" ? "text-sentiment-positive" : dom === "negative" ? "text-sentiment-negative" : "text-sentiment-mixed", children: dom === "positive" ? "Pozitiv" : dom === "negative" ? "Negativ" : "Mixt" })
            ] }),
            highImpact > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-impact-high font-medium", children: [
              highImpact,
              " high impact"
            ] })
          ] }),
          count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-1.5 rounded-full overflow-hidden bg-muted", children: [
            sentiment.pos > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-sentiment-positive", style: {
              width: `${sentiment.pos / count * 100}%`
            } }),
            sentiment.mix > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-sentiment-mixed", style: {
              width: `${sentiment.mix / count * 100}%`
            } }),
            sentiment.neg > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-sentiment-negative", style: {
              width: `${sentiment.neg / count * 100}%`
            } })
          ] }),
          themeItems[0] && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/article/$id", params: {
            id: themeItems[0].id
          }, className: "block text-sm text-muted-foreground hover:text-foreground transition-colors line-clamp-2 pt-2 border-t border-border", children: themeItems[0].title })
        ] }, theme);
      }) })
    ] })
  ] });
}
export {
  ThemesPage as component
};
