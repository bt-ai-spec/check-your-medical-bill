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
    subtitle: "A couple of quick questions. Everything stays on this device.",

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

    rights: {
      title: "What applies to your bill",
      intro:
        "These are general rights tied to the kind of provider you picked. We'll check the bill itself on the next screen.",
      expandHint: "Tap a row to read it.",
      hospitalHeader: "Your rights as a hospital patient · California law",
      anyBillHeader: "Applies to any medical bill",
      leverageHeader: "Your leverage with this provider",
      sourceLabel: "Source",
      // Hospital · CA-specific
      hospItemized: {
        label: "An itemized bill, on request",
        body: "You can ask the hospital for a fully itemized bill — every charge, with codes — before you pay. A summary statement is not enough to spot duplicates or wrong codes.",
      },
      hospCharity: {
        // {{ceiling}} = corpus.fairPricingAct.eligibilityCeilingPctFpl
        label: "Free or discounted care up to {{ceiling}}% of the federal poverty level",
        body: "California's Hospital Fair Pricing Act requires nonprofit and many other hospitals to offer free or discounted care to patients with income at or below {{ceiling}}% of the federal poverty level. Since 2025 there's no asset test. Each hospital sets its own tiers within that ceiling — we'll do that math on a later screen.",
      },
      hospNoCollections: {
        label: "No collections or credit reporting while your assistance application is being reviewed",
        body: "Once you've applied for financial assistance, the hospital can't send the bill to collections or report it to credit bureaus until they decide. Separately, California (SB 1061) bars reporting medical debt to credit bureaus at all.",
      },
      // Any medical bill
      anySurprise: {
        label: "Surprise and balance-billing protections",
        body: "For most emergency care and for many out-of-network providers at in-network facilities, federal and California law limit you to in-network cost-sharing. You shouldn't be billed the difference between the provider's charge and what your plan paid.",
      },
      anyItemized: {
        label: "An itemized bill, on request",
        body: "Any provider should give you a fully itemized bill if you ask — line-by-line charges with codes. Summary statements hide duplicates and miscoded items.",
      },
      // Independent · leverage
      levSelfPay: {
        label: "Self-pay or prompt-pay discount",
        body: "Independent clinics, labs, imaging, and solo doctors aren't required by California's hospital law to give you charity care, but most quietly offer a self-pay or prompt-pay discount if you ask — often 20–40% off. It's a discount, not a right; ask in writing.",
      },
      levHardship: {
        label: "Hardship programs",
        body: "Many independent providers have an internal hardship policy for patients who can document low income or unusual medical costs. They rarely advertise it. Asking the billing office in writing — once — is the move.",
      },
      levPaymentPlan: {
        label: "Interest-free payment plan",
        body: "Independent providers can offer an interest-free payment plan, and most will if you propose a realistic monthly amount. Get the terms in writing before the first payment.",
      },
    },
  },
} as const;
