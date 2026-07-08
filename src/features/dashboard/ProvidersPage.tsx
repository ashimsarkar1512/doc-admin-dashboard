import { useState, useRef, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Eye, Ban, Trash2, ChevronDown, UserCircle2, X, SquarePen, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { getDoctors, getDoctorTitles, deleteDoctor, updateDoctorStatus } from '@/api/endpoints/dashboard/doctorManagement';
import AddDoctorModal from './components/AddDoctorModal';
import ViewDoctorModal from './components/ViewDoctorModal';
import EditDoctorModal from './components/EditDoctorModal';
import { usePermissions } from '@/hooks/usePermissions';
import PageHeader from '@/components/shared/PageHeader';

const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

const PAGE_SIZE = 10;

function StatusBadge({ status }: { status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | string }) {
  if (status === 'ACTIVE') {
    return (
      <span className="inline-flex items-center rounded-full bg-[#EEF2FF] px-3 py-1 text-[11px] font-medium text-[#1447E6]">
        Active
      </span>
    );
  }
  if (status === 'BLOCKED') {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-[11px] font-medium text-red-600">
        Blocked
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
  const [viewDoctorId, setViewDoctorId] = useState<string | null>(null);
  const [editDoctorId, setEditDoctorId] = useState<string | null>(null);
  // Title filter
  const [titleFilter, setTitleFilter] = useState('');
  const [titleSearchTerm, setTitleSearchTerm] = useState('');
  const [titleOpen, setTitleOpen] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const { canManage } = usePermissions();
  const canManageDoctors = canManage('doctor_management');

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

  // When there's no explicit title filter from dropdown, pass undefined so main search handles everything
  const effectiveTitle = titleFilter || undefined;

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

  const getInitials = (name: string | null) =>
    (name || '')
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '??';

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleDoctorCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['doctors'] });
    queryClient.invalidateQueries({ queryKey: ['doctorTitles'] });
    setIsAddModalOpen(false);
  };

  // const handleDelete = (id: string, name: string) => {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: `Do you really want to delete ${name}? This action cannot be undone.`,
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#ef4444',
  //     cancelButtonColor: '#64748b',
  //     confirmButtonText: 'Yes, delete it!',
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         await deleteDoctor(id);
  //         Swal.fire('Deleted!', `${name} has been deleted.`, 'success');
  //         queryClient.invalidateQueries({ queryKey: ['doctors'] });
  //         queryClient.invalidateQueries({ queryKey: ['doctorTitles'] });
  //       } catch (error) {
  //         const message = error instanceof Error ? error.message : 'Failed to delete doctor';
  //         Swal.fire('Error!', message, 'error');
  //       }
  //     }
  //   });
  // };
