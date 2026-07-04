import { useState } from "react";
import { Trash2 } from "lucide-react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";

interface Props {
  setIsDirty: (dirty: boolean) => void;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export function HowItWorksFaqSection({ setIsDirty }: Props) {
  const [title, setTitle] = useState("Process Questions");

  const [faqs, setFaqs] = useState<FaqItem[]>([
    {
      id: "1",
      question: "Do I need to be a patient of record before starting?",
      answer:
        "No. Your assessment creates a new patient relationship with your assigned provider - who reviews your health information to establish this relationship as part of the clinical process.",
    },
    {
      id: "2",
      question: "What if my provider requests more information?",
      answer: "",
    },
    {
      id: "3",
      question: "Is payment taken before or after approval?",
      answer: "",
    },
    {
      id: "4",
      question: "How quickly can I receive my medication?",
      answer: "",
    },
  ]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setIsDirty(true);
  };

  const handleFaqChange = (
    id: string,
    field: keyof Omit<FaqItem, "id">,
    value: string,
  ) => {
    setFaqs((prev) =>
      prev.map((faq) => (faq.id === id ? { ...faq, [field]: value } : faq)),
    );
    setIsDirty(true);
  };

  const addFaq = () => {
    setFaqs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        question: "",
        answer: "",
      },
    ]);
    setIsDirty(true);
  };

  const removeFaq = (id: string) => {
    setFaqs((prev) => prev.filter((faq) => faq.id !== id));
    setIsDirty(true);
  };

  return (
    <SectionCard title="FAQ's Section">
      <div className="space-y-6">
        <FormInput
          label="Section Title:"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Process Questions"
        />

        <div className="space-y-4">
          {faqs.map((faq) => (
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
