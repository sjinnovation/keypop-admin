"use client";

import React, { useState, useEffect } from "react";
import Modal from "../Global/Modal";
import Form from "../Global/Form";
import { useTranslations } from "next-intl";

interface CountryCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: Record<string, any>) => void;
  countryData?: Record<string, any> | null;
  isEdit?: boolean;
}

const CountryCreateModal: React.FC<CountryCreateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  countryData = null,
  isEdit = false,
}) => {
  const translatePopup = useTranslations("CountryManagement.CreateCountryPopup");
  const [formData, setFormData] = useState<Record<string, any>>({
    name: "",
    code: "",
    isActive: true,
    surveyAvailable: false,
  });
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (countryData && isEdit) {
      setFormData({
        name: countryData.name || "",
        code: countryData.code || "",
        isActive: countryData.isActive !== undefined && countryData.isActive,
        surveyAvailable: countryData.surveyAvailable !== undefined && countryData.surveyAvailable,
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: "",
        code: "",
        isActive: false,
        surveyAvailable: false,
      });
    }
  }, [countryData, isEdit, isOpen]);

  const handleChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const statusOptions = [
    { label: translatePopup("Dropdown.Active"), value: true },
    { label: translatePopup("Dropdown.Inactive"), value: false },
  ];

  const surveyAvailabilityOptions = [
    { label: translatePopup("Dropdown.Available"), value: true },
    { label: translatePopup("Dropdown.Unavailable"), value: false },
  ];

  const handleSubmit = (data: Record<string, any>) => {
    const processedData = {
      ...data,
      isActive: data.isActive == 'true' || false,
      surveyAvailable: data.surveyAvailable == 'true' || false,
    };
    onCreate(processedData);
    onClose();
  };

  const formFields = [
    { 
      label: translatePopup("Name"), 
      name: "name", 
      type: "text", 
      required: true,
      placeholder: translatePopup("NamePlaceholder")
    },
    { 
      label: translatePopup("Code"), 
      name: "code", 
      type: "text", 
      required: true,
      placeholder: translatePopup("CodePlaceholder")
    },
    {
      label: translatePopup("Status"),
      name: "isActive",
      type: "select",
      options: statusOptions,
      placeholder: translatePopup("Dropdown.Placeholder"),
      required: true,
    },
    {
      label: translatePopup("SurveyAvailability"),
      name: "surveyAvailable",
      type: "select",
      options: surveyAvailabilityOptions,
      placeholder: translatePopup("Dropdown.Placeholder"),
      required: true,
    },
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEdit ? translatePopup("EditCountry") : translatePopup("AddNewCountry")}
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <Form
        fields={formFields.map((field) => ({
          ...field,
          value: field.type === "select" 
            ? String(formData[field.name]) 
            : formData[field.name],
          onChange: handleChange,
        }))}
        submitButtonText={translatePopup("SubmitButton")}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
};

export default CountryCreateModal;