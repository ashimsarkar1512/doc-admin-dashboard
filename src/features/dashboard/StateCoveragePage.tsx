import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStateCoverages } from '@/api/endpoints/stateCoverage.api';
import type {
  StateCoverageStatus,
  GetStateCoveragesParams,
} from '@/api/endpoints/stateCoverage.api';
import UpdateStateRestrictionsModal from './components/UpdateStateRestrictionsModal';
import {
  Search,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Calendar,
} from 'lucide-react';
// import { getIncidentsOverview } from '@/api/endpoints/incidentManagement.api';

// // ─── Stat Card Component ──────────────────────────────────────────────────────

// interface StatCardProps {
//   label: string;
//   value: number | undefined;
// }

// function StatCard({ label, value }: StatCardProps) {
//   return (
//     <div className="bg-slate-900 text-white rounded-xl px-6 py-5 flex flex-col gap-2 shadow-sm">
//       <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
//       <p className="text-3xl font-bold">
//         {value === undefined ? <span className="text-slate-600 text-xl animate-pulse">—</span> : value}
//       </p>
//     </div>
//   );
// }

// ─── Formatting Helpers ───────────────────────────────────────────────────────

const formatCategoryName = (name: string) => {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  COMPLIANT:    { label: 'Compliant',   className: 'bg-green-100 text-green-700' },
  RESTRICTED:   { label: 'Restricted',  className: 'bg-red-100 text-red-700' },
  COMMING_SOON: { label: 'Coming soon', className: 'bg-orange-100 text-orange-700' },
};

const FALLBACK_STATUS = { label: 'Unknown', className: 'bg-slate-100 text-slate-500' };

// ─── Page Component ───────────────────────────────────────────────────────────

export default function StateCoveragePage() {
  // Filter state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StateCoverageStatus | ''>('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage]     = useState(1);
  const limit = 10;

  // Modal state
  const [selectedId, setSelectedId]   = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Build query params
  const queryParams: GetStateCoveragesParams = {
    page,
    limit,
    ...(search.trim() && { search: search.trim() }),
    ...(status && { status }),
    ...(fromDate && { from: fromDate }),
    ...(toDate && { to: toDate }),
  };

  // ── Data fetching ──────────────────────────────────────────────────────────

  // Fetch incident overview stats to match the top cards in the design
  // const { data: overviewData, isLoading: overviewLoading } = useQuery({
  //   queryKey: ['incidents-overview'],
  //   queryFn: getIncidentsOverview,
  // });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['state-coverages', queryParams],
    queryFn: () => getStateCoverages(queryParams),
    placeholderData: (prev) => prev,
  });

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleEditRestriction = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleFilterChange = () => setPage(1);

  // ── Derived values ─────────────────────────────────────────────────────────

  const coverages = data?.data ?? [];
  const meta      = data?.meta;
  // const overview  = overviewData?.counts;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="w-full p-4 md:p-8">
  
   

      {/* ── Overview Stat Cards ───────────────────────────────────────────── */}
      {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total Incidents" value={overviewLoading ? undefined : overview?.total} />
        <StatCard label="Open"            value={overviewLoading ? undefined : overview?.open} />
        <StatCard label="Investigating"   value={overviewLoading ? undefined : overview?.investigating} />
        <StatCard label="Resolved"        value={overviewLoading ? undefined : overview?.resolved} />
      </div> */}

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
          value={status}
          onChange={(e) => { setStatus(e.target.value as StateCoverageStatus | ''); handleFilterChange(); }}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition min-w-[120px]"
        >
          <option value="">All Status</option>
          <option value="COMPLIANT">Compliant</option>
          <option value="RESTRICTED">Restricted</option>
          <option value="COMMING_SOON">Coming Soon</option>
        </select>

        <div className="relative">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => { setFromDate(e.target.value); handleFilterChange(); }}
            className="w-[160px] pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer cursor-pointer"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative">
          <input
            type="date"
            value={toDate}
            onChange={(e) => { setToDate(e.target.value); handleFilterChange(); }}
            className="w-[160px] pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer cursor-pointer"
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
            <p className="text-sm">Failed to load state coverages. Please try again.</p>
          </div>
        ) : coverages.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-sm text-slate-400">No states match your search criteria.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">State</th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Allowed Services</th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Restricted Services</th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Compliance Status</th>
                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">Service Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {coverages.map((item) => {
                    const st = STATUS_STYLES[item.status] ?? FALLBACK_STATUS;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        {/* State Column */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-[#1447E6] text-white flex items-center justify-center font-bold text-xs">
                              {item.stateCode}
                            </div>
                            <span className="font-medium text-slate-800">{item.stateName}</span>
                          </div>
                        </td>

                        {/* Allowed Services */}
                        <td className="px-5 py-4 min-w-[250px]">
                          {item.allowedCategories.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {item.allowedCategories.map((cat) => (
                                <span key={cat.id} className="px-2.5 py-1 bg-green-50 text-green-700 text-[11px] font-semibold rounded-full border border-green-100">
                                  {formatCategoryName(cat.name)}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-sm">None</span>
                          )}
                        </td>

                        {/* Restricted Services */}
                        <td className="px-5 py-4 min-w-[250px]">
                          {item.restrictedCategories.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {item.restrictedCategories.map((cat) => (
                                <span key={cat.id} className="px-2.5 py-1 bg-red-50 text-red-700 text-[11px] font-semibold rounded-full border border-red-100">
                                  {formatCategoryName(cat.name)}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-sm">None</span>
                          )}
                        </td>

                        {/* Compliance Status */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${st.className}`}>
                            {st.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleEditRestriction(item.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit Restriction
                          </button>
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

      {/* ── Modal ───────────────────────────────────────────────────────────── */}
      <UpdateStateRestrictionsModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedId(null); }}
        stateCoverageId={selectedId}
      />
    </div>
  );
}
