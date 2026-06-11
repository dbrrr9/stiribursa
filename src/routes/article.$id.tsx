import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft, ExternalLink, AlertCircle, Clock, TrendingUp, Share } from "lucide-react";
import { toPng } from "html-to-image";
import { TerminalHeader } from "@/components/terminal/header";
import { NewsCard } from "@/components/terminal/news-card";
import { TradingViewChart } from "@/components/terminal/tradingview-chart";
import { ShareCard } from "@/components/terminal/share-card";
import { ImpactBadge, SentimentBadge, SourceBadge, StatusBadge, RelevanceBar, ScoreBadge } from "@/components/terminal/badges";
import { formatTimestamp, timeAgo } from "@/components/terminal/clock";
import { THEME_LABELS, type NewsItem, type ThemeTag, type MarketRegion } from "@/lib/news-types";
import { analyzeArticle, getNewsItem, fetchLatestNews, getAdvancedScore } from "@/lib/news.functions";

export const Route = createFileRoute("/article/$id")({
  loader: ({ params }) => getNewsItem({ data: { id: params.id } }),
  head: ({ loaderData }) => {
    const item = loaderData?.item;
    return {
      meta: [
        { title: item ? `${item.title} — MarketScope` : "Știre — MarketScope" },
        { name: "description", content: item?.summary ?? "Analiză știre piață de capital." },
        { property: "og:title", content: item?.title ?? "MarketScope" },
        { property: "og:description", content: item?.summary ?? "" },
      ],
    };
  },
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="min-h-screen bg-background">
        <TerminalHeader />
        <main className="mx-auto max-w-4xl px-4 py-12 text-center">
          <div className="ms-card p-8">
            <AlertCircle className="h-8 w-8 text-impact-high mx-auto mb-3" />
            <h1 className="text-lg font-semibold mb-2">Eroare</h1>
            <p className="text-muted-foreground mb-4 text-sm">{error.message}</p>
            <button
              onClick={() => { router.invalidate(); reset(); }}
              className="text-sm font-medium px-4 py-2 rounded-lg bg-teal text-white hover:bg-teal/90 transition-colors"
            >
              Reîncearcă
            </button>
          </div>
        </main>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <main className="mx-auto max-w-4xl px-4 py-12 text-center">
        <div className="ms-card p-8">
          <h1 className="text-lg font-semibold mb-2">Articol negăsit</h1>
          <Link to="/" className="text-sm font-medium text-teal hover:underline">← Înapoi la feed</Link>
        </div>
      </main>
    </div>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const loaderData = Route.useLoaderData() as { item: NewsItem | null };
  const { item } = loaderData;

  // Fetch all news for related stories
  const { data: allNewsData } = useQuery({
    queryKey: ["news"],
    queryFn: () => fetchLatestNews(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <TerminalHeader />
        <main className="mx-auto max-w-4xl px-4 py-12 text-center">
          <div className="ms-card p-8">
            <h1 className="text-lg font-semibold mb-2">Articol indisponibil</h1>
            <Link to="/" className="text-sm font-medium text-teal hover:underline">← Înapoi la feed</Link>
          </div>
        </main>
      </div>
    );
  }

  const { data: analysisData, isLoading: analysisLoading } = useQuery({
    queryKey: ["analysis", item.id],
    queryFn: () => analyzeArticle({ data: { id: item.id, title: item.title, source: item.source, summary: item.summary, themes: item.themes, regions: item.regions } }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const { data: scoreData } = useQuery({
    queryKey: ["score", item.id],
    queryFn: () => getAdvancedScore({ data: { id: item.id } }),
    staleTime: Infinity,
  });

  const analysis = analysisData?.analysis;
  const analysisError = analysisData?.error;
  const scores = scoreData?.scores;

  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!cardRef.current || !analysis) return;
    try {
      setIsSharing(true);
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `marketscope-${item.id}.png`, { type: 'image/png' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Analiză MarketScope: ${item.title}`,
        });
      } else {
        const link = document.createElement('a');
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

  // Related stories logic
  const relatedStories = useMemo(() => {
    const allItems = allNewsData?.items ?? [];
    return allItems
      .filter((n) => n.id !== item.id)
      .map((n) => {
        let score = 0;
        // Same themes
        score += n.themes.filter((t) => item.themes.includes(t)).length * 3;
        // Same regions
        score += n.regions.filter((r) => item.regions.includes(r)).length * 2;
        // Same markets
        score += n.markets.filter((m) => item.markets.includes(m)).length;
        // Same sectors
        if (item.sectors && n.sectors) {
          score += n.sectors.filter((s) => item.sectors!.includes(s)).length * 2;
        }
        return { ...n, _relScore: score };
      })
      .filter((n) => n._relScore > 0)
      .sort((a, b) => b._relScore - a._relScore)
      .slice(0, 3);
  }, [allNewsData, item]);

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Înapoi la feed
        </Link>

        {/* HEADER */}
        <header className="ms-card p-6 sm:p-8 fade-up">
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <SourceBadge source={item.source} />
            <StatusBadge status={item.status} />
            <ImpactBadge impact={item.impact} />
            <SentimentBadge sentiment={item.sentiment} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-4 text-foreground [text-wrap:balance]">
            {item.title}
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed mb-5">
            {item.summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.markets.map((m) => (
              <span key={m} className="ms-chip text-teal bg-teal/8">{m}</span>
            ))}
            {item.themes.map((t) => (
              <span key={t} className="ms-chip">{THEME_LABELS[t]}</span>
            ))}
            {item.regions.map((r) => (
              <span key={r} className="ms-chip text-navy/70 bg-navy/5">{r}</span>
            ))}
            {item.sectors?.map((s) => (
              <span key={s} className="ms-chip">{s}</span>
            ))}
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {formatTimestamp(item.publishedAt)} · {timeAgo(item.publishedAt)}
            </div>
            <div className="flex items-center gap-4">
              {analysis && (
                <button 
                  onClick={handleShare} 
                  disabled={isSharing}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-teal transition-colors disabled:opacity-50"
                >
                  <Share className="h-3.5 w-3.5" /> {isSharing ? "Generare..." : "Share Card"}
                </button>
              )}
              <RelevanceBar score={item.relevanceScore} />
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:underline">
                  Sursa originală <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* ADVANCED SCORING */}
        {scores && (
          <section className="ms-card p-5 fade-up">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal">Scoring Avansat</span>
              <span className="h-px flex-1 bg-border" />
              <span className="text-lg font-bold text-foreground tabular-nums">{scores.overall}<span className="text-xs text-muted-foreground">/100</span></span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ScoreBar label="Relevanță" value={scores.relevance} />
              <ScoreBar label="Urgență" value={scores.urgency} />
              <ScoreBar label="Impact" value={scores.marketImpact} />
              <ScoreBar label="Încredere" value={scores.confidence} />
            </div>
          </section>
        )}

        {/* AI ANALYSIS */}
        {analysisLoading && <AnalysisSkeleton />}

        {analysisError && (
          <div className="ms-card p-5 border-impact-high/20">
            <div className="flex items-center gap-2 text-sm text-impact-high mb-2">
              <AlertCircle className="h-4 w-4" /> Eroare analiză
            </div>
            <p className="text-sm text-muted-foreground">{analysisError}</p>
          </div>
        )}

        {analysis && (
          <>
            {analysis.tickers && analysis.tickers.length > 0 && (
              <section className="fade-up mb-6">
                <TradingViewChart symbol={analysis.tickers[0]} />
              </section>
            )}

            <Section index="01" title="Ce s-a întâmplat">
              <ProseBlock text={analysis.summarySimple} />
            </Section>

            <Section index="02" title="De ce contează">
              <ProseBlock text={analysis.whyItMatters} />
            </Section>

            <Section index="03" title="Ce piețe afectează">
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <div className="relative overflow-hidden rounded-xl border border-impact-medium/20 bg-gradient-to-br from-impact-medium/5 to-transparent p-5">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <TrendingUp className="h-10 w-10 text-impact-medium" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-impact-medium mb-3">Impact pe Termen Scurt</div>
                  <p className="text-[15px] font-serif leading-relaxed text-foreground/90 relative z-10">{analysis.shortTermImpact}</p>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-teal/20 bg-gradient-to-br from-teal/5 to-transparent p-5">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Clock className="h-10 w-10 text-teal" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-teal mb-3">Impact pe Termen Mediu</div>
                  <p className="text-[15px] font-serif leading-relaxed text-foreground/90 relative z-10">{analysis.mediumTermImpact}</p>
                </div>
              </div>
              <div className="mt-2">
                <ProseBlock text={analysis.affectedMarkets} />
              </div>
            </Section>

            <Section index="04" title="Ce ar trebui urmărit">
              <ul className="space-y-2.5">
                {(analysis.watchPoints || []).map((wp, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="text-teal font-mono text-xs tabular-nums flex-shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-foreground/80">{wp}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* BOTTOM LINE */}
            <section className="ms-card p-6 sm:p-7 border-navy/10 bg-navy/[0.02] fade-up">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-navy">
                  Mini rezumat
                </span>
                <span className="h-px flex-1 bg-navy/10" />
              </div>
              <ul className="space-y-2.5">
                {(analysis.bottomLine || []).map((b, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="text-teal flex-shrink-0 mt-0.5">•</span>
                    <span className="text-foreground">{b}</span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        {/* RELATED STORIES */}
        {relatedStories.length > 0 && (
          <section className="space-y-4 fade-up">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-teal" />
              <h2 className="text-sm font-semibold text-foreground">Știri conexe</h2>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedStories.map((n, i) => (
                <NewsCard key={n.id} item={n} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* HIDDEN SHARE CARD */}
        {analysis && (
          <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none">
            <ShareCard
              ref={cardRef}
              title={item.title}
              bottomLine={analysis.bottomLine?.[0] ?? analysis.summarySimple}
              source={item.source}
              sentiment={item.sentiment}
              impact={item.impact}
            />
          </div>
        )}

        <footer className="pt-6 pb-4 text-center text-[11px] text-muted-foreground">
          Analiză generată AI · Pentru scop educativ · Nu constituie sfat investițional
        </footer>
      </main>
    </div>
  );
}

function Section({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <section className="ms-card p-6 sm:p-7 fade-up">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-xs font-semibold text-teal tabular-nums">{index}</span>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">{title}</h2>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="prose-finance">{children}</div>
    </section>
  );
}

function ProseBlock({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\n+/).map((p, i) => (
        <p key={i} className="text-[15px] font-serif leading-[1.75] text-foreground/90 mb-4 last:mb-0">{p}</p>
      ))}
    </>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 75 ? "bg-sentiment-positive" : value >= 50 ? "bg-impact-medium" : "bg-impact-low";
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span className="text-xs font-semibold tabular-nums text-foreground">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="ms-card p-6 animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 w-8 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-muted rounded" />
            <div className="h-3 w-5/6 bg-muted rounded" />
            <div className="h-3 w-4/6 bg-muted rounded" />
          </div>
          <div className="mt-3 text-[11px] text-teal">Analiză AI în curs...</div>
        </div>
      ))}
    </div>
  );
}
