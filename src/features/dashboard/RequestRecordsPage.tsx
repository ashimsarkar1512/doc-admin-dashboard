import { useState } from 'react';
import DatePicker from '@/components/shared/DatePicker';
import {
  Eye,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  ClipboardList
} from 'lucide-react';
import Swal from 'sweetalert2';

// ─── Severity & Status helpers ────────────────────────────────────────────────

const priorityBadge: Record<string, { label: string; className: string }> = {
  NORMAL: {
    label: 'Normal',
    className: 'bg-green-100 text-green-700 border border-green-200',
  },
  URGENT: {
    label: 'Urgent',
    className: 'bg-amber-100 text-amber-700 border border-amber-200',
  },
  CRITICAL: {
    label: 'Critical',
    className: 'bg-red-500 text-white border border-red-600',
  },
};

const statusBadge: Record<string, { label: string; className: string }> = {
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

export default function RequestRecordsPage() {
  // Filters
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Mock Overview Data
  const overview = {
    total: 24,
    pending: 8,
    critical: 3,
    withAttachments: 12
  };

  // Mock Reports Data
  const reports = [
    {
      id: '1',
      firstName: 'Michael',
      lastName: 'Scott',
      email: 'mscott@dundermifflin.com',
      service: { name: 'Medical Records' },
      provider: { name: 'Dr. John Doe' },
      priority: 'NORMAL',
      attachments: [{ id: 'a1' }],
      status: 'PENDING',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: '2',
      firstName: 'Jim',
      lastName: 'Halpert',
      email: 'jhalpert@dundermifflin.com',
      service: { name: 'Billing History' },
      provider: { name: 'Admin Staff' },
      priority: 'URGENT',
      attachments: [],
      status: 'REVIEWED',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      id: '3',
      firstName: 'Dwight',
      lastName: 'Schrute',
      email: 'dschrute@dundermifflin.com',
      service: { name: 'Prescription Records' },
      provider: { name: 'Dr. Sarah Smith' },
      priority: 'CRITICAL',
      attachments: [{ id: 'a2' }, { id: 'a3' }],
      status: 'ESCALATED',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    },
  ];

  const meta = {
    page: 1,
    limit: 10,
    total: 3,
    totalPages: 1
  };

  const handleView = (report: any) => {
    Swal.fire({
      title: 'View Details',
      text: 'Detailed view modal would open here (mocked for design).',
      icon: 'info'
    });
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Request Record?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#dc2626",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "The record has been deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
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

  return (
    <div className="w-full p-4 md:p-8">
      {/* ── Overview stat cards ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Total Requests"
          value={overview.total}
          isDark
        />
        <StatCard
          label="Pending Review"
          value={overview.pending}
        />
        <StatCard
          label="Critical Priority"
          value={overview.critical}
        />
        <StatCard
          label="With Attachments"
          value={overview.withAttachments}
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
            placeholder="Search by name, email,"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
          />
        </div>

        {/* Priority filter */}
        <select
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value);
            handleFilterChange();
          }}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition min-w-[110px]"
        >
          <option value="">All Priorities</option>
          <option value="NORMAL">Normal</option>
          <option value="URGENT">Urgent</option>
          <option value="CRITICAL">Critical</option>
        </select>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            handleFilterChange();
          }}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition min-w-[120px]"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="ESCALATED">Escalated</option>
          <option value="DISMISSED">Dismissed</option>
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
                  Assigned To
                </th>
                <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  Priority
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
                const sv = priorityBadge[report.priority] ?? {
                  label: report.priority,
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

                    {/* Priority */}
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
                          className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
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
      </div>
    </div>
  );
}
