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
    steps: [
      { num: "01", label: "Your bill" },
      { num: "02", label: "Check it" },
      { num: "03", label: "See if you qualify" },
      { num: "04", label: "Get your letter" },
    ],
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
        label: "1 · Your bill",
        title: "Tell us who sent it and see your rights",
      },
      two: {
        label: "2 · Check it",
        title: "Spot charges and rights worth questioning",
      },
      three: {
        label: "3 · See if you qualify",
        title: "Financial assistance, in plain math",
      },
      four: {
        label: "4 · Get your letter",
        title: "Paste-ready, with a step-by-step plan",
      },
    },
    cta: "Start — nothing leaves your device",
    ctaPendingNote: "Next screen coming soon.",
  },
  intake: {
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
    hospitalAddCutoffsError:
      "Paste the income cutoffs from the policy — e.g., 'free up to 400% FPL.'",
    hospitalAddSessionNote:
      "What you paste stays in this session only. Closing this tab clears it.",
    hospitalAddContributeLabel:
      "Optional: also share this policy (not your details) with the open library so the next person finds it.",
    hospitalAddHouseholdLabel: "Household size",
    hospitalAddHouseholdHelp:
      "Count yourself plus anyone you file taxes with (spouse, dependents).",
    hospitalAddIncomeLabel: "Annual household income (before taxes)",
    hospitalAddIncomePlaceholder: "e.g. 48000",
    hospitalAddIncomeHelp:
      "Used only on this device for the FPL calculation below.",
    hospitalAddSubmit: "Check against this hospital",
    selfCheckTitle: "Your self-check",
    selfCheckFplLine:
      "Your household income is about {{pct}}% of the federal poverty level (for a household of {{size}}).",
    selfCheckCutoffsLabel: "{{hospital}}'s cutoffs — as you pasted them",
    selfCheckCompareGuide:
      "Compare your {{pct}}% to {{hospital}}'s cutoffs above. If you're at or below their free-care line, you likely qualify for free care; if you're under their discount line, you likely qualify for a discount.",
    selfCheckHonesty:
      "We can't verify {{hospital}}'s policy the way we've verified our listed hospitals, so we're not calculating your result for you — but the law and your rights are the same, and the letters below work for any California nonprofit hospital.",
    selfCheckNextTitle: "Letters you can send to {{hospital}}",
    selfCheckLetterItemized: "Request an itemized bill from {{hospital}}",
    selfCheckLetterFa: "Apply for financial assistance at {{hospital}}",
    selfCheckLetterPendingNote: "Letter generator coming soon.",

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
        label: "Collections hold during your assistance review",
        body: "Once you've applied for financial assistance, the hospital can't send the bill to collections until they decide. California also requires notice and a 180-day window before any adverse collection action.",
      },
      // Any medical bill
      anySurprise: {
        label: "Surprise and balance-billing protections",
        body: "For most emergency care, and for many out-of-network providers treating you at an in-network facility, federal and California law (the No Surprises Act and AB-72) limit you to your in-network cost-sharing. You shouldn't be billed the difference between the provider's charge and what your plan paid.",
      },
      anyItemized: {
        label: "Right to an itemized bill",
        body: "You can ask any provider for a fully itemized bill — every charge, with its billing codes — before you pay. A summary balance isn't enough to spot duplicates or wrong codes.",
      },
      anyCreditReporting: {
        label: "Medical debt can't be reported to credit agencies",
        body: "In California, medical debt cannot be reported to credit bureaus at all (SB 1061). This applies regardless of provider or whether you've applied for assistance.",
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
  check: {
    eyebrow: "Step 02 · Check it",
    title: "Check the bill",
    lede:
      "You don't need to paste the whole thing — just the line or two that look confusing or wrong. Messy paste is fine; spacing and codes don't matter.",

    previewIntro: "These are the things we're watching for:",
    previewChecks: [
      {
        label: "Duplicate charges",
        body: "The same service billed twice.",
      },
      {
        label: "Possible surprise billing",
        body: "Out-of-network charges you didn't choose.",
      },
      {
        label: "Whether you got a full itemized bill",
        body: "Your right to see every line.",
      },
    ],


    formatHeader: "What kind of bill do you have?",
    formatSummary: "Just a summary balance",
    formatSummaryHelp:
      "One total, no breakdown of charges.",
    formatItemized: "A line-by-line itemized bill",
    formatItemizedHelp:
      "Each charge shown separately, often with billing codes.",

    inputLabel: "Paste the line or two that look off",
    inputPlaceholder:
      "CT scan, abdomen — $2,400\nFacility fee — $1,940",
    inputHelp:
      "One charge per line. Include the description and the dollar amount.",
    tryExample: "Try an example",
    clearExample: "Clear and enter my own",

    summary: {
      heading: "First, get the itemized bill.",
      lede:
        "You can't question what you can't see. A summary balance hides the individual charges — duplicates, wrong codes, surprise out-of-network reads. Asking for an itemized bill in writing is your right, and asking the right way signals you know it.",
      ctaTitle: "Ask for a fully itemized bill",
      ctaBody:
        "Use the itemized-bill request letter on the next step. It cites the right to itemization and asks the provider to pause collections while you review.",
    },

    itemized: {
      heading: "Three things worth questioning",
      lede:
        "These are based on your rights and the rules, not a guess about price. Each one is something you can ask about before you pay.",
      ledgerHeader: "Your bill",
      totalLabel: "Total",
      duplicateFlag: "duplicate?",
      cards: [
        {
          id: "itemized" as const,
          label: "Ask for a fully itemized bill",
          rule: "Universal · applies to any provider in any state",
          body:
            "You can ask any provider for a fully itemized bill — every charge, with billing codes — before you pay. A summary balance isn't enough to spot duplicates or wrong codes. The next step generates the request letter.",
          actionLabel: "Do",
          action:
            "Send the itemized-bill request letter on the next step.",
        },
        {
          id: "duplicate" as const,
          label: "Possible duplicate charge",
          rule: "Computed · two lines with the same description and amount",
          body:
            "We flagged lines that look like exact duplicates of another line. Sometimes a charge legitimately repeats (two separate scans on different days), but on a single bill it's worth asking the provider to confirm — in writing — that each one is a distinct service.",
          actionLabel: "Do",
          action:
            "On the dispute letter, list the duplicated line and ask the provider to confirm or remove it.",
        },
        {
          id: "surprise" as const,
          label: "Possible surprise bill",
          rule: "Self-check · only you know whether this matches your situation",
          body:
            "Surprise billing is when you're charged out-of-network rates by a provider you didn't choose at a facility you went to in-network — most often a radiologist, anesthesiologist, pathologist, ER doctor, or assistant surgeon. Federal law (the No Surprises Act) and California's AB-72 usually limit you to your in-network cost-sharing in those cases.",
          selfCheckLabel: "Does this match a line on your bill?",
          selfCheckPrompt:
            "If yes — for example, an \"out-of-network radiologist read\" billed separately after an in-network ER visit — flag it on the dispute letter and ask your insurer to reprocess at the in-network rate.",
        },
      ],
      duplicateNoneNote:
        "We didn't find any exact duplicates on this bill — that doesn't mean there aren't questionable charges, just no two lines that match.",
      parseFallback:
        "We couldn't read amounts on these lines, so we'll show them as you typed them. The action steps still apply.",
    },

    backToIntake: "Back",
    primaryCta: "Continue to qualify",
    primaryCtaPendingNote: "",
  },

  qualify: {
    independent: {
      eyebrow: "Step 03 · Your leverage",
      title: "Charity care isn't required here — but you still have leverage.",
      lede:
        "An independent provider isn't bound by California's hospital charity-care law, so the tool won't promise eligibility it can't deliver. Here's what genuinely works instead.",
      cardsHeader: "Three things that actually work",
      cards: [
        {
          label: "Ask for a self-pay / prompt-pay discount",
          body:
            "Many practices quietly offer a meaningful discount for paying directly rather than chasing the balance.",
        },
        {
          label: "Ask about their own hardship program",
          body:
            "Some independent providers and large labs run voluntary financial-assistance programs. Not guaranteed — worth asking in writing.",
        },
        {
          label: "Request an interest-free payment plan",
          body:
            "Independent providers can offer an interest-free payment plan, and most will if you propose a realistic monthly amount. Get the terms in writing before the first payment.",
        },
      ],
      contextNote:
        "Hospitals carry extra protections under California's charity-care law — if part of your care was at a hospital, you may have more options there.",
      back: "Back",
      primaryCta: "Continue to letter",
      primaryCtaPendingNote: "Letter step coming soon.",
    },
    hospital: {
      eyebrow: "Step 03 · See if you qualify",
      title: "Do you qualify for help?",
      lede:
        "This is plain arithmetic — your income compared to the poverty level for your household, against this hospital's policy. No black box.",
      inputsHeader: "Your household",
      householdLabel: "Household size",
      householdHelp:
        "Count yourself plus anyone you file taxes with (spouse, dependents).",
      incomeLabel: "Annual household income (before taxes)",
      incomePlaceholder: "e.g. 48000",
      incomeHelp: "Used only on this device for the calculation below.",
      runCta: "Calculate",
      verifiedNote:
        "These figures use the verified 2026 poverty guidelines and {{hospital}}'s published policy (checked {{verifiedOn}}). Always confirm on the hospital's current application.",
      sourcesToggle: "Where these numbers come from",
      sourcesFplLabel: "2026 federal poverty guidelines (HHS)",
      sourcesHospitalLabel: "{{hospital}}'s financial-assistance policy",
      sourcesExhibitBLabel: "{{hospital}} Exhibit B (HCAI filing)",
      newTab: "(opens in a new tab)",
      resultHeader: "Your result",
      resultNotes: {
        free: "You're likely eligible for free / charity care under this hospital's policy.",
        disc: "You're likely eligible for a discounted rate under this hospital's policy.",
        border:
          "You're close to the line — it's worth applying anyway; hospitals can review case-by-case.",
        above:
          "You're above this hospital's assistance line, but California's fair-pricing rights still apply.",
      },
      mathToggle: "Show me the math",
      mathIncomeLabel: "Your yearly income",
      mathHouseholdLabel: "Household size",
      mathFplLabel: "100% poverty level for a household of {{size}}",
      mathPctLabel: "Your income as a percent of poverty",
      summary:
        "At {{hospital}}, that puts you in the {{range}} range under their policy and the California Hospital Fair Pricing Act.",
      ranges: {
        free: "free-care",
        disc: "discounted",
        border: "borderline / apply-anyway",
        above: "above-the-assistance-line",
      },
      back: "Back",
      primaryCta: "Continue to letter",
      primaryCtaPendingNote: "Letter step coming soon.",
    },
  },
} as const;
