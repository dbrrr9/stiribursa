import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { T as TerminalHeader } from "./header-DypyDOR3.mjs";
import { u as useAuth, s as supabase } from "./router-BFjZgRb5.mjs";
import { T as THEME_LABELS } from "./news-types-p-W0UZ89.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowLeft, l as Bell, P as Plus, X, m as ToggleRight, n as ToggleLeft, T as Trash2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__zod-adapter.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const THEMES = ["actiuni", "obligatiuni", "indici", "forex", "marfuri", "crypto", "macro", "earnings", "banci-centrale", "geopolitica"];
function AlertsPage() {
  const {
    user,
    loading: authLoading
  } = useAuth();
  const [alerts, setAlerts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("");
  const [selectedThemes, setSelectedThemes] = reactExports.useState([]);
  const [impactLevel, setImpactLevel] = reactExports.useState("high");
  const [keyword, setKeyword] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    supabase.from("alerts").select("*").eq("user_id", user.id).order("created_at", {
      ascending: false
    }).then(({
      data
    }) => {
      setAlerts(data || []);
      setLoading(false);
    }).catch((e) => {
      console.error(e);
      setLoading(false);
    });
  }, [user]);
  const handleAdd = async () => {
    if (!user || !name.trim()) return;
    const condition = {};
    if (selectedThemes.length) condition.themes = selectedThemes;
    if (impactLevel) condition.minImpact = impactLevel;
    if (keyword.trim()) condition.keyword = keyword.trim();
    const row = {
      user_id: user.id,
      name: name.trim(),
      type: "theme",
      condition
    };
    const {
      data
    } = await supabase.from("alerts").insert(row).select().single();
    if (data) setAlerts((prev) => [data, ...prev]);
    setName("");
    setSelectedThemes([]);
    setKeyword("");
    setShowAdd(false);
  };
  const toggleEnabled = async (id, current) => {
    await supabase.from("alerts").update({
      enabled: !current
    }).eq("id", id);
    setAlerts((prev) => prev.map((a) => a.id === id ? {
      ...a,
      enabled: !current
    } : a));
  };
  const handleRemove = async (id) => {
    await supabase.from("alerts").delete().eq("id", id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };
  if (authLoading) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TerminalHeader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-3xl px-4 sm:px-6 py-6 sm:py-10 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
        " Înapoi la feed"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-teal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Alerte" })
        ] }),
        user && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowAdd(!showAdd), className: "text-sm font-medium px-3 py-1.5 rounded-lg bg-teal text-white hover:bg-teal/90 transition-colors flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
          " Alertă nouă"
        ] })
      ] }),
      !user ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "Trebuie să fii conectat pentru a configura alerte." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors", children: "Conectare" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        showAdd && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-5 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Alertă nouă" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowAdd(false), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Nume alertă (ex: Fed News, Earnings Season)", className: "ms-input w-full px-3 py-2 text-sm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "ms-section-label text-xs mb-1.5 block", children: "Teme" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: THEMES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedThemes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]), className: `ms-chip cursor-pointer border ${selectedThemes.includes(t) ? "text-teal bg-teal/8 border-teal/30" : "border-transparent"}`, children: THEME_LABELS[t] }, t)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "ms-section-label text-xs mb-1.5 block", children: "Impact minim" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["high", "medium", "low"].map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setImpactLevel(l), className: `ms-chip cursor-pointer border ${impactLevel === l ? "text-teal bg-teal/8 border-teal/30" : "border-transparent"}`, children: l === "high" ? "High" : l === "medium" ? "Medium" : "Low" }, l)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: keyword, onChange: (e) => setKeyword(e.target.value), placeholder: "Keyword (opțional)", className: "ms-input w-full px-3 py-2 text-sm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleAdd, className: "text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors", children: "Creează alertă" })
        ] }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ms-card p-5 animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-1/3 bg-muted rounded" }) }, i)) }) : alerts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-8 w-8 text-muted-foreground/30 mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-semibold mb-1", children: "Nicio alertă configurată" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Creează alerte pentru a fi notificat când apar știri importante." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: alerts.map((alert) => {
          const cond = alert.condition;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-4 flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-semibold ${alert.enabled ? "text-foreground" : "text-muted-foreground"}`, children: alert.name }),
                !alert.enabled && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-chip text-muted-foreground", children: "Dezactivat" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5 mt-1", children: [
                cond.themes?.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-chip text-teal bg-teal/8", children: THEME_LABELS[t] || t }, t)),
                cond.minImpact && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ms-chip", children: [
                  "≥ ",
                  cond.minImpact
                ] }),
                cond.keyword && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ms-chip", children: [
                  '"',
                  cond.keyword,
                  '"'
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleEnabled(alert.id, alert.enabled), className: "text-muted-foreground hover:text-foreground transition-colors p-1", children: alert.enabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRight, { className: "h-5 w-5 text-teal" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleLeft, { className: "h-5 w-5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleRemove(alert.id), className: "text-muted-foreground hover:text-sentiment-negative transition-colors p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
            ] })
          ] }, alert.id);
        }) })
      ] })
    ] })
  ] });
}
export {
  AlertsPage as component
};
