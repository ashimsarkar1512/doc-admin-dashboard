// ─── Raw API types (nullable {} fields from API) ──────────────────────────────

export interface FileMedia {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  context: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeaturedService {
  id: string;
  name: string;
  slug: string;
}

export interface HomepageContentResponse {
  id: string;
  heroMediaId: string | null;
  heroMedia: FileMedia | null;
  heroBadgeImageId: string | null;
  heroBadgeImage: FileMedia | null;
  heroTitle: string | null;
  heroDescription: string | null;
  heroButtonText: string | null;
  heroButtonLink: string | null;
  heroButtonNewTab: boolean;

  assessmentTitle: string | null;
  assessmentDescription: string | null;

  aboutTitle: string | null;
  aboutDescription: string | null;
  aboutFeaturedService1Id: string | null;
  aboutFeaturedService1: FeaturedService | null;
  aboutFeaturedService2Id: string | null;
  aboutFeaturedService2: FeaturedService | null;
  aboutFeaturedService3Id: string | null;
  aboutFeaturedService3: FeaturedService | null;
  aboutButtonText: string | null;
  aboutButtonLink: string | null;
  aboutButtonNewTab: boolean;
  aboutMediaId: string | null;
  aboutMedia: FileMedia | null;

  providersTitle: string | null;
  providersButtonText: string | null;
  providersButtonLink: string | null;
  providersButtonNewTab: boolean;

  howItWorksTitle: string | null;
  howItWorksStep1Title: string | null;
  howItWorksStep1Description: string | null;
  howItWorksStep2Title: string | null;
  howItWorksStep2Description: string | null;
  howItWorksStep3Title: string | null;
  howItWorksStep3Description: string | null;
  howItWorksStep4Title: string | null;
  howItWorksStep4Description: string | null;

  testimonialTitle: string | null;
  testimonialCardTitle: string | null;
  testimonialCardDescription: string | null;
  testimonialButtonText: string | null;
  testimonialButtonLink: string | null;
  testimonialButtonNewTab: boolean;

  faqTitle: string | null;
  faqCardTitle: string | null;
  faqCardDescription: string | null;
  faqButtonText: string | null;
  faqButtonLink: string | null;
  faqButtonNewTab: boolean;
  faqCardMediaId: string | null;
  faqCardMedia: FileMedia | null;
  faqQuestion1: string | null;
  faqAnswer1: string | null;
  faqQuestion2: string | null;
  faqAnswer2: string | null;
  faqQuestion3: string | null;
  faqAnswer3: string | null;
  faqQuestion4: string | null;
  faqAnswer4: string | null;
  faqQuestion5: string | null;
  faqAnswer5: string | null;
  faqQuestion6: string | null;
  faqAnswer6: string | null;

  createdAt: string;
  updatedAt: string;
}

// ─── Normalised form state (strings guaranteed, never null) ──────────────────

export interface HomepageFormState {
  heroMediaId: string;
  heroMediaUrl: string; // for display only
  heroBadgeImageId: string;
  heroBadgeImageUrl: string; // for display only
  heroTitle: string;
  heroDescription: string;
  heroButtonText: string;
  heroButtonLink: string;
  heroButtonNewTab: boolean;

  assessmentTitle: string;
  assessmentDescription: string;

  aboutTitle: string;
  aboutDescription: string;
  aboutFeaturedService1Id: string;
  aboutFeaturedService2Id: string;
  aboutFeaturedService3Id: string;
  aboutButtonText: string;
  aboutButtonLink: string;
  aboutButtonNewTab: boolean;
  aboutMediaId: string;
  aboutMediaUrl: string; // for display only

  providersTitle: string;
  providersButtonText: string;
  providersButtonLink: string;
  providersButtonNewTab: boolean;

  howItWorksTitle: string;
  howItWorksStep1Title: string;
  howItWorksStep1Description: string;
  howItWorksStep2Title: string;
  howItWorksStep2Description: string;
  howItWorksStep3Title: string;
  howItWorksStep3Description: string;
  howItWorksStep4Title: string;
  howItWorksStep4Description: string;

  testimonialTitle: string;
  testimonialCardTitle: string;
  testimonialCardDescription: string;
  testimonialButtonText: string;
  testimonialButtonLink: string;
  testimonialButtonNewTab: boolean;

