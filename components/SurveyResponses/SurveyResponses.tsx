"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Table from "../Global/Table";
import Button from "../Global/Button";
import { toast } from "react-toastify";
import {
  deleteAdminSurveyResponse,
  getAdminSurveyResponseDetail,
  getAdminSurveyResponses,
  getAllSurveys,
} from "@/Api/SurveyApi";
import { downloadAllSurveyResponses } from "@/Api/ExportApi";
import Preloader from "../Global/Preloader/Preloader";
import { useTranslations } from "next-intl";
import { Icons } from "@/Assets";

const formatDate = (value: string | undefined) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
};

/** Admin list payloads may use _id, id, or responseId, and sometimes BSON as { $oid }. */
function coerceResponseId(raw: unknown): string | undefined {
  if (raw == null || raw === "") return undefined;
  if (typeof raw === "string") {
    const t = raw.trim();
    return t || undefined;
  }
  if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
  if (typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    if (typeof o.$oid === "string" && o.$oid.trim()) return o.$oid.trim();
    if (typeof o._id === "string" && o._id.trim()) return o._id.trim();
    // Mongoose ObjectId-like (toString → 24-char hex)
    const withToString = raw as { toString?: () => string };
    if (typeof withToString.toString === "function") {
      const s = withToString.toString().trim();
      if (/^[a-f0-9]{24}$/i.test(s)) return s;
    }
  }
  return undefined;
}

function getSurveyResponseRowId(row: any): string | undefined {
  if (!row || typeof row !== "object") return undefined;
  // Prefer API field names used by GET /survey/admin/responses
  for (const key of ["responseId", "_id", "id", "response_id"] as const) {
    const s = coerceResponseId(row[key]);
    if (s) return s;
  }
  return undefined;
}

function normalizeAdminResponsesPayload(payload: unknown, fallbackLimit: number) {
  const p = payload as Record<string, unknown> | undefined;
  let inner: Record<string, unknown> = {};

  if (p) {
    const nested = p.data;
    if (
      nested &&
      typeof nested === "object" &&
      !Array.isArray(nested) &&
      Array.isArray((nested as Record<string, unknown>).responses)
    ) {
      inner = nested as Record<string, unknown>;
    } else if (Array.isArray(p.responses)) {
      inner = p;
    }
  }

  const responses = Array.isArray(inner.responses) ? inner.responses : [];
  const pagination =
    inner.pagination && typeof inner.pagination === "object"
      ? (inner.pagination as Record<string, unknown>)
      : {};

  const total =
    typeof pagination.total === "number"
      ? pagination.total
      : typeof pagination.count === "number"
        ? pagination.count
        : responses.length;

  const totalPagesFromApi =
    typeof pagination.totalPages === "number" ? pagination.totalPages : null;

  const totalPages =
    totalPagesFromApi != null && totalPagesFromApi > 0
      ? totalPagesFromApi
      : Math.max(1, Math.ceil(total / fallbackLimit));

  return { responses, total, totalPages };
}

