import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  AlertCircle,
  Loader2,
  Download,
} from 'lucide-react';
import {
  getNewsletterSubscribers,
  getNewsletterStats,
  exportNewsletterSubscribers,
} from '@/api/endpoints/newsletters.api';
import { toast } from 'sonner';

function StatCard({
  label,
  value,
  isDark,
}: {
  label: string;
  value: number | undefined;
  isDark?: boolean;
}) {
  return (
    <div
      className={`rounded-xl px-6 py-5 flex flex-col gap-2 ${
        isDark ? 'bg-slate-900 text-white' : 'bg-slate-800 text-white'
      }`}
    >
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold">
        {value === undefined ? (
          <span className="text-slate-500 text-xl">—</span>
        ) : (
          value
        )}
      </p>
    </div>
  );
}

export default function NewsletterPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const limit = 10;

  const params = {
    page,
    limit,
    ...(search.trim() ? { search: search.trim() } : {}),
  };

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['newsletter-stats'],
    queryFn: getNewsletterStats,
  });

  const { data: subscribersData, isLoading, isError } = useQuery({
    queryKey: ['newsletter-subscribers', params],
    queryFn: () => getNewsletterSubscribers(params),
    placeholderData: (prev) => prev,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleExport = async () => {
    setIsExporting(true);
    const toastId = toast.loading('Exporting subscribers...');
    try {
      const blob = await exportNewsletterSubscribers();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'newsletter_subscribers.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Export successful', { id: toastId });
    } catch (error) {
      console.error('Failed to export newsletter subscribers', error);
      toast.error('Failed to export subscribers', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const stats = statsData?.data?.subscribers;
  const records = subscribersData?.data ?? [];
  const meta = subscribersData?.meta;

  return (
    <div className="w-full p-4 md:p-8">
      {/* ── Overview stat cards ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Total Subscribers"
          value={statsLoading ? undefined : stats?.total}
          isDark
        />
        <StatCard
          label="Last 24 Hours"
          value={statsLoading ? undefined : stats?.last24h}
        />
        <StatCard
          label="Last 7 Days"
          value={statsLoading ? undefined : stats?.last7d}
        />
        <StatCard
          label="Last 30 Days"
          value={statsLoading ? undefined : stats?.last30d}
        />
      </div>

      {/* ── Filters row ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6 justify-between items-center">
        <form onSubmit={handleSearch} className="relative flex-1 min-w-0 md:max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
          />
        </form>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* ── Table ───────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm">Failed to load subscribers. Please try again.</p>
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
            <p className="text-sm font-medium">No subscribers found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Subscribed At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800 text-sm">
                          {record.email}
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-500 text-sm">
                        {new Date(record.createdAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
                <span className="text-sm text-slate-500">
                  Showing{' '}
                  <span className="font-semibold text-slate-700">
                    {(meta.page - 1) * meta.limit + 1}
                  </span>
                  {' - '}
                  <span className="font-semibold text-slate-700">
                    {Math.min(meta.page * meta.limit, meta.total)}
                  </span>{' '}
                  of <span className="font-semibold text-slate-700">{meta.total}</span> results
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(1)}
                    disabled={meta.page === 1}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    «
                  </button>
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={meta.page === 1}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    ‹ Prev
                  </button>

                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === meta.totalPages || Math.abs(p - meta.page) <= 1)
                    .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) {
                        acc.push('...');
                      }
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-xs text-slate-400">
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setPage(item as number)}
                          className={`w-8 h-8 rounded-lg border text-xs font-semibold transition-colors ${
                            meta.page === item
                              ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-600/20'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={meta.page === meta.totalPages}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next ›
                  </button>
                  <button
                    onClick={() => setPage(meta.totalPages)}
                    disabled={meta.page === meta.totalPages}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
