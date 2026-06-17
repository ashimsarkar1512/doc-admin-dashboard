import React, { useState, useRef } from 'react';
import { Plus, Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Assessment, AssessmentQuestion } from '@/types';
import { getCategories } from '@/api/endpoints/categories.api';
import Swal from 'sweetalert2';
import {
  createAssessment,
  updateAssessment,
  getQuestions,
  deleteQuestion,
} from '@/api/endpoints/assessments.api';
import type {
  CreateAssessmentPayload,
  UpdateAssessmentPayload,
} from '@/api/endpoints/assessments.api';
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

  const [assessmentId, setAssessmentId] = useState<string | null>(
    editingAssessment?.id ?? null
  );

  // Form state
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

  // Question modal state
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);

  // Fetch questions when we have an assessmentId
  const { data: existingQuestionsData, isLoading: questionsLoading } = useQuery({
    queryKey: ['questions', assessmentId],
    queryFn: () => getQuestions({ assessmentId: assessmentId!, limit: 100 }),
    enabled: !!assessmentId,
  });
  const allQuestions = existingQuestionsData?.data ?? [];

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories', { page: 1, limit: 100 }],
    queryFn: () => getCategories({ page: 1, limit: 100 }),
  });
  const categoryOptions = categoriesData?.data ?? [];

  // Save/Update assessment mutation
  const saveMutation = useMutation({
    mutationFn: (data: CreateAssessmentPayload | UpdateAssessmentPayload) => {
      if (assessmentId) {
        return updateAssessment(assessmentId, data as UpdateAssessmentPayload);
      }
      return createAssessment(data as CreateAssessmentPayload);
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      if (!assessmentId) {
        setAssessmentId(saved.id);
        toast.success('Assessment created! You can now add questions.');
      } else {
        toast.success('Assessment saved successfully!');
        handleClose();
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save assessment.');
    },
  });

  // Delete question mutation
  const deleteQuestionMutation = useMutation({
    mutationFn: deleteQuestion,
    onMutate: async (idToDelete) => {
      await queryClient.cancelQueries({ queryKey: ['questions', assessmentId] });
      const previous = queryClient.getQueryData(['questions', assessmentId]);
      queryClient.setQueryData(
        ['questions', assessmentId],
        (old: { data: AssessmentQuestion[] } | undefined) => {
          if (!old?.data) return old;
          return { ...old, data: old.data.filter((q) => q.id !== idToDelete) };
        }
      );
      return { previous };
    },
    onError: (error: Error, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['questions', assessmentId], context.previous);
      }
      toast.error(error.message || 'Failed to delete question.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', assessmentId] });
    },
    onSuccess: () => {
      toast.success('Question deleted.');
    },
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setThumbnailPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDeleteQuestion = (q: AssessmentQuestion) => {
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
        deleteQuestionMutation.mutate(q.id);
      }
    });
  };

  const handleQuestionSaved = (question: AssessmentQuestion) => {
    queryClient.setQueryData(
      ['questions', assessmentId],
      (old: { data: AssessmentQuestion[] } | undefined) => {
        if (!old?.data) return old;
        const exists = old.data.find((q) => q.id === question.id);
        return {
          ...old,
          data: exists
            ? old.data.map((q) => (q.id === question.id ? question : q))
            : [...old.data, question],
        };
      }
    );
    queryClient.invalidateQueries({ queryKey: ['questions', assessmentId] });
    toast.success(editingQuestion ? 'Question updated.' : 'Question added.');
    setIsQuestionOpen(false);
    setEditingQuestion(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !categoryId) {
      toast.error('Please fill in all required fields including a category.');
      return;
    }
    saveMutation.mutate({ title, description, categoryId, status, thumbnail: thumbnailFile });
  };

  const handleClose = () => {
    if (assessmentId) {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      queryClient.invalidateQueries({ queryKey: ['questions', assessmentId] });
    }
    onClose();
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={handleClose}
        title={editingAssessment ? 'Edit Assessment' : 'Create New Assessment'}
        maxWidthClass="max-w-[560px]"
      >
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          {/* ── Thumbnail ── */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">
              Thumbnail <span className="text-red-500">*</span>
            </label>
            <div className="flex items-start gap-5">
              {/* Preview box */}
              <div className="w-[148px] h-[130px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center">
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-300 text-xs">No image</span>
                )}
              </div>
              {/* Upload controls */}
              <div className="flex flex-col gap-2 pt-2">
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

          {/* ── Category ── */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">
              Select Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className={SELECT_CLS}
              >
                <option value="" disabled>Select</option>
                {categoryOptions.map((c) => (
                  <option key={c.id} value={String(c.id)}>{c.name}</option>
                ))}
              </select>
              <ChevronDown />
            </div>
          </div>

          {/* ── Title ── */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">
              Assessment Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Initial Health Assessment"
              className={INPUT_CLS}
            />
          </div>

          {/* ── Description ── */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Effective treatments for various skin issues, such as acne, rashes, and eczema, using Rx treatments."
              rows={3}
              className={`${INPUT_CLS} resize-none`}
            />
          </div>

          {/* ── Status ── */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">
              Assessment status <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className={SELECT_CLS}
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="DISABLED">Disabled</option>
              </select>
              <ChevronDown />
            </div>
          </div>

          {/* ── Questions Section ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">
                Questions ({allQuestions.length})
              </span>
              <button
                type="button"
                disabled={!assessmentId}
                onClick={() => {
                  if (!assessmentId) {
                    // Auto-save the assessment first, then open question modal
                    if (!title.trim() || !description.trim() || !categoryId) {
                      toast.error('Please fill in all required fields before adding questions.');
                      return;
                    }
                    saveMutation.mutate(
                      { title, description, categoryId, status, thumbnail: thumbnailFile },
                      {
                        onSuccess: () => {
                          setIsQuestionOpen(true);
                        },
                      }
                    );
                  } else {
                    setEditingQuestion(null);
                    setIsQuestionOpen(true);
                  }
                }}
                className="inline-flex items-center gap-1.5 bg-[#16A34A] hover:bg-green-700 disabled:opacity-60 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Question</span>
              </button>
            </div>

            {/* Question list */}
            {questionsLoading ? (
              <div className="flex justify-center items-center py-6 text-gray-400">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span className="text-sm">Loading questions...</span>
              </div>
            ) : (
              <>
                <QuestionList
                  questions={allQuestions}
                  onEdit={(q) => { setEditingQuestion(q); setIsQuestionOpen(true); }}
                  onDelete={(i) => handleDeleteQuestion(allQuestions[i])}
                />
                {allQuestions.length === 0 && (
                  <p className="text-center text-sm text-gray-400 py-3 border border-dashed border-gray-200 rounded-xl">
                    No questions yet. Click "+ Add Question" to get started.
                  </p>
                )}
              </>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="pt-2 border-t border-gray-100 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-[10px] text-sm font-medium transition-colors"
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Assessment'}
            </button>
          </div>
        </form>
      </Dialog>

      {/* Question sub-modal — only mount when we have an assessmentId */}
      {assessmentId && (
        <QuestionFormDialog
          key={editingQuestion?.id ?? 'new-question'}
          isOpen={isQuestionOpen}
          onClose={() => { setIsQuestionOpen(false); setEditingQuestion(null); }}
          editingQuestion={editingQuestion}
          assessmentId={assessmentId}
          onSave={handleQuestionSaved}
        />
      )}
    </>
  );
}
