import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { TerminalHeader } from "@/components/terminal/header";
import { TickerBar } from "@/components/terminal/ticker-bar";
import { FilterBar, type FilterState } from "@/components/terminal/filter-bar";
import { NewsCard, NewsCardSkeleton } from "@/components/terminal/news-card";
import { fetchLatestNews } from "@/lib/news.functions";
import { CustomAnalyzer } from "@/components/terminal/custom-analyzer";
import type { NewsSource, ThemeTag, ImpactLevel } from "@/lib/news-types";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  src: fallback(z.array(z.string()), []).default([]),
  th: fallback(z.array(z.string()), []).default([]),
  imp: fallback(z.array(z.string()), []).default([]),
  sort: fallback(z.enum(["relevance", "newest"]), "newest").default("newest"),
});

export const Route = createFileRoute("/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "MarketScope — Terminal de știri pentru piața de capital" },
      {
        name: "description",
        content:
          "Agregator premium de știri Reuters, Bloomberg și Yahoo Finance, filtrate și explicate pentru investitori. Înțelegi rapid ce s-a întâmplat și ce impact are pe piețe.",
      },
      { property: "og:title", content: "MarketScope — Terminal financiar" },
      {
        property: "og:description",
        content: "Cele mai relevante știri pentru piața de capital, explicate clar.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/" });

  const filterState: FilterState = {
    q: search.q,
    sources: search.src as NewsSource[],
    themes: search.th as ThemeTag[],
    impacts: search.imp as ImpactLevel[],
    sort: search.sort,
  };

  const setFilter = (next: FilterState) =>
    navigate({
      search: {
        q: next.q,
        src: next.sources,
        th: next.themes,
        imp: next.impacts,
        sort: next.sort,
      },
      replace: true,
    });

  const { data, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: () => fetchLatestNews(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const items = data?.items ?? [];

  const filtered = useMemo(() => {
    let arr = [...items];
    if (filterState.q.trim()) {
      const q = filterState.q.toLowerCase();
      arr = arr.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.themes.some((t) => t.includes(q)) ||
          n.sectors?.some((s) => s.toLowerCase().includes(q)),
      );
    }
    if (filterState.sources.length)
      arr = arr.filter((n) => filterState.sources.includes(n.source));
    if (filterState.themes.length)
      arr = arr.filter((n) => n.themes.some((t) => filterState.themes.includes(t)));
    if (filterState.impacts.length)
      arr = arr.filter((n) => filterState.impacts.includes(n.impact));

    if (filterState.sort === "newest") {
      arr.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else {
      const w = { high: 3, medium: 2, low: 1 } as const;
      arr.sort((a, b) => w[b.impact] * 30 + b.relevanceScore - (w[a.impact] * 30 + a.relevanceScore));
    }
    return arr;
  }, [items, filterState]);

  const topMover = filtered[0];
  const highImpact = filtered.filter((n) => n.impact === "high").slice(0, 3);
  const movers = filtered
    .filter((n) => n.impact !== "low" && n.id !== topMover?.id)
    .slice(0, 4);

  return (
    <div className="terminal-root min-h-screen">
      <TerminalHeader />
      <TickerBar items={items} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* HERO */}
        <section className="terminal-card p-6 sm:p-8 fade-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-phosphor">
              ▸ market intelligence
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-phosphor/40 to-transparent" />
            <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
              {data?.source === "live" ? "LIVE FEED" : data?.source === "cache" ? "CACHED" : "SEED"}
            </span>
          </div>
          <h1 className="font-sans text-2xl sm:text-4xl font-bold leading-tight tracking-tight mb-3 [text-wrap:balance]">
            Știrile care mișcă piețele,{" "}
            <span className="text-phosphor glow-text-phosphor">explicate clar</span>
            <span className="blink-cursor" />
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
            Agregăm Reuters, CNBC, MarketWatch, Yahoo Finance și Bloomberg. Filtrăm doar ce contează
            cu adevărat pentru piața de capital. La un click, fiecare știre devine o analiză clară:
            ce s-a întâmplat, de ce contează, ce impact poate avea pe acțiuni, obligațiuni, FX și
            mărfuri.
          </p>
        </section>

        {/* CUSTOM AI ANALYZER */}
        <CustomAnalyzer />

        {/* FILTERS */}
        <FilterBar state={filterState} onChange={setFilter} totalCount={filtered.length} />

        {/* MARKET FEED — singura listă, ordonată implicit cronologic */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-sm border border-phosphor/40 text-phosphor bg-phosphor/5">
              <span className="font-mono text-[10px]">▸</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] font-semibold">
                MARKET FEED · {filtered.length} știri
              </span>
            </div>
            <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
            <span className="font-mono text-[10px] text-muted-foreground hidden sm:inline">
              {filterState.sort === "newest" ? "ORDONATE: CRONOLOGIC" : "ORDONATE: RELEVANȚĂ"}
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              onReset={() =>
                setFilter({ q: "", sources: [], themes: [], impacts: [], sort: filterState.sort })
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filtered.map((n, i) => (
                <NewsCard key={n.id} item={n} index={i} />
              ))}
            </div>
          )}
        </section>

        <footer className="pt-8 pb-4 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          MARKETSCOPE v1.0 · Reuters · CNBC · MarketWatch · Yahoo Finance · Bloomberg · explicații AI în română
        </footer>
      </main>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="terminal-card p-12 text-center">
      <div className="font-mono text-phosphor mb-2">// no_results.txt</div>
      <p className="text-muted-foreground mb-4">
        Niciun rezultat pentru filtrele curente.
      </p>
      <button
        onClick={onReset}
        className="font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-sm border border-phosphor/60 text-phosphor hover:bg-phosphor/10 transition-colors"
      >
        ▸ resetează filtrele
      </button>
    </div>
  );
}
