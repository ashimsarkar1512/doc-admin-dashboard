import { useQuery } from '@tanstack/react-query';

export default function SystemHealthPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return [
        { id: 1, service: 'API Gateway', status: 'Operational', uptime: '99.98%', responseTime: '42ms', lastChecked: '2026-06-08 13:00' },
        { id: 2, service: 'Patient Portal', status: 'Operational', uptime: '99.95%', responseTime: '110ms', lastChecked: '2026-06-08 13:00' },
        { id: 3, service: 'Auth Service', status: 'Operational', uptime: '100%', responseTime: '28ms', lastChecked: '2026-06-08 13:00' },
        { id: 4, service: 'Prescription Engine', status: 'Degraded', uptime: '97.40%', responseTime: '840ms', lastChecked: '2026-06-08 13:00' },
        { id: 5, service: 'Notification Service', status: 'Operational', uptime: '99.81%', responseTime: '65ms', lastChecked: '2026-06-08 13:00' },
        { id: 6, service: 'Payment Processor', status: 'Operational', uptime: '99.99%', responseTime: '190ms', lastChecked: '2026-06-08 13:00' },
        { id: 7, service: 'Document Storage', status: 'Outage', uptime: '88.20%', responseTime: 'N/A', lastChecked: '2026-06-08 12:45' },
      ];
    },
  });

  const statusColor = (s: string) =>
    s === 'Operational' ? 'bg-green-100 text-green-700' :
    s === 'Degraded' ? 'bg-amber-100 text-amber-700' :
    'bg-red-100 text-red-700';

  const statusDot = (s: string) =>
    s === 'Operational' ? 'bg-green-500' :
    s === 'Degraded' ? 'bg-amber-500' :
    'bg-red-500';

  return (
    <div className="w-full p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">System Health</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Real-time status and performance monitoring for all platform services</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 flex justify-center items-center"><p className="text-slate-500">Loading system status...</p></div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Uptime</th>
                <th className="px-6 py-4">Response Time</th>
                <th className="px-6 py-4">Last Checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{item.service}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(item.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot(item.status)}`} />
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold">{item.uptime}</td>
                  <td className="px-6 py-4 font-mono text-xs">{item.responseTime}</td>
                  <td className="px-6 py-4 text-slate-400">{item.lastChecked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
