import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Category } from '@/types';

export interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onDelete }) => {
  return (
    <div className="group bg-white rounded-[2rem] border border-gray-150 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between p-6 space-y-5 h-full">
      <div className="space-y-4">
        {/* Badge Row (Card Header) */}
        <div className="flex items-center justify-between w-full">
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-normal border ${
              category.status === 'Active'
                ? 'bg-[#eff6ff] text-blue-600 border-blue-100/50'
                : 'bg-gray-50 text-gray-400 border-gray-200/50'
            }`}
          >
            {category.status}
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
            {category.name}
          </h3>
          <p className="text-gray-500 font-light text-sm leading-relaxed line-clamp-3">
            {category.description}
          </p>
        </div>

        {/* Meta details sub-card */}
        <div className="bg-[#f8fafc] rounded-2xl p-4 border border-gray-100/85 space-y-2 text-xs text-gray-500 font-light">
          <div className="flex justify-between items-center">
            <span>Active Assessments:</span>
            <span className="font-semibold text-gray-700">
              {String(category.activeAssessments).padStart(2, '0')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Total patients:</span>
            <span className="font-semibold text-gray-700">{category.totalPatients}</span>
          </div>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={() => onEdit(category)}
          className="flex-1 inline-flex items-center justify-center bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-700 font-semibold text-sm py-3 rounded-2xl border border-gray-150 transition-colors cursor-pointer"
        >
          <span>Edit</span>
        </button>

        <button
          onClick={() => onDelete(category.id)}
          className="bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 p-3 rounded-2xl border border-red-100/50 transition-colors cursor-pointer flex items-center justify-center"
          title="Delete Category"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;