const SurveyResponses = () => {
  const t = useTranslations("SurveyResponses");

  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [surveyFilter, setSurveyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "complete" | "partial">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [listVersion, setListVersion] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoadingId, setDetailLoadingId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<any | null>(null);

  const resolveMessage = useCallback(
    (code: string) => {
      if (code === "UNAUTHORIZED") return t("ErrorUnauthorized");
      if (code === "FORBIDDEN") return t("ErrorForbidden");
      if (code === "NOT_FOUND") return t("DetailNotFound");
      if (code === "COMMUNITY_ADMIN_COUNTRY_REQUIRED") {
        return t("ErrorCommunityAdminCountry");
      }
      return code;
    },
    [t]
  );

  const fetchSurveysList = useCallback(async () => {
    try {
      const data = await getAllSurveys();
      setSurveys(Array.isArray(data) ? data : []);
    } catch {
      /* surveys filter optional */
    }
  }, []);

  useEffect(() => {
    fetchSurveysList();
  }, [fetchSurveysList]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setListError(null);
        const params: {
          page: number;
          limit: number;
          surveyId?: string;
          status?: "complete" | "partial";
        } = { page: currentPage, limit: itemsPerPage };
        if (surveyFilter) params.surveyId = surveyFilter;
        if (statusFilter) params.status = statusFilter;

        const raw = await getAdminSurveyResponses(params);
        if (cancelled) return;
        const { responses, totalPages: tp } = normalizeAdminResponsesPayload(
          raw,
          itemsPerPage
        );
        setTableData(responses);
        setTotalPages(tp);
        if (responses.length === 0 && currentPage > 1) {
          setCurrentPage((p) => Math.max(1, p - 1));
        }
      } catch (err: any) {
        if (cancelled) return;
        const msg = resolveMessage(err.message || t("FetchFailed"));
        setListError(msg);
        toast.error(msg);
        setTableData([]);
        setTotalPages(1);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    currentPage,
    itemsPerPage,
    surveyFilter,
    statusFilter,
    listVersion,
    resolveMessage,
    t,
  ]);

  const handleViewResponse = useCallback(
    async (responseId: string) => {
      if (!responseId) return;
      try {
        setDetailLoadingId(responseId);
        setDetailData(null);
        setDetailOpen(true);
        const data = await getAdminSurveyResponseDetail(responseId);
        setDetailData(data);
      } catch (err: any) {
        setDetailOpen(false);
        toast.error(resolveMessage(err.message || t("DetailFailed")));
      } finally {
        setDetailLoadingId(null);
      }
    },
    [resolveMessage, t]
  );

  const handleDeleteResponse = useCallback(
    async (responseId: string) => {
      if (!responseId || !window.confirm(t("DeleteConfirm"))) return;
      try {
        setDeletingId(responseId);
        await deleteAdminSurveyResponse(responseId);
        toast.success(t("DeleteSuccess"));
        setListVersion((v) => v + 1);
      } catch (err: any) {
        toast.error(resolveMessage(err.message || t("DeleteFailed")));
      } finally {
        setDeletingId(null);
      }
    },
    [t, resolveMessage]
  );

  const handleExport = async (format: "pdf" | "csv") => {
    if (!surveyFilter) return;
    try {
      setExporting(true);
      await downloadAllSurveyResponses(surveyFilter, format);
      toast.success(t("ExportSuccess", { format: format.toUpperCase() }));
    } catch (err: any) {
      toast.error(resolveMessage(err.message || t("ExportFailed")));
    } finally {
      setExporting(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: t("Table.Survey"),
        accessor: "surveyId",
        render: (_: unknown, row: any) =>
          row.survey?.title || row.surveyTitle || row.surveyId || "—",
      },
      {
        header: t("Table.Respondent"),
        accessor: "userId",
        render: (_: unknown, row: any) =>
          row.user?.email || row.user?.name || row.respondentEmail || row.userId || "—",
      },
      {
        header: t("Table.Status"),
        accessor: "status",
        render: (_: unknown, row: any) => {
          const complete =
            row.isComplete === true ||
            row.status === "complete" ||
            row.completionStatus === "complete";
          return complete ? t("StatusComplete") : t("StatusPartial");
        },
      },
      {
        header: t("Table.Submitted"),
        accessor: "updatedAt",
        render: (value: string, row: any) =>
          formatDate(value || row.submittedAt || row.createdAt),
      },
      {
        header: t("Table.ResponseId"),
        accessor: "_id",
        render: (_: unknown, row: any) => {
          const id = getSurveyResponseRowId(row);
          return typeof id === "string" && id.length > 12 ? `${id.slice(0, 12)}…` : id || "—";
        },
      },
      {
        header: t("Table.Actions"),
        accessor: "_id",
        render: (_: unknown, row: any) => {
          const id = getSurveyResponseRowId(row);
          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-2 py-1 text-sm rounded border border-[#e1dfeb61] text-[#3b82f6] hover:bg-[#eff6ff] disabled:opacity-40"
                disabled={!id || detailLoadingId === id || deletingId === id}
                onClick={() => id && handleViewResponse(id)}
              >
                {t("ViewResponse")}
              </button>
              <button
                type="button"
                className="px-2 py-1 disabled:opacity-40"
                disabled={!id || deletingId === id}
                onClick={() => handleDeleteResponse(id!)}
                aria-label={t("DeleteResponse")}
              >
                <Image src={Icons.DeleteIcon} alt={t("DeleteResponse")} width={16} height={16} />
              </button>
            </div>
          );
        },
      },
    ],
    [t, deletingId, detailLoadingId, handleDeleteResponse, handleViewResponse]
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">{t("Title")}</h1>

      <div className="flex flex-col xl:flex-row xl:flex-wrap xl:items-end gap-4 mb-6">
        <label className="flex flex-col gap-1 text-sm text-[#8f8db0]">
          <span className="font-medium">{t("FilterSurvey")}</span>
          <select
            value={surveyFilter}
            onChange={(e) => {
              setSurveyFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="min-w-[220px] rounded-md border border-[#e1dfeb61] bg-[#f6f5fa] px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40"
          >
            <option value="">{t("AllSurveys")}</option>
            {surveys.map((s: any) => (
              <option key={s._id} value={s._id}>
                {s.title || s._id}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-[#8f8db0]">
          <span className="font-medium">{t("FilterStatus")}</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "" | "complete" | "partial");
              setCurrentPage(1);
            }}
            className="min-w-[180px] rounded-md border border-[#e1dfeb61] bg-[#f6f5fa] px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40"
          >
            <option value="">{t("AllStatuses")}</option>
            <option value="complete">{t("StatusComplete")}</option>
            <option value="partial">{t("StatusPartial")}</option>
          </select>
        </label>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            className="!bg-[#b91c1c] hover:!bg-[#991b1b]"
            disabled={!surveyFilter || exporting}
            onClick={() => handleExport("pdf")}
          >
            {t("DownloadPdf")}
          </Button>
          <Button disabled={!surveyFilter || exporting} onClick={() => handleExport("csv")}>
            {t("DownloadCsv")}
          </Button>
        </div>
      </div>

      {!surveyFilter && (
        <p className="text-sm text-[#8f8db0] mb-4">{t("ExportHint")}</p>
      )}

      {listError && (
        <p className="text-red-600 text-sm mb-4" role="alert">
          {listError}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center items-center p-4">
          <Preloader />
        </div>
      ) : (
        <Table
          columns={columns}
          data={tableData}
          showPagination={true}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(n) => {
            setItemsPerPage(n);
            setCurrentPage(1);
          }}
          itemsPerPageOptions={[10, 20, 50, 100]}
        />
      )}

      {detailOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45"
          role="dialog"
          aria-modal="true"
          aria-labelledby="survey-response-detail-title"
          onClick={() => detailLoadingId === null && setDetailOpen(false)}
        >
          <div
            className="bg-[#f6f5fa] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-[#e1dfeb61]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 p-4 border-b border-[#e1dfeb61] bg-white">
              <h2 id="survey-response-detail-title" className="text-lg font-semibold text-[var(--foreground)]">
                {detailLoadingId
                  ? t("DetailLoading")
                  : detailData?.survey?.title || t("ViewResponse")}
              </h2>
              <button
                type="button"
                className="shrink-0 px-3 py-1.5 text-sm rounded-md border border-[#e1dfeb61] hover:bg-[#f6f5fa]"
                disabled={detailLoadingId !== null}
                onClick={() => setDetailOpen(false)}
              >
                {t("DetailClose")}
              </button>
            </div>

            <div className="overflow-y-auto p-4 flex-1 space-y-4 text-[var(--foreground)]">
              {detailLoadingId !== null && (
                <div className="flex justify-center py-12">
                  <Preloader />
                </div>
              )}
              {detailLoadingId === null && detailData && (
                <>
                  {detailData.howToRead &&
                    (detailData.howToRead.shortSummary ||
                      detailData.howToRead.summary ||
                      detailData.howToRead.indexMeaning) && (
                      <div className="rounded-md bg-white border border-[#e1dfeb61] p-3 text-sm text-[#5c5a7a] space-y-2">
                        <p className="font-medium text-[var(--foreground)]">{t("DetailGuide")}</p>
                        {(detailData.howToRead.shortSummary || detailData.howToRead.summary) && (
                          <p>{detailData.howToRead.shortSummary || detailData.howToRead.summary}</p>
                        )}
                        {detailData.howToRead.indexMeaning && (
                          <p className="text-[#5c5a7a]">{detailData.howToRead.indexMeaning}</p>
                        )}
                      </div>
                    )}

                  <div className="rounded-md bg-white border border-[#e1dfeb61] p-3 text-sm space-y-1">
                    <p>
                      <span className="text-[#8f8db0]">{t("DetailWho")}: </span>
                      {detailData.respondent?.name || "—"} · {detailData.respondent?.email || "—"}
                      {detailData.respondent?.country ? (
                        <>
                          {" "}
                          · {detailData.respondent.country}
                        </>
                      ) : null}
                    </p>
                    <p>
                      <span className="text-[#8f8db0]">{t("DetailSurvey")}: </span>
                      {detailData.survey?.title || "—"}
                    </p>
                    <p>
                      <span className="text-[#8f8db0]">{t("DetailSubmitted")}: </span>
                      {formatDate(detailData.submittedAt)}
                    </p>
                    <p>
                      <span className="text-[#8f8db0]">{t("DetailCompletion")}: </span>
                      {detailData.completionPercentage ?? detailData.completion?.percentage ?? 0}%
                      {detailData.isComplete ? ` · ${t("StatusComplete")}` : ` · ${t("StatusPartial")}`}
                    </p>
                  </div>

                  {detailData.summaryCounts &&
                    typeof detailData.summaryCounts === "object" &&
                    !Array.isArray(detailData.summaryCounts) && (
                      <div className="rounded-md bg-white border border-[#e1dfeb61] p-3 text-sm">
                        <p className="font-medium text-[var(--foreground)] mb-2">
                          {t("DetailSummaryCounts")}
                        </p>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                          {Object.entries(detailData.summaryCounts as Record<string, unknown>).map(
                            ([k, v]) => (
                              <div key={k} className="flex gap-2">
                                <dt className="text-[#8f8db0] shrink-0">{k}</dt>
                                <dd className="font-medium">{String(v)}</dd>
                              </div>
                            )
                          )}
                        </dl>
                      </div>
                    )}

                  {detailData.statistics != null && (
                    <div className="rounded-md bg-white border border-[#e1dfeb61] p-3 text-sm">
                      <p className="font-medium text-[var(--foreground)] mb-2">
                        {t("DetailStatistics")}
                      </p>
                      {typeof detailData.statistics === "object" &&
                      !Array.isArray(detailData.statistics) ? (
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                          {Object.entries(detailData.statistics as Record<string, unknown>).map(
                            ([k, v]) => (
                              <div key={k} className="flex gap-2">
                                <dt className="text-[#8f8db0] shrink-0">{k}</dt>
                                <dd className="font-medium break-all">{String(v)}</dd>
                              </div>
                            )
                          )}
                        </dl>
                      ) : (
                        <pre className="text-xs overflow-x-auto bg-[#f6f5fa] p-2 rounded border border-[#e1dfeb61]/80">
                          {JSON.stringify(detailData.statistics, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}

                  {Array.isArray(detailData.skippedQuestions) &&
                    detailData.skippedQuestions.length > 0 && (
                      <div className="rounded-md bg-white border border-[#e1dfeb61] p-3 text-sm">
                        <p className="font-medium text-[var(--foreground)] mb-2">
                          {t("DetailSkippedQuestions")}
                        </p>
                        <ul className="list-disc list-inside space-y-0.5 text-[#5c5a7a]">
                          {detailData.skippedQuestions.map((entry: unknown, i: number) => (
                            <li key={i}>
                              {typeof entry === "string" || typeof entry === "number"
                                ? String(entry)
                                : entry != null && typeof entry === "object" &&
                                    "code" in (entry as object)
                                  ? String((entry as { code: unknown }).code)
                                  : JSON.stringify(entry)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {(detailData.sections || []).map((sec: any, secIdx: number) => (
                    <section
                      key={sec.sectionCode ?? `sec-${secIdx}`}
                      className="rounded-md bg-white border border-[#e1dfeb61] overflow-hidden"
                    >
                      <h3 className="text-sm font-semibold px-3 py-2 bg-[#eef2ff] text-[#3730a3] border-b border-[#e1dfeb61]">
                        {sec.partNumber != null && sec.partTotal != null
                          ? `${t("DetailSection")} ${sec.partNumber}/${sec.partTotal}: ${sec.sectionTitle ?? ""}`
                          : sec.sectionTitle ?? t("DetailSection")}
                      </h3>
                      <ul className="divide-y divide-[#e1dfeb61]/80">
                        {(sec.items || []).map((item: any, itemIdx: number) => (
                          <li
                            key={`${sec.sectionCode ?? secIdx}-${item.code ?? itemIdx}-${item.indexInResponse ?? itemIdx}`}
                            className="p-3 text-sm"
                          >
                            <p className="text-xs text-[#8f8db0] mb-1">
                              {item.indexInResponse != null &&
                              item.indexTotalForThisSubmission != null
                                ? `${t("DetailQuestion")} ${item.indexInResponse}/${item.indexTotalForThisSubmission} · `
                                : null}
                              {item.code}
                              {item.skipped ? ` · ${t("DetailSkippedTag")}` : ""}
                            </p>
                            <p className="font-medium text-[var(--foreground)] mb-2 whitespace-pre-wrap">
                              {item.questionText}
                            </p>
                            <p className="text-[#8f8db0]">
                              {t("DetailAnswerType")}:{" "}
                              {item.answerTypeLabel ?? item.answerType ?? "—"}
                            </p>
                            <p className="mt-1 whitespace-pre-wrap">
                              <span className="text-[#8f8db0]">{t("DetailAnswer")}: </span>
                              {item.readableAnswer != null && item.readableAnswer !== ""
                                ? item.readableAnswer
                                : item.skipped
                                  ? t("DetailSkippedAnswer")
                                  : t("DetailNoAnswer")}
                            </p>
                            {Array.isArray(item.keyPopulation) && item.keyPopulation.length > 0 && (
                              <p className="mt-1 text-xs text-[#8f8db0]">
                                {t("DetailKeyPopulation")}: {item.keyPopulation.join(", ")}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyResponses;
