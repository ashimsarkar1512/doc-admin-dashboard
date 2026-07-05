import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DatePicker from '@/components/shared/DatePicker';
import {
  Eye,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Swal from 'sweetalert2';
import {
  getRequestRecords,
  getRequestRecordsOverview,
  deleteRequestRecord,
  updateRequestRecordStatus,
  type RequestRecord,
  type RequestRecordStatus,
  type GetRequestRecordsParams,
} from '@/api/endpoints/requestRecords.api';
import { usePermissions } from '@/hooks/usePermissions';
import RequestRecordModal from './components/RequestRecordModal';

// ─── Status helpers ─────────────────────────────────────────────────────────

const statusBadge: Record<RequestRecordStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Pending',
    className: 'bg-amber-50 text-amber-600 border border-amber-200',
  },
  REVIEWED: {
    label: 'Reviewed',
    className: 'bg-green-50 text-green-700 border border-green-200',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
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

export default function RequestRecordsPage() {
  const queryClient = useQueryClient();
  const { canManage } = usePermissions();
  const canManageRecords = canManage('compliance_center');

  // Filters
  const [search, setSearch] = useState('');
  const [requestType, setRequestType] = useState<string>('');
  const [status, setStatus] = useState<RequestRecordStatus | ''>('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modal State
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const params: GetRequestRecordsParams = {
    page,
    limit,
    ...(search.trim() ? { search: search.trim() } : {}),
    ...(requestType ? { requestType } : {}),
    ...(status ? { status } : {}),
    ...(fromDate ? { from: fromDate } : {}),
    ...(toDate ? { to: toDate } : {}),
  };

  // Queries
  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ['request-records-overview'],
    queryFn: getRequestRecordsOverview,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['request-records', params],
    queryFn: () => getRequestRecords(params),
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRequestRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['request-records'] });
      queryClient.invalidateQueries({ queryKey: ['request-records-overview'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<RequestRecord> }) =>
      updateRequestRecordStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['request-records'] });
      queryClient.invalidateQueries({ queryKey: ['request-records-overview'] });
    },
  });

  const handleView = (record: RequestRecord) => {
    setSelectedRecordId(record.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Record?",
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
            text: "The record has been deleted successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        },
        onError: (error: any) => {
          Swal.fire({
            title: "Error!",
            text: error?.response?.data?.message || "Failed to delete record.",
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
  const records = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="w-full p-4 md:p-8">
      {/* ── Overview stat cards ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Total Requests"
          value={overviewLoading ? undefined : overview?.total}
          isDark
        />
        <StatCard
          label="Pending Review"
          value={overviewLoading ? undefined : overview?.pending}
        />
        <StatCard
          label="Reviewed"
          value={overviewLoading ? undefined : overview?.reviewed}
        />
        <StatCard
          label="Completed"
          value={overviewLoading ? undefined : overview?.completed}
        />
      </div>

      {/* ── Filters row ─────────────────────────────────────── */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-0 md:max-w-7xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or notes..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
          />
        </div>

        {/* Request Type filter */}
        <select
          value={requestType}
          onChange={(e) => {
            setRequestType(e.target.value);
            handleFilterChange();
          }}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition min-w-[140px]"
        >
          <option value="">All Types</option>
          <option value="MEDICAL_RECORDS">Medical Records</option>
          <option value="PRESCRIPTION_HISTORY">Prescription History</option>
          <option value="BILLING_RECORDS">Billing Records</option>
          <option value="ACCOUNT_DELETION">Account Deletion</option>
        </select>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as RequestRecordStatus | '');
            handleFilterChange();
          }}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition min-w-[120px]"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {/* Dates */}
        <DatePicker
          value={fromDate}
          onChange={(e) => { setFromDate(e.target.value); handleFilterChange(); }}
          wrapperClassName="w-[160px]"
        />

        <DatePicker
          value={toDate}
          onChange={(e) => { setToDate(e.target.value); handleFilterChange(); }}
          wrapperClassName="w-[160px]"
        />
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
            <p className="text-sm">Failed to load records. Please try again.</p>
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
            <p className="text-sm font-medium">No records found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Patient
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Request Type
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      Notes
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
                  {records.map((record) => {
                    const st = statusBadge[record.status] ?? {
                      label: record.status,
                      className: 'bg-slate-100 text-slate-600',
                    };

                    return (
                      <tr
                        key={record.id}
                        onClick={() => handleView(record)}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        {/* Patient */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-800 text-sm">
                            {record.firstName} {record.lastName}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {record.email}
                          </div>
                        </td>

                        {/* Request Type */}
                        <td className="px-5 py-4 whitespace-nowrap text-slate-700 text-sm">
                          {record.requestType || '—'}
                        </td>

                        {/* Notes */}
                        <td className="px-5 py-4 text-slate-700 text-sm max-w-[200px] truncate" title={record.additionalNotes}>
                          {record.additionalNotes || '—'}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          {canManageRecords ? (
                            <select
                              value={record.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as RequestRecordStatus;
                                if (newStatus !== record.status) {
                                  updateStatusMutation.mutate(
                                    { id: record.id, payload: { status: newStatus } }
                                  );
                                }
                              }}
                              className={`appearance-none pr-6 px-2.5 py-1 rounded-full text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer ${st.className}`}
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: 'right 0.25rem center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1.2em 1.2em',
                              }}
                            >
                              <option value="PENDING" className="bg-white text-slate-700">Pending</option>
                              <option value="REVIEWED" className="bg-white text-slate-700">Reviewed</option>
                              <option value="COMPLETED" className="bg-white text-slate-700">Completed</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${st.className}`}>
                              {st.label}
                            </span>
                          )}
                        </td>

                        {/* Timestamp */}
                        <td className="px-5 py-4 whitespace-nowrap text-slate-500 text-sm">
                          {new Date(record.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleView(record)}
                              title="View Details"
                              className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {canManageRecords && (
                              <button
                                onClick={() => handleDelete(record.id)}
                                title="Delete"
                                disabled={deleteMutation.isPending}
                                className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50 disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
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

      {/* ── Detail Modal ────────────────────────────────────── */}
      <RequestRecordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecordId(null);
        }}
        recordId={selectedRecordId}
      />
    </div>
  );
}
