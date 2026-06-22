import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { strings } from "@/lib/strings";
import { AppShell } from "@/components/AppShell";
import { StepTracker } from "@/components/StepTracker";
import { CORPUS, eligibilityTier, fplFor, type Hospital } from "@/lib/corpus";
import { writeLetterContext } from "@/lib/letter-context";

const searchSchema = z.object({
  type: z.enum(["hospital", "independent"]).optional(),
  hospital: z.string().optional(),
  customName: z.string().optional(),
  customCutoffs: z.string().optional(),
  providerName: z.string().optional(),
});


export const Route = createFileRoute("/qualify")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "See if you qualify — Fair Bill" },
      {
        name: "description",
        content:
          "What actually works to bring down a medical bill — tailored to who sent it.",
      },
    ],
  }),
  component: QualifyPage,
});

function QualifyPage() {
  const search = Route.useSearch();
  if (search.type === "independent") return <IndependentQualify />;
  if (search.type === "hospital") {
    const hospital = search.hospital
      ? CORPUS.hospitals.find((h) => h.id === search.hospital) ?? null
      : null;
    if (hospital) return <HospitalQualify hospital={hospital} />;
    if (search.customName && search.customCutoffs) {
      return (
        <CustomHospitalQualify
          name={search.customName}
          cutoffs={search.customCutoffs}
        />
      );
    }
  }
  return <MissingQualify />;
}

/* ----------------------- Shared shell pieces ---------------------- */

