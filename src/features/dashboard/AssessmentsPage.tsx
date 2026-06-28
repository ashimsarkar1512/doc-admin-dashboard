import { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Assessment } from '@/types';
import MetricCard from '@/components/shared/cards/MetricCard';
import AssessmentCard from '@/components/shared/cards/AssessmentCard';
import AssessmentFormDialog from './components/AssessmentFormDialog';
import { getAssessments, getAssessmentStats } from '@/api/endpoints/assessments.api';
import { getCategories } from '@/api/endpoints/categories.api';
import { API_BASE_URL } from '@/api/config';
import Swal from 'sweetalert2';
import { usePermissions } from '@/hooks/usePermissions';

async function deleteAssessment(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/assessments/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || 'Failed to delete assessment');
  }
}

export default function AssessmentsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [categoryNameFilter, setCategoryNameFilter] = useState<string>('');
  const [modalKey, setModalKey] = useState(0);
  const { canManage } = usePermissions();
  const canManageAssessments = canManage('assessments');

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories({ limit: 100 }),
  });
  const categories = categoriesData?.data ?? [];

  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['assessment-stats'],
    queryFn: getAssessmentStats,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['assessments', { categoryName: categoryNameFilter }],
    queryFn: () => getAssessments({ categoryName: categoryNameFilter || undefined, limit: 50 }),
  });

  const assessments = data?.data ?? [];

  const deleteMutation = useMutation({
    mutationFn: deleteAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      queryClient.invalidateQueries({ queryKey: ['assessment-stats'] });
      toast.success('Assessment deleted.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete assessment.');
    },
  });

  const handleOpenCreate = () => {
    setEditingAssessment(null);
    setModalKey((prev) => prev + 1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: Assessment) => {
    setEditingAssessment(a);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingAssessment(null);
  };

  return (
    <div className="p-6 md:p-10 w-full space-y-10 font-sans">

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[
          { 
            label: 'Active Assessments', 
            value: isStatsLoading ? '...' : (statsData?.activeAssessments ?? 0).toString().padStart(2, '0') 
          },
          { 
            label: 'Draft Assessments', 
            value: isStatsLoading ? '...' : (statsData?.draftAssessments ?? 0).toString().padStart(2, '0') 
          },
          { 
            label: 'Disabled Assessments', 
            value: isStatsLoading ? '...' : (statsData?.disabledAssessments ?? 0).toString().padStart(2, '0') 
          },
          { 
            label: 'Assessments Taken', 
            value: isStatsLoading ? '...' : (statsData?.assessmentTaken ?? 0).toLocaleString() 
          },
          { 
            label: 'Approved Assessments', 
            value: isStatsLoading ? '...' : (statsData?.approvedAssessments ?? 0).toString().padStart(2, '0') 
          },
          { 
            label: 'Declined Assessments', 
            value: isStatsLoading ? '...' : (statsData?.declinedAssessments ?? 0).toString().padStart(2, '0') 
          },
        ].map((m, i) => (
          <MetricCard key={i} label={m.label} value={m.value} />
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button
          onClick={() => setCategoryNameFilter('')}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
            categoryNameFilter === ''
              ? 'bg-blue-600 text-white shadow-sm font-bold'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryNameFilter(c.name)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
              categoryNameFilter === c.name
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Assessment Management
          </h2>
          <p className="text-xs md:text-sm text-gray-400 font-light">
            Create and manage assessment forms and questions.
          </p>
        </div>
        {canManageAssessments && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm shadow-blue-600/10 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Create Assessment</span>
          </button>
        )}
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 font-medium">Loading assessments...</span>
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center py-20 text-red-500">
          <AlertCircle className="h-6 w-6 mr-2" />
          <span className="font-medium">Failed to load assessments. Please try again.</span>
        </div>
      ) : assessments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {assessments.map((a) => (
            <AssessmentCard
              key={a.id}
              assessment={a}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              canManage={canManageAssessments}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-150 text-center p-6 space-y-4">
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900 text-base">No assessments found</h3>
            <p className="text-gray-400 text-sm max-w-sm">
              {categoryNameFilter ? 'No assessments found for this category.' : 'No assessments yet. Create one to get started.'}
            </p>
          </div>
          {categoryNameFilter && (
            <button
              onClick={() => setCategoryNameFilter('')}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm underline underline-offset-4"
            >
              Clear filter
            </button>
          )}
        </div>
      )}

      {/* Assessment Form Dialog */}
      <AssessmentFormDialog
        key={editingAssessment?.id ?? `create-${modalKey}`}
        isOpen={isModalOpen}
        onClose={handleClose}
        editingAssessment={editingAssessment}
      />
    </div>
  );
}
