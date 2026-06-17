


import { X } from "lucide-react";
import type { AuditLog, AuditLogStatus } from "@/api/endpoints/auditLogs.api";

const STATUS_STYLES: Record<AuditLogStatus, { label: string; className: string }> = {
  SUCCESS: {
    label: "Success",
    className: "bg-green-50 text-green-600 border border-green-200",
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-50 text-red-600 border border-red-200",
  },
};

const FALLBACK_STATUS_STYLE = {
  label: "Unknown",
  className: "bg-slate-100 text-slate-500 border border-slate-200",
};

interface DetailRowProps {
  label: string;
  children: React.ReactNode;
}

function DetailRow({ label, children }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-1 py-3 border-b border-slate-100 last:border-b-0">
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm text-slate-700">{children}</span>
    </div>
  );
}

interface AuditLogDetailModalProps {
  log: AuditLog | null;
  onClose: () => void;
}

export default function Auditlogdetailmodal({
  log,
  onClose,
}: AuditLogDetailModalProps) {
  if (!log) return null;

  const statusStyle = STATUS_STYLES[log.status] ?? FALLBACK_STATUS_STYLE;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-800">
            Activity Log Details
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-2">
          <DetailRow label="User Name">{log.userName}</DetailRow>
          <DetailRow label="User Role">{log.userRole}</DetailRow>
          <DetailRow label="Activity Type">{log.activityType}</DetailRow>
          <DetailRow label="Event">{log.event}</DetailRow>
          <DetailRow label="IP Address">{log.ipAddress ?? "—"}</DetailRow>
          <DetailRow label="Status">
            <span
              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.className}`}
            >
              {statusStyle.label}
            </span>
          </DetailRow>
          <DetailRow label="Created At">
            {new Date(log.createdAt).toLocaleString()}
          </DetailRow>
          <DetailRow label="Updated At">
            {new Date(log.updatedAt).toLocaleString()}
          </DetailRow>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}