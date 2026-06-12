import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { T as TerminalHeader, t as timeAgo } from "./header-DypyDOR3.mjs";
import { u as useAuth, s as supabase } from "./router-BFjZgRb5.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowLeft, B as Bookmark, c as Clock, T as Trash2 } from "../_libs/lucide-react.mjs";
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
function SavedPage() {
  const {
    user,
    loading: authLoading
  } = useAuth();
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    supabase.from("saved_articles").select("*").eq("user_id", user.id).order("saved_at", {
      ascending: false
    }).then(({
      data
    }) => {
      setItems(data || []);
      setLoading(false);
    });
  }, [user]);
  const handleRemove = async (id) => {
    await supabase.from("saved_articles").delete().eq("id", id);
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "h-5 w-5 text-teal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Articole Salvate" })
      ] }),
      !user ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "Trebuie să fii conectat pentru a vedea articolele salvate." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors", children: "Conectare" })
      ] }) : loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-5 animate-pulse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-3/4 bg-muted rounded mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-1/2 bg-muted rounded" })
      ] }, i)) }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "h-8 w-8 text-muted-foreground/30 mx-auto mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-semibold mb-1", children: "Niciun articol salvat" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Apasă iconița de bookmark pe orice știre pentru a o salva aici." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ms-card p-5 flex gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/article/$id", params: {
            id: item.article_id
          }, className: "text-base font-semibold text-foreground hover:text-teal transition-colors line-clamp-2", children: item.article_title }),
          item.article_summary && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground line-clamp-2 mt-1", children: item.article_summary }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2 text-xs text-muted-foreground", children: [
            item.article_source && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ms-chip", children: item.article_source }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
              " Salvat ",
              timeAgo(item.saved_at)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleRemove(item.id), className: "text-muted-foreground hover:text-sentiment-negative transition-colors flex-shrink-0 self-start p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] }, item.id)) })
    ] })
  ] });
}
export {
  SavedPage as component
};
