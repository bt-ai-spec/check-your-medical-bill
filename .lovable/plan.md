## Fair Bill — session contract & build plan

No code yet. This proposes the full shape so we can lock it in once, then build one screen per turn.

---

### 1. Screens & flow

```text
Welcome ─▶ Intake ─▶ Bill check ─▶ Assistance / Leverage ─▶ Letters + resources
                                                              │
                                                              └─▶ Take it with you (.ics + mailto)
```

Routes (TanStack file-based):

| Route | File | Purpose |
|---|---|---|
| `/` | `routes/index.tsx` | **Welcome.** What this is, privacy promise, "not legal advice", Start button. |
| `/intake` | `routes/intake.tsx` | **Intake.** Provider type, hospital (if applicable), bill basics, household size, income, insurance status. Progressive disclosure ("Why we ask"). |
| `/check` | `routes/check.tsx` | **Bill check.** Reads intake, reads corpus, lists flags grouped under text headers. Each flag taps to expand detail + provenance. |
| `/assistance` | `routes/assistance.tsx` | **Assistance / Leverage.** Deterministic eligibility tier (free / discounted / borderline / above-line) + leverage points keyed to provider type. |
| `/letters` | `routes/letters.tsx` | **Letters + resources.** Pre-filled letter previews (itemized bill request, financial-assistance application, dispute), corpus resource links, "Take it with you" panel (.ics + mailto). |
| `/about` | `routes/about.tsx` | **About + provenance.** "Where these numbers come from" — every corpus entry with date and source. |

Shared:

- Persistent footer with the "not legal advice" disclaimer and an About link.
- Per-screen "Where these numbers come from" panel on Check / Assistance / Letters.
- Back/Edit navigation never destroys data.

Transition-copy contract: every CTA names what the next screen actually shows. Example — Welcome's button says **"Start the bill check"** because the path takes you through intake to the bill check.

---

### 2. Client-side data model

**Persistence:** `localStorage` only (single key, e.g. `fairbill.v1`). No cookies, no server. A "Clear my data" button on Welcome and About wipes the key.

**State management:** one React Context (`FairBillProvider`) at the root, fed by a `useReducer`. Each screen reads + dispatches; no prop drilling. Hydration on mount from `localStorage`; persistence on each commit, debounced. SSR-safe (read inside `useEffect`).

**Shape (TypeScript):**

```ts
type ProviderType = "hospital" | "physician_group" | "ambulance" | "lab" | "imaging" | "other";

type Intake = {
  provider: {
    type: ProviderType | null;
    hospitalId: string | null;  // corpus key when type === "hospital"
    name: string;               // free text fallback
  };
  bill: {
    totalCharged: number | null;
    dateOfService: string | null;     // ISO date
    dateReceived: string | null;
    hasItemized: boolean | null;
    inNetwork: "yes" | "no" | "unknown" | null;
    emergency: boolean | null;
  };
  household: {
    size: number | null;
    annualIncome: number | null;
    incomePeriod: "annual" | "monthly";
  };
  insurance: {
    status: "uninsured" | "private" | "medi_cal" | "medicare" | "other" | null;
    eobReceived: boolean | null;
  };
};

type Derived = {
  fpl: number | null;                    // from corpus, by household size + year
  percentOfFPL: number | null;           // income / fpl * 100
  tier: "free" | "discounted" | "borderline" | "above_line" | "unknown";
  flags: Flag[];                         // computed from intake + corpus
  rights: RightsTag[];                   // gated by provider.type
};

type Flag = {
  id: string;
  group: "hospital_rights_ca" | "any_medical_bill" | "leverage";
  severity: "pine" | "honey" | "clay";   // semantic, never alarm red
  title: string;
  detail: string;
  corpusRefs: string[];                  // ids into corpus.js
};
```

**Derivation pattern:** `Derived` is **never stored** — recomputed via `useMemo` from `Intake + corpus`. Persist only what the user typed.

---

### 3. Deterministic eligibility logic

Pure function, no I/O, fully unit-testable:

```text
eligibility(intake, corpus) -> { fpl, percentOfFPL, tier, missing }
```

Steps:

1. **Lookup FPL.** `corpus.fpl[year][householdSize]`. If `householdSize > corpusMax`, apply `corpus.fpl[year].additionalPerPerson`. If the year isn't in corpus → `tier = "unknown"`, surface a "verify" state. Never guess.
2. **Compute percent.** `percentOfFPL = (annualIncome / fpl) * 100`. Convert monthly income to annual first (`× 12`).
3. **Pick the tier source.** If `provider.type === "hospital"` and `provider.hospitalId` resolves in `corpus.hospitals`, use that hospital's `charityTiers`. Otherwise fall back to `corpus.california.hhFinancialAssistanceDefault` (the statutory floor for licensed CA hospitals). For non-hospital provider types, **do not produce a tier** — show "Hospital charity-care tiers don't apply to this provider type" and route to leverage points instead.
4. **Map to tier.** Tiers from corpus are `{ freeUpToPctFpl, discountedUpToPctFpl, borderlineBandPctFpl }`. Apply in order: `≤ free` → free, `≤ discounted` → discounted, `within borderline band` → borderline, else → above_line.
5. **Missing-data handling.** If income or household size is null → `tier = "unknown"`, return a `missing: string[]` so the UI can prompt without guessing.

Every number used in this function — FPL table, tier thresholds, "additional per person" — is read from corpus. None inlined.

---

### 4. corpus.js shape (single source of legal truth)

