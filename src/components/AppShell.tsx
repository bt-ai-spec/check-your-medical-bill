import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { strings } from "@/lib/strings";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const c = strings.common;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Privacy bar */}
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
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={c.brandName}
          >
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
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link
              to="/about"
              className="text-foreground/70 underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {c.aboutLink}
            </Link>
            <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs uppercase tracking-wide text-muted-foreground">
              {c.pilotTag}
            </span>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

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
