import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ArrowLeft, BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { TerminalHeader } from "@/components/terminal/header";
import { fetchLatestNews } from "@/lib/news.functions";
import { THEME_LABELS, type ThemeTag, type NewsItem } from "@/lib/news-types";
import { NewsCard } from "@/components/terminal/news-card";

export const Route = createFileRoute("/themes")({
  head: () => ({
    meta: [
      { title: "Market Themes — MarketScope" },
      { name: "description", content: "Explorează temele principale ale pieței: acțiuni, macro, earnings, crypto și altele." },
    ],
  }),
  component: ThemesPage,
});

const THEME_ICONS: Record<string, string> = {
  actiuni: "📈", obligatiuni: "📊", indici: "📉", forex: "💱",
  marfuri: "🛢️", crypto: "₿", macro: "🏛️", earnings: "💰",
  "banci-centrale": "🏦", geopolitica: "🌍",
};

function ThemesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: () => fetchLatestNews(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const items = data?.items ?? [];

  const themeStats = useMemo(() => {
    const stats: Record<ThemeTag, { count: number; highImpact: number; sentiment: { pos: number; neg: number; mix: number }; items: NewsItem[] }> = {} as never;

    const allThemes: ThemeTag[] = ["actiuni", "obligatiuni", "indici", "forex", "marfuri", "crypto", "macro", "earnings", "banci-centrale", "geopolitica"];
    for (const t of allThemes) {
      stats[t] = { count: 0, highImpact: 0, sentiment: { pos: 0, neg: 0, mix: 0 }, items: [] };
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

    return Object.entries(stats)
      .map(([key, val]) => ({ theme: key as ThemeTag, ...val }))
      .sort((a, b) => b.count - a.count);
  }, [items]);

  const dominantSentiment = (s: { pos: number; neg: number; mix: number }) => {
    if (s.pos > s.neg && s.pos > s.mix) return "positive";
    if (s.neg > s.pos && s.neg > s.mix) return "negative";
    return "mixed";
  };

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Înapoi la feed
        </Link>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-5 w-5 text-teal" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Market Themes</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Explorează temele principale ale pieței. Fiecare temă arată câte știri sunt active, impactul predominant și sentimentul general.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="ms-card p-5 animate-pulse">
                <div className="h-6 w-1/3 bg-muted rounded mb-3" />
                <div className="h-4 w-1/2 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {themeStats.map(({ theme, count, highImpact, sentiment, items: themeItems }) => {
              const dom = dominantSentiment(sentiment);
              return (
                <div key={theme} className="ms-card p-5 space-y-3 fade-up">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{THEME_ICONS[theme] || "📰"}</span>
                      <h3 className="font-semibold text-foreground">{THEME_LABELS[theme]}</h3>
                    </div>
                    <span className="ms-chip text-teal bg-teal/8 font-semibold">{count}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      {dom === "positive" ? <TrendingUp className="h-3.5 w-3.5 text-sentiment-positive" /> :
                       dom === "negative" ? <TrendingDown className="h-3.5 w-3.5 text-sentiment-negative" /> :
                       <Minus className="h-3.5 w-3.5 text-sentiment-mixed" />}
                      <span className={dom === "positive" ? "text-sentiment-positive" : dom === "negative" ? "text-sentiment-negative" : "text-sentiment-mixed"}>
                        {dom === "positive" ? "Pozitiv" : dom === "negative" ? "Negativ" : "Mixt"}
                      </span>
                    </div>
                    {highImpact > 0 && (
                      <span className="text-impact-high font-medium">{highImpact} high impact</span>
                    )}
                  </div>

                  {/* Sentiment bar */}
                  {count > 0 && (
                    <div className="flex h-1.5 rounded-full overflow-hidden bg-muted">
                      {sentiment.pos > 0 && <div className="bg-sentiment-positive" style={{ width: `${(sentiment.pos / count) * 100}%` }} />}
                      {sentiment.mix > 0 && <div className="bg-sentiment-mixed" style={{ width: `${(sentiment.mix / count) * 100}%` }} />}
                      {sentiment.neg > 0 && <div className="bg-sentiment-negative" style={{ width: `${(sentiment.neg / count) * 100}%` }} />}
                    </div>
                  )}

                  {/* Top story preview */}
                  {themeItems[0] && (
                    <Link to="/article/$id" params={{ id: themeItems[0].id }}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors line-clamp-2 pt-2 border-t border-border">
                      {themeItems[0].title}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
