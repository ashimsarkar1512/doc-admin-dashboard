import { axiosInstance } from '@/api/axiosInstance';

export interface RequestRecordWidget {
  id: string;
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    widgetId: string;
    text: string;
    order: number;
    createdAt: string;
    updatedAt: string;
  }[];
}

export const getRequestRecordsPage = async (): Promise<{ data: RequestRecordWidget[] }> => {
  const { data } = await axiosInstance.get('/website-manage/request-records');
  return data;
};

export const updateRequestRecordsPage = async (
  payload: {
    widgets: {
      title: string;
      items: { text: string }[];
    }[];
  }
): Promise<{ data: RequestRecordWidget[] }> => {
  const { data } = await axiosInstance.patch('/website-manage/request-records', payload);
  return data;
};
