import { useState, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  ChevronDown,
  Eye,
  Ban,
  Trash2,
  UserCircle2,
  CheckCircle2,
  FileDown,
  DollarSign,
} from "lucide-react";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  getPatients,
  updatePatientStatus,
} from "@/api/endpoints/dashboard/patientManagement";
import type {
  Patient,
  GetPatientsResponse,
} from "@/api/endpoints/dashboard/patientManagement";
import ViewPatientModal from "../components/ViewPatientModal";

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Banned", value: "BANNED" },
  { label: "Blocked", value: "BLOCKED" },
  { label: "Disabled", value: "DISABLED" },
  { label: "Deleted", value: "DELETED" },
];

const PAGE_SIZE = 10;

function StatusBadge({ status }: { status: string }) {
  if (status === "ACTIVE") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#EEF2FF] px-3 py-1 text-[11px] font-medium text-[#1447E6]">
        Active
      </span>
    );
  }
  if (status === "BANNED") {
    return (
      <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-[11px] font-medium text-rose-600">
        Banned
      </span>
    );
  }
  if (status === "BLOCKED") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-[11px] font-medium text-amber-600">
        Blocked
      </span>
    );
  }
  if (status === "DELETED") {
    return (
      <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-[11px] font-medium text-red-600">
        Deleted
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
      {status || "Disabled"}
    </span>
  );
}

