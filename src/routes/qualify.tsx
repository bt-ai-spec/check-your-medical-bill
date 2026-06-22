import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { strings } from "@/lib/strings";
import { AppShell } from "@/components/AppShell";
import { StepTracker } from "@/components/StepTracker";
import { CORPUS } from "@/lib/corpus";

const searchSchema = z.object({
  type: z.enum(["hospital", "independent"]).optional(),
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
  const { type } = Route.useSearch();

  if (type === "independent") {
    return <IndependentQualify />;
  }

  // Hospital path is built separately. Render a minimal placeholder so the
  // route doesn't crash, but don't change hospital behavior here.
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-5 pb-20">
        <StepTracker current={2} />
        <div className="pt-10">
          <p className="text-sm text-muted-foreground">
            This step isn't built yet for this path.
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

function IndependentQualify() {
  const q = strings.qualify.independent;
  const r = strings.intake.rights;
  const ceiling = CORPUS.fairPricingAct.eligibilityCeilingPctFpl;
  const fill = (s: string) => s.replace("{{ceiling}}", String(ceiling));

  const [openTags, setOpenTags] = useState<Set<string>>(new Set());
  const toggle = (id: string) => {
    setOpenTags((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const groups = [
    {
      header: r.anyBillHeader,
      tags: [
        { label: r.anySurprise.label, body: r.anySurprise.body },
        { label: r.anyItemized.label, body: r.anyItemized.body },
        { label: r.anyCreditReporting.label, body: r.anyCreditReporting.body },
      ],
    },
    {
      header: r.leverageHeader,
      tags: [
        { label: r.levSelfPay.label, body: r.levSelfPay.body },
        { label: r.levHardship.label, body: r.levHardship.body },
        { label: r.levPaymentPlan.label, body: r.levPaymentPlan.body },
      ],
    },
  ];

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-5 pb-20">
        <StepTracker current={2} />

        <div className="pt-10">
          <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
            {q.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            {q.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-foreground/85">
            {q.lede}
          </p>
        </div>

        <section className="mt-10">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {q.cardsHeader}
          </h2>
          <ol className="mt-4 grid gap-3">
            {q.cards.map((c, i) => (
              <li
                key={c.label}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-baseline gap-3">
                  <span
                    aria-hidden
                    className="font-mono text-xs text-muted-foreground"
                  >
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

        {/* Rights for the independent path */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-medium tracking-tight text-foreground">
            {r.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{r.intro}</p>
          <p className="mt-1 text-xs text-muted-foreground">{r.expandHint}</p>

          <div className="mt-6 space-y-8">
            {groups.map((g) => (
              <div key={g.header}>
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {g.header}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {g.tags.map((tag) => {
                    const id = `${g.header}-${tag.label}`;
                    const open = openTags.has(id);
                    return (
                      <li key={id} className={open ? "w-full" : "w-fit"}>
                        <button
                          type="button"
                          onClick={() => toggle(id)}
                          aria-expanded={open}
                          className="inline-flex items-center gap-1.5 rounded-full border border-pine/40 bg-pine-soft/40 px-3 py-1.5 text-sm font-medium text-pine focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          <span
                            aria-hidden
                            className={`inline-flex h-4 w-4 items-center justify-center transition-transform ${
                              open ? "rotate-45" : ""
                            }`}
                          >
                            +
                          </span>
                          <span>{fill(tag.label)}</span>
                        </button>
                        {open && (
                          <div className="mt-2 rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-foreground/80">
                            {fill(tag.body)}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
            {q.contextNote}
          </p>
        </section>

        <div className="mt-12 flex items-center justify-between gap-4">
          <Link
            to="/intake"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span aria-hidden>←</span>
            {q.back}
          </Link>
          <button
            type="button"
            disabled
            aria-disabled
            title={q.primaryCtaPendingNote}
            className="inline-flex items-center gap-2 rounded-md bg-pine px-5 py-3 text-sm font-medium text-pine-foreground shadow-sm transition-opacity disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {q.primaryCta}
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
