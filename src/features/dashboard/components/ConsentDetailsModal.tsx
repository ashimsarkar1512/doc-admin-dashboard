
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConsentById,

  deleteConsent,
} from "@/api/endpoints/consentManagement.api";
import Dialog from "@/components/shared/Dialog";
import {
  Loader2,
  Trash2,
  X,

  User,
  Mail,
  Activity,
  Globe,
  Smartphone,

  Clock,
  ShieldAlert,

} from "lucide-react";
import Swal from "sweetalert2";

interface ConsentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  consentId: string | null;
}

export default function ConsentDetailsModal({
  isOpen,
  onClose,
  consentId,
}: ConsentDetailsModalProps) {
  const queryClient = useQueryClient();

  const {
    data: consent,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["consent", consentId],
    queryFn: () => getConsentById(consentId as string),
    enabled: !!consentId && isOpen,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteConsent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consents"] });
      queryClient.invalidateQueries({ queryKey: ["consents-stats"] });
      onClose();
      Swal.fire({
        title: "Deleted!",
        text: "The consent log has been deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        customClass: { container: "!z-[99999]" },
      });
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to delete consent.";
      Swal.fire({
        title: "Error!",
        text: msg,
        icon: "error",
        customClass: { container: "!z-[99999]" },
      });
    },
  });

  const handleDelete = async () => {
    if (!consent) return;
    const result = await Swal.fire({
      title: "Delete Consent Log?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#dc2626",
      customClass: { container: "!z-[99999]" },
    });
    if (result.isConfirmed) {
      deleteMutation.mutate(consent.id);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Consent Details"
      maxWidthClass="max-w-2xl"
    >
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : isError || !consent ? (
        <div className="py-10 text-center text-red-500 text-sm">
          Failed to load consent details. Please try again.
        </div>
      ) : (
        <div className="space-y-6">
          {/* User Details Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">User Information</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-white p-2 rounded-lg shadow-sm border border-slate-100 text-blue-500">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-0.5">User Name</p>
                  <p className="text-sm font-medium text-slate-800">{consent.userName || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-white p-2 rounded-lg shadow-sm border border-slate-100 text-amber-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-500 mb-0.5">Email Address</p>
                  <p className="text-sm font-medium text-slate-800 break-all">{consent.email || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Consent Details Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Consent Information</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-indigo-50 p-2 rounded-lg text-indigo-600">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-0.5">Consent Type</p>
                  <p className="text-sm font-medium text-slate-800 capitalize">
                    {consent.type?.replace(/_/g, " ").toLowerCase() || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-blue-50 p-2 rounded-lg text-blue-600">
                  {consent.source?.toUpperCase() === "MOBILE" ? (
                    <Smartphone className="w-4 h-4" />
                  ) : (
                    <Globe className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-0.5">Source</p>
                  <p className="text-sm font-medium text-slate-800 capitalize">
                    {consent.source?.toLowerCase() || "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-slate-100 p-2 rounded-lg text-slate-600">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-0.5">Consent Date</p>
                  <p className="text-sm font-medium text-slate-800">{formatDate(consent.consentDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-teal-50 p-2 rounded-lg text-teal-600">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Status</p>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                    {consent.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-red-100 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete
            </button>
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-medium text-sm"
            >
              <X className="w-4 h-4" /> Close
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
