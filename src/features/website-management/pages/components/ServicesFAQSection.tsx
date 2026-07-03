import React from 'react';
import { Trash2 } from 'lucide-react';
import type { ServicePageFaq } from '@/api/endpoints/service-page.api';

export interface FaqData {
  sectionTitle: string;
  faqs: (ServicePageFaq & { id: string })[];
}

interface Props {
  data: FaqData;
  onChange: (data: Partial<FaqData>) => void;
}

export default function ServicesFAQSection({ data, onChange }: Props) {
  
  const handleAddQuestion = () => {
    onChange({
      faqs: [
        ...data.faqs,
        {
          id: crypto.randomUUID(),
          question: "",
          answer: ""
        }
      ]
    });
  };

  const handleRemoveQuestion = (id: string) => {
    onChange({
      faqs: data.faqs.filter(faq => faq.id !== id)
    });
  };

  const handleQuestionChange = (id: string, value: string) => {
    onChange({
      faqs: data.faqs.map(faq => faq.id === id ? { ...faq, question: value } : faq)
    });
  };

  const handleAnswerChange = (id: string, value: string) => {
    onChange({
      faqs: data.faqs.map(faq => faq.id === id ? { ...faq, answer: value } : faq)
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">FAQ Section:</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Section Title:</label>
        <input 
          type="text" 
          value={data.sectionTitle}
          onChange={(e) => onChange({ sectionTitle: e.target.value })}
          placeholder="Popular Facts & Questions"
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#1447E6] focus:ring-1 focus:ring-[#1447E6] transition-shadow"
        />
      </div>

      <div className="space-y-4 mb-4">
        {data.faqs.map((faq, index) => (
          <div key={faq.id} className="border border-slate-200 rounded-xl p-5 relative bg-white shadow-[0_0px_10px_-3px_rgba(0,0,0,0.05)]">
            <button 
              onClick={() => handleRemoveQuestion(faq.id)}
              className="absolute top-5 right-5 text-red-500 hover:text-red-600 transition-colors" 
              title="Delete Question"
            >
              <Trash2 size={18} />
            </button>
            
            <div className="mb-4 pr-10">
              <label className="block text-sm font-medium text-slate-700 mb-2">Question {index + 1}:</label>
              <input 
                type="text" 
                value={faq.question}
                onChange={(e) => handleQuestionChange(faq.id, e.target.value)}
                placeholder="Enter question"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#1447E6] focus:ring-1 focus:ring-[#1447E6] transition-shadow"
              />
            </div>
            
            <div className="pr-10">
              <label className="block text-sm font-medium text-slate-700 mb-2">Answer:</label>
              <textarea 
                rows={3}
                value={faq.answer}
                onChange={(e) => handleAnswerChange(faq.id, e.target.value)}
                placeholder="Enter answer"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#1447E6] focus:ring-1 focus:ring-[#1447E6] resize-none transition-shadow"
              />
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleAddQuestion}
        className="text-[#1447E6] text-sm font-medium hover:underline flex items-center gap-1 mt-2 transition-colors"
      >
        + Add Another Question
      </button>
    </div>
  );
}
