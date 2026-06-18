import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Eye, Ban, Trash2, ChevronDown, UserCircle2, X } from 'lucide-react';
import { getDoctors, getDoctorTitles } from '@/api/endpoints/dashboard/doctorManagement';
import AddDoctorModal from './components/AddDoctorModal';

const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

const PAGE_SIZE = 10;

function StatusBadge({ status }: { status: 'ACTIVE' | 'INACTIVE' }) {
  if (status === 'ACTIVE') {
    return (
      <span className="inline-flex items-center rounded-full bg-[#EEF2FF] px-3 py-1 text-[11px] font-medium text-[#1447E6]">
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
      Inactive
    </span>
  );
}

export default function ProvidersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [statusOpen, setStatusOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Title filter
  const [titleFilter, setTitleFilter] = useState('');
  const [titleSearchTerm, setTitleSearchTerm] = useState('');
  const [titleOpen, setTitleOpen] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  // Debounce helper using useRef to persist timeout IDs across renders
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

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debounce(setDebouncedSearch, value, 'search');
  };

  // Fetch titles for dropdown
  const { data: titlesData } = useQuery({
    queryKey: ['doctorTitles', titleSearchTerm],
    queryFn: () => getDoctorTitles(titleSearchTerm || undefined),
    staleTime: 60000,
  });

  const titles = titlesData?.data ?? [];

  // Close title dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (titleRef.current && !titleRef.current.contains(e.target as Node)) {
        setTitleOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When there's no explicit title filter from dropdown, also send the general search term as title parameter
  const effectiveTitle = titleFilter || (debouncedSearch || undefined);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['doctors', currentPage, debouncedSearch, statusFilter, titleFilter],
    queryFn: () =>
      getDoctors({
        page: currentPage,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        title: effectiveTitle,
      }),
    placeholderData: (prev) => prev,
  });

  const doctors = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const handleDoctorCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['doctors'] });
    queryClient.invalidateQueries({ queryKey: ['doctorTitles'] });
    setIsAddModalOpen(false);
  };

  return (
    <>
      <div className="w-full p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-xl font-semibold text-slate-800">Doctor Management</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-[#1447E6] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus size={16} />
            Add New Doctor
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, email, title, location..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 w-80"
              />
            </div>

            {/* Title filter */}
            <div className="relative" ref={titleRef}>
              <button
                onClick={() => setTitleOpen(!titleOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors ${
                  titleFilter ? 'border-blue-300 bg-blue-50 text-blue-700' : 'text-slate-700'
                }`}
              >
                <span className="max-w-[120px] truncate">
                  {titleFilter || 'All Titles'}
                </span>
                {titleFilter ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTitleFilter('');
                      setTitleSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${titleOpen ? 'rotate-180' : ''}`} />
                )}
              </button>
              {titleOpen && (
                <div className="absolute z-20 top-full mt-1.5 left-0 bg-white border border-slate-200 rounded-lg shadow-lg py-2 w-56">
                  {/* Search inside dropdown */}
                  <div className="px-2 pb-2 border-b border-slate-100">
                    <div className="relative">
                      <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Search titles..."
                        value={titleSearchTerm}
                        onChange={(e) => setTitleSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-md bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-300"
                        autoFocus
                      />
                    </div>
                  </div>
                  {/* All titles option */}
                  <button
                    onClick={() => {
                      setTitleFilter('');
                      setTitleOpen(false);
                      setTitleSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors ${
                      titleFilter === '' ? 'text-blue-700 font-medium bg-blue-50' : 'text-slate-600'
                    }`}
                  >
                    All Titles
                  </button>
                  {/* Title list */}
                  <div className="max-h-48 overflow-y-auto">
                    {titles.length === 0 ? (
                      <p className="px-3 py-4 text-xs text-slate-400 text-center">No titles found</p>
                    ) : (
                      titles.map((title) => (
                        <button
                          key={title}
                          onClick={() => {
                            setTitleFilter(title);
                            setTitleOpen(false);
                            setTitleSearchTerm('');
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors ${
                            titleFilter === title ? 'text-blue-700 font-medium bg-blue-50' : 'text-slate-600'
                          }`}
                        >
                          {title}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Status filter */}
            <div className="relative">
              <button
                onClick={() => setStatusOpen(!statusOpen)}
                className="flex items-center gap-5 px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 w-36 justify-between"
              >
                <span>{STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? 'All Status'}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${statusOpen ? 'rotate-180' : ''}`} />
              </button>
              {statusOpen && (
                <div className="absolute z-20 top-full mt-1.5 left-0 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-36">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setStatusFilter(opt.value);
                        setStatusOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors ${
                        statusFilter === opt.value ? 'text-blue-700 font-medium bg-blue-50' : 'text-slate-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Total count */}
          {meta && (
            <span className="text-sm text-slate-500">
              Total: <span className="font-medium text-slate-700">{meta.total}</span>
            </span>
          )}
        </div>

        {/* Table */}
        <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-[#F3F4F6] border-b border-slate-200">
                  <th className="px-6 py-3.5 text-left font-semibold text-slate-600 text-[13px]">Doctor</th>
                  <th className="px-6 py-3.5 text-left font-semibold text-slate-600 text-[13px]">Email</th>
                  <th className="px-6 py-3.5 text-left font-semibold text-slate-600 text-[13px]">Role / Title</th>
                  <th className="px-6 py-3.5 text-left font-semibold text-slate-600 text-[13px]">Office Location</th>
                  <th className="px-6 py-3.5 text-center font-semibold text-slate-600 text-[13px]">Active Consultation</th>
                  <th className="px-6 py-3.5 text-center font-semibold text-slate-600 text-[13px]">Status</th>
                  <th className="px-6 py-3.5 text-center font-semibold text-slate-600 text-[13px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#1447E6]" />
                      </div>
                    </td>
                  </tr>
                ) : doctors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-slate-400 text-sm">
                      No doctors found.
                    </td>
                  </tr>
                ) : (
                  doctors.map((doctor) => (
                    <tr
                      key={doctor.id}
                      className={`hover:bg-slate-50/70 transition-colors ${isFetching ? 'opacity-60' : ''}`}
                    >
                      {/* Doctor */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          {doctor.thumbnail ? (
                            <img
                              src={doctor.thumbnail}
                              alt={doctor.fullName}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex'; }}
                            />
                          ) : null}
                          <div
                            className="w-9 h-9 rounded-full bg-blue-100 items-center justify-center shrink-0"
                            style={{ display: doctor.thumbnail ? 'none' : 'flex' }}
                          >
                            {doctor.fullName ? (
                              <span className="text-xs font-semibold text-blue-700">
                                {getInitials(doctor.fullName)}
                              </span>
                            ) : (
                              <UserCircle2 size={20} className="text-blue-400" />
                            )}
                          </div>
                          <span className="font-semibold text-slate-800">{doctor.fullName}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-3.5 text-slate-700">{doctor.email}</td>

                      {/* Role/Title */}
                      <td className="px-6 py-3.5 text-slate-700 font-medium">{doctor.roleTitle || '—'}</td>

                      {/* Office Location */}
                      <td className="px-6 py-3.5 text-slate-700">{doctor.officeLocation || '—'}</td>

                      {/* Active Consultation */}
                      <td className="px-6 py-3.5 text-center text-slate-700 font-medium">
                        {String(doctor.activeConsultation).padStart(2, '0')}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-3.5 text-center">
                        <StatusBadge status={doctor.status} />
                      </td>

                      {/* Action */}
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            className="text-slate-500 hover:text-slate-800 transition-colors"
                            aria-label={`View ${doctor.fullName}`}
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            className="text-slate-500 hover:text-slate-800 transition-colors"
                            aria-label={`Ban ${doctor.fullName}`}
                            title="Ban"
                          >
                            <Ban size={16} />
                          </button>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 transition-colors"
                            aria-label={`Delete ${doctor.fullName}`}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
              {/* Left: info */}
              <p className="text-sm text-slate-500">
                Showing{' '}
                <span className="font-medium text-slate-700">
                  {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)}
                </span>{' '}
                of <span className="font-medium text-slate-700">{meta.total}</span> doctors
              </p>

              {/* Right: page buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="First page"
                >
                  «
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  ‹ Prev
                </button>

                {renderPageNumbers().map((page, idx) =>
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-xs text-gray-400 select-none">
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page as number)}
                      className={`w-8 h-8 rounded-lg border text-xs font-semibold transition-colors ${
                        currentPage === page
                          ? 'bg-[#1447E6] border-[#1447E6] text-white shadow-sm'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  Next ›
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Last page"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddDoctorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleDoctorCreated}
      />
    </>
  );
}