import { FieldLabel, SectionCard, TextAreaInput, TextInput } from "./shared";

interface DisclaimerSectionFormProps {
  disclaimerTitle: string;
  setDisclaimerTitle: (value: string) => void;
  disclaimerDescription: string;
  setDisclaimerDescription: (value: string) => void;
}

export function DisclaimerSectionForm({
  disclaimerTitle,
  setDisclaimerTitle,
  disclaimerDescription,
  setDisclaimerDescription,
}: DisclaimerSectionFormProps) {
  return (
    <SectionCard title="Disclaimer Section">
      <div className="flex flex-col gap-y-2">
        <FieldLabel>Disclaimer Title:</FieldLabel>
        <TextInput value={disclaimerTitle} onChange={setDisclaimerTitle} />
      </div>

      <div className="mt-2 flex flex-col gap-y-2">
        <FieldLabel>Description:</FieldLabel>
        <TextAreaInput
          value={disclaimerDescription}
          onChange={setDisclaimerDescription}
          rows={3}
        />
      </div>
    </SectionCard>
  );
}
