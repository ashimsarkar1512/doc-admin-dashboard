import { useState } from "react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";

interface Props {
  setIsDirty: (dirty: boolean) => void;
  title: string;
  setTitle: (t: string) => void;
  description: string;
  setDescription: (d: string) => void;
}

export function BillingCancellationHeroSection({ setIsDirty, title, setTitle, description, setDescription }: Props) {
  const handleChange = (setter: (val: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
    setIsDirty(true);
  };

  return (
    <SectionCard title="Hero Section">
      <div className="space-y-5">
        <FormInput
          label="Hero title:"
          value={title}
          onChange={handleChange(setTitle)}
          placeholder="Billing Cancellation & Refund"
        />
        <FormTextarea
          label="Hero Description:"
          className="h-24"
          value={description}
          onChange={handleChange(setDescription)}
          placeholder="This document outlines Weight Loss MD's Cancellation policies."
        />
      </div>
    </SectionCard>
  );
}
