import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-BFjZgRb5.mjs";
import { a as TrendingUp, x as Sun, y as Moon, z as ChevronDown, B as Bookmark, E as Eye, l as Bell, D as LogOut } from "../_libs/lucide-react.mjs";
function LiveClock() {
  const [now, setNow] = reactExports.useState(null);
  reactExports.useEffect(() => {
    setNow(/* @__PURE__ */ new Date());
    const t = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(t);
  }, []);
  if (!now) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground tabular-nums", children: "--:--:-- RO" });
  }
  const parts = new Intl.DateTimeFormat("ro-RO", {
    timeZone: "Europe/Bucharest",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(now);
  const hh = parts.find((p) => p.type === "hour")?.value || "00";
  const mm = parts.find((p) => p.type === "minute")?.value || "00";
  const ss = parts.find((p) => p.type === "second")?.value || "00";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs tabular-nums text-muted-foreground", children: [
    hh,
    ":",
    mm,
    ":",
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: ss }),
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "RO" })
  ] });
}
function safeDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  const t = d.getTime();
  if (isNaN(t) || t < 9466848e5) return null;
  return d;
}
function timeAgo(iso) {
  const d = safeDate(iso);
  if (!d) return "recent";
  let diff = Date.now() - d.getTime();
  if (diff < 0) diff = 0;
  const m = Math.floor(diff / 6e4);
  if (m < 1) return "acum";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m`;
  const d2 = Math.floor(h / 24);
  if (d2 < 30) return `${d2}z`;
  return d.toLocaleDateString("ro-RO", { day: "2-digit", month: "short" });
}
function formatTimestamp(iso) {
  const d = safeDate(iso);
  if (!d) return "Dată indisponibilă";
  const time = new Intl.DateTimeFormat("ro-RO", { timeZone: "Europe/Bucharest", hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
  const date = new Intl.DateTimeFormat("ro-RO", { timeZone: "Europe/Bucharest", day: "2-digit", month: "2-digit" }).format(d);
  return `${time} RO · ${date}`;
}
function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  if (loading) return null;
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/login",
        className: "text-sm font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
        children: "Conectare"
      }
    );
  }
  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref, className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setOpen(!open),
        className: "flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-7 w-7 rounded-full bg-teal/15 text-teal flex items-center justify-center text-xs font-semibold", children: initials }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground hidden sm:inline max-w-[100px] truncate", children: displayName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5 text-muted-foreground" })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 top-full mt-1 w-56 ms-card p-1.5 z-50 shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 border-b border-border mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground truncate", children: displayName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: user.email })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { to: "/saved", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "h-4 w-4" }), label: "Articole salvate", onClick: () => setOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { to: "/watchlist", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }), label: "Watchlist", onClick: () => setOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { to: "/alerts", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }), label: "Alerte", onClick: () => setOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border mt-1 pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            signOut();
            setOpen(false);
          },
          className: "flex items-center gap-3 w-full px-3 py-2 text-sm text-sentiment-negative hover:bg-sentiment-negative/5 rounded-md transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
            " Deconectare"
          ]
        }
      ) })
    ] })
  ] });
}
function MenuItem({ to, icon, label, onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to,
      onClick,
      className: "flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors",
      children: [
        icon,
        " ",
        label
      ]
    }
  );
}
function ThemeToggle() {
  const [dark, setDark] = reactExports.useState(false);
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("ms_theme", next ? "dark" : "light");
    } catch {
    }
  };
  if (!mounted) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick: toggle,
      "aria-label": dark ? "Activează modul luminos" : "Activează modul întunecat",
      className: "flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
      children: dark ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-4 w-4" })
    }
  );
}
function TerminalHeader() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-14 items-center justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "group flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4.5 w-4.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold tracking-tight text-foreground", children: "Market" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold tracking-tight text-teal", children: "Scope" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden md:flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(NavItem, { to: "/", label: "Feed", exact: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(NavItem, { to: "/brief", label: "Brief" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(NavItem, { to: "/calendar", label: "Calendar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(NavItem, { to: "/themes", label: "Teme" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(NavItem, { to: "/saved", label: "Salvate" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(NavItem, { to: "/watchlist", label: "Watchlist" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(NavItem, { to: "/alerts", label: "Alerte" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-sentiment-positive/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-sentiment-positive animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-medium text-sentiment-positive", children: "Live" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LiveClock, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(UserMenu, {})
    ] })
  ] }) }) });
}
function NavItem({ to, label, exact }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to,
      activeOptions: { exact },
      className: "text-sm font-medium px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
      activeProps: { className: "!text-foreground !bg-muted" },
      children: label
    }
  );
}
export {
  TerminalHeader as T,
  formatTimestamp as f,
  timeAgo as t
};
