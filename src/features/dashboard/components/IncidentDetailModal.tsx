import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getIncidentById,
  updateIncident,
  deleteIncident,
} from "@/api/endpoints/incidentManagement.api";
import type {

  IncidentStatus,
} from "@/api/endpoints/incidentManagement.api";
import Dialog from "@/components/shared/Dialog";
import {
  AlertTriangle,
  Server,
  User,
  UserCheck,
  Shield,
  FileText,
  Clock,
  CheckCircle2,
  Loader2,
  Trash2,
  Wifi,
} from "lucide-react";
import Swal from "sweetalert2";

// ─── Display Maps ─────────────────────────────────────────────────────────────

const SEVERITY_STYLES: Record<string, { label: string; className: string }> = {
  CRITICAL: {
    label: "Critical",
    className: "bg-red-100 text-red-700 border border-red-200",
  },
  HIGH: {
    label: "High",
    className: "bg-orange-100 text-orange-700 border border-orange-200",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  LOW: {
    label: "Low",
    className: "bg-slate-100 text-slate-600 border border-slate-200",
  },
};

// const STATUS_STYLES: Record<string, { label: string; className: string }> = {
//   OPEN: {
//     label: "Open",
//     className: "bg-green-100 text-green-700 border border-green-200",
//   },
//   INVESTIGATING: {
//     label: "Investigating",
//     className: "bg-amber-50 text-amber-700 border border-amber-200",
//   },
//   RESOLVED: {
//     label: "Resolved",
//     className: "bg-green-50 text-green-700 border border-green-200",
//   },
//   CLOSED: {
//     label: "Closed",
//     className: "bg-red-100  text-red-600 border border-red-200",
//   },
// };

const SOURCE_LABELS: Record<string, string> = {
  SECURITY_SCAN: "Security Scan",
  SYSTEM_MONITORING: "System Monitoring",
  USER_REPORT: "User Report",
  MANUAL: "Manual",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-slate-400 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <div className="text-sm text-slate-700">{value}</div>
      </div>
    </div>
  );
}

// ─── Modal Component ──────────────────────────────────────────────────────────

interface IncidentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId: string | null;
}

export default function IncidentDetailModal({
  isOpen,
  onClose,
  incidentId,
}: IncidentDetailModalProps) {
  const queryClient = useQueryClient();

  const {
    data: incident,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["incident", incidentId],
    queryFn: () => getIncidentById(incidentId as string),
    enabled: !!incidentId && isOpen,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: IncidentStatus }) =>
      updateIncident(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      queryClient.invalidateQueries({ queryKey: ["incidents-overview"] });
      queryClient.invalidateQueries({ queryKey: ["incident", incidentId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteIncident,
  });

  const handleStatusChange = (status: IncidentStatus) => {
    if (!incident) return;
    updateStatusMutation.mutate({ id: incident.id, status });
  };

  const handleDelete = async () => {
    if (!incident) return;

    const result = await Swal.fire({
      title: "Delete Incident?",
      text: `This will permanently delete ${incident.incidentId}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#dc2626",
      customClass: { container: "!z-[99999]" },
    });

    if (!result.isConfirmed) return;

    deleteMutation.mutate(incident.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["incidents"] });
        queryClient.invalidateQueries({ queryKey: ["incidents-overview"] });
        onClose();
        Swal.fire({
          title: "Deleted!",
          text: `${incident.incidentId} has been deleted.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          customClass: { container: "!z-[99999]" },
        });
      },
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Failed to delete incident.";
        Swal.fire({
          title: "Error!",
          text: msg,
          icon: "error",
          customClass: { container: "!z-[99999]" },
        });
      },
    });
  };

  if (!isOpen) return null;

  const severityStyle = incident
    ? (SEVERITY_STYLES[incident.severity] ?? {
        label: incident.severity,
        className: "",
      })
    : null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Incident Details"
      maxWidthClass="max-w-2xl"
    >
      {isLoading ? (
        <div className="flex justify-center items-center py-14">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : isError || !incident ? (
        <div className="py-12 text-center text-red-500 text-sm">
          Failed to load incident details. Please try again.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header: ID + severity badge */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="font-mono text-xs font-bold text-[#1447E6] bg-blue-50 px-2.5 py-1 rounded">
                {incident.incidentId}
              </span>
              <h3 className="mt-2 text-base font-semibold text-slate-800">
                {incident.type}
              </h3>
            </div>
            {severityStyle && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${severityStyle.className}`}
              >
                {severityStyle.label}
              </span>
            )}
          </div>

          {/* Core details — 2-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <DetailRow
              icon={<User className="w-4 h-4" />}
              label="Reported By"
              value={incident.reportedBy}
            />
            <DetailRow
              icon={<UserCheck className="w-4 h-4" />}
              label="Assigned To"
              value={incident.assignedTo}
            />
            <DetailRow
              icon={<Server className="w-4 h-4" />}
              label="Affected System"
              value={incident.affectedSystem}
            />
            <DetailRow
              icon={<Shield className="w-4 h-4" />}
              label="Source"
              value={SOURCE_LABELS[incident.source] ?? incident.source}
            />
            <DetailRow
              icon={<Clock className="w-4 h-4" />}
              label="Detected At"
              value={new Date(incident.detectedAt).toLocaleString()}
            />
            {incident.resolvedAt && (
              <DetailRow
                icon={<CheckCircle2 className="w-4 h-4" />}
                label="Resolved At"
                value={new Date(incident.resolvedAt).toLocaleString()}
              />
            )}
            {incident.metadata?.ipAddress && (
              <DetailRow
                icon={<Wifi className="w-4 h-4" />}
                label="IP Address"
                value={
                  <span className="font-mono text-xs">
                    {incident.metadata.ipAddress}
                  </span>
                }
              />
            )}
          </div>

          {/* Description */}
          <DetailRow
            icon={<FileText className="w-4 h-4" />}
            label="Description"
            value={
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-lg p-3 border border-slate-100 mt-1">
                {incident.description}
              </p>
            }
          />

          {/* Response Summary */}
          {incident.responseSummary && (
            <DetailRow
              icon={<AlertTriangle className="w-4 h-4" />}
              label="Response Summary"
              value={
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-100 mt-1">
                  {incident.responseSummary}
                </p>
              }
            />
          )}

          {/* Status changer + delete */}
          <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100">
            {/* Inline status selector */}
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 shrink-0">
                Update Status:
              </span>
              <select
                value={incident.status}
                onChange={(e) =>
                  handleStatusChange(e.target.value as IncidentStatus)
                }
                disabled={updateStatusMutation.isPending}
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 disabled:opacity-60 transition"
              >
                <option value="OPEN">Open</option>
                <option value="INVESTIGATING">Investigating</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
              {updateStatusMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin text-blue-500 shrink-0" />
              )}
            </div>

            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed sm:w-auto"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
