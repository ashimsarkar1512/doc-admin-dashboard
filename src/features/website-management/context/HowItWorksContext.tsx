import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getHeroSections, updateHeroSection } from "@/api/endpoints/hero-section.api";
import { getCtaSections, updateCtaSection } from "@/api/endpoints/cta-section.api";
import { getHowItWorksSection, updateHowItWorksSection } from "@/api/endpoints/how-it-works.api";
import type { HowItWorksStep, HowItWorksFaq } from "@/api/endpoints/how-it-works.api";

// Query Keys
const HOW_IT_WORKS_HERO_QUERY_KEY = ["admin", "how-it-works", "hero"];
const HOW_IT_WORKS_CONTENT_QUERY_KEY = ["admin", "how-it-works", "content"];
const HOW_IT_WORKS_CTA_QUERY_KEY = ["admin", "how-it-works", "cta"];

export interface StepItem extends HowItWorksStep {
  id: string; // for React mapping
}

export interface FaqItem extends HowItWorksFaq {
  id: string; // for React mapping
}

export interface HowItWorksFormState {
  // Hero Section
  heroId: string;
  heroTitle: string;
  heroDescription: string;
  
  // Journey Section
  sectionId: string;
  sectionTitle: string;
  sectionDescription: string;
  steps: StepItem[];

  // Disclaimer Section
  disclaimerTitle: string;
  disclaimerDescription: string;

  // FAQ Section
  faqSectionTitle: string;
  faqs: FaqItem[];

  // CTA Section
  ctaId: string;
  ctaTitle: string;
  ctaButtonText: string;
  ctaUrl: string;
  ctaNewTab: boolean;
}

const EMPTY_FORM: HowItWorksFormState = {
  heroId: "",
  heroTitle: "",
  heroDescription: "",
  sectionId: "",
  sectionTitle: "",
  sectionDescription: "",
  steps: [],
  disclaimerTitle: "",
  disclaimerDescription: "",
  faqSectionTitle: "",
  faqs: [],
  ctaId: "",
  ctaTitle: "",
  ctaButtonText: "",
  ctaUrl: "",
  ctaNewTab: true,
};

interface HowItWorksContextValue {
  form: HowItWorksFormState;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  setField: <K extends keyof HowItWorksFormState>(key: K, value: HowItWorksFormState[K]) => void;
  save: () => void;
}

const HowItWorksContext = createContext<HowItWorksContextValue | null>(null);

