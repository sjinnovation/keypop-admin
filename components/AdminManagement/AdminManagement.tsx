"use client";

import React, { useState, useEffect } from "react";
import Table from "../Global/Table";
import Button from "../Global/Button";
import AdminCreateModal from "./AdminCreateModal";
import { getAdminUsers, deleteUser, getAllAdminUsers } from "@/Api/UserApi";
import { useAccountType } from "@/Hooks/useAccountType";
import { toast } from "react-toastify";
import Preloader from "../Global/Preloader/Preloader";
import Image from "next/image";
import { Icons } from "@/Assets";
import { Edit2 } from "iconsax-react";
import { DELETE_USER_CONFIRMATION, FAILED_TO_DELETE_USER, FAILED_TO_FETCH_USERS, SUCCESS_DELETE_TOAST } from "@/constant/ToastContants";
import { exportData } from "@/Api/ExportApi";
import ExportButton from "../Global/Export";
import { useTranslations } from "next-intl";

const AdminManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editUserData, setEditUserData] = useState<Record<string, string> | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const { user } = useAccountType();
  const translate = useTranslations("AdminManagement");
  const role = user?.role;
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  // Define columns
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
              : "bg-yellow-50 text-yellow-600"
          }`}
        >
          {value === "admin" ? "Admin" : 
           value === "communityadmin" ? "Community Admin" : 
           value === "superadmin" ? "Super Admin" : value}
        </span>
      ),
    },
    {
      header: translate("Table.Actions"),
      accessor: "_id",
      render: (value: string, row: any) => (
        <div className="flex space-x-2">
          <button
            className="px-2 py-1"
            onClick={() => handleEditClick(row)}
          >
            <Edit2 size={20} color="#B5B5C3" variant="Bold" />
          </button>
          <button
            className="px-2 py-1"
            onClick={() => handleDeleteClick(value)}
          >
            <Image src={Icons.DeleteIcon} alt="Delete" width={16} height={16} />
          </button>
        </div>
      ),
    },
  ];

  const fetchUsers = async (page = currentPage, limit = itemsPerPage) => {
    try {
      setLoading(true);
      const response = await getAdminUsers(page, limit);
      setTableData(response.data.users || []);
      setTotalPages(Math.ceil((response.data.pagination.total) / limit));
      setError(null);
    } catch (err: any) {
      setError(err.message || FAILED_TO_FETCH_USERS);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: "pdf" | "csv", filters: any) => {
    try {
      const data = await getAllAdminUsers(filters);
      if (!data?.data?.contactRequests || data?.data?.contactRequests.length === 0) {
        toast.error("No data found to export");
        return;
      }
      await exportData(type, data?.data?.contactRequests);
      toast.success(`${type.toUpperCase()} exported successfully`);
    } catch (err: any) {
      toast.error(`Failed to export ${type.toUpperCase()}`);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); 
  };


  const handleEditClick = (user: any) => {
    setEditUserData(user);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (userId: string) => {
    if (window.confirm(DELETE_USER_CONFIRMATION)) {
      try {
        setLoading(true);
        await deleteUser(userId);
        toast.success(SUCCESS_DELETE_TOAST);
        fetchUsers();
      } catch (err: any) {
        setError(err.message || FAILED_TO_DELETE_USER);
        toast.error(err.message || FAILED_TO_DELETE_USER);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
        {translate("Title")}
        </h1>
        <Button
          className="px-4 py-1.5 bg-[#3b82f6] hover:bg-[#1c59bb]"
          onClick={() => {
            setIsEdit(false);
            setEditUserData(null);
            setIsModalOpen(true);
          }}
        >
          {translate("CreateAdminButton")}
        </Button>
      </div>

      <ExportButton tableData={tableData} handleExport={handleExport} />

      {loading && !isModalOpen ? (
        <div className="flex justify-center items-center p-4"><Preloader/></div>
      ) : (
        <Table 
          columns={columns} 
          data={tableData}
          showPagination={true}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          itemsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
      
      <AdminCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchUsers();
          setIsEdit(false);
          setEditUserData(null);
        }}
        userData={editUserData}
        isEdit={isEdit}
      />
    </div>
  );
};

export default AdminManagement;