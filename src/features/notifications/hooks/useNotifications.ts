import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type GetNotificationsResponse,

} from '@/api/endpoints/notifications.api';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '@/api/config';

export const useGetNotifications = () => {
  return useQuery<GetNotificationsResponse>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await getNotifications();
      return res;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, unknown, string>({
    mutationFn: async (id) => {
      await markNotificationAsRead(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousData = queryClient.getQueryData<GetNotificationsResponse>(['notifications']);

      if (previousData) {
        queryClient.setQueryData<GetNotificationsResponse>(['notifications'], (old) => {
          if (!old) return old;
          
          const notification = old.data.notifications.find(n => n.id === id);
          const isAlreadyRead = notification?.isRead;
          
          return {
            ...old,
            data: {
              ...old.data,
              unreadCount: isAlreadyRead ? old.data.unreadCount : Math.max(0, old.data.unreadCount - 1),
              notifications: old.data.notifications.map((n) =>
                n.id === id ? { ...n, isRead: true } : n
              ),
            },
          };
        });
      }

      return { previousData };
    },
    onError: (_err, _id, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(['notifications'], context.previousData);
      }
      toast.error('Failed to mark notification as read');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, void>({
    mutationFn: async () => {
      await markAllNotificationsAsRead();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousData = queryClient.getQueryData<GetNotificationsResponse>(['notifications']);

      if (previousData) {
        queryClient.setQueryData<GetNotificationsResponse>(['notifications'], (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              unreadCount: 0,
              notifications: old.data.notifications.map((n) => ({ ...n, isRead: true })),
            },
          };
        });
      }

      return { previousData };
    },
    onError: (_err, _vars, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(['notifications'], context.previousData);
      }
      toast.error('Failed to mark all notifications as read');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useNotificationSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Get base WS URL from API_BASE_URL (e.g., https://api.example.com/api/v1 -> wss://api.example.com)
    let wsBaseUrl = API_BASE_URL;
    if (wsBaseUrl.includes('/api/v1')) {
      wsBaseUrl = wsBaseUrl.replace('/api/v1', '');
    }
    
    // Replace http with ws
    if (wsBaseUrl.startsWith('http://')) {
      wsBaseUrl = wsBaseUrl.replace('http://', 'ws://');
    } else if (wsBaseUrl.startsWith('https://')) {
      wsBaseUrl = wsBaseUrl.replace('https://', 'wss://');
    }

    const socket = io(`${wsBaseUrl}/notifications`, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Notification socket connected');
    });

    socket.on('notification', (data) => {
      // Refresh the list and unread count
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      // Display a toast
      toast(data.title, {
        description: data.message,
      });
    });

    socket.on('error', (err) => {
      console.error('Notification socket error:', err);
    });

    socket.on('disconnect', () => {
      console.log('Notification socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
};
