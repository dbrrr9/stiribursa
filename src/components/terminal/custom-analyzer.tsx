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
    <section className="terminal-card p-5 sm:p-6 space-y-4 fade-up">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-sm border border-cyan/40 text-cyan bg-cyan/5">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] font-semibold">
            ANALIZEAZĂ O ȘTIRE
          </span>
        </div>
        <span className="h-px flex-1 bg-gradient-to-r from-cyan/30 to-transparent" />
        <span className="font-mono text-[10px] text-muted-foreground hidden sm:inline">
          AI · ROMÂNĂ
        </span>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        Lipește un <span className="text-cyan font-medium">link</span> către o știre (Reuters,
        Bloomberg, FT, orice publicație) sau direct{" "}
        <span className="text-cyan font-medium">textul</span> ei. AI-ul îți explică în română ce s-a
        întâmplat și ce impact poate avea pe piețe.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://www.reuters.com/markets/...  sau lipește textul știrii aici"
            rows={4}
            maxLength={8000}
            className={cn(
              "w-full resize-none rounded-sm border bg-background/60 px-3 py-2.5",
              "font-mono text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground/60",
              "border-border focus:border-cyan/60 focus:outline-none focus:ring-1 focus:ring-cyan/40",
              "transition-colors",
            )}
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
            {input.trim() && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm border border-border bg-background/80">
                {isUrl ? (
                  <>
                    <LinkIcon className="h-2.5 w-2.5" /> URL
                  </>
                ) : (
                  <>
                    <FileText className="h-2.5 w-2.5" /> TEXT
                  </>
                )}
              </span>
            )}
            <span className="tabular-nums">{charCount}/8000</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] text-muted-foreground">
            {input.trim().length > 0 && input.trim().length < 10
              ? "▸ minim 10 caractere"
              : "▸ ENTER după ce lipești pentru analiză AI"}
          </span>
          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-sm border font-mono text-xs uppercase tracking-wider transition-all",
              canSubmit
                ? "border-cyan/60 text-cyan bg-cyan/10 hover:bg-cyan/20 hover:shadow-[0_0_16px_-4px_hsl(var(--cyan)/0.6)]"
                : "border-border text-muted-foreground/50 cursor-not-allowed",
            )}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                analizez...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                analizează
              </>
            )}
          </button>
        </div>
      </form>

      {/* Loading skeleton */}
      {mutation.isPending && (
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-muted/60 rounded-sm animate-pulse" />
          <div className="h-3 bg-muted/60 rounded-sm animate-pulse w-5/6" />
          <div className="h-3 bg-muted/60 rounded-sm animate-pulse w-4/6" />
        </div>
      )}

      {/* Result */}
      {result && result.analysis && (
        <div className="space-y-4 pt-2 border-t border-border">
          {result.error && (
            <div className="flex items-start gap-2 p-3 rounded-sm border border-amber/40 bg-amber/5 text-amber text-xs">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{result.error}</span>
            </div>
          )}

          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              ▸ {result.sourceLabel}
            </div>
            <h3 className="font-sans text-lg sm:text-xl font-bold leading-tight text-foreground">
              {result.title}
            </h3>
          </div>

          <AnalysisBlock label="EXPLICAT SIMPLU" body={result.analysis.summarySimple} />
          <AnalysisBlock label="DE CE CONTEAZĂ" body={result.analysis.whyItMatters} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AnalysisBlock
              label="IMPACT TERMEN SCURT"
              body={result.analysis.shortTermImpact}
              accent="amber"
            />
            <AnalysisBlock
              label="IMPACT TERMEN MEDIU"
              body={result.analysis.mediumTermImpact}
              accent="cyan"
            />
          </div>

          <AnalysisBlock label="PIEȚE AFECTATE" body={result.analysis.affectedMarkets} />

          {result.analysis.watchPoints.length > 0 && (
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-phosphor mb-2">
                ▸ DE URMĂRIT
              </div>
              <ul className="space-y-1.5">
                {result.analysis.watchPoints.map((p, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground/90">
                    <span className="text-phosphor font-mono">{String(i + 1).padStart(2, "0")}</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.analysis.bottomLine.length > 0 && (
            <div className="rounded-sm border border-phosphor/40 bg-phosphor/5 p-3">
              <div className="font-mono text-[10px] uppercase tracking-wider text-phosphor mb-2">
                ▸ BOTTOM LINE
              </div>
              <ul className="space-y-1">
                {result.analysis.bottomLine.map((b, i) => (
                  <li key={i} className="text-sm text-foreground flex gap-2">
                    <span className="text-phosphor">▪</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {mutation.isError && !result && (
        <div className="flex items-start gap-2 p-3 rounded-sm border border-impact-high/40 bg-impact-high/5 text-impact-high text-xs">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>
            Nu am putut analiza. Verifică linkul sau lipește direct textul știrii.
          </span>
        </div>
      )}
    </section>
  );
}

function AnalysisBlock({
  label,
  body,
  accent = "phosphor",
}: {
  label: string;
  body: string;
  accent?: "phosphor" | "cyan" | "amber";
}) {
  const colorMap = {
    phosphor: "text-phosphor",
    cyan: "text-cyan",
    amber: "text-amber",
  };
  return (
    <div>
      <div
        className={cn(
          "font-mono text-[10px] uppercase tracking-wider mb-1.5",
          colorMap[accent],
        )}
      >
        ▸ {label}
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{body}</p>
    </div>
  );
}