export function HowItWorksProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<HowItWorksFormState>(EMPTY_FORM);
  const [isDirty, setIsDirty] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch Hero
  const { data: heroData, isLoading: isLoadingHero } = useQuery({
    queryKey: HOW_IT_WORKS_HERO_QUERY_KEY,
    queryFn: () => getHeroSections("HowItWorks"),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch Main Content
  const { data: contentData, isLoading: isLoadingContent } = useQuery({
    queryKey: HOW_IT_WORKS_CONTENT_QUERY_KEY,
    queryFn: getHowItWorksSection,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch CTA
  const { data: ctaData, isLoading: isLoadingCta } = useQuery({
    queryKey: HOW_IT_WORKS_CTA_QUERY_KEY,
    queryFn: () => getCtaSections("HowItWorks"),
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = isLoadingHero || isLoadingContent || isLoadingCta;

  const initForm = useCallback(() => {
    if (!heroData?.data || !contentData?.data || !ctaData?.data) return;

    const hero = Array.isArray(heroData.data) ? heroData.data[0] : heroData.data;
    const content = contentData.data;
    const cta = Array.isArray(ctaData.data) ? ctaData.data[0] : ctaData.data;

    setForm({
      heroId: hero?.id || "",
      heroTitle: hero?.title || "",
      heroDescription: hero?.description || "",
      
      sectionId: content?.id || "",
      sectionTitle: content?.sectionTitle || "",
      sectionDescription: content?.sectionDescription || "",
      steps: (content?.steps || []).map(s => ({ ...s, id: crypto.randomUUID() })),
      
      disclaimerTitle: content?.disclaimerTitle || "",
      disclaimerDescription: content?.disclaimerDescription || "",
      
      faqSectionTitle: content?.faqSectionTitle || "",
      faqs: (content?.faqs || []).map(f => ({ ...f, id: crypto.randomUUID() })),

      ctaId: cta?.id || "",
      ctaTitle: cta?.sectionTitle || "",
      ctaButtonText: cta?.ctaButtonText || "",
      ctaUrl: cta?.url || "",
      ctaNewTab: cta?.openInNewTab ?? true,
    });
    setIsInitialized(true);
    setIsDirty(false);
  }, [heroData, contentData, ctaData]);

  // Seed form state when data arrives
  useEffect(() => {
    if (heroData?.data && contentData?.data && ctaData?.data && !isInitialized) {
      setTimeout(initForm, 0);
    }
  }, [heroData, contentData, ctaData, isInitialized, initForm]);

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const promises: Promise<any>[] = [];

      // Update Hero
      if (form.heroId) {
        promises.push(
          updateHeroSection(form.heroId, {
            page: "HowItWorks",
            title: form.heroTitle,
            description: form.heroDescription,
          })
        );
      }

      // Update Main Content
      if (form.sectionId || form.sectionTitle) {
        promises.push(
          updateHowItWorksSection({
            sectionTitle: form.sectionTitle,
            sectionDescription: form.sectionDescription,
            steps: form.steps.map(({ title, timeline, description }) => ({ title, timeline, description })),
            disclaimerTitle: form.disclaimerTitle,
            disclaimerDescription: form.disclaimerDescription,
            faqSectionTitle: form.faqSectionTitle,
            faqs: form.faqs.map(({ question, answer }) => ({ question, answer })),
          })
        );
      }

      // Update CTA
      if (form.ctaId) {
        promises.push(
          updateCtaSection(form.ctaId, {
            page: "HowItWorks",
            sectionTitle: form.ctaTitle,
            ctaButtonText: form.ctaButtonText,
            url: form.ctaUrl,
            openInNewTab: form.ctaNewTab,
            categoryId: undefined,
          })
        );
      }

      await Promise.all(promises);
    },
    onSuccess: async () => {
      toast.success("How It Works page updated successfully");
      setIsDirty(false);
      
      // Invalidate queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: HOW_IT_WORKS_HERO_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: HOW_IT_WORKS_CONTENT_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: HOW_IT_WORKS_CTA_QUERY_KEY })
      ]);
      
      // Fetch fresh data
      const [newHeroRes, newContentRes, newCtaRes] = await Promise.all([
        queryClient.fetchQuery({ queryKey: HOW_IT_WORKS_HERO_QUERY_KEY, queryFn: () => getHeroSections("HowItWorks") }),
        queryClient.fetchQuery({ queryKey: HOW_IT_WORKS_CONTENT_QUERY_KEY, queryFn: getHowItWorksSection }),
        queryClient.fetchQuery({ queryKey: HOW_IT_WORKS_CTA_QUERY_KEY, queryFn: () => getCtaSections("HowItWorks") })
      ]);
      
      const hero = Array.isArray(newHeroRes.data) ? newHeroRes.data[0] : newHeroRes.data;
      const content = newContentRes.data;
      const cta = Array.isArray(newCtaRes.data) ? newCtaRes.data[0] : newCtaRes.data;
      
      setForm({
        heroId: hero?.id || "",
        heroTitle: hero?.title || "",
        heroDescription: hero?.description || "",
        
        sectionId: content?.id || "",
        sectionTitle: content?.sectionTitle || "",
        sectionDescription: content?.sectionDescription || "",
        steps: (content?.steps || []).map(s => ({ ...s, id: crypto.randomUUID() })),
        
        disclaimerTitle: content?.disclaimerTitle || "",
        disclaimerDescription: content?.disclaimerDescription || "",
        
        faqSectionTitle: content?.faqSectionTitle || "",
        faqs: (content?.faqs || []).map(f => ({ ...f, id: crypto.randomUUID() })),

        ctaId: cta?.id || "",
        ctaTitle: cta?.sectionTitle || "",
        ctaButtonText: cta?.ctaButtonText || "",
        ctaUrl: cta?.url || "",
        ctaNewTab: cta?.openInNewTab ?? true,
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to save How It Works page");
    },
  });

  const setField = useCallback(<K extends keyof HowItWorksFormState>(key: K, value: HowItWorksFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  }, []);

  return (
    <HowItWorksContext.Provider
      value={{
        form,
        isLoading,
        isSaving,
        isDirty,
        setField,
        save: () => save(),
      }}
    >
      {children}
    </HowItWorksContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useHowItWorksContext() {
  const context = useContext(HowItWorksContext);
  if (!context) {
    throw new Error("useHowItWorksContext must be used within a HowItWorksProvider");
  }
  return context;
}
