// Fair Bill — verified legal corpus (drop-in data file)
// Verified 2026-06-19. Re-verify FPL each January; hospital policies twice a year.
// Every value here is sourced in Legal_Corpus_CA.md. The app must read legal
// figures ONLY from this file — never inline a number in a component.

export type HouseholdSize = number;

export interface FplTable {
  baseSize1: number;
  addPerPerson: number;
  /** 100% FPL by household size (1–8); compute beyond 8 with addPerPerson. */
  table100: Record<number, number>;
  /** Source URL for the poverty guidelines. */
  source: string;
}

export interface FairPricingAct {
  eligibilityCeilingPctFpl: number;
  assetTest: boolean;
  creditReportingOfMedicalDebt: boolean;
  canRequireCoverageAppFirst: boolean;
  enforcer: string;
  complaintUrl: string;
}

export interface HighMedicalCostsPath {
  maxPctFpl: number;
  spendThresholdPctIncome: number;
  note: string;
}

export interface PhysicianServicesPolicy {
  freeMaxPctFpl: number;
  discountMaxPctFpl: number;
  note: string;
}

export interface Hospital {
  id: string;
  name: string;
  city: string;
  /** Outer ceiling of any assistance (free or discounted), where defined as one combined figure. */
  assistanceMaxPctFpl?: number;
  /** Upper bound (% FPL) for free / charity care. */
  freeMaxPctFpl?: number;
  /** Upper bound (% FPL) for any discounted (non-free) tier. */
  discountMaxPctFpl?: number;
  /** Discount percentage applied in the discount band, when a single rate applies. */
  discountPct?: number;
  highMedicalCosts?: HighMedicalCostsPath;
  physicianServices?: PhysicianServicesPolicy;
  paymentPlan?: string;
  note?: string;
  splitConfidence?: string;
  verifiedOn: string;
  source: string;
  exhibitBSource?: string;
}

export type ResourceCategory = "reduce" | "oop" | "local";

export interface Resource {
  id: string;
  name: string;
  cat: ResourceCategory;
  url: string;
  note: string;
}

export interface Corpus {
  verifiedOn: string;
  fpl: FplTable;
  fairPricingAct: FairPricingAct;
  hospitals: Hospital[];
  resources: Resource[];
}

