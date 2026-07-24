// Pure letter generation. Given a LetterContext and localized strings,
// produce the tabs to show and their subject/body copy. Shared by /letter
// and /demo so the demo renders a real generated letter, not a mockup.

import type { Strings } from "@/lib/i18n";
import type { LetterContext } from "@/lib/letter-context";

export type TabId = "itemized" | "dispute" | "assistance" | "leverage";

export type RenderedLetter = {
  id: TabId;
  subject: string;
  body: string[];
};

function fmtCurrency(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export function deriveProviderName(ctx: LetterContext, strings: Strings): string {
  if (ctx.provider?.name) return ctx.provider.name;
  if (ctx.qualify?.kind === "hospital") return ctx.qualify.hospitalName;
  return strings.letter.placeholders.providerFallback;
}

function buildItemized(ctx: LetterContext, strings: Strings): RenderedLetter {
  const t = strings.letter.itemized;
  const ph = strings.letter.placeholders;
  const provider = deriveProviderName(ctx, strings);
  return {
    id: "itemized",
    subject: t.subject.replace("{{ACCOUNT}}", ph.accountNumber),
    body: [
      `${ph.todayDate}`,
      t.greeting.replace("{{PROVIDER}}", provider),
      `Re: account ${ph.accountNumber} · date of service ${ph.dateOfService} · patient ${ph.patientName}`,
      ...t.body,
      t.signoff,
      `${ph.patientName}\n${ph.address}`,
    ],
  };
}

function buildDispute(ctx: LetterContext, strings: Strings): RenderedLetter {
  const t = strings.letter.dispute;
  const ph = strings.letter.placeholders;
  const provider = deriveProviderName(ctx, strings);
  const dups = ctx.check?.duplicates ?? [];
  const paragraphs: string[] = [
    `${ph.todayDate}`,
    t.greeting.replace("{{PROVIDER}}", provider),
    `Re: account ${ph.accountNumber} · date of service ${ph.dateOfService} · patient ${ph.patientName}`,
    t.intro,
  ];
  if (dups.length > 0) {
    paragraphs.push(`${t.duplicateHeader}.`);
    paragraphs.push(t.duplicateLead);
    paragraphs.push(
      dups
        .map((d) =>
          t.duplicateLineFormat
            .replace("{{DESC}}", d.description)
            .replace("{{AMT}}", d.amount !== null ? fmtCurrency(d.amount) : "—"),
        )
        .join("\n"),
    );
  }
  if (ctx.check?.surpriseConfirmed) {
    paragraphs.push(`${t.surpriseHeader}.`);
    paragraphs.push(t.surpriseBody.replace("{{IN_NETWORK}}", ph.providerInNetwork));
  }
  paragraphs.push(t.ask);
  paragraphs.push(t.signoff);
  paragraphs.push(`${ph.patientName}\n${ph.address}`);
  return { id: "dispute", subject: t.subject.replace("{{ACCOUNT}}", ph.accountNumber), body: paragraphs };
}

function buildAssistance(ctx: LetterContext, strings: Strings): RenderedLetter {
  const t = strings.letter.assistance;
  const ph = strings.letter.placeholders;
  const q = ctx.qualify?.kind === "hospital" ? ctx.qualify : null;
  const hospitalName = q?.hospitalName ?? ph.providerFallback;
  const elig: keyof typeof t.eligibility = q?.eligibility ?? "unknown";
  const eligPara = t.eligibility[elig]
    .replace("{{PCT}}", q?.pct != null ? String(q.pct) : ph.accountNumber)
    .replace(
      "{{HOUSEHOLD}}",
      q?.household != null ? String(q.household) : "[household size]",
    );
  const ask = t.ask.replace("{{ACCOUNT}}", ph.accountNumber).replace("{{DOS}}", ph.dateOfService);
  return {
    id: "assistance",
    subject: t.subject.replace("{{HOSPITAL}}", hospitalName),
    body: [
      `${ph.todayDate}`,
      t.greeting.replace("{{HOSPITAL}}", hospitalName),
      `Re: account ${ph.accountNumber} · patient ${ph.patientName}`,
      t.intro.replace("{{HOSPITAL}}", hospitalName),
      eligPara,
      t.collections,
      ask,
      t.signoff,
      `${ph.patientName}\n${ph.address}`,
    ],
  };
}

function buildLeverage(ctx: LetterContext, strings: Strings): RenderedLetter {
  const t = strings.letter.leverage;
  const ph = strings.letter.placeholders;
  const provider = deriveProviderName(ctx, strings);
  return {
    id: "leverage",
    subject: t.subject.replace("{{PROVIDER}}", provider),
    body: [
      `${ph.todayDate}`,
      t.greeting.replace("{{PROVIDER}}", provider),
      `Re: account ${ph.accountNumber} · patient ${ph.patientName}`,
      t.intro,
      t.askSelfPay,
      t.askHardship,
      t.askPaymentPlan.replace("{{MONTHLY}}", ph.monthlyAmount),
      t.collections,
      t.ask.replace("{{ACCOUNT}}", ph.accountNumber),
      t.signoff,
      `${ph.patientName}\n${ph.address}`,
    ],
  };
}

export function chooseTabs(ctx: LetterContext, strings: Strings): RenderedLetter[] {
  const out: RenderedLetter[] = [];
  const check = ctx.check;
  const qualify = ctx.qualify;

  const needsItemized = !check || check.format === "summary" || check.format === undefined;
  if (needsItemized) out.push(buildItemized(ctx, strings));

  const hasDispute = (check?.duplicates?.length ?? 0) > 0 || !!check?.surpriseConfirmed;
  if (hasDispute) out.push(buildDispute(ctx, strings));

  if (
    qualify?.kind === "hospital" &&
    ctx.provider?.name &&
    qualify.hospitalName === ctx.provider.name
  ) {
    out.push(buildAssistance(ctx, strings));
  } else if (qualify?.kind === "independent") {
    out.push(buildLeverage(ctx, strings));
  }

  return out;
}

export function letterToPlainText(l: RenderedLetter): string {
  return [`Subject: ${l.subject}`, "", ...l.body].join("\n\n");
}
