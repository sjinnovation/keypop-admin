import { axiosPrivate } from "@/lib/axios";
import { EXPORT_ALL_SURVEY_RESPONSES, EXPORT_DATA } from "@/constant/ApiConstants";
import { filenameFromContentDisposition, getMessageFromBlobError } from "@/utils/blobError";

export const exportData = async (type: string, tableData: any) => {
  try {
    const response = await axiosPrivate.post(
      EXPORT_DATA(),
      { type, tableData },
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `contact-requests-${type}.${type}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error: any) {
    const data = error.response?.data;
    if (data instanceof Blob) {
      const msg = await getMessageFromBlobError(data);
      throw new Error(msg || error.response?.data?.error || "Export failed");
    }
    throw new Error(error.response?.data?.error || error.response?.data?.message || "Export failed");
  }
};

export const downloadAllSurveyResponses = async (
  surveyId: string,
  format: "pdf" | "csv"
) => {
  const fallbackName = `survey-${surveyId}-responses.${format}`;
  try {
    const response = await axiosPrivate.get(EXPORT_ALL_SURVEY_RESPONSES(surveyId), {
      params: { format },
      responseType: "blob",
    });

    const blob: Blob = response.data;
    const ct = (response.headers["content-type"] || "").toLowerCase();

    if (ct.includes("application/json")) {
      const text = await blob.text();
      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(text) as Record<string, unknown>;
      } catch {
        throw new Error("Export failed");
      }
      if (parsed.success === false) {
        throw new Error(
          String(parsed.message || parsed.error || "Export failed")
        );
      }
    }

    const filename = filenameFromContentDisposition(
      response.headers["content-disposition"],
      fallbackName
    );
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    if (error?.response?.status === 401) throw new Error("UNAUTHORIZED");
    if (error?.response?.status === 403) throw new Error("FORBIDDEN");
    const data = error?.response?.data;
    if (data instanceof Blob) {
      const msg = await getMessageFromBlobError(data);
      throw new Error(msg || "Export failed");
    }
    throw new Error(error?.message || "Export failed");
  }
};
