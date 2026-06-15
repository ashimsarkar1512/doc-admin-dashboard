import { axiosInstance } from '@/api/axiosInstance';
import type { HomepageContentResponse, HomepageFormState, HowItWorksStepForm, FaqForm } from '../../features/website-management/types/homepage.types';

const BASE = '/admin/homepage-content';

// ─── GET ────────────────────────────────────────────────────────────────────

export async function getHomepageContent(): Promise<HomepageContentResponse> {
  const { data } = await axiosInstance.get<HomepageContentResponse>(BASE);
  return data;
}

// ─── PATCH ──────────────────────────────────────────────────────────────────
// The API expects multipart/form-data because it accepts binary image files.
// We build a FormData object and only append fields that have changed.

function appendSteps(fd: FormData, steps: HowItWorksStepForm[]) {
  steps.forEach((step, i) => {
    if (step.id) fd.append(`howItWorksSteps[${i}][id]`, step.id);
    fd.append(`howItWorksSteps[${i}][title]`, step.title);
    fd.append(`howItWorksSteps[${i}][description]`, step.description);
    // omitted 'order' to prevent "@IsInt()" failure on strings
  });
}

function appendFaqs(fd: FormData, faqs: FaqForm[]) {
  faqs.forEach((faq, i) => {
    if (faq.id) fd.append(`faqs[${i}][id]`, faq.id);
    fd.append(`faqs[${i}][question]`, faq.question);
    fd.append(`faqs[${i}][answer]`, faq.answer);
    // omitted 'order' to prevent "@IsInt()" failure on strings
  });
}

export async function patchHomepageContent(
  form: HomepageFormState,
  heroImage?: File | null,
  heroBadgeImage?: File | null,
): Promise<HomepageContentResponse> {
  const fd = new FormData();

  // Binary files (only when user picked a new file)
  if (heroImage) fd.append('heroImage', heroImage);
  if (heroBadgeImage) fd.append('heroBadgeImage', heroBadgeImage);

  // Scalar text / boolean fields
  const scalars: Array<[string, string | boolean]> = [
    ['heroBadgeText', form.heroBadgeText],
    ['heroBadgeLink', form.heroBadgeLink],
    ['heroTitle', form.heroTitle],
    ['heroDescription', form.heroDescription],
    ['heroButtonText', form.heroButtonText],
    ['heroButtonLink', form.heroButtonLink],
    ['heroButtonNewTab', form.heroButtonNewTab],
    ['bannerTitle', form.bannerTitle],
    ['bannerDescription', form.bannerDescription],
    ['aboutSubtitle', form.aboutSubtitle],
    ['aboutTitle', form.aboutTitle],
    ['aboutDescription', form.aboutDescription],
    ['aboutPrimaryButtonText', form.aboutPrimaryButtonText],
    ['aboutPrimaryButtonLink', form.aboutPrimaryButtonLink],
    ['aboutPrimaryButtonNewTab', form.aboutPrimaryButtonNewTab],
    ['aboutSecondaryButtonText', form.aboutSecondaryButtonText],
    ['aboutSecondaryButtonLink', form.aboutSecondaryButtonLink],
    ['aboutSecondaryButtonNewTab', form.aboutSecondaryButtonNewTab],
    ['productTitle', form.productTitle],
    ['productButtonLink', form.productButtonLink],
    ['productButtonNewTab', form.productButtonNewTab],
    ['howItWorksTitle', form.howItWorksTitle],
    ['testimonialTitle', form.testimonialTitle],
    ['testimonialSubtitle', form.testimonialSubtitle],
    ['testimonialDescription', form.testimonialDescription],
    ['testimonialButtonLink', form.testimonialButtonLink],
    ['testimonialButtonNewTab', form.testimonialButtonNewTab],
    ['pricingTitle', form.pricingTitle],
    ['pricingSubtitle', form.pricingSubtitle],
    ['pricingDescription', form.pricingDescription],
    ['pricingButtonLink', form.pricingButtonLink],
    ['pricingButtonNewTab', form.pricingButtonNewTab],
  ];

  scalars.forEach(([key, value]) => fd.append(key, String(value)));

  // Arrays
  form.aboutBullets.forEach((b) => fd.append('aboutBullets', b));
  appendSteps(fd, form.howItWorksSteps);
  appendFaqs(fd, form.faqs);

  const { data } = await axiosInstance.patch<HomepageContentResponse>(BASE, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
