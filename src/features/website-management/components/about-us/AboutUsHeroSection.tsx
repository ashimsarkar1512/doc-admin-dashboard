import { useState } from "react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";
import { SaveLocalSectionButton } from "./AboutUsSaveButton";

export function AboutUsHeroSection() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [newTab, setNewTab] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 500);
  };

  return (
    <SectionCard title="Hero Section">
      <div className="space-y-5">
        <FormInput
          label="Hero title:"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Personalized Support & Transformation"
        />

        <FormTextarea
          label="Hero Description:"
          className="h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="At WeightLossMD, we believe in..."
        />

        <div className="flex flex-col sm:flex-row flex-wrap sm:items-end gap-4">
          <div className="flex-1 min-w-[160px]">
            <FormInput
              label="CTA Button Text:"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="Book a Consultation"
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <FormInput
              label="URL:"
              value={buttonLink}
              onChange={(e) => setButtonLink(e.target.value)}
              placeholder="https://weightlossmd.com"
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
                onChange={(e) => setNewTab(e.target.checked)}
              />
              <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Blank Target (in new tab)
              </span>
            </label>
          </div>
        </div>
      </div>
      <SaveLocalSectionButton onClick={handleSave} isSaving={isSaving} />
    </SectionCard>
  );
}
