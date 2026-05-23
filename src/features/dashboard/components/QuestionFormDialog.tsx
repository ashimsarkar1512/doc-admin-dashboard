
/* eslint-disable react-hooks/purity */

import type { AssessmentQuestion, } from '@/types';
import { QUESTION_TYPE_OPTIONS, CONTENT_ALIGNMENT_OPTIONS } from '@/data/assessments';
import Dialog from '@/components/shared/Dialog';
import { useForm, type SubmitHandler, useFieldArray, useWatch } from 'react-hook-form';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define Zod schemas for each question type
const informationOnlySchema = z.object({
  heading: z.string().min(1, 'Please enter a heading.'),
  description: z.string().optional(),
  contentAlignment: z.string(),
  mediaImage: z.string().optional(),
});

const choiceSchema = z.object({
  question: z.string().min(1, 'Please enter the question text.'),
  description: z.string().optional(),
  options: z.array(z.string().min(1, 'Option is required')).min(2, 'Please add at least 2 options.'),
  isRequired: z.boolean(),
});

const inputSchema = z.object({
  question: z.string().min(1, 'Please enter the question text.'),
  description: z.string().optional(),
  inputFields: z.array(
    z.object({
      id: z.number().optional(),
      inputType: z.enum(['text', 'number', 'file upload']),
      label: z.string().min(1, 'Label is required'),
      placeholder: z.string(),
    })
  ).min(1, 'At least one input field is required'),
  isRequired: z.boolean(),
});

const yesNoSchema = z.object({
  question: z.string().min(1, 'Please enter the question text.'),
  description: z.string().optional(),
  isRequired: z.boolean(),
});

// Union schema that adapts based on question type
function createQuestionSchema() {
  return z.discriminatedUnion('type', [
    z.object({
      type: z.literal('Information only'),
      ...informationOnlySchema.shape,
    }),
    z.object({
      type: z.union([z.literal('Single choice'), z.literal('Multiple choice')]),
      ...choiceSchema.shape,
    }),
    z.object({
      type: z.literal('Input'),
      ...inputSchema.shape,
    }),
    z.object({
      type: z.literal('Yes / No'),
      ...yesNoSchema.shape,
    }),
  ]);
}

type QuestionFormValues = z.infer<ReturnType<typeof createQuestionSchema>>;

export default function QuestionFormDialog({ isOpen, onClose, editingQuestion, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  editingQuestion: AssessmentQuestion | null;
  onSave: (question: AssessmentQuestion) => void;
}) {
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(createQuestionSchema()),
    defaultValues: editingQuestion ? {
      // Map editingQuestion to form values based on type
      type: editingQuestion.type as QuestionFormValues['type'],
      heading: editingQuestion.type === 'Information only' ? editingQuestion.heading : '',
      description: editingQuestion.description,
      contentAlignment: editingQuestion.contentAlignment,
      mediaImage: editingQuestion.mediaImage,
      question: editingQuestion.type !== 'Information only' ? editingQuestion.question : '',
      options: editingQuestion.type === 'Single choice' || editingQuestion.type === 'Multiple choice' 
        ? (editingQuestion.options || ['', '']) 
        : ['', ''],
      inputFields: editingQuestion.type === 'Input' 
        ? ((editingQuestion.inputFields as unknown as { inputType: "text" | "number" | "file upload"; label: string; placeholder: string; id?: number }[]) || [{ id: Date.now(), inputType: 'text', label: '', placeholder: '' }])
        : [{ id: Date.now(), inputType: 'text', label: '', placeholder: '' }],
      isRequired: !!editingQuestion?.isRequired,
    } : {
      type: QUESTION_TYPE_OPTIONS[0] as QuestionFormValues['type'],
      heading: '',
      description: '',
      contentAlignment: CONTENT_ALIGNMENT_OPTIONS[0],
      mediaImage: '',
      question: '',
      options: ['', ''],
      inputFields: [{ id: Date.now(), inputType: 'text', label: '', placeholder: '' }],
      isRequired: false,
    }
  });

  const questionType = useWatch({ control: form.control, name: 'type' });
  
  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({
    control: form.control,
    name: "options" as never
  });

  const { fields: inputFields, append: appendInput, remove: removeInput } = useFieldArray({
    control: form.control,
    name: "inputFields" as never
  });

  const handleSubmit: SubmitHandler<QuestionFormValues> = (data) => {
    const question: AssessmentQuestion = {
      id: editingQuestion?.id || Date.now(),
      type: data.type,
      ...(data.type === 'Information only'
        ? { 
            heading: data.heading,
            description: data.description,
            contentAlignment: data.contentAlignment,
            mediaImage: data.mediaImage || undefined
          }
        : {
            question: data.question,
            description: data.description,
            options: 
              data.type === 'Single choice' || data.type === 'Multiple choice'
                ? data.options.filter((o) => o.trim() !== '')
                : undefined,
            inputFields:
              data.type === 'Input'
                ? data.inputFields.map((f, i) => ({ ...f, id: f.id || Date.now() + i }))
                : undefined,
            isRequired: data.isRequired,
          })
    };
    
    onSave(question);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={editingQuestion ? "Edit Question" : "Add Question"}>
      <form onSubmit={form.handleSubmit(handleSubmit as unknown as Parameters<typeof form.handleSubmit>[0])} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-800 mb-2">Question Type</label>
          <select
            {...form.register('type')}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {QUESTION_TYPE_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        {questionType === 'Information only' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">Media: (optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-100 flex flex-col items-center justify-center">
                <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
                  <Upload className="w-4 h-4" /> Choose a File
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">Heading:</label>
              <input
                type="text"
                {...form.register('heading')}
                placeholder="e.g., Initial Health Assessment"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">Description:</label>
              <textarea
                {...form.register('description')}
                placeholder="Additional context for this question"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                rows={3}
              />
            </div>

            <div>
              <button type="button" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                + Add more
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">Content Alignment:</label>
              <select
                {...form.register('contentAlignment')}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {CONTENT_ALIGNMENT_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {questionType !== 'Information only' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">Question:</label>
              <input
                type="text"
                {...form.register('question')}
                placeholder="Enter your question"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">Description (optional):</label>
              <textarea
                {...form.register('description')}
                placeholder="Additional context"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none"
                rows={2}
              />
            </div>

            {(questionType === 'Single choice' || questionType === 'Multiple choice') && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-800">Options:</label>
                {optionFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <input
                      {...form.register(`options.${index}` as never)}
                      className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder={`Option ${index + 1}`}
                    />
                    <button type="button" onClick={() => removeOption(index)} className="text-red-500 hover:text-red-700 p-2">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendOption('')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add option
                </button>
              </div>
            )}

            {questionType === 'Input' && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-800">Input Fields:</label>
                {inputFields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3 relative">
                    <button type="button" onClick={() => removeInput(index)} className="absolute top-3 right-3 text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Input Type</label>
                      <select {...form.register(`inputFields.${index}.inputType` as never)} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="file upload">File Upload</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Label</label>
                      <input {...form.register(`inputFields.${index}.label` as never)} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" placeholder="Label" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Placeholder</label>
                      <input {...form.register(`inputFields.${index}.placeholder` as never)} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" placeholder="Placeholder text" />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendInput({ inputType: 'text', label: '', placeholder: '' })}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add input field
                </button>
              </div>
            )}

            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                {...form.register('isRequired')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-slate-800 font-medium">Required question</label>
            </div>
          </>
        )}
        
        <div className="flex gap-4 pt-6 pb-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
          >
            {editingQuestion ? "Save Changes" : "Add Question"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}