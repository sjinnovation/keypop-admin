import type { AbstractIntlMessages } from "next-intl";

/** Deep-merge message trees: keys only in `base` stay; `override` wins on conflicts. */
export function mergeMessages(
  base: Record<string, unknown>,
  override: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const oVal = override[key];
    const bVal = base[key];
    if (
      oVal &&
      typeof oVal === "object" &&
      !Array.isArray(oVal) &&
      bVal &&
      typeof bVal === "object" &&
      !Array.isArray(bVal)
    ) {
      out[key] = mergeMessages(
        bVal as Record<string, unknown>,
        oVal as Record<string, unknown>
      );
    } else if (oVal !== undefined) {
      out[key] = oVal;
    }
  }
  return out;
}

export const SIDEBAR_SURVEY_RESPONSES_EN = "Survey responses";
export const SIDEBAR_SURVEY_RESPONSES_TH = "คำตอบแบบสำรวจ";

/** Same copy as `Sidebar.SurveyResponses` in locale JSON; avoids use-intl MISSING_MESSAGE edge cases in the sidebar. */
export function getSidebarSurveyResponsesLabel(locale: string): string {
  return locale === "th" ? SIDEBAR_SURVEY_RESPONSES_TH : SIDEBAR_SURVEY_RESPONSES_EN;
}

/** Ensures keys exist after RSC serialization / partial loads. */
export function ensureCriticalMessages(
  messages: AbstractIntlMessages,
  locale: string
): AbstractIntlMessages {
  const surveyLabel = getSidebarSurveyResponsesLabel(locale);
  const sidebarRaw = messages.Sidebar;
  const sidebar =
    sidebarRaw && typeof sidebarRaw === "object" && !Array.isArray(sidebarRaw)
      ? { ...(sidebarRaw as Record<string, unknown>) }
      : {};

  sidebar.SurveyResponses = surveyLabel;

  return {
    ...messages,
    Sidebar: sidebar as AbstractIntlMessages,
  };
}
