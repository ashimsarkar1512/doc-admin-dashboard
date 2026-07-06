import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Search, ChevronDown, RefreshCw } from 'lucide-react';
// import PageHeader from '@/components/shared/PageHeader';
import { getAssessments, getCategories, type Assessment, type Category } from '@/api/endpoints/dashboard/assessments';
import AssignDoctorModal from './components/AssignDoctorModal';
import { useQueryClient } from '@tanstack/react-query';

/** Coloured avatar circle with patient initials */
function PatientAvatar({ name, image }: { name: string | null; image: string | null }) {
  const initials = (name || '')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '??';

  return (
    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 overflow-hidden">
      {image ? (
        <img src={image} alt={name || 'Patient'} className="w-full h-full object-cover" />
      ) : (
        <span className="text-sm font-medium text-blue-700">{initials}</span>
      )}
    </div>
  );
}

const PATIENT_TYPE_STYLES: Record<string, string> = {
  'New Patient': 'bg-blue-100 text-blue-600',
  'Repeat Patient': 'bg-purple-100 text-purple-600',
};

/** Badge for Patient Type column */
function PatientTypeBadge({ type }: { type: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${PATIENT_TYPE_STYLES[type] || 'bg-gray-100 text-gray-600'}`}
    >
      {type === 'Repeat Patient' && <RefreshCw size={10} />}
      {type}
    </span>
  );
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-[#FFF7ED] text-[#F97316] border border-[#FFEDD5]',
  APPROVED: 'bg-[#F0FDF4] text-[#22C55E] border border-[#DCFCE7]',
  ACCEPTED: 'bg-[#F0FDF4] text-[#22C55E] border border-[#DCFCE7]',
  COMPLETED: 'bg-[#F0FDF4] text-[#22C55E] border border-[#DCFCE7]',
  REJECTED: 'bg-[#FEF2F2] text-[#EF4444] border border-[#FEE2E2]',
  DECLINED: 'bg-[#FEF2F2] text-[#EF4444] border border-[#FEE2E2]',
  'REQUESTED REFILL': 'bg-[#EFF6FF] text-[#3B82F6] border border-[#DBEAFE]',
};

/** Badge for Status column */
function StatusBadge({ status }: { status: string | null }) {
  // Map internal status to display text
  const displayStatus = (status || '')
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return (
    <span
      className={`inline-flex items-center px-3.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${status ? (STATUS_STYLES[status] || 'bg-slate-50 text-slate-500 border border-slate-100') : 'bg-slate-50 text-slate-500 border border-slate-100'}`}
    >
      {displayStatus || 'Unknown'}
    </span>
  );
}

/** Generic filter pill dropdown */
function FilterDropdown({
  label,
  options,
  value,
  onChange,
  
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
  icon?: React.ElementType;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-[13px] font-medium transition-all duration-200 whitespace-nowrap shadow-sm
          ${value 
            ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' 
            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'}`}
      >
        <span>{value ? selectedOption?.label : label}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''} ${value ? 'text-blue-600' : 'text-slate-400'}`} />
      </button>
      {open && (
        <div className="absolute z-30 top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 min-w-[200px] animate-in fade-in zoom-in duration-150 origin-top-right">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 mb-1">
            Filter by {label}
          </div>
          <button
            onClick={() => handleClick('')}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center justify-between ${value === '' ? 'text-blue-700 font-semibold bg-blue-50/50' : 'text-slate-600'}`}
          >
            All
            {value === '' && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
          </button>
          <div className="h-px bg-slate-100 my-1" />
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleClick(opt.value)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center justify-between ${value === opt.value ? 'text-blue-700 font-semibold bg-blue-50/50' : 'text-slate-600'}`}
            >
              {opt.label}
              {value === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const PAGE_SIZE = 10;

// ─── Main Page ────────────────────────────────────────────────────

export default function AssessmentTablePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [patientTypeFilter, setPatientTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [assigningAssessment, setAssigningAssessment] = useState<Assessment | null>(null);

  // Debounce helper
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const debounce = useCallback((setter: (v: string) => void, value: string, key: string) => {
    if (debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key]);
    }
    debounceTimers.current[key] = setTimeout(() => {
      setter(value);
      setCurrentPage(1);
    }, 400);
  }, []);

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debounce(setDebouncedSearch, value, 'search');
  };

  // Fetch categories for dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ['assessment-categories'],
    queryFn: getCategories,
    staleTime: 60000,
  });

  const categories = categoriesData?.data ?? [];

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['assessments', currentPage, debouncedSearch, statusFilter, categoryFilter, patientTypeFilter, dateFilter],
    queryFn: () =>
      getAssessments({
        page: currentPage,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        categoryId: categoryFilter || undefined,
        patientType: patientTypeFilter || undefined,
        date: dateFilter || undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const assessments = data?.data ?? [];
  console.log(assessments)
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  // Status options
  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'REQUESTED REFILL', label: 'Requested Refill' },
  ];

  // Patient type options
  const patientTypeOptions = [
    { value: 'New Patient', label: 'New Patient' },
    { value: 'Repeat Patient', label: 'Repeat Patient' },
  ];

  // Category options
  const categoryOptions = categories.map((c: Category) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6 md:p-8">
      {/* Page title */}
      <h1 className="text-xl font-semibold text-slate-800 tracking-tight mb-6">
        All Assessments 
      </h1>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative group w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-200 w-full transition-all shadow-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown
            label="Category"
            options={categoryOptions}
            value={categoryFilter}
            onChange={handleFilterChange(setCategoryFilter)}
          />
          <FilterDropdown
            label="Patient Type"
            options={patientTypeOptions}
            value={patientTypeFilter}
            onChange={handleFilterChange(setPatientTypeFilter)}
          />
          <FilterDropdown
            label="Assessment Status"
            options={statusOptions}
            value={statusFilter}
            onChange={handleFilterChange(setStatusFilter)}
          />
          <FilterDropdown
            label="Today's"
            options={[{ value: 'today', label: "Today's" }]}
            value={dateFilter}
            onChange={handleFilterChange(setDateFilter)}
          />
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium text-left">Patient</th>
                <th className="px-6 py-4 font-medium text-left">Assessment</th>
                <th className="px-6 py-4 font-medium text-left">Provider</th>
                <th className="px-6 py-4 font-medium text-center">Patient Type</th>
                <th className="px-6 py-4 font-medium text-center">Payment</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-center">Date</th>
                <th className="px-6 py-4 font-medium text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50 text-slate-600">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : assessments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    No assessments found.
                  </td>
                </tr>
              ) : (
                assessments.map((assessment: Assessment) => (
                  <tr key={assessment.submissionId} className={`hover:bg-slate-50/40 transition-colors ${isFetching ? 'opacity-60' : ''}`}>
                    {/* Patient */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <PatientAvatar name={assessment.patientName} image={assessment.patientImage} />
                        <span className="font-medium text-slate-700">{assessment.patientName}</span>
                      </div>
                    </td>

                    {/* Assessment */}
                    <td className="px-6 py-4 text-slate-500">{assessment.categoryName}</td>

                    {/* Provider */}
                    <td className="px-6 py-4 text-slate-500">{assessment.provider || 'N/A'}</td>

                    {/* Patient Type */}
                    <td className="px-6 py-4 text-center">
                      <PatientTypeBadge type={assessment.patientType} />
                    </td>

                    {/* Payment */}
                    <td className="px-6 py-4 text-center text-slate-700 font-medium">${assessment.payment?.toFixed(2)}</td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={assessment.status} />
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-center text-slate-500">
                      {new Date(assessment.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: '2-digit' })}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        {!assessment.provider ? (
                          <button
                            onClick={() => setAssigningAssessment(assessment)}
                            className="px-6 py-2 bg-blue-600 text-white text-[13px] font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                          >
                            Assign
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              sessionStorage.setItem('currentPatientName', assessment.patientName || '');
                              sessionStorage.setItem('currentPatientImage', assessment.patientImage || '');
                              navigate({ to: '/dashboard/assessment-table/$assessmentId/preview', params: { assessmentId: assessment.submissionId }});
                            }}
                            className="px-2 py-1 text-blue-500 text-[13px] font-medium hover:text-blue-600 transition-colors"
                          >
                            View Details
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
            <p className="text-sm text-gray-500">
              Page <span className="font-medium text-gray-700">{currentPage}</span> of{' '}
              <span className="font-medium text-gray-700">{totalPages}</span>
              {meta?.total && (
                <> &mdash; <span className="font-medium text-gray-700">{meta.total}</span> total</>
              )}
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1 || isFetching}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                &laquo;
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isFetching}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                &lsaquo; Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 1
                  )
                  .map((p, i, arr) => {
                    const showEllipsis = i > 0 && p - arr[i - 1] > 1;
                    return (
                      <React.Fragment key={p}>
                        {showEllipsis && <span className="px-2 text-slate-400">...</span>}
                        <button
                          onClick={() => setCurrentPage(p)}
                          disabled={isFetching}
                          className={`min-w-[32px] px-2 py-1 rounded-lg text-sm transition-colors ${
                            currentPage === p
                              ? 'bg-blue-500 text-white font-medium hover:bg-blue-600 border-transparent'
                              : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || isFetching}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Next &rsaquo;
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || isFetching}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                &raquo;
              </button>
            </div>
          </div>
        )}
      </div>

      <AssignDoctorModal
        isOpen={!!assigningAssessment}
        onClose={() => {
          setAssigningAssessment(null);
          // Refresh assessments list after assign
          queryClient.invalidateQueries({ queryKey: ['assessments'] });
          queryClient.invalidateQueries({ queryKey: ['recent-activity'] });
        }}
        assessment={assigningAssessment}
      />
    </div>
  );
}
