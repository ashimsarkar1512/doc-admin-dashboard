import { Plus, Trash2 } from "lucide-react";
import type { EligibilityFaqItem } from "./types";
import { FieldLabel, SectionCard, TextAreaInput, TextInput } from "./shared";

interface FaqSectionFormProps {
  faqSectionTitle: string;
  setFaqSectionTitle: (value: string) => void;
  faqs: EligibilityFaqItem[];
  updateFaq: (index: number, field: "question" | "answer", value: string) => void;
  removeFaq: (index: number) => void;
  addFaq: () => void;
}

export function FaqSectionForm({
  faqSectionTitle,
  setFaqSectionTitle,
  faqs,
  updateFaq,
  removeFaq,
  addFaq,
}: FaqSectionFormProps) {
  return (
    <SectionCard title="FAQ’s Section">
      <div className="flex flex-col gap-y-2">
        <FieldLabel>Section Title:</FieldLabel>
        <TextInput value={faqSectionTitle} onChange={setFaqSectionTitle} />
      </div>

      <div className="mb-4 mt-4 h-px w-full bg-[#D1D5DC]" />

      <div className="flex flex-col gap-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-[10px] border border-[#D1D5DC] p-3 md:p-4"
          >
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-2">
                <FieldLabel>Question:</FieldLabel>
                <TextInput
                  value={faq.question}
                  onChange={(value) => updateFaq(index, "question", value)}
                  placeholder="Write..."
                />
              </div>
            </div>

            <div className="mt-3 flex items-end gap-2">
              <div className="flex-1 space-y-2">
                <FieldLabel>Answer:</FieldLabel>
                <TextAreaInput
                  value={faq.answer}
                  onChange={(value) => updateFaq(index, "answer", value)}
                  rows={2}
                  placeholder="Write..."
                />
              </div>
              <button
                type="button"
                onClick={() => removeFaq(index)}
                className="mb-1 shrink-0 text-[#E7000B] transition hover:text-rose-600"
                aria-label={`Remove FAQ ${index + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addFaq}
        className="inline-flex w-fit items-center gap-1 pt-4 text-sm font-medium text-[#2563eb] transition hover:text-[#1d4ed8]"
      >
        <Plus className="h-4 w-4" />
        Add More
      </button>
    </SectionCard>
  );
}
