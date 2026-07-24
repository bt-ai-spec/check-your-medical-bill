import { createFileRoute, Link } from "@tanstack/react-router";
import { useStrings } from "@/lib/i18n";
import { AppShell } from "@/components/AppShell";
import { CORPUS } from "@/lib/corpus";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & sources — Fair Bill" },
      {
        name: "description",
        content:
          "Where every number in Fair Bill comes from: California's Hospital Fair Pricing Act, the federal poverty guidelines, and each pilot hospital's published financial-assistance policy.",
      },
      { property: "og:title", content: "About & sources — Fair Bill" },
      {
        property: "og:description",
        content:
          "Trace every legal claim Fair Bill makes back to its source.",
      },
    ],
  }),
  component: AboutPage,
});

const externalLinkProps = {
  target: "_blank" as const,
  rel: "noopener noreferrer",
  referrerPolicy: "no-referrer" as const,
};

const REPO_URL = "https://github.com/bt-ai-spec/check-your-medical-bill";
const CORPUS_URL =
  "https://github.com/bt-ai-spec/check-your-medical-bill/blob/main/src/lib/corpus.ts";

function formatDate(iso: string): string {
  // iso is "YYYY-MM-DD" from corpus; render as a long, readable date.
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function SourceCard({
  claim,
  links,
  verifiedOn,
}: {
  claim: string;
  links: { label: string; url: string }[];
  verifiedOn: string;
}) {
  const a = useStrings().about;
  return (
    <li className="rounded-lg border border-border/70 bg-card p-5">
      <p className="text-base leading-relaxed text-foreground">{claim}</p>
      <ul className="mt-3 space-y-1.5">
        {links.map((l) => (
          <li key={l.url} className="text-sm leading-relaxed">
            <a
              href={l.url}
              {...externalLinkProps}
              className="text-pine underline underline-offset-4 hover:text-pine/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {l.label}
            </a>{" "}
            <span className="text-muted-foreground">{a.newTab}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
        {a.verifiedOnLabel}{" "}
        <span className="font-mono normal-case tracking-normal">
          {formatDate(verifiedOn)}
        </span>
      </p>
    </li>
  );
}

function AboutPage() {
  const a = useStrings().about;
  const fpa = CORPUS.fairPricingAct;
  const fpaClaim = a.fpaClaim.replace(
    "{{ceiling}}",
    String(fpa.eligibilityCeilingPctFpl),
  );

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-12 sm:pt-16">
        <p className="text-sm font-medium uppercase tracking-wide text-pine">
          {a.eyebrow}
        </p>
        <h1 className="mt-2 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          {a.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/85">
          {a.lede}
        </p>

        {/* 1. What Fair Bill is */}
        <section className="mt-14">
          <h2 className="text-2xl font-medium tracking-tight text-foreground">
            {a.whatTitle}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            {a.whatBody}
          </p>
        </section>

        {/* 2. Privacy */}
        <section className="mt-12">
          <h2 className="text-2xl font-medium tracking-tight text-foreground">
            {a.privacyTitle}
          </h2>
          {a.privacyBody.map((p, i) => (
            <p
              key={i}
              className="mt-3 text-base leading-relaxed text-foreground/85"
            >
              {p}
            </p>
          ))}
        </section>

        {/* 3. Limits */}
        <section className="mt-12">
          <h2 className="text-2xl font-medium tracking-tight text-foreground">
            {a.limitsTitle}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            {a.limitsIntro}
          </p>
          <ul className="mt-5 space-y-4">
            {a.limitsItems.map((item) => (
              <li
                key={item.label}
                className="rounded-lg border border-border/70 bg-card p-5"
              >
                <p className="font-sans text-base font-medium text-foreground">
                  {item.label}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. Sources */}
        <section className="mt-12">
          <h2 className="text-2xl font-medium tracking-tight text-foreground">
            {a.sourcesTitle}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            {a.sourcesIntro}
          </p>

          <ul className="mt-6 space-y-4">
            <SourceCard
              claim={a.fplClaim}
              links={[{ label: a.fplSourceLabel, url: CORPUS.fpl.source }]}
              verifiedOn={CORPUS.verifiedOn}
            />
            <SourceCard
              claim={fpaClaim}
              links={[
                { label: a.fpaSourceLabel, url: fpa.complaintUrl },
              ]}
              verifiedOn={CORPUS.verifiedOn}
            />
            <SourceCard
              claim={a.sb1061Claim}
              links={[
                { label: a.sb1061SourceLabel, url: fpa.complaintUrl },
              ]}
              verifiedOn={CORPUS.verifiedOn}
            />
          </ul>

          <h3 className="mt-10 font-sans text-sm font-semibold uppercase tracking-wide text-foreground/70">
            {a.hospitalsHeader}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-foreground/85">
            {a.hospitalsIntro}
          </p>
          <ul className="mt-5 space-y-4">
            {CORPUS.hospitals.map((h) => {
              const links: { label: string; url: string }[] = [
                { label: `${h.name} — ${a.hospitalSourceLabel}`, url: h.source },
              ];
              if (h.exhibitBSource) {
                links.push({
                  label: `${h.name} — ${a.hospitalExhibitBLabel}`,
                  url: h.exhibitBSource,
                });
              }
              return (
                <SourceCard
                  key={h.id}
                  claim={`${h.name} — ${h.city}. ${a.hospitalPolicyClaim}`}
                  links={links}
                  verifiedOn={h.verifiedOn}
                />
              );
            })}
          </ul>

          <h3 className="mt-10 font-sans text-sm font-semibold uppercase tracking-wide text-foreground/70">
            {a.resourcesHeader}
          </h3>
          <p className="mt-2 text-base leading-relaxed text-foreground/85">
            {a.resourcesIntro}
          </p>
          <ul className="mt-5 space-y-3">
            {CORPUS.resources.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-border/70 bg-card p-4"
              >
                <a
                  href={r.url}
                  {...externalLinkProps}
                  className="text-base font-medium text-pine underline underline-offset-4 hover:text-pine/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {r.name}
                </a>{" "}
                <span className="text-xs text-muted-foreground">
                  {a.newTab}
                </span>
                <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                  {r.note}
                </p>
              </li>
            ))}
          </ul>

          <h3 className="mt-10 font-sans text-sm font-semibold uppercase tracking-wide text-foreground/70">
            {a.openSourceTitle}
          </h3>
          <ul className="mt-5 space-y-4">
            <SourceCard
              claim={a.openSourceClaim}
              links={[
                { label: a.openSourceRepoLabel, url: REPO_URL },
                { label: a.openSourceCorpusLabel, url: CORPUS_URL },
              ]}
              verifiedOn={a.openSourceVerifiedOn}
            />
          </ul>
        </section>

        {/* 5. Disclaimers */}
        <section className="mt-12">
          <h2 className="text-2xl font-medium tracking-tight text-foreground">
            {a.disclaimersTitle}
          </h2>
          {a.disclaimersBody.slice(0, 2).map((p, i) => (
            <p
              key={i}
              className="mt-3 text-base leading-relaxed text-foreground/85"
            >
              {p}
            </p>
          ))}
          <p className="mt-3 text-base leading-relaxed text-foreground/85">
            {(() => {
              const openSourceSentence = a.disclaimersBody[2];
              const [beforeOpen, afterOpen] =
                openSourceSentence.split("open");
              const [beforeSingle, afterSingle] = afterOpen.split(
                "single readable file",
              );
              return (
                <>
                  {beforeOpen}
                  <a
                    href={REPO_URL}
                    {...externalLinkProps}
                    className="text-pine underline underline-offset-4 hover:text-pine/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    open
                  </a>
                  {beforeSingle}
                  <a
                    href={CORPUS_URL}
                    {...externalLinkProps}
                    className="text-pine underline underline-offset-4 hover:text-pine/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    single readable file
                  </a>
                  {afterSingle}
                </>
              );
            })()}
          </p>
        </section>

        <div className="mt-14">
          <Link
            to="/"
            className="text-sm text-pine underline underline-offset-4 hover:text-pine/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            ← {a.backHome}
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
