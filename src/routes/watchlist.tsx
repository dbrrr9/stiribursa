import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Eye, Plus, Trash2, X } from "lucide-react";
import { TerminalHeader } from "@/components/terminal/header";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

interface WatchlistItem {
  id: string;
  label: string;
  type: string;
  keywords: string[];
  created_at: string;
}

export const Route = createFileRoute("/watchlist")({
  head: () => ({
    meta: [
      { title: "Watchlist — MarketScope" },
      { name: "description", content: "Watchlist-ul tău de teme și ticker-e pe MarketScope." },
    ],
  }),
  component: WatchlistPage,
});

function WatchlistPage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [label, setLabel] = useState("");
  const [type, setType] = useState("ticker");
  const [keywords, setKeywords] = useState("");

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase.from("watchlist").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => { setItems((data as WatchlistItem[]) || []); setLoading(false); })
      .catch((e) => { console.error(e); setLoading(false); });
  }, [user]);

  const handleAdd = async () => {
    if (!user || !label.trim()) return;
    const kw = keywords.split(",").map((k) => k.trim()).filter(Boolean);
    const { data, error } = await supabase.from("watchlist").insert({
      user_id: user.id, label: label.trim(), type, keywords: kw,
    }).select().single();
    if (data) setItems((prev) => [data as WatchlistItem, ...prev]);
    setLabel(""); setKeywords(""); setShowAdd(false);
  };

  const handleRemove = async (id: string) => {
    await supabase.from("watchlist").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Înapoi la feed
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-teal" />
            <h1 className="text-2xl font-bold text-foreground">Watchlist</h1>
          </div>
          {user && (
            <button onClick={() => setShowAdd(!showAdd)} className="text-sm font-medium px-3 py-1.5 rounded-lg bg-teal text-white hover:bg-teal/90 transition-colors flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Adaugă
            </button>
          )}
        </div>

        {!user ? (
          <div className="ms-card p-8 text-center">
            <p className="text-muted-foreground mb-4">Trebuie să fii conectat pentru a folosi watchlist-ul.</p>
            <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Conectare</Link>
          </div>
        ) : (
          <>
            {showAdd && (
              <div className="ms-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Adaugă în watchlist</h3>
                  <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                </div>
                <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="ex: AAPL, Fed Rate Decision, Inflație" className="ms-input w-full px-3 py-2 text-sm" />
                <div className="flex gap-2">
                  {["ticker", "tema", "keyword"].map((t) => (
                    <button key={t} onClick={() => setType(t)} className={`ms-chip cursor-pointer border ${type === t ? "text-teal bg-teal/8 border-teal/30" : "border-transparent"}`}>
                      {t === "ticker" ? "Ticker" : t === "tema" ? "Temă" : "Keyword"}
                    </button>
                  ))}
                </div>
                <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Keywords (opțional, separate prin virgulă)" className="ms-input w-full px-3 py-2 text-sm" />
                <button onClick={handleAdd} className="text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Salvează</button>
              </div>
            )}

            {loading ? (
              <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="ms-card p-5 animate-pulse"><div className="h-4 w-1/3 bg-muted rounded" /></div>)}</div>
            ) : items.length === 0 ? (
              <div className="ms-card p-8 text-center">
                <Eye className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-foreground font-semibold mb-1">Watchlist gol</p>
                <p className="text-sm text-muted-foreground">Adaugă ticker-e, teme sau keywords pe care vrei să le urmărești.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="ms-card p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-foreground">{item.label}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="ms-chip">{item.type}</span>
                        {item.keywords.map((k) => <span key={k} className="ms-chip text-teal bg-teal/8">{k}</span>)}
                      </div>
                    </div>
                    <button onClick={() => handleRemove(item.id)} className="text-muted-foreground hover:text-sentiment-negative transition-colors p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
