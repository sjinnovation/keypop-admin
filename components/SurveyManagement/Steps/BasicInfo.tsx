import { getAllCountries } from "@/Api/CountryAPI";
import { SurveyData } from "@/types/surveyTypes";
import { useEffect, useState } from "react";

interface BasicInfoProps {
  surveyData: SurveyData;
  setSurveyData: React.Dispatch<React.SetStateAction<SurveyData>>;
  countries: any;
  setCountries: any;
}

export default function BasicInfo({
  surveyData,
  setSurveyData,
  countries,
  setCountries
}: BasicInfoProps) {

  const getCountries = async () => {
    const response = await getAllCountries();
    setCountries(response);
  }

  useEffect(() => {
    getCountries();
  }, []);

  console.log(surveyData)

  return (
    <div className="space-y-6">
      {/* Survey Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Survey Title *
        </label>
        <input
          type="text"
          value={surveyData.title}
          onChange={(e) =>
            setSurveyData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
          placeholder="Enter survey title"
          required
        />
      </div>

      {/* Country ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country *
        </label>
        <select
          value={surveyData.country}
          onChange={(e) =>
            setSurveyData((prev: any) => ({ ...prev, country: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
        >
          <option value="" disabled>
            Select Country
          </option>
          {countries.map((country: any) => (
            <option key={country._id} value={country._id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Active Status */}
      <div className="flex items-center p-3 bg-gray-50 rounded-md">
        <input
          type="checkbox"
          id="isActive"
          checked={surveyData.isActive}
          onChange={(e) =>
            setSurveyData((prev) => ({ ...prev, isActive: e.target.checked }))
          }
          className="h-4 w-4 text-[#3b82f6] focus:ring-[#3b82f6] border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
          Survey is active and available for responses
        </label>
      </div>
    </div>
  );
}
