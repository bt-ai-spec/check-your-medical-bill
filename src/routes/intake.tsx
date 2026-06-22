import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { strings } from "@/lib/strings";
import { AppShell } from "@/components/AppShell";
import { StepTracker } from "@/components/StepTracker";
import { CORPUS } from "@/lib/corpus";

export const Route = createFileRoute("/intake")({
  head: () => ({
    meta: [
      { title: "Intake — Fair Bill" },
      {
        name: "description",
        content:
          "Tell Fair Bill who sent the bill so it shows you only the rights and steps that apply.",
      },
    ],
  }),
  component: IntakePage,
});

type ProviderType = "hospital" | "independent" | null;

function IntakePage() {
  const t = strings.intake;

  const [providerType, setProviderType] = useState<ProviderType>("hospital");
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [showWhy, setShowWhy] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [addCutoffs, setAddCutoffs] = useState("");
  const [independentName, setIndependentName] = useState("");

  const customReady =
    addName.trim() !== "" &&
    addCutoffs.trim() !== "" &&
    /\d/.test(addCutoffs);

  const canContinue =
    (providerType === "hospital" && (hospitalId !== null || customReady)) ||
    (providerType === "independent" && independentName.trim() !== "");


  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-5 pb-20">
        <StepTracker current={0} />

        <div className="pt-10">
          <h1 className="font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-3 text-base text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Provider type + second input revealed in place */}
        <section className="mt-10">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-base font-medium text-foreground">
              {t.providerTypeLabel}
            </h2>
            <button
              type="button"
              onClick={() => setShowWhy((v) => !v)}
              aria-expanded={showWhy}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
            >
              <span aria-hidden>?</span>
              {t.providerTypeWhyToggle}
            </button>
          </div>

          {showWhy && (
            <p className="mt-3 rounded-md border border-border bg-card p-4 text-sm leading-relaxed text-foreground/85">
              {t.providerTypeWhyBody}
            </p>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <ProviderChoice
              selected={providerType === "hospital"}
              onClick={() => setProviderType("hospital")}
              label={t.providerHospital}
            />
            <ProviderChoice
              selected={providerType === "independent"}
              onClick={() => setProviderType("independent")}
              label={t.providerIndependent}
            />
          </div>

          <div className="mt-6">
            {providerType === "hospital" && (
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-base font-medium text-foreground">
                    {t.hospitalLabel}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowAbout((v) => !v)}
                    aria-expanded={showAbout}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                  >
                    <span aria-hidden>?</span>
                    {t.hospitalAboutToggle}
                  </button>
                </div>

                {showAbout && (
                  <p className="mt-3 rounded-md border border-border bg-card p-4 text-sm leading-relaxed text-foreground/85">
                    {t.hospitalAboutBody}
                  </p>
                )}

                <ul className="mt-4 grid gap-3" role="radiogroup" aria-label={t.hospitalLabel}>
                  {CORPUS.hospitals.map((h) => {
                    const selected = hospitalId === h.id;
                    const meta = `${h.city}${t.hospitalCityTypeSep}Nonprofit${t.hospitalCityTypeSep}CA Fair Pricing`;
                    return (
                      <li key={h.id}>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => {
                            setHospitalId(h.id);
                            setShowAdd(false);
                          }}
                          className={`group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                            selected
                              ? "border-pine bg-pine-soft/40"
                              : "border-border bg-card hover:border-pine/40"
                          }`}
                        >
                          <span
                            aria-hidden
                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${
                              selected ? "border-pine/40 bg-card" : "border-border bg-background"
                            }`}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1f5d4c" strokeWidth="1.6">
                              <path d="M4 21V8l8-4 8 4v13" />
                              <path d="M9 21v-6h6v6" />
                              <path d="M9 11h.01M15 11h.01M9 14h.01M15 14h.01" strokeLinecap="round" />
                            </svg>
                          </span>
                          <span className="flex-1">
                            <span className="block font-display text-lg font-medium text-foreground">
                              {h.name}
                            </span>
                            <span className="mt-0.5 block text-sm text-muted-foreground">
                              {meta}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Add it */}
                <div className="mt-3">
                  {!showAdd ? (
                    <button
                      type="button"
                      onClick={() => {
                        setShowAdd(true);
                        setHospitalId(null);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/60 px-4 py-3.5 text-sm font-medium text-pine hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <span aria-hidden>+</span>
                      {t.hospitalAddTitle}
                    </button>
                  ) : (
                    <div className="rounded-xl border border-border bg-card p-5">
                      <p className="font-display text-lg font-medium text-foreground">
                        {t.hospitalAddTitle}
                      </p>
                      <p className="mt-2 text-sm text-foreground/80">
                        {t.hospitalAddIntro}
                      </p>

                      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {t.hospitalAddHowTitle}
                      </p>
                      <ul className="mt-2 space-y-1.5 text-sm text-foreground/80">
                        <li className="flex gap-2"><span aria-hidden className="text-pine">·</span>{t.hospitalAddHowOne}</li>
                        <li className="flex gap-2"><span aria-hidden className="text-pine">·</span>{t.hospitalAddHowTwo}</li>
                        <li className="flex gap-2"><span aria-hidden className="text-pine">·</span>{t.hospitalAddHowThree}</li>
                      </ul>

                      <div className="mt-5 grid gap-4">
                        <label className="block text-sm">
                          <span className="block font-medium text-foreground">
                            {t.hospitalAddNameLabel}
                          </span>
                          <input
                            type="text"
                            value={addName}
                            onChange={(e) => setAddName(e.target.value)}
                            placeholder={t.hospitalAddNamePlaceholder}
                            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          />
                        </label>
                        <label className="block text-sm">
                          <span className="block font-medium text-foreground">
                            {t.hospitalAddCutoffsLabel}
                          </span>
                          <textarea
                            value={addCutoffs}
                            onChange={(e) => setAddCutoffs(e.target.value)}
                            placeholder={t.hospitalAddCutoffsPlaceholder}
                            rows={3}
                            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          />
                          {addCutoffs.trim().length > 0 && !/\d/.test(addCutoffs) && (
                            <p className="mt-2 text-sm text-honey">
                              {t.hospitalAddCutoffsError}
                            </p>
                          )}
                        </label>
                      </div>

                      <p className="mt-3 text-xs text-muted-foreground">
                        {t.hospitalAddSessionNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {providerType === "independent" && (
              <label className="block">
                <span className="block text-base font-medium text-foreground">
                  {t.independentLabel}
                </span>
                <input
                  type="text"
                  value={independentName}
                  onChange={(e) => setIndependentName(e.target.value)}
                  placeholder={t.independentPlaceholder}
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                />
                <p className="mt-3 text-sm text-muted-foreground">
                  {t.independentHelp}
                </p>
              </label>
            )}
          </div>
        </section>

        {providerType !== null && <RightsSection providerType={providerType} />}

        {/* Actions */}
        <div className="mt-12 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span aria-hidden>←</span>
            {t.backToWelcome}
          </Link>
          {canContinue && providerType === "independent" ? (
            <Link
              to="/check"
              search={{ type: "independent" as const }}
              className="inline-flex items-center gap-2 rounded-md bg-pine px-5 py-3 text-sm font-medium text-pine-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t.primaryCta}
              <span aria-hidden>→</span>
            </Link>
          ) : canContinue && providerType === "hospital" && hospitalId ? (
            <Link
              to="/check"
              search={{ type: "hospital" as const, hospital: hospitalId }}
              className="inline-flex items-center gap-2 rounded-md bg-pine px-5 py-3 text-sm font-medium text-pine-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t.primaryCta}
              <span aria-hidden>→</span>
            </Link>
          ) : canContinue && providerType === "hospital" && customReady ? (
            <Link
              to="/check"
              search={{
                type: "hospital" as const,
                customName: addName,
                customCutoffs: addCutoffs,
              }}
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

function ProviderChoice({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
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
      {label}
    </button>
  );
}

type RightTag = { label: string; body: string };
type RightGroup = { header: string; tags: RightTag[] };

function RightsSection({ providerType }: { providerType: "hospital" | "independent" }) {
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

  const groups: RightGroup[] =
    providerType === "hospital"
      ? [
          {
            header: r.hospitalHeader,
            tags: [
              { label: r.hospItemized.label, body: r.hospItemized.body },
              { label: fill(r.hospCharity.label), body: fill(r.hospCharity.body) },
              { label: r.hospNoCollections.label, body: r.hospNoCollections.body },
            ],
          },
          {
            header: r.anyBillHeader,
            tags: [
              { label: r.anySurprise.label, body: r.anySurprise.body },
              { label: r.anyItemized.label, body: r.anyItemized.body },
              { label: r.anyCreditReporting.label, body: r.anyCreditReporting.body },
            ],
          },
        ]
      : [
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
                const id = `${providerType}-${g.header}-${tag.label}`;
                const open = openTags.has(id);
                return (
                  <li
                    key={id}
                    className={open ? "w-full" : "w-fit"}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(id)}
                      aria-expanded={open}
                      className="inline-flex items-center gap-1.5 rounded-full border border-pine/40 bg-pine-soft/40 px-3 py-1.5 text-sm font-medium text-pine focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <span
                        aria-hidden
                        className={`inline-flex h-4 w-4 items-center justify-center transition-transform ${open ? "rotate-45" : ""}`}
                      >
                        +
                      </span>
                      <span>{tag.label}</span>
                    </button>
                    {open && (
                      <div className="mt-2 rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-foreground/80">
                        {tag.body}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

