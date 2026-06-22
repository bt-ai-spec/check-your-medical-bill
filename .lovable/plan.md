# Audit — hardcoded user-facing strings (not from `src/lib/strings.ts`)

Read-only. Nothing to change yet. Grouped by file. Each entry = a literal that renders to a user (visible text, `aria-label`, `placeholder`, page `<title>`/meta, or template sentence built in code) and is **not** pulled from `strings.ts`.

I'm separating **visible on-screen copy** (highest priority for i18n) from **page metadata** (titles/descriptions in `head()`) and **accessibility labels** (aria-label / aria text), since you may want to handle them in separate passes.

---

## `src/routes/__root.tsx`

**Visible copy** — entire 404 and error fallback screens are hardcoded:
- L19 `"404"`
- L20 `"Page not found"`
- L21–22 `"The page you're looking for doesn't exist or has been moved."`
- L29 `"Go home"` (404 button)
- L48 `"This page didn't load"`
- L50–51 `"Something went wrong on our end. You can try refreshing or head back home."`
- L61 `"Try again"`
- L67 `"Go home"` (error button)

**Metadata** — root `head()`:
- L80 title `"Fair Bill — Check your California medical bill"`
- L84 description, L87 og:title, L91 og:description, L95 twitter:title
- L96–98 a *second* description / og:description / twitter:description ("Fair Bill Companion helps users…") that conflicts with the first set — worth flagging separately, but it's hardcoded.

---

## `src/components/StepTracker.tsx`

**Accessibility**:
- L18 `aria-label="Progress"`

(Step labels themselves come from `strings.common.steps` — fine.)

---

## `src/components/AppShell.tsx`

Clean — every string reads from `strings.common`. No findings.

---

## `src/routes/index.tsx`

Clean — all copy from `strings.welcome` / `strings.common`. Route `head()` meta is hardcoded (L7–18) — same category as the root metadata.

---

## `src/routes/intake.tsx`

**Visible copy**:
- L121 the hospital meta line is assembled in code: `` `${h.city}${t.hospitalCityTypeSep}Nonprofit${t.hospitalCityTypeSep}CA Fair Pricing` `` — the literals `"Nonprofit"` and `"CA Fair Pricing"` are hardcoded. The separator is from strings, but the two labels are not.

**Metadata** (L11–17): title `"Intake — Fair Bill"` + description.

---

## `src/routes/check.tsx`

**Visible copy**:
- L38–45 `EXAMPLE_TEXT` — the sample itemized bill shown when the user clicks "Try example" (six English line items with `$` amounts). User-visible and locale-sensitive.
- L640 `"What this means"` — the expand/collapse button label on every action card.
- L649 the literal `":"` punctuation after `card.actionLabel` (small, but worth knowing for languages that don't use colon).

**Accessibility**:
- L118 `aria-label="What this screen checks for"`

**Metadata** (L24–31): title `"Check it — Fair Bill"` + description.

Currency formatting (L93–99) is locale-hardcoded to `en-US` / `USD` — not a string but will need to move when localizing.

---

## `src/routes/qualify.tsx`

**Visible copy** — the `MissingQualify` fallback (L517–536) is entirely hardcoded:
- L524 `"We need to know who sent the bill before we can run this step."`
- L531 `"Back to intake"`

**Metadata** (L23–29): title `"See if you qualify — Fair Bill"` + description.

Currency formatter at L235–241 is also `en-US`/`USD`-hardcoded.

---

## `src/routes/letter.tsx`

**Visible copy**:
- L246 `"Subject"` — the eyebrow label above the rendered subject line in every letter panel.
- L75 every built letter has a hardcoded `` `Re: account {{ACCOUNT}} · date of service {{DOS}} · patient {{PATIENT}}` `` line (and a shorter variant at L100, L146, L164). The placeholders come through the strings module, but the surrounding sentence (`Re: account … · date of service … · patient …`) is built in TypeScript, not in `strings.ts`.

**Accessibility**:
- L385 `aria-label="Letter type"` (tabs)

**Metadata** (L15–22): title `"Get your letter — Fair Bill"` + description.

Currency formatter at L36–42: `en-US`/`USD`-hardcoded.

---

## `src/routes/about.tsx`

**Visible copy**:
- L204 each hospital card claim is built in code:
  `` `${h.name} — ${h.city}. Financial-assistance policy used by the qualify step.` ``
  The sentence "Financial-assistance policy used by the qualify step." is hardcoded.
- L193 / L197 the labels `` `${h.name} — ${a.hospitalSourceLabel}` `` and `` `${h.name} — ${a.hospitalExhibitBLabel}` `` use a hardcoded `" — "` glue (em-dash + spaces). The label halves come from strings; the joiner punctuation does not.

**Metadata** (L8–21): title `"About & sources — Fair Bill"` + description + og tags.

Date formatting at L37–42 is locale-hardcoded to `en-US`.

---

## Summary by priority

**Most important (visible body copy a user can read):**
1. `__root.tsx` — 404 + error pages (8 strings)
2. `qualify.tsx` — MissingQualify fallback (2 strings)
3. `check.tsx` — "What this means" button, `EXAMPLE_TEXT` sample bill
4. `letter.tsx` — `"Subject"` label, `Re: account…` line built in 4 letter builders
5. `intake.tsx` — `"Nonprofit"`, `"CA Fair Pricing"` in the hospital meta line
6. `about.tsx` — "Financial-assistance policy used by the qualify step." sentence

**Accessibility labels** (3): `aria-label="Progress"` (StepTracker), `aria-label="What this screen checks for"` (check.tsx), `aria-label="Letter type"` (letter.tsx).

**Page metadata** (`head()` titles + meta descriptions + og/twitter tags): every route file plus `__root.tsx`. None are sourced from `strings.ts`. The root also has a duplicated/conflicting description block (L96–98) — flag separately.

**Locale-coupled non-string code** (not strings, but will break with the strings during i18n): four `toLocaleString("en-US", { currency: "USD" … })` formatters in check.tsx, qualify.tsx, letter.tsx; one `toLocaleDateString("en-US", …)` in about.tsx.

No code changes proposed in this plan — this is the gap list you asked for.