export default function AllPatientsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewPatientId, setViewPatientId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );
  const debounce = useCallback(
    (setter: (v: string) => void, value: string, key: string) => {
      if (debounceTimers.current[key]) {
        clearTimeout(debounceTimers.current[key]);
      }
      debounceTimers.current[key] = setTimeout(() => {
        setter(value);
        setCurrentPage(1);
      }, 400);
    },
    [],
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debounce(setDebouncedSearch, value, "search");
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["patients", currentPage, debouncedSearch, statusFilter],
    queryFn: () =>
      getPatients({
        page: currentPage,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const patients = data?.data ?? [];
  console.log(patients);
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // const handleStatusUpdate = (id: string, newStatus: string, name: string, actionText: string) => {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: `Do you want to ${actionText.toLowerCase()} ${name}?`,
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: newStatus === 'ACTIVE' ? '#10b981' : '#ef4444',
  //     cancelButtonColor: '#64748b',
  //     confirmButtonText: `Yes, ${actionText}!`,
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         await updatePatientStatus(id, newStatus);
  //         Swal.fire('Success!', `${name} has been ${actionText.toLowerCase()}d.`, 'success');
  //         queryClient.invalidateQueries({ queryKey: ['patients'] });
  //       } catch (error) {
  //         const message = error instanceof Error ? error.message : `Failed to ${actionText.toLowerCase()} patient`;
  //         Swal.fire('Error!', message, 'error');
  //       }
  //     }
  //   });
  // };

  const handleStatusUpdate = (
    id: string,
    newStatus: string,
    name: string,
    actionText: string,
  ) => {
    const isDelete = newStatus === "DELETED";

    Swal.fire({
      title: "Are you sure?",
      text: isDelete
        ? `Do you want to ${actionText.toLowerCase()} ${name}? This will deactivate the record and hide it from active use. You can restore it later if needed.`
        : `Do you want to ${actionText.toLowerCase()} ${name}? You can undo this action later.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: newStatus === "ACTIVE" ? "#10b981" : "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: `Yes, ${actionText}!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updatePatientStatus(id, newStatus);
          Swal.fire(
            "Success!",
            `${name} has been ${actionText.toLowerCase()}d.`,
            "success",
          );
          queryClient.invalidateQueries({ queryKey: ["patients"] });
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : `Failed to ${actionText.toLowerCase()} patient`;
          Swal.fire("Error!", message, "error");
        }
      }
    });
  };

  // const handleExport = () => {
  //   setIsExporting(true);

  //   getPatients({
  //     limit: 1000,
  //     search: debouncedSearch || undefined,
  //     status: statusFilter || undefined,
  //   }).then((allData: GetPatientsResponse) => {
  //     const exportPatients = allData.data ?? [];

  //     const doc = new jsPDF({
  //       orientation: 'landscape',
  //       unit: 'mm',
  //       format: 'a4'
  //     });

  //     // Add background header color
  //     doc.setFillColor(30, 41, 59); // slate-800 (#1E293B)
  //     doc.rect(0, 0, 297, 40, 'F');

  //     // Add Title
  //     doc.setFontSize(24);
  //     doc.setTextColor(255, 255, 255);
  //     doc.text('Patient Management Report', 14, 20);

  //     // Add Subtitle/Info in Header
  //     doc.setFontSize(10);
  //     doc.setTextColor(203, 213, 225); // slate-300
  //     const generatedDate = new Date().toLocaleString();
  //     doc.text(`Generated on: ${generatedDate}`, 14, 28);
  //     doc.text(`Total Patients Found: ${exportPatients.length}`, 14, 33);

  //     // Filters badge area
  //     if (statusFilter || debouncedSearch) {
  //       doc.setFontSize(9);
  //       let filterStr = 'Filters Applied: ';
  //       if (statusFilter) filterStr += `Status: ${statusFilter}  `;
  //       if (debouncedSearch) filterStr += `Search: "${debouncedSearch}"`;
  //       doc.text(filterStr, 14, 37);
  //     }

  //     const tableColumn = ["#", "Patient Name", "Email Address", "Contact Number", "Consultations", "Status", "Joining Date"];
  //     const tableRows = exportPatients.map((p: Patient, index: number) => [
  //       index + 1,
  //       p.name,
  //       p.email,
  //       p.contactNumber,
  //       String(p.activeConsultation).padStart(2, '0'),
  //       p.status,
  //       new Date(p.joiningDate).toLocaleDateString(),
  //     ]);

  //     autoTable(doc, {
  //       head: [tableColumn],
  //       body: tableRows,
  //       startY: 45,
  //       theme: 'striped',
  //       styles: {
  //         fontSize: 10,
  //         cellPadding: 2,
  //         valign: 'middle',
  //         font: 'helvetica',
  //         textColor: [51, 65, 85] // slate-700
  //       },
  //       headStyles: {
  //         fillColor: [241, 245, 249], // slate-100
  //         textColor: [71, 85, 105], // slate-600
  //         fontStyle: 'bold',
  //         halign: 'left',
  //         lineWidth: 0.1,
  //         lineColor: [226, 232, 240] // slate-200
  //       },
  //       columnStyles: {
  //         0: { halign: 'center', cellWidth: 10 },
  //         1: { fontStyle: 'bold', textColor: [30, 41, 59] }, // Name in slate-800
  //         4: { halign: 'center' },
  //         5: { halign: 'center' },
  //         6: { halign: 'center' }
  //       },
  //       alternateRowStyles: {
  //         fillColor: [250, 251, 252]
  //       },
  //       margin: { top: 45, bottom: 20 },
  //       didDrawPage: (data) => {
  //         // Footer
  //         const pageSize = doc.internal.pageSize;
  //         const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
  //         const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();

  //         doc.setFontSize(9);
  //         doc.setTextColor(148, 163, 184); // text-slate-400

  //         // Page Number
  //         const str = `Page ${data.pageNumber} of ${doc.internal.pages.length - 1}`;
  //         doc.text(str, data.settings.margin.left, pageHeight - 10);

  //         // Confidentiality Note
  //         doc.text('Confidential Patient Document - DocDashboard', pageWidth - 14, pageHeight - 10, { align: 'right' });
  //       }
  //     });

  //     doc.save(`patients_report_${new Date().toISOString().split('T')[0]}.pdf`);
  //     setIsExporting(false);
  //   }).catch((error) => {
  //     console.error('Export error:', error);
  //     setIsExporting(false);
  //     // Only use Swal for errors as a fallback since it's important
  //     Swal.fire('Error', 'Failed to export patients data', 'error');
  //   });
  // };

  const handleExport = () => {
    setIsExporting(true);

    getPatients({
      limit: 1000,
      search: debouncedSearch || undefined,
      status: statusFilter || undefined,
    })
      .then((allData: GetPatientsResponse) => {
        const exportPatients = allData.data ?? [];

        const doc = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        // Add background header gradient (simulated)
        const startColor = [44, 97, 91]; // #2c615b
        const midColor = [93, 142, 135]; // #5d8e87
        const endColor = [24, 49, 44]; // #18312c

        const steps = 40;

        for (let i = 0; i < steps; i++) {
          let r, g, b;

          if (i < steps / 2) {
            const t = i / (steps / 2);
            r = startColor[0] + (midColor[0] - startColor[0]) * t;
            g = startColor[1] + (midColor[1] - startColor[1]) * t;
            b = startColor[2] + (midColor[2] - startColor[2]) * t;
          } else {
            const t = (i - steps / 2) / (steps / 2);
            r = midColor[0] + (endColor[0] - midColor[0]) * t;
            g = midColor[1] + (endColor[1] - midColor[1]) * t;
            b = midColor[2] + (endColor[2] - midColor[2]) * t;
          }

          doc.setFillColor(r, g, b);
          doc.rect(0, i, 297, 1, "F");
        }

        // Add Title
        doc.setFontSize(24);
        doc.setTextColor(255, 255, 255);
        doc.text("Patient Management Report", 14, 20);

        // Add Subtitle/Info in Header
        doc.setFontSize(10);
        doc.setTextColor(203, 213, 225); // slate-300
        const generatedDate = new Date().toLocaleString();
        doc.text(`Generated on: ${generatedDate}`, 14, 28);
        doc.text(`Total Patients Found: ${exportPatients.length}`, 14, 33);

        // Filters badge area
        if (statusFilter || debouncedSearch) {
          doc.setFontSize(9);
          let filterStr = "Filters Applied: ";
          if (statusFilter) filterStr += `Status: ${statusFilter}  `;
          if (debouncedSearch) filterStr += `Search: "${debouncedSearch}"`;
          doc.text(filterStr, 14, 37);
        }

        const tableColumn = [
          "#",
          "Patient Name",
          "Email Address",
          "Contact Number",
          "Consultations",
          "Status",
          "Joining Date",
        ];
        const tableRows = exportPatients.map((p: Patient, index: number) => [
          index + 1,
          p.name,
          p.email,
          p.contactNumber,
          String(p.activeConsultation).padStart(2, "0"),
          p.status,
          new Date(p.joiningDate).toLocaleDateString(),
        ]);

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 45,
          theme: "striped",
          styles: {
            fontSize: 10,
            cellPadding: 2,
            valign: "middle",
            font: "helvetica",
            textColor: [51, 65, 85], // slate-700
          },
          headStyles: {
            fillColor: [241, 245, 249], // slate-100
            textColor: [71, 85, 105], // slate-600
            fontStyle: "bold",
            halign: "left",
            lineWidth: 0.1,
            lineColor: [226, 232, 240], // slate-200
          },
          columnStyles: {
            0: { halign: "center", cellWidth: 10 },
            1: { fontStyle: "bold", textColor: [30, 41, 59] },
            4: { halign: "center" },
            5: { halign: "center" },
            6: { halign: "center" },
          },
          alternateRowStyles: {
            fillColor: [250, 251, 252],
          },
          margin: { top: 45, bottom: 20 },
          didDrawPage: (data) => {
            const pageSize = doc.internal.pageSize;
            const pageHeight = pageSize.height
              ? pageSize.height
              : pageSize.getHeight();
            const pageWidth = pageSize.width
              ? pageSize.width
              : pageSize.getWidth();

            doc.setFontSize(9);
            doc.setTextColor(148, 163, 184);

            const str = `Page ${data.pageNumber} of ${doc.internal.pages.length - 1}`;
            doc.text(str, data.settings.margin.left, pageHeight - 10);

            doc.text(
              "Confidential Patient Document - DocDashboard",
              pageWidth - 14,
              pageHeight - 10,
              { align: "right" },
            );
          },
        });

        doc.save(
          `patients_report_${new Date().toISOString().split("T")[0]}.pdf`,
        );
        setIsExporting(false);
      })
      .catch((error) => {
        console.error("Export error:", error);
        setIsExporting(false);
        Swal.fire("Error", "Failed to export patients data", "error");
      });
  };
  return (
    <div className="w-full min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4">
        <h1 className="text-xl font-semibold text-slate-800">
          Patient Management{" "}
        </h1>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 w-64"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className="flex items-center gap-5 px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 w-36 justify-between"
            >
              <span>
                {STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ??
                  "All Status"}
              </span>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform duration-200 ${statusOpen ? "rotate-180" : ""}`}
              />
            </button>
            {statusOpen && (
              <div className="absolute z-20 top-full mt-1.5 left-0 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-36">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setStatusFilter(opt.value);
                      setStatusOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors ${
                      statusFilter === opt.value
                        ? "text-blue-700 font-medium bg-blue-50"
                        : "text-slate-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {meta && (
            <span className="text-sm text-slate-500">
              Total:{" "}
              <span className="font-medium text-slate-700">{meta.total}</span>
            </span>
          )}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1447E6] rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed min-w-[130px] justify-center"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <FileDown size={15} />
                <span>Export PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#F3F4F6] border-b border-slate-200">
                <th className="px-6 py-3.5 text-left font-semibold text-slate-600 text-[13px]">
                  Patient
                </th>
                <th className="px-6 py-3.5 text-left font-semibold text-slate-600 text-[13px]">
                  Email
                </th>
                <th className="px-6 py-3.5 text-center font-semibold text-slate-600 text-[13px]">
                  Contact
                </th>
                <th className="px-6 py-3.5 text-center font-semibold text-slate-600 text-[13px]">
                  Active Consultation
                </th>
                <th className="px-6 py-3.5 text-center font-semibold text-slate-600 text-[13px]">
                  Payment
                </th>
                <th className="px-6 py-3.5 text-center font-semibold text-slate-600 text-[13px]">
                  Status
                </th>
                <th className="px-6 py-3.5 text-center font-semibold text-slate-600 text-[13px]">
                  Joining Date
                </th>
                <th className="px-6 py-3.5 text-center font-semibold text-slate-600 text-[13px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#1447E6]" />
                    </div>
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-16 text-center text-slate-400 text-sm"
                  >
                    No patients found.
                  </td>
                </tr>
              ) : (
                patients.map((patient: Patient) => (
                  <tr
                    key={patient.id}
                    className={`hover:bg-slate-50/70 transition-colors ${isFetching ? "opacity-60" : ""}`}
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        {patient.image ? (
                          <img
                            src={patient.image}
                            alt={patient.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm shrink-0"
                          />
                        ) : null}
                        <div
                          className="w-9 h-9 rounded-full bg-blue-100 items-center justify-center shrink-0"
                          style={{ display: patient.image ? "none" : "flex" }}
                        >
                          {patient.name ? (
                            <span className="text-xs font-semibold text-blue-700">
                              {getInitials(patient.name)}
                            </span>
                          ) : (
                            <UserCircle2 size={20} className="text-blue-400" />
                          )}
                        </div>
                        <span className="font-semibold text-slate-800">
                          {patient.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-3.5 text-slate-700">
                      {patient.email}
                    </td>
                    <td className="px-6 py-3.5 text-center text-slate-700">
                      {patient.contactNumber}
                    </td>
                    <td className="px-6 py-3.5 text-center text-slate-700 font-medium">
                      {String(patient.activeConsultation).padStart(2, "0")}
                    </td>
                    <td className="px-6 py-3.5 text-center text-slate-700 font-medium">
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{patient.payment}</span>
                      </div>
                    </td>

                    <td className="px-6 py-3.5 text-center">
                      <StatusBadge status={patient.status} />
                    </td>

                    <td className="px-6 py-3.5 text-center text-slate-700">
                      {new Date(patient.joiningDate).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          className="text-slate-500 hover:text-slate-800 transition-colors"
                          aria-label={`View ${patient.name}`}
                          title="View"
                          onClick={() => setViewPatientId(patient.id)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          className={`transition-colors ${
                            patient.status === "BANNED" ||
                            patient.status === "BLOCKED"
                              ? "text-emerald-500 hover:text-emerald-700"
                              : "text-slate-500 hover:text-amber-600"
                          }`}
                          aria-label={`${patient.status === "BANNED" || patient.status === "BLOCKED" ? "Activate" : "Block"} ${patient.name}`}
                          title={
                            patient.status === "BANNED" ||
                            patient.status === "BLOCKED"
                              ? "Activate"
                              : "Block"
                          }
                          onClick={() => {
                            const newStatus =
                              patient.status === "BANNED" ||
                              patient.status === "BLOCKED"
                                ? "ACTIVE"
                                : "BLOCKED";
                            const actionText =
                              newStatus === "ACTIVE" ? "Activate" : "Block";
                            handleStatusUpdate(
                              patient.id,
                              newStatus,
                              patient.name,
                              actionText,
                            );
                          }}
                        >
                          {patient.status === "BANNED" ||
                          patient.status === "BLOCKED" ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <Ban size={16} />
                          )}
                        </button>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 transition-colors"
                          aria-label={`Delete ${patient.name}`}
                          title="Delete"
                          onClick={() =>
                            handleStatusUpdate(
                              patient.id,
                              "DELETED",
                              patient.name,
                              "Delete",
                            )
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
            <p className="text-sm text-gray-500">
              Page{" "}
              <span className="font-medium text-gray-700">{currentPage}</span>{" "}
              of <span className="font-medium text-gray-700">{totalPages}</span>
              {meta?.total && (
                <>
                  {" "}
                  &mdash;{" "}
                  <span className="font-medium text-gray-700">
                    {meta.total}
                  </span>{" "}
                  total
                </>
              )}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                «
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ‹ Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 1,
                )
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                  if (
                    idx > 0 &&
                    typeof arr[idx - 1] === "number" &&
                    (p as number) - (arr[idx - 1] as number) > 1
                  ) {
                    acc.push("...");
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 py-1.5 text-xs text-gray-400"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => handlePageChange(item as number)}
                      className={`w-8 h-8 rounded-lg border text-xs font-semibold transition-colors ${
                        currentPage === item
                          ? "bg-[#2563EB] border-[#2563EB] text-white shadow-sm shadow-blue-600/20"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next ›
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      <ViewPatientModal
        isOpen={!!viewPatientId}
        onClose={() => setViewPatientId(null)}
        patientId={viewPatientId}
      />
    </div>
  );
}
