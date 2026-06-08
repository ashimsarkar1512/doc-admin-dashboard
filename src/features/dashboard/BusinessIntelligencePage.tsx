import { useQuery } from '@tanstack/react-query';

export default function BusinessIntelligencePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['business-intelligence'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return [
        { id: 1, metric: 'Total Revenue (MTD)', value: '$148,320', change: '+12.4%', trend: 'up', period: 'Jun 2026' },
        { id: 2, metric: 'New Patients (MTD)', value: '214', change: '+8.1%', trend: 'up', period: 'Jun 2026' },
        { id: 3, metric: 'Avg. Order Value', value: '$693.09', change: '+3.7%', trend: 'up', period: 'Jun 2026' },
        { id: 4, metric: 'Subscription Renewals', value: '89%', change: '-1.2%', trend: 'down', period: 'Jun 2026' },
        { id: 5, metric: 'Active Prescriptions', value: '1,042', change: '+5.9%', trend: 'up', period: 'Jun 2026' },
        { id: 6, metric: 'Churn Rate', value: '2.3%', change: '-0.4%', trend: 'down', period: 'Jun 2026' },
      ];
    },
  });

  return (
    <div className="w-full p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Business Intelligence</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Key performance metrics and data-driven insights for decision making</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 flex justify-center items-center"><p className="text-slate-500">Loading metrics...</p></div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="px-6 py-4">Metric</th>
                <th className="px-6 py-4">Period</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{item.metric}</td>
                  <td className="px-6 py-4 text-slate-400">{item.period}</td>
                  <td className="px-6 py-4 font-bold text-[#1447E6]">{item.value}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {item.change}
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
