import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSideEffectReportById,
  updateSideEffectReport,
  deleteSideEffectReport,
  type UpdateSideEffectReportPayload,
} from "@/api/endpoints/reportSideEffect.api";
import { getAllCategories, getAllDoctors } from "@/api/endpoints/dashboard/patientManagement";
import Dialog from "@/components/shared/Dialog";
import {
  Download,
  Paperclip,
  Trash2,
  CheckCircle2,
  Loader2,
  Edit3,
  X,
  Save,
} from "lucide-react";
import Swal from "sweetalert2";

interface SideEffectReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string | null;
  onDeleted?: () => void;
}

const severityConfig: Record<string, { label: string; className: string }> = {
  MILD: {
    label: "Mild – Manageable, not affecting daily life",
    className: "text-green-700 bg-green-50 border border-green-200",
  },
  MODERATE: {
    label: "Moderate – Some impact on daily activities",
    className: "text-amber-700 bg-amber-50 border border-amber-200",
  },
  SEVERE: {
    label: "Severe – Significantly affecting daily life",
    className: "text-orange-700 bg-orange-50 border border-orange-200",
  },
  LIFE_THREATENING: {
    label: "Life-threatening – Requires immediate attention",
    className: "text-red-700 bg-red-50 border border-red-200",
  },
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
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
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateSideEffectReportPayload>({});

  // Fetch Report
  const {
    data: report,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["side-effect-report", reportId],
    queryFn: () => getSideEffectReportById(reportId as string),
    enabled: !!reportId && isOpen,
  });

  // Fetch Services (Categories) and Providers (Doctors) for dropdowns
  const { data: categories = [] } = useQuery({
    queryKey: ["all-categories"],
    queryFn: getAllCategories,
    enabled: isEditing,
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ["all-doctors"],
    queryFn: getAllDoctors,
    enabled: isEditing,
  });

  // Reset state when closed or opened
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setFormData({});
    } else if (report) {
      setFormData({
        firstName: report.firstName,
        lastName: report.lastName,
        email: report.email,
        phone: report.phone,
        serviceId: report.serviceId,
        providerId: report.providerId,
        severity: report.severity,
        description: report.description,
        status: report.status,
      });
    }
  }, [isOpen, report]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateSideEffectReportPayload) =>
      updateSideEffectReport(reportId as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["side-effect-reports"] });
      queryClient.invalidateQueries({
        queryKey: ["side-effect-report", reportId],
      });
      queryClient.invalidateQueries({
        queryKey: ["side-effect-reports-overview"],
      });
      setIsEditing(false);
      Swal.fire({
        title: "Updated!",
        text: "Report updated successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        customClass: { container: "!z-[99999]" },
      });
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to update report.";
      Swal.fire({
        title: "Error!",
        text: msg,
        icon: "error",
        customClass: { container: "!z-[99999]" },
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSideEffectReport(id),
  });

  const handleDelete = async () => {
    if (!report) return;

    const result = await Swal.fire({
      title: "Delete Report?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#dc2626",
      customClass: { container: "!z-[99999]" },
    });

    if (!result.isConfirmed) return;

    deleteMutation.mutate(report.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["side-effect-reports"] });
        queryClient.invalidateQueries({
          queryKey: ["side-effect-reports-overview"],
        });
        onDeleted?.();
        onClose();
        Swal.fire({
          title: "Deleted!",
          text: "The report has been deleted successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          customClass: { container: "!z-[99999]" },
        });
      },
      onError: (error: unknown) => {
        const msg =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Failed to delete report.";
        Swal.fire({
          title: "Error!",
          text: msg,
          icon: "error",
          customClass: { container: "!z-[99999]" },
        });
      },
    });
  };

  const handleMarkReviewed = () => {
    if (!report) return;
    updateMutation.mutate({ status: "REVIEWED" });
  };

  const handleSaveEdit = () => {
    if (!report) return;
    updateMutation.mutate(formData);
  };

  if (!isOpen) return null;

  const severityInfo = report
    ? (severityConfig[report.severity] ?? {
        label: report.severity,
        className: "text-slate-700 bg-slate-100",
      })
    : null;

  const isAlreadyReviewed = report?.status === "REVIEWED";

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Side Effect Report" : "Side Effect Report"}
      maxWidthClass="max-w-2xl"
    >
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
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Contact number</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Service</label>
                  <select
                    value={formData.serviceId || ''}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="" disabled>Select Service</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                    {!categories.find(c => c.id === formData.serviceId) && formData.serviceId && (
                      <option value={formData.serviceId}>{report.service?.name || formData.serviceId}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Provider</label>
                  <select
                    value={formData.providerId || ''}
                    onChange={(e) => setFormData({ ...formData, providerId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="" disabled>Select Provider</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                    {!doctors.find(d => d.id === formData.providerId) && formData.providerId && (
                      <option value={formData.providerId}>{report.provider?.name || formData.providerId}</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Severity</label>
                  <select
                    value={formData.severity || ''}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="MILD">MILD</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="SEVERE">SEVERE</option>
                    <option value="LIFE_THREATENING">LIFE_THREATENING</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Status</label>
                  <select
                    value={formData.status || ''}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="REVIEWED">REVIEWED</option>
                    <option value="ESCALATED">ESCALATED</option>
                    <option value="DISMISSED">DISMISSED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      firstName: report.firstName,
                      lastName: report.lastName,
                      email: report.email,
                      phone: report.phone,
                      serviceId: report.serviceId,
                      providerId: report.providerId,
                      severity: report.severity,
                      description: report.description,
                      status: report.status,
                    });
                  }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={updateMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-[#1447E6] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* View Mode */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Patient Name:
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {report.firstName} {report.lastName}
                </p>
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Service:
                  </p>
                  <p className="text-sm text-slate-700">
                    {report.service?.name ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Provider:
                  </p>
                  <p className="text-sm text-slate-700">
                    {report.provider?.name ?? "—"}
                  </p>
                </div>
              </div>

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

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Status:
                </p>
                <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                  {report.status}
                </span>
              </div>

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
                        <span
                          className="text-xs text-slate-700 max-w-[120px] truncate"
                          title={att.fileName}
                        >
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
                  onClick={() => setIsEditing(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={handleMarkReviewed}
                  disabled={updateMutation.isPending || isAlreadyReviewed}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1447E6] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {isAlreadyReviewed ? "Already Reviewed" : "Mark as reviewed"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Dialog>
  );
}
