## QA pass — Fair Bill

A read-only audit across the four pillars that matter for this project: **privacy**, **legal accuracy**, **UX/copy/accessibility**, and **technical health**. No code changes — I'll deliver a findings report grouped by severity (Critical / Warning / Info), with file + line references and a recommended fix for each.

### Scope

**1. Privacy (non-negotiable)**
- Grep for any network calls touching user data: `fetch`, `axios`, `XMLHttpRequest`, `navigator.sendBeacon`, analytics SDKs, third-party script tags.
- Confirm no persistence of bill/income/household to `localStorage`/`sessionStorage`/`IndexedDB`/cookies.
- Confirm `.ics` generation and `mailto:` happen client-side; no email address ever leaves the device.
- Confirm every external `<a>` uses `target="_blank"` + `rel="noopener noreferrer"` + `referrerPolicy="no-referrer"`.
- Check that `head()` meta and fonts don't leak referrer (already see `referrer: no-referrer` in root — verify it's the only referrer policy).

**2. Legal content integrity**
- Walk every route and confirm legal figures (FPL %, dollar thresholds, discount tiers, hospital policies) are read from `src/lib/corpus.ts` — never inlined.
- Confirm "verify / confirm on application" placeholder is used wherever the corpus is missing a value (e.g., Providence 2025 Exhibit B note).
- Confirm rights tags / claims are gated by selected provider type (hospital-only rights don't render for non-hospital providers).
- Confirm the "Where these numbers come from" panel + About page sources still match the corpus (`verifiedOn` dates, source URLs resolve).
- Confirm "not legal advice" disclaimer is present on every screen that asserts a right.

**3. UX, copy & accessibility**
- Re-walk every transition (index → intake → check → qualify → letter → about) and verify button/link copy matches the destination screen exactly.
- Keyboard-only walkthrough via Playwright: tab order, visible focus, no hover-only affordances, no focus traps.
- Color-contrast check on pine / honey / clay against paper and ink (AA).
- Confirm meaning is never conveyed by color alone (icon or text label paired).
- Confirm progressive-disclosure toggles are tap/keyboard, not hover.
- Check `prefers-reduced-motion` is respected on any animation.
- Re-run the hardcoded-string audit against the latest `strings.ts` refactor to confirm nothing regressed and the consolidation didn't accidentally change visible copy.

**4. Technical health**
- Console errors / warnings on each route (via Playwright + console listener).
- Network tab: confirm zero third-party requests after first paint (fonts only).
- 404 / error boundary smoke test (navigate to `/does-not-exist`, throw in a loader).
- `head()` metadata sanity: every route has a distinct title + description; no leaked root `og:image` overriding leaves; the duplicated description block in `__root.tsx` (L96–98) noted earlier is still there — flag in report.
- SSR sanity: hit each route and confirm no `{"unhandled":true}` 500s.
- Mobile viewport (375×812) screenshot per route — tap targets ≥44px, no horizontal scroll.

### Deliverable

A single findings report:

```
CRITICAL  (privacy or legal-accuracy breakage)
  - [file:line] description + recommended fix

WARNING   (UX, a11y, copy mismatch, console errors)
  - [file:line] ...

INFO      (polish, consistency, metadata)
  - [file:line] ...
```

Plus screenshots from the Playwright walk (desktop + mobile) for any visual finding.

No code changes in this pass. After you see the report, you pick what to fix and I'll do it one issue at a time.

### One question before I start

Do you want me to include the **published site** (`check-your-medical-bill.lovable.app`) in the QA — i.e., test the live deployed build in addition to the local preview — or just the preview?
