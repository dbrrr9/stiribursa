import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { T as TerminalHeader } from "./header-DypyDOR3.mjs";
import { u as useAuth, s as supabase } from "./router-BFjZgRb5.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowLeft, E as Eye, P as Plus, X, T as Trash2 } from "../_libs/lucide-react.mjs";
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
function WatchlistPage() {
  const {
    user,
    loading: authLoading
  } = useAuth();
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [label, setLabel] = reactExports.useState("");
  const [type, setType] = reactExports.useState("ticker");
  const [keywords, setKeywords] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    supabase.from("watchlist").select("*").eq("user_id", user.id).order("created_at", {
      ascending: false
    }).then(({
      data
    }) => {
      setItems(data || []);
      setLoading(false);
    }).catch((e) => {
      console.error(e);
      setLoading(false);
    });
  }, [user]);
  const handleAdd = async () => {
    if (!user || !label.trim()) return;
    const kw = keywords.split(",").map((k) => k.trim()).filter(Boolean);
    const {
      data,
      error
    } = await supabase.from("watchlist").insert({
      user_id: user.id,
      label: label.trim(),
      type,
      keywords: kw
    }).select().single();
    if (data) setItems((prev) => [data, ...prev]);
    setLabel("");
    setKeywords("");
    setShowAdd(false);
  };
  const handleRemove = async (id) => {
    await supabase.from("watchlist").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-5 w-5 text-teal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Watchlist" })
        ] }),
        user && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowAdd(!showAdd), className: "text-sm font-medium px-3 py-1.5 rounded-lg bg-teal text-white hover:bg-teal/90 transition-colors flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
          " Adaugă"
        ] })
      ] }),
      !user ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "Trebuie să fii conectat pentru a folosi watchlist-ul." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors", children: "Conectare" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        showAdd && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-5 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Adaugă în watchlist" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowAdd(false), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: label, onChange: (e) => setLabel(e.target.value), placeholder: "ex: AAPL, Fed Rate Decision, Inflație", className: "ms-input w-full px-3 py-2 text-sm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["ticker", "tema", "keyword"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setType(t), className: `ms-chip cursor-pointer border ${type === t ? "text-teal bg-teal/8 border-teal/30" : "border-transparent"}`, children: t === "ticker" ? "Ticker" : t === "tema" ? "Temă" : "Keyword" }, t)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: keywords, onChange: (e) => setKeywords(e.target.value), placeholder: "Keywords (opțional, separate prin virgulă)", className: "ms-input w-full px-3 py-2 text-sm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleAdd, className: "text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors", children: "Salvează" })
        ] }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ms-card p-5 animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-1/3 bg-muted rounded" }) }, i)) }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-8 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-8 w-8 text-muted-foreground/30 mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-semibold mb-1", children: "Watchlist gol" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Adaugă ticker-e, teme sau keywords pe care vrei să le urmărești." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-4 flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground", children: item.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-chip", children: item.type }),
              item.keywords.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-chip text-teal bg-teal/8", children: k }, k))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleRemove(item.id), className: "text-muted-foreground hover:text-sentiment-negative transition-colors p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] }, item.id)) })
      ] })
    ] })
  ] });
}
export {
  WatchlistPage as component
};
