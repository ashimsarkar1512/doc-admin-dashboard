import React from 'react';
import { Edit } from 'lucide-react';
import type { Template } from '../types';

interface TemplatePreviewProps {
  template: Template;
  onEdit: (template: Template) => void;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template, onEdit }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <h4 className="font-semibold text-slate-800 text-base">Preview: {template.name}</h4>
        <button
          onClick={() => onEdit(template)}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          <Edit className="h-4 w-4" />
          Edit
        </button>
      </div>
      <div className="p-6 flex-1">
        {template.subject && (
          <div className="mb-6">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject</span>
            <p className="text-slate-800 font-medium mt-2">{template.subject}</p>
          </div>
        )}
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Body</span>
          <div className="mt-4 text-slate-700 whitespace-pre-line leading-relaxed">
            {template.body.split('\n').map((line, index) => (
              <p key={index} className={index > 0 ? 'mt-3' : ''}>
                {line.split(/(\{\{.*?\}\})/g).map((part, partIndex) => {
                  if (part.startsWith('{{') && part.endsWith('}}')) {
                    return (
                      <span
                        key={partIndex}
                        className="px-1 bg-blue-50 text-blue-700 font-medium rounded"
                      >
                        {part}
                      </span>
                    );
                  }
                  return part;
                })}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
