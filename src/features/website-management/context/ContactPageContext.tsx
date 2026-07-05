import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getHeroSections, updateHeroSection } from "@/api/endpoints/hero-section.api";
import { getContactSideWidget, updateContactSideWidget, getContactPartnerSection, updateContactPartnerSection } from "@/api/endpoints/contact-page.api";
import { uploadAttachment, uploadMultipleAttachments, deleteAttachment } from "@/api/endpoints/attachments.api";

const CONTACT_HERO_QUERY_KEY = ["admin", "contact-page", "hero"];
const CONTACT_WIDGET_QUERY_KEY = ["admin", "contact-page", "widget"];
const CONTACT_PARTNERS_QUERY_KEY = ["admin", "contact-page", "partners"];

export interface PartnerItem {
  id: string; // Internal unique ID for the frontend list
  imageId: string; // The ID of the uploaded attachment
  imageUrl: string; // URL for preview
  file: File | null; // The actual file if it's newly uploaded
  isNew: boolean; // Flag to indicate if it hasn't been saved to backend yet
}

export interface ContactPageFormState {
  // Hero Section
  heroId: string;
  heroTitle: string;
  heroDescription: string;
  
  // Widget Section
  widgetId: string;
  widgetTitle: string;
  widgetOpening: string;
  widgetOffDay: string;
  widgetPhone: string;
  widgetEmail: string;
  widgetImageId: string;
  widgetImageUrl: string;
  widgetImageName: string;

  // Partners Section
  partnersSectionId: string;
  partnersSectionTitle: string;
  partners: PartnerItem[];
}

const EMPTY_FORM: ContactPageFormState = {
  heroId: "",
  heroTitle: "",
  heroDescription: "",
  widgetId: "",
  widgetTitle: "",
  widgetOpening: "",
  widgetOffDay: "",
  widgetPhone: "",
  widgetEmail: "",
  widgetImageId: "",
  widgetImageUrl: "",
  widgetImageName: "",
  partnersSectionId: "",
  partnersSectionTitle: "",
  partners: [],
};

interface ContactPageContextValue {
  form: ContactPageFormState;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  setField: <K extends keyof ContactPageFormState>(key: K, value: ContactPageFormState[K]) => void;
  save: () => void;
  widgetImageRef: React.MutableRefObject<File | null>;
  addPartners: (files: File[]) => void;
  removePartner: (partnerId: string) => void;
}

const ContactPageContext = createContext<ContactPageContextValue | null>(null);