const handleDelete = (id: string, name: string) => {
  Swal.fire({
    title: 'Are you sure?',
    html: `Are you sure you want to permanently delete <b>${name}</b>?
           This action is irreversible and will permanently remove all associated data.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteDoctor(id);
        Swal.fire('Deleted!', `<b>${name}</b> has been successfully deleted.`, 'success');
        queryClient.invalidateQueries({ queryKey: ['doctors'] });
        queryClient.invalidateQueries({ queryKey: ['doctorTitles'] });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete doctor';
        Swal.fire('Error!', message, 'error');
      }
    }
  });
};
  const handleToggleStatus = (id: string, currentStatus: string, name: string) => {
    const newStatus = currentStatus === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    const actionText = newStatus === 'BLOCKED' ? 'ban' : 'unban';
    
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${actionText} ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'BLOCKED' ? '#ef4444' : '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: `Yes, ${actionText}!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateDoctorStatus(id, newStatus);
          Swal.fire('Success!', `${name} has been ${actionText}ned.`, 'success');
          queryClient.invalidateQueries({ queryKey: ['doctors'] });
        } catch (error) {
          const message = error instanceof Error ? error.message : `Failed to ${actionText} doctor`;
          Swal.fire('Error!', message, 'error');
        }
      }
    });
  };

  return (
    <>
      <div className="w-full p-4 md:p-6 md:pt-4">
        <PageHeader 
          title="Doctor Management" 
          action={
            canManageDoctors && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-[#1447E6] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
              >
                <Plus size={16} />
                Add New Doctor
              </button>
            )
          } 
        />

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, email,location..."
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
                            onClick={() => setViewDoctorId(doctor.id)}
                          >
                            <Eye size={16} />
                          </button>
                          {canManageDoctors && (
                            <button
                              type="button"
                              className="text-slate-500 hover:text-[#1447E6] transition-colors"
                              aria-label={`Edit ${doctor.fullName}`}
                              title="Edit"
                              onClick={() => setEditDoctorId(doctor.id)}
                            >
                              <SquarePen size={15} />
                            </button>
                          )}
                          {canManageDoctors && (
                            <button
                              type="button"
                              className={`transition-colors ${doctor.status === 'BLOCKED' ? 'text-emerald-500 hover:text-emerald-700' : 'text-slate-500 hover:text-amber-600'}`}
                              aria-label={`${doctor.status === 'BLOCKED' ? 'Unban' : 'Ban'} ${doctor.fullName}`}
                              title={doctor.status === 'BLOCKED' ? 'Unban' : 'Ban'}
                              onClick={() => handleToggleStatus(doctor.id, doctor.status, doctor.fullName)}
                            >
                              {doctor.status === 'BLOCKED' ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                            </button>
                          )}
                          {canManageDoctors && (
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700 transition-colors"
                              aria-label={`Delete ${doctor.fullName}`}
                              title="Delete"
                              onClick={() => handleDelete(doctor.id, doctor.fullName)}
                            >
                              <Trash2 size={16} />
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
        {/* Pagination */}
{totalPages > 1 && (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-3 sm:px-6 py-3 sm:py-4 border-t border-slate-100 bg-white">
    
    {/* Text */}
    <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
      <span className="sm:hidden">
        Page <span className="font-medium text-gray-700">{currentPage}</span> /{" "}
        <span className="font-medium text-gray-700">{totalPages}</span>
      </span>

      <span className="hidden sm:inline">
        Page <span className="font-medium text-gray-700">{currentPage}</span> of{" "}
        <span className="font-medium text-gray-700">{totalPages}</span>
        {meta?.total && (
          <> &mdash; <span className="font-medium text-gray-700">{meta.total}</span> total</>
        )}
      </span>
    </p>

    {/* Controls */}
    <div className="flex items-center justify-center sm:justify-end gap-1 flex-wrap">
      
      {/* First */}
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="px-2 py-1.5 sm:px-2.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        «
      </button>

      {/* Prev */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1.5 sm:px-3 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <span className="hidden sm:inline">‹ Prev</span>
        <span className="sm:hidden">‹</span>
      </button>

      {/* Pages */}
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
        .reduce<(number | '...')[]>((acc, p, idx, arr) => {
          if (
            idx > 0 &&
            typeof arr[idx - 1] === 'number' &&
            (p as number) - (arr[idx - 1] as number) > 1
          ) {
            acc.push('...');
          }
          acc.push(p);
          return acc;
        }, [])
        .map((item, idx) =>
          item === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-xs text-gray-400">
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => handlePageChange(item as number)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border text-xs font-semibold transition-colors ${
                currentPage === item
                  ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-sm shadow-blue-600/20'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item}
            </button>
          ),
        )}

      {/* Next */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1.5 sm:px-3 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <span className="hidden sm:inline">Next ›</span>
        <span className="sm:hidden">›</span>
      </button>

      {/* Last */}
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-2 py-1.5 sm:px-2.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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

      <ViewDoctorModal
        isOpen={!!viewDoctorId}
        onClose={() => setViewDoctorId(null)}
        doctorId={viewDoctorId}
      />

      <EditDoctorModal
        isOpen={!!editDoctorId}
        onClose={() => setEditDoctorId(null)}
        doctorId={editDoctorId}
      />
    </>
  );
}