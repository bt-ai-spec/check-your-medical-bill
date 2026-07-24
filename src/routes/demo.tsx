import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useStrings } from "@/lib/i18n";
import { AppShell } from "@/components/AppShell";
import { parseBill } from "@/lib/parse-bill";
import { CORPUS, fplFor } from "@/lib/corpus";
import { chooseTabs, letterToPlainText, type RenderedLetter, type TabId } from "@/lib/build-letters";
import type { LetterContext } from "@/lib/letter-context";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Demo — Fair Bill" },
      {
        name: "description",
        content:
          "See Fair Bill work on a fictional sample bill. Real duplicate detection, real FPL math, real generated letter.",
      },
      { property: "og:title", content: "Fair Bill — Demo" },
      {
        property: "og:description",
        content:
          "A fictional sample bill running through the real Fair Bill flow.",
      },
    ],
  }),
  component: DemoPage,
});

/* --------------------- Fictional demo inputs --------------------- */

const SAMPLE_PROVIDER = "Sample General Hospital (fictional)";

const SAMPLE_BILL = [
  "Emergency dept visit (Level 4) — $2,480",
  "CT scan abdomen w/ contrast — $3,150",
  "CT scan abdomen w/ contrast — $3,150",
  "Pharmacy — $312",
  "Facility fee — $1,940",
  "Lab panel, comprehensive metabolic — $184",
].join("\n");

const SAMPLE_HOUSEHOLD = 2;
const SAMPLE_INCOME = 65000; // Places household at ~300% FPL for size 2 (2026 FPL: $21,640).

function fmtCurrency(n: number, digits = 0): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
  });
}

/* ---------------------------- Page ---------------------------- */

