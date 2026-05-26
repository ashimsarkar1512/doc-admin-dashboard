import React, { useState, useRef } from 'react';
import { Plus, Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Assessment, AssessmentQuestion } from '@/types';
import { getCategories } from '@/api/endpoints/categories.api';
import { createAssessment, updateAssessment, getQuestions, deleteQuestion } from '@/api/endpoints/assessments.api';
import type { CreateAssessmentPayload, UpdateAssessmentPayload } from '@/api/endpoints/assessments.api';
import Dialog from '@/components/shared/Dialog';
import QuestionList from './QuestionList';
import QuestionFormDialog from './QuestionFormDialog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingAssessment: Assessment | null;
}

const INPUT_CLS =
  'w-full px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400';
const SELECT_CLS = `${INPUT_CLS} appearance-none cursor-pointer pr-10`;

function ChevronDown() {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

export default function AssessmentFormDialog({ isOpen, onClose, editingAssessment }: Props) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If editing, we already have an assessmentId
  const [createdAssessmentId, setCreatedAssessmentId] = useState<string | null>(
    editingAssessment?.id ?? null
  );

  const [activeTab, setActiveTab] = useState<'DETAILS' | 'QUESTIONS'>('DETAILS');

  // Step 1 form state (only used when creating)
  const [title, setTitle] = useState(editingAssessment?.title ?? '');
  const [categoryId, setCategoryId] = useState(editingAssessment?.categoryId ?? '');
  const [description, setDescription] = useState(editingAssessment?.description ?? '');
  const [status, setStatus] = useState<'ACTIVE' | 'DRAFT' | 'DISABLED'>(
    editingAssessment?.status ?? 'DRAFT'
  );
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    editingAssessment?.thumbnail ?? null
  );

  // Step 2 question sub-modal state
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);
  // Local question state is removed in favor of React Query optimistic updates

  // Fetch existing questions when we have an assessmentId (editing mode)
  const { data: existingQuestionsData, isLoading: questionsLoading } = useQuery({
    queryKey: ['questions', createdAssessmentId],
    queryFn: () => getQuestions({ assessmentId: createdAssessmentId!, limit: 100 }),
    enabled: !!createdAssessmentId,
  });

  const allQuestions = existingQuestionsData?.data ?? [];

  // Fetch real categories for the dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ['categories', { page: 1, limit: 100 }],
    queryFn: () => getCategories({ page: 1, limit: 100 }),
    enabled: !createdAssessmentId, // no need to fetch if we're already in step 2
  });
  const categoryOptions = categoriesData?.data ?? [];

  // Create assessment mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateAssessmentPayload | UpdateAssessmentPayload) => {
      if (createdAssessmentId) {
        return updateAssessment(createdAssessmentId, data as UpdateAssessmentPayload);
      }
      return createAssessment(data as CreateAssessmentPayload);
    },
    onSuccess: (savedAssessment) => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      if (!createdAssessmentId) {
        setCreatedAssessmentId(savedAssessment.id);
        setActiveTab('QUESTIONS');
        toast.success('Assessment created! Now add questions below.');
      } else {
        toast.success('Assessment details updated successfully!');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save assessment.');
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: deleteQuestion,
    onMutate: async (idToDelete) => {
      await queryClient.cancelQueries({ queryKey: ['questions', createdAssessmentId] });
      const previous = queryClient.getQueryData(['questions', createdAssessmentId]);
      queryClient.setQueryData(['questions', createdAssessmentId], (old: { data: AssessmentQuestion[] } | undefined) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((q: AssessmentQuestion) => q.id !== idToDelete),
        };
      });
      return { previous };
    },
    onError: (error: Error, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['questions', createdAssessmentId], context.previous);
      }
      toast.error(error.message || 'Failed to delete question.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', createdAssessmentId] });
    },
    onSuccess: () => {
      toast.success('Question deleted.');
    },
  });

  const handleDeleteQuestion = (questionToDelete: AssessmentQuestion) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    deleteQuestionMutation.mutate(questionToDelete.id);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setThumbnailPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAssessmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !categoryId) {
      toast.error('Please fill in all required fields including a category.');
      return;
    }
    createMutation.mutate({ title, description, categoryId, status, thumbnail: thumbnailFile });
  };

  const handleQuestionSaved = (question: AssessmentQuestion) => {
    // Optimistically update the list
    queryClient.setQueryData(['questions', createdAssessmentId], (old: { data: AssessmentQuestion[] } | undefined) => {
      if (!old?.data) return old;
      const exists = old.data.find((q: AssessmentQuestion) => q.id === question.id);
      return {
        ...old,
        data: exists
          ? old.data.map((q: AssessmentQuestion) => (q.id === question.id ? question : q))
          : [...old.data, question],
      };
    });
    
    // Invalidate to ensure consistency
    queryClient.invalidateQueries({ queryKey: ['questions', createdAssessmentId] });
    toast.success(editingQuestion ? 'Question updated.' : 'Question added.');
    setIsQuestionOpen(false);
    setEditingQuestion(null);
  };

  const handleClose = () => {
    if (createdAssessmentId) {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      queryClient.invalidateQueries({ queryKey: ['questions', createdAssessmentId] });
    }
    onClose();
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={handleClose}
        title={
          editingAssessment
            ? `Edit Assessment`
            : 'Create New Assessment'
        }
        maxWidthClass="max-w-[600px]"
      >
        <div className="flex border-b border-gray-200 mb-5">
          <button
            type="button"
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'DETAILS'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('DETAILS')}
          >
            Assessment Details
          </button>
          <button
            type="button"
            disabled={!createdAssessmentId}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              !createdAssessmentId
                ? 'opacity-50 cursor-not-allowed border-transparent text-gray-400'
                : activeTab === 'QUESTIONS'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('QUESTIONS')}
          >
            Questions
          </button>
        </div>

        {activeTab === 'DETAILS' ? (
          /* ── Tab 1: Assessment details form ── */
          <form onSubmit={handleAssessmentSubmit} className="flex flex-col space-y-4">
            {/* Thumbnail */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Thumbnail <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="flex items-start gap-5">
                <div className="w-[140px] h-[120px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center">
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-300 text-xs">No image</span>
                  )}
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Choose a File</span>
                  </button>
                  {thumbnailFile && (
                    <button
                      type="button"
                      onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); }}
                      className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      <X className="h-3 w-3" /> Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Select Category: <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  value={categoryId} 
                  onChange={(e) => setCategoryId(e.target.value)} 
                  required 
                  disabled={!!createdAssessmentId}
                  className={`${SELECT_CLS} ${createdAssessmentId ? 'bg-gray-100 opacity-70 cursor-not-allowed' : ''}`}
                >
                  <option value="" disabled>Select a category</option>
                  {categoryOptions.map((c) => (
                    <option key={c.id} value={String(c.id)}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Assessment Title: <span className="text-red-500">*</span>
              </label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Cardiac Risk Assessment" className={INPUT_CLS} />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Description: <span className="text-red-500">*</span>
              </label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of this assessment..." rows={3} className={`${INPUT_CLS} resize-none`} />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">Status:</label>
              <div className="relative">
                <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={SELECT_CLS}>
                  <option value="DRAFT">Draft</option>
                  <option value="ACTIVE">Active</option>
                  <option value="DISABLED">Disabled</option>
                </select>
                <ChevronDown />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-3">
              <button type="button" onClick={handleClose} className="flex-1 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={createMutation.isPending} className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-[10px] text-sm font-medium transition-colors">
                {createMutation.isPending ? 'Saving...' : createdAssessmentId ? 'Save Changes' : 'Create & Add Questions →'}
              </button>
            </div>
          </form>
        ) : (
          /* ── Tab 2: Questions management ── */
          <div className="flex flex-col space-y-4">
            {/* Only show success banner when freshly created (not when editing) */}
            {!editingAssessment && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 font-medium">
                 Assessment created! Add questions below, then click Done.
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">
                Questions ({allQuestions.length})
              </span>
              <button
                type="button"
                onClick={() => { setEditingQuestion(null); setIsQuestionOpen(true); }}
                className="inline-flex items-center gap-1.5 bg-[#16A34A] hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Question</span>
              </button>
            </div>

            {questionsLoading ? (
              <div className="flex justify-center items-center py-8 text-gray-400">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span className="text-sm">Loading questions...</span>
              </div>
            ) : (
              <QuestionList
                questions={allQuestions}
                onEdit={(q) => { setEditingQuestion(q); setIsQuestionOpen(true); }}
                onDelete={(i) => handleDeleteQuestion(allQuestions[i])}
              />
            )}

            {allQuestions.length === 0 && !questionsLoading && (
              <p className="text-center text-sm text-gray-400 py-4">
                No questions yet. Click "Add Question" to get started.
              </p>
            )}

            <div className="pt-4 border-t border-gray-100">
              <button type="button" onClick={handleClose} className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[10px] text-sm font-medium transition-colors">
                Done
              </button>
            </div>
          </div>
        )}
      </Dialog>

      {createdAssessmentId && (
        <QuestionFormDialog
          key={editingQuestion?.id ?? 'new-question'}
          isOpen={isQuestionOpen}
          onClose={() => { setIsQuestionOpen(false); setEditingQuestion(null); }}
          editingQuestion={editingQuestion}
          assessmentId={createdAssessmentId!}
          onSave={handleQuestionSaved}
        />
      )}
    </>
  );
}
