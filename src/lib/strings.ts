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
  intake: {
    stepper: {
      one: { num: "01", label: "Intake" },
      two: { num: "02", label: "Bill" },
      three: { num: "03", label: "Assistance" },
      four: { num: "04", label: "Letter" },
    },
    title: "Tell us about your bill",
    subtitle: "Two quick things. Everything stays on this device.",

    providerTypeLabel: "What kind of provider sent the bill?",
    providerTypeWhyToggle: "Why this matters",
    providerTypeWhyBody:
      "California's charity-care law (the Hospital Fair Pricing Act) binds hospitals. Independent clinics, labs, imaging centers, and solo doctors aren't covered the same way — their discounts are usually voluntary. Telling us which one you got the bill from means we only show you rights and steps that actually apply.",
    providerHospital: "Hospital or ER",
    providerIndependent: "Clinic, lab, imaging, or independent doctor",

    hospitalLabel: "Which hospital?",
    hospitalAboutToggle: "About these hospitals",
    hospitalAboutBody:
      "These are California nonprofit hospital systems whose published financial-assistance policies we've read and verified. Kaiser Permanente is handled separately because Kaiser members go through Kaiser's own process, not the hospital fair-pricing path.",
    hospitalCityTypeSep: " · ",

    hospitalAddTitle: "Don't see your hospital? Add it",
    hospitalAddIntro:
      "You can use this tool with any California nonprofit hospital. We just need that hospital's income cutoffs from its own financial-assistance policy.",
    hospitalAddHowTitle: "How to find the policy",
    hospitalAddHowOne:
      "Search the hospital's website for \"financial assistance policy\" or \"charity care.\"",
    hospitalAddHowTwo:
      "Or look it up in the state filing on HCAI (every California hospital files one).",
    hospitalAddHowThree:
      "Or request the policy in writing — they're required to give it to you.",
    hospitalAddNameLabel: "Hospital name",
    hospitalAddNamePlaceholder: "e.g. Saint Mary's Medical Center",
    hospitalAddCutoffsLabel: "Paste the income cutoffs from the policy",
    hospitalAddCutoffsPlaceholder:
      "e.g. Free care up to 400% FPL · Discount up to 600% FPL",
    hospitalAddSessionNote:
      "What you paste stays in this session only. Closing this tab clears it.",
    hospitalAddContributeLabel:
      "Optional: also share this policy (not your details) with the open library so the next person finds it.",

    independentLabel: "Provider name",
    independentPlaceholder: "e.g. Westside Imaging",
    independentHelp:
      "Independent providers don't have to give you charity care. The next steps focus on leverage — fair pricing, billing errors, and surprise-billing protections — not eligibility math.",

    backToWelcome: "Back",
    primaryCta: "Continue to bill check",
    primaryCtaPendingNote: "Next screen coming soon.",
  },
} as const;
