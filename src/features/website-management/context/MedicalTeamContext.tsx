import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  getMedicalTeamSection,
  updateMedicalTeamSection,
} from "@/api/endpoints/medical-team.api";

const MEDICAL_TEAM_HERO_QUERY_KEY = ["admin", "medical-team", "hero"];
const MEDICAL_TEAM_CTA_QUERY_KEY = ["admin", "medical-team", "cta"];
const MEDICAL_TEAM_PROVIDER_QUERY_KEY = ["admin", "medical-team", "provider"];

export interface MedicalTeamFormState {
  // Hero Section
  heroId: string;
  heroTitle: string;
  heroDescription: string;

  // Provider Section
  providerId: string;
  providerTitle: string;
  providerDescription: string;

  // CTA Section
  ctaId: string;
  ctaTitle: string;
  ctaButtonText: string;
  ctaUrl: string;
  ctaNewTab: boolean;
}

const EMPTY_FORM: MedicalTeamFormState = {
  heroId: "",
  heroTitle: "",
  heroDescription: "",
  providerId: "",
  providerTitle: "",
  providerDescription: "",
  ctaId: "",
  ctaTitle: "",
  ctaButtonText: "",
  ctaUrl: "",
  ctaNewTab: true,
};

interface MedicalTeamContextValue {
  form: MedicalTeamFormState;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  setField: <K extends keyof MedicalTeamFormState>(
    key: K,
    value: MedicalTeamFormState[K],
  ) => void;
  save: () => void;
}

const MedicalTeamContext = createContext<MedicalTeamContextValue | null>(null);

export function MedicalTeamProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<MedicalTeamFormState>(EMPTY_FORM);
  const [isDirty, setIsDirty] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch Hero
  const { data: heroData, isLoading: isLoadingHero } = useQuery({
    queryKey: MEDICAL_TEAM_HERO_QUERY_KEY,
    queryFn: () => getHeroSectionByPage("MedicalTeam"),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch Provider
  const { data: providerData, isLoading: isLoadingProvider } = useQuery({
    queryKey: MEDICAL_TEAM_PROVIDER_QUERY_KEY,
    queryFn: getMedicalTeamSection,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch CTA
  const { data: ctaData, isLoading: isLoadingCta } = useQuery({
    queryKey: MEDICAL_TEAM_CTA_QUERY_KEY,
    queryFn: () => getCtaSections("MedicalTeam"),
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = isLoadingHero || isLoadingProvider || isLoadingCta;

  const initForm = useCallback(() => {
    if (!heroData || !providerData?.data || !ctaData?.data) return;

    const hero = Array.isArray(heroData) ? heroData[0] : heroData;
    const cta = Array.isArray(ctaData.data) ? ctaData.data[0] : ctaData.data;
    const provider = providerData.data;

    setForm({
      heroId: hero?.id || "",
      heroTitle: hero?.title || "",
      heroDescription: hero?.description || "",
      providerId: provider?.id || "",
      providerTitle: provider?.title || "",
      providerDescription: provider?.description || "",
      ctaId: cta?.id || "",
      ctaTitle: cta?.sectionTitle || "",
      ctaButtonText: cta?.ctaButtonText || "",
      ctaUrl: cta?.url || "",
      ctaNewTab: cta?.openInNewTab ?? true,
    });
    setIsInitialized(true);
    setIsDirty(false);
  }, [heroData, providerData, ctaData]);

  // Seed form state when all data arrives
  useEffect(() => {
    if (
      heroData &&
      providerData?.data &&
      ctaData?.data &&
      !isInitialized
    ) {
      setTimeout(initForm, 0);
    }
  }, [heroData, providerData, ctaData, isInitialized, initForm]);

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const promises: Promise<any>[] = [];

      // Update Hero
      if (form.heroId) {
        promises.push(
          updateHeroSection(form.heroId, {
            page: "MedicalTeam",
            title: form.heroTitle,
            description: form.heroDescription,
          }),
        );
      }

      // Update Provider
      if (form.providerId || form.providerTitle || form.providerDescription) {
        promises.push(
          updateMedicalTeamSection({
            title: form.providerTitle,
            description: form.providerDescription,
          }),
        );
      }

      // Update CTA
      if (form.ctaId) {
        promises.push(
          updateCtaSection(form.ctaId, {
            page: "MedicalTeam",
            sectionTitle: form.ctaTitle,
            ctaButtonText: form.ctaButtonText,
            url: form.ctaUrl,
            openInNewTab: form.ctaNewTab,
            categoryId: undefined,
          }),
        );
      }

      await Promise.all(promises);
    },
    onSuccess: async () => {
      toast.success("Medical Team page updated successfully");
      setIsDirty(false);
      
      // Invalidate queries to mark cache as stale and trigger a background refetch
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: MEDICAL_TEAM_HERO_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: MEDICAL_TEAM_PROVIDER_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: MEDICAL_TEAM_CTA_QUERY_KEY })
      ]);
      
      const [newHeroRes, newProviderRes, newCtaRes] = await Promise.all([
        queryClient.fetchQuery({ queryKey: MEDICAL_TEAM_HERO_QUERY_KEY, queryFn: () => getHeroSectionByPage("MedicalTeam") }),
        queryClient.fetchQuery({ queryKey: MEDICAL_TEAM_PROVIDER_QUERY_KEY, queryFn: getMedicalTeamSection }),
        queryClient.fetchQuery({ queryKey: MEDICAL_TEAM_CTA_QUERY_KEY, queryFn: () => getCtaSections("MedicalTeam") }),
      ]);

      const hero = Array.isArray(newHeroRes) ? newHeroRes[0] : newHeroRes;
      const cta = Array.isArray(newCtaRes.data) ? newCtaRes.data[0] : newCtaRes.data;
      const provider = newProviderRes.data;

      setForm({
        heroId: hero?.id || "",
        heroTitle: hero?.title || "",
        heroDescription: hero?.description || "",
        providerId: provider?.id || "",
        providerTitle: provider?.title || "",
        providerDescription: provider?.description || "",
        ctaId: cta?.id || "",
        ctaTitle: cta?.sectionTitle || "",
        ctaButtonText: cta?.ctaButtonText || "",
        ctaUrl: cta?.url || "",
        ctaNewTab: cta?.openInNewTab ?? true,
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to save Medical Team page");
    },
  });

  const setField = <K extends keyof MedicalTeamFormState>(
    key: K,
    value: MedicalTeamFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  return (
    <MedicalTeamContext.Provider
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
    </MedicalTeamContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMedicalTeamContext() {
  const context = useContext(MedicalTeamContext);
  if (!context) {
    throw new Error(
      "useMedicalTeamContext must be used within a MedicalTeamProvider",
    );
  }
  return context;
}
