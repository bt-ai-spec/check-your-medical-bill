import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { strings } from "@/lib/strings";
import { AppShell } from "@/components/AppShell";
import { StepTracker } from "@/components/StepTracker";
import { writeLetterContext } from "@/lib/letter-context";
import { CORPUS } from "@/lib/corpus";

const searchSchema = z.object({
  type: z.enum(["hospital", "independent"]).optional(),
  hospital: z.string().optional(),
  customName: z.string().optional(),
  customCutoffs: z.string().optional(),
});

type CheckSearch = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/check")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Check it — Fair Bill" },
      {
        name: "description",
        content:
          "See what's worth questioning on your medical bill — duplicates, surprise billing, and your right to itemization.",
      },
    ],
  }),
  component: CheckPage,
});

type Format = "summary" | "itemized" | null;

const EXAMPLE_TEXT = [
  "Emergency dept visit (Level 4) — $2,480",
  "CT scan abdomen w/ contrast — $3,150",
  "CT scan abdomen w/ contrast — $3,150",
  "Pharmacy — $312",
  "Out-of-network radiologist read — $620",
  "Facility fee — $1,940",
].join("\n");

type ParsedLine = {
  raw: string;
  description: string;
  amount: number | null;
  isDuplicate: boolean;
};

function parseBill(text: string): ParsedLine[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Match the LAST currency-like number on the line (handles "$2,480" / "2480.00" / "$ 2,480").
  const amtRe = /\$?\s?([0-9]{1,3}(?:,[0-9]{3})+(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?)\s*$/;

  const initial: Omit<ParsedLine, "isDuplicate">[] = lines.map((raw) => {
    const m = raw.match(amtRe);
    if (!m) return { raw, description: raw, amount: null };
    const amount = parseFloat(m[1].replace(/,/g, ""));
    // Strip the trailing amount + any preceding " — ", " - ", ":" punctuation.
    const description = raw
      .slice(0, raw.length - m[0].length)
      .replace(/[\s\u2014\-:·|]+$/, "")
      .trim();
    return {
      raw,
      description: description || raw,
      amount: Number.isFinite(amount) ? amount : null,
    };
  });

  // Duplicate = same normalized description AND same amount, appearing >1 time.
  const counts = new Map<string, number>();
  for (const l of initial) {
    if (l.amount === null) continue;
    const key = `${l.description.toLowerCase()}|${l.amount}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return initial.map((l) => {
    if (l.amount === null) return { ...l, isDuplicate: false };
    const key = `${l.description.toLowerCase()}|${l.amount}`;
    return { ...l, isDuplicate: (counts.get(key) ?? 0) > 1 };
  });
}

function fmtCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function PreviewChecks() {
  const t = strings.check;
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (label: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  return (
    <section className="mt-6" aria-label="What this screen checks for">
      <p className="text-sm text-foreground/85">{t.previewIntro}</p>
      <ol className="mt-3 grid gap-2">
        {t.previewChecks.map((c, i) => {
          const isOpen = open.has(c.label);
          return (
            <li
              key={c.label}
              className="rounded-lg border border-border bg-card text-sm text-foreground/90"
            >
              <button
                type="button"
                onClick={() => toggle(c.label)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="font-mono text-xs text-muted-foreground"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-medium text-foreground">{c.label}</span>
                </span>
                <span
                  aria-hidden
                  className="font-mono text-xs text-muted-foreground"
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <div className="px-3 pb-3 pl-9 text-sm leading-relaxed text-foreground/85">
                  {c.body}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function CheckPage() {
  const t = strings.check;
  const search = Route.useSearch();
  const [format, setFormat] = useState<Format>(null);
  const [text, setText] = useState("");
  const [usingExample, setUsingExample] = useState(false);
  const [surpriseConfirmed, setSurpriseConfirmed] = useState(false);

  const parsed = useMemo(() => parseBill(text), [text]);
  const hasContent = parsed.length > 0;
  const total = parsed.reduce((s, l) => s + (l.amount ?? 0), 0);
  const anyDuplicate = parsed.some((l) => l.isDuplicate);
  const anyAmountParsed = parsed.some((l) => l.amount !== null);

  // Mirror findings into sessionStorage so the Letter screen can build the
  // right letters without us transmitting anything. Cleared at tab close.
  useEffect(() => {
    const duplicates = parsed
      .filter((l) => l.isDuplicate)
      .map((l) => ({ description: l.description, amount: l.amount }));
    // De-duplicate the duplicate-list itself (each repeated line shows up
    // multiple times in `parsed`; we only need one row per duplicate).
    const seen = new Set<string>();
    const unique = duplicates.filter((d) => {
      const key = `${d.description.toLowerCase()}|${d.amount}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const provider =
      search.type === "hospital"
        ? {
            kind: "hospital" as const,
            name:
              (search.hospital
                ? CORPUS.hospitals.find((h) => h.id === search.hospital)?.name
                : undefined) ?? search.customName ?? undefined,
          }
        : search.type === "independent"
          ? { kind: "independent" as const }
          : undefined;
    
    writeLetterContext({
      provider,
      check: {
        format: format ?? undefined,
        duplicates: unique,
        surpriseConfirmed,
      },
    });
  }, [parsed, format, surpriseConfirmed, search.type, search.hospital, search.customName]);


  const loadExample = () => {
    setText(EXAMPLE_TEXT);
    setUsingExample(true);
    if (format !== "itemized") setFormat("itemized");
  };
  const clearExample = () => {
    setText("");
    setUsingExample(false);
  };

  const canContinue = format !== null && (format === "summary" || hasContent);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-5 pb-20">
        <StepTracker current={1} />

        <div className="pt-10">
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            {t.title}
          </h1>
        <p className="mt-4 text-base leading-relaxed text-foreground/85">
          {t.lede}
        </p>

        {/* Preview of checks */}
        <PreviewChecks />
      </div>

      {/* Format fork */}
        <section className="mt-10">
          <h2 className="text-base font-medium text-foreground">
            {t.formatHeader}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <FormatChoice
              selected={format === "summary"}
              onClick={() => setFormat("summary")}
              label={t.formatSummary}
              help={t.formatSummaryHelp}
            />
            <FormatChoice
              selected={format === "itemized"}
              onClick={() => setFormat("itemized")}
              label={t.formatItemized}
              help={t.formatItemizedHelp}
            />
          </div>
        </section>

        {format === "itemized" && (
          <section className="mt-10">
            <div className="flex items-baseline justify-between gap-4">
              <label
                htmlFor="bill-input"
                className="text-base font-medium text-foreground"
              >
                {t.inputLabel}
              </label>
              {!usingExample ? (
                <button
                  type="button"
                  onClick={loadExample}
                  className="text-sm text-pine underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                >
                  {t.tryExample}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={clearExample}
                  className="text-sm text-pine underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                >
                  {t.clearExample}
                </button>
              )}
            </div>
            <textarea
              id="bill-input"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (usingExample && e.target.value !== EXAMPLE_TEXT) {
                  setUsingExample(false);
                }
              }}
              placeholder={t.inputPlaceholder}
              rows={6}
              className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2.5 font-mono text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
            <p className="mt-2 text-xs text-muted-foreground">{t.inputHelp}</p>
          </section>
        )}

        {format === "summary" && <SummaryPath />}

        {format === "itemized" && hasContent && (
          <ItemizedPath
            parsed={parsed}
            total={total}
            anyDuplicate={anyDuplicate}
            anyAmountParsed={anyAmountParsed}
            surpriseConfirmed={surpriseConfirmed}
            onToggleSurprise={() => setSurpriseConfirmed((v) => !v)}
          />
        )}

        {/* Actions */}
        <div className="mt-12 flex items-center justify-between gap-4">
          <Link
            to="/intake"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span aria-hidden>←</span>
            {t.backToIntake}
          </Link>
          {format === "summary" ? (
            <div className="flex items-center gap-3">
              <Link
                to="/qualify"
                search={passthroughSearch(search)}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm text-foreground/90 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {t.summary.summarySecondaryCta}
              </Link>
              <Link
                to="/letter"
                className="inline-flex items-center gap-2 rounded-md bg-pine px-5 py-3 text-sm font-medium text-pine-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {t.summary.summaryPrimaryCta}
                <span aria-hidden>→</span>
              </Link>
            </div>
          ) : canContinue ? (
            <Link
              to="/qualify"
              search={passthroughSearch(search)}
              className="inline-flex items-center gap-2 rounded-md bg-pine px-5 py-3 text-sm font-medium text-pine-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t.primaryCta}
              <span aria-hidden>→</span>
            </Link>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled
              className="inline-flex items-center gap-2 rounded-md bg-pine px-5 py-3 text-sm font-medium text-pine-foreground shadow-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t.primaryCta}
              <span aria-hidden>→</span>
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function passthroughSearch(s: CheckSearch): CheckSearch {
  // Preserve only defined keys so empty values don't appear in the URL.
  const out: CheckSearch = {};
  if (s.type) out.type = s.type;
  if (s.hospital) out.hospital = s.hospital;
  if (s.customName) out.customName = s.customName;
  if (s.customCutoffs) out.customCutoffs = s.customCutoffs;
  return out;
}

function FormatChoice({
  selected,
  onClick,
  label,
  help,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  help: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`rounded-lg border px-4 py-3.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        selected
          ? "border-pine bg-pine-soft/50 text-foreground"
          : "border-border bg-card text-foreground/85 hover:border-pine/40"
      }`}
    >
      <span className="block font-medium">{label}</span>
      <span className="mt-0.5 block text-xs text-muted-foreground">{help}</span>
    </button>
  );
}

/* ----------------------------- Summary ----------------------------- */

function SummaryPath() {
  const s = strings.check.summary;
  return (
    <section className="mt-10">
      <div className="rounded-xl border border-pine/30 bg-pine-soft/30 p-5">
        <h2 className="font-display text-2xl font-medium text-foreground">
          {s.heading}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/85">
          {s.lede}
        </p>
        <div className="mt-5 rounded-md border border-border bg-card p-4">
          <p className="font-display text-base font-medium text-foreground">
            {s.ctaTitle}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
            {s.ctaBody}
          </p>
        </div>
      </div>

    </section>
  );
}

/* ----------------------------- Itemized ---------------------------- */

function ItemizedPath({
  parsed,
  total,
  anyDuplicate,
  anyAmountParsed,
  surpriseConfirmed,
  onToggleSurprise,
}: {
  parsed: ParsedLine[];
  total: number;
  anyDuplicate: boolean;
  anyAmountParsed: boolean;
  surpriseConfirmed: boolean;
  onToggleSurprise: () => void;
}) {
  const it = strings.check.itemized;
  return (
    <>
      {/* Ledger */}
      <section className="mt-10">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {it.ledgerHeader}
        </p>
        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {parsed.map((l, i) => (
            <li
              key={`${i}-${l.raw}`}
              className={`flex items-baseline justify-between gap-4 px-4 py-3 ${
                l.isDuplicate ? "bg-honey-soft" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">{l.description}</p>
                {l.isDuplicate && (
                  <span className="mt-1 inline-flex items-center rounded-full border border-honey/40 bg-honey/10 px-2 py-0.5 font-mono text-xs text-honey-foreground">
                    {it.duplicateFlag}
                  </span>
                )}
              </div>
              <p className="shrink-0 font-mono text-sm tabular-nums text-foreground">
                {l.amount !== null ? fmtCurrency(l.amount) : "—"}
              </p>
            </li>
          ))}
          {anyAmountParsed && (
            <li className="flex items-baseline justify-between gap-4 bg-pine-soft/30 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {it.totalLabel}
              </p>
              <p className="font-mono text-base font-medium tabular-nums text-foreground">
                {fmtCurrency(total)}
              </p>
            </li>
          )}
        </ul>
        {!anyAmountParsed && (
          <p className="mt-3 text-xs text-muted-foreground">{it.parseFallback}</p>
        )}
      </section>

      {/* Three things */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-medium tracking-tight text-foreground">
          {it.heading}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/85">
          {it.lede}
        </p>

        <ol className="mt-5 grid gap-3">
          {it.cards
            .filter((c) => c.id !== "itemized")
            .map((c, i) => (
              <ActionCard
                key={c.id}
                index={i + 1}
                card={c}
                dimmed={c.id === "duplicate" && !anyDuplicate}
                dimmedNote={
                  c.id === "duplicate" && !anyDuplicate
                    ? it.duplicateNoneNote
                    : undefined
                }
                surpriseConfirmed={
                  c.id === "surprise" ? surpriseConfirmed : undefined
                }
                onToggleSurprise={
                  c.id === "surprise" ? onToggleSurprise : undefined
                }
              />
            ))}
        </ol>
      </section>
    </>
  );
}

type Card = (typeof strings.check.itemized.cards)[number];

function ActionCard({
  index,
  card,
  dimmed,
  dimmedNote,
  surpriseConfirmed,
  onToggleSurprise,
}: {
  index: number;
  card: Card;
  dimmed?: boolean;
  dimmedNote?: string;
  surpriseConfirmed?: boolean;
  onToggleSurprise?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <li
      className={`rounded-xl border bg-card p-5 ${
        dimmed ? "border-border/60 opacity-80" : "border-border"
      }`}
    >
      <div className="flex items-baseline gap-3">
        <span aria-hidden className="font-mono text-xs text-muted-foreground">
          {String(index).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-medium text-foreground">
            {card.label}
          </h3>
          <p className="mt-0.5 font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {card.rule}
          </p>
        </div>
      </div>

      {dimmed && dimmedNote ? (
        <p className="mt-3 pl-7 text-sm leading-relaxed text-foreground/70">
          {dimmedNote}
        </p>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="mt-3 ml-7 inline-flex items-center gap-1.5 text-sm text-pine hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
          >
            <span aria-hidden>{open ? "−" : "+"}</span>
            What this means
          </button>
          {open && (
            <div className="mt-3 ml-7 space-y-3 text-sm leading-relaxed text-foreground/85">
              <p>{card.body}</p>
              {"action" in card && (
                <p>
                  <span className="font-medium text-foreground">
                    {card.actionLabel}:
                  </span>{" "}
                  {card.action}
                </p>
              )}
              {"selfCheckPrompt" in card && (
                <div className="rounded-md border border-border bg-background p-3">
                  <p className="font-medium text-foreground">
                    {card.selfCheckLabel}
                  </p>
                  <p className="mt-1.5">{card.selfCheckPrompt}</p>
                  {card.id === "surprise" && onToggleSurprise && (
                    <label className="mt-3 flex items-start gap-2.5 rounded-md border border-border bg-card p-2.5 text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={!!surpriseConfirmed}
                        onChange={onToggleSurprise}
                        className="mt-0.5 h-4 w-4 cursor-pointer rounded border-input accent-pine focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      />
                      <span>
                        <span className="font-medium">
                          {"selfCheckConfirmLabel" in card
                            ? card.selfCheckConfirmLabel
                            : ""}
                        </span>
                        {surpriseConfirmed &&
                          "selfCheckConfirmedNote" in card && (
                            <span className="mt-1 block text-xs text-muted-foreground">
                              {card.selfCheckConfirmedNote}
                            </span>
                          )}
                      </span>
                    </label>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </li>
  );
}
