import {NextRequest} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './Middlewares/i18n/routing';

const handleI18nRouting = createMiddleware(routing);
 
export default function middleware(request: NextRequest) {
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next|monitoring).*)', 
    '/', 
    '/api/:path*', // Include all API routes
    '/trpc/:path*' // Include all trpc routes if needed
  ],
};