import { useQuery } from "@tanstack/react-query";
import { getRequestRecordById } from "@/api/endpoints/requestRecords.api";

import Dialog from "@/components/shared/Dialog";
import {
  Loader2,
  User,
  Mail,
  Calendar,
  FileText,
  ShieldCheck,
  Activity
} from "lucide-react";

interface RequestRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: string | null;
}

export default function RequestRecordModal({
  isOpen,
  onClose,
  recordId,
}: RequestRecordModalProps) {
  // Fetch Record
  const {
    data: record,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["request-record", recordId],
    queryFn: () => getRequestRecordById(recordId as string),
    enabled: !!recordId && isOpen,
  });

  if (!isOpen) return null;

  const formatRequestType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Record Details"
      maxWidthClass="max-w-2xl"
    >
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : isError || !record ? (
        <div className="py-10 text-center text-red-500 text-sm">
          Failed to load record details. Please try again.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Patient Details Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Patient Information</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-white p-2 rounded-lg shadow-sm border border-slate-100 text-blue-500">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-0.5">Patient Name</p>
                  <p className="text-sm font-medium text-slate-800">{record.firstName} {record.lastName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-white p-2 rounded-lg shadow-sm border border-slate-100 text-amber-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-500 mb-0.5">Email Address</p>
                  <p className="text-sm font-medium text-slate-800 break-all">{record.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-white p-2 rounded-lg shadow-sm border border-slate-100 text-green-500">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-0.5">Date of Birth</p>
                <p className="text-sm font-medium text-slate-800">
                  {record.dob ? new Date(record.dob).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Request Details Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Request Details</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-blue-50 p-2 rounded-lg text-blue-600">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-0.5">Request Type</p>
                  <p className="text-sm font-medium text-slate-800">{formatRequestType(record.requestType)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-indigo-50 p-2 rounded-lg text-indigo-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-0.5">Consent</p>
                  <p className="text-sm font-medium text-slate-800">{record.consent ? "Granted" : "Not Granted"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-teal-50 p-2 rounded-lg text-teal-600">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                      record.status === 'PENDING'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : record.status === 'REVIEWED'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <div className="mt-0.5 bg-slate-100 p-2 rounded-lg text-slate-600">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 mb-1">Additional Notes</p>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-4">
                  <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                    {record.additionalNotes || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
