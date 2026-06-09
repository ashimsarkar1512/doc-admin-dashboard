import { useQuery } from '@tanstack/react-query';

export default function IncidentManagementPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['incident-management'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return [
        { id: 'INC-001', title: 'Unauthorized PHI Access Attempt', severity: 'Critical', reportedBy: 'System Monitor', date: '2026-06-07', status: 'Under Review' },
        { id: 'INC-002', title: 'Patient Portal Downtime (30 min)', severity: 'High', reportedBy: 'Dr. Smith', date: '2026-06-05', status: 'Resolved' },
        { id: 'INC-003', title: 'Failed Login Threshold Exceeded', severity: 'Medium', reportedBy: 'Security Alert', date: '2026-06-04', status: 'Resolved' },
        { id: 'INC-004', title: 'Incorrect Lab Result Displayed', severity: 'High', reportedBy: 'Support Staff', date: '2026-06-02', status: 'Investigating' },
        { id: 'INC-005', title: 'Email Notification Delay', severity: 'Low', reportedBy: 'admin@ektahealth.com', date: '2026-06-01', status: 'Resolved' },
      ];
    },
  });

  const severityColor = (s: string) =>
    s === 'Critical' ? 'bg-red-100 text-red-700' :
    s === 'High' ? 'bg-orange-100 text-orange-700' :
    s === 'Medium' ? 'bg-amber-100 text-amber-700' :
    'bg-slate-100 text-slate-600';

  const statusColor = (s: string) =>
    s === 'Resolved' ? 'bg-green-100 text-green-700' :
    s === 'Under Review' ? 'bg-blue-100 text-blue-700' :
    'bg-purple-100 text-purple-700';

  return (
    <div className="w-full p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Incident Management</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Track, investigate and resolve compliance and system incidents</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 flex justify-center items-center"><p className="text-slate-500">Loading incidents...</p></div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Reported By</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-[#1447E6] font-semibold">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{item.title}</td>
                  <td className="px-6 py-4">{item.reportedBy}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${severityColor(item.severity)}`}>{item.severity}</span>
                  </td>
                  <td className="px-6 py-4">{item.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(item.status)}`}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
