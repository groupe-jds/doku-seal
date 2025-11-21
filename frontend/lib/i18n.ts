import { i18n } from '@lingui/core';

export async function getTranslations(locale: string) {
  // Always use compiled .mjs files in Next.js
  const { messages } = await import(`@doku-seal/lib/translations/${locale}/web.mjs`);
  return messages;
}

export async function dynamicActivate(locale: string) {
  const messages = await getTranslations(locale);
  i18n.loadAndActivate({ locale, messages });
}

export { i18n };
