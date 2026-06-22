import { useLocale, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n";

const LABELS: Record<Locale, string> = {
  en: "EN",
  es: "ES",
};

const FULL_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Español",
};

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
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            aria-label={FULL_NAMES[code]}
            onClick={() => setLocale(code)}
            className={
              "rounded-full px-2.5 py-1 uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
              (active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            {LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
