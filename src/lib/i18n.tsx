import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { strings as enStrings } from "./strings";

export type Strings = typeof enStrings;
export type Locale = "en";

// Registry of available locale string bundles. English is the source of truth;
// future locales can register a DeepPartial<Strings> here and missing keys will
// transparently fall back to English via the proxy below.
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

const localeBundles: Record<Locale, DeepPartial<Strings>> = {
  en: enStrings,
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

export function LocaleProvider({
  children,
  initialLocale = "en",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const value = useMemo<LocaleContextValue>(() => {
    const bundle = localeBundles[locale];
    const merged = locale === "en" ? enStrings : withFallback<Strings>(bundle, enStrings);
    return { locale, setLocale, strings: merged };
  }, [locale]);

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
