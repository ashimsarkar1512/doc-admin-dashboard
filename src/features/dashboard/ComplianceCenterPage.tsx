import { useQuery } from '@tanstack/react-query';
import { SummaryCards } from './components/ComplianceCenter/SummaryCards';
import { SecurityAlerts } from './components/ComplianceCenter/SecurityAlerts';
import { ComplianceStatus } from './components/ComplianceCenter/ComplianceStatus';
import { ProviderLicensing } from './components/ComplianceCenter/ProviderLicensing';
import { getComplianceDashboard } from '@/api/endpoints/compliance.api';
import type { 
  SummaryMetric, 
  SecurityAlert, 
  ComplianceStatusItem, 
  ProviderLicense 
} from './components/ComplianceCenter/types';

const SECURITY_ALERTS: SecurityAlert[] = [
  {
    id: '1',
    severity: 'Critical',
    title: 'Unauthorized Access',
    timeAgo: '2 mins ago',
    detailLine1: 'Unknown IP 192.168.1.45',
    detailLine2: '3 failed login attempts from unrecognized device',
  },
  {
    id: '2',
    severity: 'High',
    title: 'Suspicious Login',
    timeAgo: '14 mins ago',
    detailLine1: 'Dr. Michael Chen',
    detailLine2: 'Login from new location: Dallas, TX (usual: Boston, MA)',
  },
  {
    id: '3',
    severity: 'Medium',
    title: 'Large Data Export',
    timeAgo: '1 hr ago',
    detailLine1: 'Staff: Jessica Martinez',
    detailLine2: 'Exported 2,400 patient records — exceeds daily threshold',
  },
  {
    id: '4',
    severity: 'Medium',
    title: 'PHI Access Anomaly',
    timeAgo: '3 hrs ago',
    detailLine1: 'Dr. Sarah Johnson',
    detailLine2: 'Accessed 47 patient records outside normal pattern',
  },
  {
    id: '5',
    severity: 'Low',
    title: 'Multiple Failed Logins',
    timeAgo: '5 hrs ago',
    detailLine1: 'David Wilson',
    detailLine2: '5 failed login attempts — account temporarily locked',
  },
];

const PROVIDER_LICENSES: ProviderLicense[] = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    initials: 'SM',
    states: ['TX', 'CA', 'FL'],
    npi: '1234567890',
    dea: 'BM1234567',
    licenseExpires: 'Expiring in 72d',
    licenseStatus: 'warning',
    insuranceExpires: 'Expiring in 27d',
    insuranceStatus: 'warning',
  },
  {
    id: '2',
    name: 'Dr. James Okafor',
    initials: 'JO',
    states: ['TX', 'NY'],
    npi: '0987654321',
    dea: 'BO9876543',
    licenseExpires: '118d left',
    licenseStatus: 'success',
    insuranceExpires: '225d left',
    insuranceStatus: 'success',
  },
  {
    id: '3',
    name: 'Emily Torres NP',
    initials: 'ET',
    states: ['TX'],
    npi: '1122334455',
    dea: 'N/A',
    licenseExpires: 'Expiring in 24d',
    licenseStatus: 'warning',
    insuranceExpires: 'Expiring in 36d',
    insuranceStatus: 'warning',
  },
  {
    id: '4',
    name: 'Dr. Kevin Nash',
    initials: 'KN',
    states: ['CA', 'WA'],
    npi: '5544332211',
    dea: 'BN5544332',
    licenseExpires: '270d left',
    licenseStatus: 'success',
    insuranceExpires: '270d left',
    insuranceStatus: 'success',
  },
];

export default function ComplianceCenterPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['complianceDashboard'],
    queryFn: getComplianceDashboard,
  });

  const SUMMARY_METRICS: SummaryMetric[] = data ? [
    { title: 'HIPAA Compliance', value: `${data.hipaaCompliance.value}${data.hipaaCompliance.unit}`, subtitle: data.hipaaCompliance.label },
    { title: 'Consent Completion', value: `${data.consentCompletion.value}${data.consentCompletion.unit}`, subtitle: data.consentCompletion.label },
    { title: 'Security Alerts', value: `${data.securityAlerts.value}`, subtitle: data.securityAlerts.label },
    { title: 'Failed Logins (24h)', value: `${data.failedLogins24h.value}`, subtitle: data.failedLogins24h.label },
    { title: 'MFA Adoption', value: `${data.mfaAdoption.value}${data.mfaAdoption.unit}`, subtitle: data.mfaAdoption.label },
    { title: 'Audit Log (24h)', value: `${data.auditLog24h.value.toLocaleString()}`, subtitle: data.auditLog24h.label },
  ] : [];

  const COMPLIANCE_STATUS: ComplianceStatusItem[] = data ? data.complianceStatus.map((item, index) => ({
    id: String(index + 1),
    label: item.name,
    statusText: item.status,
    statusType: item.statusCode === 'COMPLIANT' ? 'success' : item.statusCode === 'WARNING' ? 'warning' : 'danger',
    percentage: item.percent,
  })) : [];

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading compliance data...</div>;
  }

  if (isError) {
    return <div className="p-8 text-center text-red-500">Failed to load compliance data.</div>;
  }

  return (
    <div className="w-full p-6 md:p-8 min-h-screen bg-[#FAFAFB]">
      <SummaryCards metrics={SUMMARY_METRICS} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <SecurityAlerts alerts={SECURITY_ALERTS} />
        </div>
        <div className="lg:col-span-4">
          <ComplianceStatus items={COMPLIANCE_STATUS} />
        </div>
      </div>

      <ProviderLicensing providers={PROVIDER_LICENSES} />
    </div>
  );
}
