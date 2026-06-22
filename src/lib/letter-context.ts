// Client-only context bridging Check it / Qualify → Get your letter.
// Stored in sessionStorage so nothing is sent or persisted across sessions.

const KEY = "fairbill:letter-context:v1";

export type DuplicateLine = {
  description: string;
  amount: number | null;
};

export type CheckContext = {
  format?: "summary" | "itemized";
  duplicates: DuplicateLine[];
  surpriseConfirmed: boolean;
};

export type QualifyContext =
  | {
      kind: "hospital";
      hospitalId?: string;
      hospitalName: string;
      eligibility?: "free" | "disc" | "border" | "above";
      income?: number;
      household?: number;
      pct?: number;
    }
  | {
      kind: "independent";
    };

export type LetterContext = {
  check?: CheckContext;
  qualify?: QualifyContext;
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function readLetterContext(): LetterContext {
  if (!isBrowser()) return {};
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as LetterContext;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export function writeLetterContext(patch: Partial<LetterContext>): void {
  if (!isBrowser()) return;
  try {
    const current = readLetterContext();
    const next: LetterContext = { ...current, ...patch };
    window.sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* swallow — privacy-first; nothing leaves the device */
  }
}
