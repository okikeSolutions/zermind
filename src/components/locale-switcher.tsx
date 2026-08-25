import { getLocale, locales, setLocale, type Locale } from "@/paraglide/runtime.js";
import * as m from "@/paraglide/messages.js";
import { sx } from "@/styles/sx";

const localeLabels: Record<Locale, () => string> = {
  en: m.language_english,
  de: m.language_german,
};

export function LocaleSwitcher() {
  const activeLocale = getLocale();

  return (
    <div
      aria-label={m.language_switcher_label()}
      role="group"
      {...sx("flex items-center rounded-md border bg-background/80 p-0.5")}
    >
      {locales.map((locale) => (
        <button
          aria-pressed={locale === activeLocale}
          key={locale}
          onClick={() => setLocale(locale)}
          title={localeLabels[locale]()}
          type="button"
          {...sx(
            "rounded px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground aria-pressed:bg-primary aria-pressed:text-primary-foreground",
          )}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
