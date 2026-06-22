import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOrders,
  getOrderById,
  updateOrder,
  type GetOrdersParams,
  type UpdateOrderPayload,
} from '@/api/endpoints/orders.api';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params: GetOrdersParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

export const useOrders = (params: GetOrdersParams) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getOrders(params),
  });
};

export const useOrderDetails = (id: string) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrderPayload }) =>
      updateOrder(id, payload),
    onSuccess: (_ , variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
    },
  });
};
