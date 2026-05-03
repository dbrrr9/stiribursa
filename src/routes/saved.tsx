import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Bookmark, Trash2, ExternalLink, Clock } from "lucide-react";
import { TerminalHeader } from "@/components/terminal/header";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { timeAgo } from "@/components/terminal/clock";

interface SavedArticle {
  id: string;
  article_id: string;
  article_title: string;
  article_source: string | null;
  article_summary: string | null;
  saved_at: string;
}

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Articole Salvate — MarketScope" },
      { name: "description", content: "Articolele tale salvate pe MarketScope." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from("saved_articles")
      .select("*")
      .eq("user_id", user.id)
      .order("saved_at", { ascending: false })
      .then(({ data }) => {
        setItems((data as SavedArticle[]) || []);
        setLoading(false);
      });
  }, [user]);

  const handleRemove = async (id: string) => {
    await supabase.from("saved_articles").delete().eq("id", id);
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

        <div className="flex items-center gap-3">
          <Bookmark className="h-5 w-5 text-teal" />
          <h1 className="text-2xl font-bold text-foreground">Articole Salvate</h1>
        </div>

        {!user ? (
          <div className="ms-card p-8 text-center">
            <p className="text-muted-foreground mb-4">Trebuie să fii conectat pentru a vedea articolele salvate.</p>
            <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Conectare
            </Link>
          </div>
        ) : loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="ms-card p-5 animate-pulse"><div className="h-4 w-3/4 bg-muted rounded mb-2" /><div className="h-3 w-1/2 bg-muted rounded" /></div>)}
          </div>
        ) : items.length === 0 ? (
          <div className="ms-card p-8 text-center">
            <Bookmark className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-foreground font-semibold mb-1">Niciun articol salvat</p>
            <p className="text-sm text-muted-foreground">Apasă iconița de bookmark pe orice știre pentru a o salva aici.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="ms-card p-5 flex gap-4">
                <div className="flex-1 min-w-0">
                  <Link to="/article/$id" params={{ id: item.article_id }} className="text-base font-semibold text-foreground hover:text-teal transition-colors line-clamp-2">
                    {item.article_title}
                  </Link>
                  {item.article_summary && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.article_summary}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    {item.article_source && <span className="ms-chip">{item.article_source}</span>}
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Salvat {timeAgo(item.saved_at)}</span>
                  </div>
                </div>
                <button onClick={() => handleRemove(item.id)} className="text-muted-foreground hover:text-sentiment-negative transition-colors flex-shrink-0 self-start p-1">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
