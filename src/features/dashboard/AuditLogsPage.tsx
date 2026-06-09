import { useQuery } from '@tanstack/react-query';

export default function AuditLogsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return [
        { id: 1, user: 'admin@ektahealth.com', action: 'Updated patient record', resource: 'Patient #P-1042', timestamp: '2026-06-08 09:14:22', ipAddress: '192.168.1.10' },
        { id: 2, user: 'dr.smith@ektahealth.com', action: 'Viewed prescription', resource: 'Prescription #RX-887', timestamp: '2026-06-08 08:55:01', ipAddress: '192.168.1.15' },
        { id: 3, user: 'support1@ektahealth.com', action: 'Login successful', resource: 'Auth', timestamp: '2026-06-08 08:30:00', ipAddress: '10.0.0.5' },
        { id: 4, user: 'admin@ektahealth.com', action: 'Deleted discount code', resource: 'Discount #DC-204', timestamp: '2026-06-07 17:45:12', ipAddress: '192.168.1.10' },
        { id: 5, user: 'dr.jones@ektahealth.com', action: 'Created assessment', resource: 'Assessment #A-330', timestamp: '2026-06-07 16:20:09', ipAddress: '192.168.1.22' },
      ];
    },
  });

  return (
    <div className="w-full p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Audit Logs</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Track all system activity and user actions for compliance</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 flex justify-center items-center"><p className="text-slate-500">Loading audit logs...</p></div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Resource</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{item.user}</td>
                  <td className="px-6 py-4">{item.action}</td>
                  <td className="px-6 py-4 text-[#1447E6] font-medium">{item.resource}</td>
                  <td className="px-6 py-4 font-mono text-xs">{item.ipAddress}</td>
                  <td className="px-6 py-4 text-slate-400">{item.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
