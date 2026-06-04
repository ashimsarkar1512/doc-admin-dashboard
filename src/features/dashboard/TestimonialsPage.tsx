import { useQuery } from '@tanstack/react-query';

export default function TestimonialsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return [
        { id: 1, author: 'Sarah Connor', rating: 5, snippet: 'Great service, highly recommended!', status: 'Published' },
        { id: 2, author: 'Bruce Wayne', rating: 4, snippet: 'Very professional staff.', status: 'Pending' },
      ];
    },
  });

  return (
    <div className="w-full p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Testimonials</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Manage patient testimonials and reviews</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 flex justify-center items-center"><p className="text-slate-500">Loading testimonials...</p></div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Review Snippet</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{item.author}</td>
                  <td className="px-6 py-4">{item.rating} / 5</td>
                  <td className="px-6 py-4 truncate max-w-[200px]">{item.snippet}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
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
