import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { TrendingUp, Lock, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Resetare parolă — MarketScope" },
      { name: "description", content: "Setează o parolă nouă pentru contul tău MarketScope." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [hasRecoveryToken, setHasRecoveryToken] = useState(false);

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash && (hash.includes("type=recovery") || hash.includes("access_token"))) {
      setHasRecoveryToken(true);
    }

    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setHasRecoveryToken(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Parola trebuie să aibă cel puțin 6 caractere.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Parolele nu se potrivesc.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate({ to: "/" }), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Eroare la resetarea parolei.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm space-y-6">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Înapoi la conectare
        </Link>

        <div className="ms-card p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          {success ? (
            <div className="text-center space-y-3">
              <CheckCircle className="h-12 w-12 text-sentiment-positive mx-auto" />
              <h1 className="text-xl font-bold text-foreground">Parolă actualizată!</h1>
              <p className="text-sm text-muted-foreground">Vei fi redirecționat în câteva secunde...</p>
            </div>
          ) : !hasRecoveryToken ? (
            <div className="text-center space-y-3">
              <h1 className="text-xl font-bold text-foreground">Link invalid</h1>
              <p className="text-sm text-muted-foreground">
                Acest link de resetare a expirat sau este invalid. Solicită un nou link de la pagina de conectare.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center text-sm font-medium px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Înapoi la conectare
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-foreground text-center mb-1">Parolă nouă</h1>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Alege o parolă nouă pentru contul tău
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parolă nouă"
                    className="ms-input w-full pl-10 pr-4 py-2.5 text-sm"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmă parola"
                    className="ms-input w-full pl-10 pr-4 py-2.5 text-sm"
                  />
                </div>

                {error && <div className="text-xs text-sentiment-negative font-medium">{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-sm font-medium px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Actualizează parola
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
