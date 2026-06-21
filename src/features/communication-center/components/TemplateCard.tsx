import { Edit, Eye } from "lucide-react";
import React from "react";
import type { Template } from "../types";

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: (template: Template) => void;
  onEdit: (template: Template) => void;
  onToggleActive: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
  onEdit,
  onToggleActive,
}) => {
  return (
    <div
      onClick={() => onSelect(template)}
      className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all ${
        isSelected
          ? "border-blue-600 shadow-md"
          : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-slate-800 text-base">
            {template.name}
          </h4>
          <p className="text-xs text-slate-500 mt-1">{template.description}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleActive(template);
          }}
          className="relative"
        >
          <div
            className={`w-11 h-6 rounded-full transition-colors ${template.isActive ? "bg-blue-600" : "bg-slate-300"}`}
          >
            <div
              className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${template.isActive ? "translate-x-5" : "translate-x-0"}`}
            />
          </div>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {template.variables.map((variable) => (
          <span
            key={variable}
            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md"
          >
            {`{{${variable}}}`}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(template);
          }}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <Edit className="h-4 w-4" />
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(template);
          }}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-700 text-sm font-medium"
        >
          <Eye className="h-4 w-4" />
          Preview
        </button>
      </div>
    </div>
  );
};
