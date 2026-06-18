import MetricCard from '@/components/shared/cards/MetricCard';
import { PatientTable } from './components/PatientTable';
import { useDashboardStats } from '@/hooks/useDashboardStats';

export default function DashboardPage() {
  const { data, isLoading } = useDashboardStats();
  console.log('Dashboard stats:', data);

  return (
    <div className="w-full p-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          Welcome to your Dashboard!
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Latest patient assessments and their statuses
        </p>
      </div>

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
