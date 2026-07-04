import { Trash2 } from "lucide-react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";
import { useHowItWorksContext } from "../../context/HowItWorksContext";
import type { FaqItem } from "../../context/HowItWorksContext";

export function HowItWorksFaqSection() {
  const { form, setField } = useHowItWorksContext();

  const handleFaqChange = (
    id: string,
    field: keyof Omit<FaqItem, "id">,
    value: string,
  ) => {
    setField(
      "faqs",
      form.faqs.map((faq) => (faq.id === id ? { ...faq, [field]: value } : faq))
    );
  };

  const addFaq = () => {
    setField("faqs", [
      ...form.faqs,
      {
        id: crypto.randomUUID(),
        question: "",
        answer: "",
      },
    ]);
  };

  const removeFaq = (id: string) => {
    setField(
      "faqs",
      form.faqs.filter((faq) => faq.id !== id)
    );
  };

  return (
    <SectionCard title="FAQ's Section">
      <div className="space-y-6">
        <FormInput
          label="Section Title:"
          value={form.faqSectionTitle}
          onChange={(e) => setField("faqSectionTitle", e.target.value)}
          placeholder="Process Questions"
        />

        <div className="space-y-4">
          {form.faqs.map((faq) => (
            <div
              key={faq.id}
              className="p-4 border border-slate-200 rounded-lg space-y-4 bg-white relative"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <FormInput
                    label="Question:"
                    value={faq.question}
                    onChange={(e) =>
                      handleFaqChange(faq.id, "question", e.target.value)
                    }
                    placeholder="Question"
                  />
                </div>
                {/* Spacer to perfectly align top input with bottom textarea */}
                <div className="w-10 shrink-0"></div>
              </div>

              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <FormTextarea
                    label="Answer:"
                    className="h-20"
                    value={faq.answer}
                    onChange={(e) =>
                      handleFaqChange(faq.id, "answer", e.target.value)
                    }
                    placeholder="Answer..."
                  />
                </div>
                <button
                  onClick={() => removeFaq(faq.id)}
                  className="mb-1 text-red-500 hover:text-red-700 hover:bg-red-50 w-10 h-10 flex items-center justify-center rounded-md transition-colors shrink-0"
                  title="Remove FAQ"
                >
                  <Trash2 size={18} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <button
            onClick={addFaq}
            className="text-sm font-medium text-[#1447E6] hover:text-blue-700 transition-colors"
          >
            + Add More
          </button>
        </div>
      </div>
    </SectionCard>
  );
}
