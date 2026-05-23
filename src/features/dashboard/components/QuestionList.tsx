import { Edit2, Trash2, GripVertical } from 'lucide-react';
import type { AssessmentQuestion } from '@/types';

interface QuestionListProps {
  questions: AssessmentQuestion[];
  onEdit: (q: AssessmentQuestion) => void;
  onDelete: (index: number) => void;
}

export default function QuestionList({ questions, onEdit, onDelete }: QuestionListProps) {
  if (questions.length === 0) return null;

  return (
    <div className="space-y-3">
      {questions.map((q, i) => (
        <div
          key={q.id}
          className="flex items-start bg-slate-50/50 hover:bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4 transition-colors relative"
        >
          <div className="flex items-center shrink-0 pt-0.5">
            <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
          </div>

          <div className="flex-1 ml-3 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 tracking-wider">Q{i + 1}</span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider">
                  {q.type}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onEdit(q)}
                  className="text-[#2563EB] hover:text-blue-700 transition-colors p-1"
                  title="Edit Question"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(i)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                  title="Delete Question"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <h4 className="font-semibold text-slate-800 text-[13px] sm:text-sm mt-1.5 leading-snug">
              {q.heading || q.question}
            </h4>

            {q.type === 'Information only' ? (
              q.description && (
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{q.description}</p>
              )
            ) : q.type === 'Single choice' || q.type === 'Multiple choice' ? (
              <div className="mt-2">
                <span className="bg-slate-100/60 text-slate-600 text-[11px] px-2.5 py-1 rounded-md font-medium border border-slate-200/60 inline-block">
                  {q.options?.length || 0} options available
                </span>
              </div>
            ) : q.type === 'Input' ? (
              <div className="mt-2">
                <span className="bg-slate-100/60 text-slate-600 text-[11px] px-2.5 py-1 rounded-md font-medium border border-slate-200/60 inline-block">
                  {q.inputFields?.length || 0} input fields
                </span>
              </div>
            ) : (
              q.description && (
                <p className="text-xs text-slate-500 mt-1 line-clamp-1 leading-relaxed">{q.description}</p>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
