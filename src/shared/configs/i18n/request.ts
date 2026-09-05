import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import Negotiator from 'negotiator';
import { match } from '@formatjs/intl-localematcher';
import { LOCALES } from './locales';

const defaultLocale = LOCALES[0];

function detectBrowserLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return defaultLocale;

  const negotiator = new Negotiator({
    headers: { 'accept-language': acceptLanguage },
  });
  const preferredLanguages = negotiator.languages();

  try {
    return match(preferredLanguages, LOCALES, defaultLocale);
  } catch {
    return defaultLocale;
  }
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;

  let locale: string;
  if (cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)) {
    locale = cookieLocale;
  } else {
    const headerStore = await headers();
    locale = detectBrowserLocale(headerStore.get('accept-language'));
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
