// import {  useState,  } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import {
  getAuditLogs,
  getAuditLogsStats,
  exportAuditLogs,
} from "@/api/endpoints/auditLogs.api";
import type {
  AuditLog,
  AuditLogStatus,
  GetAuditLogsParams,
} from "@/api/endpoints/auditLogs.api";
// import AuditLogDetailModal from "./AuditLogDetailModal";

import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Download,
  RefreshCw,
  Eye,
  ShieldAlert,
  ActivityIcon,
  UsersRound,
  Database,
} from "lucide-react";
import DatePicker from "@/components/shared/DatePicker";

import Auditlogdetailmodal from "./components/auditLogPageComponent/Auditlogdetailmodal ";

// Static dropdown options — swagger has no dedicated "options" endpoint,
// so these are derived from the values seen in the audit log data.
const ROLE_OPTIONS = ["Admin", "ADMIN"];
const ACTIVITY_TYPE_OPTIONS = ["Login", "Record Edit"];

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value?: number;
  icon?: ReactNode;
  className?: string;
}
function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-slate-900 text-white rounded-xl px-6 py-5 flex flex-col gap-2">
      <div className="flex justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-3xl font-bold">
            {value === undefined ? (
              <span className="text-slate-600 text-xl animate-pulse">—</span>
            ) : (
              value
            )}
          </p>
        </div>
        <div className="bg-gray-100 rounded-md h-8 w-8 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function getInitials(name: string | null) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold shrink-0">
      {getInitials(name || "?")}
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function AuditLogsPage() {
  // Add at the top of the component, after existing useState declarations:
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // Filter state
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("");
  const [activityType, setActivityType] = useState<string>("");
  const [status, setStatus] = useState<AuditLogStatus | "">("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [page, setPage] = useState(1);
  const [isExporting] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const limit = 10;

  // Build query params — only include truthy filter values
  const queryParams: GetAuditLogsParams = {
    page,
    limit,
    ...(debouncedSearch && { search: debouncedSearch }), // ← changed
    ...(role && { role }),
    ...(activityType && { activityType }),
    ...(status && { status }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  // this debunce for type search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);
  // ── Data fetching ──────────────────────────────────────────────────────────

  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["audit-logs-stats"],
    queryFn: getAuditLogsStats,
  });

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["audit-logs", queryParams],
    queryFn: () => getAuditLogs(queryParams),
    placeholderData: (prev) => prev,
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleFilterChange = () => setPage(1);

  const handleRefresh = () => {
    refetch();
    refetchStats();
  };

  const handleExport = async () => {
    try {
      const blob = await exportAuditLogs({
        search,
        role,
        activityType,
        status,
        startDate,
        endDate,
      });

      // 👇 file download trigger
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // filename (optional - backend থেকেও parse করতে পারো)
      link.download = "audit-logs.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      refetchStats();
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  // ── Derived values ─────────────────────────────────────────────────────────

  const stats = statsData;
  const auditLog = data?.data ?? [];
  const meta = data?.meta;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="w-full p-4 md:p-8">
      {/* ── Overview Stat Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Total Activities"
          value={statsLoading ? undefined : stats?.totalActivities}
          icon={<ActivityIcon className="w-4 h-4 text-gray-600" />}
        />
        <StatCard
          label="Failed Logins"
          value={statsLoading ? undefined : stats?.failedLogins}
          icon={<ShieldAlert className="w-4 h-4 text-gray-600" />}
        />
        <StatCard
          label="Active Sessions"
          value={statsLoading ? undefined : stats?.activeSessions}
          icon={<UsersRound className="w-4 h-4 text-gray-600" />}
        />
        <StatCard
          label="Data Exports"
          value={statsLoading ? undefined : stats?.dataExports}
          icon={<Database className="w-4 h-4 text-gray-600" />}
        />
      </div>

      {/* ── Section Header ───────────────────────────────────────────────── */}
     <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
  
  <h2 className="text-base font-semibold text-slate-800 text-center md:text-left">
    All Activity Logs
  </h2>

  <div className="flex items-center justify-center md:justify-end gap-2 flex-wrap">
    <button
      type="button"
      onClick={handleRefresh}
      className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
    >
      <RefreshCw
        className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
      />
      <span className="hidden sm:inline">
        {isFetching ? "Refreshing..." : "Refresh"}
      </span>
    </button>

    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span className="hidden sm:inline">Export CSV</span>
    </button>
  </div>
</div>

      {/* ── Filter Row ────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6"
      >
        <div className="relative flex-1 min-w-0 md:max-w-7xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email,"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
          />
        </div>

        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            handleFilterChange();
          }}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition min-w-[110px]"
        >
          <option value="">All Role</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={activityType}
          onChange={(e) => {
            setActivityType(e.target.value);
            handleFilterChange();
          }}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition min-w-[110px]"
        >
          <option value="">All Type</option>
          {ACTIVITY_TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as AuditLogStatus | "");
            handleFilterChange();
          }}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition min-w-[120px]"
        >
          <option value="">All Status</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
        </select>

        <DatePicker
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            handleFilterChange();
          }}
          placeholder="2026-06-01"
          wrapperClassName="w-[160px]"
        />

        <DatePicker
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            handleFilterChange();
          }}
          placeholder="//-//-//"
          wrapperClassName="w-[160px]"
        />
      </form>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm">
              Failed to load audit logs. Please try again.
            </p>
          </div>
        ) : auditLog.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-sm text-slate-400">
              No audit logs match your filters.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {[
                      "User Name",
                      "Role",
                      "Timestamp",
                      "Activity Type",
                      "Event",
                      "IP Address",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLog.map((item: AuditLog) => {
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        {/* User Name */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={item.userName} />
                            <span className="font-medium text-slate-800">
                              {item.userName}
                            </span>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                              {
                                PATIENT: "bg-blue-50 text-blue-600",
                                DOCTOR: "bg-purple-50 text-purple-600",
                                EMPLOYEE: "bg-amber-50 text-amber-600",
                                ADMIN: "bg-sky-100 text-sky-700",
                              }[item.userRole?.toUpperCase()] ??
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {item.userRole}
                          </span>
                        </td>

                        {/* Timestamp */}
                        <td className="px-5 py-4 whitespace-nowrap text-slate-500">
                          {new Date(item.createdAt).toLocaleString()}
                        </td>

                        {/* Activity Type */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          {item.activityType}
                        </td>

                        {/* Event */}
                        <td className="px-5 py-4 whitespace-nowrap text-slate-600 max-w-[180px] truncate">
                          {item.event}
                        </td>

                        {/* IP Address */}
                        <td className="px-5 py-4 whitespace-nowrap text-slate-500">
                          {item.ipAddress ?? "—"}
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedLog(item)}
                            title="View Details"
                            className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination — always visible; buttons disabled when not applicable */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 md:px-6  py-4 border-t border-slate-200">
              <span className="text-xs md:text-sm text-slate-500 text-center md:text-left">
                {meta
                  ? `Showing ${(meta.page - 1) * meta.limit + 1}–${Math.min(
                      meta.page * meta.limit,
                      meta.total,
                    )} of ${meta.total} logs`
                  : "Showing 0 of 0 logs"}
              </span>

              <div className="flex items-center justify-center md:justify-end gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!meta || page === 1}
                  className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-xs md:text-sm font-medium text-slate-700">
                  Page {meta?.page ?? page} of {meta?.totalPages ?? 1}
                </span>

                <button
                  onClick={() =>
                    setPage((p) => Math.min(meta?.totalPages ?? p, p + 1))
                  }
                  disabled={!meta || page === meta.totalPages}
                  className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Detail Modal ──────────────────────────────────────────────────── */}
      <Auditlogdetailmodal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
