import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '../../Global/Button';
import { Category, SurveyData } from '@/types/surveyTypes';

interface CategoriesProps {
  surveyData: SurveyData;
  addCategory: () => void;
  updateCategory: (index: number, field: keyof Category, value: string) => void;
  removeCategory: (index: number) => void;
}

export default function Categories({ surveyData, addCategory, updateCategory, removeCategory }: CategoriesProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Survey Categories</h3>
          <p className="text-sm text-gray-600 mt-1">Organize your questions into logical categories</p>
        </div>
        <Button
          onClick={addCategory}
          className="flex justify-center items-center px-4 py-2 bg-[#3b82f6] hover:bg-[#1c59bb] text-white"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {surveyData.categories.map((category, index) => (
          <div key={category.tempId || index} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Category Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Code *
                </label>
                <input
                  type="text"
                  value={category.code}
                  onChange={(e) => updateCategory(index, 'code', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                  placeholder="e.g., 1.1, A1, etc."
                />
              </div>
              
              {/* Category Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Title *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={category.title}
                    onChange={(e) => updateCategory(index, 'title', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                    placeholder="Enter category title"
                  />
                  <button
                    onClick={() => removeCategory(index)}
                    className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-red-600 hover:bg-red-50 focus:outline-none"
                    title="Remove category"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {surveyData.categories.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500">No categories added yet.</p>
          <p className="text-gray-400 text-sm mt-1">Click "Add Category" to get started.</p>
        </div>
      )}
    </div>
  );
}