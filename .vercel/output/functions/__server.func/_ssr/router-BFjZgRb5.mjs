import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as createRouter, u as useRouter, a as createRootRouteWithContext, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { z as zodValidator, f as fallback } from "../_libs/tanstack__zod-adapter.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./index.mjs";
import { o as objectType, s as stringType, e as enumType, a as arrayType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function createSupabaseClient() {
  const SUPABASE_URL = "https://yjnokkdzikvdeyqkugmk.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_PsdW5h4GcqJI-6XGX1jnNw_PvGSTPoi";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
const AuthContext = reactExports.createContext({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {
  }
});
function AuthProvider({ children }) {
  const [user, setUser] = reactExports.useState(null);
  const [session, setSession] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session2) => {
      setSession(session2);
      setUser(session2?.user ?? null);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session: session2 } }) => {
      setSession(session2);
      setUser(session2?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  const signOut = reactExports.useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value: { user, session, loading, signOut }, children });
}
function useAuth() {
  return reactExports.useContext(AuthContext);
}
const appCss = "/assets/styles-Cf8zClHf.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
const Route$b = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MarketScope" },
      { name: "description", content: "MarketScope — Market intelligence platform. Știri financiare agregate și explicate clar pentru investitori." },
      { name: "author", content: "MarketScope" },
      { property: "og:title", content: "MarketScope — Market Intelligence" },
      { property: "og:description", content: "Știrile care mișcă piețele, explicate clar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "MarketScope" },
      { name: "twitter:description", content: "Market intelligence platform — știri financiare agregate și explicate." }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("script", { dangerouslySetInnerHTML: { __html: `(function(){try{var t=localStorage.getItem('ms_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()` } }),
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$b.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) });
}
const $$splitComponentImporter$a = () => import("./watchlist-C6Z2XV_X.mjs");
const Route$a = createFileRoute("/watchlist")({
  head: () => ({
    meta: [{
      title: "Watchlist — MarketScope"
    }, {
      name: "description",
      content: "Watchlist-ul tău de teme și ticker-e pe MarketScope."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./themes-SZvoHbDx.mjs");
const Route$9 = createFileRoute("/themes")({
  head: () => ({
    meta: [{
      title: "Market Themes — MarketScope"
    }, {
      name: "description",
      content: "Explorează temele principale ale pieței: acțiuni, macro, earnings, crypto și altele."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./saved-DAClicND.mjs");
const Route$8 = createFileRoute("/saved")({
  head: () => ({
    meta: [{
      title: "Articole Salvate — MarketScope"
    }, {
      name: "description",
      content: "Articolele tale salvate pe MarketScope."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./reset-password-DbUh73wn.mjs");
const Route$7 = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{
      title: "Resetare parolă — MarketScope"
    }, {
      name: "description",
      content: "Setează o parolă nouă pentru contul tău MarketScope."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./login-DpGopkAf.mjs");
const Route$6 = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Login — MarketScope"
    }, {
      name: "description",
      content: "Conectează-te la MarketScope pentru watchlist, alerte și articole salvate."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./calendar-CXapz71i.mjs");
const Route$5 = createFileRoute("/calendar")({
  head: () => ({
    meta: [{
      title: "Catalyst Calendar — MarketScope"
    }, {
      name: "description",
      content: "Calendarul catalizatorilor de piață — earnings, date economice, FOMC."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./brief-BhVDV9nB.mjs");
const Route$4 = createFileRoute("/brief")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./alerts-Cr5juASa.mjs");
const Route$3 = createFileRoute("/alerts")({
  head: () => ({
    meta: [{
      title: "Alerte — MarketScope"
    }, {
      name: "description",
      content: "Configurează alerte pentru știrile financiare pe MarketScope."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./about-D0eMj7K6.mjs");
const Route$2 = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "Despre — MarketScope"
    }, {
      name: "description",
      content: "Cum funcționează MarketScope — market intelligence platform."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./index-BkJI3QYU.mjs");
const searchSchema = objectType({
  q: fallback(stringType(), "").default(""),
  src: fallback(arrayType(stringType()), []).default([]),
  th: fallback(arrayType(stringType()), []).default([]),
  imp: fallback(arrayType(stringType()), []).default([]),
  sort: fallback(enumType(["relevance", "newest", "highest-impact"]), "newest").default("newest")
});
const Route$1 = createFileRoute("/")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [{
      title: "MarketScope — Market Intelligence Platform"
    }, {
      name: "description",
      content: "Agregator premium de știri financiare de la Reuters, Bloomberg, Investing.com, CNBC, MarketWatch și Yahoo Finance."
    }, {
      property: "og:title",
      content: "MarketScope — Market Intelligence"
    }, {
      property: "og:description",
      content: "Știrile care mișcă piețele, explicate clar."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const rateLimitMap = /* @__PURE__ */ new Map();
if (typeof setInterval !== "undefined") {
  setInterval(() => rateLimitMap.clear(), 6e4 * 60);
}
const fetchLatestNews = createServerFn({
  method: "GET"
}).handler(createSsrRpc("aa90e7a9f934fbc983e2f594d62596dd17bbaba6dfe3da37b0bc248845a60fd1"));
const analyzeArticleSchema = objectType({
  id: stringType(),
  title: stringType(),
  source: stringType(),
  summary: stringType(),
  themes: arrayType(stringType()).optional(),
  regions: arrayType(stringType()).optional()
});
const analyzeArticle = createServerFn({
  method: "POST"
}).inputValidator((data) => analyzeArticleSchema.parse(data)).handler(createSsrRpc("b945fb25e25c44bb57d678ccd31cae7201bb86a5cc527889fab92c56d6f2f0cf"));
const getNewsItem = createServerFn({
  method: "POST"
}).inputValidator((data) => objectType({
  id: stringType().min(1).max(128)
}).parse(data)).handler(createSsrRpc("4651190ab9113166fb4da1cfc1f9319a90370f6cc92f418c955c434c780911d1"));
const customAnalyzeSchema = objectType({
  input: stringType().min(10).max(8e3)
});
const analyzeCustomNews = createServerFn({
  method: "POST"
}).inputValidator((data) => customAnalyzeSchema.parse(data)).handler(createSsrRpc("db7b1357bdebe0f3f40a9f13257398f169921f8571986ddba81aa0fead24a527"));
const getDailyBrief = createServerFn({
  method: "POST"
}).handler(createSsrRpc("c8e1a309006ba4eb9d84e028c8972894bb2cc14d7dd91dfe03b2ef830937ac32"));
const getCatalystCalendar = createServerFn({
  method: "POST"
}).handler(createSsrRpc("81b5009926f42f55a7fbc2b451cff21bf7b58fa119f8bed28319e7c6bc05f9b6"));
const getAdvancedScore = createServerFn({
  method: "POST"
}).inputValidator((data) => objectType({
  id: stringType().min(1).max(128)
}).parse(data)).handler(createSsrRpc("719386e45a3b398eb0cd70b3e87a30b2bf2e9665daadf3215d88aadd90030ae7"));
const $$splitComponentImporter = () => import("./article._id-DWnqoqlv.mjs");
const $$splitNotFoundComponentImporter = () => import("./article._id-CX6dy1nX.mjs");
const $$splitErrorComponentImporter = () => import("./article._id-bkRdDQ3P.mjs");
const Route = createFileRoute("/article/$id")({
  loader: ({
    params
  }) => getNewsItem({
    data: {
      id: params.id
    }
  }),
  head: ({
    loaderData
  }) => {
    const item = loaderData?.item;
    return {
      meta: [{
        title: item ? `${item.title} — MarketScope` : "Știre — MarketScope"
      }, {
        name: "description",
        content: item?.summary ?? "Analiză știre piață de capital."
      }, {
        property: "og:title",
        content: item?.title ?? "MarketScope"
      }, {
        property: "og:description",
        content: item?.summary ?? ""
      }]
    };
  },
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const WatchlistRoute = Route$a.update({
  id: "/watchlist",
  path: "/watchlist",
  getParentRoute: () => Route$b
});
const ThemesRoute = Route$9.update({
  id: "/themes",
  path: "/themes",
  getParentRoute: () => Route$b
});
const SavedRoute = Route$8.update({
  id: "/saved",
  path: "/saved",
  getParentRoute: () => Route$b
});
const ResetPasswordRoute = Route$7.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => Route$b
});
const LoginRoute = Route$6.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$b
});
const CalendarRoute = Route$5.update({
  id: "/calendar",
  path: "/calendar",
  getParentRoute: () => Route$b
});
const BriefRoute = Route$4.update({
  id: "/brief",
  path: "/brief",
  getParentRoute: () => Route$b
});
const AlertsRoute = Route$3.update({
  id: "/alerts",
  path: "/alerts",
  getParentRoute: () => Route$b
});
const AboutRoute = Route$2.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$b
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$b
});
const ArticleIdRoute = Route.update({
  id: "/article/$id",
  path: "/article/$id",
  getParentRoute: () => Route$b
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  AlertsRoute,
  BriefRoute,
  CalendarRoute,
  LoginRoute,
  ResetPasswordRoute,
  SavedRoute,
  ThemesRoute,
  WatchlistRoute,
  ArticleIdRoute
};
const routeTree = Route$b._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1e3 * 60 * 5,
        refetchOnWindowFocus: false
      }
    }
  });
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$1 as R,
  getDailyBrief as a,
  analyzeCustomNews as b,
  Route as c,
  analyzeArticle as d,
  getAdvancedScore as e,
  fetchLatestNews as f,
  getCatalystCalendar as g,
  router as r,
  supabase as s,
  useAuth as u
};
