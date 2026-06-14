import React from 'react';
import { Trash2, CreditCard } from 'lucide-react';
import type { Category } from '@/types';

export interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: number | string) => void;
}

// Map category names to distinct inline SVG icons (matches design icons)
const CategoryIcon: React.FC<{ name: string }> = ({ name }) => {
  const lower = name?.toLowerCase() || '';

  if (lower.includes('weight')) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v5" />
        <path d="M5 12H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h3" />
        <path d="M19 12h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3" />
        <path d="M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
        <path d="M5 12h14" />
      </svg>
    );
  }

  if (lower.includes('hormone')) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
        <line x1="4" y1="3" x2="8" y2="3" />
        <line x1="16" y1="3" x2="20" y2="3" />
        <line x1="12" y1="15" x2="12" y2="21" />
        <line x1="9" y1="21" x2="15" y2="21" />
      </svg>
    );
  }

  if (lower.includes('hair') || lower.includes('regrow')) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
        <path d="M12 9V2" />
      </svg>
    );
  }

  if (lower.includes('men')) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M12 14c-5 0-8 2.5-8 4v1h16v-1c0-1.5-3-4-8-4z" />
        <line x1="17" y1="3" x2="21" y2="3" />
        <line x1="21" y1="3" x2="21" y2="7" />
        <line x1="16" y1="8" x2="21" y2="3" />
      </svg>
    );
  }

  if (lower.includes('skin')) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
        <path d="M12 8v4" />
        <circle cx="12" cy="15" r="1" fill="#3b82f6" />
      </svg>
    );
  }

  // Generic fallback icon
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onDelete }) => {
  const isActive = category.status === 'Active' || category.status === 'ACTIVE';

  // Determine label for the treatments count
  const treatmentLabel = category.name?.toLowerCase().includes('men')
    ? 'Active Assessments:'
    : 'Active Treatments:';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between p-5 space-y-4 h-full">
      
      {/* Top section */}
      <div className="space-y-3">
        {/* Status Badge */}
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-normal border ${
              isActive
                ? 'bg-blue-50 text-blue-600 border-blue-100'
                : 'bg-gray-50 text-gray-400 border-gray-200'
            }`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Icon */}
        <div className="flex items-center justify-start h-7">
          {category.icon?.fileUrl ? (
            <img src={category.icon.fileUrl} alt={category.name} className="w-7 h-7 object-contain rounded-sm" />
          ) : (
            <CategoryIcon name={category.name} />
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <h3 className="font-bold text-gray-900 text-base leading-snug">
            {category.name}
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 font-normal">
            {category.description}
          </p>
        </div>

        {/* Stats Sub-card */}
        <div className="bg-[#f8fafc] rounded-xl p-3.5 border border-gray-100 space-y-2 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span>{treatmentLabel}</span>
            <span className="font-semibold text-gray-800">
              {String(category.activeAssessments ?? 0).padStart(2, '0')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total patients:</span>
            <span className="font-semibold text-gray-800">
              {String(category.totalPatients ?? 0).padStart(2, '0')}
            </span>
          </div>
          {category.paymentPlan ? (
            <div className="flex items-center gap-1.5 text-blue-500 font-medium pt-0.5">
              <CreditCard className="h-3.5 w-3.5 shrink-0" />
              <span>
                ${category.paymentPlan.price}/{category.paymentPlan.billingCycle === 'MONTHLY' ? 'mo' : category.paymentPlan.billingCycle} plan
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-gray-400 font-medium pt-0.5">
              <CreditCard className="h-3.5 w-3.5 shrink-0" />
              <span>No plan attached</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onEdit(category)}
          className="flex-1 inline-flex items-center justify-center bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-medium text-sm py-2.5 rounded-xl border border-gray-200 transition-colors cursor-pointer"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(category.id)}
          className="bg-white hover:bg-red-50 active:bg-red-100 text-red-500 p-2.5 rounded-xl border border-gray-200 hover:border-red-100 transition-colors cursor-pointer flex items-center justify-center"
          title="Delete Category"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;
