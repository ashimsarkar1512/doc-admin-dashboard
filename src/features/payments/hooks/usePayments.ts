import { useQuery } from '@tanstack/react-query';
import {
  getPayments,
  getPaymentById,
  type GetPaymentsParams,
} from '@/api/endpoints/payments.api';

export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (params: GetPaymentsParams) => [...paymentKeys.lists(), params] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
};

export const usePayments = (params: GetPaymentsParams) => {
  return useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: () => getPayments(params),
    placeholderData: (prev) => prev,
  });
};

export const usePaymentDetail = (id: string | null) => {
  return useQuery({
    queryKey: paymentKeys.detail(id ?? ''),
    queryFn: () => getPaymentById(id!),
    enabled: !!id,
  });
};
