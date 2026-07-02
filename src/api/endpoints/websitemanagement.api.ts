/* eslint-disable @typescript-eslint/no-explicit-any */


import { axiosInstance } from '../axiosInstance';

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  context: string;
  uploadedById?: string | { id: string; [key: string]: any };
  createdAt: string;
  updatedAt: string;
}

export interface Office {
  id: string;
  siteId?: string;
  name: string;
  address: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialLink {
  name: string; // 'facebook' | 'instagram' | ...
  url: string;
}

export interface ContactInfo {
  siteId?: string;
  phone: string;
  email: string;
  openHours: string;
  closedDays: string;
}

export interface GoogleAnalytics {
  siteId?: string;
  gaMeasurementId: string | null;
}

export interface WebsiteSettings {
  id: string;
  title: string;
  metaDescription: string;

  whiteLogoId: string | null;
  whiteLogo: Attachment | null;
  blackLogoId: string | null;
  blackLogo: Attachment | null;
  faviconLightId: string | null;
  faviconLight: Attachment | null;
  faviconDarkId: string | null;
  faviconDark: Attachment | null;
  socialPreviewId: string | null;
  socialPreview: Attachment | null;

  offices: Office[];
  socialLinks: SocialLink[];
  contactInfo: ContactInfo;
  googleAnalytics: GoogleAnalytics;

  createdAt: string;
  updatedAt: string;
}

// ─── Request Shapes (one per endpoint) ────────────────────────────────────────

export type OfficeInput = Pick<Office, 'id' | 'name' | 'address' | 'isActive'>;
export type SocialLinkInput = Pick<SocialLink, 'name' | 'url'>;

export interface UpdateSiteSettingsParams {
  title?: string;
  metaDescription?: string;
  whiteLogoId?: string;
  blackLogoId?: string;
  faviconLightId?: string;
  faviconDarkId?: string;
  socialPreviewId?: string;
}

export interface UpdateOfficeAddressParams {
  name: string;
  address: string;
  isActive: boolean;
}

export interface UpdateContactInfoParams {
  phone: string;
  email: string;
  openHours: string;
  closedDays: string;
}

export interface UpdateSocialLinksParams {
  socialLinks: SocialLinkInput[];
}

export interface UpdateGoogleAnalyticsParams {
  gaMeasurementId: string;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const getWebsiteSettings = async (): Promise<WebsiteSettings> => {
  const { data } = await axiosInstance.get<WebsiteSettings>(
    '/public/website-settings'
  );
  return data;
};

export const updateSiteSettings = async (
  params: Partial<UpdateSiteSettingsParams>
): Promise<WebsiteSettings> => {
  const { data } = await axiosInstance.patch<WebsiteSettings>(
    '/admin/website-settings/site-settings',
    params
  );
  return data;
};

// Updates a single office address. `id` is sent as a header (per swagger).
export const updateOfficeAddress = async (
  id: string,
  params: UpdateOfficeAddressParams
): Promise<WebsiteSettings> => {
  const { data } = await axiosInstance.patch<WebsiteSettings>(
    '/admin/website-settings/office-addresses',
    params,
    { headers: { id } }
  );
  return data;
};

export const updateContactInfo = async (
  params: UpdateContactInfoParams
): Promise<WebsiteSettings> => {
  const { data } = await axiosInstance.patch<WebsiteSettings>(
    '/admin/website-settings/contact-info',
    params
  );
  return data;
};

export const updateSocialLinks = async (
  params: UpdateSocialLinksParams
): Promise<WebsiteSettings> => {
  const { data } = await axiosInstance.patch<WebsiteSettings>(
    '/admin/website-settings/social-links',
    params
  );
  return data;
};

export const updateGoogleAnalytics = async (
  params: UpdateGoogleAnalyticsParams
): Promise<WebsiteSettings> => {
  const { data } = await axiosInstance.patch<WebsiteSettings>(
    '/admin/website-settings/google-analytics',
    params
  );
  return data;
};