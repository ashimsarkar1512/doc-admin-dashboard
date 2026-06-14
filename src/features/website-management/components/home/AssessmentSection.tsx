import React from 'react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';

export function AssessmentSection() {
  return (
    <SectionCard title="Assessment Section">
      <div className="space-y-5">
        <FormInput label="Section Title:" defaultValue="Start from a tailored assessment" />
        <FormTextarea 
          label="Section Description:" 
          className="h-20"
          defaultValue="Comprehensive care for a wide range of everyday conditions, managed safely from home." 
        />
      </div>
    </SectionCard>
  );
}
