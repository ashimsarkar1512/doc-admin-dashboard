import { axiosInstance } from "@/api/axiosInstance";

export interface CoverageSection {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoverageSectionResponse {
  success: boolean;
  message: string;
  data: CoverageSection;
}

export interface UpdateCoverageSectionDto {
  title: string;
  description: string;
}

export const getCoverageSection = async (): Promise<CoverageSectionResponse> => {
  const { data } = await axiosInstance.get("/website-manage/coverage-section");
  return data;
};

export const updateCoverageSection = async (
  payload: UpdateCoverageSectionDto
): Promise<CoverageSectionResponse> => {
  const { data } = await axiosInstance.patch(
    "/website-manage/coverage-section",
    payload
  );
  return data;
};