  faqTitle: string;
  faqCardTitle: string;
  faqCardDescription: string;
  faqButtonText: string;
  faqButtonLink: string;
  faqButtonNewTab: boolean;
  faqCardMediaId: string;
  faqCardMediaUrl: string; // for display only
  faqQuestion1: string;
  faqAnswer1: string;
  faqQuestion2: string;
  faqAnswer2: string;
  faqQuestion3: string;
  faqAnswer3: string;
  faqQuestion4: string;
  faqAnswer4: string;
  faqQuestion5: string;
  faqAnswer5: string;
  faqQuestion6: string;
  faqAnswer6: string;
}

// ─── Helper: normalize API response → form state ─────────────────────────────

const str = (v: unknown): string => (v && typeof v === 'string' ? v : '');
const bool = (v: unknown, fallback = false): boolean =>
  typeof v === 'boolean' ? v : fallback;

export function normaliseHomepage(data: HomepageContentResponse): HomepageFormState {
  return {
    heroMediaId: str(data.heroMediaId),
    heroMediaUrl: str(data.heroMedia?.fileUrl),
    heroBadgeImageId: str(data.heroBadgeImageId),
    heroBadgeImageUrl: str(data.heroBadgeImage?.fileUrl),
    heroTitle: str(data.heroTitle),
    heroDescription: str(data.heroDescription),
    heroButtonText: str(data.heroButtonText),
    heroButtonLink: str(data.heroButtonLink),
    heroButtonNewTab: bool(data.heroButtonNewTab, true),

    assessmentTitle: str(data.assessmentTitle),
    assessmentDescription: str(data.assessmentDescription),

    aboutTitle: str(data.aboutTitle),
    aboutDescription: str(data.aboutDescription),
    aboutFeaturedService1Id: str(data.aboutFeaturedService1Id),
    aboutFeaturedService2Id: str(data.aboutFeaturedService2Id),
    aboutFeaturedService3Id: str(data.aboutFeaturedService3Id),
    aboutButtonText: str(data.aboutButtonText),
    aboutButtonLink: str(data.aboutButtonLink),
    aboutButtonNewTab: bool(data.aboutButtonNewTab, true),
    aboutMediaId: str(data.aboutMediaId),
    aboutMediaUrl: str(data.aboutMedia?.fileUrl),

    providersTitle: str(data.providersTitle),
    providersButtonText: str(data.providersButtonText),
    providersButtonLink: str(data.providersButtonLink),
    providersButtonNewTab: bool(data.providersButtonNewTab, true),

    howItWorksTitle: str(data.howItWorksTitle),
    howItWorksStep1Title: str(data.howItWorksStep1Title),
    howItWorksStep1Description: str(data.howItWorksStep1Description),
    howItWorksStep2Title: str(data.howItWorksStep2Title),
    howItWorksStep2Description: str(data.howItWorksStep2Description),
    howItWorksStep3Title: str(data.howItWorksStep3Title),
    howItWorksStep3Description: str(data.howItWorksStep3Description),
    howItWorksStep4Title: str(data.howItWorksStep4Title),
    howItWorksStep4Description: str(data.howItWorksStep4Description),

    testimonialTitle: str(data.testimonialTitle),
    testimonialCardTitle: str(data.testimonialCardTitle),
    testimonialCardDescription: str(data.testimonialCardDescription),
    testimonialButtonText: str(data.testimonialButtonText),
    testimonialButtonLink: str(data.testimonialButtonLink),
    testimonialButtonNewTab: bool(data.testimonialButtonNewTab, true),

    faqTitle: str(data.faqTitle),
    faqCardTitle: str(data.faqCardTitle),
    faqCardDescription: str(data.faqCardDescription),
    faqButtonText: str(data.faqButtonText),
    faqButtonLink: str(data.faqButtonLink),
    faqButtonNewTab: bool(data.faqButtonNewTab, true),
    faqCardMediaId: str(data.faqCardMediaId),
    faqCardMediaUrl: str(data.faqCardMedia?.fileUrl),
    faqQuestion1: str(data.faqQuestion1),
    faqAnswer1: str(data.faqAnswer1),
    faqQuestion2: str(data.faqQuestion2),
    faqAnswer2: str(data.faqAnswer2),
    faqQuestion3: str(data.faqQuestion3),
    faqAnswer3: str(data.faqAnswer3),
    faqQuestion4: str(data.faqQuestion4),
    faqAnswer4: str(data.faqAnswer4),
    faqQuestion5: str(data.faqQuestion5),
    faqAnswer5: str(data.faqAnswer5),
    faqQuestion6: str(data.faqQuestion6),
    faqAnswer6: str(data.faqAnswer6),
  };
}
