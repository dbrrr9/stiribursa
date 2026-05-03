import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Bell, Plus, Trash2, X, ToggleLeft, ToggleRight } from "lucide-react";
import { TerminalHeader } from "@/components/terminal/header";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { THEME_LABELS, type ThemeTag } from "@/lib/news-types";

interface Alert {
  id: string;
  name: string;
  type: string;
  condition: Record<string, unknown>;
  enabled: boolean;
  created_at: string;
}

const THEMES: ThemeTag[] = ["actiuni", "obligatiuni", "indici", "forex", "marfuri", "crypto", "macro", "earnings", "banci-centrale", "geopolitica"];

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Alerte — MarketScope" },
      { name: "description", content: "Configurează alerte pentru știrile financiare pe MarketScope." },
    ],
  }),
  component: AlertsPage,
});

function AlertsPage() {
  const { user, loading: authLoading } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [selectedThemes, setSelectedThemes] = useState<ThemeTag[]>([]);
  const [impactLevel, setImpactLevel] = useState("high");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase.from("alerts").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => { setAlerts((data as Alert[]) || []); setLoading(false); });
  }, [user]);

  const handleAdd = async () => {
    if (!user || !name.trim()) return;
    const condition: Record<string, unknown> = {};
    if (selectedThemes.length) condition.themes = selectedThemes;
    if (impactLevel) condition.minImpact = impactLevel;
    if (keyword.trim()) condition.keyword = keyword.trim();

    const row = {
      user_id: user.id, name: name.trim(), type: "theme", condition: condition as unknown as import("@/integrations/supabase/types").Json,
    };
    const { data } = await supabase.from("alerts").insert(row).select().single();
    if (data) setAlerts((prev) => [data as Alert, ...prev]);
    setName(""); setSelectedThemes([]); setKeyword(""); setShowAdd(false);
  };

  const toggleEnabled = async (id: string, current: boolean) => {
    await supabase.from("alerts").update({ enabled: !current }).eq("id", id);
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, enabled: !current } : a));
  };

  const handleRemove = async (id: string) => {
    await supabase.from("alerts").delete().eq("id", id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
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
            <Bell className="h-5 w-5 text-teal" />
            <h1 className="text-2xl font-bold text-foreground">Alerte</h1>
          </div>
          {user && (
            <button onClick={() => setShowAdd(!showAdd)} className="text-sm font-medium px-3 py-1.5 rounded-lg bg-teal text-white hover:bg-teal/90 transition-colors flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Alertă nouă
            </button>
          )}
        </div>

        {!user ? (
          <div className="ms-card p-8 text-center">
            <p className="text-muted-foreground mb-4">Trebuie să fii conectat pentru a configura alerte.</p>
            <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Conectare</Link>
          </div>
        ) : (
          <>
            {showAdd && (
              <div className="ms-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Alertă nouă</h3>
                  <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                </div>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nume alertă (ex: Fed News, Earnings Season)" className="ms-input w-full px-3 py-2 text-sm" />
                <div>
                  <label className="ms-section-label text-xs mb-1.5 block">Teme</label>
                  <div className="flex flex-wrap gap-1.5">
                    {THEMES.map((t) => (
                      <button key={t} onClick={() => setSelectedThemes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])}
                        className={`ms-chip cursor-pointer border ${selectedThemes.includes(t) ? "text-teal bg-teal/8 border-teal/30" : "border-transparent"}`}>
                        {THEME_LABELS[t]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="ms-section-label text-xs mb-1.5 block">Impact minim</label>
                  <div className="flex gap-2">
                    {["high", "medium", "low"].map((l) => (
                      <button key={l} onClick={() => setImpactLevel(l)}
                        className={`ms-chip cursor-pointer border ${impactLevel === l ? "text-teal bg-teal/8 border-teal/30" : "border-transparent"}`}>
                        {l === "high" ? "High" : l === "medium" ? "Medium" : "Low"}
                      </button>
                    ))}
                  </div>
                </div>
                <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Keyword (opțional)" className="ms-input w-full px-3 py-2 text-sm" />
                <button onClick={handleAdd} className="text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Creează alertă</button>
              </div>
            )}

            {loading ? (
              <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="ms-card p-5 animate-pulse"><div className="h-4 w-1/3 bg-muted rounded" /></div>)}</div>
            ) : alerts.length === 0 ? (
              <div className="ms-card p-8 text-center">
                <Bell className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-foreground font-semibold mb-1">Nicio alertă configurată</p>
                <p className="text-sm text-muted-foreground">Creează alerte pentru a fi notificat când apar știri importante.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => {
                  const cond = alert.condition as { themes?: string[]; minImpact?: string; keyword?: string };
                  return (
                    <div key={alert.id} className="ms-card p-4 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${alert.enabled ? "text-foreground" : "text-muted-foreground"}`}>{alert.name}</span>
                          {!alert.enabled && <span className="ms-chip text-muted-foreground">Dezactivat</span>}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {cond.themes?.map((t) => <span key={t} className="ms-chip text-teal bg-teal/8">{THEME_LABELS[t as ThemeTag] || t}</span>)}
                          {cond.minImpact && <span className="ms-chip">≥ {cond.minImpact}</span>}
                          {cond.keyword && <span className="ms-chip">"{cond.keyword}"</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleEnabled(alert.id, alert.enabled)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                          {alert.enabled ? <ToggleRight className="h-5 w-5 text-teal" /> : <ToggleLeft className="h-5 w-5" />}
                        </button>
                        <button onClick={() => handleRemove(alert.id)} className="text-muted-foreground hover:text-sentiment-negative transition-colors p-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
