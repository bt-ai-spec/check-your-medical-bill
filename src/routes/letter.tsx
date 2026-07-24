import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useStrings } from "@/lib/i18n";
import { AppShell } from "@/components/AppShell";
import { StepTracker } from "@/components/StepTracker";
import { CORPUS } from "@/lib/corpus";
import {
  readLetterContext,
  type LetterContext,
} from "@/lib/letter-context";
import {
  chooseTabs,
  deriveProviderName,
  letterToPlainText,
  type RenderedLetter,
  type TabId,
} from "@/lib/build-letters";

export const Route = createFileRoute("/letter")({
  head: () => ({
    meta: [
      { title: "Get your letter — Fair Bill" },
      {
        name: "description",
        content:
          "A ready-to-send letter built from what you already entered — generated on this device.",
      },
    ],
  }),
  component: LetterPage,
});


/* --------------------------- Renderers --------------------------- */

// Render text with [BRACKETED] fill-ins as honey-tinted spans.
function FillInText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\[[^\]]+\]$/.test(p) ? (
          <span
            key={i}
            className="rounded-sm border border-honey/40 bg-honey/15 px-1 font-medium text-honey-foreground"
          >
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}


function LetterPanel({ letter }: { letter: RenderedLetter }) {
  const strings = useStrings();
  const a = strings.letter.actions;
  const [copied, setCopied] = useState(false);

  const plain = useMemo(() => letterToPlainText(letter), [letter]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(plain);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — user can still select-and-copy */
    }
  };

  const onMail = () => {
    const href = `mailto:?subject=${encodeURIComponent(
      letter.subject,
    )}&body=${encodeURIComponent(letter.body.join("\n\n"))}`;
    window.location.href = href;
  };

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
        {strings.letter.subjectLabel}

      </p>
      <p className="mt-1 text-sm text-foreground">
        <FillInText text={letter.subject} />
      </p>

      <article className="mt-5 whitespace-pre-wrap rounded-xl border border-border bg-card p-5 font-mono text-sm leading-relaxed text-foreground">
        {letter.body.map((para, i) => (
          <p key={i} className={i === 0 ? "" : "mt-4"}>
            <FillInText text={para} />
          </p>
        ))}
      </article>

      <p className="mt-3 text-xs text-muted-foreground">
        {strings.letter.fillLegend}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-md bg-pine px-4 py-2.5 text-sm font-medium text-pine-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {copied ? a.copied : a.copy}
        </button>
        <button
          type="button"
          onClick={onMail}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {a.mail}
        </button>
        <span className="text-xs text-muted-foreground">{a.mailHelp}</span>
      </div>
    </div>
  );
}

function AssistancePrompt({ providerName }: { providerName: string }) {
  const strings = useStrings();
  const t = strings.letter.assistancePrompt;

  const target = useMemo(() => {
    const hospital = CORPUS.hospitals.find((h) => h.name === providerName);
    if (hospital) {
      return {
        to: "/qualify" as const,
        search: { type: "hospital" as const, hospital: hospital.id },
      };
    }
    return { to: "/intake" as const };
  }, [providerName]);

  const body = t.body.replace("{{PROVIDER}}", providerName);

  return (
    <p className="text-sm text-muted-foreground">
      {body}{" "}
      {target.to === "/qualify" ? (
        <Link
          to="/qualify"
          search={target.search}
          className="rounded text-pine underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t.cta}
        </Link>
      ) : (
        <Link
          to="/intake"
          className="rounded text-pine underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t.cta}
        </Link>
      )}
    </p>
  );
}

/* --------------------------- Page --------------------------- */

function LetterPage() {
  const strings = useStrings();
  const t = strings.letter;
  const [ctx, setCtx] = useState<LetterContext | null>(null);

  useEffect(() => {
    setCtx(readLetterContext());
  }, []);

  const letters = useMemo(() => (ctx ? chooseTabs(ctx, strings) : []), [ctx, strings]);
  const needsAssistancePrompt = useMemo(() => {
    if (!ctx || ctx.provider?.kind !== "hospital") return false;
    return (
      !ctx.qualify ||
      ctx.qualify.kind !== "hospital" ||
      ctx.qualify.hospitalName !== ctx.provider.name
    );
  }, [ctx]);
  const [active, setActive] = useState<TabId | null>(null);

  useEffect(() => {
    if (letters.length > 0 && active === null) {
      setActive(letters[0].id);
    }
  }, [letters, active]);

  // Defensive: surface CORPUS hookups so unused-import lint doesn't strip it
  // even though the assistance letter currently relies on derived values only.
  void CORPUS;

  if (ctx === null) {
    // Initial client-only paint; render the shell quietly.
    return (
      <AppShell>
        <div className="mx-auto w-full max-w-3xl px-5 pb-20">
          <StepTracker current={3} />
          <div className="pt-10">
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {t.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
              {t.title}
            </h1>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!ctx.provider && ctx.qualify?.kind !== "hospital" && ctx.qualify?.kind !== "independent") {
    return (
      <AppShell>
        <div className="mx-auto w-full max-w-3xl px-5 pb-20">
          <StepTracker current={3} />
          <div className="pt-10">
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {t.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
              {t.noContext.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-foreground/85">
              {t.noContext.body}
            </p>
            <Link
              to="/intake"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-pine px-5 py-3 text-sm font-medium text-pine-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t.noContext.cta}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  if (letters.length === 0) {
    return (
      <AppShell>
        <div className="mx-auto w-full max-w-3xl px-5 pb-20">
          <StepTracker current={3} />
          <div className="pt-10">
            <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {t.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
              {t.missing.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-foreground/85">
              {t.missing.body}
            </p>
            <Link
              to="/check"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-pine px-5 py-3 text-sm font-medium text-pine-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t.missing.cta}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const activeLetter =
    letters.find((l) => l.id === active) ?? letters[0];

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-5 pb-20">
        <StepTracker current={3} />
        <div className="pt-10">
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/85">
            {letters.length === 1 ? t.ledeSingle : t.ledeMulti}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            {t.privacyNote}
          </p>
          {needsAssistancePrompt && (
            <div className="mt-4">
              <AssistancePrompt providerName={deriveProviderName(ctx, strings)} />
            </div>
          )}
        </div>

        {/* Tabs — only when more than one applies */}
        {letters.length > 1 && (
          <div
            className="mt-8 flex flex-wrap gap-2 border-b border-border"
            role="tablist"
            aria-label={strings.letter.a11y.tabList}
          >
            {letters.map((l) => {
              const selected = l.id === activeLetter.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActive(l.id)}
                  className={`-mb-px rounded-t-md border-b-2 px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    selected
                      ? "border-pine text-foreground font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.tabs[l.id]}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            {t.tabHints[activeLetter.id]}
          </p>
          <div className="mt-5">
            <LetterPanel letter={activeLetter} />
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between gap-4">
          <Link
            to="/check"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span aria-hidden>←</span>
            {t.backToCheck}
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
