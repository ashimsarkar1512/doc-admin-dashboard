/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useState, useEffect } from 'react';
import type { AssessmentQuestion } from '@/types';

// Backend-expected values for content alignment
const CONTENT_ALIGNMENT_OPTIONS = [
  { label: 'Left aligned', value: 'LEFT' },
  { label: 'Center aligned', value: 'CENTER' },
  { label: 'Right aligned', value: 'RIGHT' },
] as const;

import Dialog from '@/components/shared/Dialog';
import { useForm, type SubmitHandler, useWatch } from 'react-hook-form';
import { Upload, Trash2, Loader2, Edit2 } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createQuestion,
  updateQuestion,
  getQuestionOptions,
  createQuestionOption,
  deleteQuestionOption,
  updateQuestionOption,
  deleteQuestion,
} from '@/api/endpoints/assessments.api';
import type {
  CreateQuestionPayload,
  UpdateQuestionPayload,
} from '@/api/endpoints/assessments.api';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

// Backend question type values
const QUESTION_TYPE_OPTIONS = [
  { label: 'Information only', value: 'INFORMATION_ONLY' },
  { label: 'Single Choice', value: 'SINGLE_CHOICE' },
  { label: 'Multiple Choice', value: 'MULTIPLE_CHOICE' },
  { label: 'Input', value: 'INPUT' },
] as const;

type QuestionTypeValue = (typeof QUESTION_TYPE_OPTIONS)[number]['value'];

type LocalOption = {
  id?: string;
  label: string;
  inputType?: string;
  placeholder?: string;
  _isDeleted?: boolean;
  subQuestions?: AssessmentQuestion[];
};

// ── Zod schema ───────────────────────────────────────────────────────────────

