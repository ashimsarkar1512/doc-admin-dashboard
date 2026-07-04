import { useState } from "react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";

interface Props {
  setIsDirty: (dirty: boolean) => void;
}

export function MedicalCtaSection({ setIsDirty }: Props) {
  const [title, setTitle] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [url, setUrl] = useState("");
  const [newTab, setNewTab] = useState(true);

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setIsDirty(true);
    };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTab(e.target.checked);
    setIsDirty(true);
  };

  return (
    <SectionCard title="Bottom CTA Section:">
      <div className="space-y-5">
        <FormInput
          label="Section Title:"
          value={title}
          onChange={handleChange(setTitle)}
          placeholder="Contact Us at Weight Loss MD Today"
        />

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[160px]">
            <FormInput
              label="CTA Button Text:"
              value={buttonText}
              onChange={handleChange(setButtonText)}
              placeholder="Book a consultation"
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <FormInput
              label="URL:"
              value={url}
              onChange={handleChange(setUrl)}
              placeholder="https://weightlossmd.com/contact"
            />
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            <label className="block text-sm font-medium text-slate-700">
              Button target:
            </label>
            <label className="flex items-center gap-2 pb-1.5 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-[#1447E6] focus:ring-[#1447E6] border-slate-300"
                checked={newTab}
                onChange={handleCheckboxChange}
              />
              <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Blank (open in new tab)
              </span>
            </label>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
