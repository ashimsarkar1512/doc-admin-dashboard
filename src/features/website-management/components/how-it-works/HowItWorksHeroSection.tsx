import { useState } from "react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";

interface Props {
  setIsDirty: (dirty: boolean) => void;
}

export function HowItWorksHeroSection({ setIsDirty }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleChangeTitle = (val: string) => {
    setTitle(val);
    setIsDirty(true);
  };

  const handleChangeDescription = (val: string) => {
    setDescription(val);
    setIsDirty(true);
  };

  return (
    <SectionCard title="Hero Section">
      <div className="space-y-5">
        <FormInput
          label="Hero title:"
          value={title}
          onChange={(e) => handleChangeTitle(e.target.value)}
          placeholder="How WeightLoss MD Works"
        />

        <FormTextarea
          label="Hero Description:"
          className="h-24"
          value={description}
          onChange={(e) => handleChangeDescription(e.target.value)}
          placeholder="A clear, transparent process from your first health question to ongoing medical support - all from licensed providers."
        />
      </div>
    </SectionCard>
  );
}
