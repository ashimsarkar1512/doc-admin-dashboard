import MetricCard from '@/components/shared/cards/MetricCard';
import { PatientTable } from './components/PatientTable';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import PageHeader from '@/components/shared/PageHeader';

export default function DashboardPage() {
  const { data, isLoading } = useDashboardStats();
  console.log('Dashboard stats:', data);

  return (
    <div className="w-full p-4 md:px-6 md:pt-4">
      <PageHeader 
        title="Welcome to your Dashboard!"
        subtitle="Latest patient assessments and their statuses"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        <MetricCard label="Total Patients" value={isLoading ? '...' : (data?.totalPatients ?? 0)} />
        <MetricCard label="Active Providers" value={isLoading ? '...' : (data?.totalDoctors ?? 0)} />
        <MetricCard label="Active Services" value={isLoading ? '...' : (data?.activeCategories ?? 0)} />
        <MetricCard label="Assessments Taken" value={isLoading ? '...' : (data?.totalAssessmentSubmissions ?? 0)} />
      </div>

      <div className="mt-10">
        <h2 className="text-[18px] font-semibold text-slate-800 mb-4">Recent Assessment Activity</h2>
        <PatientTable />
      </div>
    </div>
  );
}