```ts
export const corpus = {
  meta: { version: "1.0.0", lastReviewed: "YYYY-MM-DD" },
  fpl: {
    "2025": { 1: 15650, 2: 21150, /* ... */ additionalPerPerson: 5500,
              source: { label: "HHS Poverty Guidelines 2025", url: "...", verifiedOn: "YYYY-MM-DD" } },
  },
  california: {
    hhFinancialAssistanceDefault: { freeUpToPctFpl: 400, discountedUpToPctFpl: 400,
      borderlineBandPctFpl: [400, 400], source: { ... } },
    surpriseBilling: { /* AB-72 facts + source */ },
    itemizedBillDeadlineDays: { value: 15, source: { ... } },
    /* etc. */
  },
  hospitals: {
    "ucsf-medical-center": {
      name: "UCSF Medical Center",
      charityTiers: { freeUpToPctFpl: 400, discountedUpToPctFpl: 400,
        borderlineBandPctFpl: [400, 500], source: { ... } },
      financialAssistanceUrl: "...",
      patientFinancialServicesPhone: "...",
    },
    /* ... */
  },
  rightsTags: [
    { id: "ca-itemized-15-days", group: "hospital_rights_ca", appliesTo: ["hospital"],
      title: "...", detail: "...", source: { ... } },
    { id: "no-surprises-act", group: "any_medical_bill", appliesTo: ["hospital","physician_group","ambulance","lab","imaging","other"], ... },
    /* ... */
  ],
  letterTemplates: {
    itemizedRequest: { subject: "...", body: "..." /* with {placeholders} */ },
    financialAssistance: { ... },
    dispute: { ... },
  },
  resources: [ /* outbound links: HCAI, DMHC, CDI, DHCS — { label, url, source } */ ],
};
```

Any field referenced by the UI but absent from corpus renders the **"verify / confirm on application"** placeholder. Adding values is a corpus PR, not a code change.

---

### 5. Bill-check flag engine

Pure function `flags(intake, corpus) -> Flag[]`. Deterministic, no network.

Examples (each one's content comes from corpus, not invented here):

- `any_medical_bill`: itemized bill not received → request-itemized flag (pine, action).
- `any_medical_bill`: out-of-network + emergency → No Surprises Act protection (honey, leverage).
- `hospital_rights_ca`: hospital + uninsured/low-income → CA charity-care eligibility (pine).
- `leverage`: bill received >X days ago without itemization → leverage point (honey).

Flags are gated by `appliesTo` against `intake.provider.type` so a CA hospital right never appears for an ambulance bill.

---

### 6. Letters + "Take it with you"

- Letter previews are rendered client-side from `corpus.letterTemplates` with intake placeholders filled in. Copy-to-clipboard + download `.txt`.
- `.ics` generation: a small in-browser builder (no library that phones home) emits a VCALENDAR with reminder dates derived from `dateReceived` + corpus deadlines. Download triggered by an `<a download>` blob URL.
- `mailto:` link opens the user's mail app with the chosen letter pre-filled in the body. We never see the address.

---

### 7. Design system wiring (one-time, before screens)

- Tokens in `src/styles.css`: `--pine`, `--honey`, `--clay` + foreground variants, mapped through `@theme inline`. No alarm red.
- Fonts via `<link>` in `__root.tsx` head: Newsreader (display), Public Sans (body), IBM Plex Mono (amounts). CSS variables `--font-display`, `--font-body`, `--font-mono` consumed by Tailwind utilities.
- Reusable primitives: `WhyWeAsk` toggle, `FlagCard` (tap to expand), `ProvenancePanel` ("Where these numbers come from"), `Disclaimer` footer.

---

### 8. Edge cases & open questions

**Edge cases I'll handle:**

- Household size larger than corpus FPL table → use `additionalPerPerson`.
- Income period monthly vs annual → normalize to annual before percent.
- Provider type ≠ hospital → no tier, leverage-only screen with explicit "charity-care tiers don't apply here" copy.
- Hospital not in corpus → fall back to statewide CA default + a "verify on the hospital's application" note.
- Year missing from corpus FPL table → "verify" state, never a guessed number.
- Zero or null income → tier = free if other inputs known, else "unknown".
- User clears data mid-flow → reducer resets cleanly; no orphaned derived state.
- `prefers-reduced-motion` → all transitions become instant.
- SSR hydration → `localStorage` reads only inside `useEffect`; first paint shows neutral state, not "no data".

**Open questions for you before I build:**

1. **Scope of corpus on day one.** Statewide CA defaults + No Surprises Act + a small pilot list of hospitals (say 5–10), or a broader hospital list from the start?
2. **Welcome screen scope.** Does Welcome include a "Resume previous session" affordance when `localStorage` has data, or always start fresh?
3. **Provider types beyond hospital.** Confirm the set: hospital, physician group, ambulance, lab, imaging, other. Anything missing?
4. **"Borderline" tier UX.** Show as its own outcome with a "verify on the hospital's application" CTA, or fold into discounted with a caveat? My default is its own outcome.
5. **Letters.** Three templates (itemized request, financial-assistance application, dispute) — confirm, or different set?
6. **"Take it with you".** Confirm `.ics` + `mailto:` only on day one (no PDF export yet).
7. **Disclaimer placement.** Persistent footer on every screen, or only on Welcome / Check / Assistance / Letters?

Once you answer these (or say "your defaults are fine"), I'll wait for your first screenshot and build Welcome.
