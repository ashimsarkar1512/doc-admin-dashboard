import { axiosInstance } from '@/api/axiosInstance';

export interface BillingCancellationResponse {
  id: string;
  page: string;
  timelineTitle: string;
  timelineSteps: { step: string; description: string }[];
  timelineDisclaimerTitle: string;
  timelineDisclaimerDescription: string;
  cancelTitle: string;
  cancelDescription: string;
  cancelSteps: string[];
  refundEligibleTitle: string;
  refundEligibleConditions: string[];
  refundNotEligibleTitle: string;
  refundNotEligibleConditions: string[];
  faqTitle: string;
  faqs: { question: string; answer: string }[];
  createdAt: string;
  updatedAt: string;
}

export const getBillingCancellationPage = async (): Promise<{ data: BillingCancellationResponse }> => {
  const { data } = await axiosInstance.get('/website-manage/billing-cancellation');
  return data;
};

export const updateBillingCancellationPage = async (
  payload: Omit<BillingCancellationResponse, 'id' | 'page' | 'createdAt' | 'updatedAt'>
): Promise<{ data: BillingCancellationResponse }> => {
  const { data } = await axiosInstance.patch('/website-manage/billing-cancellation', payload);
  return data;
};
