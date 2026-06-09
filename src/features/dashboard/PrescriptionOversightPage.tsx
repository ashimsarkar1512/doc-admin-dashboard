import { useQuery } from '@tanstack/react-query';

export default function PrescriptionOversightPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['prescription-oversight'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return [
        { id: '#RX-001', patient: 'Alice Johnson', medication: 'Semaglutide 0.5mg', prescriber: 'Dr. Emily Smith', date: '2026-06-05', status: 'Active' },
        { id: '#RX-002', patient: 'Mark Rivera', medication: 'Tirzepatide 5mg', prescriber: 'Dr. James Lee', date: '2026-06-03', status: 'Active' },
        { id: '#RX-003', patient: 'Sandra Lee', medication: 'Metformin 500mg', prescriber: 'Dr. Emily Smith', date: '2026-05-28', status: 'Expired' },
        { id: '#RX-004', patient: 'Tom Harris', medication: 'Phentermine 15mg', prescriber: 'Dr. Aaron Cole', date: '2026-05-20', status: 'Suspended' },
        { id: '#RX-005', patient: 'Maria Chen', medication: 'Liraglutide 1.2mg', prescriber: 'Dr. James Lee', date: '2026-06-07', status: 'Active' },
      ];
    },
  });

  const statusColor = (s: string) =>
    s === 'Active' ? 'bg-green-100 text-green-700' :
    s === 'Expired' ? 'bg-slate-100 text-slate-500' :
    'bg-red-100 text-red-700';

  return (
    <div className="w-full p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Prescription Oversight</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Monitor and manage active patient prescriptions and medications</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 flex justify-center items-center"><p className="text-slate-500">Loading prescriptions...</p></div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="px-6 py-4">Rx ID</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Medication</th>
                <th className="px-6 py-4">Prescriber</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-[#1447E6]">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{item.patient}</td>
                  <td className="px-6 py-4">{item.medication}</td>
                  <td className="px-6 py-4">{item.prescriber}</td>
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
