
## Fair Bill — build plan (no code yet)

Privacy-first React + Tailwind app for Californians decoding hospital bills. Everything stays in the browser; the legal corpus is bundled at build time.

---

### 1. Screens & flow

```text
Welcome → Intake → Bill check → Assistance/Leverage → Letters + resources
                                                         │
                                                         └→ Take it with you (.ics + mailto)
About & sources (linked from header on every screen)
```

| Route | Purpose |
|---|---|
| `/` | **Welcome.** Matches the screenshots: privacy promise card, 3-step "Check the bill / See if you qualify / Get your letter", "Start — nothing leaves your device" CTA. Header: Fair Bill mark + About & sources + "Pilot · CA". Top bar: "Private session — everything you enter stays on this device". |
| `/intake` | Provider type → hospital pick (if applicable) → bill basics (total, dates, itemized?, in/out of network, emergency) → household size + income → insurance status. Each field has a "Why we ask" toggle. |
| `/check` | Reads intake + corpus. Flags grouped under text headers: *Your rights as a hospital patient · California law*, *Applies to any medical bill*, *Your leverage with this provider*. Tap a flag to expand detail + provenance. |
| `/assistance` | Deterministic eligibility outcome (free / discounted / borderline / above-line / unknown) with the math shown in plain English. For non-hospital providers, no tier — leverage points instead. |
| `/letters` | Pre-filled letters (itemized request, financial-assistance application, dispute), copy-to-clipboard + `.txt` download. "Take it with you": `.ics` calendar reminders + `mailto:` to the provider's billing office. |
| `/about` | "Where these numbers come from" — every corpus entry with date and source link. "Clear my data" button. |

Persistent footer: "Working prototype · Fair Bill · …Not legal advice." matches screenshot 2.

Transition copy: every CTA names the next screen exactly. "Start — nothing leaves your device" lands on Intake's first question.

---

### 2. Client-side data model

**Persistence:** `localStorage` only, single key `fairbill.v1`. No cookies, no server, no analytics. "Clear my data" wipes the key.

**State:** one `FairBillProvider` Context fed by `useReducer` at the root. Hydration inside `useEffect` (SSR-safe). Debounced write on each commit.

```ts
type ProviderType = "hospital" | "physician_group" | "ambulance" | "lab" | "imaging" | "other";

type Intake = {
  provider: { type: ProviderType | null; hospitalId: string | null; name: string };
  bill: {
    totalCharged: number | null;
    dateOfService: string | null;
    dateReceived: string | null;
    hasItemized: boolean | null;
    inNetwork: "yes" | "no" | "unknown" | null;
    emergency: boolean | null;
  };
  household: { size: number | null; annualIncome: number | null; incomePeriod: "annual" | "monthly" };
  insurance: { status: "uninsured" | "private" | "medi_cal" | "medicare" | "other" | null; eobReceived: boolean | null };
};
```

`Derived` ({ fpl, percentOfFPL, tier, flags, rights }) is **never stored** — recomputed via `useMemo` from `Intake + corpus`.

---

### 3. Deterministic eligibility logic

Pure, unit-testable: `eligibility(intake, corpus) → { fpl, percentOfFPL, tier, missing }`.

1. **FPL lookup.** `corpus.fpl[year][householdSize]`; if size > table max, apply `additionalPerPerson`. If year missing → `tier = "unknown"`.
2. **Normalize income.** Monthly → annual (`× 12`).
3. **Percent.** `percentOfFPL = annualIncome / fpl × 100`.
4. **Pick tier source.** If hospital + `hospitalId` resolves in corpus → that hospital's `charityTiers`. Else → `corpus.california.hhFinancialAssistanceDefault` (statutory floor). Non-hospital → no tier.
5. **Map.** Apply tier thresholds in order: `≤ freeUpToPctFpl` → free; `≤ discountedUpToPctFpl` → discounted; within `borderlineBandPctFpl` → borderline; else above-line.
6. **Missing data.** Null income or size → `tier = "unknown"`, return `missing: string[]` so UI prompts without guessing.

Every number read from corpus. Nothing inlined.

---

### 4. corpus.js (single source of legal truth)

```ts
{
  meta: { version, lastReviewed },
  fpl: { "2025": { 1: 15650, 2: 21150, ..., additionalPerPerson: 5500, source: { label, url, verifiedOn } } },
  california: {
    hhFinancialAssistanceDefault: { freeUpToPctFpl, discountedUpToPctFpl, borderlineBandPctFpl, source },
    surpriseBilling: { ... },
    itemizedBillDeadlineDays: { value, source },
  },
  hospitals: { "ucsf-medical-center": { name, charityTiers, financialAssistanceUrl, phone, source } },
  rightsTags: [{ id, group, appliesTo, title, detail, source }],
  letterTemplates: { itemizedRequest, financialAssistance, dispute },
  resources: [{ label, url, source }],
}
```

Every value is `{ value, date, source }` shaped. Anything missing renders a "verify on application" placeholder — never a confident number.

---

### 5. Bill-check flag engine

`flags(intake, corpus) → Flag[]` — pure, deterministic, gated by `appliesTo` against `provider.type`. Examples:

- No itemized bill received → pine action flag (request itemization).
- Out-of-network + emergency → honey leverage (No Surprises Act).
- Hospital + low % FPL → pine (CA charity-care eligibility).
- Bill aged past `itemizedBillDeadlineDays` without itemization → honey leverage.

Severity color reinforces meaning, never carries it alone. No alarm red.

---

### 6. Letters + "Take it with you"

- Letters render client-side from `corpus.letterTemplates` with `{placeholders}` filled from intake. Copy / download `.txt`.
- `.ics` built in-browser (hand-written VCALENDAR string, no library) with reminders derived from `dateReceived` + corpus deadlines. `<a download>` blob.
- `mailto:` opens user's mail app prefilled — we never see the address.

---

### 7. Edge cases

- Household > FPL table max → `additionalPerPerson`.
- Hospital not in corpus → fall back to CA statewide default + "verify on the hospital's application".
- Year missing from FPL table → "verify" state.
- Zero/null income with rest known → free.
- Non-hospital provider → no tier; leverage-only screen with explicit copy.
- `prefers-reduced-motion` → instant transitions.
- SSR hydration → neutral first paint, never a "no data" flash.
- User clears data mid-flow → reducer resets cleanly.

---

### 8. Open questions

1. **Corpus scope on day one** — CA defaults + No Surprises Act + ~5–10 pilot hospitals, or a broader hospital list? (Default: small pilot.)
2. **Welcome on revisit** — show "Resume your session" affordance when `localStorage` has data, or always restart from Intake?
3. **Provider types** — confirm the set: hospital, physician group, ambulance, lab, imaging, other.
4. **Borderline tier UX** — its own outcome with a "verify on the hospital's application" CTA, or fold into discounted with a caveat? (Default: own outcome.)
5. **Letters set** — itemized request, financial-assistance application, dispute. Confirm or change?
6. **"Take it with you"** — `.ics` + `mailto:` only on day one (no PDF), confirm?
7. **Disclaimer placement** — persistent footer on every screen (matches screenshot 2), or only on outcome screens?

Reply with answers (or "your defaults are fine") and I'll wait for the next screenshot to start building Welcome.
