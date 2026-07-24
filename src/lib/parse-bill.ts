// Pure bill parser shared by /check and /demo. No side effects, no imports.

export type ParsedLine = {
  raw: string;
  description: string;
  amount: number | null;
  isDuplicate: boolean;
};

export function parseBill(text: string): ParsedLine[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const amtRe = /\$?\s?([0-9]{1,3}(?:,[0-9]{3})+(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?)\s*$/;

  const initial: Omit<ParsedLine, "isDuplicate">[] = lines.map((raw) => {
    const m = raw.match(amtRe);
    if (!m) return { raw, description: raw, amount: null };
    const amount = parseFloat(m[1].replace(/,/g, ""));
    const description = raw
      .slice(0, raw.length - m[0].length)
      .replace(/[\s\u2014\-:·|]+$/, "")
      .trim();
    return {
      raw,
      description: description || raw,
      amount: Number.isFinite(amount) ? amount : null,
    };
  });

  const counts = new Map<string, number>();
  for (const l of initial) {
    if (l.amount === null) continue;
    const key = `${l.description.toLowerCase()}|${l.amount}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return initial.map((l) => {
    if (l.amount === null) return { ...l, isDuplicate: false };
    const key = `${l.description.toLowerCase()}|${l.amount}`;
    return { ...l, isDuplicate: (counts.get(key) ?? 0) > 1 };
  });
}
