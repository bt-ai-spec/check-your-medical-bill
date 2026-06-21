## Plan: Save house rules, then pause for assets

No UI changes yet. This plan only persists the rules so every future change in this project follows them automatically.

### Step 1 — Write `mem://index.md`

Core rules (always-on, applied to every action):

- **Privacy:** All user data stays client-side. No accounts, server storage, analytics, LLM calls, or third-party APIs that transmit user data. `.ics` generated in-browser; sharing via `mailto:` only.
- **External links:** `target="_blank"` + `rel="noopener noreferrer"` + `referrerPolicy="no-referrer"`.
- **Legal content:** All legal figures come from `corpus.js` with `{ value, date, source }`. Missing values render a "verify" placeholder — never a confident number. Never assert a right that doesn't apply to the selected provider type. Keep "not legal advice" disclaimer + "Where these numbers come from" panel + About page sourcing from corpus.
- **Design tokens:** pine = action/relief, honey = caution/leverage, clay = serious flag. No alarm red. Fonts: Newsreader (display), Public Sans (body), IBM Plex Mono (amounts).
- **Match screenshots.** Don't redesign working screens without asking.
- **Progressive disclosure:** calm screens; field descriptions behind a "Why we ask" toggle; flag/tag detail expands on tap. Tap/keyboard, never hover-only.
- **Rights tags grouped under text headers** ("Your rights as a hospital patient · California law" / "Applies to any medical bill" / "Your leverage with this provider"). Color reinforces, never conveys meaning alone.
- **Accessibility (required):** keyboard focus, AA contrast, labels, `prefers-reduced-motion`.
- **Copy:** plain, dignified, no over-promising ("check your bill," not "lower your bill"). Transition copy must match the destination screen exactly.
- **Working style:** explain plan first, build one screen/feature at a time.

### Step 2 — Write detail memory files

- `mem://constraints/privacy.md` (type: constraint) — full privacy rule set with rationale, so it can never be re-proposed.
- `mem://constraints/legal-content.md` (type: constraint) — corpus-only legal values, "verify" placeholder, provider-type gating, disclaimer + provenance UI.
- `mem://design/tokens.md` (type: design) — pine/honey/clay semantics, no alarm red, font roles, progressive disclosure, rights-tag grouping, a11y bar.
- `mem://preferences/working-style.md` (type: preference) — plan first, one screen at a time, don't redesign without asking, re-read transition copy against destination.

Index file links to each with a one-line description so future sessions retrieve the right one by topic.

### Step 3 — Stop and wait

No code, no scaffolding, no `corpus.js` yet. Next turn: you share the first screenshot + the corpus values for that screen, and I'll plan that single screen against the saved rules.

### Technical notes

- Memory writes only. No file changes under `src/`, no dependency installs, no route changes.
- `mem://` files are written via the standard file-write tool in build mode.
