"use client";

import React, { useState, useEffect } from "react";
import Table from "../Global/Table";
import Button from "../Global/Button";
import { toast } from "react-toastify";
import { getContactRequests, updateContactRequestStatus, getAllContactRequests } from "@/Api/ContactRequestApi";
import { exportData } from "@/Api/ExportApi";
import Preloader from "../Global/Preloader/Preloader";
import ExportButton from "../Global/Export";
import { useTranslations } from "next-intl";

const ContactRequests = () => {
  const translate = useTranslations("ContactRequests");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  // Define columns
  const columns = [
    { header: translate("Table.Name"), accessor: "name" },
    { header: translate("Table.Email"), accessor: "email" },
    { header: translate("Table.Phone"), accessor: "phoneNumber" },
    { header: translate("Table.Message"), accessor: "message" },
    {
      header: translate("Table.Status"),
      accessor: "_id",
      render: (value: string, row: any) => (
        <div className="flex space-x-2">
          <Button
            className="px-2 py-1 bg-[#118009] text-white text-xs hover:bg-[#0f6809] whitespace-nowrap"
            onClick={() => {
              updateContactRequestStatus(value, "ACKNOWLEDGED");
              fetchContactRequests();
              toast.success("Request acknowledged successfully");
            }}
            disabled={row.status === "ACKNOWLEDGED"}
          >
            {row.status === "ACKNOWLEDGED" ? translate("AcknowledgedButton") : translate("AcknowledgeButton")}
          </Button>
        </div>
      ),
    },
  ];

  const fetchContactRequests = async (page = currentPage, limit = itemsPerPage) => {
    try {
      setLoading(true);
      const response = await getContactRequests(page, limit);
      setTableData(response.data.contactRequests || []);
      setTotalPages(Math.ceil((response.data.pagination.total) / limit));
    } catch (err: any) {
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: "pdf" | "csv", filters: any) => {
    try {
      const data = await getAllContactRequests(filters);
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
    fetchContactRequests();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          {translate("Title")}
        </h1>
      </div>

      {/* <ExportButton tableData={tableData} handleExport={handleExport} /> */}
      
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
      
    </div>
  );
};

export default ContactRequests;