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
import { getAllCountries } from "@/Api/CountryAPI";
import { useRouter } from "next/navigation";
import { deleteSurvey, getAllSurveys } from "@/Api/SurveyApi";

const SurveyManagement = () => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const translate = useTranslations("SurveyManagement");
  const router = useRouter();

  const columns = [
    { header: translate("Table.Title"), accessor: "title" },
    { header: translate("Table.Country"), accessor: "country" },
    {
      header: translate("Table.Actions"),
      accessor: "_id",
      render: (value: string, row: any) => (
        <div className="flex space-x-2">
          <button className="px-2 py-1" onClick={() => handleEditClick(row)}>
            <Edit2 size={20} color="#B5B5C3" variant="Bold" />
          </button>
          <button className="px-2 py-1" onClick={() => handleDeleteClick(value)}>
            <Image src={Icons.DeleteIcon} alt="Delete" width={16} height={16} />
          </button>
        </div>
      ),
    },
  ];

  const fetchSurveys = async () => {
  try {
    setLoading(true);
    const [response, countryResponse] = await Promise.all([
      getAllSurveys(),
      getAllCountries()
    ]);
    
    const countryMap = Object.fromEntries(
      countryResponse.map((country: any) => [country._id, country.name])
    );
    
    const surveysWithCountryNames = response.map((survey: any) => ({
      ...survey,
      country: countryMap[survey.country] || survey.country
    }));
    
    setTableData(surveysWithCountryNames);
    setError(null);
  } catch (err: any) {
    setError(err.message || "Failed to fetch surveys");
    toast.error(err.message || "Failed to fetch surveys");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleEditClick = (survey: any) => {
    router.push(`/dashboard/survey/${survey._id}`)
  };

  const handleDeleteClick = async (id: string) => {
  if (window.confirm("Are you sure you want to delete this survey?")) {
    try {
      setTableData(prev => prev.filter(survey => survey._id !== id));
      await deleteSurvey(id);
      toast.success("Survey deleted successfully");
    } catch (err: any) {
      fetchSurveys();
      setError(err.message || "Failed to delete survey");
      toast.error(err.message || "Failed to delete survey");
    }
  }
};

  const handleAddSurvey = () => {
    router.push('/dashboard/survey/add')
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          {translate("Title")}
        </h1>
        <Button
          className="px-4 py-1.5 bg-[#3b82f6] hover:bg-[#1c59bb]"
          onClick={handleAddSurvey}
        >
          {translate("AddSurveyButton")}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-4">
          <Preloader />
        </div>
      ) : (
        <Table
          columns={columns}
          data={tableData}
          showPagination={false}
        />
      )}
    </div>
  );
};

export default SurveyManagement;