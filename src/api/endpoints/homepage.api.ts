import { axiosInstance } from '@/api/axiosInstance';
import type { HomepageContentResponse, HomepageFormState } from '../../features/website-management/types/homepage.types';

const BASE = '/admin/homepage-content';
const getPublicBase = '/public/homepage-content' 
// ─── GET ────────────────────────────────────────────────────────────────────

export async function getHomepageContent(): Promise<HomepageContentResponse> {
  const { data } = await axiosInstance.get<any>(getPublicBase);
  return data.data;
}

// ─── POST (Upload) ──────────────────────────────────────────────────────────

export async function uploadAttachment(file: File, context: string): Promise<{ id: string }> {
  const fd = new FormData();
  fd.append('context', context);
  fd.append('files', file);

  const { data } = await axiosInstance.post<any>('/attachments/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  const result = data?.data;
  const id = Array.isArray(result) ? result[0]?.id : result?.id;
  
  if (!id) {
    throw new Error('Upload succeeded but no ID was returned');
  }
  
  return { id };
}

// ─── PUT (Sections) ─────────────────────────────────────────────────────────

export async function updateHeroSection(form: Partial<HomepageFormState>): Promise<void> {
  await axiosInstance.put(`${BASE}/hero`, {
    heroMediaId: form.heroMediaId || null,
    heroBadgeImageId: form.heroBadgeImageId || null,
    heroTitle: form.heroTitle,
    heroDescription: form.heroDescription,
    heroButtonText: form.heroButtonText,
    heroButtonLink: form.heroButtonLink,
    heroButtonNewTab: form.heroButtonNewTab,
  });
}

export async function updateAssessmentSection(form: Partial<HomepageFormState>): Promise<void> {
  await axiosInstance.put(`${BASE}/assessment`, {
    assessmentTitle: form.assessmentTitle,
    assessmentDescription: form.assessmentDescription,
  });
}

export async function updateAboutSection(form: Partial<HomepageFormState>): Promise<void> {
  await axiosInstance.put(`${BASE}/about`, {
    aboutTitle: form.aboutTitle,
    aboutDescription: form.aboutDescription,
    aboutFeaturedService1Id: form.aboutFeaturedService1Id || null,
    aboutFeaturedService2Id: form.aboutFeaturedService2Id || null,
    aboutFeaturedService3Id: form.aboutFeaturedService3Id || null,
    aboutButtonText: form.aboutButtonText,
    aboutButtonLink: form.aboutButtonLink,
    aboutButtonNewTab: form.aboutButtonNewTab,
    aboutMediaId: form.aboutMediaId || null,
  });
}

export async function updateProvidersSection(form: Partial<HomepageFormState>): Promise<void> {
  await axiosInstance.put(`${BASE}/providers`, {
    providersTitle: form.providersTitle,
    providersButtonText: form.providersButtonText,
    providersButtonLink: form.providersButtonLink,
    providersButtonNewTab: form.providersButtonNewTab,
  });
}

export async function updateHowItWorksSection(form: Partial<HomepageFormState>): Promise<void> {
  await axiosInstance.put(`${BASE}/how-it-works`, {
    howItWorksTitle: form.howItWorksTitle,
    howItWorksStep1Title: form.howItWorksStep1Title,
    howItWorksStep1Description: form.howItWorksStep1Description,
    howItWorksStep2Title: form.howItWorksStep2Title,
    howItWorksStep2Description: form.howItWorksStep2Description,
    howItWorksStep3Title: form.howItWorksStep3Title,
    howItWorksStep3Description: form.howItWorksStep3Description,
    howItWorksStep4Title: form.howItWorksStep4Title,
    howItWorksStep4Description: form.howItWorksStep4Description,
  });
}

export async function updateTestimonialSection(form: Partial<HomepageFormState>): Promise<void> {
  await axiosInstance.put(`${BASE}/testimonials`, {
    testimonialTitle: form.testimonialTitle,
    testimonialCardTitle: form.testimonialCardTitle,
    testimonialCardDescription: form.testimonialCardDescription,
    testimonialButtonText: form.testimonialButtonText,
    testimonialButtonLink: form.testimonialButtonLink,
    testimonialButtonNewTab: form.testimonialButtonNewTab,
  });
}

export async function updateFaqSection(form: Partial<HomepageFormState>): Promise<void> {
  await axiosInstance.put(`${BASE}/faq`, {
    faqTitle: form.faqTitle,
    faqCardTitle: form.faqCardTitle,
    faqCardDescription: form.faqCardDescription,
    faqButtonText: form.faqButtonText,
    faqButtonLink: form.faqButtonLink,
    faqButtonNewTab: form.faqButtonNewTab,
    faqCardMediaId: form.faqCardMediaId || null,
    faqQuestion1: form.faqQuestion1,
    faqAnswer1: form.faqAnswer1,
    faqQuestion2: form.faqQuestion2,
    faqAnswer2: form.faqAnswer2,
    faqQuestion3: form.faqQuestion3,
    faqAnswer3: form.faqAnswer3,
    faqQuestion4: form.faqQuestion4,
    faqAnswer4: form.faqAnswer4,
    faqQuestion5: form.faqQuestion5,
    faqAnswer5: form.faqAnswer5,
    faqQuestion6: form.faqQuestion6,
    faqAnswer6: form.faqAnswer6,
  });
}
