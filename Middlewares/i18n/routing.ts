import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'th'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

/** Fixed zone so server and client agree (avoids next-intl ENVIRONMENT_FALLBACK). */
export const APP_TIME_ZONE = 'UTC';

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);