import React from 'react';
import { X } from 'lucide-react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { CtaFormGroup } from '../shared/CtaFormGroup';
import { ToggleSwitch } from '../shared/ToggleSwitch';

export function TestimonialSection() {
  return (
    <SectionCard title="Testimonial Section">
      <div className="space-y-5">
        <FormInput label="Section Title" defaultValue="Don't just take our word for it" />
        <FormInput label="Sub Title" defaultValue="Real stories. Real results." />
        <FormInput label="CTA Description" defaultValue="Ready to start your journey to a healthier you? Contact us today." />
        <CtaFormGroup defaultText="Contact us" defaultUrl="https://weightlossmd.com/contact" defaultOpenInNewTab={true} />

        {/* Toggle for section visibility */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <ToggleSwitch defaultChecked={true} />
            <span className="text-sm font-medium text-slate-700">Show section on website</span>
          </div>
          
          <button className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
            <X size={16} /> Remove section
          </button>
        </div>
      </div>
    </SectionCard>
  );
}
