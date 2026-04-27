import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, AlertCircle } from "lucide-react";
import { TerminalHeader } from "@/components/terminal/header";
import { ImpactBadge, SentimentBadge, SourceBadge, RelevanceBar } from "@/components/terminal/badges";
import { formatTimestamp, timeAgo } from "@/components/terminal/clock";
import { THEME_LABELS, type NewsItem, type ThemeTag, type MarketRegion } from "@/lib/news-types";
import { analyzeArticle, getNewsItem } from "@/lib/news.functions";

export const Route = createFileRoute("/article/$id")({
  loader: ({ params }) => getNewsItem({ data: { id: params.id } }),
  head: ({ loaderData }) => {
    const item = loaderData?.item;
    return {
      meta: [
        { title: item ? `${item.title} — CAPITAL::TERM` : "Știre — CAPITAL::TERM" },
        {
          name: "description",
          content: item?.summary ?? "Analiză știre piață de capital.",
        },
        { property: "og:title", content: item?.title ?? "CAPITAL::TERM" },
        { property: "og:description", content: item?.summary ?? "" },
      ],
    };
  },
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="terminal-root min-h-screen">
        <TerminalHeader />
        <main className="mx-auto max-w-3xl px-4 py-12 text-center">
          <div className="terminal-card p-8">
            <AlertCircle className="h-8 w-8 text-impact-high mx-auto mb-3" />
            <h1 className="font-mono text-lg mb-2">// system_error</h1>
            <p className="text-muted-foreground mb-4 text-sm">{error.message}</p>
            <button
              onClick={() => { router.invalidate(); reset(); }}
              className="font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-sm border border-phosphor/60 text-phosphor hover:bg-phosphor/10"
            >
              ▸ retry
            </button>
          </div>
        </main>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="terminal-root min-h-screen">
      <TerminalHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <div className="terminal-card p-8">
          <h1 className="font-mono text-lg mb-2 text-phosphor">// 404 article_not_found</h1>
          <Link to="/" className="font-mono text-xs uppercase tracking-wider text-cyan hover:text-phosphor">
            ▸ înapoi la feed
          </Link>
        </div>
      </main>
    </div>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const loaderData = Route.useLoaderData() as { item: NewsItem | null };
  const { item } = loaderData;

  if (!item) {
    return (
      <div className="terminal-root min-h-screen">
        <TerminalHeader />
        <main className="mx-auto max-w-3xl px-4 py-12 text-center">
          <div className="terminal-card p-8">
            <h1 className="font-mono text-lg mb-2 text-phosphor">// articol indisponibil</h1>
            <Link to="/" className="font-mono text-xs uppercase tracking-wider text-cyan hover:text-phosphor">
              ▸ înapoi la feed
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const { data: analysisData, isLoading: analysisLoading } = useQuery({
    queryKey: ["analysis", item.id],
    queryFn: () =>
      analyzeArticle({
        data: {
          id: item.id,
          title: item.title,
          source: item.source,
          summary: item.summary,
          themes: item.themes,
          regions: item.regions,
        },
      }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const analysis = analysisData?.analysis;
  const analysisError = analysisData?.error;

  return (
    <div className="terminal-root min-h-screen">
      <TerminalHeader />

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-phosphor transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> înapoi la feed
        </Link>

        {/* HEADER */}
        <header className="terminal-card p-6 sm:p-8 fade-up">
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <SourceBadge source={item.source} />
            <ImpactBadge impact={item.impact} />
            <SentimentBadge sentiment={item.sentiment} />
            <span className="terminal-chip text-phosphor-dim">
              ⟢ {timeAgo(item.publishedAt)}
            </span>
          </div>

          <h1 className="font-sans text-2xl sm:text-3xl font-bold leading-tight tracking-tight mb-4 [text-wrap:balance]">
            {item.title}
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed mb-5">
            {item.summary}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.themes.map((t) => (
              <span key={t} className="terminal-chip !text-phosphor-dim !border-phosphor-dim/30">
                {THEME_LABELS[t]}
              </span>
            ))}
            {item.regions.map((r) => (
              <span key={r} className="terminal-chip !text-cyan !border-cyan/30">
                {r}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
            <div className="font-mono text-xs text-muted-foreground">
              {formatTimestamp(item.publishedAt)}
            </div>
            <RelevanceBar score={item.relevanceScore} />
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-cyan hover:text-phosphor transition-colors"
              >
                sursa originală <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </header>

        {/* AI ANALYSIS */}
        {analysisLoading && <AnalysisSkeleton />}

        {analysisError && (
          <div className="terminal-card p-6 border-impact-high/40">
            <div className="flex items-center gap-2 font-mono text-xs text-impact-high mb-2">
              <AlertCircle className="h-4 w-4" /> // analysis_error
            </div>
            <p className="text-sm text-muted-foreground">{analysisError}</p>
          </div>
        )}

        {analysis && (
          <>
            <Section index="01" title="Pe înțelesul tuturor">
              <ProseBlock text={analysis.summarySimple} />
            </Section>

            <Section index="02" title="De ce este importantă">
              <ProseBlock text={analysis.whyItMatters} />
            </Section>

            <Section index="03" title="Impact asupra pieței de capital">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-sm border border-amber/30 bg-amber/5 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-amber mb-2">
                    ◆ termen scurt
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {analysis.shortTermImpact}
                  </p>
                </div>
                <div className="rounded-sm border border-cyan/30 bg-cyan/5 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-cyan mb-2">
                    ◆ termen mediu
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {analysis.mediumTermImpact}
                  </p>
                </div>
              </div>
            </Section>

            <Section index="04" title="Piețe financiare afectate">
              <ProseBlock text={analysis.affectedMarkets} />
              {item.markets.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {item.markets.map((m) => (
                    <span key={m} className="terminal-chip !text-phosphor !border-phosphor/40">
                      {m}
                    </span>
                  ))}
                  {item.sectors?.map((s) => (
                    <span key={s} className="terminal-chip">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </Section>

            <Section index="05" title="Ce să urmărești mai departe">
              <ul className="space-y-2.5">
                {analysis.watchPoints.map((wp, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="font-mono text-phosphor flex-shrink-0 tabular-nums">
                      {String(i + 1).padStart(2, "0")} ▸
                    </span>
                    <span className="text-foreground/90">{wp}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* BOTTOM LINE */}
            <section className="terminal-card p-6 sm:p-7 border-phosphor/40 fade-up">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-phosphor">
                  ▸ bottom line · esențialul
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-phosphor/40 to-transparent" />
              </div>
              <ul className="space-y-2.5">
                {analysis.bottomLine.map((b, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="text-phosphor flex-shrink-0 mt-0.5">▊</span>
                    <span className="text-foreground">{b}</span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        <footer className="pt-6 pb-4 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          analiză generată AI · pentru scop educativ · nu constituie sfat investițional
        </footer>
      </main>
    </div>
  );
}

function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="terminal-card p-6 sm:p-7 fade-up">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="font-mono text-xs text-phosphor tabular-nums glow-text-phosphor">
          {index}
        </span>
        <h2 className="font-mono text-sm uppercase tracking-[0.15em] text-foreground">
          {title}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      </div>
      <div className="prose-terminal">{children}</div>
    </section>
  );
}

function ProseBlock({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\n+/).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  );
}

function AnalysisSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="terminal-card p-6 animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 w-8 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-muted rounded" />
            <div className="h-3 w-5/6 bg-muted rounded" />
            <div className="h-3 w-4/6 bg-muted rounded" />
          </div>
          <div className="mt-3 font-mono text-[10px] text-phosphor-dim">
            ⟢ analiză AI în curs<span className="blink-cursor" />
          </div>
        </div>
      ))}
    </div>
  );
}
