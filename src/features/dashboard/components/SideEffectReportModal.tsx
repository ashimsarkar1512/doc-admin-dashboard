import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSideEffectReportById,
  updateSideEffectReport,
  deleteSideEffectReport,
} from '@/api/endpoints/reportSideEffect.api';
import Dialog from '@/components/shared/Dialog';
import { Download, Paperclip, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

interface SideEffectReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string | null;
  onDeleted?: () => void;
}

const severityConfig: Record<
  string,
  { label: string; className: string }
> = {
  MILD: {
    label: 'Mild – Manageable, not affecting daily life',
    className: 'text-green-700 bg-green-50 border border-green-200',
  },
  MODERATE: {
    label: 'Moderate – Some impact on daily activities',
    className: 'text-amber-700 bg-amber-50 border border-amber-200',
  },
  SEVERE: {
    label: 'Severe – Significantly affecting daily life',
    className: 'text-orange-700 bg-orange-50 border border-orange-200',
  },
  LIFE_THREATENING: {
    label: 'Life-threatening – Requires immediate attention',
    className: 'text-red-700 bg-red-50 border border-red-200',
  },
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function SideEffectReportModal({
  isOpen,
  onClose,
  reportId,
  onDeleted,
}: SideEffectReportModalProps) {
  const queryClient = useQueryClient();

  const { data: report, isLoading, isError } = useQuery({
    queryKey: ['side-effect-report', reportId],
    queryFn: () => getSideEffectReportById(reportId as string),
    enabled: !!reportId && isOpen,
  });

  const markReviewedMutation = useMutation({
    mutationFn: (id: string) =>
      updateSideEffectReport(id, { status: 'REVIEWED' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['side-effect-reports'] });
      queryClient.invalidateQueries({ queryKey: ['side-effect-report', reportId] });
      queryClient.invalidateQueries({ queryKey: ['side-effect-reports-overview'] });
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSideEffectReport(id),
  });

  const handleDelete = async () => {
    if (!report) return;

    const result = await Swal.fire({
      title: 'Delete Report?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      confirmButtonColor: '#dc2626',
      customClass: { container: '!z-[99999]' },
    });

    if (!result.isConfirmed) return;

    deleteMutation.mutate(report.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['side-effect-reports'] });
        queryClient.invalidateQueries({ queryKey: ['side-effect-reports-overview'] });
        onDeleted?.();
        onClose();
        Swal.fire({
          title: 'Deleted!',
          text: 'The report has been deleted successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          customClass: { container: '!z-[99999]' },
        });
      },
      onError: (error: unknown) => {
        const msg =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Failed to delete report.';
        Swal.fire({ title: 'Error!', text: msg, icon: 'error', customClass: { container: '!z-[99999]' } });
      },
    });
  };

  const handleMarkReviewed = () => {
    if (!report) return;
    markReviewedMutation.mutate(report.id);
  };

  if (!isOpen) return null;

  const severityInfo = report ? (severityConfig[report.severity] ?? {
    label: report.severity,
    className: 'text-slate-700 bg-slate-100',
  }) : null;

  const isAlreadyReviewed = report?.status === 'REVIEWED';

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Side effect report" maxWidthClass="max-w-xl">
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : isError || !report ? (
        <div className="py-10 text-center text-red-500 text-sm">
          Failed to load report details. Please try again.
        </div>
      ) : (
        <div className="space-y-5">
          {/* Patient Name */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Patient Name:
            </p>
            <p className="text-sm font-semibold text-slate-800">
              {report.firstName} {report.lastName}
            </p>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Email:
              </p>
              <p className="text-sm text-slate-700 break-all">{report.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Contact number:
              </p>
              <p className="text-sm text-slate-700">{report.phone}</p>
            </div>
          </div>

          {/* Service + Provider */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Service:
              </p>
              <p className="text-sm text-slate-700">{report.service?.name ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Provider:
              </p>
              <p className="text-sm text-slate-700">{report.provider?.name ?? '—'}</p>
            </div>
          </div>

          {/* Severity */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Symptom Severity:
            </p>
            {severityInfo && (
              <span
                className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold ${severityInfo.className}`}
              >
                {severityInfo.label}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Description from patient:
            </p>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-lg p-3 border border-slate-100">
              {report.description}
            </p>
          </div>

          {/* Attachments */}
          {report.attachments && report.attachments.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Attachments:
              </p>
              <div className="flex flex-wrap gap-2">
                {report.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-xs text-slate-700 max-w-[120px] truncate" title={att.fileName}>
                      {att.fileName}
                    </span>
                    {att.fileSize > 0 && (
                      <span className="text-[10px] text-slate-400">
                        ({formatFileSize(att.fileSize)})
                      </span>
                    )}
                    {att.fileUrl && (
                      <a
                        href={att.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={att.fileName}
                        className="flex items-center gap-1 ml-1 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-semibold rounded hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </button>
            <button
              onClick={handleMarkReviewed}
              disabled={markReviewedMutation.isPending || isAlreadyReviewed}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1447E6] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {markReviewedMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              {isAlreadyReviewed ? 'Already Reviewed' : 'Mark as reviewed'}
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
