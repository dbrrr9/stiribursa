import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as getDailyBrief } from "./router-BFjZgRb5.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { T as TerminalHeader } from "./header-DypyDOR3.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { e as LoaderCircle, i as TriangleAlert, Z as Zap, j as Earth, k as ChartLine, C as ChartColumn, a as TrendingUp, b as TrendingDown, S as ShieldAlert } from "../_libs/lucide-react.mjs";
import { M as Markdown } from "../_libs/react-markdown.mjs";
import { r as remarkGfm } from "../_libs/remark-gfm.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/devlop.mjs";
import "../_libs/unified.mjs";
import "../_libs/bail.mjs";
import "../_libs/extend.mjs";
import "../_libs/is-plain-obj.mjs";
import "../_libs/trough.mjs";
import "../_libs/vfile.mjs";
import "../_libs/vfile-message.mjs";
import "../_libs/unist-util-stringify-position.mjs";
import "node:process";
import "node:path";
import "node:url";
import "../_libs/remark-parse.mjs";
import "../_libs/mdast-util-from-markdown.mjs";
import "../_libs/micromark-util-decode-numeric-character-reference+[...].mjs";
import "../_libs/micromark-util-decode-string.mjs";
import "../_libs/decode-named-character-reference+[...].mjs";
import "../_libs/character-entities.mjs";
import "../_libs/micromark-util-normalize-identifier+[...].mjs";
import "../_libs/micromark.mjs";
import "../_libs/micromark-util-combine-extensions+[...].mjs";
import "../_libs/micromark-util-chunked.mjs";
import "../_libs/micromark-factory-space.mjs";
import "../_libs/micromark-util-character.mjs";
import "../_libs/micromark-core-commonmark.mjs";
import "../_libs/micromark-util-classify-character+[...].mjs";
import "../_libs/micromark-util-resolve-all.mjs";
import "../_libs/micromark-util-subtokenize.mjs";
import "../_libs/micromark-factory-destination.mjs";
import "../_libs/micromark-factory-label.mjs";
import "../_libs/micromark-factory-title.mjs";
import "../_libs/micromark-factory-whitespace.mjs";
import "../_libs/micromark-util-html-tag-name.mjs";
import "../_libs/mdast-util-to-string.mjs";
import "../_libs/remark-rehype.mjs";
import "../_libs/mdast-util-to-hast.mjs";
import "../_libs/ungap__structured-clone.mjs";
import "../_libs/micromark-util-sanitize-uri.mjs";
import "../_libs/unist-util-position.mjs";
import "../_libs/trim-lines.mjs";
import "../_libs/unist-util-visit.mjs";
import "../_libs/unist-util-visit-parents.mjs";
import "../_libs/unist-util-is.mjs";
import "../_libs/hast-util-to-jsx-runtime.mjs";
import "../_libs/comma-separated-tokens.mjs";
import "../_libs/property-information.mjs";
import "../_libs/space-separated-tokens.mjs";
import "../_libs/style-to-js.mjs";
import "../_libs/style-to-object.mjs";
import "../_libs/inline-style-parser.mjs";
import "../_libs/hast-util-whitespace.mjs";
import "../_libs/estree-util-is-identifier-name.mjs";
import "../_libs/html-url-attributes.mjs";
import "../_libs/micromark-extension-gfm.mjs";
import "../_libs/micromark-extension-gfm-autolink-literal+[...].mjs";
import "../_libs/micromark-extension-gfm-footnote+[...].mjs";
import "../_libs/micromark-extension-gfm-strikethrough+[...].mjs";
import "../_libs/micromark-extension-gfm-table.mjs";
import "../_libs/micromark-extension-gfm-task-list-item+[...].mjs";
import "../_libs/mdast-util-gfm.mjs";
import "../_libs/mdast-util-gfm-autolink-literal+[...].mjs";
import "../_libs/ccount.mjs";
import "../_libs/mdast-util-find-and-replace.mjs";
import "../_libs/escape-string-regexp.mjs";
import "../_libs/mdast-util-gfm-footnote.mjs";
import "../_libs/mdast-util-gfm-strikethrough.mjs";
import "../_libs/mdast-util-gfm-table.mjs";
import "../_libs/markdown-table.mjs";
import "../_libs/mdast-util-to-markdown.mjs";
import "../_libs/longest-streak.mjs";
import "../_libs/mdast-util-phrasing.mjs";
import "../_libs/mdast-util-gfm-task-list-item.mjs";
function MetricGroup({
  title,
  items,
  isYield = false
}) {
  if (!items || items.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 p-4 transition-colors hover:bg-card/60", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[10px] font-bold uppercase text-muted-foreground tracking-[0.15em] mb-4 border-b border-border/40 pb-2", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: items.map((item, i) => {
      const isNegative = item.change?.includes("-");
      const TrendIcon = isNegative ? TrendingDown : TrendingUp;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between group cursor-default", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors", children: item.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold font-mono text-foreground", children: item.value }),
          !isYield && item.change && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-1 text-[11px] font-bold font-mono px-1.5 py-0.5 rounded-md ${isNegative ? "bg-sentiment-negative/10 text-sentiment-negative" : "bg-sentiment-positive/10 text-sentiment-positive"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendIcon, { className: "w-3 h-3" }),
            item.change
          ] })
        ] })
      ] }, i);
    }) })
  ] });
}
function BriefPage() {
  const {
    data: brief,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["dailyBrief"],
    queryFn: async () => {
      try {
        const res = await getDailyBrief();
        if (!res) throw new Error("Response is null/undefined. The server likely crashed or timed out (504).");
        if (res.error) throw new Error(res.error);
        if (!res.brief) throw new Error("No brief in response. Raw response: " + JSON.stringify(res));
        return res.brief;
      } catch (err) {
        throw new Error(err.message || "Eroare necunoscută la fetch");
      }
    },
    staleTime: 1e3 * 60 * 30
    // 30 mins
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal/5 rounded-full blur-[120px] pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TerminalHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center justify-center min-h-[70vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-12 text-center fade-up relative overflow-hidden max-w-md w-full border-teal/20 bg-background/60 backdrop-blur-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-teal/10 via-transparent to-transparent pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-10 w-10 animate-spin text-teal mx-auto mb-6 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground mb-2", children: "Redactez Market Brief..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Asamblez datele live și generez analiza instituțională prin GPT-4o-mini. Te rog așteaptă ~10 secunde." })
      ] }) })
    ] });
  }
  if (isError || !brief) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TerminalHeader, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto max-w-4xl px-4 sm:px-6 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-12 text-center mt-8 border-destructive/20 bg-destructive/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-10 w-10 text-destructive mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-foreground mb-2", children: "Eroare la generare" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: error instanceof Error ? error.message : "Eroare necunoscută." })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background relative selection:bg-teal/30 selection:text-teal-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-1/4 w-1/2 h-96 bg-teal/5 rounded-full blur-[120px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TerminalHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fade-up max-w-4xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 py-1 rounded-full bg-teal/10 text-teal text-xs font-bold tracking-widest uppercase border border-teal/20", children: "Daily Desk Briefing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground tabular-nums font-mono", children: new Date(brief.generatedAt).toLocaleString("ro-RO", {
            dateStyle: "long",
            timeStyle: "short"
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6", children: brief.headline })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fade-up delay-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-6 sm:p-8 bg-card/60 backdrop-blur-xl border-border/60 shadow-2xl shadow-black/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 text-sm font-bold uppercase text-muted-foreground tracking-[0.2em] mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-teal" }),
          "Rezumat Executiv"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid sm:grid-cols-2 gap-4 mb-8 text-sm sm:text-base text-foreground/80", children: brief.snapshot?.bullets?.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-teal mt-2 shrink-0 shadow-[0_0_8px_rgba(45,212,191,0.8)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "leading-relaxed", children: b })
        ] }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricGroup, { title: "Indici", items: brief.snapshot?.indices }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricGroup, { title: "Valute (FX)", items: brief.snapshot?.fx }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricGroup, { title: "Mărfuri", items: brief.snapshot?.commodities }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MetricGroup, { title: "Dobânzi", items: brief.snapshot?.rates, isYield: true })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2 gap-8 fade-up delay-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-6 sm:p-8 space-y-6 flex flex-col hover:border-teal/30 transition-colors duration-500 bg-gradient-to-b from-card to-card/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 border-b border-border/40 pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-teal/10 text-teal", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Earth, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold tracking-tight", children: "Macro & Sentiment" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose dark:prose-invert prose-teal max-w-none text-foreground/80 leading-loose", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Markdown, { remarkPlugins: [remarkGfm], children: brief.macroSentiment?.markdown }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-6 sm:p-8 space-y-6 flex flex-col hover:border-teal/30 transition-colors duration-500 bg-gradient-to-b from-card to-card/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 border-b border-border/40 pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-teal/10 text-teal", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartLine, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold tracking-tight", children: "Rates, FX & Commodities" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prose dark:prose-invert prose-teal max-w-none text-foreground/80 leading-loose space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Markdown, { remarkPlugins: [remarkGfm], children: brief.ratesFx?.markdown }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Markdown, { remarkPlugins: [remarkGfm], children: brief.commoditiesCrypto?.markdown })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fade-up delay-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-6 sm:p-8 space-y-8 bg-card/80 backdrop-blur-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 border-b border-border/40 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-teal/10 text-teal", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold tracking-tight", children: "Equity Markets" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-5 gap-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-3 prose dark:prose-invert prose-teal max-w-none text-foreground/80 leading-loose", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Markdown, { remarkPlugins: [remarkGfm], children: brief.equities?.markdown }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-bold uppercase text-muted-foreground tracking-[0.2em] mb-4", children: "Key Movers" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: brief.equities?.keyStocks?.map((stock, i) => {
              const isNegative = stock.move.includes("-");
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative flex flex-col p-4 rounded-xl bg-background border border-border hover:border-teal/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-0 right-0 w-16 h-16 opacity-10 rounded-bl-full \${isNegative ? 'bg-sentiment-negative' : 'bg-sentiment-positive'} transition-transform group-hover:scale-150` }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-extrabold text-foreground text-sm tracking-tight", children: stock.symbol }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-bold font-mono px-2 py-1 rounded-md ${isNegative ? "bg-sentiment-negative/10 text-sentiment-negative" : "bg-sentiment-positive/10 text-sentiment-positive"}`, children: stock.move })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground font-medium leading-snug", children: stock.trigger })
              ] }, i);
            }) })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fade-up delay-400 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold uppercase tracking-[0.2em] text-teal", children: "Catalizatori Major" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-gradient-to-r from-border to-transparent" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "columns-1 xl:columns-2 gap-6 space-y-6", children: brief.topNews?.map((news, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "break-inside-avoid border border-border/60 rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm hover:border-teal/30 transition-colors duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 sm:p-6 bg-muted/10 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-foreground text-lg sm:text-xl leading-tight", children: news.title }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 sm:p-6 space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose dark:prose-invert prose-sm prose-teal max-w-none text-foreground/80 leading-relaxed", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Markdown, { remarkPlugins: [remarkGfm], children: news.markdown }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-sentiment-positive/5 border border-sentiment-positive/10 relative overflow-hidden group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-8 h-8 bg-sentiment-positive/10 rounded-bl-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-[10px] font-extrabold text-sentiment-positive uppercase tracking-[0.15em] mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3 h-3" }),
                  " Bull Case"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/80 font-medium leading-relaxed", children: news.bullishScenario })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-sentiment-negative/5 border border-sentiment-negative/10 relative overflow-hidden", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-8 h-8 bg-sentiment-negative/10 rounded-bl-full" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-[10px] font-extrabold text-sentiment-negative uppercase tracking-[0.15em] mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-3 h-3" }),
                  " Bear Case"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/80 font-medium leading-relaxed", children: news.bearishScenario })
              ] })
            ] }),
            news.affectedInstruments && news.affectedInstruments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 pt-2 border-t border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest mr-1", children: "Impact:" }),
              news.affectedInstruments.map((inst, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-1 bg-background text-foreground text-[10px] font-bold font-mono rounded-md border border-border/60 hover:border-teal/50 transition-colors cursor-default", children: inst }, j))
            ] })
          ] })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6 fade-up delay-500 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-6 sm:p-8 lg:col-span-1 bg-gradient-to-br from-card to-card/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 text-sm font-bold uppercase text-muted-foreground tracking-[0.2em] mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-4 h-4 text-teal" }),
            " Retail Impact"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: brief.retailImpact?.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-teal mt-1.5 shrink-0 opacity-70" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground/80 font-medium leading-snug", children: item })
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-6 sm:p-8 lg:col-span-2 bg-gradient-to-br from-card to-card/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 text-sm font-bold uppercase text-muted-foreground tracking-[0.2em] mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-destructive" }),
            " Risk Scenarios"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose dark:prose-invert prose-teal max-w-none text-foreground/80 leading-loose p-6 rounded-xl bg-background/30 border border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Markdown, { remarkPlugins: [remarkGfm], children: brief.riskScenarios?.markdown }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  BriefPage as component
};
