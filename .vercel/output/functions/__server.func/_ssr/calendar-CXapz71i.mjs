import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { T as TerminalHeader } from "./header-DypyDOR3.mjs";
import { g as getCatalystCalendar } from "./router-BFjZgRb5.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { e as LoaderCircle, g as CircleAlert, h as CalendarDays, Z as Zap } from "../_libs/lucide-react.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const CATEGORY_LABELS = {
  earnings: "Earnings",
  economic: "Economic",
  "central-bank": "Bănci Centrale",
  geopolitical: "Geopolitică",
  ipo: "IPO",
  other: "Altele"
};
const CATEGORY_COLORS = {
  earnings: "bg-teal/10 text-teal border-teal/20",
  economic: "bg-navy/10 text-navy border-navy/20",
  "central-bank": "bg-impact-high/10 text-impact-high border-impact-high/20",
  geopolitical: "bg-impact-medium/10 text-impact-medium border-impact-medium/20",
  ipo: "bg-sentiment-positive/10 text-sentiment-positive border-sentiment-positive/20",
  other: "bg-muted text-muted-foreground border-border"
};
function CalendarPage() {
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["catalyst-calendar"],
    queryFn: () => getCatalystCalendar(),
    staleTime: 1e3 * 60 * 60,
    refetchOnWindowFocus: false
  });
  const events = data?.events ?? [];
  const grouped = events.reduce((acc, ev) => {
    const d = ev.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(ev);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TerminalHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-10 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fade-up", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-section-label text-teal", children: "Catalyst Calendar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2", children: [
          "Calendarul ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-teal", children: "Catalizatorilor" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Catalizatorii următoarelor ~30 de zile — earnings majore, date economice (CPI, PCE, NFP, GDP), decizii ale băncilor centrale, evenimente geopolitice și IPO-uri importante, fiecare cu explicații despre impactul potențial asupra piețelor." })
      ] }),
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-teal mx-auto mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Generez calendarul..." })
      ] }),
      data?.error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ms-card p-5 border-impact-medium/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-impact-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        " ",
        data.error
      ] }) }),
      sortedDates.map((date) => {
        const dayEvents = grouped[date];
        const d = /* @__PURE__ */ new Date(date + "T12:00:00");
        const isToday = (/* @__PURE__ */ new Date()).toISOString().split("T")[0] === date;
        const dayLabel = d.toLocaleDateString("ro-RO", {
          weekday: "long",
          day: "numeric",
          month: "long"
        });
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "fade-up", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4 text-teal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground capitalize", children: dayLabel }),
            isToday && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-chip text-teal bg-teal/8", children: "Azi" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-border" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: dayEvents.map((ev) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-4 flex gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1 flex-shrink-0 w-12", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("w-3 h-3 rounded-full", ev.impact === "high" ? "bg-impact-high" : ev.impact === "medium" ? "bg-impact-medium" : "bg-impact-low") }),
              ev.time && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-muted-foreground", children: ev.time })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("ms-chip border", CATEGORY_COLORS[ev.category] ?? CATEGORY_COLORS.other), children: CATEGORY_LABELS[ev.category] ?? ev.category }),
                ev.impact === "high" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ms-chip text-impact-high bg-impact-high/8 border border-impact-high/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-2.5 w-2.5" }),
                  " High Impact"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-0.5", children: ev.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: ev.description }),
              ev.whyItMatters && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 rounded-md border border-border/60 bg-muted/30 px-3 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wide text-teal mb-0.5", children: "De ce contează" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/80 leading-relaxed", children: ev.whyItMatters })
              ] }),
              ev.expectation && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground mt-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground/70", children: "Așteptări:" }),
                " ",
                ev.expectation
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 mt-2", children: [
                ev.tickers?.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-chip font-mono text-navy bg-navy/8", children: t }, t)),
                ev.regions.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-chip text-navy/70 bg-navy/5", children: r }, r)),
                ev.affectedMarkets.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-chip text-teal bg-teal/8", children: m }, m))
              ] })
            ] })
          ] }, ev.id)) })
        ] }, date);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-[11px] text-muted-foreground pt-4", children: [
        "Calendar generat AI · ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-teal hover:underline", children: "← Înapoi la feed" })
      ] })
    ] })
  ] });
}
export {
  CalendarPage as component
};
