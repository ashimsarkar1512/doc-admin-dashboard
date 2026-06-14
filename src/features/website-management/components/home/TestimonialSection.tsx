import React from 'react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { CtaFormGroup } from '../shared/CtaFormGroup';

export function TestimonialSection() {
  return (
    <SectionCard title="Testimonial Section">
      <div className="space-y-5">
        <FormInput label="Section Title" defaultValue="Don't just take our word for it" />
        <FormInput label="Sub Title" defaultValue="Real stories. Real results." />
        <FormInput label="CTA Description" defaultValue="Ready to start your journey to a healthier you? Contact us today." />
        <CtaFormGroup defaultText="Contact us" defaultUrl="https://weightlossmd.com/contact" defaultOpenInNewTab={true} />
      </div>
    </SectionCard>
  );
}
