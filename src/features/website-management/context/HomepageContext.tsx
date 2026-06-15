import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getHomepageContent, patchHomepageContent } from '@/api/endpoints/homepage.api';
import { normaliseHomepage } from '../types/homepage.types';
import type { HomepageFormState, HowItWorksStepForm, FaqForm } from '../types/homepage.types';

// ─── Query key (centralised for cache invalidation) ─────────────────────────
export const HOMEPAGE_QUERY_KEY = ['admin', 'homepage-content'] as const;

// ─── Context shape ──────────────────────────────────────────────────────────
interface HomepageContextValue {
  form: HomepageFormState;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  setField: <K extends keyof HomepageFormState>(key: K, value: HomepageFormState[K]) => void;
  heroImageRef: React.MutableRefObject<File | null>;
  heroBadgeImageRef: React.MutableRefObject<File | null>;
  updateStep: (index: number, partial: Partial<HowItWorksStepForm>) => void;
  addStep: () => void;
  removeStep: (index: number) => void;
  updateFaq: (index: number, partial: Partial<FaqForm>) => void;
  addFaq: () => void;
  removeFaq: (index: number) => void;
  updateBullet: (index: number, value: string) => void;
  addBullet: () => void;
  removeBullet: (index: number) => void;
  save: () => void;
}

const HomepageContext = createContext<HomepageContextValue | null>(null);

// ─── Default empty state ─────────────────────────────────────────────────────
const EMPTY: HomepageFormState = {
  heroImageUrl: '', heroBadgeImageUrl: '', heroBadgeText: '', heroBadgeLink: '',
  heroTitle: '', heroDescription: '', heroButtonText: '', heroButtonLink: '', heroButtonNewTab: true,
  bannerTitle: '', bannerDescription: '',
  aboutSubtitle: '', aboutTitle: '', aboutDescription: '',
  aboutPrimaryButtonText: '', aboutPrimaryButtonLink: '', aboutPrimaryButtonNewTab: true,
  aboutSecondaryButtonText: '', aboutSecondaryButtonLink: '', aboutSecondaryButtonNewTab: true,
  aboutBullets: [],
  productTitle: '', productButtonLink: '', productButtonNewTab: true,
  howItWorksTitle: '', howItWorksSteps: [],
  testimonialTitle: '', testimonialSubtitle: '', testimonialDescription: '',
  testimonialButtonLink: '', testimonialButtonNewTab: true,
  pricingTitle: '', pricingSubtitle: '', pricingDescription: '',
  pricingButtonLink: '', pricingButtonNewTab: true,
  faqs: [],
};

// ─── Provider ────────────────────────────────────────────────────────────────
export function HomepageProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<HomepageFormState>(EMPTY);
  const [isDirty, setIsDirty] = useState(false);
  // Track if we've seeded the form from server data
  const seededRef = useRef(false);

  const heroImageRef = useRef<File | null>(null);
  const heroBadgeImageRef = useRef<File | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const { data: serverData, isLoading } = useQuery({
    queryKey: HOMEPAGE_QUERY_KEY,
    queryFn: getHomepageContent,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Seed form once when server data arrives (not on every re-render)
  useEffect(() => {
    if (serverData && !seededRef.current) {
      seededRef.current = true;
      setForm(normaliseHomepage(serverData));
      setIsDirty(false);
    }
  }, [serverData]);

  // ── Mutation ──────────────────────────────────────────────────────────────
  const { mutate, isPending: isSaving } = useMutation({
    mutationFn: () =>
      patchHomepageContent(form, heroImageRef.current, heroBadgeImageRef.current),
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

  const updateStep = useCallback((index: number, partial: Partial<HowItWorksStepForm>) => {
    setForm((prev) => {
      const steps = [...prev.howItWorksSteps];
      steps[index] = { ...steps[index], ...partial };
      return { ...prev, howItWorksSteps: steps };
    });
    setIsDirty(true);
  }, []);

  const addStep = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      howItWorksSteps: [
        ...prev.howItWorksSteps,
        { title: '', description: '', order: prev.howItWorksSteps.length },
      ],
    }));
    setIsDirty(true);
  }, []);

  const removeStep = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      howItWorksSteps: prev.howItWorksSteps
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, order: i })),
    }));
    setIsDirty(true);
  }, []);

  const updateFaq = useCallback((index: number, partial: Partial<FaqForm>) => {
    setForm((prev) => {
      const faqs = [...prev.faqs];
      faqs[index] = { ...faqs[index], ...partial };
      return { ...prev, faqs };
    });
    setIsDirty(true);
  }, []);

  const addFaq = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '', order: prev.faqs.length }],
    }));
    setIsDirty(true);
  }, []);

  const removeFaq = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      faqs: prev.faqs
        .filter((_, i) => i !== index)
        .map((f, i) => ({ ...f, order: i })),
    }));
    setIsDirty(true);
  }, []);

  const updateBullet = useCallback((index: number, value: string) => {
    setForm((prev) => {
      const bullets = [...prev.aboutBullets];
      bullets[index] = value;
      return { ...prev, aboutBullets: bullets };
    });
    setIsDirty(true);
  }, []);

  const addBullet = useCallback(() => {
    setForm((prev) => ({ ...prev, aboutBullets: [...prev.aboutBullets, ''] }));
    setIsDirty(true);
  }, []);

  const removeBullet = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      aboutBullets: prev.aboutBullets.filter((_, i) => i !== index),
    }));
    setIsDirty(true);
  }, []);

  const save = useCallback(() => mutate(), [mutate]);

  return (
    <HomepageContext.Provider
      value={{
        form, isLoading, isSaving, isDirty,
        setField,
        heroImageRef, heroBadgeImageRef,
        updateStep, addStep, removeStep,
        updateFaq, addFaq, removeFaq,
        updateBullet, addBullet, removeBullet,
        save,
      }}
    >
      {children}
    </HomepageContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useHomepage() {
  const ctx = useContext(HomepageContext);
  if (!ctx) throw new Error('useHomepage must be used inside <HomepageProvider>');
  return ctx;
}
