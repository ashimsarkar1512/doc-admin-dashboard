import { axiosInstance } from '@/api/axiosInstance';

export interface MedicalTeamSectionResponse {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMedicalTeamSectionDto {
  title: string;
  description: string;
}

export const getMedicalTeamSection = async (): Promise<{ data: MedicalTeamSectionResponse }> => {
  const { data } = await axiosInstance.get('/website-manage/medical-team-section');
  return data;
};

export const updateMedicalTeamSection = async (payload: UpdateMedicalTeamSectionDto): Promise<{ data: MedicalTeamSectionResponse }> => {
  const { data } = await axiosInstance.patch('/website-manage/medical-team-section', payload);
  return data;
};
