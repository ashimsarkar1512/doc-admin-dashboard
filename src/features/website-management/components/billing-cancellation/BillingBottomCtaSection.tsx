import { useState } from "react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";

interface Props {
  setIsDirty: (dirty: boolean) => void;
}

export function BillingBottomCtaSection({ setIsDirty }: Props) {
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [call, setCall] = useState("");
  const [newTab, setNewTab] = useState(true);

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
    setIsDirty(true);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTab(e.target.checked);
    setIsDirty(true);
  };

  return (
    <SectionCard title="Bottom CTA Section">
      <div className="space-y-5">
        <FormInput label="Section Title:" value={title} onChange={handleChange(setTitle)} placeholder="Need Help? Contact Our Support Team" />
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[160px]">
            <FormInput label="Email Address:" value={email} onChange={handleChange(setEmail)} placeholder="support@weightlossmd.com" />
          </div>
          <div className="flex-1 min-w-[160px]">
            <FormInput label="Call:" value={call} onChange={handleChange(setCall)} placeholder="1-800-WEIGHT-LOSS" />
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            <label className="block text-sm font-medium text-slate-700">Button target:</label>
            <label className="flex items-center gap-2 pb-1.5 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-[#1447E6] focus:ring-[#1447E6] border-slate-300" checked={newTab} onChange={handleCheckboxChange} />
              <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Blank (open in new tab)</span>
            </label>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
