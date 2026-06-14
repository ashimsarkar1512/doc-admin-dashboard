import React from 'react';
import { Plus, X } from 'lucide-react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { CtaFormGroup } from '../shared/CtaFormGroup';

export function HowItWorksSection() {
  const steps = [
    { id: 1, title: 'Consultation', desc: 'Schedule a consultation with one of our specialists to discuss your weight loss goals and medical history.' },
    { id: 2, title: 'Personalized Plan', desc: 'A personalized program tailored to your unique needs will be created to help you reach your goals.' },
    { id: 3, title: 'Medical Weight Loss', desc: 'Receive medical weight loss treatments that are proven to be safe and effective.' },
    { id: 4, title: 'Ongoing Support', desc: 'Receive ongoing support and monitoring to ensure you stay on track and reach your goals.' },
  ];

  return (
    <SectionCard title="How It Works Section">
      <div className="space-y-5">
        <FormInput label="Section Title" defaultValue="Medical weight management" />
        <FormInput label="Sub Title" defaultValue="How it works" />
        <CtaFormGroup defaultText="Apply Now" defaultUrl="https://weightlossmd.com" defaultOpenInNewTab={true} />

        <div className="space-y-4 pt-2 border-t border-slate-100">
          {steps.map(step => (
            <div key={step.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50 space-y-4">
              <div className="text-sm font-bold text-slate-600">Step {step.id}</div>
              <FormInput label="Title" defaultValue={step.title} />
              <FormTextarea label="Description" className="h-16" defaultValue={step.desc} />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus size={16} /> Add Step
          </button>
          <button className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
            <X size={16} /> Remove section
          </button>
        </div>
      </div>
    </SectionCard>
  );
}
