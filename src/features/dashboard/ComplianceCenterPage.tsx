import { useQuery } from '@tanstack/react-query';

export default function ComplianceCenterPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['compliance-center'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return [
        { id: 1, check: 'HIPAA Data Encryption', category: 'Data Security', status: 'Passed', lastReview: '2026-06-01' },
        { id: 2, check: 'Access Control Audit', category: 'Access Management', status: 'Passed', lastReview: '2026-05-28' },
        { id: 3, check: 'PHI Handling Policy', category: 'Data Privacy', status: 'Warning', lastReview: '2026-05-20' },
        { id: 4, check: 'Breach Notification SOP', category: 'Incident Response', status: 'Passed', lastReview: '2026-06-03' },
        { id: 5, check: 'Business Associate Agreements', category: 'Legal', status: 'Failed', lastReview: '2026-04-15' },
      ];
    },
  });

  const statusColor = (s: string) =>
    s === 'Passed' ? 'bg-green-100 text-green-700' :
    s === 'Warning' ? 'bg-amber-100 text-amber-700' :
    'bg-red-100 text-red-700';

  return (
    <div className="w-full p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Compliance Center</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Monitor regulatory compliance checks and audit results</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 flex justify-center items-center"><p className="text-slate-500">Loading compliance data...</p></div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="px-6 py-4">Compliance Check</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Last Review</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{item.check}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4">{item.lastReview}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(item.status)}`}>
                      {item.status}
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
