import { useEffect, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getHeroSectionByPage,
  updateHeroSection,
} from "@/api/endpoints/hero-section.api";
import {
  getCtaSections,
  updateCtaSection,
} from "@/api/endpoints/cta-section.api";
import {
  getFaqSection,
  updateFaqSection,
} from "@/api/endpoints/faq.api";

interface FaqFormItem {
  id: string;
  question: string;
  answer: string;
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[10px] border border-[#D1D5DC] bg-white p-4 md:p-5">
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

function SaveButton({
  onClick,
  isSaving,
}: {
  onClick: () => void;
  isSaving: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isSaving}
      className="flex w-fit items-center gap-2 rounded-lg bg-[#1447E6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
      Save Changes
    </button>
  );
}

export default function FaqPage() {
  const PAGE_TYPE = "Faq";
  const queryClient = useQueryClient();
  const [heroTitle, setHeroTitle] = useState("Frequently Asked Questions");
  const [heroDescription, setHeroDescription] = useState(
    "Find answers to common questions about our programs, medications, and process."
  );
  const [searchPlaceholder, setSearchPlaceholder] = useState(
    "Search from questions..."
  );
  const [faqs, setFaqs] = useState<FaqFormItem[]>([]);
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
  const [heroId, setHeroId] = useState("");
  const [ctaId, setCtaId] = useState("");
  const [isHeroInitialized, setIsHeroInitialized] = useState(false);
  const [isCtaInitialized, setIsCtaInitialized] = useState(false);
  const [isFaqInitialized, setIsFaqInitialized] = useState(false);

  const FAQ_HERO_QUERY_KEY = ["faq-hero-section"];
  const FAQ_CTA_QUERY_KEY = ["cta-section", PAGE_TYPE];
  const FAQ_SECTION_QUERY_KEY = ["faq-section", PAGE_TYPE];

  const { data: heroData, refetch: refetchHeroData } = useQuery({
    queryKey: FAQ_HERO_QUERY_KEY,
    queryFn: () => getHeroSectionByPage(PAGE_TYPE),
    staleTime: 5 * 60 * 1000,
  });

  const { data: ctaData, refetch: refetchCtaData } = useQuery({
    queryKey: FAQ_CTA_QUERY_KEY,
    queryFn: () => getCtaSections(PAGE_TYPE),
    staleTime: 5 * 60 * 1000,
  });

  const { data: faqSectionData, refetch: refetchFaqSectionData } = useQuery({
    queryKey: FAQ_SECTION_QUERY_KEY,
    queryFn: () => getFaqSection(PAGE_TYPE),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!heroData || isHeroInitialized) return;

    const hero = Array.isArray(heroData) ? heroData[0] : heroData;
    if (!hero) return;

    setHeroId(hero?.id || "");
    setHeroTitle(hero?.title || "");
    setHeroDescription(hero?.description || "");
    setIsHeroInitialized(true);
  }, [heroData, isHeroInitialized]);

  useEffect(() => {
    if (!ctaData?.data || isCtaInitialized) return;

    const cta = Array.isArray(ctaData.data) ? ctaData.data[0] : ctaData.data;
    if (!cta) return;

    setCtaId(cta?.id || "");
    setBottomCtaTitle(cta?.sectionTitle || "");
    setBottomCtaButtonText(cta?.ctaButtonText || "");
    setBottomCtaUrl(cta?.url || "");
    setBottomCtaNewTab(cta?.openInNewTab ?? true);
    setIsCtaInitialized(true);
  }, [ctaData, isCtaInitialized]);

  useEffect(() => {
    if (!faqSectionData?.data || isFaqInitialized) return;

    const faqSection = faqSectionData.data;

    setSearchPlaceholder(faqSection?.sectionTitle || "");
    setFaqs(
      faqSection?.faqs?.length
        ? faqSection.faqs
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((faq) => ({
              id: faq.id,
              question: faq.question || "",
              answer: faq.answer || "",
            }))
        : []
    );
    setIsFaqInitialized(true);
  }, [faqSectionData, isFaqInitialized]);

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
    setFaqs((current) => [
      ...current,
      { id: crypto.randomUUID(), question: "", answer: "" },
    ]);
  };

  const removeFaq = (index: number) => {
    setFaqs((current) => current.filter((_, faqIndex) => faqIndex !== index));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const promises: Promise<unknown>[] = [];

      if (heroId) {
        promises.push(
          updateHeroSection(heroId, {
            page: PAGE_TYPE,
            title: heroTitle,
            description: heroDescription,
          })
        );
      }

      if (ctaId) {
        promises.push(
          updateCtaSection(ctaId, {
            page: PAGE_TYPE,
            sectionTitle: bottomCtaTitle,
            ctaButtonText: bottomCtaButtonText,
            url: bottomCtaUrl,
            openInNewTab: bottomCtaNewTab,
            categoryId: null,
          })
        );
      }

      promises.push(
        updateFaqSection({
          pageType: PAGE_TYPE,
          sectionTitle: searchPlaceholder,
          faqs: faqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })),
        })
      );

      await Promise.all(promises);
    },
    onSuccess: async () => {
      toast.success("FAQ page updated successfully");
      setIsHeroInitialized(false);
      setIsCtaInitialized(false);
      setIsFaqInitialized(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: FAQ_HERO_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: FAQ_CTA_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: FAQ_SECTION_QUERY_KEY }),
        refetchHeroData(),
        refetchCtaData(),
        refetchFaqSectionData(),
      ]);
    },
    onError: () => {
      toast.error("Failed to update FAQ page");
    },
  });

  const handleSave = () => {
    saveMutation.mutate();
  };

  return (
    <div className="w-full bg-[#f8fafc] p-4 md:p-6">
      <div className="mx-auto">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-col gap-y-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-['Quicksand'] text-[18px] font-semibold leading-[28px] tracking-[0px] text-[#101828] md:text-[20px] md:leading-[30px]">
              Page: FAQ
            </h1>
            <SaveButton onClick={handleSave} isSaving={saveMutation.isPending} />
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
                    key={faq.id}
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
              <SaveButton onClick={handleSave} isSaving={saveMutation.isPending} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
