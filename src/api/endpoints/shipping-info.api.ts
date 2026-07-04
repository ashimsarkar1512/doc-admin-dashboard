import { axiosInstance } from '@/api/axiosInstance';

export interface ShippingInfoResponse {
  partnerPharmacySection: {
    id?: string;
    title: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    partners: {
      id?: string;
      sectionId?: string;
      name: string;
      address: string;
      logoId?: string | null;
      order?: number;
      createdAt?: string;
      updatedAt?: string;
      logo?: string | null;
    }[];
  };
  shippingTimelineSection: {
    id?: string;
    title: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    steps: {
      id?: string;
      sectionId?: string;
      title: string;
      description: string;
      order?: number;
      createdAt?: string;
      updatedAt?: string;
    }[];
  };
  shippingPolicySection: {
    id?: string;
    title: string;
    description: string;
    disclaimerTitle: string;
    disclaimerDescription: string;
    createdAt?: string;
    updatedAt?: string;
    policies: {
      id?: string;
      sectionId?: string;
      text: string;
      order?: number;
      createdAt?: string;
      updatedAt?: string;
    }[];
  };
}

export const getShippingInfoPage = async (): Promise<{ data: ShippingInfoResponse }> => {
  const { data } = await axiosInstance.get('/website-manage/shipping-info');
  return data;
};

export const updateShippingInfoPage = async (
  payload: {
    partnerPharmacySection: {
      title: string;
      description: string;
      partners: {
        name: string;
        address: string;
        logoId?: string | null;
      }[];
    };
    shippingTimelineSection: {
      title: string;
      description: string;
      steps: {
        title: string;
        description: string;
      }[];
    };
    shippingPolicySection: {
      title: string;
      description: string;
      disclaimerTitle: string;
      disclaimerDescription: string;
      policies: {
        text: string;
      }[];
    };
  }
): Promise<{ data: ShippingInfoResponse }> => {
  const { data } = await axiosInstance.patch('/website-manage/shipping-info', payload);
  return data;
};
