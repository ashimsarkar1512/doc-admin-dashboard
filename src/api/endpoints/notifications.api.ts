import { axiosInstance } from '../axiosInstance';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  actionType: string;
  referenceId: string;
  isRead: boolean;
  createdAt: string;
}

export interface GetNotificationsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    notifications: AppNotification[];
    unreadCount: number;
  };
}

export const getNotifications = async (): Promise<GetNotificationsResponse> => {
  const response = await axiosInstance.get<GetNotificationsResponse>('/notifications');
  return response.data;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await axiosInstance.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await axiosInstance.patch('/notifications/read-all');
};
