"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Table from "../Global/Table";
import Button from "../Global/Button";
import { toast } from "react-toastify";
import {
  deleteAdminSurveyResponse,
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
    if (typeof o.$oid === "string") return o.$oid;
    if (typeof o._id === "string") return o._id;
  }
  return undefined;
}

function getSurveyResponseRowId(row: any): string | undefined {
  if (!row || typeof row !== "object") return undefined;
  for (const key of ["_id", "id", "responseId", "response_id"] as const) {
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

  const resolveMessage = useCallback(
    (code: string) => {
      if (code === "UNAUTHORIZED") return t("ErrorUnauthorized");
      if (code === "FORBIDDEN") return t("ErrorForbidden");
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
        render: (value: string) => value || "—",
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
            <button
              type="button"
              className="px-2 py-1 disabled:opacity-40"
              disabled={!id || deletingId === id}
              onClick={() => handleDeleteResponse(id)}
              aria-label={t("DeleteResponse")}
            >
              <Image src={Icons.DeleteIcon} alt={t("DeleteResponse")} width={16} height={16} />
            </button>
          );
        },
      },
    ],
    [t, deletingId, handleDeleteResponse]
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
    </div>
  );
};

export default SurveyResponses;
