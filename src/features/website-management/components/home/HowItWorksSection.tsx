import React from 'react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';

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

        <div className="space-y-4 pt-2 border-t border-slate-100">
          {steps.map(step => (
            <div key={step.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50 space-y-4">
              <div className="text-sm font-bold text-slate-600">Step {step.id}</div>
              <FormInput label="Title" defaultValue={step.title} />
              <FormTextarea label="Description" className="h-16" defaultValue={step.desc} />
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
