import { useState } from "react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";

interface Props {
  setIsDirty: (dirty: boolean) => void;
}

export function BillingCancellationSection({ setIsDirty }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [step1, setStep1] = useState("");
  const [step2, setStep2] = useState("");
  const [step3, setStep3] = useState("");
  const [step4, setStep4] = useState("");
  const [step5, setStep5] = useState("");

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
    setIsDirty(true);
  };

  return (
    <SectionCard title="Billing Cancellation Section">
      <div className="space-y-5">
        <FormInput label="Section Title:" value={title} onChange={handleChange(setTitle)} placeholder="Cancellation Process" />
        <FormTextarea label="Description:" value={description} onChange={handleChange(setDescription)} className="h-20" placeholder="Simple, no-questions-asked cancellation" />
        
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <FormTextarea label="Step 1:" value={step1} onChange={handleChange(setStep1)} className="h-16" placeholder="Login to your WeightLoss MD account" />
          <FormTextarea label="Step 2:" value={step2} onChange={handleChange(setStep2)} className="h-16" placeholder='Navigate to "Account Settings"' />
          <FormTextarea label="Step 3:" value={step3} onChange={handleChange(setStep3)} className="h-16" placeholder='Click on "Manage Subscription" and follow the prompts' />
          <FormTextarea label="Step 4:" value={step4} onChange={handleChange(setStep4)} className="h-16" placeholder="You will receive a confirmation email within 24 hours" />
          <FormTextarea label="Step 5:" value={step5} onChange={handleChange(setStep5)} className="h-16" placeholder="Access will remain until the end of billing cycle" />
        </div>
      </div>
    </SectionCard>
  );
}
