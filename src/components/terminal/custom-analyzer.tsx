import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Sparkles, AlertTriangle, Link as LinkIcon, FileText } from "lucide-react";
import { analyzeCustomNews } from "@/lib/news.functions";
import type { ArticleAnalysis } from "@/lib/news-types";
import { cn } from "@/lib/utils";

export function CustomAnalyzer() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    analysis: ArticleAnalysis | null;
    title: string;
    sourceLabel: string;
    error?: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: (raw: string) => analyzeCustomNews({ data: { input: raw } }),
    onSuccess: (data) => setResult(data),
  });

  const isUrl = /^https?:\/\/\S+$/i.test(input.trim());
  const charCount = input.length;
  const canSubmit = input.trim().length >= 10 && !mutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setResult(null);
    mutation.mutate(input.trim());
  };

  return (
    <section className="ms-card p-5 sm:p-6 space-y-4 fade-up">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal/8 text-teal">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold">Analizează o știre</span>
        </div>
        <span className="h-px flex-1 bg-border" />
        <span className="text-[11px] text-muted-foreground hidden sm:inline">AI · Română</span>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Lipește un <span className="text-teal font-medium">link</span> sau direct{" "}
        <span className="text-teal font-medium">textul</span> unei știri. AI-ul o explică și analizează impactul pe piețe.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://www.reuters.com/markets/... sau lipește textul știrii"
            rows={3}
            maxLength={8000}
            className={cn(
              "w-full resize-none rounded-lg border bg-muted/30 px-3 py-2.5",
              "text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/40",
              "border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/10",
              "transition-colors",
            )}
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-2 text-[10px] text-muted-foreground">
            {input.trim() && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-card border border-border">
                {isUrl ? <><LinkIcon className="h-2.5 w-2.5" /> URL</> : <><FileText className="h-2.5 w-2.5" /> TEXT</>}
              </span>
            )}
            <span className="tabular-nums">{charCount}/8000</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-muted-foreground">
            {input.trim().length > 0 && input.trim().length < 10 ? "Minim 10 caractere" : "Lipește link sau text pentru analiză AI"}
          </span>
          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              canSubmit
                ? "bg-teal text-white hover:bg-teal/90 shadow-sm"
                : "bg-muted text-muted-foreground cursor-not-allowed",
            )}
          >
            {mutation.isPending ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Analizez...</> : <><Sparkles className="h-3.5 w-3.5" /> Analizează</>}
          </button>
        </div>
      </form>

      {mutation.isPending && (
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-muted rounded animate-pulse" />
          <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
          <div className="h-3 bg-muted rounded animate-pulse w-4/6" />
        </div>
      )}

      {result && result.analysis && (
        <div className="space-y-4 pt-4 border-t border-border">
          {result.error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-impact-medium/5 border border-impact-medium/20 text-impact-medium text-xs">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{result.error}</span>
            </div>
          )}
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{result.sourceLabel}</div>
            <h3 className="text-lg font-bold leading-tight text-foreground">{result.title}</h3>
          </div>
          <AnalysisBlock label="Explicat simplu" body={result.analysis.summarySimple} />
          <AnalysisBlock label="De ce contează" body={result.analysis.whyItMatters} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AnalysisBlock label="Impact termen scurt" body={result.analysis.shortTermImpact} accent="amber" />
            <AnalysisBlock label="Impact termen mediu" body={result.analysis.mediumTermImpact} accent="teal" />
          </div>
          <AnalysisBlock label="Piețe afectate" body={result.analysis.affectedMarkets} />
          {result.analysis.watchPoints.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-teal mb-2">De urmărit</div>
              <ul className="space-y-1.5">
                {result.analysis.watchPoints.map((p, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/90">
                    <span className="text-teal font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.analysis.bottomLine.length > 0 && (
            <div className="rounded-lg bg-navy/[0.03] border border-navy/10 p-4">
              <div className="text-xs font-semibold text-navy mb-2">Bottom Line</div>
              <ul className="space-y-1">
                {result.analysis.bottomLine.map((b, i) => (
                  <li key={i} className="text-sm text-foreground flex gap-2">
                    <span className="text-teal">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {mutation.isError && !result && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-impact-high/5 border border-impact-high/20 text-impact-high text-xs">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>Nu am putut analiza. Verifică linkul sau lipește direct textul știrii.</span>
        </div>
      )}
    </section>
  );
}

function AnalysisBlock({ label, body, accent = "navy" }: { label: string; body: string; accent?: "navy" | "teal" | "amber" }) {
  const colorMap = { navy: "text-navy", teal: "text-teal", amber: "text-impact-medium" };
  return (
    <div>
      <div className={cn("text-xs font-semibold mb-1.5", colorMap[accent])}>{label}</div>
      <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{body}</p>
    </div>
  );
}
