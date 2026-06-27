import React from 'react';
import type { CommunicationTemplate } from '@/api/endpoints/communicationTemplates.api';

interface ActionTemplateCardProps {
  template: CommunicationTemplate;
  variables: string[];
  isSelected: boolean;
  onSelect: (t: CommunicationTemplate) => void;
}

const fmt = (a: string) =>
  a.split('_').map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');

export const ActionTemplateCard: React.FC<ActionTemplateCardProps> = ({
  template, variables, isSelected, onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(template)}
      className={`
        relative bg-white rounded-2xl border-2 px-4 py-3.5 cursor-pointer
        transition-all duration-150 select-none group
        ${isSelected
          ? 'border-blue-500 shadow-lg shadow-blue-100/70'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100'}
      `}
    >
      {/* ── Top row: title + toggle ── */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          {/* channel color dot */}
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 ${
            template.isActive ? 'bg-emerald-500' : 'bg-slate-300'
          }`} />
          <h4 className={`font-semibold text-sm leading-snug truncate ${
            isSelected ? 'text-blue-700' : 'text-slate-800'
          }`}>
            {fmt(template.action)}
          </h4>
        </div>


      </div>

      {/* ── Subject ── */}
      {template.subject && (
        <p className="text-xs text-slate-500 mb-2.5 leading-relaxed line-clamp-1 pl-3.5">
          {template.subject}
        </p>
      )}

      {/* ── Variable chips ── */}
      {variables.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3 pl-3.5">
          {variables.map((v) => (
            <span
              key={v}
              className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-xs font-mono border border-slate-200 leading-none"
            >
              {`{{${v}}}`}
            </span>
          ))}
        </div>
      )}


    </div>
  );
};