export const CORPUS: Corpus = {
  verifiedOn: "2026-06-19",

  // 2026 HHS poverty guidelines, 48 contiguous states + DC. Annual income.
  // Source: https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines
  fpl: {
    baseSize1: 15960,
    addPerPerson: 5680,
    // 100% FPL by household size (1–8); compute beyond 8 with addPerPerson.
    table100: { 1: 15960, 2: 21640, 3: 27320, 4: 33000, 5: 38680, 6: 44360, 7: 50040, 8: 55720 },
    source: "https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines",
  },

  // California Hospital Fair Pricing Act (HSC §127400 et seq.).
  // Source: https://hcai.ca.gov/affordability/hospital-fair-billing-program/laws-and-regulations
  fairPricingAct: {
    eligibilityCeilingPctFpl: 400,
    assetTest: false, // removed effective 2025-01-01 (AB 2297)
    creditReportingOfMedicalDebt: false, // SB 1061
    canRequireCoverageAppFirst: false,
    enforcer: "California HCAI Hospital Fair Billing Program",
    complaintUrl: "https://hcai.ca.gov/affordability/hospital-fair-billing-program/",
  },

  // Pilot hospitals. Tiers are % of FPL. Free = charity care (no charge).
  hospitals: [
    {
      id: "psj",
      name: "Providence Saint John's",
      city: "Santa Monica",
      assistanceMaxPctFpl: 400, // free OR discounted, one common application
      freeMaxPctFpl: 300, // 100% write-off ("financially indigent") at or below 300% FPL
      discountMaxPctFpl: 400, // 301–400% FPL: discount, not free
      discountPct: 86, // 301–400% band: 86% off original charges on patient-responsibility amounts
      highMedicalCosts: {
        // separate path to free care regardless of the 300% line
        maxPctFpl: 400,
        spendThresholdPctIncome: 20, // Providence bills (prior 12 mo) over 20% of annual income -> 100% charity
        note: "At or below 400% FPL AND Providence medical bills in the prior 12 months exceed 20% of annual family income -> 100% charity.",
      },
      note: "Free care at or below 300% FPL; 301-400% FPL receives an 86% discount (not free). Less generous on free care than Cedars-Sinai and UCLA, which give free care to 400% FPL.",
      // Split is from Exhibit B of the Providence CA FAP as filed with HCAI (Revised 2/16/2023).
      // Current policy body (Revised 12/1/2025, same policy no. PSJH RCM 002 CA) keeps the same
      // framework and Exhibit B pointers but does not render the exhibit's numbers in its PDF.
      // ACTION: re-confirm the 2025 Exhibit B figures before launch.
      splitConfidence:
        "exhibit-2023-filing; 2025 body unchanged in structure; reconfirm before launch",
      verifiedOn: "2026-06-19",
      source:
        "https://www.providence.org/-/media/project/psjh/shared/files/financial-assistance/policy/ca/fa-policy-english.pdf",
      exhibitBSource:
        "https://api.hdc.hcai.ca.gov/Public/Extract/Attachment?id=799b99d7-ffea-4747-acd3-8f316e3c2ab6",
    },
    {
      id: "cedars",
      name: "Cedars-Sinai",
      city: "Los Angeles",
      freeMaxPctFpl: 400, // care without charge at or below 400% FPL
      discountMaxPctFpl: 600, // 401–600% FPL sliding scale
      verifiedOn: "2026-06-19",
      source:
        "https://www.cedars-sinai.org/billing-insurance-records/help-paying-your-bill.html",
    },
    {
      id: "ucla",
      name: "UCLA Health",
      city: "Los Angeles",
      freeMaxPctFpl: 400, // hospital (facility) services: 100% discount at/below 400% FPL
      discountMaxPctFpl: 450, // 401–450% FPL partial
      physicianServices: {
        // SEPARATE policy for professional charges
        freeMaxPctFpl: 200,
        discountMaxPctFpl: 350,
        note: "Physician professional charges are billed and assessed separately from the hospital facility bill.",
      },
      paymentPlan: "interest-free, up to 12 months standard",
      verifiedOn: "2026-06-19",
      source:
        "https://www.uclahealth.org/patient-resources/billing-insurance/financial-assistance-program/hospital-services-help-paying-your-bill",
    },
  ],

  // Referral resources — official URLs, verified 2026-06-19. Not endorsements.
  // Open in a new tab with rel=noopener noreferrer + no-referrer (no user data sent).
  resources: [
    {
      id: "dollarfor",
      name: "Dollar For",
      cat: "reduce",
      url: "https://dollarfor.org",
      note: "Free help applying for hospital charity care.",
    },
    {
      id: "paf",
      name: "Patient Advocate Foundation",
      cat: "reduce",
      url: "https://www.patientadvocate.org",
      note: "Case managers; resolve billing errors and find aid.",
    },
    {
      id: "hcai",
      name: "California HCAI Hospital Bill Complaint Program",
      cat: "reduce",
      url: "https://hcai.ca.gov/affordability/hospital-fair-billing-program/",
      note: "State regulator; file a complaint if a hospital breaks the rules.",
    },
    {
      id: "pan",
      name: "PAN Foundation",
      cat: "oop",
      url: "https://www.panfoundation.org",
      note: "Grants for copays/treatment; usually disease-specific, require insurance.",
    },
    {
      id: "healthwell",
      name: "HealthWell Foundation",
      cat: "oop",
      url: "https://www.healthwellfoundation.org",
      note: "Grants for copays/premiums; usually disease-specific, require insurance.",
    },
    {
      id: "nafc",
      name: "Free & charitable clinics (NAFC)",
      cat: "local",
      url: "https://nafcclinics.org/find-healthcare-services/",
      note: "Find low- or no-cost care near you.",
    },
    {
      id: "211",
      name: "Dial 211 (United Way)",
      cat: "local",
      url: "https://www.211.org",
      note: "Local programs incl. county medical-debt relief (often automatic — can't apply).",
    },
  ],
};

export interface EligibilityResult {
  key: "free" | "disc" | "border" | "above";
  pct: number;
  label: string;
}

/** 100% FPL for a household size (handles >8). */
export function fplFor(size: HouseholdSize): number {
  const t = CORPUS.fpl.table100;
  if (size <= 8) return t[size];
  return t[8] + CORPUS.fpl.addPerPerson * (size - 8);
}

/** Returns { key, label } given income, household size, and a hospital object. */
export function eligibilityTier(
  income: number,
  size: HouseholdSize,
  hospital: Hospital,
): EligibilityResult {
  const pct = Math.round((income / fplFor(size)) * 100);
  const free = hospital.freeMaxPctFpl;
  const disc = hospital.discountMaxPctFpl ?? hospital.assistanceMaxPctFpl;
  if (free != null && pct <= free)
    return { key: "free", pct, label: "Likely eligible for free / charity care" };
  if (disc != null && pct <= disc)
    return { key: "disc", pct, label: "Likely eligible for a discounted rate" };
  if (pct <= (disc ?? 400) + 100)
    return { key: "border", pct, label: "Borderline — worth applying" };
  return {
    key: "above",
    pct,
    label: "Above the assistance line — use your fair-pricing rights",
  };
}
