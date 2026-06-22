import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { strings as enStrings } from "./strings";

export type Strings = typeof enStrings;
export type Locale = "en" | "es";

export const SUPPORTED_LOCALES: Locale[] = ["en", "es"];

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "es";
}

// Registry of available locale string bundles. English is the source of truth;
// future locales can register a DeepPartial<Strings> here and missing keys will
// transparently fall back to English via the proxy below.
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

const localeBundles: Record<Locale, DeepPartial<Strings>> = {
  en: enStrings,
  // Spanish bundle is intentionally empty for now — every key falls back to
  // English via the Proxy below. Add translations here incrementally.
  es: {},
};

// Recursively wraps a localized bundle in a Proxy that falls back to the
// English value for any missing key (at any depth). Arrays and primitives
// from the localized bundle are returned as-is when present.
function withFallback<T extends object>(localized: DeepPartial<T> | undefined, fallback: T): T {
  return new Proxy({} as T, {
    get(_target, prop: string | symbol) {
      const fallbackValue = (fallback as Record<string | symbol, unknown>)[prop as string];
      const localizedValue =
        localized === undefined
          ? undefined
          : (localized as Record<string | symbol, unknown>)[prop as string];

      const chosen = localizedValue === undefined ? fallbackValue : localizedValue;

      if (
        chosen !== null &&
        typeof chosen === "object" &&
        !Array.isArray(chosen) &&
        fallbackValue !== null &&
        typeof fallbackValue === "object" &&
        !Array.isArray(fallbackValue)
      ) {
        return withFallback(
          localizedValue as DeepPartial<object> | undefined,
          fallbackValue as object,
        );
      }
      return chosen;
    },
    has(_target, prop) {
      return prop in (fallback as object);
    },
    ownKeys() {
      return Reflect.ownKeys(fallback as object);
    },
    getOwnPropertyDescriptor(_target, prop) {
      return Object.getOwnPropertyDescriptor(fallback as object, prop);
    },
  });
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  strings: Strings;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  children: ReactNode;
  /** Controlled locale. When omitted, the provider manages its own state. */
  locale?: Locale;
  /** Called when something inside the tree requests a locale change. */
  onLocaleChange?: (locale: Locale) => void;
  initialLocale?: Locale;
}

export function LocaleProvider({
  children,
  locale: controlledLocale,
  onLocaleChange,
  initialLocale = "en",
}: LocaleProviderProps) {
  const [uncontrolledLocale, setUncontrolledLocale] = useState<Locale>(initialLocale);
  const locale = controlledLocale ?? uncontrolledLocale;

  const value = useMemo<LocaleContextValue>(() => {
    const bundle = localeBundles[locale];
    const merged = locale === "en" ? enStrings : withFallback<Strings>(bundle, enStrings);
    const setLocale = (next: Locale) => {
      if (controlledLocale === undefined) setUncontrolledLocale(next);
      onLocaleChange?.(next);
    };
    return { locale, setLocale, strings: merged };
  }, [locale, controlledLocale, onLocaleChange]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (ctx) return ctx;
  // Permissive fallback: when used outside a provider (e.g. error boundary
  // rendered before the tree mounts), return English directly so copy still
  // renders. Locale switching is a no-op in this mode.
  return { locale: "en", setLocale: () => {}, strings: enStrings };
}

export function useStrings(): Strings {
  return useLocale().strings;
}
