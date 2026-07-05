import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { DollarSign, Eye, Repeat } from "lucide-react";
import RecentActivityDetailModal from "./RecentActivityDetailModal";
import AssignDoctorModal from "./AssignDoctorModal";
import { type Assessment } from "@/api/endpoints/dashboard/patientManagement";
import { getRecentActivity } from "@/api/endpoints/dashboard/overview";

function Avatar({
  image,
  name,
  size = "sm",
}: {
  image: string | null;
  name: string | null;
  size?: "sm" | "lg";
}) {
  const dim = size === "lg" ? "h-14 w-14" : "h-8 w-8";
  if (image)
    return (
      <img
        src={image}
        alt={name ?? ""}
        className={`${dim} rounded-full object-cover shrink-0`}
      />
    );
  return (
    <div
      className={`${dim} rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={size === "lg" ? "w-8 h-8" : "w-5 h-5"}
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="4" fill="#94a3b8" />
        <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" fill="#94a3b8" />
      </svg>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status ? status.toUpperCase() : "PENDING";
  
  const displayStatus = (status || "Pending")
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  if (s === "APPROVED" || s === "ACCEPTED" || s === "COMPLETED")
    return (
      <span className="inline-block rounded-lg bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#016630]">
        {displayStatus}
      </span>
    );
  if (s === "DECLINED" || s === "REJECTED")
    return (
      <span className="inline-block rounded-lg bg-[#FFE2E2] px-3 py-1 text-xs font-medium text-[#9F0712]">
        {displayStatus}
      </span>
    );
  if (s === "REQUESTED REFILL")
    return (
      <span className="inline-block rounded-lg bg-[#EFF6FF] px-3 py-1 text-xs font-medium text-[#3B82F6]">
        {displayStatus}
      </span>
    );
    
  return (
    <span className="inline-block rounded-lg bg-[#FFEDD4] px-3 py-1 text-xs font-medium text-[#9F2D00]">
      {displayStatus}
    </span>
  );
}

export function PatientTable() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // const { data, isLoading } = useQuery({
  //   queryKey: ["assessments"],
  //   queryFn: () => getAllAssessments(),
  // });
  const { data, isLoading } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: () => getRecentActivity(),
  });
  console.log(data);
  const [selected, setSelected] = useState<Assessment | null>(null);
  const [assigningAssessment, setAssigningAssessment] =
    useState<Assessment | null>(null);

  const shouldShowAssignButton = (row: Assessment) => {
    return !row.provider;
  };

  return (
    <>
      {/* ── Mobile card view (< md) ─────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {isLoading && (
          <div className="text-center py-10 text-slate-400 text-sm">Loading...</div>
        )}
        {!isLoading && (!data || data.length === 0) && (
          <div className="text-center py-10 text-slate-400 text-sm">No recent activity</div>
        )}
        {data?.map((row: any) => {
          const showAssign = shouldShowAssignButton(row);
          return (
            <div
              key={row.submissionId}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3"
            >
              {/* Top row: patient + status */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar image={row.patientImage} name={row.patientName} />
                  <span className="font-semibold text-slate-800 text-sm truncate">
                    {row.patientName ?? "—"}
                  </span>
                </div>
                <StatusBadge status={row.status} />
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-400 font-medium mb-0.5">Assessment</p>
                  <p className="text-slate-700 font-medium">{row.categoryName ?? "—"}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium mb-0.5">Patient Type</p>
                  <div>
                    {row.patientType === "New Patient" ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#DBEAFE] px-2 py-0.5 text-xs font-medium text-[#2563EB]">
                        New
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#F3E8FF] px-2 py-0.5 text-xs font-medium text-[#6E11B0]">
                        <Repeat size={10} /> Repeat
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 font-medium mb-0.5">Provider</p>
                  <p className="text-slate-700 font-medium">{row.provider ?? "—"}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium mb-0.5">Payment</p>
                  <p className="text-slate-700 font-medium flex items-center gap-0.5">
                    <DollarSign className="w-3 h-3" />{row.payment}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 font-medium mb-0.5">Date</p>
                  <p className="text-slate-500">
                    {new Date(row.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors"
                  onClick={() => setSelected(row)}
                >
                  <Eye size={13} /> View
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (showAssign) {
                      setAssigningAssessment(row);
                    } else {
                      sessionStorage.setItem("currentPatientName", row.patientName || "");
                      sessionStorage.setItem("currentPatientImage", row.patientImage || "");
                      navigate({
                        to: "/dashboard/patient-management/$assessmentId/preview",
                        params: { assessmentId: row.submissionId },
                      });
                    }
                  }}
                  className={
                    showAssign
                      ? "flex-1 py-2 rounded-lg bg-[#1447E6] text-white text-xs font-medium hover:bg-[#1338C3] transition-colors"
                      : "flex-1 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors"
                  }
                >
                  {showAssign ? "Assign" : "View Details"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Desktop table (md+) ──────────────────────────────────── */}
      <div className="hidden md:block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 font-medium text-slate-500 text-sm">
                  Patient
                </th>
                <th className="px-6 py-3 font-medium text-slate-500 text-sm">
                  Assessment
                </th>
                <th className="px-6 py-3 font-medium text-slate-500 text-sm">
                  Patient Type
                </th>
                <th className="px-6 py-3 font-medium text-slate-500 text-sm">
                  Payment
                </th>
                <th className="px-6 py-3 font-medium text-slate-500 text-sm">
                  Provider
                </th>
                <th className="px-6 py-3 font-medium text-slate-500 text-sm">
                  Status
                </th>
                <th className="px-6 py-3 font-medium text-slate-500 text-sm">
                  Date
                </th>
                <th className="px-6 py-3 font-medium text-slate-500 text-sm text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    Loading...
                  </td>
                </tr>
              )}
              {!isLoading && (!data || data.length === 0) && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No recent activity
                  </td>
                </tr>
              )}
              {data?.map((row: any) => {
                const showAssign = shouldShowAssignButton(row);
                return (
                  <tr
                    key={row.submissionId}
                    className="border-b border-slate-100 last:border-b-0"
                  >
                    {/* Patient */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          image={row.patientImage}
                          name={row.patientName}
                        />
                        <span className="font-medium text-slate-700 whitespace-nowrap">
                          {row.patientName ?? "—"}
                        </span>
                      </div>
                    </td>

                    {/* Assessment */}
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {row.categoryName}
                    </td>

                    {/* Patient Type */}
                    <td className="px-6 py-4">
                      {row.patientType === "New Patient" ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#2563EB] whitespace-nowrap">
                          New Patient
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-[#F3E8FF] px-3 py-1 text-xs font-medium text-[#6E11B0] whitespace-nowrap">
                          <Repeat size={12} />
                          Repeat Patient
                        </span>
                      )}
                    </td>
                    {/* payment */}
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className="w-3 h-3" /><span>{row.payment}</span>
                      </div>
                    </td>
                    {/* Provider */}
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {row.provider ?? "—"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={row.status} />
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      {new Date(row.date).toLocaleDateString("en-US", {
                        year: "2-digit",
                        month: "numeric",
                        day: "numeric",
                      })}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          type="button"
                          className="text-slate-600 hover:text-slate-800 transition-colors"
                          aria-label={`View ${row.patientName}`}
                          onClick={() => setSelected(row)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (showAssign) {
                              setAssigningAssessment(row);
                            } else {
                              sessionStorage.setItem(
                                "currentPatientName",
                                row.patientName || "",
                              );
                              sessionStorage.setItem(
                                "currentPatientImage",
                                row.patientImage || "",
                              );
                              navigate({
                                to: "/dashboard/patient-management/$assessmentId/preview",
                                params: { assessmentId: row.submissionId },
                              });
                            }
                          }}
                          className={
                            showAssign
                              ? "rounded-lg bg-[#1447E6] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#1338C3] transition-colors whitespace-nowrap min-w-[100px]"
                              : "rounded-lg bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors whitespace-nowrap min-w-[100px]"
                          }
                        >
                          {showAssign ? "Assign" : "View Details"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <RecentActivityDetailModal
        activity={selected}
        onClose={() => setSelected(null)}
      />
      <AssignDoctorModal
        isOpen={!!assigningAssessment}
        onClose={() => {
          setAssigningAssessment(null);
          queryClient.invalidateQueries({ queryKey: ["recent-activity"] });
          queryClient.invalidateQueries({ queryKey: ["assessments"] });
        }}
        assessment={assigningAssessment}
      />
    </>
  );
}
