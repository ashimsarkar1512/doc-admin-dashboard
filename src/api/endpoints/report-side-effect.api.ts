import { axiosInstance } from '@/api/axiosInstance';

export interface ReportSideEffectResponse {
  symptoms: {
    id: string;
    text: string;
    order: number;
    createdAt: string;
    updatedAt: string;
  }[];
  emergencyWidget: {
    id: string;
    sectionTitle: string;
    createdAt: string;
    updatedAt: string;
    contacts: {
      id: string;
      widgetId: string;
      title: string;
      contact: string;
      notes: string;
      order: number;
      createdAt: string;
      updatedAt: string;
    }[];
  };
}

export const getReportSideEffectPage = async (): Promise<{ data: ReportSideEffectResponse }> => {
  const { data } = await axiosInstance.get('/website-manage/report-side-effect');
  return data;
};

export const updateReportSideEffectPage = async (
  payload: {
    symptoms: { text: string }[];
    emergencyWidget: {
      sectionTitle: string;
      contacts: { title: string; contact: string; notes: string }[];
    };
  }
): Promise<{ data: ReportSideEffectResponse }> => {
  const { data } = await axiosInstance.patch('/website-manage/report-side-effect', payload);
  return data;
};
