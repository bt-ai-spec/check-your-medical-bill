// All user-facing copy lives here. One sentence per key — never assemble
// sentences from concatenated fragments. Adding a locale later means adding
// a sibling object, not editing JSX.

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
    intro:
      "Fair Bill helps you read and act on a confusing or unfair California medical bill.",
    audience:
      "Built for Californians facing a hospital, clinic, or other medical bill that doesn't add up.",
    freshSession: "Nothing is saved. Every visit starts clean.",
    steps: {
      one: {
        label: "Step 1",
        title: "Check the bill",
        body: "Spot what's missing, wrong, or worth pushing back on.",
      },
      two: {
        label: "Step 2",
        title: "See if you qualify",
        body: "Use California's rules to estimate financial assistance.",
      },
      three: {
        label: "Step 3",
        title: "Get your letter",
        body: "Take a pre-filled letter and reminders with you.",
      },
    },
    cta: "Start — nothing leaves your device",
    ctaPendingNote: "Next screen coming soon.",
  },
} as const;
