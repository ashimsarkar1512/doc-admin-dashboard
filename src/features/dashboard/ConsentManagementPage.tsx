import { useQuery } from '@tanstack/react-query';

export default function ConsentManagementPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['consent-management'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return [
        { id: 1, patient: 'Alice Johnson', consentType: 'Treatment Authorization', date: '2026-05-10', status: 'Signed', method: 'Digital' },
        { id: 2, patient: 'Mark Rivera', consentType: 'Data Sharing Agreement', date: '2026-05-15', status: 'Signed', method: 'Paper' },
        { id: 3, patient: 'Sandra Lee', consentType: 'Telehealth Consent', date: '2026-05-20', status: 'Pending', method: 'Digital' },
        { id: 4, patient: 'Tom Harris', consentType: 'Research Participation', date: '2026-04-28', status: 'Declined', method: 'Digital' },
        { id: 5, patient: 'Maria Chen', consentType: 'Treatment Authorization', date: '2026-06-01', status: 'Signed', method: 'Digital' },
      ];
    },
  });

  const statusColor = (s: string) =>
    s === 'Signed' ? 'bg-green-100 text-green-700' :
    s === 'Pending' ? 'bg-amber-100 text-amber-700' :
    'bg-red-100 text-red-700';

  return (
    <div className="w-full p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Consent Management</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Manage and track patient consent forms and authorizations</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 flex justify-center items-center"><p className="text-slate-500">Loading consents...</p></div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Consent Type</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{item.patient}</td>
                  <td className="px-6 py-4">{item.consentType}</td>
                  <td className="px-6 py-4">{item.method}</td>
                  <td className="px-6 py-4">{item.date}</td>
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
