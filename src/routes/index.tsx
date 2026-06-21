import { createFileRoute } from "@tanstack/react-router";
import { strings } from "@/lib/strings";

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

function Welcome() {
  const c = strings.common;
  const w = strings.welcome;
  const steps = [w.steps.one, w.steps.two, w.steps.three];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Privacy bar — quiet, full-width, sits above the header */}
      <div
        role="status"
        aria-live="polite"
        className="w-full border-b border-border/60 bg-honey-soft/70"
      >
        <p className="mx-auto max-w-5xl px-5 py-2 text-center text-[13px] leading-relaxed text-foreground/75">
          {c.privacyBar}
        </p>
      </div>

      {/* Header */}
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 32 32"
            aria-hidden="true"
            className="h-7 w-7"
          >
            <rect x="6" y="7" width="16" height="2.3" rx="1.15" fill="#42514d" />
            <rect x="6" y="12" width="11" height="2.3" rx="1.15" fill="#42514d" />
            <path
              d="M6.5 20.5 L12.5 26.5 L26 11.5"
              fill="none"
              stroke="#1f5d4c"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="font-display text-lg font-medium tracking-tight">
            {c.brandName}
          </p>
        </div>
          <nav className="flex items-center gap-5 text-sm">
            <a
              href="/about"
              className="text-foreground/70 underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {c.aboutLink}
            </a>
            <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs uppercase tracking-wide text-muted-foreground">
              {c.pilotTag}
            </span>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-5 pb-16 pt-14 sm:pt-20">
          <p className="font-display text-base font-medium text-pine">
            {c.brandName}
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

          {/* Fresh-session line — separated from the privacy bar */}
          <p className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
            <span aria-hidden className="h-px w-8 bg-border" />
            {w.freshSession}
          </p>

          {/* Steps */}
          <ol className="mt-10 grid gap-4 sm:grid-cols-3">
            {steps.map((s) => (
              <li
                key={s.title}
                className="rounded-xl border border-border bg-card p-5"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-pine">
                  {s.label}
                </p>
                <p className="mt-2 font-display text-lg font-medium text-foreground">
                  {s.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>

          {/* CTA — disabled until /intake is built next turn */}
          <div className="mt-12">
            <button
              type="button"
              disabled
              aria-disabled="true"
              title={w.ctaPendingNote}
              className="inline-flex max-w-full items-center justify-center rounded-md bg-pine px-6 py-3.5 text-base font-medium text-pine-foreground shadow-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {w.cta}
            </button>
          </div>
        </div>
      </main>

      {/* Persistent footer — quiet single-line disclaimer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-5xl px-5 py-4">
          <p className="text-center text-xs text-muted-foreground">
            {c.footerDisclaimer}
          </p>
        </div>
      </footer>
    </div>
  );
}
