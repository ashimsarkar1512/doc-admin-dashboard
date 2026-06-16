import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getIncidents,
  getIncidentsOverview,
  deleteIncident,
  updateIncident,
} from '@/api/endpoints/incidentManagement.api';
import type {
  Incident,
  IncidentSeverity,
  IncidentStatus,
  IncidentSource,
  GetIncidentsParams,
} from '@/api/endpoints/incidentManagement.api';
import IncidentDetailModal from './components/IncidentDetailModal';
import {
  Search,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import Swal from 'sweetalert2';

// ─── Display Maps ─────────────────────────────────────────────────────────────

const SEVERITY_STYLES: Record<IncidentSeverity, { label: string; className: string }> = {
  CRITICAL: { label: 'Critical', className: 'bg-red-100 text-red-700 border border-red-200' },
  HIGH:     { label: 'High',     className: 'bg-orange-100 text-orange-700 border border-orange-200' },
  MEDIUM:   { label: 'Medium',   className: 'bg-amber-100 text-amber-700 border border-amber-200' },
  LOW:      { label: 'Low',      className: 'bg-slate-100 text-slate-600 border border-slate-200' },
};

const STATUS_STYLES: Record<IncidentStatus, { label: string; className: string }> = {
  OPEN:          { label: 'Open',          className: 'bg-red-50 text-red-600 border border-red-200' },
  INVESTIGATING: { label: 'Investigating', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  RESOLVED:      { label: 'Resolved',      className: 'bg-green-50 text-green-700 border border-green-200' },
  CLOSED:        { label: 'Closed',        className: 'bg-slate-100 text-slate-500 border border-slate-200' },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number | undefined;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-slate-900 text-white rounded-xl px-6 py-5 flex flex-col gap-2">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold">
        {value === undefined ? <span className="text-slate-600 text-xl animate-pulse">—</span> : value}
      </p>
    </div>
  );
}

// ─── Inline Status Dropdown ───────────────────────────────────────────────────

interface InlineStatusProps {
  incident: Incident;
  onUpdate: (id: string, status: IncidentStatus) => void;
  isPending: boolean;
}

const FALLBACK_STYLE = { label: 'Unknown', className: 'bg-slate-100 text-slate-500 border border-slate-200' };

function InlineStatusDropdown({ incident, onUpdate, isPending }: InlineStatusProps) {
  const style = STATUS_STYLES[incident.status] ?? FALLBACK_STYLE;

  return (
    <div className="relative inline-flex items-center">
      <select
        value={incident.status}
        onChange={(e) => onUpdate(incident.id, e.target.value as IncidentStatus)}
        disabled={isPending}
        className={`
          appearance-none pl-2.5 pr-6 py-1 rounded-full text-xs font-semibold border
          focus:outline-none disabled:opacity-60 cursor-pointer transition-colors
          ${style.className}
        `}
      >
        <option value="OPEN">Open</option>
        <option value="INVESTIGATING">Investigating</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </select>
      <ChevronDown className="absolute right-1.5 w-3 h-3 pointer-events-none opacity-60" />
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function IncidentManagementPage() {
  const queryClient = useQueryClient();

  // Filter state
  const [search, setSearch]     = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity | ''>('');
  const [status, setStatus]     = useState<IncidentStatus | ''>('');
  const [source, setSource]     = useState<IncidentSource | ''>('');
  const [page, setPage]         = useState(1);
  const limit = 10;

  // Modal state
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Build query params — only include truthy filter values
  const queryParams: GetIncidentsParams = {
    page,
    limit,
    ...(search.trim()  && { search: search.trim() }),
    ...(severity       && { severity }),
    ...(status         && { status }),
    ...(source         && { source }),
  };

  // ── Data fetching ──────────────────────────────────────────────────────────

  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ['incidents-overview'],
    queryFn: getIncidentsOverview,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['incidents', queryParams],
    queryFn: () => getIncidents(queryParams),
    placeholderData: (prev) => prev,
  });

  // ── Mutations ──────────────────────────────────────────────────────────────

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status: s }: { id: string; status: IncidentStatus }) =>
      updateIncident(id, { status: s }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['incidents-overview'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['incidents-overview'] });
    },
  });

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleViewIncident = (incident: Incident) => {
    setSelectedId(incident.id);
    setIsModalOpen(true);
  };

  const handleInlineStatusUpdate = (id: string, s: IncidentStatus) => {
    updateStatusMutation.mutate({ id, status: s });
  };

  const handleDelete = async (incident: Incident) => {
    const result = await Swal.fire({
      title: 'Delete Incident?',
      text: `This will permanently delete ${incident.incidentId}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      confirmButtonColor: '#dc2626',
    });

    if (!result.isConfirmed) return;

    deleteMutation.mutate(incident.id, {
      onSuccess: () => {
        Swal.fire({
          title: 'Deleted!',
          text: `${incident.incidentId} has been removed.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      },
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Failed to delete incident.';
        Swal.fire({ title: 'Error!', text: msg, icon: 'error' });
      },
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleFilterChange = () => setPage(1);

  // ── Derived values ─────────────────────────────────────────────────────────

  const overview  = overviewData?.counts;
  const incidents = data?.data ?? [];
  const meta      = data?.meta;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="w-full p-4 md:p-8">

      {/* ── Overview Stat Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total Incidents"  value={overviewLoading ? undefined : overview?.total} />
        <StatCard label="Open"             value={overviewLoading ? undefined : overview?.open} />
        <StatCard label="Investigating"    value={overviewLoading ? undefined : overview?.investigating} />
        <StatCard label="Resolved"         value={overviewLoading ? undefined : overview?.resolved} />
      </div>

      {/* ── Filter Row ────────────────────────────────────────────────────── */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-0 md:max-w-7xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email,"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
          />
        </div>

        <select
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition min-w-[110px]"
        >
          <option value="">All Role</option>
        </select>

        <select
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition min-w-[110px]"
        >
          <option value="">All Type</option>
        </select>

        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value as IncidentStatus | ''); handleFilterChange(); }}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition min-w-[120px]"
        >
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="INVESTIGATING">Investigating</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <div className="relative">
          <input
            type="text"
            defaultValue="2026-06-01"
            className="w-[140px] pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="//-//-//"
            className="w-[140px] pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </form>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm">Failed to load incidents. Please try again.</p>
          </div>
        ) : incidents.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-sm text-slate-400">No incidents match your filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {['Incident ID', 'Type', 'Severity', 'User Involved', 'Timestamp', 'Status', 'Assignee', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {incidents.map((incident) => {
                    const sv = SEVERITY_STYLES[incident.severity];
                    const userDisplay = incident.metadata?.ipAddress
                      ? `${incident.reportedBy ? incident.reportedBy : 'Unknown'} (IP: ${incident.metadata.ipAddress})`
                      : incident.reportedBy;

                    return (
                      <tr key={incident.id} className="hover:bg-slate-50 transition-colors">
                        {/* Incident ID */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="font-mono text-xs font-bold text-[#1447E6]">
                            {incident.incidentId}
                          </span>
                        </td>

                        {/* Type */}
                        <td className="px-5 py-4 text-slate-800 font-medium max-w-[200px] truncate" title={incident.type}>
                          {incident.type}
                        </td>

                        {/* Severity */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${sv.className}`}>
                            {sv.label}
                          </span>
                        </td>

                        {/* User Involved */}
                        <td className="px-5 py-4 whitespace-nowrap text-slate-600 max-w-[180px] truncate" title={userDisplay}>
                          {userDisplay}
                        </td>

                        {/* Timestamp */}
                        <td className="px-5 py-4 whitespace-nowrap text-slate-500">
                          {new Date(incident.detectedAt).toLocaleString('en-US', {
                            year: 'numeric', month: '2-digit', day: '2-digit',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </td>

                        {/* Status — inline updatable */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <InlineStatusDropdown
                            incident={incident}
                            onUpdate={handleInlineStatusUpdate}
                            isPending={
                              updateStatusMutation.isPending &&
                              updateStatusMutation.variables?.id === incident.id
                            }
                          />
                        </td>

                        {/* Assignee */}
                        <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                          {incident.assignedTo}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleViewIncident(incident)}
                              title="View Details"
                              className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(incident)}
                              title="Delete Incident"
                              disabled={deleteMutation.isPending}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
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
                  Showing {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} results
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
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
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

      {/* ── Detail Modal ──────────────────────────────────────────────────── */}
      <IncidentDetailModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedId(null); }}
        incidentId={selectedId}
      />
    </div>
  );
}
