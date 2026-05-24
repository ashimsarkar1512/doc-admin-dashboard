import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Assessment } from '@/types';

export interface AssessmentCardProps {
  assessment: Assessment;
  onEdit: (assessment: Assessment) => void;
  onDelete: (id: string) => void;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment, onEdit, onDelete }) => {
  const publishedDate = assessment.publishedAt
    ? new Date(assessment.publishedAt).toLocaleDateString('en-US')
    : '—';

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full p-5 space-y-4">
      {/* Badge Row (Category + Status) */}
      <div className="flex items-center justify-between w-full">
        <span className="bg-[#f4f4f5] text-gray-600 px-3.5 py-1.5 rounded-full text-[11px] font-medium border border-gray-100">
          {assessment.category?.name ?? '—'}
        </span>
        <span
          className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium border ${
            assessment.status === 'ACTIVE'
              ? 'bg-[#eff6ff] text-blue-600 border-blue-100'
              : assessment.status === 'DISABLED'
              ? 'bg-red-50 text-red-500 border-red-100'
              : 'bg-gray-100 text-gray-500 border-gray-200'
          }`}
        >
          {assessment.status}
        </span>
      </div>

      {/* Card Thumbnail Image */}
      <div className="relative w-full h-[180px] rounded-xl overflow-hidden bg-gray-100">
        {assessment.thumbnail ? (
          <img
            src={assessment.thumbnail}
            alt={assessment.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            No image
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div className="space-y-1.5 flex-1">
        <h3 className="font-bold text-gray-900 text-base leading-tight">{assessment.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{assessment.description}</p>
      </div>

      {/* Meta details sub-card */}
      <div className="bg-[#f9fafb] rounded-xl p-3.5 border border-gray-100 space-y-1.5 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <span>Published:</span>
          <span className="font-semibold text-gray-800">{publishedDate}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Total Questions:</span>
          <span className="font-semibold text-gray-800">{assessment.totalQuestions ?? 0}</span>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onEdit(assessment)}
          className="flex-1 inline-flex items-center justify-center bg-[#F4F4F5] hover:bg-gray-200 active:bg-gray-300 text-gray-800 font-medium text-sm py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          <span>Edit</span>
        </button>

        <button
          onClick={() => onDelete(assessment.id)}
          className="bg-[#FEF2F2] hover:bg-red-100 active:bg-red-200 text-red-500 p-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
          title="Delete Assessment"
        >
          <Trash2 className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
};

export default AssessmentCard;
