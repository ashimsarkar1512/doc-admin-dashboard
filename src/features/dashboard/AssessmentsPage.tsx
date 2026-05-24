import { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Assessment } from '@/types';
import MetricCard from '@/components/shared/cards/MetricCard';
import AssessmentCard from '@/components/shared/cards/AssessmentCard';
import AssessmentFormDialog from './components/AssessmentFormDialog';
import { getAssessments } from '@/api/endpoints/assessments.api';
import { API_BASE_URL } from '@/api/config';

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
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['assessments', { status: statusFilter }],
    queryFn: () => getAssessments({ status: statusFilter || undefined, limit: 50 }),
  });

  const assessments = data?.data ?? [];

  const deleteMutation = useMutation({
    mutationFn: deleteAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      toast.success('Assessment deleted.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete assessment.');
    },
  });

  const handleOpenCreate = () => {
    setEditingAssessment(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: Assessment) => {
    setEditingAssessment(a);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this assessment?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingAssessment(null);
  };

  // Stats derived from fetched data
  const activeCount = assessments.filter((a) => a.status === 'ACTIVE').length;
  const totalQuestions = assessments.reduce((acc, a) => acc + (a.totalQuestions ?? 0), 0);

  const STATUS_FILTERS = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Disabled', value: 'DISABLED' },
  ];

  return (
    <div className="p-6 md:p-10 w-full space-y-10 font-sans">

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Assessments', value: activeCount.toString().padStart(2, '0') },
          { label: 'Total Questions', value: totalQuestions.toLocaleString() },
          { label: 'Total Assessments', value: assessments.length.toString().padStart(2, '0') },
          { label: 'Draft Assessments', value: assessments.filter(a => a.status === 'DRAFT').length.toString().padStart(2, '0') },
        ].map((m, i) => (
          <MetricCard key={i} label={m.label} value={m.value} />
        ))}
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
              statusFilter === f.value
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            {f.label}
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
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm shadow-blue-600/10 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create Assessment</span>
        </button>
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
              {statusFilter ? `No assessments with status "${statusFilter}".` : 'No assessments yet. Create one to get started.'}
            </p>
          </div>
          {statusFilter && (
            <button
              onClick={() => setStatusFilter('')}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm underline underline-offset-4"
            >
              Clear filter
            </button>
          )}
        </div>
      )}

      {/* Assessment Form Dialog */}
      <AssessmentFormDialog
        key={editingAssessment?.id ?? 'create'}
        isOpen={isModalOpen}
        onClose={handleClose}
        editingAssessment={editingAssessment}
      />
    </div>
  );
}
