import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getHomepageContent, 
  uploadAttachment,
  updateHeroSection,
  updateAssessmentSection,
  updateAboutSection,
  updateProvidersSection,
  updateHowItWorksSection,
  updateTestimonialSection,
  updateFaqSection
} from '@/api/endpoints/homepage.api';
import { normaliseHomepage } from '../types/homepage.types';
import type { HomepageFormState } from '../types/homepage.types';

export const HOMEPAGE_QUERY_KEY = ['admin', 'homepage-content'] as const;

interface HomepageContextValue {
  form: HomepageFormState;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  setField: <K extends keyof HomepageFormState>(key: K, value: HomepageFormState[K]) => void;
  heroImageRef: React.MutableRefObject<File | null>;
  heroBadgeImageRef: React.MutableRefObject<File | null>;
  aboutMediaRef: React.MutableRefObject<File | null>;
  faqCardMediaRef: React.MutableRefObject<File | null>;
  save: () => void;
}

const HomepageContext = createContext<HomepageContextValue | null>(null);

const EMPTY: HomepageFormState = {
  heroMediaId: '', heroMediaUrl: '',
  heroBadgeImageId: '', heroBadgeImageUrl: '',
  heroTitle: '', heroDescription: '', heroButtonText: '', heroButtonLink: '', heroButtonNewTab: true,
  assessmentTitle: '', assessmentDescription: '',
  aboutTitle: '', aboutDescription: '',
  aboutFeaturedService1Id: '', aboutFeaturedService2Id: '', aboutFeaturedService3Id: '',
  aboutButtonText: '', aboutButtonLink: '', aboutButtonNewTab: true,
  aboutMediaId: '', aboutMediaUrl: '',
  providersTitle: '', providersButtonText: '', providersButtonLink: '', providersButtonNewTab: true,
  howItWorksTitle: '',
  howItWorksStep1Title: '', howItWorksStep1Description: '',
  howItWorksStep2Title: '', howItWorksStep2Description: '',
  howItWorksStep3Title: '', howItWorksStep3Description: '',
  howItWorksStep4Title: '', howItWorksStep4Description: '',
  testimonialTitle: '', testimonialCardTitle: '', testimonialCardDescription: '',
  testimonialButtonText: '', testimonialButtonLink: '', testimonialButtonNewTab: true,
  faqTitle: '', faqCardTitle: '', faqCardDescription: '', faqButtonText: '', faqButtonLink: '', faqButtonNewTab: true,
  faqCardMediaId: '', faqCardMediaUrl: '',
  faqQuestion1: '', faqAnswer1: '', faqQuestion2: '', faqAnswer2: '', faqQuestion3: '', faqAnswer3: '',
  faqQuestion4: '', faqAnswer4: '', faqQuestion5: '', faqAnswer5: '', faqQuestion6: '', faqAnswer6: '',
};

export function HomepageProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<HomepageFormState>(EMPTY);
  const [isDirty, setIsDirty] = useState(false);
  const seededRef = useRef(false);

  const heroImageRef = useRef<File | null>(null);
  const heroBadgeImageRef = useRef<File | null>(null);
  const aboutMediaRef = useRef<File | null>(null);
  const faqCardMediaRef = useRef<File | null>(null);

  const { data: serverData, isLoading } = useQuery({
    queryKey: HOMEPAGE_QUERY_KEY,
    queryFn: getHomepageContent,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (serverData && !seededRef.current) {
      seededRef.current = true;
      setForm(normaliseHomepage(serverData));
      setIsDirty(false);
    }
  }, [serverData]);

  const { mutate, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      let finalForm = { ...form };

      // Upload files if present
      if (heroImageRef.current) {
        const { id } = await uploadAttachment(heroImageRef.current, 'HERO_IMAGE');
        finalForm.heroMediaId = id;
      }
      if (heroBadgeImageRef.current) {
        const { id } = await uploadAttachment(heroBadgeImageRef.current, 'HERO_BADGE_IMAGE');
        finalForm.heroBadgeImageId = id;
      }
      if (aboutMediaRef.current) {
        const { id } = await uploadAttachment(aboutMediaRef.current, 'ABOUT_MEDIA');
        finalForm.aboutMediaId = id;
      }
      if (faqCardMediaRef.current) {
        const { id } = await uploadAttachment(faqCardMediaRef.current, 'FAQ_MEDIA');
        finalForm.faqCardMediaId = id;
      }

      // Execute all PUT requests concurrently
      await Promise.all([
        updateHeroSection(finalForm),
        updateAssessmentSection(finalForm),
        updateAboutSection(finalForm),
        updateProvidersSection(finalForm),
        updateHowItWorksSection(finalForm),
        updateTestimonialSection(finalForm),
        updateFaqSection(finalForm)
      ]);

      return getHomepageContent();
    },
    onSuccess: (updated) => {
      // Update cache + reset local form from server truth
      queryClient.setQueryData(HOMEPAGE_QUERY_KEY, updated);
      seededRef.current = false; // allow re-seed from new server data
      setForm(normaliseHomepage(updated));
      setIsDirty(false);
      heroImageRef.current = null;
      heroBadgeImageRef.current = null;
      toast.success('Homepage saved successfully!');
    },
    onError: () => {
      toast.error('Failed to save homepage. Please try again.');
    },
  });

  // ── Setters ───────────────────────────────────────────────────────────────
  const setField = useCallback(
    <K extends keyof HomepageFormState>(key: K, value: HomepageFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setIsDirty(true);
    },
    [],
  );

  const save = useCallback(() => mutate(), [mutate]);

  return (
    <HomepageContext.Provider
      value={{
        form, isLoading, isSaving, isDirty,
        setField,
        heroImageRef, heroBadgeImageRef, aboutMediaRef, faqCardMediaRef,
        save,
      }}
    >
      {children}
    </HomepageContext.Provider>
  );
}

export function useHomepage() {
  const ctx = useContext(HomepageContext);
  if (!ctx) throw new Error('useHomepage must be used inside <HomepageProvider>');
  return ctx;
}
