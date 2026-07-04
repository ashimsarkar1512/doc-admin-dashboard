import { FieldLabel, SectionCard, TextAreaInput, TextInput } from "./shared";

interface BmiQualificationSectionFormProps {
  bmiSectionTitle: string;
  setBmiSectionTitle: (value: string) => void;
  bmi27Title: string;
  setBmi27Title: (value: string) => void;
  bmi27Description: string;
  setBmi27Description: (value: string) => void;
  bmi30Title: string;
  setBmi30Title: (value: string) => void;
  bmi30Description: string;
  setBmi30Description: (value: string) => void;
}

export function BmiQualificationSectionForm({
  bmiSectionTitle,
  setBmiSectionTitle,
  bmi27Title,
  setBmi27Title,
  bmi27Description,
  setBmi27Description,
  bmi30Title,
  setBmi30Title,
  bmi30Description,
  setBmi30Description,
}: BmiQualificationSectionFormProps) {
  return (
    <SectionCard title="BMI Qualification Section">
      <div className="flex flex-col gap-y-2">
        <FieldLabel>Section Title:</FieldLabel>
        <TextInput value={bmiSectionTitle} onChange={setBmiSectionTitle} />
      </div>

      <div className="mt-2 flex flex-col gap-y-2">
        <FieldLabel>BMI 27+:</FieldLabel>
        <TextInput value={bmi27Title} onChange={setBmi27Title} />
      </div>

      <div className="mt-2 flex flex-col gap-y-2">
        <FieldLabel>Description:</FieldLabel>
        <TextAreaInput
          value={bmi27Description}
          onChange={setBmi27Description}
          rows={2}
        />
      </div>

      <div className="mb-4 mt-4 h-px w-full bg-[#D1D5DC]" />

      <div className="flex flex-col gap-y-2">
        <FieldLabel>BMI 30+:</FieldLabel>
        <TextInput value={bmi30Title} onChange={setBmi30Title} />
      </div>

      <div className="mt-2 flex flex-col gap-y-2">
        <FieldLabel>Description:</FieldLabel>
        <TextAreaInput
          value={bmi30Description}
          onChange={setBmi30Description}
          rows={2}
        />
      </div>
    </SectionCard>
  );
}
