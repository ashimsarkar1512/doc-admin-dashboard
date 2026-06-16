import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSideEffectReports,
  getSideEffectReportsOverview,
  deleteSideEffectReport,
} from '@/api/endpoints/reportSideEffect.api';
import type {
  SideEffectReport,
  SeverityLevel,
  ReportStatus,
  GetSideEffectReportsParams,
} from '@/api/endpoints/reportSideEffect.api';
import SideEffectReportModal from './components/SideEffectReportModal';
import {
  Eye,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Swal from 'sweetalert2';

// ─── Severity & Status helpers ────────────────────────────────────────────────

const severityBadge: Record<SeverityLevel, { label: string; className: string }> = {
  MILD: {
    label: 'Mild',
    className: 'bg-green-100 text-green-700 border border-green-200',
  },
  MODERATE: {
    label: 'Moderate',
    className: 'bg-amber-100 text-amber-700 border border-amber-200',
  },
  SEVERE: {
    label: 'Severe',
    className: 'bg-orange-100 text-orange-700 border border-orange-200',
  },
  LIFE_THREATENING: {
    label: 'Life-threatening',
    className: 'bg-red-500 text-white border border-red-600',
  },
};

const statusBadge: Record<ReportStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-600 border border-amber-200',
  },
  REVIEWED: {
    label: 'Reviewed',
    className: 'bg-green-50 text-green-700 border border-green-200',
  },
  ESCALATED: {
    label: 'Escalated',
    className: 'bg-red-50 text-red-600 border border-red-200',
  },
  DISMISSED: {
    label: 'Dismissed',
    className: 'bg-slate-100 text-slate-500 border border-slate-200',
  },
};

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
        isDark
          ? 'bg-slate-900 text-white'
          : 'bg-slate-800 text-white'
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

export default function SideEffectReportPage() {
  const queryClient = useQueryClient();

  // Filters
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel | ''>('');
  const [status, setStatus] = useState<ReportStatus | ''>('');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modal
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const params: GetSideEffectReportsParams = {
    page,
    limit,
    ...(search.trim() ? { search: search.trim() } : {}),
    ...(severity ? { severity } : {}),
    ...(status ? { status } : {}),
  };

  // Queries
  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ['side-effect-reports-overview'],
    queryFn: getSideEffectReportsOverview,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['side-effect-reports', params],
    queryFn: () => getSideEffectReports(params),
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSideEffectReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['side-effect-reports'] });
      queryClient.invalidateQueries({ queryKey: ['side-effect-reports-overview'] });
    },
  });

  const handleView = (report: SideEffectReport) => {
    setSelectedReportId(report.id);
    setIsModalOpen(true);
  };


  const handleDelete = async (id: string) => {
  const result = await Swal.fire({
    title: "Delete Report?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    confirmButtonColor: "#dc2626",
  });

  if (result.isConfirmed) {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        Swal.fire({
          title: "Deleted!",
          text: "The report has been deleted successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      },

      onError: (error: any) => {
        Swal.fire({
          title: "Error!",
          text:
            error?.response?.data?.message ||
            "Failed to delete report.",
          icon: "error",
        });
      },
    });
  }
};
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleFilterChange = () => {
    setPage(1);
  };

  const overview = overviewData?.counts;
  const reports = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="w-full p-4 md:p-8">
      {/* ── Overview stat cards ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Total Reports"
          value={overviewLoading ? undefined : overview?.total}
          isDark
        />
        <StatCard
          label="Pending Review"
          value={overviewLoading ? undefined : overview?.pending}
        />
        <StatCard
          label="Life-threatening"
          value={overviewLoading ? undefined : overview?.lifeThreatening}
        />
        <StatCard
          label="With Attachments"
          value={overviewLoading ? undefined : overview?.withAttachments}
        />
      </div>

      {/* ── Filters row ─────────────────────────────────────── */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
          />
        </div>

        {/* Severity filter */}
        <select
          value={severity}
          onChange={(e) => {
            setSeverity(e.target.value as SeverityLevel | '');
            handleFilterChange();
          }}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition min-w-[130px]"
        >
          <option value="">All Type</option>
          <option value="MILD">Mild</option>
          <option value="MODERATE">Moderate</option>
          <option value="SEVERE">Severe</option>
          <option value="LIFE_THREATENING">Life-threatening</option>
        </select>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as ReportStatus | '');
            handleFilterChange();
          }}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition min-w-[130px]"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="ESCALATED">Escalated</option>
          <option value="DISMISSED">Dismissed</option>
        </select>
      </form>

      {/* ── Table ───────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm">Failed to load reports. Please try again.</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
            <p className="text-sm font-medium">No reports found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Patient
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Service
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Provider
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Severity
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Attachments
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Timestamp
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.map((report) => {
                    const sv = severityBadge[report.severity] ?? {
                      label: report.severity,
                      className: 'bg-slate-100 text-slate-600',
                    };
                    const st = statusBadge[report.status] ?? {
                      label: report.status,
                      className: 'bg-slate-100 text-slate-600',
                    };
                    const hasAttachments =
                      report.attachments && report.attachments.length > 0;

                    return (
                      <tr
                        key={report.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        {/* Patient */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-800 text-sm">
                            {report.firstName} {report.lastName}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {report.email}
                          </div>
                        </td>

                        {/* Service */}
                        <td className="px-5 py-4 whitespace-nowrap text-slate-700 text-sm">
                          {report.service?.name ?? '—'}
                        </td>

                        {/* Provider */}
                        <td className="px-5 py-4 whitespace-nowrap text-slate-700 text-sm">
                          {report.provider?.name ?? '—'}
                        </td>

                        {/* Severity */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${sv.className}`}
                          >
                            {sv.label}
                          </span>
                        </td>

                        {/* Attachments */}
                        <td className="px-5 py-4 whitespace-nowrap text-slate-500 text-sm">
                          {hasAttachments ? (
                            <span className="flex items-center gap-1.5">
                              <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                              {report.attachments.length}{' '}
                              {report.attachments.length === 1 ? 'file' : 'files'}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${st.className}`}
                          >
                            {st.label}
                          </span>
                        </td>

                        {/* Timestamp */}
                        <td className="px-5 py-4 whitespace-nowrap text-slate-500 text-sm">
                          {new Date(report.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleView(report)}
                              title="View Details"
                              className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(report.id)}
                              title="Delete"
                              disabled={deleteMutation.isPending}
                              className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50 disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
                <span className="text-sm text-slate-500">
                  Showing{' '}
                  {(meta.page - 1) * meta.limit + 1}–
                  {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{' '}
                  results
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-slate-700">
                    Page {page} of {meta.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPage((p) => Math.min(meta.totalPages, p + 1))
                    }
                    disabled={page === meta.totalPages}
                    className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Detail Modal ────────────────────────────────────── */}
      <SideEffectReportModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedReportId(null);
        }}
        reportId={selectedReportId}
      />
    </div>
  );
}
