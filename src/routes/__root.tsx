import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  retainSearchParams,
  useNavigate,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useCallback, useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LocaleProvider, useStrings, type Locale } from "../lib/i18n";

interface RootSearch {
  lang?: Locale;
}

function NotFoundComponent() {
  const t = useStrings().common.notFound;
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">{t.code}</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t.body}
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.goHome}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const t = useStrings().common.errorPage;
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {t.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t.body}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.tryAgain}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t.goHome}
          </a>
        </div>
      </div>
    </div>
  );
}


export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  validateSearch: (search: Record<string, unknown>): RootSearch => {
    const raw = search.lang;
    // Spanish is wired in the locale infrastructure but is not selectable yet;
    // only English is reachable. Any other ?lang= value falls back to English.
    return raw === "en" ? {} : {};
  },
  search: {
    // Keep ?lang= across all navigations so locale survives link clicks.
    middlewares: [retainSearchParams(["lang"])],
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Fair Bill — Check your California medical bill" },
      {
        name: "description",
        content:
          "Fair Bill helps Californians read and act on a confusing or unfair medical bill. Private — everything stays on your device.",
      },
      { name: "referrer", content: "no-referrer" },
      { property: "og:title", content: "Fair Bill — Check your California medical bill" },
      {
        property: "og:description",
        content:
          "Read and act on a confusing California medical bill. Private session, nothing saved.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Fair Bill — Check your California medical bill" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d7abc78b-a3e5-4a1a-b3ac-6209c90c8b1d/id-preview-54f4cf77--70f97b06-2eb9-4240-88d5-bfc0afa7002c.lovable.app-1782085673843.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d7abc78b-a3e5-4a1a-b3ac-6209c90c8b1d/id-preview-54f4cf77--70f97b06-2eb9-4240-88d5-bfc0afa7002c.lovable.app-1782085673843.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Public+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { lang } = Route.useSearch();
  const navigate = useNavigate();

  const handleLocaleChange = useCallback(
    (next: Locale) => {
      navigate({
        to: ".",
        search: (prev: Record<string, unknown>) => ({ ...prev, lang: next === "en" ? undefined : next }),
        replace: true,
      });
    },
    [navigate],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider locale={lang ?? "en"} onLocaleChange={handleLocaleChange}>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </LocaleProvider>
    </QueryClientProvider>
  );
}
