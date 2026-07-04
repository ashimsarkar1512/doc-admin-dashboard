import { useState, type ReactNode } from "react";
import { Plus, Save, Trash2 } from "lucide-react";

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl rounded-[10px] border border-[#D1D5DC] bg-white p-4 md:p-5">
      <div className="font-['Quicksand'] text-[18px] font-semibold leading-[20px] tracking-[0px] text-[#272628]">
        {title}
      </div>
      <div className="mt-4 font-['Quicksand'] text-[14px] font-normal leading-none tracking-[0px] text-[#272628]">
        {children}
      </div>
    </section>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="block font-['Quicksand'] text-[14px] font-semibold leading-[20px] tracking-[0px] text-[#272628]">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  );
}

function TextAreaInput({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  );
}

function SaveButton() {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-lg bg-[#1447E6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
    >
      <Save size={16} />
      Save Changes
    </button>
  );
}

export default function FaqPage() {
  const [heroTitle, setHeroTitle] = useState("Frequently Asked Questions");
  const [heroDescription, setHeroDescription] = useState(
    "Find answers to common questions about our programs, medications, and process."
  );
  const [searchPlaceholder, setSearchPlaceholder] = useState(
    "Search from questions..."
  );
  const [faqs, setFaqs] = useState([
    {
      question: "How much weight can I expect to lose?",
      answer:
        "No. Your assessment creates a new patient relationship with your assigned provider, who reviews your health information to establish the relationship as part of the clinical process.",
    },
    {
      question: "How long will I be on treatment?",
      answer: "",
    },
    {
      question: "What are common side effects of semaglutide?",
      answer: "",
    },
    {
      question: "How is tirzepatide different from semaglutide?",
      answer: "",
    },
  ]);
  const [bottomCtaTitle, setBottomCtaTitle] = useState(
    "Contact Us at Weight Loss MD Today"
  );
  const [bottomCtaButtonText, setBottomCtaButtonText] = useState(
    "Book a consultation"
  );
  const [bottomCtaUrl, setBottomCtaUrl] = useState(
    "https://weightlossmd.com/contact"
  );
  const [bottomCtaNewTab, setBottomCtaNewTab] = useState(true);

  const updateFaq = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    setFaqs((current) =>
      current.map((faq, faqIndex) =>
        faqIndex === index ? { ...faq, [field]: value } : faq
      )
    );
  };

  const addFaq = () => {
    setFaqs((current) => [...current, { question: "", answer: "" }]);
  };

  const removeFaq = (index: number) => {
    setFaqs((current) => current.filter((_, faqIndex) => faqIndex !== index));
  };

  return (
    <div className="w-full bg-[#f8fafc] p-4 md:p-6">
      <div className="mx-auto">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-col gap-y-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-['Quicksand'] text-[18px] font-semibold leading-[28px] tracking-[0px] text-[#101828] md:text-[20px] md:leading-[30px]">
              Page: FAQ
            </h1>
            <SaveButton />
          </div>

          <div className="flex flex-col gap-y-5 lg:gap-y-6.5">
            <SectionCard title="Hero Section">
              <div className="space-y-2">
                <FieldLabel>Hero title:</FieldLabel>
                <TextInput value={heroTitle} onChange={setHeroTitle} />
              </div>

              <div className="mt-2 space-y-2">
                <FieldLabel>Hero Description:</FieldLabel>
                <TextAreaInput
                  value={heroDescription}
                  onChange={setHeroDescription}
                  rows={4}
                />
              </div>
            </SectionCard>

            <SectionCard title="FAQ's Section">
              <div className="space-y-2">
                <FieldLabel>Search Btn Placeholder:</FieldLabel>
                <TextInput
                  value={searchPlaceholder}
                  onChange={setSearchPlaceholder}
                />
              </div>

              <div className="mt-4 flex flex-col gap-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={`${index}-${faq.question}`}
                    className="rounded-[10px] border border-[#D1D5DC] p-3 md:p-4"
                  >
                    <div className="space-y-2">
                      <FieldLabel>Question:</FieldLabel>
                      <TextInput
                        value={faq.question}
                        onChange={(value) => updateFaq(index, "question", value)}
                        placeholder="Write..."
                      />
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
                className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-medium text-[#2563eb] transition hover:text-[#1d4ed8]"
              >
                <Plus className="h-4 w-4" />
                Add More
              </button>
            </SectionCard>

            <SectionCard title="Bottom CTA Section:">
              <div className="space-y-2">
                <FieldLabel>Section Title:</FieldLabel>
                <TextInput
                  value={bottomCtaTitle}
                  onChange={setBottomCtaTitle}
                />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <FieldLabel>CTA Button Text:</FieldLabel>
                  <TextInput
                    value={bottomCtaButtonText}
                    onChange={setBottomCtaButtonText}
                  />
                </div>

                <div className="space-y-2">
                  <FieldLabel>URL:</FieldLabel>
                  <TextInput value={bottomCtaUrl} onChange={setBottomCtaUrl} />
                </div>

                <div className="space-y-2">
                  <FieldLabel>Button target:</FieldLabel>
                  <label className="mt-3 inline-flex items-center gap-3 font-['Quicksand'] text-[14px] font-normal leading-[20px] tracking-[0px] text-[#272628]">
                    <input
                      type="checkbox"
                      checked={bottomCtaNewTab}
                      onChange={(event) => setBottomCtaNewTab(event.target.checked)}
                      className="h-5 w-5 rounded border border-[#D1D5DC] text-[#1447E6] focus:ring-2 focus:ring-blue-100"
                    />
                    Blank (open in new tab)
                  </label>
                </div>
              </div>
            </SectionCard>

            <div className="pt-1">
              <SaveButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
