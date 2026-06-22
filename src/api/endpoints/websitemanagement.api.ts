import { axiosInstance } from '../axiosInstance';

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface Office {
  id: string;
  siteId?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: number | string;
  isActive: boolean;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type SocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'linkedin';

export interface SocialLink {
  id: string;
  siteId?: string;
  platform: SocialPlatform | string;
  url: string;
}

export interface WebsiteSettings {
  id: string;
  title: string;
  metaDescription: string;
  whiteLogoUrl: string | null;
  blackLogoUrl: string | null;
  faviconLightUrl: string | null;
  faviconDarkUrl: string | null;
  socialPreviewUrl: string | null;
  phone: string;
  email: string;
  openHours: string;
  closedDays: string;
  gaMeasurementId: string | null;
  offices: Office[];
  socialLinks: SocialLink[];
  createdAt: string;
  updatedAt: string;
}

// ─── Request Shapes ───────────────────────────────────────────────────────────

export interface OfficeInput {
  id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string | number;
  isActive: boolean;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
}

export interface SocialLinkInput {
  id?: string;
  platform: SocialPlatform | string;
  url: string;
}

export interface UpdateWebsiteSettingsParams {
  title?: string;
  metaDescription?: string;
  phone?: string;
  email?: string;
  openHours?: string;
  closedDays?: string;
  gaMeasurementId?: string;
  offices?: OfficeInput[];
  socialLinks?: SocialLinkInput[];
  // File uploads (binary)
  whiteLogo?: File;
  blackLogo?: File;
  faviconLight?: File;
  faviconDark?: File;
  socialPreview?: File;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FILE_FIELDS = [
  'whiteLogo',
  'blackLogo',
  'faviconLight',
  'faviconDark',
  'socialPreview',
] as const;

const ARRAY_FIELDS = ['offices', 'socialLinks'] as const;

const buildWebsiteSettingsFormData = (
  params: UpdateWebsiteSettingsParams
): FormData => {
  const formData = new FormData();

  (Object.keys(params) as Array<keyof UpdateWebsiteSettingsParams>).forEach(
    (key) => {
      const value = params[key];

      if (value === undefined || value === null) return;

      if (FILE_FIELDS.includes(key as typeof FILE_FIELDS[number])) {
        formData.append(key, value as File);
        return;
      }

      if (ARRAY_FIELDS.includes(key as typeof ARRAY_FIELDS[number])) {
        formData.append(key, JSON.stringify(value));
        return;
      }

      formData.append(key, String(value));
    }
  );

  return formData;
};

// ─── API Functions ────────────────────────────────────────────────────────────

export const getWebsiteSettings = async (): Promise<WebsiteSettings> => {
  const response = await axiosInstance.get<WebsiteSettings>(
    '/admin/website-settings'
  );
  return response.data;
};

export const updateWebsiteSettings = async (
  params: UpdateWebsiteSettingsParams
): Promise<WebsiteSettings> => {
  const formData = buildWebsiteSettingsFormData(params);

  const response = await axiosInstance.patch<WebsiteSettings>(
    '/admin/website-settings',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};