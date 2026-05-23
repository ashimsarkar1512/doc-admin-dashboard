import React, { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { Assessment, AssessmentQuestion } from '@/types';
import { CATEGORY_OPTIONS, PRESET_IMAGES } from '@/data/assessments';
import Dialog from '@/components/shared/Dialog';
import QuestionList from './QuestionList';
import QuestionFormDialog from './QuestionFormDialog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingAssessment: Assessment | null;
  onSave: (data: Omit<Assessment, 'id' | 'publishedDate' | 'totalAssessments'> & { id?: number }) => void;
}

const INPUT_CLS = 'w-full px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400';
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

export default function AssessmentFormDialog({ isOpen, onClose, editingAssessment, onSave }: Props) {
  // Initialized from props on mount; parent passes key={editingAssessment?.id ?? 'create'}
  // to remount this component whenever the editing target changes — no useEffect needed.
  const [title, setTitle] = useState(editingAssessment?.title ?? '');
  const [category, setCategory] = useState(editingAssessment?.category ?? CATEGORY_OPTIONS[0]);
  const [description, setDescription] = useState(editingAssessment?.description ?? '');
  const [image, setImage] = useState(editingAssessment?.image ?? PRESET_IMAGES[0]);
  const [status, setStatus] = useState<'Active' | 'Draft'>(editingAssessment?.status ?? 'Draft');
  const [questions, setQuestions] = useState<AssessmentQuestion[]>(editingAssessment?.questions ?? []);

  // Question sub-modal state
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) { toast.error('Please fill in all required fields.'); return; }
    onSave({ id: editingAssessment?.id, title, category, description, image, status, questions });
    onClose();
  };

  const handleSaveQuestion = (question: AssessmentQuestion) => {
    setQuestions((prev) =>
      editingQuestion
        ? prev.map((q) => (q.id === editingQuestion.id ? question : q))
        : [...prev, question]
    );
    toast.success(editingQuestion ? 'Question updated.' : 'Question added.');
    setIsQuestionOpen(false);
    setEditingQuestion(null);
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        title={editingAssessment ? 'Edit Assessment' : 'Create New Assessment'}
        maxWidthClass="max-w-[560px]"
      >
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

          {/* Thumbnail */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">Thumbnail <span className="text-red-500">*</span></label>
            <div className="flex items-start gap-5">
              <div className="w-[140px] h-[120px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center">
                {image
                  ? <img src={image} alt="Thumbnail" className="w-full h-full object-cover" />
                  : <span className="text-gray-300 text-xs">No image</span>}
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <input type="file" id="assessment-thumbnail-upload" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onloadend = () => setImage(r.result as string); r.readAsDataURL(f); } }} />
                <button type="button" onClick={() => document.getElementById('assessment-thumbnail-upload')?.click()}
                  className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer">
                  <Upload className="h-4 w-4" /><span>Choose a File</span>
                </button>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">Select Category: (required)</label>
            <div className="relative">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={SELECT_CLS}>
                <option value="" disabled>Select</option>
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">Assessment Title: (required)</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Initial Health Assessment" className={INPUT_CLS} />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">Description: (required)</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Effective treatments for various skin issues..." rows={3} className={`${INPUT_CLS} resize-none`} />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">Assessment status: (required)</label>
            <div className="relative">
              <select value={status} onChange={(e) => setStatus(e.target.value as 'Active' | 'Draft')} className={SELECT_CLS}>
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
              </select>
              <ChevronDown />
            </div>
          </div>

          {/* Questions */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-medium text-gray-800">Questions ({questions.length})</span>
            <button type="button" onClick={() => { setEditingQuestion(null); setIsQuestionOpen(true); }}
              className="inline-flex items-center gap-1.5 bg-[#16A34A] hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all cursor-pointer">
              <Plus className="h-4 w-4" /><span>Add Question</span>
            </button>
          </div>

          <QuestionList
            questions={questions}
            onEdit={(q) => { setEditingQuestion(q); setIsQuestionOpen(true); }}
            onDelete={(i) => setQuestions((prev) => prev.filter((_, idx) => idx !== i))}
          />

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[10px] text-sm font-medium transition-colors">
              {editingAssessment ? 'Save Changes' : 'Save Assessment'}
            </button>
          </div>
        </form>
      </Dialog>

      <QuestionFormDialog
        key={editingQuestion?.id ?? 'new-question'}
        isOpen={isQuestionOpen}
        onClose={() => { setIsQuestionOpen(false); setEditingQuestion(null); }}
        editingQuestion={editingQuestion}
        onSave={handleSaveQuestion}
      />
    </>
  );
}
