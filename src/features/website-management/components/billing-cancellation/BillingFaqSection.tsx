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

export function BillingFaqSection({ setIsDirty }: Props) {
  const [title, setTitle] = useState("");
  const [faqs, setFaqs] = useState<FaqItem[]>([
    { id: "1", question: "", answer: "" },
    { id: "2", question: "", answer: "" },
    { id: "3", question: "", answer: "" },
    { id: "4", question: "", answer: "" },
    { id: "5", question: "", answer: "" }
  ]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setIsDirty(true);
  };

  const handleFaqChange = (id: string, field: keyof Omit<FaqItem, "id">, value: string) => {
    setFaqs(prev => prev.map(faq => faq.id === id ? { ...faq, [field]: value } : faq));
    setIsDirty(true);
  };

  const addFaq = () => {
    setFaqs(prev => [...prev, { id: Math.random().toString(36).substring(7), question: "", answer: "" }]);
    setIsDirty(true);
  };

  const removeFaq = (id: string) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id));
    setIsDirty(true);
  };

  return (
    <SectionCard title="FAQ's Section">
      <div className="space-y-6">
        <FormInput label="Section Title:" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Billing FAQ's" />

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="p-4 border border-slate-200 rounded-lg space-y-4 bg-white relative">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <FormInput label="Question:" value={faq.question} onChange={(e) => handleFaqChange(faq.id, "question", e.target.value)} placeholder={index === 0 ? "When am I charged?" : index === 1 ? 'What do you mean by "flexible billing cycle"?' : index === 2 ? "Can I pause my membership?" : index === 3 ? "How do I cancel?" : index === 4 ? "Do you offer refunds?" : "Write here..."} />
                </div>
                <div className="w-10 shrink-0"></div>
              </div>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <FormTextarea label="Answer:" className="h-20" value={faq.answer} onChange={(e) => handleFaqChange(faq.id, "answer", e.target.value)} placeholder={index === 0 ? "Your card is charged on the day you initially subscribe and then automatically every 28-30 days on your original order date..." : "Write here..."} />
                </div>
                <button onClick={() => removeFaq(faq.id)} className="mb-1 text-red-500 hover:text-red-700 hover:bg-red-50 w-10 h-10 flex items-center justify-center rounded-md transition-colors shrink-0">
                  <Trash2 size={18} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <button onClick={addFaq} className="text-sm font-medium text-[#1447E6] hover:text-blue-700 transition-colors">
            + Add More
          </button>
        </div>
      </div>
    </SectionCard>
  );
}
