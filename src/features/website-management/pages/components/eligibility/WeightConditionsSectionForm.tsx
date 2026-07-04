import { Plus, Trash2 } from "lucide-react";
import { FieldLabel, SectionCard, TextInput } from "./shared";

interface WeightConditionsSectionFormProps {
  weightConditionsTitle: string;
  setWeightConditionsTitle: (value: string) => void;
  newCondition: string;
  setNewCondition: (value: string) => void;
  weightConditions: string[];
  addCondition: () => void;
  removeCondition: (index: number) => void;
}

export function WeightConditionsSectionForm({
  weightConditionsTitle,
  setWeightConditionsTitle,
  newCondition,
  setNewCondition,
  weightConditions,
  addCondition,
  removeCondition,
}: WeightConditionsSectionFormProps) {
  return (
    <SectionCard title="Weight Conditions Section">
      <div className="flex flex-col gap-y-2">
        <FieldLabel>Section Title:</FieldLabel>
        <TextInput
          value={weightConditionsTitle}
          onChange={setWeightConditionsTitle}
        />
      </div>
      <div className="mb-4 mt-4 h-px w-full bg-[#D1D5DC]" />
      <div className="flex flex-col gap-y-2">
        <FieldLabel>Write Condition:</FieldLabel>
        <TextInput
          value={newCondition}
          onChange={setNewCondition}
          placeholder="Write here..."
        />
      </div>

      <button
        type="button"
        onClick={addCondition}
        className="inline-flex w-fit items-center gap-1.5 pt-4 text-sm font-medium text-[#2563eb] transition hover:text-[#1d4ed8]"
      >
        <Plus className="h-4 w-4" />
        Add Condition
      </button>

      <div className="mt-2.5 flex flex-wrap gap-2">
        {weightConditions.map((condition, index) => (
          <div
            key={`${condition}-${index}`}
            className="inline-flex items-center gap-2 rounded-full border border-[#1A5C8A1F/0.12] bg-[#EBEEF2] px-[18px] py-2.5"
          >
            <span className="font-['Quicksand'] text-[12px] leading-[16px] font-normal tracking-[0px] text-[#667085]">
              {condition}
            </span>
            <button
              type="button"
              onClick={() => removeCondition(index)}
              className="text-[#E7000B] transition hover:text-rose-600"
              aria-label={`Remove ${condition}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
