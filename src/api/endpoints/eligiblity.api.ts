import { axiosInstance } from "@/api/axiosInstance";

export interface EligibilityPoint {
  point: string;
  status: boolean;
}

export interface EligibilityFaq {
  question: string;
  answer: string;
}

export interface EligibilityContent {
  id: string;
  generalTitle: string;
  generalPoints: EligibilityPoint[];
  generalBottomDesc: string;
  qualificationTitle: string;
  qualificationbmi27Text: string;
  qualification27Description: string;
  qualificationbmi30Text: string;
  qualification30Description: string;
  weightConditionSecTitle: string;
  weightConditions: string[];
  contraindicationsSectionTitle: string;
  contraindicationsSectionWrite: string[];
  requiredlabWorkSectionTitle: string;
  requiredlabWorkSectionContraindications: string[];
  ongoingMonitoringSectionTitle: string;
  ongoingMonitoringSectionContraindication: string[];
  disclaimerSectionTitle: string;
  disclaimerSectionDes: string;
  faqTitle: string;
  faqs: EligibilityFaq[];
  createdAt: string;
  updatedAt: string;
}

export interface EligibilityContentResponse {
  success: boolean;
  message: string;
  data: EligibilityContent;
}

export interface UpdateEligibilityContentDto {
  generalTitle: string;
  generalPoints: EligibilityPoint[];
  generalBottomDesc: string;
  qualificationTitle: string;
  qualificationbmi27Text: string;
  qualification27Description: string;
  qualificationbmi30Text: string;
  qualification30Description: string;
  weightConditionSecTitle: string;
  weightConditions: string[];
  contraindicationsSectionTitle: string;
  contraindicationsSectionWrite: string[];
  requiredlabWorkSectionTitle: string;
  requiredlabWorkSectionContraindications: string[];
  ongoingMonitoringSectionTitle: string;
  ongoingMonitoringSectionContraindication: string[];
  disclaimerSectionTitle: string;
  disclaimerSectionDes: string;
  faqTitle: string;
  faqs: EligibilityFaq[];
}

export const getEligibilityContent =
  async (): Promise<EligibilityContentResponse> => {
    const { data } = await axiosInstance.get("/website-manage/eligibility");
    return data;
  };

export const updateEligibilityContent = async (
  payload: UpdateEligibilityContentDto
): Promise<EligibilityContentResponse> => {
  const { data } = await axiosInstance.patch(
    "/website-manage/eligibility",
    payload
  );
  return data;
};
