import { getRequestConfig } from 'next-intl/server';
import {notFound} from 'next/navigation';
import { createAppMessageFallback } from './getMessageFallback';
import { APP_TIME_ZONE, routing } from './routing';
import { ensureCriticalMessages } from '@/utils/intlMessages';

export default getRequestConfig(async ({
  requestLocale
  }) => {
   // This typically corresponds to the `[locale]` segment
   let locale = await requestLocale;
   
   // Validate that the incoming `locale` parameter is valid
   if (!routing.locales.includes(locale as any)) notFound();
  // Ensure that the incoming locale is valid
   if (!locale || !routing.locales.includes(locale as any)) {
     locale = routing.defaultLocale;
   }
   
    const raw = (await import(`@/constant/translate/${locale}.json`)).default;
    const messages = ensureCriticalMessages(raw, locale);

    return {
      locale,
      messages,
      timeZone: APP_TIME_ZONE,
      getMessageFallback: createAppMessageFallback(locale),
    };
  });