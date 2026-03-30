"use client";

import React, { useEffect, useMemo, useState } from "react";
import Table from "../Global/Table";
import { getAllUsers } from "@/Api/UserApi";
import { useAccountType } from "@/Hooks/useAccountType";
import { useRouter } from "@/Middlewares/i18n/routing";
import Preloader from "../Global/Preloader/Preloader";
import { useTranslations } from "next-intl";
import { FAILED_TO_FETCH_USERS } from "@/constant/ToastContants";

const formatJoined = (value: string | undefined) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
};

const RegisteredUsers = () => {
  const { user, isLoading: authLoading } = useAccountType();
  const router = useRouter();
  const translate = useTranslations("RegisteredUsers");

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    if (user.role !== "superadmin") {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "superadmin") return;

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { users } = await getAllUsers();
        if (!cancelled) setAllUsers(users);
      } catch (err: any) {
        if (!cancelled) setError(err.message || FAILED_TO_FETCH_USERS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter]);

  const distinctRoles = useMemo(() => {
    const set = new Set<string>();
    allUsers.forEach((u) => {
      if (u?.role != null && u.role !== "") set.add(String(u.role));
    });
    return Array.from(set).sort();
  }, [allUsers]);

  const filteredUsers = useMemo(() => {
    if (!roleFilter) return allUsers;
    return allUsers.filter((u) => String(u?.role) === roleFilter);
  }, [allUsers, roleFilter]);

  const tableData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));

  const columns = [
    { header: translate("Table.Name"), accessor: "name" },
    { header: translate("Table.Email"), accessor: "email" },
    {
      header: translate("Table.Role"),
      accessor: "role",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded text-sm ${
            value === "communityadmin"
              ? "bg-blue-100 text-blue-600"
              : value === "admin"
                ? "bg-green-100 text-green-600"
                : value === "superadmin"
                  ? "bg-yellow-50 text-yellow-600"
                  : "bg-gray-100 text-gray-600"
          }`}
        >
          {value === "admin"
            ? "Admin"
            : value === "communityadmin"
              ? "Community Admin"
              : value === "superadmin"
                ? "Super Admin"
                : value || "—"}
        </span>
      ),
    },
    {
      header: translate("Table.Joined"),
      accessor: "createdAt",
      render: (value: string) => formatJoined(value),
    },
  ];

  if (authLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Preloader />
      </div>
    );
  }

  if (!user || user.role !== "superadmin") {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">{translate("Title")}</h1>
        <label className="flex flex-col gap-1 text-sm text-[#8f8db0]">
          <span className="font-medium">{translate("FilterByRole")}</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="min-w-[200px] rounded-md border border-[#e1dfeb61] bg-[#f6f5fa] px-3 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40"
          >
            <option value="">{translate("AllRoles")}</option>
            {distinctRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-4" role="alert">
          {error}
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
          itemsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
    </div>
  );
};

export default RegisteredUsers;
