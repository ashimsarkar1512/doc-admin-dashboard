import { useQuery } from '@tanstack/react-query';

export default function StateCoveragePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['state-coverage'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return [
        { id: 1, state: 'California', region: 'West', coverageStatus: 'Active', providers: 24, lastUpdated: '2026-06-01' },
        { id: 2, state: 'Texas', region: 'South', coverageStatus: 'Active', providers: 18, lastUpdated: '2026-05-28' },
        { id: 3, state: 'New York', region: 'Northeast', coverageStatus: 'Active', providers: 31, lastUpdated: '2026-06-03' },
        { id: 4, state: 'Florida', region: 'South', coverageStatus: 'Limited', providers: 9, lastUpdated: '2026-05-15' },
        { id: 5, state: 'Ohio', region: 'Midwest', coverageStatus: 'Inactive', providers: 0, lastUpdated: '2026-04-10' },
        { id: 6, state: 'Arizona', region: 'West', coverageStatus: 'Active', providers: 12, lastUpdated: '2026-06-05' },
      ];
    },
  });

  const statusColor = (s: string) =>
    s === 'Active' ? 'bg-green-100 text-green-700' :
    s === 'Limited' ? 'bg-amber-100 text-amber-700' :
    'bg-slate-100 text-slate-500';

  return (
    <div className="w-full p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">State Coverage</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Overview of service coverage and provider availability by state</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 flex justify-center items-center"><p className="text-slate-500">Loading state coverage...</p></div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4">Providers</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4">Coverage Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{item.state}</td>
                  <td className="px-6 py-4">{item.region}</td>
                  <td className="px-6 py-4 font-semibold text-[#1447E6]">{item.providers}</td>
                  <td className="px-6 py-4">{item.lastUpdated}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(item.coverageStatus)}`}>
                      {item.coverageStatus}
                    </span>
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
