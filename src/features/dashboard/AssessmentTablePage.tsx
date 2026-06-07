import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronDown, Eye, Trash2, RefreshCw } from 'lucide-react';
import {
  dummyAssessments,
  type AssessmentRow,
  type PatientType,
  type AssessmentStatus,
} from './data/assessmentTable';



/** Coloured avatar circle with patient initials */
function PatientAvatar({ initials }: { initials: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center shrink-0">
      <span className="text-[11px] font-bold text-white tracking-wide">{initials}</span>
    </div>
  );
}

const PATIENT_TYPE_STYLES: Record<PatientType, string> = {
  'New Patient': 'bg-purple-50 text-purple-500 border border-purple-200',
  'Repeat Patient': 'bg-indigo-50 text-indigo-600 border border-indigo-200',
};

/** Badge for Patient Type column */
function PatientTypeBadge({ type }: { type: PatientType }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium ${PATIENT_TYPE_STYLES[type]}`}
    >
      {type === 'Repeat Patient' && <RefreshCw size={10} />}
      {type}
    </span>
  );
}

const STATUS_STYLES: Record<AssessmentStatus, string> = {
  Pending: 'bg-amber-50 text-amber-500 border border-amber-200',
  Approved: 'bg-green-50 text-green-600 border border-green-200',
  Declined: 'bg-red-50 text-red-500 border border-red-200',
};

/** Badge for Status column */
function StatusBadge({ status }: { status: AssessmentStatus }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

/** Assign / Assigned action button */
function AssignButton({ assigned }: { assigned: boolean }) {
  return assigned ? (
    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-400 border border-indigo-100 cursor-default">
      Assigned
    </button>
  ) : (
    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1447E6] hover:bg-blue-700 text-white transition-colors">
      Assign
    </button>
  );
}

/** Generic filter pill dropdown */
function FilterDropdown({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white hover:bg-slate-50 shadow-sm whitespace-nowrap transition-colors">
      {label}
      <ChevronDown size={14} className="text-slate-400" />
    </button>
  );
}

const FILTER_OPTIONS = ['Category', 'Patient Type', 'Assessment Status', "Today's"] as const;

// ─── Main Page ────────────────────────────────────────────────────

export default function AssessmentTablePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: rows = [] } = useQuery<AssessmentRow[]>({
    queryKey: ['assessment-table'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 600));
      return dummyAssessments;
    },
    staleTime: Infinity, // dummy data never goes stale
  });

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.assessment.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [rows, searchTerm],
  );

  return (
    <div className="w-full p-6 md:p-8">
      {/* Page title */}
      <h1 className="text-2xl font-semibold text-slate-800 tracking-tight mb-6">
        All Assessments
      </h1>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {FILTER_OPTIONS.map((label) => (
            <FilterDropdown key={label} label={label} />
          ))}
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#F3F4F6] text-slate-700 border-b border-slate-200">
            <tr>
              {['Patient', 'Assessment', 'Patient Type', 'Payment', 'Status', 'Date', 'Action'].map(
                (col) => (
                  <th key={col} className="px-5 py-4 font-semibold text-[13px]">
                    {col}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-600">
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                {/* Patient */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <PatientAvatar initials={row.patientInitials} />
                    <span className="font-medium text-slate-700">{row.patientName}</span>
                  </div>
                </td>

                {/* Assessment */}
                <td className="px-5 py-3.5 text-slate-600">{row.assessment}</td>

                {/* Patient Type */}
                <td className="px-5 py-3.5">
                  <PatientTypeBadge type={row.patientType} />
                </td>

                {/* Payment */}
                <td className="px-5 py-3.5 font-medium text-slate-700">{row.payment}</td>

                {/* Status */}
                <td className="px-5 py-3.5">
                  <StatusBadge status={row.status} />
                </td>

                {/* Date */}
                <td className="px-5 py-3.5 text-slate-500">{row.date}</td>

                {/* Action */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
                      <Eye size={16} />
                    </button>
                    <AssignButton assigned={row.assignStatus === 'Assigned'} />
                    <button className="p-1.5 text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-sm">
                  No assessments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
