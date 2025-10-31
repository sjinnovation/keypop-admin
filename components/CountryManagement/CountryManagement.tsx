"use client";

import React, { useState, useEffect } from "react";
import Table from "../Global/Table";
import Button from "../Global/Button";
import { toast } from "react-toastify";
import Preloader from "../Global/Preloader/Preloader";
import Image from "next/image";
import { Icons } from "@/Assets";
import { Edit2 } from "iconsax-react";
import { useTranslations } from "next-intl";
import { createCountry, deleteCountry, getAllCountries } from "@/Api/CountryAPI";
import CountryCreateModal from "./CountryCreateModal";

const CountryManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editCountryData, setEditCountryData] = useState<Record<string, any> | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const translate = useTranslations("CountryManagement");

  const columns = [
    { header: translate("Table.Name"), accessor: "name" },
    { header: translate("Table.Code"), accessor: "code" },
    {
      header: translate("Table.Status"),
      accessor: "isActive",
      render: (value: boolean) => (
        <span
          className={`px-2 py-1 rounded text-sm ${
            value ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          {value ? translate("Active") : translate("Inactive")}
        </span>
      ),
    },
    {
      header: translate("Table.SurveyAvailability"),
      accessor: "surveyAvailable",
      render: (value: boolean) => (
        <span
          className={`px-2 py-1 rounded text-sm ${
            value ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          {value ? translate("Available") : translate("Unavailable")}
        </span>
      ),
    },
    {
      header: translate("Table.Actions"),
      accessor: "_id",
      render: (value: string, row: any) => (
        <div className="flex space-x-2">
          {/* <button className="px-2 py-1" onClick={() => handleEditClick(row)}>
            <Edit2 size={20} color="#B5B5C3" variant="Bold" />
          </button> */}
          <button className="px-2 py-1" onClick={() => handleDeleteClick(value)}>
            <Image src={Icons.DeleteIcon} alt="Delete" width={16} height={16} />
          </button>
        </div>
      ),
    },
  ];

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await getAllCountries();
      setTableData(response || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch countries");
      toast.error(err.message || "Failed to fetch countries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleCreateCountry = async (data: any) => {
    try {
      setLoading(true);
      if (isEdit && editCountryData?._id) {
        // await updateCountry(editCountryData._id, data);
        toast.success("Country updated successfully");
      } else {
        await createCountry(data);
        toast.success("Country created successfully");
      }

      fetchCountries();
      setIsEdit(false);
      setEditCountryData(null);
    } catch (err: any) {
      setError(err.message || "Failed to save country");
      toast.error(err.message || "Failed to save country");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (country: any) => {
    setEditCountryData(country);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this country?")) {
      try {
        setLoading(true);
        await deleteCountry(id);
        toast.success("Country deleted successfully");
        fetchCountries();
      } catch (err: any) {
        setError(err.message || "Failed to delete country");
        toast.error(err.message || "Failed to delete country");
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
            setEditCountryData(null);
            setIsModalOpen(true);
          }}
        >
          {translate("AddCountryButton")}
        </Button>
      </div>

      {loading && !isModalOpen ? (
        <div className="flex justify-center items-center p-4"><Preloader /></div>
      ) : (
        <Table
          columns={columns}
          data={tableData}
          showPagination={false}
        />
      )}

      <CountryCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateCountry}
        countryData={editCountryData}
        isEdit={isEdit}
      />
    </div>
  );
};

export default CountryManagement;
