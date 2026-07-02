import React, { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getConsents,
  getConsentStats,

} from "@/api/endpoints/consentManagement.api";
import type {
  ConsentLog,
  GetConsentsParams,
} from "@/api/endpoints/consentManagement.api";

import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,

  Download,
  RefreshCw,
  Eye,

} from "lucide-react";
import DatePicker from "@/components/shared/DatePicker";


import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import Swal from "sweetalert2";

// ─── Display Maps ─────────────────────────────────────────────────────────────

const TYPE_OPTIONS = ["DATA_PROCESSING", "MARKETING", "TERMS_OF_SERVICE"];
const STATUS_OPTIONS = ["ACCEPTED", "PENDING", "REJECTED"];
const SOURCE_OPTIONS = ["WEB", "MOBILE", "CLINIC"];
const ROLE_OPTIONS = ["PATIENT", "DOCTOR", "EMPLOYEE", "ADMIN"];

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value?: number;
  icon?: ReactNode;
  className?: string;
}
function StatCard({ label, value,  }: StatCardProps) {
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
        {/* <div className="bg-gray-100 rounded-md h-8 w-8 flex items-center justify-center">
          {icon}
        </div> */}
      </div>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return "?";
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold shrink-0">
      {getInitials(name || "?")}
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ConsentManagementPage() {
  // Filter state
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const limit = 10;

  // Build query params — only include truthy filter values
  const queryParams: GetConsentsParams = {
    page,
    limit,
    ...(search.trim() && { search: search.trim() }),
    ...(role && { role }),
    ...(type && { type }),
    ...(status && { status }),
    ...(source && { source }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  // ── Data fetching ──────────────────────────────────────────────────────────

  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["consents-stats"],
    queryFn: getConsentStats,
  });
  console.log(statsData)

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["consents", queryParams],
    queryFn: () => getConsents(queryParams),
    placeholderData: (prev) => prev,
  });
  console.log(data)

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
  setIsExporting(true);
  try {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

    // ── Header ────────────────────────────────────────────────
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("Consent Management Report", 40, 40);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, 58);
    doc.text(`Total records: ${meta?.total ?? consentLogs.length}`, 40, 72);

    // ── Stat summary (optional, custom box) ──────────────────
    if (stats) {
      const statY = 95;
      const statBoxes = [
        { label: "Total", value: stats.total },
        { label: "Granted", value: stats.granted },
        { label: "Pending", value: stats.pending },
        { label: "Revoked", value: stats.revoked },
      ];
      statBoxes.forEach((box, i) => {
        const x = 40 + i * 140;
        doc.setFillColor(241, 245, 249); // slate-100
        doc.roundedRect(x, statY, 120, 50, 6, 6, "F");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(box.label.toUpperCase(), x + 12, statY + 18);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(String(box.value ?? "—"), x + 12, statY + 38);
        doc.setFont("helvetica", "normal");
      });
    }

    // ── Table ─────────────────────────────────────────────────
    autoTable(doc, {
      startY: stats ? 165 : 90,
      head: [["User Name", "Email", "Type", "Status", "Source", "Consent Date"]],
      body: consentLogs.map((item) => [
        item.userName,
        item.email,
        item.type,
        item.status,
        item.source,
        item.consentDate ? new Date(item.consentDate).toLocaleDateString() : "—",
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 6,
        textColor: [71, 85, 105], // slate-600
      },
      headStyles: {
        fillColor: [15, 23, 42], // slate-900
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // slate-50
      },
      // Color-coded status column (custom cell styling)
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 3) {
          const status = String(data.cell.raw).toUpperCase();
          const colorMap: Record<string, [number, number, number]> = {
            ACCEPTED: [22, 163, 74],
            PENDING: [202, 138, 4],
            REJECTED: [220, 38, 38],
            REVOKED: [220, 38, 38],
          };
          if (colorMap[status]) {
            data.cell.styles.textColor = colorMap[status];
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
    });


     const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - 80,
        doc.internal.pageSize.getHeight() - 20
      );
    }

    doc.save(`consents-${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Export failed",
      text: "Could not export consents. Please try again.",
    });
  } finally {
    setIsExporting(false);
  }
};


  // ── Derived values ─────────────────────────────────────────────────────────

  const stats = statsData;
  const consentLogs = data?.data ?? [];
  const meta = data?.meta;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="w-full p-4 md:p-8">
      {/* ── Overview Stat Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Total Consents"
          value={statsLoading ? undefined : stats?.total}
          // icon={<FileText className="w-4 h-4 text-gray-600" />}
        />
        <StatCard
          label="Granted"
          value={statsLoading ? undefined : stats?.granted}
          // icon={<CheckCircle className="w-4 h-4 text-green-600" />}
        />
        <StatCard
          label="Pending"
          value={statsLoading ? undefined : stats?.pending}
          // icon={<Clock className="w-4 h-4 text-yellow-600" />}
        />
        <StatCard
          label="Revoked"
          value={statsLoading ? undefined : stats?.revoked}
          // icon={<XCircle className="w-4 h-4 text-red-600" />}
        />
      </div>

      {/* ── Section Header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-800">
          Consent Management 
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
            {isFetching ? "Refreshing..." : "Refresh"}
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export PDF
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
            placeholder="Search by name, email"
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
          <option value="">All Roles</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            handleFilterChange();
          }}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition min-w-[110px]"
        >
          <option value="">All Types</option>
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            handleFilterChange();
          }}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition min-w-[120px]"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            handleFilterChange();
          }}
          className="px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition min-w-[120px]"
        >
          <option value="">All Sources</option>
          {SOURCE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <DatePicker
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            handleFilterChange();
          }}
          placeholder="Start Date"
          wrapperClassName="w-[165px]"
        />

        <DatePicker
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            handleFilterChange();
          }}
          placeholder="End Date"
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
              Failed to load consents. Please try again.
            </p>
          </div>
        ) : consentLogs.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-sm text-slate-400">
              No consents match your filters.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {[
                      "User Name",
                      "Email",
                      "Type",
                      "Status",
                      "Source",
                      "Consent Date",
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
                  {consentLogs.map((item: ConsentLog) => {
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

                        {/* Email */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          {item.email}
                        </td>

                        {/* Type */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          {item.type}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                              {
                                ACCEPTED: "bg-green-50 text-green-600",
                                PENDING: "bg-yellow-50 text-yellow-600",
                                REJECTED: "bg-red-50 text-red-600",
                                REVOKED: "bg-red-50 text-red-600",
                              }[item.status?.toUpperCase()] ??
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* Source */}
                        <td className="px-5 py-4 whitespace-nowrap text-slate-500">
                          {item.source}
                        </td>

                        {/* Consent Date */}
                        <td className="px-5 py-4 whitespace-nowrap text-slate-500">
                          {item.consentDate ? new Date(item.consentDate).toLocaleDateString() : "—"}
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <button
                            onClick={() => console.log('View details for', item)}
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
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
              <span className="text-sm text-slate-500">
                {meta
                  ? `Showing ${(meta.page - 1) * meta.limit + 1}–${Math.min(
                      meta.page * meta.limit,
                      meta.total,
                    )} of ${meta.total} logs`
                  : "Showing 0 of 0 logs"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!meta || page === 1}
                  className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-slate-700">
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
   
    </div>
  );
}
