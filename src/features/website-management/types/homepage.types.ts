// ─── Raw API types (nullable {} fields from API) ──────────────────────────────

export interface HowItWorksStep {
  id: string;
  homePageContentId: string;
  title: string;
  description: string | null;
  iconUrl: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Faq {
  id: string;
  homePageContentId: string;
  question: string;
  answer: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// The API returns nullable `{}` for optional string fields — we normalise to string
export interface HomepageContentResponse {
  id: string;
  heroImageUrl: string | null;
  heroBadgeImageUrl: string | null;
  heroBadgeText: string | null;
  heroBadgeLink: string | null;
  heroTitle: string | null;
  heroDescription: string | null;
  heroButtonText: string | null;
  heroButtonLink: string | null;
  heroButtonNewTab: boolean;
  bannerTitle: string | null;
  bannerDescription: string | null;
  aboutSubtitle: string | null;
  aboutTitle: string | null;
  aboutDescription: string | null;
  aboutPrimaryButtonText: string | null;
  aboutPrimaryButtonLink: string | null;
  aboutPrimaryButtonNewTab: boolean;
  aboutSecondaryButtonText: string | null;
  aboutSecondaryButtonLink: string | null;
  aboutSecondaryButtonNewTab: boolean;
  aboutBullets: string[];
  productTitle: string | null;
  productButtonLink: string | null;
  productButtonNewTab: boolean;
  howItWorksTitle: string | null;
  howItWorksSteps: HowItWorksStep[];
  testimonialTitle: string | null;
  testimonialSubtitle: string | null;
  testimonialDescription: string | null;
  testimonialButtonLink: string | null;
  testimonialButtonNewTab: boolean;
  pricingTitle: string | null;
  pricingSubtitle: string | null;
  pricingDescription: string | null;
  pricingButtonLink: string | null;
  pricingButtonNewTab: boolean;
  faqs: Faq[];
  createdAt: string;
  updatedAt: string;
}

// ─── Normalised form state (strings guaranteed, never null) ──────────────────

export interface HowItWorksStepForm {
  id?: string;           // undefined for newly added items
  title: string;
  description: string;
  iconUrl?: string;
  order: number;
}

export interface FaqForm {
  id?: string;           // undefined for newly added items
  question: string;
  answer: string;
  order: number;
}

export interface HomepageFormState {
  // Hero
  heroImageUrl: string;
  heroBadgeImageUrl: string;
  heroBadgeText: string;
  heroBadgeLink: string;
  heroTitle: string;
  heroDescription: string;
  heroButtonText: string;
  heroButtonLink: string;
  heroButtonNewTab: boolean;
  // Banner
  bannerTitle: string;
  bannerDescription: string;
  // About
  aboutSubtitle: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutPrimaryButtonText: string;
  aboutPrimaryButtonLink: string;
  aboutPrimaryButtonNewTab: boolean;
  aboutSecondaryButtonText: string;
  aboutSecondaryButtonLink: string;
  aboutSecondaryButtonNewTab: boolean;
  aboutBullets: string[];
  // Product
  productTitle: string;
  productButtonLink: string;
  productButtonNewTab: boolean;
  // How It Works
  howItWorksTitle: string;
  howItWorksSteps: HowItWorksStepForm[];
  // Testimonial
  testimonialTitle: string;
  testimonialSubtitle: string;
  testimonialDescription: string;
  testimonialButtonLink: string;
  testimonialButtonNewTab: boolean;
  // Pricing
  pricingTitle: string;
  pricingSubtitle: string;
  pricingDescription: string;
  pricingButtonLink: string;
  pricingButtonNewTab: boolean;
  // FAQ
  faqs: FaqForm[];
}

// ─── Helper: normalize API response → form state ─────────────────────────────

const str = (v: unknown): string => (v && typeof v === 'string' ? v : '');
const bool = (v: unknown, fallback = false): boolean =>
  typeof v === 'boolean' ? v : fallback;

export function normaliseHomepage(data: HomepageContentResponse): HomepageFormState {
  return {
    heroImageUrl: str(data.heroImageUrl),
    heroBadgeImageUrl: str(data.heroBadgeImageUrl),
    heroBadgeText: str(data.heroBadgeText),
    heroBadgeLink: str(data.heroBadgeLink),
    heroTitle: str(data.heroTitle),
    heroDescription: str(data.heroDescription),
    heroButtonText: str(data.heroButtonText),
    heroButtonLink: str(data.heroButtonLink),
    heroButtonNewTab: bool(data.heroButtonNewTab, true),
    bannerTitle: str(data.bannerTitle),
    bannerDescription: str(data.bannerDescription),
    aboutSubtitle: str(data.aboutSubtitle),
    aboutTitle: str(data.aboutTitle),
    aboutDescription: str(data.aboutDescription),
    aboutPrimaryButtonText: str(data.aboutPrimaryButtonText),
    aboutPrimaryButtonLink: str(data.aboutPrimaryButtonLink),
    aboutPrimaryButtonNewTab: bool(data.aboutPrimaryButtonNewTab, true),
    aboutSecondaryButtonText: str(data.aboutSecondaryButtonText),
    aboutSecondaryButtonLink: str(data.aboutSecondaryButtonLink),
    aboutSecondaryButtonNewTab: bool(data.aboutSecondaryButtonNewTab, true),
    aboutBullets: Array.isArray(data.aboutBullets) ? data.aboutBullets : [],
    productTitle: str(data.productTitle),
    productButtonLink: str(data.productButtonLink),
    productButtonNewTab: bool(data.productButtonNewTab, true),
    howItWorksTitle: str(data.howItWorksTitle),
    howItWorksSteps: (data.howItWorksSteps ?? [])
      .sort((a, b) => a.order - b.order)
      .map((s) => ({
        id: s.id,
        title: s.title,
        description: str(s.description),
        iconUrl: str(s.iconUrl),
        order: s.order,
      })),
    testimonialTitle: str(data.testimonialTitle),
    testimonialSubtitle: str(data.testimonialSubtitle),
    testimonialDescription: str(data.testimonialDescription),
    testimonialButtonLink: str(data.testimonialButtonLink),
    testimonialButtonNewTab: bool(data.testimonialButtonNewTab, true),
    pricingTitle: str(data.pricingTitle),
    pricingSubtitle: str(data.pricingSubtitle),
    pricingDescription: str(data.pricingDescription),
    pricingButtonLink: str(data.pricingButtonLink),
    pricingButtonNewTab: bool(data.pricingButtonNewTab, true),
    faqs: (data.faqs ?? [])
      .sort((a, b) => a.order - b.order)
      .map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        order: f.order,
      })),
  };
}
