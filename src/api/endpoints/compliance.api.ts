import { axiosInstance } from "../axiosInstance";

export interface MetricData {
  value: number;
  unit: string;
  label: string;
}

export interface ComplianceStatusData {
  name: string;
  status: string;
  percent: number;
  statusCode: string;
}

export interface ComplianceDashboardResponse {
  hipaaCompliance: MetricData;
  consentCompletion: MetricData;
  securityAlerts: MetricData;
  failedLogins24h: MetricData;
  mfaAdoption: MetricData;
  auditLog24h: MetricData;
  complianceStatus: ComplianceStatusData[];
}

export const getComplianceDashboard = async (): Promise<ComplianceDashboardResponse> => {
  const { data } = await axiosInstance.get('/compliance/dashboard');
  return data;
};
