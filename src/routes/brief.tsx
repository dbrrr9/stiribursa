import { createFileRoute } from "@tanstack/react-router";
import { getDailyBrief } from "../lib/news.functions";
import { useQuery } from "@tanstack/react-query";
import { Loader2, TrendingUp, TrendingDown, AlertTriangle, Globe2, BarChart3, LineChart, ShieldAlert, Zap } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TerminalHeader } from "@/components/terminal/header";

export const Route = createFileRoute("/brief")({
  component: BriefPage,
});

function MetricGroup({ title, items, isYield = false }: { title: string; items?: any[]; isYield?: boolean }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex flex-col h-full bg-card/40 backdrop-blur-md rounded-2xl border border-border/50 p-4 transition-colors hover:bg-card/60">
      <h3 className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.15em] mb-4 border-b border-border/40 pb-2">{title}</h3>
      <div className="space-y-3">
        {items.map((item, i) => {
          const isNegative = item.change?.includes('-');
          const TrendIcon = isNegative ? TrendingDown : TrendingUp;
          return (
            <div key={i} className="flex items-center justify-between group cursor-default">
              <span className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors">{item.name}</span>
              <div className="text-right flex items-center gap-2">
                <div className="text-sm font-bold font-mono text-foreground">{item.value}</div>
                {!isYield && item.change && (
                  <div className={`flex items-center gap-1 text-[11px] font-bold font-mono px-1.5 py-0.5 rounded-md ${isNegative ? 'bg-sentiment-negative/10 text-sentiment-negative' : 'bg-sentiment-positive/10 text-sentiment-positive'}`}>
                    <TrendIcon className="w-3 h-3" />
                    {item.change}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BriefPage() {
  const { data: brief, isLoading, isError, error } = useQuery({
    queryKey: ["dailyBrief"],
    queryFn: async () => {
      const res = await getDailyBrief();
      if (res?.error) throw new Error(res.error);
      if (!res?.brief) throw new Error("No data returned");
      return res.brief;
    },
    staleTime: 1000 * 60 * 30, // 30 mins
  });

  if (isLoading) {
    return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal/5 rounded-full blur-[120px] pointer-events-none" />
      <TerminalHeader />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="ms-card p-12 text-center fade-up relative overflow-hidden max-w-md w-full border-teal/20 bg-background/60 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-teal/10 via-transparent to-transparent pointer-events-none" />
          <Loader2 className="h-10 w-10 animate-spin text-teal mx-auto mb-6 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
          <h2 className="text-xl font-bold text-foreground mb-2">Redactez Market Brief...</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Asamblez datele live și generez analiza instituțională prin GPT-4o-mini. Te rog așteaptă ~10 secunde.</p>
        </div>
      </main>
    </div>
    );
  }

  if (isError || !brief) {
    return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <div className="ms-card p-12 text-center mt-8 border-destructive/20 bg-destructive/5">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-2">Eroare la generare</h2>
          <p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : "Eroare necunoscută."}</p>
        </div>
      </main>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-teal/30 selection:text-teal-foreground">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-1/2 h-96 bg-teal/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <TerminalHeader />
      
      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="fade-up max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-teal/10 text-teal text-xs font-bold tracking-widest uppercase border border-teal/20">
              Daily Desk Briefing
            </span>
            <span className="text-xs text-muted-foreground tabular-nums font-mono">
              {new Date(brief.generatedAt).toLocaleString("ro-RO", { dateStyle: 'long', timeStyle: 'short' })}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
            {brief.headline}
          </h1>
        </div>

        {/* SNAPSHOT & BULLETS */}
        <div className="fade-up delay-100">
          <div className="ms-card p-6 sm:p-8 bg-card/60 backdrop-blur-xl border-border/60 shadow-2xl shadow-black/5">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase text-muted-foreground tracking-[0.2em] mb-6">
              <Zap className="w-4 h-4 text-teal" /> 
              Rezumat Executiv
            </h2>
            
            <ul className="grid sm:grid-cols-2 gap-4 mb-8 text-sm sm:text-base text-foreground/80">
              {brief.snapshot?.bullets?.map((b, i) => (
                <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/30">
                   <div className="w-1.5 h-1.5 rounded-full bg-teal mt-2 shrink-0 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                   <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricGroup title="Indici" items={brief.snapshot?.indices} />
              <MetricGroup title="Valute (FX)" items={brief.snapshot?.fx} />
              <MetricGroup title="Mărfuri" items={brief.snapshot?.commodities} />
              <MetricGroup title="Dobânzi" items={brief.snapshot?.rates} isYield />
            </div>
          </div>
        </div>

        {/* DEEP ANALYSIS SECTIONS */}
        <div className="grid lg:grid-cols-2 gap-8 fade-up delay-200">
          {/* Macro */}
          <div className="ms-card p-6 sm:p-8 space-y-6 flex flex-col hover:border-teal/30 transition-colors duration-500 bg-gradient-to-b from-card to-card/50">
             <div className="flex items-center gap-3 border-b border-border/40 pb-4">
               <div className="p-2 rounded-lg bg-teal/10 text-teal">
                 <Globe2 className="h-5 w-5" />
               </div>
               <h2 className="text-xl font-bold tracking-tight">Macro & Sentiment</h2>
             </div>
             <div className="prose dark:prose-invert prose-teal max-w-none text-foreground/80 leading-loose">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>{brief.macroSentiment?.markdown}</ReactMarkdown>
             </div>
          </div>
          
          {/* Rates & Commodities */}
          <div className="ms-card p-6 sm:p-8 space-y-6 flex flex-col hover:border-teal/30 transition-colors duration-500 bg-gradient-to-b from-card to-card/50">
             <div className="flex items-center gap-3 border-b border-border/40 pb-4">
               <div className="p-2 rounded-lg bg-teal/10 text-teal">
                 <LineChart className="h-5 w-5" />
               </div>
               <h2 className="text-xl font-bold tracking-tight">Rates, FX & Commodities</h2>
             </div>
             <div className="prose dark:prose-invert prose-teal max-w-none text-foreground/80 leading-loose space-y-6">
               <ReactMarkdown remarkPlugins={[remarkGfm]}>{brief.ratesFx?.markdown}</ReactMarkdown>
               <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
               <ReactMarkdown remarkPlugins={[remarkGfm]}>{brief.commoditiesCrypto?.markdown}</ReactMarkdown>
             </div>
          </div>
        </div>

        {/* EQUITIES & KEY STOCKS */}
        <div className="fade-up delay-300">
          <div className="ms-card p-6 sm:p-8 space-y-8 bg-card/80 backdrop-blur-xl">
             <div className="flex items-center gap-3 border-b border-border/40 pb-4">
               <div className="p-2 rounded-lg bg-teal/10 text-teal">
                 <BarChart3 className="h-5 w-5" />
               </div>
               <h2 className="text-xl font-bold tracking-tight">Equity Markets</h2>
             </div>
             
             <div className="grid lg:grid-cols-5 gap-8">
               <div className="lg:col-span-3 prose dark:prose-invert prose-teal max-w-none text-foreground/80 leading-loose">
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>{brief.equities?.markdown}</ReactMarkdown>
               </div>
               
               <div className="lg:col-span-2">
                 <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-[0.2em] mb-4">Key Movers</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {brief.equities?.keyStocks?.map((stock, i) => {
                      const isNegative = stock.move.includes('-');
                      return (
                        <div key={i} className="group relative flex flex-col p-4 rounded-xl bg-background border border-border hover:border-teal/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
                          <div className={`absolute top-0 right-0 w-16 h-16 opacity-10 rounded-bl-full \${isNegative ? 'bg-sentiment-negative' : 'bg-sentiment-positive'} transition-transform group-hover:scale-150`} />
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-extrabold text-foreground text-sm tracking-tight">{stock.symbol}</span>
                            <span className={`text-xs font-bold font-mono px-2 py-1 rounded-md ${isNegative ? 'bg-sentiment-negative/10 text-sentiment-negative' : 'bg-sentiment-positive/10 text-sentiment-positive'}`}>{stock.move}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground font-medium leading-snug">{stock.trigger}</p>
                        </div>
                      )
                    })}
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* TOP NEWS MASONRY */}
        <div className="fade-up delay-400 pt-4">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-teal">Catalizatori Major</span>
            <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </div>
          
          <div className="columns-1 xl:columns-2 gap-6 space-y-6">
            {brief.topNews?.map((news, i) => (
              <div key={i} className="break-inside-avoid border border-border/60 rounded-2xl overflow-hidden bg-card/40 backdrop-blur-sm hover:border-teal/30 transition-colors duration-300">
                <div className="p-5 sm:p-6 bg-muted/10 border-b border-border/40">
                  <h3 className="font-bold text-foreground text-lg sm:text-xl leading-tight">{news.title}</h3>
                </div>
                <div className="p-5 sm:p-6 space-y-6">
                  <div className="prose dark:prose-invert prose-sm prose-teal max-w-none text-foreground/80 leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{news.markdown}</ReactMarkdown>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-sentiment-positive/5 border border-sentiment-positive/10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-8 h-8 bg-sentiment-positive/10 rounded-bl-full" />
                      <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-sentiment-positive uppercase tracking-[0.15em] mb-2">
                        <TrendingUp className="w-3 h-3" /> Bull Case
                      </span>
                      <p className="text-xs text-foreground/80 font-medium leading-relaxed">{news.bullishScenario}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-sentiment-negative/5 border border-sentiment-negative/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-8 h-8 bg-sentiment-negative/10 rounded-bl-full" />
                      <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-sentiment-negative uppercase tracking-[0.15em] mb-2">
                        <TrendingDown className="w-3 h-3" /> Bear Case
                      </span>
                      <p className="text-xs text-foreground/80 font-medium leading-relaxed">{news.bearishScenario}</p>
                    </div>
                  </div>
                  
                  {news.affectedInstruments && news.affectedInstruments.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mr-1">Impact:</span>
                      {news.affectedInstruments.map((inst, j) => (
                        <span key={j} className="px-2.5 py-1 bg-background text-foreground text-[10px] font-bold font-mono rounded-md border border-border/60 hover:border-teal/50 transition-colors cursor-default">
                          {inst}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RISK & RETAIL */}
        <div className="grid lg:grid-cols-3 gap-6 fade-up delay-500 pt-4">
          <div className="ms-card p-6 sm:p-8 lg:col-span-1 bg-gradient-to-br from-card to-card/40">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase text-muted-foreground tracking-[0.2em] mb-6">
              <ShieldAlert className="w-4 h-4 text-teal" /> Retail Impact
            </h2>
            <div className="space-y-3">
              {brief.retailImpact?.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal mt-1.5 shrink-0 opacity-70" />
                  <span className="text-sm text-foreground/80 font-medium leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="ms-card p-6 sm:p-8 lg:col-span-2 bg-gradient-to-br from-card to-card/40">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase text-muted-foreground tracking-[0.2em] mb-6">
              <AlertTriangle className="w-4 h-4 text-destructive" /> Risk Scenarios
            </h2>
            <div className="prose dark:prose-invert prose-teal max-w-none text-foreground/80 leading-loose p-6 rounded-xl bg-background/30 border border-border/40">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{brief.riskScenarios?.markdown}</ReactMarkdown>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
