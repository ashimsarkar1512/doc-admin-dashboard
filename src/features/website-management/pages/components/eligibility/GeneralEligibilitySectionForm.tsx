import { Plus, Trash2 } from "lucide-react";
import { FieldLabel, SectionCard, TextAreaInput, TextInput } from "./shared";

interface GeneralEligibilitySectionFormProps {
  sectionTitle: string;
  setSectionTitle: (value: string) => void;
  points: string[];
  updatePoint: (index: number, value: string) => void;
  removePoint: (index: number) => void;
  addPoint: () => void;
  reminder: string;
  setReminder: (value: string) => void;
}

export function GeneralEligibilitySectionForm({
  sectionTitle,
  setSectionTitle,
  points,
  updatePoint,
  removePoint,
  addPoint,
  reminder,
  setReminder,
}: GeneralEligibilitySectionFormProps) {
  return (
    <SectionCard title="General Eligibility Criteria Section">
      <div className="flex flex-col gap-y-2">
        <FieldLabel>Section Title:</FieldLabel>
        <TextInput value={sectionTitle} onChange={setSectionTitle} />
      </div>
      <div className="mt-4 mb-4 h-px w-full bg-[#D1D5DC]" />

      <div className="space-y-3">
        {points.map((point, index) => (
          <div key={index} className="flex items-end gap-2">
            <div className="flex w-full flex-col gap-y-2">
              <FieldLabel>{`Point ${index + 1}:`}</FieldLabel>
              <TextInput
                value={point}
                onChange={(value) => updatePoint(index, value)}
              />
            </div>
            <button
              type="button"
              onClick={() => removePoint(index)}
              className="mb-0.5 inline-flex h-10 w-10 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={points.length === 1}
              aria-label={`Remove point ${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addPoint}
        className="mt-4 mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#2563eb] transition hover:text-[#1d4ed8]"
      >
        <Plus className="h-4 w-4" />
        Add More
      </button>
      <div className="mb-4 h-px w-full bg-[#D1D5DC]" />
      <div className="flex flex-col gap-y-2">
        <FieldLabel>Reminder:</FieldLabel>
        <TextAreaInput value={reminder} onChange={setReminder} rows={3} />
      </div>
    </SectionCard>
  );
}
