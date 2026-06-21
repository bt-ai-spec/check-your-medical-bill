## Welcome screen — build plan

Build only `/` (Welcome). Everything else stays untouched. English-first, localization-ready.

---

### 1. Files

- **`src/lib/strings.ts`** (new) — single source of user-facing copy. Flat object, full sentences as named keys. Welcome keys only for now; structure leaves room for later screens/locales.
  ```ts
  export const strings = {
    common: {
      brandName: "Fair Bill",
      pilotTag: "Pilot · CA",
      aboutLink: "About & sources",
      privacyBar: "Private session — everything you enter stays on this device.",
      footerDisclaimer: "Working prototype · Not legal advice.",
    },
    welcome: {
      tagline: "Check your bill.",
      intro: "Fair Bill helps you read and act on a confusing or unfair California medical bill.",
      audience: "Built for Californians facing a hospital, clinic, or other medical bill that doesn't add up.",
      freshSession: "Nothing is saved. Every visit starts clean.",
      steps: {
        one: { title: "Check the bill", body: "Spot what's missing, wrong, or worth pushing back on." },
        two: { title: "See if you qualify", body: "Use California's rules to estimate financial assistance." },
        three: { title: "Get your letter", body: "Take a pre-filled letter and reminders with you." },
      },
      cta: "Start — nothing leaves your device",
    },
  } as const;
  ```
  All Welcome copy is placeholder; user owns final wording.

- **`src/styles.css`** (edit) — add Fair Bill design tokens (light theme only for now), keeping shadcn variable shape:
  - Surfaces: `--background` paper-white, `--foreground` deep ink, `--muted` cool stone, `--card` paper.
  - Brand semantic tokens (new): `--pine` (action/relief), `--honey` (caution/leverage), `--clay` (serious flag). Registered in `@theme inline` as `--color-pine`, `--color-honey`, `--color-clay` so utilities work.
  - Map `--primary` → pine for the CTA.
  - Register font-family tokens: `--font-display` (Newsreader), `--font-sans` (Public Sans), `--font-mono` (IBM Plex Mono) in `@theme inline`.
  - Keep all other shadcn vars untouched.

- **`src/routes/__root.tsx`** (edit) — add the three Google Fonts via `<link>` tags in `head().links` (per stack rule: never `@import` remote URLs in CSS). Update root meta to Fair Bill title/description. Body keeps `font-sans` (Public Sans) by default.

- **`src/routes/index.tsx`** (replace placeholder) — Welcome screen. Composes small local components (no new files yet; one screen at a time).

---

### 2. Welcome layout

```text
┌──────────────────────────────────────────────────────────┐
│ [privacy bar — full width, quiet honey-tinted strip]     │
│  Private session — everything you enter stays on device. │
├──────────────────────────────────────────────────────────┤
│ Fair Bill                          About & sources  Pilot│
├──────────────────────────────────────────────────────────┤
│                                                          │
│           Fair Bill  (display, Newsreader)               │
│           Check your bill.  (display, larger)            │
│                                                          │
│           [intro sentence — body, calm]                  │
│           [audience sentence — muted]                    │
│                                                          │
│           ── Nothing is saved. Every visit starts clean. │
│              (small, set apart from privacy bar)         │
│                                                          │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│   │ 1. Check │  │ 2. Qualify│  │ 3. Letter│              │
│   │  body    │  │  body     │  │  body    │              │
│   └──────────┘  └──────────┘  └──────────┘               │
│                                                          │
│        [ Start — nothing leaves your device ]  (pine)    │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  Working prototype · Not legal advice.   (footer, muted) │
└──────────────────────────────────────────────────────────┘
```

- Single `<h1>` is the "Check your bill." line (semantic H1, SEO).
- Brand mark is `<p>` styled, not heading.
- Fresh-session line sits **below** the intro and **separated** from the privacy bar by ~24px so the two trust signals don't compete (per user note).
- Steps are 3 equal cards, stacked on mobile, row on `sm:` and up.
- CTA: `<Link to="/intake">` rendered as button. Route doesn't exist yet — to keep the build green, the link will be a disabled-styled button with `aria-disabled` and no `to` until intake is built next turn. (Alternative: stub `/intake` route with a placeholder. I'll go with the disabled button so we don't pre-create scaffolding for a screen we haven't designed.)
- Footer: persistent, single line, muted text. Implemented inline on Welcome; will move to a shared layout component when the second screen lands.

### 3. Design tokens (semantic)

| Token | Role | Approx light value |
|---|---|---|
| `--background` | page paper | warm off-white (`oklch(0.985 0.005 80)`) |
| `--foreground` | ink | near-black with warmth (`oklch(0.18 0.02 80)`) |
| `--muted-foreground` | secondary copy | (`oklch(0.45 0.02 80)`) |
| `--pine` | action/relief | deep evergreen (`oklch(0.42 0.07 165)`) |
| `--honey` | caution/leverage | warm amber (`oklch(0.78 0.13 80)`) |
| `--clay` | serious flag | terracotta (`oklch(0.55 0.12 40)`) |
| `--primary` | CTA | = pine |

No alarm red. Never use color alone to convey meaning — every flag will pair color with a text label (relevant later, not on Welcome).

### 4. Localization-ready rules (enforced in this screen, kept for all future screens)

- Every visible string read from `strings.ts`. Zero inline literals in JSX text nodes.
- Sentences are whole strings — no `<>{verb} {noun}.</>` concatenation.
- Layout uses `max-w-*` + `min-h-*` with comfortable padding so a ~25% longer Spanish translation won't break wrap or clip the CTA. Buttons size to content with generous horizontal padding.
- No language toggle.

### 5. Accessibility

- Keyboard: CTA is the only interactive element on the page besides "About & sources" link in the header — both reachable by Tab, visible focus ring (`--ring`).
- AA contrast verified for foreground on background, muted on background, primary-foreground on pine.
- `prefers-reduced-motion`: no entrance animation on Welcome regardless (calm screen).

### 6. Out of scope (explicit)

- No `/intake`, `/check`, etc. routes yet.
- No `FairBillProvider`, no reducer, no `localStorage` — Welcome reads no state and writes none, which itself satisfies the "always fresh" promise on this screen.
- No corpus.js yet — first need is at intake's hospital selector.
- No shared `Header`/`Footer` components yet — extracted on screen 2 once we know what they need to do.

### 7. Verification before handoff

- `code--view` the rendered file, confirm no inline strings.
- Open `localhost:8080/` in Playwright at 1280×1800, screenshot, check: H1 reads "Check your bill.", privacy bar visible, fresh-session line visible and separated, 3 step cards, CTA visible with pine background, footer disclaimer visible. Report any console errors.

Stops after Welcome. Awaiting your screenshot review before intake.
