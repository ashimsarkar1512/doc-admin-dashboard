import { useState } from "react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";

interface Props {
  setIsDirty: (dirty: boolean) => void;
}

export function HowItWorksDisclaimerSection({ setIsDirty }: Props) {
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
    <SectionCard title="Disclaimer Section">
      <div className="space-y-5">
        <FormInput
          label="Disclaimer Title:"
          value={title}
          onChange={(e) => handleChangeTitle(e.target.value)}
          placeholder="Provider Review Disclaimer"
        />

        <FormTextarea
          label="Description:"
          className="h-20"
          value={description}
          onChange={(e) => handleChangeDescription(e.target.value)}
          placeholder="All treatment decisions are made exclusively by licensed healthcare providers. Payment of any membership fee does not guarantee a prescription or approval for treatment."
        />
      </div>
    </SectionCard>
  );
}
