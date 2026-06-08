import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { TerminalHeader } from "@/components/terminal/header";
import { getCatalystCalendar } from "@/lib/news.functions";
import type { CatalystEvent } from "@/lib/news.functions";
import { CalendarDays, Loader2, AlertCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Catalyst Calendar — MarketScope" },
      { name: "description", content: "Calendarul catalizatorilor de piață — earnings, date economice, FOMC." },
    ],
  }),
  component: CalendarPage,
});

const CATEGORY_LABELS: Record<string, string> = {
  earnings: "Earnings",
  economic: "Economic",
  "central-bank": "Bănci Centrale",
  geopolitical: "Geopolitică",
  ipo: "IPO",
  other: "Altele",
};

const CATEGORY_COLORS: Record<string, string> = {
  earnings: "bg-teal/10 text-teal border-teal/20",
  economic: "bg-navy/10 text-navy border-navy/20",
  "central-bank": "bg-impact-high/10 text-impact-high border-impact-high/20",
  geopolitical: "bg-impact-medium/10 text-impact-medium border-impact-medium/20",
  ipo: "bg-sentiment-positive/10 text-sentiment-positive border-sentiment-positive/20",
  other: "bg-muted text-muted-foreground border-border",
};

function CalendarPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["catalyst-calendar"],
    queryFn: () => getCatalystCalendar(),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const events = data?.events ?? [];

  // Group by date
  const grouped = events.reduce<Record<string, CatalystEvent[]>>((acc, ev) => {
    const d = ev.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(ev);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        <div className="fade-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="ms-section-label text-teal">Catalyst Calendar</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
            Calendarul <span className="text-teal">Catalizatorilor</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Catalizatorii următoarelor ~30 de zile — earnings majore, date economice (CPI, PCE, NFP, GDP), decizii ale băncilor centrale, evenimente geopolitice și IPO-uri importante, fiecare cu explicații despre impactul potențial asupra piețelor.
          </p>
        </div>

        {isLoading && (
          <div className="ms-card p-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-teal mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Generez calendarul...</p>
          </div>
        )}

        {data?.error && (
          <div className="ms-card p-5 border-impact-medium/20">
            <div className="flex items-center gap-2 text-sm text-impact-medium">
              <AlertCircle className="h-4 w-4" /> {data.error}
            </div>
          </div>
        )}

        {sortedDates.map((date) => {
          const dayEvents = grouped[date];
          const d = new Date(date + "T12:00:00");
          const isToday = new Date().toISOString().split("T")[0] === date;
          const dayLabel = d.toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long" });

          return (
            <section key={date} className="fade-up">
              <div className="flex items-center gap-3 mb-3">
                <CalendarDays className="h-4 w-4 text-teal" />
                <h2 className="text-sm font-semibold text-foreground capitalize">{dayLabel}</h2>
                {isToday && <span className="ms-chip text-teal bg-teal/8">Azi</span>}
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="space-y-2">
                {dayEvents.map((ev) => (
                  <div key={ev.id} className="ms-card p-4 flex gap-4">
                    <div className="flex flex-col items-center gap-1 flex-shrink-0 w-12">
                      <span className={cn(
                        "w-3 h-3 rounded-full",
                        ev.impact === "high" ? "bg-impact-high" : ev.impact === "medium" ? "bg-impact-medium" : "bg-impact-low"
                      )} />
                      {ev.time && <span className="text-[10px] font-mono text-muted-foreground">{ev.time}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className={cn("ms-chip border", CATEGORY_COLORS[ev.category] ?? CATEGORY_COLORS.other)}>
                          {CATEGORY_LABELS[ev.category] ?? ev.category}
                        </span>
                        {ev.impact === "high" && (
                          <span className="ms-chip text-impact-high bg-impact-high/8 border border-impact-high/20">
                            <Zap className="h-2.5 w-2.5" /> High Impact
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-foreground mb-0.5">{ev.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{ev.description}</p>

                      {ev.whyItMatters && (
                        <div className="mt-2 rounded-md border border-border/60 bg-muted/30 px-3 py-2">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-teal mb-0.5">De ce contează</p>
                          <p className="text-xs text-foreground/80 leading-relaxed">{ev.whyItMatters}</p>
                        </div>
                      )}

                      {ev.expectation && (
                        <p className="text-[11px] text-muted-foreground mt-1.5">
                          <span className="font-medium text-foreground/70">Așteptări:</span> {ev.expectation}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1 mt-2">
                        {ev.tickers?.map((t) => (
                          <span key={t} className="ms-chip font-mono text-navy bg-navy/8">{t}</span>
                        ))}
                        {ev.regions.map((r) => (
                          <span key={r} className="ms-chip text-navy/70 bg-navy/5">{r}</span>
                        ))}
                        {ev.affectedMarkets.map((m) => (
                          <span key={m} className="ms-chip text-teal bg-teal/8">{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <div className="text-center text-[11px] text-muted-foreground pt-4">
          Calendar generat AI · <Link to="/" className="text-teal hover:underline">← Înapoi la feed</Link>
        </div>
      </main>
    </div>
  );
}
