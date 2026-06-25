export interface SummaryMetric {
  title: string;
  value: string;
  subtitle: string;
}

export interface SecurityAlert {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  timeAgo: string;
  detailLine1: string;
  detailLine2: string;
}

export interface ComplianceStatusItem {
  id: string;
  label: string;
  statusText: string;
  statusType: 'success' | 'warning' | 'danger';
  percentage: number;
}

export interface ProviderLicense {
  id: string;
  name: string;
  initials: string;
  states: string[];
  npi: string;
  dea: string;
  licenseExpires: string;
  licenseStatus: 'warning' | 'success';
  insuranceExpires: string;
  insuranceStatus: 'warning' | 'success';
}
