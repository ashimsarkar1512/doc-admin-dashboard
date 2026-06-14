import React from 'react';
import { Plus, X } from 'lucide-react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { CtaFormGroup } from '../shared/CtaFormGroup';

export function AboutUsSection() {
  return (
    <SectionCard title="About Us Section">
      <div className="space-y-5">
        <FormInput label="Section Title" defaultValue="About Us" />
        <FormTextarea 
          label="Subtitle / Description" 
          className="h-20"
          defaultValue="Weight Loss MD offers a fully customized medical weight management program that is designed to help you reach your goals safely and effectively. Our medically supervised program uses a proven..." 
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput label="Feature Title box 1" defaultValue="Medical Supervision" />
          <FormInput label="Feature Title box 2" defaultValue="Customized Meal Plans" />
          <FormInput label="Feature Title box 3" defaultValue="Ongoing Support" />
        </div>

        <CtaFormGroup defaultText="Apply Now" defaultUrl="https://weightlossmd.com" defaultOpenInNewTab={true} />

        <div className="flex items-center gap-4 pt-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus size={16} /> Add field
          </button>
          <button className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
             <X size={16} /> Remove image
          </button>
        </div>
      </div>
    </SectionCard>
  );
}
