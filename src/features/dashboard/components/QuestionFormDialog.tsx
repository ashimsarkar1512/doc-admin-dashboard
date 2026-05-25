/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useState } from 'react';
import type { AssessmentQuestion } from '@/types';
// Backend-expected values for content alignment
const CONTENT_ALIGNMENT_OPTIONS = [
  { label: 'Left', value: 'LEFT' },
  { label: 'Center', value: 'CENTER' },
  { label: 'Right', value: 'RIGHT' },
] as const;
import Dialog from '@/components/shared/Dialog';
import { useForm, type SubmitHandler, useWatch } from 'react-hook-form';
import { Upload, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createQuestion, updateQuestion, getQuestionOptions, createQuestionOption, deleteQuestionOption } from '@/api/endpoints/assessments.api';
import { toast } from 'sonner';

// Backend question type values
const QUESTION_TYPE_OPTIONS = [
  { label: 'Information Only', value: 'INFORMATION_ONLY' },
  { label: 'Single Choice', value: 'SINGLE_CHOICE' },
  { label: 'Multiple Choice', value: 'MULTIPLE_CHOICE' },
  { label: 'Input', value: 'INPUT' },
] as const;

type QuestionTypeValue = typeof QUESTION_TYPE_OPTIONS[number]['value'];

// ── Zod schema ──────────────────────────────────────────────────────────────

