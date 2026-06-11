import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { TerminalHeader } from "@/components/terminal/header";
import { TickerBar } from "@/components/terminal/ticker-bar";
import { FilterBar, type FilterState, type SortMode } from "@/components/terminal/filter-bar";
import { NewsCard, NewsCardSkeleton } from "@/components/terminal/news-card";
import { fetchLatestNews, getDailyBrief } from "@/lib/news.functions";
import { CustomAnalyzer } from "@/components/terminal/custom-analyzer";
import { PromoBanner } from "@/components/terminal/promo-banner";
import { Zap, TrendingUp, BarChart3, Newspaper, CalendarDays, ArrowRight, Clock } from "lucide-react";
import { SourceBadge, StatusBadge, SentimentBadge, ImpactBadge } from "@/components/terminal/badges";
import { timeAgo } from "@/components/terminal/clock";
import type { NewsSource, ThemeTag, ImpactLevel, NewsItem } from "@/lib/news-types";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  src: fallback(z.array(z.string()), []).default([]),
  th: fallback(z.array(z.string()), []).default([]),
  imp: fallback(z.array(z.string()), []).default([]),
  sort: fallback(z.enum(["relevance", "newest", "highest-impact"]), "newest").default("newest"),
});

export const Route = createFileRoute("/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "MarketScope — Market Intelligence Platform" },
      { name: "description", content: "Agregator premium de știri financiare de la Reuters, Bloomberg, Investing.com, CNBC, MarketWatch și Yahoo Finance." },
      { property: "og:title", content: "MarketScope — Market Intelligence" },
      { property: "og:description", content: "Știrile care mișcă piețele, explicate clar." },
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
    sort: search.sort as SortMode,
  };

  const setFilter = (next: FilterState) =>
    navigate({
      search: { q: next.q, src: next.sources, th: next.themes, imp: next.impacts, sort: next.sort },
      replace: true,
    });

  const { data, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: () => fetchLatestNews(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const { data: briefData } = useQuery({
    queryKey: ["daily-brief-heatmap"],
    queryFn: () => getDailyBrief(),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const items = data?.items ?? [];

  const filtered = useMemo(() => {
    let arr = [...items];
    if (filterState.q.trim()) {
      const q = filterState.q.toLowerCase();
      arr = arr.filter((n) =>
        n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q) ||
        n.themes.some((t) => t.includes(q)) || n.sectors?.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (filterState.sources.length) arr = arr.filter((n) => filterState.sources.includes(n.source));
    if (filterState.themes.length) arr = arr.filter((n) => n.themes.some((t) => filterState.themes.includes(t)));
    if (filterState.impacts.length) arr = arr.filter((n) => filterState.impacts.includes(n.impact));

    if (filterState.sort === "newest") {
      arr.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (filterState.sort === "highest-impact") {
      const w = { high: 3, medium: 2, low: 1 } as const;
      arr.sort((a, b) => w[b.impact] - w[a.impact] || b.relevanceScore - a.relevanceScore);
    } else {
      arr.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }
    return arr;
  }, [items, filterState]);

  // Derived sections
  const topStories = items.filter((n) => n.impact === "high").sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 3);
  const highImpact = items.filter((n) => n.impact === "high" && n.status !== "low-relevance").slice(0, 4);
  const marketMovers = items.filter((n) => n.impact !== "low").sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 4);

  const hasActiveFilters = filterState.q || filterState.sources.length || filterState.themes.length || filterState.impacts.length;

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <TickerBar items={items} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        
        {/* HERO */}
        <section className="fade-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="ms-section-label text-teal">Market Intelligence</span>
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {data?.source === "live" ? "LIVE" : data?.source === "cache" ? "CACHED" : "SEED"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-foreground mb-3 [text-wrap:balance]">
            Știrile care mișcă piețele,{" "}
            <span className="text-teal">explicate clar</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
            Agregăm Reuters, Bloomberg, Investing.com, CNBC, MarketWatch și Yahoo Finance. Filtrăm doar ce contează.
            Fiecare știre devine o analiză clară: ce s-a întâmplat, de ce contează, ce impact are.
          </p>
        </section>

        {/* PROMO — InvestorHood curs gratuit */}
        {!hasActiveFilters && <PromoBanner />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN - MAIN FEED (70%) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* CUSTOM AI ANALYZER */}
        <CustomAnalyzer />

        {/* FILTERS */}
        <FilterBar state={filterState} onChange={setFilter} totalCount={filtered.length} />

        {/* FULL FEED */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-teal" />
              <span className="text-sm font-semibold text-foreground">
                Market Feed
              </span>
              <span className="ms-chip text-teal bg-teal/8 ml-1">{filtered.length}</span>
            </div>
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              {filterState.sort === "newest" ? "Recente" : filterState.sort === "relevance" ? "Relevanță" : "Impact"}
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState onReset={() => setFilter({ q: "", sources: [], themes: [], impacts: [], sort: filterState.sort })} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((n, i) => (
                <NewsCard key={n.id} item={n} index={i} featured={i === 0 || (n.impact === "high" && i < 3)} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* RIGHT COLUMN - STICKY SIDEBAR (30%) */}
      <div className="lg:col-span-4">
        <div className="sticky top-6 space-y-6">
          
          {/* QUICK ACCESS */}
          {!hasActiveFilters && (
            <div className="grid grid-cols-1 gap-3 fade-up">
              <Link to="/brief" className="ms-card p-4 flex items-center gap-3 group hover:border-teal/40 hover:shadow-[0_0_20px_-12px_rgba(20,184,166,0.3)] transition-all">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal/10 text-teal">
                  <Newspaper className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground group-hover:text-teal transition-colors">Daily Brief</div>
                  <div className="text-xs text-muted-foreground">Rezumatul zilnic AI al piețelor</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-teal transition-colors" />
              </Link>
              <Link to="/calendar" className="ms-card p-4 flex items-center gap-3 group hover:border-navy/40 hover:shadow-[0_0_20px_-12px_rgba(100,116,139,0.3)] transition-all">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy/10 text-navy">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground group-hover:text-navy transition-colors">Catalyst Calendar</div>
                  <div className="text-xs text-muted-foreground">Evenimente care mișcă piețele</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-navy transition-colors" />
              </Link>
            </div>
          )}

          {/* SENTIMENT HEATMAP (VERTICAL) */}
          {!hasActiveFilters && briefData?.brief?.sectorHeatmap && (
            <section className="fade-up ms-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-4 w-4 text-teal" />
                <h2 className="text-sm font-semibold text-foreground">Market Heatmap</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {briefData.brief.sectorHeatmap.map((s, i) => {
                  const isBull = s.sentiment === "bullish";
                  const isBear = s.sentiment === "bearish";
                  return (
                    <div key={i} className={`flex flex-col p-2.5 rounded-lg border transition-all ${
                      isBull ? "bg-sentiment-positive/10 border-sentiment-positive/20" : 
                      isBear ? "bg-impact-high/10 border-impact-high/20" : 
                      "bg-muted border-border"
                    }`}>
                      <span className="text-xs font-semibold text-foreground mb-1">{s.sector}</span>
                      <div className="flex items-center justify-between mt-auto">
                        <span className={`text-[9px] font-bold uppercase ${
                          isBull ? "text-sentiment-positive" : isBear ? "text-impact-high" : "text-muted-foreground"
                        }`}>
                          {s.sentiment}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* TOP STORIES WIDGET */}
          {!hasActiveFilters && !isLoading && topStories.length > 0 && (
            <SectionBlock icon={<Zap className="h-3.5 w-3.5" />} title="Top Stories" subtitle="Live Feed">
              <div className="flex flex-col gap-3">
                {topStories.slice(0, 5).map((n) => {
                  const isBull = n.sentiment === "positive";
                  const isBear = n.sentiment === "negative";
                  return (
                    <Link key={n.id} to="/article/$id" params={{ id: n.id }} className="group ms-card p-3 flex flex-col gap-2 hover:border-teal/30 hover:shadow-sm transition-all relative overflow-hidden">
                      {n.status === "breaking" && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-impact-high" />
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <SourceBadge source={n.source} />
                          {n.status === "breaking" && <StatusBadge status="breaking" />}
                        </div>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {timeAgo(n.publishedAt)}
                        </span>
                      </div>
                      
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-teal transition-colors leading-snug line-clamp-3">
                        {n.title}
                      </h4>
                      
                      <div className="flex items-center justify-between mt-1">
                        <SentimentBadge sentiment={n.sentiment} />
                        <ImpactBadge impact={n.impact} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </SectionBlock>
          )}
        </div>
      </div>
      
      </div>

        <footer className="pt-8 pb-4 text-center text-[11px] text-muted-foreground">
          MarketScope v2.0 · Reuters · Bloomberg · Investing.com · CNBC · MarketWatch · Yahoo Finance · Explicații AI în română
        </footer>
      </main>
    </div>
  );
}

function SectionBlock({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 fade-up">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-teal">{icon}</span>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        </div>
        <span className="text-[11px] text-muted-foreground hidden sm:inline">— {subtitle}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      {children}
    </section>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="ms-card p-12 text-center">
      <div className="text-lg font-semibold text-foreground mb-2">Niciun rezultat</div>
      <p className="text-muted-foreground text-sm mb-4">Nu am găsit știri pentru filtrele curente.</p>
      <button
        onClick={onReset}
        className="text-sm font-medium px-4 py-2 rounded-lg bg-teal text-white hover:bg-teal/90 transition-colors"
      >
        Resetează filtrele
      </button>
    </div>
  );
}
