import { useLocale, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";

const LABELS: Record<Locale, string> = {
  en: "EN",
  es: "ES",
};

const FULL_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Español",
};

// Locales selectable in the UI. Spanish is wired in the locale infrastructure
// but disabled until its translation bundle is ready.
const ACTIVE_LOCALES: Locale[] = ["en"];

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-medium"
    >
      {SUPPORTED_LOCALES.map((code) => {
        const active = code === locale;
        const selectable = ACTIVE_LOCALES.includes(code);
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            aria-label={selectable ? FULL_NAMES[code] : `${FULL_NAMES[code]} (coming soon)`}
            disabled={!selectable}
            onClick={() => selectable && setLocale(code)}
            className={
              "rounded-full px-2.5 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
              (active
                ? "bg-foreground text-background"
                : selectable
                  ? "text-muted-foreground hover:text-foreground"
                  : "cursor-not-allowed text-muted-foreground/40")
            }
          >
            <span className="uppercase tracking-wide">{LABELS[code]}</span>
            {!selectable && (
              <span className="ml-0.5 align-top text-[9px] font-normal normal-case tracking-normal text-muted-foreground/60">
                soon
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
