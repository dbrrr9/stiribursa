import { createFileRoute, Link } from "@tanstack/react-router";
import { TerminalHeader } from "@/components/terminal/header";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Despre — MarketScope" },
      { name: "description", content: "Cum funcționează MarketScope — market intelligence platform." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Despre MarketScope</h1>
        <div className="ms-card p-6 prose-finance space-y-4">
          <p>
            <strong>MarketScope</strong> este o platformă de market intelligence care agregă cele
            mai relevante știri din <strong>Reuters</strong>, <strong>Bloomberg</strong>,{" "}
            <strong>Investing.com</strong>, <strong>CNBC</strong>, <strong>MarketWatch</strong> și <strong>Yahoo Finance</strong>,
            le filtrează și le transformă în analize clare în limba română.
          </p>
          <p>
            Fiecare știre primește un scor de relevanță, un nivel de impact estimat, un status
            (breaking, developing, confirmed) și o etichetă de sentiment. La click, generăm o
            analiză structurată: ce s-a întâmplat, de ce contează, impact pe termen scurt și mediu,
            piețe afectate, ce să urmărești și un mini rezumat.
          </p>
          <p className="text-sm text-muted-foreground">
            Conținutul are scop educativ și nu constituie sfat investițional.
          </p>
        </div>
        <Link to="/" className="text-sm font-medium text-teal hover:underline">
          ← Înapoi la feed
        </Link>
      </main>
    </div>
  );
}
