"use client";

import { useState, useEffect } from "react";
import Button from "../Global/Button";
import { createSurvey, editSurvey } from "@/Api/SurveyApi";
import {
  SurveyData,
  StepId,
  Step,
  ANSWER_TYPES,
  KEY_POPULATIONS,
  Category,
  Question,
  AnswerType,
} from "@/types/surveyTypes";
import BasicInfo from "./Steps/BasicInfo";
import Categories from "./Steps/Categories";
import Questions from "./Steps/Questions";
import Review from "./Steps/Review";
import { useRouter } from "next/navigation";

interface AddSurveyProps {
  initialData?: SurveyData;
}

export default function AddSurvey({ initialData }: AddSurveyProps) {
  const isEditMode = !!initialData;
  const router = useRouter();

  // Main survey data state
  const [surveyData, setSurveyData] = useState<SurveyData>({
    title: "",
    country: "",
    categories: [],
    questions: [],
    isActive: true,
  });
  const [countries, setCountries] = useState([]);

  // Initialize with props data if provided
  useEffect(() => {
    if (initialData) {
      setSurveyData(initialData);
    }
  }, [initialData]);

  // UI state
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [currentStep, setCurrentStep] = useState<StepId>("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Steps configuration
  const steps: Step[] = [
    { id: "basic", name: "Basic Info" },
    { id: "categories", name: "Categories" },
    { id: "questions", name: "Questions" },
    { id: "review", name: "Review" },
  ];

  // Category management functions
  const addCategory = () => {
    const newCategory: Category = {
      code: "",
      title: "",
      tempId: Date.now(),
    };
    setSurveyData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  };

  const updateCategory = (
    index: number,
    field: keyof Category,
    value: string
  ) => {
    setSurveyData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat, i) =>
        i === index ? { ...cat, [field]: value } : cat
      ),
    }));
  };

  const removeCategory = (index: number) => {
    setSurveyData((prev) => {
      const categoryCode = prev.categories[index]?.code;
      return {
        ...prev,
        categories: prev.categories.filter((_, i) => i !== index),
        questions: prev.questions.filter(
          (q) => q.categoryCode !== categoryCode
        ),
      };
    });
  };

  // Question management functions
  const addQuestion = (categoryCode: string) => {
    const newQuestion: Question = {
      code: "",
      categoryCode,
      text: "",
      answerType: "Rating",
      ratingScale: [1, 2, 3, 4, 5],
      options: [],
      showIf: null,
      specificToKP: [],
      tempId: Date.now(),
    };
    setSurveyData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (
    index: number,
    field: keyof Question,
    value: string | string[] | number[]
  ) => {
    setSurveyData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i === index) {
          const updatedQuestion = { ...q, [field]: value };

          // Auto-manage ratingScale based on answerType
          if (field === "answerType") {
            updatedQuestion.ratingScale =
              value === "Rating" ? [1, 2, 3, 4, 5] : [];
          }

          return updatedQuestion;
        }
        return q;
      }),
    }));
  };

  const removeQuestion = (index: number) => {
    setSurveyData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  // UI helper functions
  const toggleCategory = (categoryCode: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryCode)) {
        newSet.delete(categoryCode);
      } else {
        newSet.add(categoryCode);
      }
      return newSet;
    });
  };

  const getQuestionsForCategory = (categoryCode: string) => {
    return surveyData.questions
      .map((q, index) => ({ ...q, originalIndex: index }))
      .filter((q) => q.categoryCode === categoryCode);
  };

  // Submit handler with validation
  const handleSubmit = async () => {
    // Validation checks
    if (!surveyData.title.trim()) {
      alert("Please enter a survey title.");
      return;
    }


    if (!surveyData.country || !surveyData.country.trim()) {
      alert("Please select a country.");
      return;
    }

    if (surveyData.categories.length === 0) {
      alert("Please add at least one category.");
      return;
    }

    if (surveyData.questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }

    // Additional validation: Check if categories have required fields
    const invalidCategories = surveyData.categories.filter(
      (cat) => !cat.code.trim() || !cat.title.trim()
    );

    if (invalidCategories.length > 0) {
      alert("Please ensure all categories have both code and title filled.");
      return;
    }

    // Additional validation: Check if questions have required fields
    const invalidQuestions = surveyData.questions.filter(
      (q) => !q.code.trim() || !q.text.trim() || !q.categoryCode.trim()
    );

    if (invalidQuestions.length > 0) {
      alert(
        "Please ensure all questions have code, text, and category assigned."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      if (isEditMode) {
        response = await editSurvey(surveyData._id, surveyData);
      } else {
        response = await createSurvey(surveyData);
      }

      if (response) {
        alert(isEditMode ? "Survey updated successfully!" : "Survey created successfully!");
        if (!isEditMode) {
          // Reset form only in create mode
          setSurveyData({
            title: "",
            country: "",
            categories: [],
            questions: [],
            isActive: true,
          });
          setCurrentStep("basic");
          router.push('/dashboard/survey');
        }
      } else {
        alert(isEditMode ? "Error updating survey. Please try again." : "Error creating survey. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step navigation
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const canProceed =
    currentStep !== "review" ||
    (surveyData.categories.length > 0 &&
      surveyData.questions.length > 0 &&
      surveyData.title.trim() &&
      surveyData.country && surveyData.country.trim());

  const goToPreviousStep = () => {
    const prevIndex = Math.max(0, currentStepIndex - 1);
    setCurrentStep(steps[prevIndex].id);
  };

  const goToNextStep = () => {
    const nextIndex = Math.min(steps.length - 1, currentStepIndex + 1);
    setCurrentStep(steps[nextIndex].id);
  };

  // Render current step content
  const renderCurrentStep = () => {
    const props = {
      surveyData,
      setSurveyData,
      expandedCategories,
      toggleCategory,
      addCategory,
      updateCategory,
      removeCategory,
      addQuestion,
      updateQuestion,
      removeQuestion,
      getQuestionsForCategory,
      ANSWER_TYPES,
      KEY_POPULATIONS,
      countries,
      setCountries
    };

    switch (currentStep) {
      case "basic":
        return <BasicInfo {...props} />;
      case "categories":
        return <Categories {...props} />;
      case "questions":
        return <Questions {...props} />;
      case "review":
        return <Review {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            {isEditMode ? "Edit Survey" : "Create New Survey"}
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <nav className="flex space-x-8">
            {steps.map((step, index) => (
              <button
                key={step.id}
                className={`flex items-center text-sm font-medium ${currentStep === step.id
                    ? "text-[#3b82f6]"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm mr-3 ${index == currentStepIndex
                      ? "bg-[#3b82f6] text-white"
                      : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {index + 1}
                </span>
                {step.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="px-6 py-6">{renderCurrentStep()}</div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-between">
          <Button
            onClick={goToPreviousStep}
            disabled={currentStepIndex === 0 || isSubmitting}
            className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>

          <div className="flex space-x-4">
            {currentStep === "review" ? (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed || isSubmitting}
                className="px-6 py-2 bg-[#3b82f6] hover:bg-[#1c59bb] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? (isEditMode ? "Updating..." : "Creating...")
                  : (isEditMode ? "Update Survey" : "Create Survey")
                }
              </Button>
            ) : (
              <Button
                onClick={goToNextStep}
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#3b82f6] hover:bg-[#1c59bb] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}