export function ContactPageProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ContactPageFormState>(EMPTY_FORM);
  const [isDirty, setIsDirty] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const widgetImageRef = useRef<File | null>(null);

  // Fetch Hero
  const { data: heroData, isLoading: isLoadingHero } = useQuery({
    queryKey: CONTACT_HERO_QUERY_KEY,
    queryFn: () => getHeroSections("ContactUs"),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch Widget
  const { data: widgetData, isLoading: isLoadingWidget } = useQuery({
    queryKey: CONTACT_WIDGET_QUERY_KEY,
    queryFn: getContactSideWidget,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch Partners
  const { data: partnersData, isLoading: isLoadingPartners } = useQuery({
    queryKey: CONTACT_PARTNERS_QUERY_KEY,
    queryFn: getContactPartnerSection,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = isLoadingHero || isLoadingWidget || isLoadingPartners;

  const initForm = useCallback(() => {
    if (!heroData?.data || !widgetData?.data || !partnersData?.data) return;

    const hero = Array.isArray(heroData.data) ? heroData.data[0] : heroData.data;
    const widget = widgetData.data;
    const partnersSection = partnersData.data;

    setForm({
      heroId: hero?.id || "",
      heroTitle: hero?.title || "",
      heroDescription: hero?.description || "",
      widgetId: widget?.id || "",
      widgetTitle: widget?.title || "",
      widgetOpening: widget?.opening || "",
      widgetOffDay: widget?.offDay || "",
      widgetPhone: widget?.phone || "",
      widgetEmail: widget?.email || "",
      widgetImageId: widget?.imageId || "",
      widgetImageUrl: widget?.image?.fileUrl || "",
      widgetImageName: widget?.image?.fileName || "Uploaded Image",
      partnersSectionId: partnersSection?.id || "",
      partnersSectionTitle: partnersSection?.sectionTitle || "",
      partners: (Array.isArray(partnersSection?.partners) 
        ? partnersSection.partners 
        : (partnersSection?.partners ? [partnersSection.partners] : [])
      ).map((p: any) => ({
        id: crypto.randomUUID(),
        imageId: p.imageId,
        imageUrl: p.image?.fileUrl || "",
        file: null,
        isNew: false
      })),
    });
    setIsInitialized(true);
    setIsDirty(false);
  }, [heroData, widgetData, partnersData]);

  // Seed form state when all data arrives
  useEffect(() => {
    if (heroData?.data && widgetData?.data && partnersData?.data && !isInitialized) {
      setTimeout(initForm, 0);
    }
  }, [heroData, widgetData, partnersData, isInitialized, initForm]);

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const promises: Promise<any>[] = [];

      // Update Hero
      if (form.heroId) {
        promises.push(
          updateHeroSection(form.heroId, {
            page: "ContactUs",
            title: form.heroTitle,
            description: form.heroDescription,
          })
        );
      }

      // Update Widget
      let finalWidgetImageId = form.widgetImageId;
      if (widgetImageRef.current) {
        const { id } = await uploadAttachment(widgetImageRef.current, "OTHERS");
        finalWidgetImageId = id;
      }
      
      if (form.widgetId || form.widgetTitle) {
        promises.push(
          updateContactSideWidget({
            title: form.widgetTitle,
            opening: form.widgetOpening,
            offDay: form.widgetOffDay,
            phone: form.widgetPhone,
            email: form.widgetEmail,
            imageId: finalWidgetImageId || null,
          })
        );
      }

      // Update Partners
      const finalPartnerImageIds: string[] = [];
      const newFiles = form.partners.filter(p => p.file && p.isNew).map(p => p.file as File);
      
      let uploadedNewImageIds: string[] = [];
      if (newFiles.length > 0) {
        const responses = await uploadMultipleAttachments(newFiles, "OTHERS");
        uploadedNewImageIds = responses.map(res => res.id);
      }

      let newFileIndex = 0;
      form.partners.forEach(p => {
        if (p.isNew && p.file) {
          finalPartnerImageIds.push(uploadedNewImageIds[newFileIndex]);
          newFileIndex++;
        } else if (p.imageId) {
          finalPartnerImageIds.push(p.imageId);
        }
      });

      if (form.partnersSectionId || form.partnersSectionTitle) {
        promises.push(
          updateContactPartnerSection({
            sectionTitle: form.partnersSectionTitle,
            imageIds: finalPartnerImageIds,
          })
        );
      }

      await Promise.all(promises);
    },
    onSuccess: async () => {
      toast.success("Contact page updated successfully");
      setIsDirty(false);
      widgetImageRef.current = null;
      
      // Invalidate queries to mark cache as stale and trigger a background refetch
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: CONTACT_HERO_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: CONTACT_WIDGET_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: CONTACT_PARTNERS_QUERY_KEY })
      ]);
      
      // Fetch fresh data (now that cache is stale, this will wait for the network request to finish)
      const [newHeroRes, newWidgetRes, newPartnersRes] = await Promise.all([
        queryClient.fetchQuery({ queryKey: CONTACT_HERO_QUERY_KEY, queryFn: () => getHeroSections("ContactUs") }),
        queryClient.fetchQuery({ queryKey: CONTACT_WIDGET_QUERY_KEY, queryFn: getContactSideWidget }),
        queryClient.fetchQuery({ queryKey: CONTACT_PARTNERS_QUERY_KEY, queryFn: getContactPartnerSection })
      ]);
      
      const hero = Array.isArray(newHeroRes.data) ? newHeroRes.data[0] : newHeroRes.data;
      const widget = newWidgetRes.data;
      const partnersSection = newPartnersRes.data;
      
      setForm({
        heroId: hero?.id || "",
        heroTitle: hero?.title || "",
        heroDescription: hero?.description || "",
        widgetId: widget?.id || "",
        widgetTitle: widget?.title || "",
        widgetOpening: widget?.opening || "",
        widgetOffDay: widget?.offDay || "",
        widgetPhone: widget?.phone || "",
        widgetEmail: widget?.email || "",
        widgetImageId: widget?.imageId || "",
        widgetImageUrl: widget?.image?.fileUrl || "",
        widgetImageName: widget?.image?.fileName || "Uploaded Image",
        partnersSectionId: partnersSection?.id || "",
        partnersSectionTitle: partnersSection?.sectionTitle || "",
        partners: (Array.isArray(partnersSection?.partners) 
          ? partnersSection.partners 
          : (partnersSection?.partners ? [partnersSection.partners] : [])
        ).map((p: any) => ({
          id: crypto.randomUUID(),
          imageId: p.imageId,
          imageUrl: p.image?.fileUrl || "",
          file: null,
          isNew: false
        })),
      });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to save Contact page");
    },
  });

  const setField = useCallback(<K extends keyof ContactPageFormState>(key: K, value: ContactPageFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  }, []);

  const addPartners = useCallback((files: File[]) => {
    const newPartners = files.map(file => ({
      id: crypto.randomUUID(),
      imageId: "",
      imageUrl: URL.createObjectURL(file),
      file,
      isNew: true
    }));
    setForm(prev => ({ ...prev, partners: [...prev.partners, ...newPartners] }));
    setIsDirty(true);
  }, []);

  const removePartner = useCallback(async (partnerId: string) => {
    const partner = form.partners.find(p => p.id === partnerId);
    if (!partner) return;
    
    // If it has an existing imageId and is not new, delete it immediately from backend
    if (!partner.isNew && partner.imageId) {
      try {
        await deleteAttachment(partner.imageId);
        // Continue removing from local state
      } catch (err) {
        toast.error("Failed to delete image from server.");
        return;
      }
    }
    
    setForm(prev => ({ ...prev, partners: prev.partners.filter(p => p.id !== partnerId) }));
    setIsDirty(true);
  }, [form.partners]);

  return (
    <ContactPageContext.Provider
      value={{
        form,
        isLoading,
        isSaving,
        isDirty,
        setField,
        save: () => save(),
        widgetImageRef,
        addPartners,
        removePartner
      }}
    >
      {children}
    </ContactPageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useContactPageContext() {
  const context = useContext(ContactPageContext);
  if (!context) {
    throw new Error("useContactPageContext must be used within a ContactPageProvider");
  }
  return context;
}