function PageShell({
  eyebrow,
  title,
  lede,
  children,
  primaryReady = false,
  primaryLabel,
  primaryPendingNote,
  backLabel,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  children: React.ReactNode;
  primaryReady?: boolean;
  primaryLabel: string;
  primaryPendingNote: string;
  backLabel: string;
}) {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-5 pb-20">
        <StepTracker current={2} />
        <div className="pt-10">
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/85">
            {lede}
          </p>
        </div>
        {children}
        <div className="mt-12 flex items-center justify-between gap-4">
          <Link
            to="/check"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span aria-hidden>←</span>
            {backLabel}
          </Link>
          {primaryReady ? (
            <Link
              to="/letter"
              className="inline-flex items-center gap-2 rounded-md bg-pine px-5 py-3 text-sm font-medium text-pine-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {primaryLabel}
              <span aria-hidden>→</span>
            </Link>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled
              title={primaryPendingNote}
              className="inline-flex items-center gap-2 rounded-md bg-pine px-5 py-3 text-sm font-medium text-pine-foreground shadow-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {primaryLabel}
              <span aria-hidden>→</span>
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

/* --------------------------- Independent --------------------------- */

function IndependentQualify() {
  const q = strings.qualify.independent;

  useEffect(() => {
    writeLetterContext({ qualify: { kind: "independent" } });
  }, []);

  return (
    <PageShell
      eyebrow={q.eyebrow}
      title={q.title}
      lede={q.lede}
      primaryReady
      primaryLabel={q.primaryCta}
      primaryPendingNote={q.primaryCtaPendingNote}
      backLabel={q.back}
    >
      <section className="mt-10">
        <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground font-sans">
          {q.cardsHeader}
        </h2>
        <ol className="mt-4 grid gap-3">
          {q.cards.map((c, i) => (
            <li
              key={c.label}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-baseline gap-3">
                <span aria-hidden className="font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-lg font-medium text-foreground">
                  {c.label}
                </h3>
              </div>
              <p className="mt-2 pl-7 text-sm leading-relaxed text-foreground/80">
                {c.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
        {q.contextNote}
      </p>
    </PageShell>
  );
}

/* ----------------------- Hospital · verified ----------------------- */

function HouseholdInputs({
  household,
  setHousehold,
  income,
  setIncome,
}: {
  household: string;
  setHousehold: (v: string) => void;
  income: string;
  setIncome: (v: string) => void;
}) {
  const h = strings.qualify.hospital;
  return (
    <section className="mt-10">
      <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground font-sans">
        {h.inputsHeader}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="block font-medium text-foreground">
            {h.householdLabel}
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={household}
            onChange={(e) => setHousehold(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
          <span className="mt-1 block text-xs text-muted-foreground">
            {h.householdHelp}
          </span>
        </label>
        <label className="block text-sm">
          <span className="block font-medium text-foreground">
            {h.incomeLabel}
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder={h.incomePlaceholder}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
          <span className="mt-1 block text-xs text-muted-foreground">
            {h.incomeHelp}
          </span>
        </label>
      </div>
    </section>
  );
}

function fmtCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function HospitalQualify({ hospital }: { hospital: Hospital }) {
  const h = strings.qualify.hospital;
  const [household, setHousehold] = useState("");
  const [income, setIncome] = useState("");
  const [showSources, setShowSources] = useState(false);
  const [showMath, setShowMath] = useState(false);

  const size = parseInt(household, 10);
  const inc = parseFloat(income);
  const ready =
    Number.isFinite(size) && Number.isInteger(size) && size >= 1 &&
    Number.isFinite(inc) && inc >= 0;

  const fillH = (s: string) =>
    s
      .replace("{{hospital}}", hospital.name)
      .replace("{{verifiedOn}}", hospital.verifiedOn);

  const result = useMemo(
    () => (ready ? eligibilityTier(inc, size, hospital) : null),
    [ready, inc, size, hospital],
  );

  useEffect(() => {
    writeLetterContext({
      qualify: {
        kind: "hospital",
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        eligibility: result?.key,
        income: ready ? inc : undefined,
        household: ready ? size : undefined,
        pct: result?.pct,
      },
    });
  }, [hospital.id, hospital.name, result, ready, inc, size]);

  return (
    <PageShell
      eyebrow={h.eyebrow}
      title={h.title}
      lede={h.lede}
      primaryReady={!!result}
      primaryLabel={h.primaryCta}
      primaryPendingNote={h.primaryCtaPendingNote}
      backLabel={h.back}
    >
      <p className="mt-6 rounded-md border border-border bg-card p-4 text-sm leading-relaxed text-foreground/85">
        {fillH(h.verifiedNote)}
      </p>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setShowSources((v) => !v)}
          aria-expanded={showSources}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
        >
          <span aria-hidden>?</span>
          {h.sourcesToggle}
        </button>
        {showSources && (
          <ul className="mt-3 space-y-2 rounded-md border border-border bg-card p-4 text-sm">
            <li>
              <a
                href={CORPUS.fpl.source}
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                className="text-pine underline-offset-2 hover:underline"
              >
                {h.sourcesFplLabel}
              </a>
              <span className="ml-2 text-xs text-muted-foreground">{h.newTab}</span>
            </li>
            <li>
              <a
                href={hospital.source}
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                className="text-pine underline-offset-2 hover:underline"
              >
                {fillH(h.sourcesHospitalLabel)}
              </a>
              <span className="ml-2 text-xs text-muted-foreground">{h.newTab}</span>
            </li>
            {hospital.exhibitBSource && (
              <li>
                <a
                  href={hospital.exhibitBSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="text-pine underline-offset-2 hover:underline"
                >
                  {fillH(h.sourcesExhibitBLabel)}
                </a>
                <span className="ml-2 text-xs text-muted-foreground">{h.newTab}</span>
              </li>
            )}
          </ul>
        )}
      </div>

      <HouseholdInputs
        household={household}
        setHousehold={setHousehold}
        income={income}
        setIncome={setIncome}
      />

      {result && ready && (
        <section className="mt-8 rounded-xl border border-pine/30 bg-pine-soft/30 p-5">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground font-sans">
            {h.resultHeader}
          </h2>
          <h3 className="mt-3 text-2xl font-medium text-foreground">
            {result.label}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-foreground/85">
            {h.resultNotes[result.key]}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-foreground">
            {h.summary
              .replace("{{hospital}}", hospital.name)
              .replace("{{range}}", h.ranges[result.key])}
          </p>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => setShowMath((v) => !v)}
              aria-expanded={showMath}
              className="inline-flex items-center gap-1.5 text-sm text-pine hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
            >
              <span aria-hidden>{showMath ? "−" : "+"}</span>
              {h.mathToggle}
            </button>
            {showMath && (
              <dl className="mt-3 grid gap-2 rounded-md border border-border bg-card p-4 font-mono text-sm">
                <Row label={h.mathIncomeLabel} value={fmtCurrency(inc)} />
                <Row label={h.mathHouseholdLabel} value={String(size)} />
                <Row
                  label={h.mathFplLabel.replace("{{size}}", String(size))}
                  value={fmtCurrency(fplFor(size))}
                />
                <Row label={h.mathPctLabel} value={`${result.pct}%`} />
              </dl>
            )}
          </div>
        </section>
      )}
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-1.5 last:border-0 last:pb-0">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}

/* ----------------------- Hospital · custom ----------------------- */

function CustomHospitalQualify({
  name,
  cutoffs,
}: {
  name: string;
  cutoffs: string;
}) {
  const h = strings.qualify.hospital;
  const s = strings.intake;
  const [household, setHousehold] = useState("");
  const [income, setIncome] = useState("");

  const size = parseInt(household, 10);
  const inc = parseFloat(income);
  const ready =
    Number.isFinite(size) && Number.isInteger(size) && size >= 1 &&
    Number.isFinite(inc) && inc >= 0;
  const pct = ready ? Math.round((inc / fplFor(size)) * 100) : null;

  useEffect(() => {
    writeLetterContext({
      qualify: {
        kind: "hospital",
        hospitalName: name,
        income: ready ? inc : undefined,
        household: ready ? size : undefined,
        pct: pct ?? undefined,
      },
    });
  }, [name, ready, inc, size, pct]);

  const fill = (str: string) =>
    str
      .replace("{{pct}}", String(pct ?? ""))
      .replace("{{size}}", String(size))
      .replace("{{hospital}}", name);

  return (
    <PageShell
      eyebrow={h.eyebrow}
      title={h.title}
      lede={h.lede}
      primaryReady={ready}
      primaryLabel={h.primaryCta}
      primaryPendingNote={h.primaryCtaPendingNote}
      backLabel={h.back}
    >
      <HouseholdInputs
        household={household}
        setHousehold={setHousehold}
        income={income}
        setIncome={setIncome}
      />

      {ready && pct !== null && (
        <section className="mt-8 rounded-xl border border-pine/30 bg-pine-soft/30 p-5">
          <h2 className="font-display text-lg font-medium text-foreground">
            {s.selfCheckTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground">
            {fill(s.selfCheckFplLine)}
          </p>

          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {fill(s.selfCheckCutoffsLabel)}
            </p>
            <pre className="mt-2 whitespace-pre-wrap rounded-md border border-border bg-card p-3 font-mono text-sm text-foreground">
              {cutoffs}
            </pre>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-foreground/85">
            {fill(s.selfCheckCompareGuide)}
          </p>

          <p className="mt-4 rounded-md border border-border bg-card p-3 text-sm leading-relaxed text-foreground/80">
            {fill(s.selfCheckHonesty)}
          </p>

          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {h.sourcesToggle}
            </p>
            <a
              href={CORPUS.fpl.source}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              className="mt-2 inline-block text-sm text-pine underline-offset-2 hover:underline"
            >
              {h.sourcesFplLabel}{" "}
              <span className="text-xs text-muted-foreground">{h.newTab}</span>
            </a>
          </div>
        </section>
      )}
    </PageShell>
  );
}

/* --------------------------- Fallback ----------------------------- */

function MissingQualify() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-5 pb-20">
        <StepTracker current={2} />
        <div className="pt-10">
          <p className="text-sm text-muted-foreground">
            We need to know who sent the bill before we can run this step.
          </p>
          <Link
            to="/intake"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span aria-hidden>←</span>
            Back to intake
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
