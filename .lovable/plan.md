# Typography consistency pass

## Goal
Fix genuine font-family mismatches against the two-font system: Newsreader for headings/display, Public Sans for body.

## Done
- `src/routes/index.tsx`: removed `font-display` from eyebrow `<p>` (33) and step-card title `<p>` (61) → body is Public Sans.
- `src/routes/intake.tsx`: removed `font-display` from hospital-name `<span>` (151) → body is Public Sans. Promoted "Add it" panel title from `<p className="font-display">` to `<h3>` (180) → inherits Newsreader correctly. Switched rights-section eyebrow `<h3>` (415) to `font-sans` → Public Sans uppercase micro-label.
- `src/routes/qualify.tsx`: switched three uppercase micro-headings (`<h2>` at 145, 193, 357) to `font-sans`. Promoted result label from `<p className="font-display">` to `<h3>` (360) → inherits Newsreader correctly.
- `src/routes/check.tsx`: promoted summary CTA title from `<p className="font-display">` to `<h3>` (477) → inherits Newsreader correctly.
- Left `src/components/AppShell.tsx:52` brand wordmark in Newsreader (intentional).
- Left the global `h1/h2/h3 → font-display` base rule in `src/styles.css` unchanged.

## Flagged for later (not changed in this pass)
- The brand wordmark "Fair Bill" is rendered as a `<p>` in `src/components/AppShell.tsx:52` and as an `<h1>` in `src/routes/__root.tsx:47`. Two different element/weight combinations for the same wordmark. The `<h1>` in `__root.tsx` may also compete with the page's real `<h1>` for heading hierarchy. Needs a separate semantic/accessibility review.
