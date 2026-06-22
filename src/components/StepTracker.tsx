import { strings } from "@/lib/strings";

type StepTrackerProps = {
  /** Zero-based index of the current step (0–3). */
  current: number;
};

/**
 * Shared four-step progress tracker used on every screen of the flow.
 * Labels live in strings.common.steps so they can never drift.
 */
export function StepTracker({ current }: StepTrackerProps) {
  const steps = strings.common.steps;
  return (
    <ol
      aria-label={strings.common.a11y.progress}
      className="grid grid-cols-4 gap-2 border-b border-border/60 pt-6 pb-4"
    >
      {steps.map((s, i) => {
        const active = i === current;
        return (
          <li key={s.num} className="flex flex-col gap-1.5">
            <span
              aria-hidden
              className={`h-0.5 w-full ${active ? "bg-pine" : "bg-border"}`}
            />
            <p className="font-mono text-xs text-muted-foreground">{s.num}</p>
            <p
              aria-current={active ? "step" : undefined}
              className={`text-sm ${
                active ? "font-medium text-foreground" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
