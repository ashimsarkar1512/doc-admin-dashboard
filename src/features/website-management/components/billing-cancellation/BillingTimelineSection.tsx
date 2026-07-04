import { useState } from "react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";

interface Props {
  setIsDirty: (dirty: boolean) => void;
}

export function BillingTimelineSection({ setIsDirty }: Props) {
  const [title, setTitle] = useState("");
  
  const [step1Title, setStep1Title] = useState("");
  const [step1Desc, setStep1Desc] = useState("");
  
  const [step2Title, setStep2Title] = useState("");
  const [step2Desc, setStep2Desc] = useState("");
  
  const [step3Title, setStep3Title] = useState("");
  const [step3Desc, setStep3Desc] = useState("");
  
  const [step4Title, setStep4Title] = useState("");
  const [step4Desc, setStep4Desc] = useState("");
  
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDesc, setNoteDesc] = useState("");

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
    setIsDirty(true);
  };

  return (
    <SectionCard title="Billing Timeline Section">
      <div className="space-y-6">
        <FormInput label="Section Title:" value={title} onChange={handleChange(setTitle)} placeholder="Billing Timeline" />
        
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <FormInput label="Step 1:" value={step1Title} onChange={handleChange(setStep1Title)} placeholder="Day 1" />
          <FormTextarea label="Description:" value={step1Desc} onChange={handleChange(setStep1Desc)} className="h-20" placeholder="Initial payment charged" />
        </div>
        
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <FormInput label="Step 2:" value={step2Title} onChange={handleChange(setStep2Title)} placeholder="Day 1-2" />
          <FormTextarea label="Description:" value={step2Desc} onChange={handleChange(setStep2Desc)} className="h-20" placeholder="Provider review begins" />
        </div>
        
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <FormInput label="Step 3:" value={step3Title} onChange={handleChange(setStep3Title)} placeholder="Day 3-5" />
          <FormTextarea label="Description:" value={step3Desc} onChange={handleChange(setStep3Desc)} className="h-20" placeholder="Patient on-boarding" />
        </div>
        
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <FormInput label="Step 4:" value={step4Title} onChange={handleChange(setStep4Title)} placeholder="Billing Monthly" />
          <FormTextarea label="Description:" value={step4Desc} onChange={handleChange(setStep4Desc)} className="h-20" placeholder="Flexible subscription billing" />
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-lg">
          <FormInput label="Disclaimer Title:" value={noteTitle} onChange={handleChange(setNoteTitle)} placeholder="Auto-Renewal Policy" />
          <FormTextarea label="Description:" value={noteDesc} onChange={handleChange(setNoteDesc)} className="h-28" placeholder="Your membership automatically renews on a monthly, 3-month, or 6-month basis depending on the plan you choose. You will receive an email reminder a few days before each renewal. You can cancel at any time before your renewal date. By completing your purchase you are agreeing to these terms." />
        </div>
      </div>
    </SectionCard>
  );
}