const questionSchema = z.object({
  type: z.enum(['INFORMATION_ONLY', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'INPUT']),
  heading: z.string().optional(),
  questionText: z.string().optional(),
  contentAlignment: z.string().optional(),
  isRequired: z.boolean().optional(),
  mediaFile: z.instanceof(File).optional().nullable(),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

// ── Input/Select class ───────────────────────────────────────────────────────

const inputCls =
  'w-full px-4 py-2.5 border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-sm text-black placeholder-gray-400';

// ── Main Component ───────────────────────────────────────────────────────────

export default function QuestionFormDialog({
  isOpen,
  onClose,
  editingQuestion,
  assessmentId,
  parentOptionId,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  editingQuestion: AssessmentQuestion | null;
  assessmentId: string;
  parentOptionId?: string;
  onSave: (question: AssessmentQuestion) => void;
}) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [mediaPreview, setMediaPreview] = useState<string | null>(
    editingQuestion?.media ?? null
  );

  const [descriptions, setDescriptions] = useState<string[]>(['']);
  const [localOptions, setLocalOptions] = useState<LocalOption[]>([]);
  const [isSavingOptions, setIsSavingOptions] = useState(false);

  // Sub-question modal state
  const [subQuestionParentId, setSubQuestionParentId] = useState<string | null>(null);
  const [editingSubQuestion, setEditingSubQuestion] = useState<AssessmentQuestion | null>(null);

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      type: (editingQuestion?.type ?? 'INFORMATION_ONLY') as QuestionTypeValue,
      heading: editingQuestion?.heading ?? '',
      questionText: editingQuestion?.questionText ?? '',
      contentAlignment: editingQuestion?.contentAlignment ?? 'LEFT',
      isRequired: editingQuestion?.isRequired ?? false,
      mediaFile: null,
    },
  });

  const questionType = useWatch({ control: form.control, name: 'type' });
  const isInfoOnly = questionType === 'INFORMATION_ONLY';
  const hasOptions = questionType === 'SINGLE_CHOICE' || questionType === 'MULTIPLE_CHOICE' || questionType === 'INPUT';

  // Fetch options if editing an existing question
  const { data: optionsData, isLoading: optionsLoading } = useQuery({
    queryKey: ['questionOptions', editingQuestion?.id],
    queryFn: () => getQuestionOptions({ questionId: editingQuestion!.id, limit: 100 }),
    enabled: !!editingQuestion?.id && hasOptions,
  });

  // Initialize state on open
  useEffect(() => {
    if (isOpen) {
      if (editingQuestion?.description) {
        setDescriptions(editingQuestion.description.split('\n\n'));
      } else {
        setDescriptions(['']);
      }
      form.reset({
        type: (editingQuestion?.type ?? 'INFORMATION_ONLY') as QuestionTypeValue,
        heading: editingQuestion?.heading ?? '',
        questionText: editingQuestion?.questionText ?? '',
        contentAlignment: editingQuestion?.contentAlignment ?? 'LEFT',
        isRequired: editingQuestion?.isRequired ?? false,
        mediaFile: null,
      });
      setMediaPreview(editingQuestion?.media ?? null);
      
      if (!editingQuestion) {
        setLocalOptions([]);
      }
    }
  }, [isOpen, editingQuestion, form]);

  useEffect(() => {
    if (optionsData?.data && editingQuestion) {
      setLocalOptions(
        optionsData.data.map(opt => ({
          id: opt.id,
          label: opt.label,
          inputType: opt.inputType || 'text',
          placeholder: opt.placeholder || '',
          subQuestions: opt.subQuestions || [],
        }))
      );
    }
  }, [optionsData, editingQuestion]);

  const mutation = useMutation({
    mutationFn: async (data: CreateQuestionPayload | UpdateQuestionPayload) => {
      if (editingQuestion) {
        return updateQuestion(editingQuestion.id, data as UpdateQuestionPayload);
      }
      return createQuestion(data as CreateQuestionPayload);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save question.');
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionOptions', editingQuestion?.id] });
      toast.success('Sub-question deleted.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete sub-question.');
    },
  });

  const handleSubmit: SubmitHandler<QuestionFormValues> = async (data) => {
    // Validate options if applicable
    const activeOptions = localOptions.filter(o => !o._isDeleted);
    if (hasOptions && activeOptions.length === 0) {
      toast.error('Please add at least one answer option.');
      return;
    }
    for (const opt of activeOptions) {
      if (!opt.label.trim()) {
        toast.error('All options must have a label or value.');
        return;
      }
    }

    const finalDescription = descriptions.filter(d => d.trim() !== '').join('\n\n') || undefined;

    const payload = {
      type: data.type,
      assessmentId,
      heading: isInfoOnly ? data.heading || undefined : undefined,
      questionText: !isInfoOnly ? data.questionText || undefined : undefined,
      description: finalDescription,
      contentAlignment: isInfoOnly ? data.contentAlignment || 'LEFT' : undefined,
      isRequired: !isInfoOnly ? data.isRequired : false,
      media: isInfoOnly ? (data.mediaFile ?? null) : null,
      parentOptionId: parentOptionId,
    };

    mutation.mutate(payload, {
      onSuccess: async (savedQuestion) => {
        if (hasOptions) {
          setIsSavingOptions(true);
          try {
            for (const opt of localOptions) {
              if (opt._isDeleted && opt.id) {
                await deleteQuestionOption(opt.id);
              } else if (!opt._isDeleted && opt.id) {
                await updateQuestionOption(opt.id, {
                  label: opt.label,
                  inputType: opt.inputType,
                  placeholder: opt.placeholder,
                  questionId: savedQuestion.id,
                });
              } else if (!opt._isDeleted && !opt.id) {
                await createQuestionOption({
                  label: opt.label,
                  inputType: opt.inputType,
                  placeholder: opt.placeholder,
                  questionId: savedQuestion.id,
                });
              }
            }
          } catch (e: any) {
            toast.error(e.message || 'Failed to save some options');
          } finally {
            setIsSavingOptions(false);
          }
        }
        
        // Refresh options cache
        queryClient.invalidateQueries({ queryKey: ['questionOptions', savedQuestion.id] });
        onSave(savedQuestion);
      }
    });
  };

  const handleAddOption = () => {
    setLocalOptions([...localOptions, { label: '', inputType: 'text', placeholder: '' }]);
  };

  const handleUpdateOption = (index: number, updates: Partial<LocalOption>) => {
    const newOps = [...localOptions];
    newOps[index] = { ...newOps[index], ...updates };
    setLocalOptions(newOps);
  };

  const handleRemoveOption = (index: number) => {
    const newOps = [...localOptions];
    if (newOps[index].id) {
      newOps[index]._isDeleted = true;
    } else {
      newOps.splice(index, 1);
    }
    setLocalOptions(newOps);
  };

  const handleDeleteSubQuestion = (qId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        container: 'z-[99999]'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteQuestionMutation.mutate(qId);
      }
    });
  };

  const handleSubQuestionSaved = () => {
    toast.success('Sub-question saved successfully!');
    setSubQuestionParentId(null);
    setEditingSubQuestion(null);
    queryClient.invalidateQueries({ queryKey: ['questionOptions', editingQuestion?.id] });
  };

  const visibleOptions = localOptions.map((opt, i) => ({ ...opt, originalIndex: i })).filter(o => !o._isDeleted);

  return (
    <>
      <Dialog
        isOpen={isOpen && !subQuestionParentId && !editingSubQuestion}
        onClose={onClose}
        title={parentOptionId ? (editingQuestion ? "Edit Sub-Question" : "Add Sub-Question") : (editingQuestion ? "Edit Question" : "Add Question")}
        maxWidthClass="max-w-[500px]"
      >
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          
          {/* ── Question Type ── */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-800">Question Type</label>
            <div className="relative">
              <select
                {...form.register('type')}
                className={`${inputCls} appearance-none pr-10 cursor-pointer`}
              >
                {QUESTION_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* ── Media upload — ONLY for Information Only ── */}
          {isInfoOnly && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-800">
                Media: <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="border border-gray-200 border-dashed rounded-xl p-5 bg-gray-50 flex flex-col items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    form.setValue('mediaFile', file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setMediaPreview(reader.result as string);
                      reader.readAsDataURL(file);
                    } else {
                      setMediaPreview(null);
                    }
                  }}
                />
                {mediaPreview ? (
                  <div className="relative w-full">
                    <img
                      src={mediaPreview}
                      alt="Media preview"
                      className="w-full max-h-40 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        form.setValue('mediaFile', null);
                        setMediaPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors shadow-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-2.5 rounded-[10px] font-medium flex items-center gap-2 text-sm transition-colors shadow-sm"
                  >
                    <Upload className="w-4 h-4" /> Choose a File
                  </button>
                )}
                {form.watch('mediaFile') && !mediaPreview && (
                  <span className="text-xs text-gray-600 font-medium">
                    {(form.watch('mediaFile') as File).name}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ── Heading / Question Text ── */}
          {isInfoOnly ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-800">Heading:</label>
              <input
                type="text"
                {...form.register('heading')}
                placeholder="e.g., Initial Health Assessment"
                className={inputCls}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-800">
                Question:
              </label>
              <input
                type="text"
                {...form.register('questionText')}
                placeholder="Enter your question here"
                className={inputCls}
              />
            </div>
          )}

          {/* ── Descriptions ── */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-800">
              {isInfoOnly ? 'Description:' : 'Description: (Optional)'}
            </label>
            <div className="space-y-3">
              {descriptions.map((desc, i) => (
                <div key={i} className="relative group">
                  <textarea
                    value={desc}
                    onChange={e => {
                      const newDescs = [...descriptions];
                      newDescs[i] = e.target.value;
                      setDescriptions(newDescs);
                    }}
                    placeholder="Additional context for this question"
                    className={`${inputCls} resize-none min-h-[80px]`}
                    rows={3}
                  />
                  {descriptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setDescriptions(descriptions.filter((_, idx) => idx !== i))}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setDescriptions([...descriptions, ''])}
              className="text-[#2563EB] hover:text-blue-700 text-sm font-medium inline-block transition-colors"
            >
              + Add more
            </button>
          </div>

          {/* ── Content Alignment (Info only) ── */}
          {isInfoOnly && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-800">Content Alignment:</label>
              <div className="relative">
                <select
                  {...form.register('contentAlignment')}
                  className={`${inputCls} appearance-none cursor-pointer`}
                >
                  {CONTENT_ALIGNMENT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* ── Answer Options (Choices & Input) ── */}
          {hasOptions && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-800">
                Answer Options: {questionType !== 'INPUT' && '(required)'}
              </label>

              {optionsLoading ? (
                <div className="py-4 text-center text-sm text-gray-500">Loading options...</div>
              ) : (
                <div className="space-y-3">
                  {visibleOptions.map((opt) => {
                    if (questionType === 'INPUT') {
                      // Complex Card for INPUT type
                      return (
                        <div key={opt.originalIndex} className="border border-gray-200 rounded-[10px] p-4 bg-white relative group">
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(opt.originalIndex)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="space-y-4 pr-10">
                            <div className="space-y-1.5">
                              <label className="block text-xs font-medium text-slate-800">Input type:</label>
                              <div className="relative">
                                <select
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-black bg-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                                  value={opt.inputType || 'text'}
                                  onChange={e => handleUpdateOption(opt.originalIndex, { inputType: e.target.value })}
                                >
                                  <option value="text">text</option>
                                  <option value="number">number</option>
                                  <option value="file upload">file upload</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="block text-xs font-medium text-slate-800">Label: (required)</label>
                              <input
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-black bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                                placeholder="e.g. Age (year)"
                                value={opt.label}
                                onChange={e => handleUpdateOption(opt.originalIndex, { label: e.target.value })}
                              />
                            </div>

                            {opt.inputType !== 'file upload' && (
                              <div className="space-y-1.5">
                                <label className="block text-xs font-medium text-slate-800">Placeholder text:</label>
                                <input
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-black bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                                  placeholder="Enter your placeholder"
                                  value={opt.placeholder || ''}
                                  onChange={e => handleUpdateOption(opt.originalIndex, { placeholder: e.target.value })}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }

                    // Flat list for SINGLE_CHOICE / MULTIPLE_CHOICE
                    return (
                      <div key={opt.originalIndex} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-1">
                            <input
                              className={`w-full px-4 py-2.5 border border-gray-200 rounded-[10px] text-sm text-black bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 ${questionType === 'SINGLE_CHOICE' ? 'pr-28' : ''}`}
                              placeholder="Option value"
                              value={opt.label}
                              onChange={e => handleUpdateOption(opt.originalIndex, { label: e.target.value })}
                            />
                            {questionType === 'SINGLE_CHOICE' && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (opt.id) {
                                    setSubQuestionParentId(opt.id);
                                  } else {
                                    toast.info('Please save this question first to add sub-questions to its options.');
                                  }
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2563EB] hover:text-blue-700 text-sm font-medium transition-colors"
                              >
                                + Add Sub-Question
                              </button>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(opt.originalIndex)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-[18px] h-[18px]" />
                          </button>
                        </div>

                        {/* List nested sub-questions if they exist */}
                        {opt.subQuestions && opt.subQuestions.length > 0 && (
                          <div className="ml-8 space-y-2">
                            {opt.subQuestions.map((subQ) => (
                              <div key={subQ.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                <div className="text-xs text-gray-700 font-medium line-clamp-1 flex-1">
                                  {subQ.type === 'INFORMATION_ONLY' ? subQ.heading : subQ.questionText}
                                </div>
                                <div className="flex items-center gap-2 ml-3">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingSubQuestion(subQ);
                                      setSubQuestionParentId(opt.id || null);
                                    }}
                                    className="text-[#2563EB] hover:text-blue-700 p-1"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSubQuestion(subQ.id)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                type="button"
                onClick={handleAddOption}
                className="text-[#2563EB] hover:text-blue-700 text-sm font-medium inline-block mt-1 transition-colors"
              >
                + Add Option
              </button>
            </div>
          )}

          {/* ── Required Question Checkbox ── */}
          {!isInfoOnly && (
            <div className="flex items-center gap-2.5 pt-2">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  {...form.register('isRequired')}
                  id="isRequired"
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-[4px] border-2 border-gray-300 checked:border-[#2563EB] checked:bg-[#2563EB] transition-all"
                />
                <svg
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 text-white w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <label htmlFor="isRequired" className="text-sm text-slate-800 font-medium cursor-pointer select-none">
                Required question
              </label>
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-medium text-slate-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || isSavingOptions}
              className="flex-1 py-3 text-sm font-medium text-white bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-400 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {(mutation.isPending || isSavingOptions) && <Loader2 className="w-4 h-4 animate-spin" />}
              {mutation.isPending || isSavingOptions
                ? 'Saving...'
                : 'Save Question'}
            </button>
          </div>

        </form>
      </Dialog>

      {/* Nested Dialog for Sub-Questions */}
      {(subQuestionParentId || editingSubQuestion) && (
        <QuestionFormDialog
          isOpen={true}
          onClose={() => {
            setSubQuestionParentId(null);
            setEditingSubQuestion(null);
          }}
          editingQuestion={editingSubQuestion}
          assessmentId={assessmentId}
          parentOptionId={subQuestionParentId || undefined}
          onSave={handleSubQuestionSaved}
        />
      )}
    </>
  );
}