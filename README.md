# Fair Bill

**A free, privacy-first tool that helps Californians understand and act on a confusing or unfair medical bill.**

Check a bill for problems, see if you qualify for financial assistance, and leave with ready-to-send letters — all in your browser, with nothing stored on a server.

🔗 **Live:** https://check-your-medical-bill.lovable.app

📍 **Status:** Pilot · California (three verified hospitals + a self-check path for any other CA nonprofit hospital)

---

## What it does

Fair Bill walks a person through four optional steps, in a recommended order when more than one applies:

1. **Your bill** — tell it what kind of provider sent the bill (hospital or independent) and, for hospitals, which one.

2. **Check it** — enter the line(s) that look wrong; it flags computed duplicates and prompts self-checks for surprise billing and charges for services that didn't happen.

3. **See if you qualify** — plain arithmetic comparing income to the federal poverty level against the hospital's published policy, to estimate charity-care / discount eligibility.

4. **Get your letter** — generates pre-filled, ready-to-send letters (itemized-bill request, dispute, financial-assistance application, or a leverage letter for independent providers), based on what the person actually did.

It addresses two distinct remedies that are often conflated: **correcting an unfair bill** (dispute) and **getting help paying a correct one** (financial assistance). They are not a mandatory sequence.

---

## Two commitments that define the project

**1. Privacy by design.** No accounts, no server database, no analytics, no AI run on user data at runtime. Everything a person enters — the bill, their income, their household — stays in their browser, on their device, and is never transmitted or stored. State passes between screens in the browser session and clears when the tab closes. Letters are produced on-device (copy / mailto). The legal logic is deterministic arithmetic against a verified data file, not a model guessing.

**2. Honesty over impressiveness.** The tool only *asserts* what it can *prove*. It computes duplicate charges (matching lines). It presents surprise billing and "things that didn't happen" as **self-checks the user confirms** — never auto-detections. It does **not** estimate "fair prices" or claim a dollar overcharge. It does **not** assert eligibility for a hospital it hasn't verified — instead it shows the person their poverty-level math beside the policy figures they paste, and lets them compare. Every legal figure is verified against a primary source with a recorded date.

---

## This is a replicable model

The application logic is generic. What's California-specific is the **data**: the federal poverty guidelines (national), the state's charity-care / fair-pricing law and income ceiling, surprise-billing and medical-debt rules, and each pilot hospital's published financial-assistance policy. **Swap the data, and the same app serves a different state.**

### How to fork it for your state

1. Fork this repository.

2. Replace `src/lib/corpus.ts` with **your state's** verified figures:

   - Federal poverty guidelines (same nationwide — reuse as-is).

   - Your state's charity-care / fair-pricing law, income ceiling, and asset-test rules.

   - Your state's surprise-billing and medical-debt / credit-reporting rules.

   - Your pilot providers' **actual published** financial-assistance policies (tiers, free vs. discount thresholds).

3. **Verify every figure against a primary source and record the source URL + date.** (See "The verification rule" — this is non-negotiable.)

4. Update the letter templates to cite your state's statutes.

5. Update the disclaimers and the "Pilot · [STATE]" badge.

### The verification rule

> **This is a model and a method, not a finished product for your state.** Every legal figure you ship MUST be verified against a primary source — the statute, the regulator's site, the provider's own published policy — with a recorded date. A tool about people's rights cannot ship a number it cannot trace. Forks that skip verification betray the people they claim to serve and the integrity of the project.

### What is deliberately NOT in the tool (keep these properties in any fork)

- No "fair price" estimates or overcharge claims (no price oracle).

- Surprise billing and "things that didn't happen" are **user self-checks**, not auto-detections.

- The tool never asserts eligibility for an unverified provider.

- No user data leaves the device.

---

## Tech

Built with React + Vite (via Lovable). All user-facing copy is externalized in `src/lib/strings.ts` (localization-ready). All legal figures live in `src/lib/corpus.ts` and are read from there — never hardcoded in components.

---

## Licensing

This project is open in two layers, with two licenses:

- **Code** → **GNU Affero General Public License v3.0 (AGPL-3.0)**. You may use, modify, and run it — including as a hosted service — but any modified version you deploy must also be open under AGPL. See `LICENSE`.

- **The corpus (`corpus.ts`), letter templates, and educational copy** → **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**. Reuse and adapt with attribution, provided your version is shared under the same license. See [`data/CORPUS-LICENSE`](data/CORPUS-LICENSE).

In plain terms: you can build on this, including commercially, but you cannot enclose it — derivatives stay open, and the data stays attributed and share-alike.

---

## Disclaimer

Fair Bill is **not legal or medical advice**. Hospital policies and the law change; always confirm current details on the hospital's own application. The verified dates in the corpus show when each figure was last checked. Not affiliated with any hospital or government agency.

---

## Attribution

Created by Bruna Talarico. If you fork or build on Fair Bill, attribution is appreciated and (for the corpus) required under CC BY-SA 4.0.
