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
    a11y: {
      progress: "Progress",
    },
    errorPage: {
      title: "This page didn't load",
      body: "Something went wrong on our end. You can try refreshing or head back home.",
      tryAgain: "Try again",
      goHome: "Go home",
    },
    notFound: {
      code: "404",
      title: "Page not found",
      body: "The page you're looking for doesn't exist or has been moved.",
      goHome: "Go home",
    },
  },

  welcome: {
    tagline: "Got a hospital bill you don't understand? Start here.",
    intro:
      "Check the bill for problems, see if you qualify for help paying, and leave with a letter you can send — use whichever steps fit your situation. When both apply, correct the bill first, then seek help paying.",
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
      title: {
        hospital: "These are your protections",
        independent: "Your protections and options",
      },
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
        body: "The same charge listed twice — same description, same amount. It happens more than you'd think, especially with imaging and labs.",
      },
      {
        label: "Possible surprise out-of-network charges",
        body: "A separate bill from a radiologist, anesthesiologist, or pathologist you didn't choose, at a facility you went to in-network. Federal and California law usually limit you to your in-network cost-sharing here.",
      },
      {
        label: "Charges for things that didn't happen",
        body: "Tests that were ordered but cancelled, days you weren't admitted, supplies you didn't receive. Compare the itemized list against your discharge paperwork.",
      },
      {
        label: "Whether you got a full itemized bill",
        body: "You can ask any provider for a fully itemized bill with every charge and code. A summary balance isn't enough to spot the things above.",
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
      summaryPrimaryCta: "Ask for a fully itemized bill",
      summarySecondaryCta: "See if you qualify",
    },

    itemized: {
      heading: "What to question on this bill",
      lede:
        "Based on the lines you entered, here's what's worth questioning — and what we'll do about each.",
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
            "We'll generate a ready-to-send itemized-bill request letter for you.",
        },
        {
          id: "duplicate" as const,
          label: "Possible duplicate charge",
          rule: "Computed · two lines with the same description and amount",
          body:
            "We flagged lines that look like exact duplicates of another line. Sometimes a charge legitimately repeats (two separate scans on different days), but on a single bill it's worth asking the provider to confirm — in writing — that each one is a distinct service.",
          actionLabel: "Do",
          action:
            "We'll include this duplicated line in your dispute letter and ask the provider to confirm or remove it.",
        },
        {
          id: "surprise" as const,
          label: "Possible surprise bill",
          rule: "Self-check · only you know whether this matches your situation",
          body:
            "Surprise billing is when you're charged out-of-network rates by a provider you didn't choose at a facility you went to in-network — most often a radiologist, anesthesiologist, pathologist, ER doctor, or assistant surgeon. Federal law (the No Surprises Act) and California's AB-72 usually limit you to your in-network cost-sharing in those cases.",
          selfCheckLabel: "Does this match a line on your bill?",
          selfCheckPrompt:
            "If this matches your situation, we'll include it in your letter.",
          selfCheckConfirmLabel:
            "Yes — a charge like this is on my bill",
          selfCheckConfirmedNote:
            "Got it. We'll include the surprise-billing paragraph in your dispute letter.",
        },
      ],
      duplicateNoneNote:
        "We didn't find any exact duplicates on this bill — that doesn't mean there aren't questionable charges, just no two lines that match.",
      parseFallback:
        "We couldn't read amounts on these lines, so we'll show them as you typed them. The action steps still apply.",
      expandWhatThisMeans: "What this means",
    },

    a11y: {
      previewSection: "What this screen checks for",
    },


    backToIntake: "Back",
    primaryCta: "See if you qualify",
    primaryCtaPendingNote: "",
    disputeCta: "Get your dispute letter",
    disputePrompt:
      "We found something worth questioning. Your dispute letter is ready — it asks the provider to correct what looks wrong on this bill.",
    qualifyPrompt:
      "If a correct bill is still more than you can afford, you may be entitled to help paying — check if you qualify.",
    qualifySecondaryLabel: "See if you qualify for help",
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

  letter: {
    eyebrow: "Step 04 · Get your letter",
    title: "Your letter, ready to send",
    subjectLabel: "Subject",
    a11y: {
      tabList: "Letter type",
    },

    ledeSingle:
      "Based on what you did, here's the letter that fits your situation. Highlighted fields are yours to fill in — everything else is pre-filled from what you've already told this tool.",
    ledeMulti:
      "Based on what you did, here are the letters that fit your situation. Each one is pre-filled from what you've already told this tool — only the highlighted fields are yours to fill in.",
    fillLegend:
      "Highlighted fields are yours to fill in.",
    privacyNote:
      "These letters are generated on this device. Nothing is sent anywhere when you copy or open them.",
    actions: {
      copy: "Copy letter text",
      copied: "Copied",
      mail: "Open in email",
      mailHelp:
        "Opens your default mail app with the letter pre-filled. You add the provider's billing email and send.",
    },
    tabs: {
      itemized: "Itemized bill request",
      dispute: "Dispute letter",
      assistance: "Financial assistance",
      leverage: "Discount & payment plan",
    },
    tabHints: {
      itemized: "Asks for the line-by-line breakdown and a hold on collections.",
      dispute: "Lists the charges we flagged and asks the provider to confirm or remove them.",
      assistance: "Charity-care application letter, citing your eligibility tier.",
      leverage: "Self-pay discount, hardship program, and payment plan — in one ask.",
    },
    back: "Back",
    backToCheck: "Back to bill check",
    backToQualify: "Back to qualify",
    missing: {
      title: "We don't have anything to put in a letter yet.",
      body: "Run the bill check or the qualify step first — the letters here are built from what you do there.",
      cta: "Start with the bill check",
    },

    // ----- Letter templates. Placeholders use {{KEY}}. -----
    // Fill-ins (user must complete) use [BRACKETED LABEL] inside the body.
    placeholders: {
      providerFallback: "[your provider's name]",
      patientName: "[YOUR FULL NAME]",
      accountNumber: "[ACCOUNT OR BILL NUMBER]",
      dateOfService: "[DATE OF SERVICE]",
      address: "[YOUR MAILING ADDRESS]",
      todayDate: "[TODAY'S DATE]",
      providerInNetwork: "[FACILITY OR HOSPITAL NAME — the in-network place you went to]",
      monthlyAmount: "[MONTHLY AMOUNT YOU CAN AFFORD]",
    },

    itemized: {
      subject: "Request for a fully itemized bill — account {{ACCOUNT}}",
      greeting: "To the billing department at {{PROVIDER}},",
      body: [
        "I'm writing to request a fully itemized statement of charges for my account, including every billing code (CPT/HCPCS, revenue codes, and any modifiers) and the amount charged for each line. A summary balance does not give me enough detail to verify the charges or identify duplicates or coding errors.",
        "While I review the itemized bill, please place this account on hold and do not refer it to collections or report it to any credit bureau. California law (SB 1061) prohibits reporting medical debt to credit agencies, and I'd like a written confirmation that no adverse action will be taken during this review.",
        "Please send the itemized statement to the address above within 30 days. If you need anything else from me to release it, let me know in writing.",
      ],
      signoff: "Thank you for your help.",
    },

    dispute: {
      subject: "Disputed charges on account {{ACCOUNT}}",
      greeting: "To the billing department at {{PROVIDER}},",
      intro:
        "I've reviewed the bill for the account above and I'm writing to dispute specific charges. Please pause collections on this account while you investigate; California law prohibits adverse credit reporting on medical debt, and I'm asking for written confirmation that no further collection activity will occur until this is resolved.",
      duplicateHeader: "Duplicate charges",
      duplicateLead:
        "The following line(s) appear more than once on the bill with the same description and amount. Please confirm in writing whether each is a separate, distinct service, or remove the duplicate(s) from the balance:",
      duplicateLineFormat: "• {{DESC}} — {{AMT}}",
      surpriseHeader: "Possible surprise out-of-network charge",
      surpriseBody:
        "At least one line on this bill appears to be from an out-of-network provider I did not choose, while I was being treated at an in-network facility ({{IN_NETWORK}}). Under the federal No Surprises Act and California AB-72, my responsibility for that care is limited to my in-network cost-sharing. Please re-bill any such line at the in-network rate or send me the documentation showing why those protections do not apply.",
      ask:
        "Please send a written response, including a corrected statement, within 30 days. If you need a copy of my insurance card or any other information to investigate, write to me at the address above.",
      signoff: "Thank you.",
    },

    assistance: {
      subject:
        "Application for financial assistance / charity care — {{HOSPITAL}}",
      greeting: "To the financial-assistance office at {{HOSPITAL}},",
      intro:
        "I'm writing to apply for financial assistance under {{HOSPITAL}}'s published financial-assistance policy and the California Hospital Fair Pricing Act (HSC §127400 et seq.).",
      eligibility: {
        free:
          "By the figures I entered on Fair Bill, my household income is approximately {{PCT}}% of the federal poverty level (household of {{HOUSEHOLD}}). Under your policy, that places me in the free / charity-care band. I'm asking that the balance on the account above be written off in full.",
        disc:
          "By the figures I entered on Fair Bill, my household income is approximately {{PCT}}% of the federal poverty level (household of {{HOUSEHOLD}}). Under your policy, that places me in the discounted-rate band. I'm asking that the balance on the account above be reduced accordingly and that I be sent a corrected statement.",
        border:
          "By the figures I entered on Fair Bill, my household income is approximately {{PCT}}% of the federal poverty level (household of {{HOUSEHOLD}}). That is close to your assistance line, and I'm asking that my application be reviewed on the merits — including any high-medical-cost or hardship path your policy provides.",
        above:
          "While my household income (approximately {{PCT}}% of the federal poverty level for a household of {{HOUSEHOLD}}) is above your standard eligibility line, I'm asking that you review me under any high-medical-cost, hardship, or extended-payment path your policy provides, and that you apply California's fair-pricing limits to any remaining balance.",
        unknown:
          "Please review my income and household size against your policy's tiers and let me know in writing which band I fall into and what documentation you need.",
      },
      collections:
        "Per California law, please place this account on hold and do not refer it to collections or take any adverse credit action while my application is under review. Medical debt cannot be reported to credit bureaus in California (SB 1061).",
      ask:
        "Please send the application packet (or confirmation that no further action is needed), and let me know what supporting documents you require — pay stubs, tax return, or otherwise. Account number: {{ACCOUNT}}. Date of service: {{DOS}}.",
      signoff: "Thank you for your time.",
    },

    leverage: {
      subject: "Self-pay discount, hardship review, and payment plan — {{PROVIDER}}",
      greeting: "To the billing office at {{PROVIDER}},",
      intro:
        "I'm writing about the bill on the account above. I'm paying out of pocket and would like to resolve this in a single conversation rather than back-and-forth, so I'm asking three things at once.",
      askSelfPay:
        "First, please apply your self-pay or prompt-pay discount to this balance. Many independent practices and labs offer 20–40% off when a patient pays directly rather than the bill being routed through collections; I'd like to take that path.",
      askHardship:
        "Second, please review me under any internal hardship or financial-assistance program you offer. I can provide income documentation if you tell me what you need.",
      askPaymentPlan:
        "Third, if a balance remains after the discount and hardship review, please put me on an interest-free payment plan at {{MONTHLY}} per month, with the terms confirmed in writing before the first payment.",
      collections:
        "While we work this out, please don't refer the account to collections or report it to any credit bureau. California law (SB 1061) prohibits credit reporting on medical debt regardless of provider.",
      ask:
        "A written response within 30 days would be appreciated. Account number: {{ACCOUNT}}.",
      signoff: "Thank you.",
    },
  },

  about: {
    eyebrow: "About & sources",
    title: "What this is, and where every number comes from.",
    lede:
      "Fair Bill is built on a small, published corpus of California law and hospital policies. This page lets anyone trace every legal claim the tool makes back to its source.",

    whatTitle: "What Fair Bill is",
    whatBody:
      "Fair Bill is a free tool that helps Californians understand and act on a confusing or unfair medical bill — check it for problems, see if you qualify for financial assistance, and leave with ready-to-send letters. It is not affiliated with any hospital, insurer, or government agency.",

    privacyTitle: "How your privacy works",
    privacyBody: [
      "There is no account and no server. Nothing you enter — your bill, your income, your household, the hospital — is uploaded or stored anywhere. All calculations run in your browser, on your device, and disappear when you close the tab.",
      "The tool does not run AI on your data. The legal logic is plain arithmetic against a published, verified corpus — the same numbers shown on this page.",
    ],

    limitsTitle: "What the tool does and doesn't do",
    limitsIntro:
      "Being honest about the edges matters more than looking comprehensive.",
    limitsItems: [
      {
        label: "Duplicate charges — a real finding.",
        body: "When you paste an itemized bill, the tool computes which lines match exactly (same description, same amount) and flags them. That arithmetic is something the tool can actually do for you.",
      },
      {
        label: "Surprise billing and \"charges for things that didn't happen\" — self-checks.",
        body: "These depend on facts only you know (which provider was in-network, what was actually performed). The tool explains the rule and asks you to confirm — it does not detect them for you.",
      },
      {
        label: "It does not assert eligibility for hospitals it hasn't verified.",
        body: "For hospitals outside the verified list, the tool shows your federal-poverty-level math and lets you compare it against the policy you paste. It won't tell you \"you qualify\" for a policy it hasn't read.",
      },
      {
        label: "It does not estimate \"fair prices\" or claim you were overcharged by a dollar amount.",
        body: "Pricing varies wildly between providers and contracts; a confident dollar figure would be misleading. The tool focuses on rights and arithmetic that are knowable.",
      },
    ],

    sourcesTitle: "Sources",
    sourcesIntro:
      "Every legal figure the tool uses comes from this list. Each entry shows the plain-language claim, the official source, and the date we last verified it.",
    verifiedOnLabel: "Verified on",
    newTab: "(opens in a new tab)",

    fplClaim:
      "2026 Federal Poverty Guidelines — the income table the tool uses to compute your percent of poverty.",
    fplSourceLabel: "U.S. Department of Health & Human Services (HHS / ASPE)",

    fpaClaim:
      "California Hospital Fair Pricing Act — nonprofit and many other California hospitals must offer free or discounted care to patients at or below {{ceiling}}% of the federal poverty level. Since 2025 there is no asset test (AB 2297).",
    fpaSourceLabel: "California HCAI — Hospital Fair Billing Program",

    sb1061Claim:
      "Medical debt cannot be reported to credit bureaus in California (SB 1061). This applies regardless of provider or whether you've applied for assistance.",
    sb1061SourceLabel: "California HCAI — Hospital Fair Billing Program",

    hospitalsHeader: "Pilot hospital financial-assistance policies",
    hospitalsIntro:
      "For each pilot hospital, we read the published financial-assistance policy and recorded the income tiers used by the qualify step. Always confirm the current figures on the hospital's own application.",
    hospitalSourceLabel: "Financial-assistance policy",
    hospitalExhibitBLabel: "Exhibit B (HCAI filing)",

    resourcesHeader: "Referral resources",
    resourcesIntro:
      "Outside organizations the tool may point you to. Listed here for transparency. Not endorsements; links open in a new tab and carry no information about you.",

    disclaimersTitle: "Disclaimers",
    disclaimersBody: [
      "Fair Bill is not legal or medical advice. It is a tool to help you read your bill and exercise rights that already exist under California and federal law.",
      "Hospital policies and the law can change. The verified date next to each figure shows when we last checked it — always confirm the current details on the hospital's own application or the official source.",
      "If something on this page looks out of date or wrong, that's a bug. The whole project is open and the corpus is a single readable file.",
    ],

    backHome: "Back to home",
  },
} as const;
