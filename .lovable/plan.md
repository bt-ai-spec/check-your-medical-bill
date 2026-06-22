Plan: left-justify the tag buttons on the Intake rights section on mobile only, preserving the desktop layout.

Scope
- One file: src/routes/intake.tsx
- One component: the rights tag `<button>` inside `RightsSection`.

Change
- Inspect the current desktop rendered alignment.
- Apply a mobile-only left-justification class so the tag text aligns to the left below the `sm:` breakpoint.
- Keep desktop exactly as it is (if desktop is currently centered, use `text-left sm:text-center`; if desktop is already left-aligned, use `text-left`).

Verification
- Screenshot the Intake screen on mobile viewport to confirm tags are left-justified.
- Screenshot on desktop viewport to confirm desktop appearance is unchanged.
- Check that no other pages or components are affected.

This is the lowest-risk approach because it touches only the narrow mobile breakpoint and leaves the desktop experience untouched.