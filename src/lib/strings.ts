// All user-facing copy lives here. One sentence per key — never assemble
// sentences from concatenated fragments. Adding a locale later means adding
// a sibling object, not editing JSX.

export const strings = {
  common: {
    brandName: "Fair Bill",
    eyebrow: "Medical bills · California",
    pilotTag: "Pilot · CA",
    aboutLink: "About & sources",
    privacyBar: "Your information never leaves your device",
    footerDisclaimer: "Working prototype · Not legal advice.",
  },
  welcome: {
    tagline: "Got a hospital bill you don't understand? Start here.",
    intro:
      "Check the bill for problems, see if you qualify for help, and leave with a letter you can send — in a few minutes.",
    audience:
      "No account, no upload to anyone's server. The bill, your income, everything you type stays in this browser, on this device. You're not sharing it with us — because there is no \"us\" holding it.",
    freshSession: "Because nothing is stored, every visit starts fresh.",
    steps: {
      one: {
        label: "1 · Check the bill",
        title: "Spot charges and rights worth questioning",
      },
      two: {
        label: "2 · See if you qualify",
        title: "Financial assistance, in plain math",
      },
      three: {
        label: "3 · Get your letter",
        title: "Paste-ready, with a step-by-step plan",
      },
    },
    cta: "Start — nothing leaves your device",
    ctaPendingNote: "Next screen coming soon.",
  },
} as const;
