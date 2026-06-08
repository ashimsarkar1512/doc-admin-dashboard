import { useQuery } from '@tanstack/react-query';

export default function DocumentCenterPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['document-center'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return [
        { id: 1, name: 'HIPAA_Privacy_Policy_v3.pdf', type: 'Policy', size: '1.2 MB', uploadedBy: 'admin@ektahealth.com', date: '2026-06-01' },
        { id: 2, name: 'Patient_Intake_Form_2026.docx', type: 'Form', size: '340 KB', uploadedBy: 'support@ektahealth.com', date: '2026-05-28' },
        { id: 3, name: 'Q1_Compliance_Report.xlsx', type: 'Report', size: '2.8 MB', uploadedBy: 'admin@ektahealth.com', date: '2026-05-15' },
        { id: 4, name: 'Provider_Agreement_Template.pdf', type: 'Contract', size: '890 KB', uploadedBy: 'legal@ektahealth.com', date: '2026-05-10' },
        { id: 5, name: 'Telehealth_SOP_Handbook.pdf', type: 'Handbook', size: '4.1 MB', uploadedBy: 'admin@ektahealth.com', date: '2026-04-22' },
      ];
    },
  });

  const typeColor = (t: string) => {
    const map: Record<string, string> = {
      Policy: 'bg-blue-100 text-blue-700',
      Form: 'bg-purple-100 text-purple-700',
      Report: 'bg-amber-100 text-amber-700',
      Contract: 'bg-green-100 text-green-700',
      Handbook: 'bg-slate-100 text-slate-600',
    };
    return map[t] || 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="w-full p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Document Center</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Centralized storage for policies, forms, reports, and compliance documents</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 flex justify-center items-center"><p className="text-slate-500">Loading documents...</p></div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="px-6 py-4">Document Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Uploaded By</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#1447E6]">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColor(item.type)}`}>{item.type}</span>
                  </td>
                  <td className="px-6 py-4">{item.size}</td>
                  <td className="px-6 py-4">{item.uploadedBy}</td>
                  <td className="px-6 py-4">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