function DemoPage() {
  const strings = useStrings();
  const t = strings.demo;

  const parsed = useMemo(() => parseBill(SAMPLE_BILL), []);
  const total = parsed.reduce((s, l) => s + (l.amount ?? 0), 0);
  const duplicates = useMemo(() => {
    const seen = new Set<string>();
    return parsed
      .filter((l) => l.isDuplicate)
      .map((l) => ({ description: l.description, amount: l.amount }))
      .filter((d) => {
        const key = `${d.description.toLowerCase()}|${d.amount}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [parsed]);

  // Real FPL math against the corpus.
  const fpl = fplFor(SAMPLE_HOUSEHOLD);
  const pct = Math.round((SAMPLE_INCOME / fpl) * 100);
  const ceiling = CORPUS.fairPricingAct.eligibilityCeilingPctFpl; // 400
  const eligibility: "free" | "disc" | "border" | "above" =
    pct <= ceiling ? "free" : "above";

  // Seed a LetterContext and hand it to the exact same letter builder the
  // real /letter page uses.
  const ctx: LetterContext = useMemo(
    () => ({
      provider: { kind: "hospital", name: SAMPLE_PROVIDER },
      check: {
        format: "itemized",
        duplicates,
        surpriseConfirmed: false,
      },
      qualify: {
        kind: "hospital",
        hospitalName: SAMPLE_PROVIDER,
        eligibility,
        income: SAMPLE_INCOME,
        household: SAMPLE_HOUSEHOLD,
        pct,
      },
    }),
    [duplicates, pct, eligibility],
  );

  const letters = useMemo(() => chooseTabs(ctx, strings), [ctx, strings]);
  const [activeTab, setActiveTab] = useState<TabId | null>(null);
  const active = letters.find((l) => l.id === activeTab) ?? letters[0];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Persistent demo banner */}
      <div
        role="status"
        aria-live="polite"
        className="w-full border-b border-honey/40 bg-honey/20"
      >
        <p className="mx-auto max-w-3xl px-4 py-2 text-center text-[13px] leading-snug text-foreground">
          {t.banner}
        </p>
      </div>

      <main className="mx-auto w-full max-w-3xl px-4 pb-12 pt-6">
        <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
          {t.eyebrow}
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          {t.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-foreground/85">
          {t.intro}
        </p>

        <p className="mt-4 text-xs text-muted-foreground">
          <span className="font-mono uppercase tracking-wide">
            {t.providerLabel}:
          </span>{" "}
          <span className="text-foreground">{t.providerName}</span>
        </p>

        {/* 1. Bill ledger */}
        <section className="mt-8">
          <h2 className="font-display text-lg font-medium text-foreground">
            {t.billHeader}
          </h2>
          <p className="mt-2 text-sm text-foreground/80">{t.billNote}</p>
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {parsed.map((l, i) => (
              <li
                key={`${i}-${l.raw}`}
                className={`flex items-baseline justify-between gap-4 px-4 py-2.5 ${
                  l.isDuplicate ? "bg-honey-soft" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{l.description}</p>
                  {l.isDuplicate && (
                    <span className="mt-1 inline-flex items-center rounded-full border border-honey/40 bg-honey/10 px-2 py-0.5 font-mono text-xs text-honey-foreground">
                      {t.duplicateFlag}
                    </span>
                  )}
                </div>
                <p className="shrink-0 font-mono text-sm tabular-nums text-foreground">
                  {l.amount !== null ? fmtCurrency(l.amount) : "—"}
                </p>
              </li>
            ))}
            <li className="flex items-baseline justify-between gap-4 bg-pine-soft/30 px-4 py-2.5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t.totalLabel}
              </p>
              <p className="font-mono text-sm font-medium tabular-nums text-foreground">
                {fmtCurrency(total)}
              </p>
            </li>
          </ul>
        </section>

        {/* 2. Check result */}
        <section className="mt-8">
          <h2 className="font-display text-lg font-medium text-foreground">
            {t.checkHeader}
          </h2>
          <p className="mt-2 text-sm text-foreground/85">
            {t.checkFoundDuplicate}
          </p>
        </section>

        {/* 3. Qualify math */}
        <section className="mt-8 rounded-xl border border-pine/30 bg-pine-soft/30 p-4">
          <h2 className="font-display text-lg font-medium text-foreground">
            {t.qualifyHeader}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
            {t.qualifyNote
              .replace("{{HOUSEHOLD}}", String(SAMPLE_HOUSEHOLD))
              .replace("{{INCOME}}", fmtCurrency(SAMPLE_INCOME))
              .replace("{{FPL}}", fmtCurrency(fpl))
              .replace("{{PCT}}", String(pct))}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground">
            {t.qualifyResult.replace("{{PCT}}", String(pct))}
          </p>
        </section>

        {/* 4. Letters */}
        <section className="mt-8">
          <h2 className="font-display text-lg font-medium text-foreground">
            {t.letterHeader}
          </h2>
          <p className="mt-2 text-sm text-foreground/80">{t.letterNote}</p>

          {letters.length > 1 && (
            <div
              className="mt-4 flex flex-wrap gap-2 border-b border-border"
              role="tablist"
              aria-label={strings.letter.a11y.tabList}
            >
              {letters.map((l) => {
                const selected = l.id === active.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveTab(l.id)}
                    className={`-mb-px rounded-t-md border-b-2 px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      selected
                        ? "border-pine font-medium text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {strings.letter.tabs[l.id]}
                  </button>
                );
              })}
            </div>
          )}

          {active && <DemoLetterPanel letter={active} />}
        </section>

        {/* Final CTA */}
        <section className="mt-12 rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-medium text-foreground">
            {t.finalCtaHeader}
          </h2>
          <p className="mt-2 text-sm text-foreground/85">{t.finalCtaBody}</p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-pine px-5 py-2.5 text-sm font-medium text-pine-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {t.finalCtaLink}
            <span aria-hidden>→</span>
          </Link>
        </section>
      </main>
    </div>
  );
}

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

function DemoLetterPanel({ letter }: { letter: RenderedLetter }) {
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

  return (
    <div className="mt-5">
      <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
        {strings.letter.subjectLabel}
      </p>
      <p className="mt-1 text-sm text-foreground">
        <FillInText text={letter.subject} />
      </p>

      <article className="mt-4 whitespace-pre-wrap rounded-xl border border-border bg-card p-4 font-mono text-xs leading-relaxed text-foreground sm:text-sm">
        {letter.body.map((para, i) => (
          <p key={i} className={i === 0 ? "" : "mt-4"}>
            <FillInText text={para} />
          </p>
        ))}
      </article>

      <p className="mt-2 text-xs text-muted-foreground">
        {strings.letter.fillLegend}
      </p>

      <div className="mt-3">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-md bg-pine px-4 py-2 text-sm font-medium text-pine-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {copied ? a.copied : a.copy}
        </button>
      </div>
    </div>
  );
}