const questionSchema = z.object({
  type: z.enum(['INFORMATION_ONLY', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'INPUT']),
  heading: z.string().optional(),
  questionText: z.string().optional(),
  description: z.string().optional(),
  contentAlignment: z.string().optional(),
  isRequired: z.boolean().optional(),
  mediaFile: z.instanceof(File).optional().nullable(),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

// ── Component ────────────────────────────────────────────────────────────────

function OptionsManager({ questionId, assessmentId }: { questionId: string; assessmentId: string }) {
  const queryClient = useQueryClient();
  const [newLabel, setNewLabel] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: ['questionOptions', questionId],
    queryFn: () => getQuestionOptions({ questionId, limit: 100 }),
  });
  
  const options = data?.data ?? [];

  const addMutation = useMutation({
    mutationFn: (label: string) => createQuestionOption({ label, questionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionOptions', questionId] });
      queryClient.invalidateQueries({ queryKey: ['questions', assessmentId] });
      setNewLabel('');
      toast.success('Option added');
    },
    onError: (e: any) => toast.error(e.message || 'Failed to add option')
  });

  const deleteMutation = useMutation({
    mutationFn: deleteQuestionOption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionOptions', questionId] });
      queryClient.invalidateQueries({ queryKey: ['questions', assessmentId] });
      toast.success('Option deleted');
    },
    onError: (e: any) => toast.error(e.message || 'Failed to delete option')
  });

  return (
    <div className="border-t border-gray-100 pt-5 mt-5">
      <label className="block text-sm font-medium text-slate-800 mb-3">
        Options Management
      </label>
      
      <div className="space-y-2 mb-3">
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading options...</div>
        ) : options.length === 0 ? (
          <div className="text-sm text-gray-400">No options yet.</div>
        ) : (
          options.map((opt) => (
            <div key={opt.id} className="flex items-center justify-between bg-slate-50 border border-gray-200 px-3 py-2 rounded-lg">
              <span className="text-sm text-slate-800">{opt.label}</span>
              <button 
                type="button" 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this option?')) {
                    deleteMutation.mutate(opt.id);
                  }
                }}
                disabled={deleteMutation.isPending}
                className="text-red-500 hover:text-red-700 p-1 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Add new option (e.g. Yes)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm text-slate-900 placeholder-gray-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (newLabel.trim()) addMutation.mutate(newLabel.trim());
            }
          }}
        />
        <button 
          type="button"
          onClick={() => { if (newLabel.trim()) addMutation.mutate(newLabel.trim()); }}
          disabled={!newLabel.trim() || addMutation.isPending}
          className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default function QuestionFormDialog({
  isOpen,
  onClose,
  editingQuestion,
  assessmentId,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  editingQuestion: AssessmentQuestion | null;
  assessmentId: string;
  onSave: (question: AssessmentQuestion) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      type: (editingQuestion?.type ?? 'INFORMATION_ONLY') as QuestionTypeValue,
      heading: editingQuestion?.heading ?? '',
      questionText: editingQuestion?.questionText ?? '',
      description: editingQuestion?.description ?? '',
      contentAlignment: editingQuestion?.contentAlignment ?? 'LEFT', // strict backend value
      isRequired: editingQuestion?.isRequired ?? false,
      mediaFile: null,
    },
  });

  const questionType = useWatch({ control: form.control, name: 'type' });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingQuestion) {
        return updateQuestion(editingQuestion.id, data);
      }
      return createQuestion(data);
    },
    onSuccess: (savedQuestion) => {
      onSave(savedQuestion);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save question.');
    },
  });

  const handleSubmit: SubmitHandler<QuestionFormValues> = (data) => {
    mutation.mutate({
      type: data.type,
      assessmentId,
      heading: data.type === 'INFORMATION_ONLY' ? (data.heading || undefined) : undefined,
      questionText: data.type !== 'INFORMATION_ONLY' ? (data.questionText || undefined) : undefined,
      description: data.description || undefined,
      contentAlignment: data.type === 'INFORMATION_ONLY' ? (data.contentAlignment || 'LEFT') : undefined,
      isRequired: data.type !== 'INFORMATION_ONLY' ? data.isRequired : false,
      media: data.mediaFile ?? null,
    });
  };

  const inputCls =
    'w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm text-slate-900 placeholder-gray-500';

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={editingQuestion ? 'Edit Question' : 'Add Question'}>
      <form
        onSubmit={form.handleSubmit(handleSubmit as any)}
        className="space-y-5"
      >
        {/* Question Type */}
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">
            Question Type <span className="text-red-500">*</span>
          </label>
          <select {...form.register('type')} className={inputCls}>
            {QUESTION_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Media upload — shown for all types */}
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">
            Media <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 flex flex-col items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                form.setValue('mediaFile', file);
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors"
            >
              <Upload className="w-4 h-4" /> Choose a File
            </button>
            {form.watch('mediaFile') && (
              <span className="text-xs text-gray-600">
                {(form.watch('mediaFile') as File).name}
              </span>
            )}
          </div>
        </div>

        {/* INFORMATION_ONLY specific fields */}
        {questionType === 'INFORMATION_ONLY' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">Heading</label>
              <input
                type="text"
                {...form.register('heading')}
                placeholder="Section heading"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">Description</label>
              <textarea
                {...form.register('description')}
                placeholder="Optional longer description"
                className={`${inputCls} resize-none`}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Content Alignment
              </label>
              <select {...form.register('contentAlignment')} className={inputCls}>
                {CONTENT_ALIGNMENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Question text for non-info types */}
        {questionType !== 'INFORMATION_ONLY' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Question Text <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...form.register('questionText')}
                placeholder="e.g., What is your age?"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Description <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                {...form.register('description')}
                placeholder="Additional context"
                className={`${inputCls} resize-none`}
                rows={2}
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                {...form.register('isRequired')}
                id="isRequired"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isRequired" className="text-sm text-slate-800 font-medium">
                Required question
              </label>
            </div>
          </>
        )}

        {/* Options Management */}
        {(questionType === 'SINGLE_CHOICE' || questionType === 'MULTIPLE_CHOICE') && (
          editingQuestion ? (
            <OptionsManager questionId={editingQuestion.id} assessmentId={assessmentId} />
          ) : (
            <div className="border-t border-gray-100 pt-5 mt-5">
              <label className="block text-sm font-medium text-slate-800 mb-2">Options Management</label>
              <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg border border-blue-200">
                You can add choices to this question after saving it for the first time.
              </div>
            </div>
          )
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl transition-colors"
          >
            {mutation.isPending ? 'Saving...' : editingQuestion ? 'Save Changes' : 'Add Question'}
          </button>
        </div>
      </form>
    </Dialog>
  );
}