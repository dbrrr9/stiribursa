import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { TerminalHeader } from "@/components/terminal/header";
import { getDailyBrief } from "@/lib/news.functions";
import { Newspaper, TrendingUp, Calendar, Eye, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Sentiment } from "@/lib/news-types";

export const Route = createFileRoute("/brief")({
  head: () => ({
    meta: [
      { title: "Daily Brief — MarketScope" },
      { name: "description", content: "Rezumatul zilnic al piețelor financiare generat AI." },
    ],
  }),
  component: BriefPage,
});

function BriefPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["daily-brief"],
    queryFn: () => getDailyBrief(),
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  const brief = data?.brief;

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        <div className="fade-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="ms-section-label text-teal">Daily Brief</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
            Briefing-ul <span className="text-teal">Zilnic</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Rezumat AI al piețelor — ce s-a întâmplat, ce contează, ce urmează.
          </p>
        </div>

        {isLoading && (
          <div className="ms-card p-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-teal mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Generez briefing-ul zilnic...</p>
          </div>
        )}

        {data?.error && (
          <div className="ms-card p-5 border-impact-medium/20">
            <div className="flex items-center gap-2 text-sm text-impact-medium">
              <AlertCircle className="h-4 w-4" /> {data.error}
            </div>
          </div>
        )}

        {brief && (
          <>
            {/* Market Overview */}
            <section className="ms-card p-6 fade-up">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="h-4 w-4 text-teal" />
                <h2 className="text-sm font-semibold uppercase tracking-wide">Piețele Azi</h2>
                <span className="h-px flex-1 bg-border" />
                <span className="text-[11px] text-muted-foreground">
                  {new Date(brief.generatedAt).toLocaleString("ro-RO", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              {brief.marketOverview.split(/\n\n+/).map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-foreground/80 mb-3">{p}</p>
              ))}
            </section>

            {/* Top Themes */}
            <section className="ms-card p-6 fade-up">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-teal" />
                <h2 className="text-sm font-semibold uppercase tracking-wide">Teme Dominante</h2>
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-3">
                {brief.topThemes.map((t, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                    <SentimentDot sentiment={t.sentiment} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-foreground mb-0.5">{t.theme}</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Key Events */}
            {brief.keyEvents.length > 0 && (
              <section className="ms-card p-6 fade-up">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-4 w-4 text-teal" />
                  <h2 className="text-sm font-semibold uppercase tracking-wide">Evenimente Cheie</h2>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div className="space-y-2">
                  {brief.keyEvents.map((ev, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-border">
                      <span className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        ev.impact === "high" ? "bg-impact-high" : ev.impact === "medium" ? "bg-impact-medium" : "bg-impact-low"
                      )} />
                      {ev.time && <span className="text-xs font-mono text-muted-foreground w-16 flex-shrink-0">{ev.time}</span>}
                      <span className="text-sm text-foreground flex-1">{ev.event}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Outlook */}
            <section className="ms-card p-6 border-navy/10 bg-navy/[0.02] fade-up">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-4 w-4 text-navy" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-navy">Perspectivă</h2>
                <span className="h-px flex-1 bg-navy/10" />
              </div>
              {brief.outlook.split(/\n\n+/).map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-foreground/80 mb-3">{p}</p>
              ))}
            </section>

            <div className="text-center text-[11px] text-muted-foreground pt-4">
              Generat AI · Nu constituie sfat investițional · <Link to="/" className="text-teal hover:underline">← Înapoi la feed</Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function SentimentDot({ sentiment }: { sentiment: Sentiment }) {
  const colors = {
    positive: "bg-sentiment-positive",
    negative: "bg-sentiment-negative",
    mixed: "bg-sentiment-mixed",
    uncertain: "bg-muted-foreground",
  };
  return <span className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1", colors[sentiment])} />;
}
