import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { AssessmentQuestion, InputField } from '@/types';
import { QUESTION_TYPE_OPTIONS, CONTENT_ALIGNMENT_OPTIONS } from '@/data/assessments';
import Dialog from '@/components/shared/Dialog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingQuestion: AssessmentQuestion | null;
  onSave: (question: AssessmentQuestion) => void;
}

// ── Tiny shared helpers ────────────────────────────────────────────────────
function ChevronDown() {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

function TrashBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-red-400 hover:text-red-600 transition-colors p-1">
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}

function QuestionField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-800">Question:</label>
      <input
        type="text" required value={value} onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your question here"
        className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400"
      />
    </div>
  );
}

function DescField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-800">Description: (Optional)</label>
      <input
        type="text" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder="Additional context for this question"
        className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400"
      />
    </div>
  );
}

function RequiredCheck({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer" />
      <span className="text-sm text-gray-700">Required question</span>
    </label>
  );
}

const SELECT_CLS = 'w-full px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black appearance-none cursor-pointer pr-10';

// ── Main component ─────────────────────────────────────────────────────────
export default function QuestionFormDialog({ isOpen, onClose, editingQuestion, onSave }: Props) {
  // State is initialized from editingQuestion on mount.
  // The parent passes a `key` prop so this component remounts whenever
  // editingQuestion changes — no useEffect needed.
  const [questionType, setQuestionType] = useState(editingQuestion?.type ?? QUESTION_TYPE_OPTIONS[0]);
  const [heading, setHeading] = useState(editingQuestion?.heading ?? '');
  const [infoDesc, setInfoDesc] = useState(editingQuestion?.description ?? '');
  const [alignment, setAlignment] = useState(editingQuestion?.contentAlignment ?? CONTENT_ALIGNMENT_OPTIONS[0]);
  const [media, setMedia] = useState(editingQuestion?.mediaImage ?? '');
  const [questionText, setQuestionText] = useState(editingQuestion?.question ?? '');
  const [questionDesc, setQuestionDesc] = useState(editingQuestion?.description ?? '');
  const [options, setOptions] = useState<string[]>(editingQuestion?.options?.length ? editingQuestion.options : ['', '']);
  const [inputFields, setInputFields] = useState<InputField[]>(
    editingQuestion?.inputFields?.length
      ? editingQuestion.inputFields
      // eslint-disable-next-line react-hooks/purity
      : [{ id: Date.now(), inputType: 'text', label: '', placeholder: '' }]
  );
  const [required, setRequired] = useState(!!editingQuestion?.isRequired);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isInfo = questionType === 'Information only';
    const isChoice = questionType === 'Single choice' || questionType === 'Multiple choice';
    const isInput = questionType === 'Input';

    if (isInfo && !heading.trim()) { toast.error('Please enter a heading.'); return; }
    if (!isInfo && !questionText.trim()) { toast.error('Please enter the question text.'); return; }
    if (isChoice && options.filter((o) => o.trim()).length < 2) { toast.error('Please add at least 2 options.'); return; }
    if (isInput && inputFields.some((f) => !f.label.trim())) { toast.error('Please label all input fields.'); return; }

    const question: AssessmentQuestion = {
      id: editingQuestion?.id || Date.now(),
      type: questionType,
      ...(isInfo
        ? { heading, description: infoDesc, contentAlignment: alignment, mediaImage: media || undefined }
        : { question: questionText, description: questionDesc, options: isChoice ? options.filter((o) => o.trim()) : undefined, inputFields: isInput ? inputFields : undefined, isRequired: required }),
    };
    onSave(question);
  };

  const isInfo = questionType === 'Information only';
  const isChoice = questionType === 'Single choice' || questionType === 'Multiple choice';
  const isInput = questionType === 'Input';
  const isYesNo = questionType === 'Yes / No';

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={editingQuestion ? 'Edit Question' : 'Add Question'} maxWidthClass="max-w-[520px]">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

        {/* Question Type selector */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">Question Type</label>
          <div className="relative">
            <select value={questionType} onChange={(e) => { setQuestionType(e.target.value); setOptions(['', '']); setInputFields([{ id: Date.now(), inputType: 'text', label: '', placeholder: '' }]); setRequired(false); }} className={SELECT_CLS}>
              {QUESTION_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* INFORMATION ONLY */}
        {isInfo && (
          <>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">Media: (optional)</label>
              <div className="relative w-full h-[100px] bg-gray-100 border border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden">
                {media
                  ? <img src={media} alt="preview" className="w-full h-full object-cover" />
                  : <button type="button" onClick={() => document.getElementById('q-media-upload')?.click()} className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer">
                      <Upload className="h-4 w-4" /><span>Choose a File</span>
                    </button>}
                <input type="file" id="q-media-upload" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onloadend = () => setMedia(r.result as string); r.readAsDataURL(f); } }} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">Heading:</label>
              <input type="text" required value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="e.g., Initial Health Assessment" className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">Description:</label>
              <textarea value={infoDesc} onChange={(e) => setInfoDesc(e.target.value)} placeholder="Additional context" rows={3} className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400 resize-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">Content Alignment:</label>
              <div className="relative">
                <select value={alignment} onChange={(e) => setAlignment(e.target.value)} className={SELECT_CLS}>
                  {CONTENT_ALIGNMENT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <ChevronDown />
              </div>
            </div>
          </>
        )}

        {/* SINGLE / MULTIPLE CHOICE */}
        {isChoice && (
          <>
            <QuestionField value={questionText} onChange={setQuestionText} />
            <DescField value={questionDesc} onChange={setQuestionDesc} />
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">Answer Options: (required)</label>
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="text" value={opt} onChange={(e) => { const u = [...options]; u[i] = e.target.value; setOptions(u); }} placeholder={`Option ${i + 1}`} className="flex-1 px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400" />
                  <TrashBtn onClick={() => setOptions(options.filter((_, idx) => idx !== i))} />
                </div>
              ))}
              <button type="button" onClick={() => setOptions([...options, ''])} className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1">+ Add Option</button>
            </div>
            <RequiredCheck checked={required} onChange={setRequired} />
          </>
        )}

        {/* INPUT */}
        {isInput && (
          <>
            <QuestionField value={questionText} onChange={setQuestionText} />
            <DescField value={questionDesc} onChange={setQuestionDesc} />
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-800">Answer Options:</label>
              {inputFields.map((field, i) => (
                <div key={field.id} className="p-4 border border-gray-200 rounded-2xl bg-white space-y-3 relative">
                  <button type="button" onClick={() => setInputFields(inputFields.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors p-1">
                    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  <div className="space-y-1.5 pr-8">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Input type:</label>
                    <div className="relative">
                      <select value={field.inputType} onChange={(e) => { const u = [...inputFields]; u[i] = { ...field, inputType: e.target.value }; setInputFields(u); }} className="w-full px-4 py-2 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black appearance-none cursor-pointer pr-10">
                        <option value="text">text</option>
                        <option value="number">number</option>
                        <option value="file upload">file upload</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Label: (required)</label>
                    <input type="text" required value={field.label} onChange={(e) => { const u = [...inputFields]; u[i] = { ...field, label: e.target.value }; setInputFields(u); }} placeholder={field.inputType === 'number' ? 'e.g. Weight (lbs)' : field.inputType === 'file upload' ? 'Upload file' : 'e.g. Age (year)'} className="w-full px-4 py-2 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Placeholder text:</label>
                    <input type="text" value={field.placeholder} onChange={(e) => { const u = [...inputFields]; u[i] = { ...field, placeholder: e.target.value }; setInputFields(u); }} placeholder={field.inputType === 'number' ? 'Enter your current weight' : field.inputType === 'file upload' ? 'Max file size 5 MB' : 'Enter your age'} className="w-full px-4 py-2 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400" />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setInputFields([...inputFields, { id: Date.now() + Math.random(), inputType: 'text', label: '', placeholder: '' }])} className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1 inline-flex items-center gap-1">+ Add Option</button>
            </div>
            <RequiredCheck checked={required} onChange={setRequired} />
          </>
        )}

        {/* YES / NO */}
        {isYesNo && (
          <>
            <QuestionField value={questionText} onChange={setQuestionText} />
            <DescField value={questionDesc} onChange={setQuestionDesc} />
            <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
              This question will automatically show <strong>Yes</strong> and <strong>No</strong> as answer options.
            </p>
            <RequiredCheck checked={required} onChange={setRequired} />
          </>
        )}

        {/* Actions */}
        <div className="pt-4 border-t border-gray-100 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[10px] text-sm font-medium transition-colors">{editingQuestion ? 'Save Changes' : 'Add Question'}</button>
        </div>
      </form>
    </Dialog>
  );
}
