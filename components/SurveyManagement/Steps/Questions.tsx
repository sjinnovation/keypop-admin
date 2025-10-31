import {
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Button from "../../Global/Button";
import { AnswerType, Question, SurveyData } from "@/types/surveyTypes";

interface QuestionsProps {
  surveyData: SurveyData;
  expandedCategories: Set<string>;
  toggleCategory: (categoryCode: string) => void;
  addQuestion: (categoryCode: string) => void;
  updateQuestion: (
    index: number,
    field: keyof Question,
    value: string | string[] | number[] | any
  ) => void;
  removeQuestion: (index: number) => void;
  getQuestionsForCategory: (categoryCode: string) => any[];
  ANSWER_TYPES: AnswerType[];
  KEY_POPULATIONS: readonly string[];
}

export default function Questions({
  surveyData,
  expandedCategories,
  toggleCategory,
  addQuestion,
  updateQuestion,
  removeQuestion,
  getQuestionsForCategory,
  ANSWER_TYPES,
  KEY_POPULATIONS,
}: QuestionsProps) {

  // Get available questions for conditional logic
  const getAvailableQuestionsForCondition = (currentQuestionIndex: number, categoryCode: string) => {
    return surveyData.questions.filter((q, index) =>
      index < currentQuestionIndex &&
      q.categoryCode === categoryCode &&
      q.code.trim() !== ""
    );
  };

  // Get possible answers for a question based on its answer type
  const getPossibleAnswers = (question: Question) => {
    switch (question.answerType) {
      case "YesNo":
        return ["Yes", "No"];
      case "MCQ":
        return question.options?.filter(opt => opt.trim() !== "") || [];
      case "Rating":
        return question.ratingScale?.map(num => num.toString()) || [];
      default:
        return [];
    }
  };

  // Handle removing question and its dependent questions
  const handleRemoveQuestion = (questionIndex: number) => {
    const questionToRemove = surveyData.questions[questionIndex];

    // Find and remove dependent questions
    const dependentQuestions = surveyData.questions
      .map((q: any, index) => ({ question: q, index }))
      .filter(({ question }) => question.showIf?.questionCode === questionToRemove.code);

    // Remove in reverse order to maintain correct indices
    dependentQuestions.reverse().forEach(({ index }) => {
      removeQuestion(index);
    });

    // Remove the main question
    removeQuestion(questionIndex);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          Questions by Category
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Add questions to each category
        </p>
      </div>

      <div className="space-y-4">
        {surveyData.categories.map((category) => (
          <div
            key={category.code || category.tempId}
            className="border border-gray-200 rounded-lg bg-white"
          >
            {/* Category Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleCategory(category.code)}
            >
              <div className="flex items-center">
                {expandedCategories.has(category.code) ? (
                  <ChevronDownIcon className="h-5 w-5 text-gray-400 mr-2" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5 text-gray-400 mr-2" />
                )}
                <div>
                  <span className="font-medium text-gray-900">
                    {category.code} - {category.title}
                  </span>
                  <p className="text-sm text-gray-500">
                    {getQuestionsForCategory(category.code).length} questions
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addQuestion(category.code);
                  toggleCategory(category.code);
                }}
                className="flex items-center px-3 py-2 bg-[#3b82f6] hover:bg-[#1c59bb] text-white text-sm rounded"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Question
              </button>
            </div>

            {/* Questions List */}
            {expandedCategories.has(category.code) && (
              <div className="border-t border-gray-200 p-4 space-y-4 bg-gray-50">
                {getQuestionsForCategory(category.code).map(
                  (question, index) => {
                    const availableQuestions = getAvailableQuestionsForCondition(question.originalIndex, category.code);
                    const selectedParentQuestion = question.showIf?.questionCode
                      ? surveyData.questions.find(q => q.code === question.showIf.questionCode)
                      : null;

                    return (
                      <div
                        key={question.tempId || question.originalIndex}
                        className="bg-white rounded-lg p-4 border border-gray-100"
                      >
                        <h1 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                          Question {index + 1}
                          {question.showIf && (
                            <span className="ml-2 text-sm font-normal text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              Conditional
                            </span>
                          )}
                        </h1>

                        {/* Question Code and Answer Type */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Question Code *
                            </label>
                            <input
                              type="text"
                              value={question.code}
                              onChange={(e) =>
                                updateQuestion(
                                  question.originalIndex,
                                  "code",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                              placeholder="e.g., 1.1.1, A1.1, etc."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Answer Type *
                            </label>
                            <select
                              value={question.answerType}
                              onChange={(e) =>
                                updateQuestion(
                                  question.originalIndex,
                                  "answerType",
                                  e.target.value as AnswerType
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                            >
                              {ANSWER_TYPES.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Question Text */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Text *
                          </label>
                          <textarea
                            value={question.text}
                            onChange={(e) =>
                              updateQuestion(
                                question.originalIndex,
                                "text",
                                e.target.value
                              )
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6] resize-y"
                            placeholder="Enter the complete question text"
                          />
                        </div>

                        {/* Rating Scale Configuration - NEW SECTION */}
                        {question.answerType === "Rating" && (
                          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">
                              Rating Scale Configuration
                            </h4>

                            {/* Rating Scale Numbers */}
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating Scale *
                              </label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={question.ratingScale?.[0] || 1}
                                  onChange={(e) => {
                                    const minValue = parseInt(e.target.value);
                                    const maxValue = question.ratingScale?.[question.ratingScale.length - 1] || 5;
                                    const newScale = Array.from(
                                      { length: maxValue - minValue + 1 },
                                      (_, i) => minValue + i
                                    );
                                    updateQuestion(question.originalIndex, "ratingScale", newScale);
                                  }}
                                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                  type="number"
                                  min="2"
                                  max="10"
                                  value={question.ratingScale?.[question.ratingScale.length - 1] || 5}
                                  onChange={(e) => {
                                    const maxValue = parseInt(e.target.value);
                                    const minValue = question.ratingScale?.[0] || 1;
                                    const newScale = Array.from(
                                      { length: maxValue - minValue + 1 },
                                      (_, i) => minValue + i
                                    );
                                    updateQuestion(question.originalIndex, "ratingScale", newScale);
                                  }}
                                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Current scale: {question.ratingScale?.join(', ') || '1, 2, 3, 4, 5'}
                              </p>
                            </div>

                            {/* Scale Labels */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Minimum Label ({question.ratingScale?.[0] || 1}) *
                                </label>
                                <input
                                  type="text"
                                  value={question.ratingScaleLabels?.minLabel || ''}
                                  onChange={(e) => {
                                    const currentLabels = question.ratingScaleLabels || {};
                                    updateQuestion(question.originalIndex, "ratingScaleLabels", {
                                      ...currentLabels,
                                      minLabel: e.target.value
                                    });
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                                  placeholder="e.g., Strongly disagree, Never, Very poor"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Maximum Label ({question.ratingScale?.[question.ratingScale.length - 1] || 5}) *
                                </label>
                                <input
                                  type="text"
                                  value={question.ratingScaleLabels?.maxLabel || ''}
                                  onChange={(e) => {
                                    const currentLabels = question.ratingScaleLabels || {};
                                    updateQuestion(question.originalIndex, "ratingScaleLabels", {
                                      ...currentLabels,
                                      maxLabel: e.target.value
                                    });
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                                  placeholder="e.g., Strongly agree, Always, Very good"
                                />
                              </div>
                            </div>

                            {/* N/A Option */}
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`na-option-${question.originalIndex}`}
                                checked={question.ratingScaleLabels?.hasNAOption || false}
                                onChange={(e) => {
                                  const currentLabels = question.ratingScaleLabels || {};
                                  updateQuestion(question.originalIndex, "ratingScaleLabels", {
                                    ...currentLabels,
                                    hasNAOption: e.target.checked
                                  });
                                }}
                                className="rounded border-gray-300 text-[#3b82f6] focus:ring-[#3b82f6] h-4 w-4"
                              />
                              <label
                                htmlFor={`na-option-${question.originalIndex}`}
                                className="ml-2 text-sm text-gray-700"
                              >
                                Include "N/A" option
                              </label>
                            </div>

                            {/* Preview */}
                            {question.ratingScaleLabels?.minLabel && question.ratingScaleLabels?.maxLabel && (
                              <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                                <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-700">
                                    {question.ratingScale?.[0] || 1} = {question.ratingScaleLabels.minLabel}
                                  </span>
                                  <span className="text-gray-400">→</span>
                                  <span className="text-gray-700">
                                    {question.ratingScale?.[question.ratingScale.length - 1] || 5} = {question.ratingScaleLabels.maxLabel}
                                  </span>
                                </div>
                                {question.ratingScaleLabels.hasNAOption && (
                                  <p className="text-xs text-gray-500 mt-1">+ N/A option available</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* MCQ Options */}
                        {question.answerType === "MCQ" && (
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Multiple Choice Options *
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {[0, 1, 2, 3].map((optionIndex) => (
                                <div key={optionIndex}>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Option {optionIndex + 1}
                                  </label>
                                  <input
                                    type="text"
                                    value={(question.options as string[])?.[optionIndex] || ''}
                                    onChange={(e) => {
                                      const currentOptions = (question.options as string[]) || ['', '', '', ''];
                                      const updatedOptions = [...currentOptions];
                                      updatedOptions[optionIndex] = e.target.value;
                                      updateQuestion(
                                        question.originalIndex,
                                        "options",
                                        updatedOptions
                                      );
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                                    placeholder={`Enter option ${optionIndex + 1}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Conditional Logic */}
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Show Question Only If (Optional)
                          </label>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Parent Question
                              </label>
                              <select
                                value={question.showIf?.questionCode || ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value === "") {
                                    updateQuestion(question.originalIndex, "showIf", null);
                                  } else {
                                    updateQuestion(question.originalIndex, "showIf", {
                                      questionCode: value,
                                      expectedAnswer: ""
                                    });
                                  }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                              >
                                <option value="">No condition</option>
                                {availableQuestions.map((q) => (
                                  <option key={q.code} value={q.code}>
                                    {q.code} - {q.text.substring(0, 50)}...
                                  </option>
                                ))}
                              </select>
                            </div>

                            {question.showIf?.questionCode && selectedParentQuestion && (
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Expected Answer
                                </label>
                                <select
                                  value={question.showIf?.expectedAnswer || ""}
                                  onChange={(e) => {
                                    updateQuestion(question.originalIndex, "showIf", {
                                      ...question.showIf,
                                      expectedAnswer: e.target.value
                                    });
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                                >
                                  <option value="">Select answer</option>
                                  {getPossibleAnswers(selectedParentQuestion).map((answer) => (
                                    <option key={answer} value={answer}>
                                      {answer}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Key Populations */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Specific to Key Populations
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {KEY_POPULATIONS.map((kp) => (
                              <label
                                key={kp}
                                className="inline-flex items-center p-2 hover:bg-gray-50 rounded"
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    question.specificToKP?.includes(kp) || false
                                  }
                                  onChange={(e) => {
                                    const current = question.specificToKP || [];
                                    const updated = e.target.checked
                                      ? [...current, kp]
                                      : current.filter(
                                        (item: any) => item !== kp
                                      );
                                    updateQuestion(
                                      question.originalIndex,
                                      "specificToKP",
                                      updated
                                    );
                                  }}
                                  className="rounded border-gray-300 text-[#3b82f6] focus:ring-[#3b82f6] h-4 w-4"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                  {kp}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Remove Question Button */}
                        <div className="flex justify-end">
                          <Button
                            onClick={() => handleRemoveQuestion(question.originalIndex)}
                            className="flex items-center px-3 py-1 text-red-600 bg-red-100 hover:bg-red-200 text-sm"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Remove Question
                          </Button>
                        </div>
                      </div>
                    );
                  }
                )}

                {/* Empty Questions State */}
                {getQuestionsForCategory(category.code).length === 0 && (
                  <div className="text-center py-6 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">
                      No questions in this category yet.
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Click "Add Question" to get started.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty Categories State */}
      {surveyData.categories.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No categories available.</p>
          <p className="text-gray-400 text-sm mt-1">
            Please add categories first before creating questions.
          </p>
        </div>
      )}
    </div>
  );
}