import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { strings } from "@/lib/strings";
import { AppShell } from "@/components/AppShell";
import { StepTracker } from "@/components/StepTracker";
import { CORPUS } from "@/lib/corpus";
import {
  readLetterContext,
  type LetterContext,
} from "@/lib/letter-context";

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

type TabId = "itemized" | "dispute" | "assistance" | "leverage";

type RenderedLetter = {
  id: TabId;
  subject: string;
  body: string[]; // paragraphs; placeholders use [BRACKETED]
};

function fmtCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

function deriveProviderName(ctx: LetterContext): string {
  if (ctx.qualify?.kind === "hospital") return ctx.qualify.hospitalName;
  if (ctx.provider?.name) return ctx.provider.name;
  return strings.letter.placeholders.providerFallback;
}

function buildItemized(ctx: LetterContext): RenderedLetter {
  const t = strings.letter.itemized;
  const ph = strings.letter.placeholders;
  const provider = deriveProviderName(ctx);
  const subject = t.subject.replace("{{ACCOUNT}}", ph.accountNumber);
  const greeting = t.greeting.replace("{{PROVIDER}}", provider);
  return {
    id: "itemized",
    subject,
    body: [
      `${ph.todayDate}`,
      greeting,
      `Re: account ${ph.accountNumber} · date of service ${ph.dateOfService} · patient ${ph.patientName}`,
      ...t.body,
      t.signoff,
      `${ph.patientName}\n${ph.address}`,
    ],
  };
}

function buildDispute(ctx: LetterContext): RenderedLetter {
  const t = strings.letter.dispute;
  const ph = strings.letter.placeholders;
  const provider = deriveProviderName(ctx);
  const subject = t.subject.replace("{{ACCOUNT}}", ph.accountNumber);
  const greeting = t.greeting.replace("{{PROVIDER}}", provider);
  const dups = ctx.check?.duplicates ?? [];
  const paragraphs: string[] = [
    `${ph.todayDate}`,
    greeting,
    `Re: account ${ph.accountNumber} · date of service ${ph.dateOfService} · patient ${ph.patientName}`,
    t.intro,
  ];
  if (dups.length > 0) {
    paragraphs.push(`${t.duplicateHeader}.`);
    paragraphs.push(t.duplicateLead);
    const lines = dups
      .map((d) =>
        t.duplicateLineFormat
          .replace("{{DESC}}", d.description)
          .replace("{{AMT}}", d.amount !== null ? fmtCurrency(d.amount) : "—"),
      )
      .join("\n");
    paragraphs.push(lines);
  }
  if (ctx.check?.surpriseConfirmed) {
    paragraphs.push(`${t.surpriseHeader}.`);
    paragraphs.push(
      t.surpriseBody.replace("{{IN_NETWORK}}", ph.providerInNetwork),
    );
  }
  paragraphs.push(t.ask);
  paragraphs.push(t.signoff);
  paragraphs.push(`${ph.patientName}\n${ph.address}`);
  return { id: "dispute", subject, body: paragraphs };
}

function buildAssistance(ctx: LetterContext): RenderedLetter {
  const t = strings.letter.assistance;
  const ph = strings.letter.placeholders;
  const q = ctx.qualify?.kind === "hospital" ? ctx.qualify : null;
  const hospitalName = q?.hospitalName ?? ph.providerFallback;
  const subject = t.subject.replace("{{HOSPITAL}}", hospitalName);
  const greeting = t.greeting.replace("{{HOSPITAL}}", hospitalName);
  const intro = t.intro.replace("{{HOSPITAL}}", hospitalName);

  const elig: keyof typeof t.eligibility = q?.eligibility ?? "unknown";
  const eligPara = t.eligibility[elig]
    .replace("{{PCT}}", q?.pct != null ? String(q.pct) : ph.accountNumber)
    .replace(
      "{{HOUSEHOLD}}",
      q?.household != null ? String(q.household) : "[household size]",
    );

  const ask = t.ask
    .replace("{{ACCOUNT}}", ph.accountNumber)
    .replace("{{DOS}}", ph.dateOfService);

  return {
    id: "assistance",
    subject,
    body: [
      `${ph.todayDate}`,
      greeting,
      `Re: account ${ph.accountNumber} · patient ${ph.patientName}`,
      intro,
      eligPara,
      t.collections,
      ask,
      t.signoff,
      `${ph.patientName}\n${ph.address}`,
    ],
  };
}

function buildLeverage(ctx: LetterContext): RenderedLetter {
  const t = strings.letter.leverage;
  const ph = strings.letter.placeholders;
  const provider = deriveProviderName(ctx);
  const subject = t.subject.replace("{{PROVIDER}}", provider);
  const greeting = t.greeting.replace("{{PROVIDER}}", provider);
  const askPlan = t.askPaymentPlan.replace("{{MONTHLY}}", ph.monthlyAmount);
  const ask = t.ask.replace("{{ACCOUNT}}", ph.accountNumber);
  return {
    id: "leverage",
    subject,
    body: [
      `${ph.todayDate}`,
      greeting,
      `Re: account ${ph.accountNumber} · patient ${ph.patientName}`,
      t.intro,
      t.askSelfPay,
      t.askHardship,
      askPlan,
      t.collections,
      ask,
      t.signoff,
      `${ph.patientName}\n${ph.address}`,
    ],
  };
}

function chooseTabs(ctx: LetterContext): RenderedLetter[] {
  const out: RenderedLetter[] = [];
  const check = ctx.check;
  const qualify = ctx.qualify;

  // Itemized: relevant when the user is on the summary path, OR when no
  // bill-check happened at all (so they can request the breakdown).
  const needsItemized =
    !check || check.format === "summary" || check.format === undefined;
  if (needsItemized) out.push(buildItemized(ctx));

  // Dispute: only when something to dispute was found / confirmed.
  const hasDispute =
    (check?.duplicates?.length ?? 0) > 0 || !!check?.surpriseConfirmed;
  if (hasDispute) out.push(buildDispute(ctx));

  // Financial relief — only one of the two, based on which path they took.
  if (qualify?.kind === "hospital") {
    out.push(buildAssistance(ctx));
  } else if (qualify?.kind === "independent") {
    out.push(buildLeverage(ctx));
  }

  return out;
}

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

function lettersToPlainText(l: RenderedLetter): string {
  return [`Subject: ${l.subject}`, "", ...l.body].join("\n\n");
}

function LetterPanel({ letter }: { letter: RenderedLetter }) {
  const a = strings.letter.actions;
  const [copied, setCopied] = useState(false);

  const plain = useMemo(() => lettersToPlainText(letter), [letter]);

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
        Subject
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

/* --------------------------- Page --------------------------- */

function LetterPage() {
  const t = strings.letter;
  const [ctx, setCtx] = useState<LetterContext | null>(null);

  useEffect(() => {
    setCtx(readLetterContext());
  }, []);

  const letters = useMemo(() => (ctx ? chooseTabs(ctx) : []), [ctx]);
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
        </div>

        {/* Tabs — only when more than one applies */}
        {letters.length > 1 && (
          <div
            className="mt-8 flex flex-wrap gap-2 border-b border-border"
            role="tablist"
            aria-label="Letter type"
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
