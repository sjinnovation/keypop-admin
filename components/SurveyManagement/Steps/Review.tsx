import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { SurveyData } from "@/types/surveyTypes";

interface ReviewProps {
  surveyData: SurveyData;
  getQuestionsForCategory: (categoryCode: string) => any[];
  countries: any;
}

const Review: React.FC<ReviewProps> = ({
  surveyData,
  getQuestionsForCategory,
  countries,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Review Survey</h3>
        <p className="text-sm text-gray-600 mt-1">
          Review all details before creating the survey
        </p>
      </div>

      {/* Basic Information Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
          Basic Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Title</p>
            <p className="text-gray-900 font-medium">
              {surveyData.title || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Country</p>
            <p className="text-gray-900 font-medium">
              {countries.find((country: any) => country._id === surveyData.country)
                ?.name || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <span
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                surveyData.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {surveyData.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Statistics Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
          Summary Statistics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {surveyData.categories.length}
            </div>
            <p className="text-sm text-gray-600 font-medium">Categories</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {surveyData.questions.length}
            </div>
            <p className="text-sm text-gray-600 font-medium">Total Questions</p>
          </div>
        </div>
      </div>

      {/* Category Breakdown Section */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Category Breakdown</h4>
        {surveyData.categories.map((category) => (
          <div
            key={category.code || category.tempId}
            className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-semibold text-gray-900 text-lg">
                  {category.code} - {category.title}
                </h5>
                <p className="text-sm text-gray-600 mt-1">
                  {getQuestionsForCategory(category.code).length} questions in
                  this category
                </p>
              </div>
              <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                {getQuestionsForCategory(category.code).length} Q's
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Warning Section for Incomplete Survey */}
      {(surveyData.categories.length === 0 ||
        surveyData.questions.length === 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Survey Incomplete
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Please ensure you have:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {surveyData.categories.length === 0 && (
                    <li>At least one category</li>
                  )}
                  {surveyData.questions.length === 0 && (
                    <li>At least one question</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
