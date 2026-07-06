import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  AlertCircle,
  Loader2,
  FileDown,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  getNewsletterSubscribers,
  getNewsletterStats,
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

  const handleExport = () => {
    setIsExporting(true);

    getNewsletterSubscribers({
      limit: 1000,
      search: search.trim() || undefined,
    })
      .then((allData) => {
        const exportSubscribers = allData.data ?? [];

        if (exportSubscribers.length === 0) {
          toast.error('No subscribers to export');
          setIsExporting(false);
          return;
        }

        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        // Add background header gradient (simulated)
        const startColor = [44, 97, 91]; // #2c615b
        const midColor = [93, 142, 135]; // #5d8e87
        const endColor = [24, 49, 44]; // #18312c

        const steps = 40;

        for (let i = 0; i < steps; i++) {
          let r, g, b;

          if (i < steps / 2) {
            const t = i / (steps / 2);
            r = startColor[0] + (midColor[0] - startColor[0]) * t;
            g = startColor[1] + (midColor[1] - startColor[1]) * t;
            b = startColor[2] + (midColor[2] - startColor[2]) * t;
          } else {
            const t = (i - steps / 2) / (steps / 2);
            r = midColor[0] + (endColor[0] - midColor[0]) * t;
            g = midColor[1] + (endColor[1] - midColor[1]) * t;
            b = midColor[2] + (endColor[2] - midColor[2]) * t;
          }

          doc.setFillColor(r, g, b);
          doc.rect(0, i, 210, 1, "F");
        }

        // Add Title
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text("Newsletter Subscribers Report", 14, 20);

        // Add Subtitle/Info in Header
        doc.setFontSize(10);
        doc.setTextColor(203, 213, 225); // slate-300
        const generatedDate = new Date().toLocaleString();
        doc.text(`Generated on: ${generatedDate}`, 14, 28);
        doc.text(`Total Subscribers Found: ${exportSubscribers.length}`, 14, 33);

        // Filters badge area
        if (search.trim()) {
          doc.setFontSize(9);
          let filterStr = "Filters Applied: ";
          filterStr += `Search: "${search.trim()}"`;
          doc.text(filterStr, 14, 37);
        }

        const tableColumn = [
          "#",
          "Email Address",
          "Subscribed Date",
        ];
        const tableRows = exportSubscribers.map((s, index: number) => [
          index + 1,
          s.email,
          new Date(s.createdAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
        ]);

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 45,
          theme: "striped",
          styles: {
            fontSize: 10,
            cellPadding: 3,
            valign: "middle",
            font: "helvetica",
            textColor: [51, 65, 85], // slate-700
          },
          headStyles: {
            fillColor: [241, 245, 249], // slate-100
            textColor: [71, 85, 105], // slate-600
            fontStyle: "bold",
            halign: "left",
            lineWidth: 0.1,
            lineColor: [226, 232, 240], // slate-200
          },
          columnStyles: {
            0: { halign: "center", cellWidth: 15 },
            1: { fontStyle: "bold", textColor: [30, 41, 59] },
            2: { halign: "center", cellWidth: 50 },
          },
          alternateRowStyles: {
            fillColor: [250, 251, 252],
          },
          margin: { top: 45, bottom: 20 },
          didDrawPage: (data) => {
            const pageSize = doc.internal.pageSize;
            const pageHeight = pageSize.height
              ? pageSize.height
              : pageSize.getHeight();
            const pageWidth = pageSize.width
              ? pageSize.width
              : pageSize.getWidth();

            doc.setFontSize(9);
            doc.setTextColor(148, 163, 184);

            const str = `Page ${data.pageNumber} of ${doc.internal.pages.length - 1}`;
            doc.text(str, data.settings.margin.left, pageHeight - 10);

            doc.text(
              "Confidential Document - DocDashboard",
              pageWidth - 14,
              pageHeight - 10,
              { align: "right" },
            );
          },
        });

        doc.save(
          `newsletter_subscribers_${new Date().toISOString().split("T")[0]}.pdf`,
        );
        setIsExporting(false);
      })
      .catch((error) => {
        console.error("Export error:", error);
        setIsExporting(false);
        toast.error("Failed to export subscribers data");
      });
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
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1447E6] rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed min-w-[130px] justify-center"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4" />
              <span>Export PDF</span>
            </>
          )}
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
