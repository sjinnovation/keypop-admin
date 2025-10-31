"use client";

import React, { useState } from "react";
import { Icons } from "@/Assets";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ExportButtonProps {
  tableData: any[];
  handleExport: (type: "pdf" | "csv", filters: any) => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ tableData, handleExport }) => {
  const translate = useTranslations("Export");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="relative">
      {/* Export Button */}
      <button
        className="px-4 py-2 border-2 border-[#d3d4d5] rounded-md hover:bg-[#d3d4d5] disabled:opacity-50 mb-4"
        title={translate("Tooltip")}
        onClick={() => setIsModalOpen(true)}
        disabled={tableData.length === 0}
      >
        <Image src={Icons.ExportIcon} alt="Delete" width={20} height={20} />
      </button>

      {/* Side Modal */}
      <>
        {/* Overlay */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsModalOpen(false)}
          ></div>
        )}

        {/* Modal Content */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
            isModalOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col p-4">
            {/* Close Button */}
            <button
              className="self-end text-gray-600 hover:text-gray-800"
              onClick={() => setIsModalOpen(false)}
            >
              <Image src={Icons.CancelIcon} alt="X" width={20} height={20} />
            </button>

            {/* Modal Title */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {translate("ExportOptions.Title")}
            </h3>

            <div>
              {/* Date picker */}
              <label className="block mb-2 text-gray-700 text-sm">
              {translate("ExportOptions.StartDate")}:
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                className="block w-full mb-4 border border-gray-300 rounded-md p-2"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <label className="block mb-2 text-gray-700 text-sm">
                {translate("ExportOptions.EndDate")}:
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                className="block w-full mb-4 border border-gray-300 rounded-md p-2"
                placeholder="End Date"
                value={endDate}
                onChange={((e)=>{setEndDate(e.target.value)})}
              />
            </div>

            {/* PDF Button */}
            <button
              className="mb-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => {
                handleExport("pdf", { startDate, endDate });
                setIsModalOpen(false);
              }}
            >
              {translate("ExportOptions.PDFButton")}
            </button>

            {/* CSV Button */}
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              onClick={() => {
                handleExport("csv", { startDate, endDate });
                setIsModalOpen(false);
              }}
            >
              {translate("ExportOptions.CSVButton")}
            </button>
          </div>
        </div>
      </>
    </div>
  );
};

export default ExportButton;