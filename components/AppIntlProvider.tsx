"use client";

import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import type { ReactNode } from "react";
import en from "@/constant/translate/en.json";
import th from "@/constant/translate/th.json";
import { createAppMessageFallback } from "@/Middlewares/i18n/getMessageFallback";
import { APP_TIME_ZONE } from "@/Middlewares/i18n/routing";
import { ensureCriticalMessages, mergeMessages } from "@/utils/intlMessages";

const clientLocaleMessages: Record<string, AbstractIntlMessages> = {
  en: en as AbstractIntlMessages,
  th: th as AbstractIntlMessages,
};

export default function AppIntlProvider({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: AbstractIntlMessages;
  children: ReactNode;
}) {
  const baseline = clientLocaleMessages[locale] ?? clientLocaleMessages.en;
  const reconciled = mergeMessages(
    baseline as Record<string, unknown>,
    messages as Record<string, unknown>
  ) as AbstractIntlMessages;
  const merged = ensureCriticalMessages(reconciled, locale);

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={merged}
      timeZone={APP_TIME_ZONE}
      getMessageFallback={createAppMessageFallback(locale)}
    >
      {children}
    </NextIntlClientProvider>
  );
}
