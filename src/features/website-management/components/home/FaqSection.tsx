import React from 'react';
import { Plus, X } from 'lucide-react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { CtaFormGroup } from '../shared/CtaFormGroup';

export function FaqSection() {
  const questions = [
    { id: 1, title: 'What is medical weight loss?', desc: 'Medical weight loss is a customized program designed to help you lose weight safely and effectively...' },
    { id: 2, title: 'How does it work?', desc: 'A personalized program tailored to your unique needs will be created to help you reach your goals.' },
    { id: 3, title: 'Is it safe?', desc: 'Yes, our programs are medically supervised to ensure your safety and well-being.' },
    { id: 4, title: 'What are the benefits?', desc: 'Our medical weight loss treatments are proven to be safe and effective.' },
    { id: 5, title: 'How do I get started?', desc: 'Schedule a consultation with one of our specialists to discuss your weight loss goals.' },
  ];

  return (
    <SectionCard title="FAQ Section">
      <div className="space-y-5">
        <FormInput label="Section Title" defaultValue="Frequently Asked Questions" />
        <FormInput label="Sub Title" defaultValue="Still have questions?" />
        <FormInput label="CTA Description" defaultValue="If you have any questions, please feel free to reach out to us." />
        <CtaFormGroup defaultText="Contact us" defaultUrl="https://weightlossmd.com/contact" defaultOpenInNewTab={true} />

        <div className="flex items-center gap-4 pt-2 pb-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus size={16} /> Add field
          </button>
          <button className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
             <X size={16} /> Remove section
          </button>
        </div>

        <div className="space-y-4 pt-2 border-t border-slate-100">
          {questions.map(q => (
            <div key={q.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50 space-y-4">
              <div className="text-sm font-bold text-slate-600">Question {q.id}</div>
              <FormInput label="Title" defaultValue={q.title} />
              <FormTextarea label="Description" className="h-16" defaultValue={q.desc} />
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
