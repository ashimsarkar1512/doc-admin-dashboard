import { useQuery } from '@tanstack/react-query';

export default function CommunicationCenterPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['communication-center'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return [
        { id: 1, from: 'Alice Johnson', subject: 'Question about my prescription refill', type: 'Patient Message', date: '2026-06-08 09:30', status: 'Unread' },
        { id: 2, from: 'Dr. Emily Smith', subject: 'Patient follow-up summary attached', type: 'Internal', date: '2026-06-07 16:45', status: 'Read' },
        { id: 3, from: 'System', subject: 'Automated: Lab results ready for #P-2204', type: 'Notification', date: '2026-06-07 14:10', status: 'Read' },
        { id: 4, from: 'Mark Rivera', subject: 'Billing dispute for invoice #INV-4421', type: 'Patient Message', date: '2026-06-06 11:22', status: 'Replied' },
        { id: 5, from: 'Support Team', subject: 'Weekly patient satisfaction report', type: 'Internal', date: '2026-06-06 09:00', status: 'Read' },
      ];
    },
  });

  const typeColor = (t: string) =>
    t === 'Patient Message' ? 'bg-blue-100 text-blue-700' :
    t === 'Internal' ? 'bg-purple-100 text-purple-700' :
    'bg-slate-100 text-slate-600';

  const statusColor = (s: string) =>
    s === 'Unread' ? 'bg-amber-100 text-amber-700' :
    s === 'Replied' ? 'bg-green-100 text-green-700' :
    'bg-slate-100 text-slate-500';

  return (
    <div className="w-full p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Communication Center</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Manage patient messages, internal communications, and notifications</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 flex justify-center items-center"><p className="text-slate-500">Loading messages...</p></div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="px-6 py-4">From</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{item.from}</td>
                  <td className="px-6 py-4">{item.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColor(item.type)}`}>{item.type}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{item.date}</td>
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
