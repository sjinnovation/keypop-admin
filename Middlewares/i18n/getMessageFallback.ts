/** Shared by `getRequestConfig` and `NextIntlClientProvider` (client needs this explicitly). */
import { getSidebarSurveyResponsesLabel } from "@/utils/intlMessages";

export function createAppMessageFallback(locale: string) {
  const survey = getSidebarSurveyResponsesLabel(locale);

  return ({
    namespace,
    key,
  }: {
    error: unknown;
    key: string;
    namespace?: string;
  }) => {
    const isSurveyKey =
      key === "SurveyResponses" ||
      key === "Sidebar.SurveyResponses" ||
      key.endsWith(".SurveyResponses");
    if (
      isSurveyKey &&
      (namespace === "Sidebar" || namespace === undefined || namespace === "")
    ) {
      return survey;
    }
    return [namespace, key].filter(Boolean).join(".");
  };
}
