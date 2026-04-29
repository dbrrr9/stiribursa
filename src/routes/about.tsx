import { createFileRoute, Link } from "@tanstack/react-router";
import { TerminalHeader } from "@/components/terminal/header";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Despre — MarketScope" },
      { name: "description", content: "Cum funcționează terminalul de știri financiare." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="terminal-root min-h-screen">
      <TerminalHeader />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 space-y-6">
        <h1 className="font-mono text-2xl text-phosphor glow-text-phosphor">// despre_marketscope</h1>
        <div className="terminal-card p-6 prose-terminal">
          <p>
            <strong>MarketScope</strong> este un terminal financiar editorial care agregă cele
            mai relevante știri din <strong>Reuters</strong>, <strong>Bloomberg</strong> și{" "}
            <strong>Yahoo Finance</strong>, le filtrează prin lentila pieței de capital și le
            transformă în analize clare în limba română.
          </p>
          <p>
            Fiecare știre primește un scor de relevanță, un nivel de impact estimat și o etichetă
            de sentiment. La click, generăm o analiză structurată: explicația simplă, de ce
            contează, impact pe termen scurt și mediu, piețe afectate, ce să urmărești și un
            bottom line de 3-5 puncte.
          </p>
          <p className="text-sm text-muted-foreground">
            Conținutul are scop educativ și nu constituie sfat investițional.
          </p>
        </div>
        <Link to="/" className="font-mono text-xs uppercase tracking-wider text-cyan hover:text-phosphor">
          ▸ înapoi la feed
        </Link>
      </main>
    </div>
  );
}
