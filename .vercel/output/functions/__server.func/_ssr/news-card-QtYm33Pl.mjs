import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { T as THEME_LABELS } from "./news-types-p-W0UZ89.mjs";
import { t as timeAgo } from "./header-DypyDOR3.mjs";
import { u as useAuth, s as supabase } from "./router-BFjZgRb5.mjs";
import { B as Bookmark, w as ArrowUpRight, c as Clock } from "../_libs/lucide-react.mjs";
function ImpactBadge({ impact, className }) {
  const map = {
    high: { label: "High Impact", color: "text-impact-high bg-impact-high/8 border border-impact-high/20" },
    medium: { label: "Medium", color: "text-impact-medium bg-impact-medium/8 border border-impact-medium/20" },
    low: { label: "Low", color: "text-impact-low bg-impact-low/8 border border-impact-low/20" }
  };
  const m = map[impact];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("ms-chip", m.color, className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("inline-block h-1.5 w-1.5 rounded-full", impact === "high" ? "bg-impact-high" : impact === "medium" ? "bg-impact-medium" : "bg-impact-low") }),
    m.label
  ] });
}
function StatusBadge({ status }) {
  const map = {
    breaking: { label: "Breaking", cls: "text-white bg-impact-high border-impact-high" },
    developing: { label: "Developing", cls: "text-impact-medium bg-impact-medium/10 border-impact-medium/30" },
    confirmed: { label: "Confirmed", cls: "text-sentiment-positive bg-sentiment-positive/10 border-sentiment-positive/30" },
    "low-relevance": { label: "Low Relevance", cls: "text-muted-foreground bg-muted border-border" }
  };
  const m = map[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("ms-chip border", m.cls), children: m.label });
}
function SentimentBadge({ sentiment }) {
  const map = {
    positive: { label: "Pozitiv", cls: "text-sentiment-positive bg-sentiment-positive/8", arrow: "↑" },
    negative: { label: "Negativ", cls: "text-sentiment-negative bg-sentiment-negative/8", arrow: "↓" },
    mixed: { label: "Mixt", cls: "text-sentiment-mixed bg-sentiment-mixed/8", arrow: "↕" },
    uncertain: { label: "Incert", cls: "text-muted-foreground bg-muted", arrow: "?" }
  };
  const m = map[sentiment];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("ms-chip", m.cls), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: m.arrow }),
    m.label
  ] });
}
const SOURCE_COLORS = {
  Reuters: "text-orange-600 bg-orange-50",
  Bloomberg: "text-purple-700 bg-purple-50",
  "Yahoo Finance": "text-indigo-600 bg-indigo-50",
  CNBC: "text-blue-700 bg-blue-50",
  MarketWatch: "text-emerald-700 bg-emerald-50",
  "Investing.com": "text-sentiment-positive bg-sentiment-positive/8"
};
function SourceBadge({ source }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("ms-chip font-medium", SOURCE_COLORS[source] ?? ""), children: source });
}
function RelevanceBar({ score }) {
  const pct = Math.max(0, Math.min(100, score));
  const color = pct >= 80 ? "bg-teal" : pct >= 60 ? "bg-impact-medium" : "bg-muted-foreground/40";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[11px] text-muted-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Relevanță" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-1.5 w-14 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn("absolute inset-y-0 left-0 rounded-full transition-all", color),
        style: { width: `${pct}%` }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums font-medium text-foreground", children: pct })
  ] });
}
function useSavedArticles() {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [loading, setLoading] = reactExports.useState(false);
  const fetchSaved = reactExports.useCallback(async () => {
    if (!user) {
      setSavedIds(/* @__PURE__ */ new Set());
      return;
    }
    const { data } = await supabase.from("saved_articles").select("article_id").eq("user_id", user.id);
    if (data) setSavedIds(new Set(data.map((d) => d.article_id)));
  }, [user]);
  reactExports.useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);
  const toggleSave = reactExports.useCallback(async (articleId, title, source, summary) => {
    if (!user) return;
    setLoading(true);
    try {
      if (savedIds.has(articleId)) {
        await supabase.from("saved_articles").delete().eq("user_id", user.id).eq("article_id", articleId);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(articleId);
          return next;
        });
      } else {
        await supabase.from("saved_articles").insert({
          user_id: user.id,
          article_id: articleId,
          article_title: title,
          article_source: source,
          article_summary: summary
        });
        setSavedIds((prev) => new Set(prev).add(articleId));
      }
    } finally {
      setLoading(false);
    }
  }, [user, savedIds]);
  const isSaved = reactExports.useCallback((id) => savedIds.has(id), [savedIds]);
  return { isSaved, toggleSave, loading, savedIds };
}
function NewsCard({ item, index = 0, featured = false }) {
  const { user } = useAuth();
  const { isSaved, toggleSave } = useSavedArticles();
  const saved = isSaved(item.id);
  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) toggleSave(item.id, item.title, item.source, item.summary);
  };
  const hoverGlow = item.sentiment === "positive" ? "hover:border-sentiment-positive/40 hover:shadow-[0_0_25px_-12px_rgba(34,197,94,0.35)]" : item.sentiment === "negative" ? "hover:border-sentiment-negative/40 hover:shadow-[0_0_25px_-12px_rgba(239,68,68,0.35)]" : "hover:border-teal/40 hover:shadow-[0_0_25px_-12px_rgba(20,184,166,0.35)]";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/article/$id",
      params: { id: item.id },
      className: cn(
        "group ms-card fade-up block p-5 transition-all duration-300",
        hoverGlow,
        featured && "md:col-span-2 lg:col-span-2",
        item.status === "breaking" && "border-impact-high/40 bg-impact-high/[0.03]"
      ),
      style: { animationDelay: `${Math.min(index * 40, 300)}ms` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SourceBadge, { source: item.source }),
            item.status === "breaking" && /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: "breaking" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ImpactBadge, { impact: item.impact })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-shrink-0", children: [
            user && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSave, className: cn("p-1 rounded transition-colors", saved ? "text-teal" : "text-muted-foreground/40 hover:text-teal"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: cn("h-4 w-4", saved && "fill-current") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 text-muted-foreground/40 transition-all group-hover:text-teal group-hover:-translate-y-0.5 group-hover:translate-x-0.5" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: cn(
          "font-semibold leading-snug text-foreground group-hover:text-teal transition-colors mb-2 [text-wrap:balance]",
          featured ? "text-lg sm:text-xl" : "text-base"
        ), children: item.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2", children: item.summary }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 mb-3", children: [
          item.markets.slice(0, 3).map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-chip text-teal bg-teal/8", children: m }, m)),
          item.themes.slice(0, 3).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-chip", children: THEME_LABELS[t] }, t)),
          item.regions.slice(0, 2).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-chip text-navy/70 bg-navy/5", children: r }, r))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 pt-3 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tabular-nums", children: timeAgo(item.publishedAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SentimentBadge, { sentiment: item.sentiment }) })
        ] })
      ]
    }
  );
}
function NewsCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-5 animate-pulse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-16 rounded-md bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-20 rounded-md bg-muted" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-3/4 rounded bg-muted mb-2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-1/2 rounded bg-muted mb-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-full rounded bg-muted mb-1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-2/3 rounded bg-muted" })
  ] });
}
export {
  ImpactBadge as I,
  NewsCardSkeleton as N,
  RelevanceBar as R,
  SourceBadge as S,
  NewsCard as a,
  StatusBadge as b,
  SentimentBadge as c
};
