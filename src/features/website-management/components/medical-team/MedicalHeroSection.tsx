import { useState } from "react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";

interface Props {
  setIsDirty: (dirty: boolean) => void;
}

export function MedicalHeroSection({ setIsDirty }: Props) {
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
          placeholder="Meet Our Medical Team"
        />

        <FormTextarea
          label="Hero Description:"
          className="h-24"
          value={description}
          onChange={(e) => handleChangeDescription(e.target.value)}
          placeholder="All treatment decisions at WeightLossMD are made exclusively by board-certified, state-licensed healthcare professionals. Your health is in expert hands."
        />
      </div>
    </SectionCard>
  );
}
