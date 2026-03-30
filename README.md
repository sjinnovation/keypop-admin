This is a [Next.js](https://nextjs.org) admin front end for Keypop. It talks to the backend using `NEXT_PUBLIC_API_URL` and sends `Authorization: Bearer <token>` on authenticated requests (see `lib/axios.ts`).

## Survey admin API (client paths)

These paths are relative to `NEXT_PUBLIC_API_URL` (often already prefixed with `/api` on the server). Same auth and admin role rules apply as for other dashboard routes.

| Method | Path | Notes |
|--------|------|--------|
| GET | `/survey/admin/responses` | Paginated list; query: `page`, `limit`, optional `surveyId`, `status` (`complete` \| `partial`). |
| GET | `/survey/admin/responses/:responseId` | Single response JSON for the UI: `howToRead` (short summary + `indexMeaning`), `respondent`, `survey`, `submittedAt`, completion fields, `statistics`, `skippedQuestions`, `summaryCounts`, `sections` with items (`code`, `questionText`, `answerType`, `answerTypeLabel`, `skipped`, `readableAnswer`, `keyPopulation`, indices). Superadmin/admin: any response; community admin: only if respondent’s country matches (same scope as delete). |
| DELETE | `/survey/admin/responses/:responseId` | Remove a response; same scope as above. |

The survey responses screen calls **`getAdminSurveyResponseDetail`** in `Api/SurveyApi.ts` for the detail route and opens a modal with the guide, respondent block, metrics, and section cards.

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family from Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://vercel.com/docs/frameworks/nextjs) for more details.
