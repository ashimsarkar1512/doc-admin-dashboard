import React from 'react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { CtaFormGroup } from '../shared/CtaFormGroup';

export function ProvidersSection() {
  return (
    <SectionCard title="Providers Section">
      <div className="space-y-5">
        <FormInput label="Section Title:" defaultValue="Meet our expert providers" />
        <CtaFormGroup defaultText="Book an Consultation" defaultUrl="https://weightlossmd.com/contact" defaultOpenInNewTab={true} />
      </div>
    </SectionCard>
  );
}
