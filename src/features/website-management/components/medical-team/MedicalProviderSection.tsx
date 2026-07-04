import { useState } from "react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";

interface Props {
  setIsDirty: (dirty: boolean) => void;
}

export function MedicalProviderSection({ setIsDirty }: Props) {
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
    <SectionCard title="Provider Section">
      <div className="space-y-5">
        <FormInput
          label="Section Title:"
          value={title}
          onChange={(e) => handleChangeTitle(e.target.value)}
          placeholder="Our Licensed Provider Network"
        />

        <FormTextarea
          label="Section Description:"
          className="h-24"
          value={description}
          onChange={(e) => handleChangeDescription(e.target.value)}
          placeholder="Every provider in our network is credentialed, licensed in your state, and trained in evidence-based obesity and metabolic medicine."
        />
      </div>
    </SectionCard>
  );
}
