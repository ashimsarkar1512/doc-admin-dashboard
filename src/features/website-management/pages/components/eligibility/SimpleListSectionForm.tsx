import { Plus, Trash2 } from "lucide-react";
import { FieldLabel, SectionCard, TextInput } from "./shared";

interface SimpleListSectionFormProps {
  cardTitle: string;
  sectionLabel: string;
  sectionTitle: string;
  setSectionTitle: (value: string) => void;
  inputLabel: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  addItemLabel: string;
  addItem: () => void;
  items: string[];
  removeItem: (index: number) => void;
}

export function SimpleListSectionForm({
  cardTitle,
  sectionLabel,
  sectionTitle,
  setSectionTitle,
  inputLabel,
  inputValue,
  setInputValue,
  addItemLabel,
  addItem,
  items,
  removeItem,
}: SimpleListSectionFormProps) {
  return (
    <SectionCard title={cardTitle}>
      <div className="flex flex-col gap-y-2">
        <FieldLabel>{sectionLabel}</FieldLabel>
        <TextInput value={sectionTitle} onChange={setSectionTitle} />
      </div>
      <div className="mb-2 mt-4 h-px w-full bg-[#D1D5DC]" />
      <div className="flex flex-col gap-y-2">
        <FieldLabel>{inputLabel}</FieldLabel>
        <TextInput
          value={inputValue}
          onChange={setInputValue}
          placeholder="Write here..."
        />
      </div>

      <button
        type="button"
        onClick={addItem}
        className="inline-flex w-fit items-center gap-1.5 pt-4 text-sm font-medium text-[#2563eb] transition hover:text-[#1d4ed8]"
      >
        <Plus className="h-4 w-4" />
        {addItemLabel}
      </button>

      <div className="mt-2.5 flex flex-col gap-y-5">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center gap-3">
            <span className="font-['Quicksand'] text-[14px] leading-[20px] font-normal tracking-[0px] text-[#272628]">
              {item}
            </span>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="shrink-0 text-[#E7000B] transition hover:text-rose-600"
              aria-label={`Remove ${item}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
