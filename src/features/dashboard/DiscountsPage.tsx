import { useQuery } from '@tanstack/react-query';

export default function DiscountsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['discounts'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return [
        { id: 1, code: 'SUMMER20', discount: '20%', usage: '45/100', status: 'Active' },
        { id: 2, code: 'WELCOME10', discount: '10%', usage: '12/500', status: 'Active' },
        { id: 3, code: 'FLASH50', discount: '50%', usage: '100/100', status: 'Expired' },
      ];
    },
  });

  return (
    <div className="w-full p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Discounts & Marketing</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Manage promotional campaigns and discounts</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 flex justify-center items-center"><p className="text-slate-500">Loading campaigns...</p></div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="px-6 py-4">Promo Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{item.code}</td>
                  <td className="px-6 py-4">{item.discount}</td>
                  <td className="px-6 py-4">{item.usage}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>{item.status}</span>
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
