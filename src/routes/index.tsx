import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useStrings } from "@/lib/i18n";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fair Bill — Check your California medical bill" },
      {
        name: "description",
        content:
          "Fair Bill helps Californians read and act on a confusing or unfair medical bill. Private — everything stays on your device.",
      },
      { property: "og:title", content: "Fair Bill — Check your California medical bill" },
      {
        property: "og:description",
        content:
          "Read and act on a confusing California medical bill. Private session, nothing saved.",
      },
    ],
  }),
  component: Welcome,
});

const DEMO_BANNER_KEY = "fairbill:demo-banner-dismissed:v1";

function DemoBanner() {
  const b = useStrings().landingBanner;
  const [dismissed, setDismissed] = useState(true);

  // Read sessionStorage after hydration to avoid SSR mismatch.
  useEffect(() => {
    try {
      setDismissed(window.sessionStorage.getItem(DEMO_BANNER_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  if (dismissed) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-pine/30 bg-pine-soft/40 px-4 py-2 text-sm text-foreground">
      <p className="flex-1 min-w-0">
        <span className="font-medium">{b.prefix}</span> {b.body}
        <Link
          to="/demo"
          className="text-pine underline underline-offset-4 hover:text-pine/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {b.linkText}
        </Link>
        {b.suffix}
      </p>
      <button
        type="button"
        aria-label={b.dismissLabel}
        onClick={() => {
          try {
            window.sessionStorage.setItem(DEMO_BANNER_KEY, "1");
          } catch {
            /* ignore */
          }
          setDismissed(true);
        }}
        className="rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span aria-hidden className="text-lg leading-none">×</span>
      </button>
    </div>
  );
}

function Welcome() {
  const strings = useStrings();
  const c = strings.common;
  const w = strings.welcome;
  const steps = [w.steps.one, w.steps.two, w.steps.three, w.steps.four];

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-5 pb-16 pt-14 sm:pt-20">
        <p className="text-base font-medium text-pine">
          {c.eyebrow}
        </p>
        <h1 className="mt-2 font-display text-5xl font-medium tracking-tight text-foreground sm:text-6xl">
          {w.tagline}
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-foreground/85">
          {w.intro}
        </p>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {w.audience}
        </p>

        <p className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
          <span aria-hidden className="h-px w-8 bg-border" />
          {w.freshSession}
        </p>

        <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li
              key={s.title}
              className="rounded-xl border border-border/70 bg-background p-5"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-pine">
                {s.label}
              </p>
              <p className="mt-2 text-lg font-medium text-foreground">
                {s.title}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <DemoBanner />
          <Link
            to="/intake"
            className="inline-flex max-w-full items-center justify-center rounded-md bg-pine px-6 py-3.5 text-base font-medium text-pine-foreground shadow-sm transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {w.cta}
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
