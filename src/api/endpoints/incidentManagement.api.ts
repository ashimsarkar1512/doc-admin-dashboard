import { axiosInstance } from '../axiosInstance';
import type { PaginatedResponse } from './categories.api';

// ─── Domain Types ─────────────────────────────────────────────────────────────

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus   = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
export type IncidentSource   = 'SECURITY_SCAN' | 'SYSTEM_MONITORING' | 'USER_REPORT' | 'MANUAL';

export interface Incident {
  id: string;
  incidentId: string;
  type: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  source: IncidentSource;
  affectedSystem: string;
  reportedBy: string;
  assignedTo: string;
  description: string;
  responseSummary: string;
  detectedAt: string;
  resolvedAt: string | null;
  metadata: { ipAddress?: string } & Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentOverview {
  title: string;
  counts: {
    total: number;
    open: number;
    investigating: number;
    resolved: number;
    closed: number;
  };
  severityCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  latest: Incident[];
}

// ─── Request Shapes ───────────────────────────────────────────────────────────

export interface GetIncidentsParams {
  search?: string;
  severity?: IncidentSeverity | '';
  status?: IncidentStatus | '';
  source?: IncidentSource | '';
  isActive?: boolean;
  detectedFrom?: string;
  detectedTo?: string;
  page?: number;
  limit?: number;
}

export type UpdateIncidentPayload = Partial<
  Pick<
    Incident,
    | 'incidentId'
    | 'type'
    | 'severity'
    | 'status'
    | 'source'
    | 'affectedSystem'
    | 'reportedBy'
    | 'assignedTo'
    | 'description'
    | 'responseSummary'
    | 'detectedAt'
    | 'resolvedAt'
    | 'metadata'
    | 'isActive'
  >
>;

// ─── API Functions ────────────────────────────────────────────────────────────

export const getIncidents = async (
  params?: GetIncidentsParams
): Promise<PaginatedResponse<Incident>> => {
  const response = await axiosInstance.get<PaginatedResponse<Incident>>(
    '/compliance/incidents',
    { params }
  );
  return response.data;
};

export const getIncidentsOverview = async (): Promise<IncidentOverview> => {
  const response = await axiosInstance.get<IncidentOverview>(
    '/compliance/incidents/overview'
  );
  return response.data;
};

export const getIncidentById = async (id: string): Promise<Incident> => {
  const response = await axiosInstance.get<Incident>(
    `/compliance/incidents/${id}`
  );
  return response.data;
};

export const updateIncident = async (
  id: string,
  payload: UpdateIncidentPayload
): Promise<Incident> => {
  const response = await axiosInstance.patch<Incident>(
    `/compliance/incidents/${id}`,
    payload
  );
  return response.data;
};

export const deleteIncident = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/compliance/incidents/${id}`);
};
