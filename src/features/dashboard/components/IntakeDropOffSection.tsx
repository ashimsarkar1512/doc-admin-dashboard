import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Download, Eye, Repeat, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { getDropOffs, type DropOffItem, deleteDropOff } from '@/api/endpoints/businessIntelligence.api';
import { getCategories } from '@/api/endpoints/categories.api';
import DropOffDetailModal from '@/features/dashboard/components/DropOffDetailModal';
import { useDebouncedFilter, SelectDropdown, Pagination } from './BiShared';

export function IntakeDropOffSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [viewDropOffId, setViewDropOffId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const debounce = useDebouncedFilter(400);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: () => getCategories({ limit: 100 }),
  });
  const categories = categoriesData?.data || [];

  const { data: dropOffsData, isLoading, refetch } = useQuery({
    queryKey: ['drop-offs', currentPage, debouncedSearch, categoryFilter, typeFilter, dateFilter],
    queryFn: () => getDropOffs({
      page: currentPage,
      limit: 5,
      search: debouncedSearch || undefined,
      categoryId: categoryFilter || undefined,
      patientType: typeFilter || undefined,
      date: dateFilter || undefined,
    }),
  });

  const dropOffs = dropOffsData?.data ?? [];
  const meta = dropOffsData?.meta;
  const totalPages = meta?.totalPages ?? 0;

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this drop-off record!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteDropOff(id);
        Swal.fire('Deleted!', 'The drop-off record has been deleted.', 'success');
        refetch();
      } catch {
        Swal.fire('Error!', 'Failed to delete the drop-off.', 'error');
      }
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const res = await getDropOffs({
        limit: 1000,
        search: debouncedSearch || undefined,
        categoryId: categoryFilter || undefined,
        patientType: typeFilter || undefined,
        date: dateFilter || undefined,
      });
      const dataToExport = res.data || [];
      
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

      // Add background header gradient (simulated)
      const startColor = [44, 97, 91];   // #2c615b
      const midColor = [93, 142, 135];   // #5d8e87
      const endColor = [24, 49, 44];     // #18312c

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
        doc.rect(0, i, 297, 1, 'F');
      }
      
      // Add Title
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text('Intake Drop-Off Report', 14, 20);
      
      // Add Subtitle/Info in Header
      doc.setFontSize(10);
      doc.setTextColor(203, 213, 225); // slate-300
      const generatedDate = new Date().toLocaleString();
      doc.text(`Generated on: ${generatedDate}`, 14, 28);
      doc.text(`Total Records Found: ${dataToExport.length}`, 14, 33);
      
      // Filters badge area
      if (debouncedSearch || categoryFilter || typeFilter || dateFilter) {
        doc.setFontSize(9);
        let filterStr = 'Filters Applied: ';
        if (categoryFilter) filterStr += `Category: ${categoryFilter}  `;
        if (typeFilter) filterStr += `Type: ${typeFilter}  `;
        if (dateFilter) filterStr += `Date: ${dateFilter}  `;
        if (debouncedSearch) filterStr += `Search: "${debouncedSearch}"`;
        doc.text(filterStr, 14, 37);
      }

      const tableData = dataToExport.map((d: DropOffItem) => [
        d.userName || d.email,
        d.assessmentName || 'N/A',
        d.userType,
        d.status,
        d.ipAddress || 'N/A',
        fmtDate(d.timeStamp)
      ]);

      autoTable(doc, {
        startY: 45,
        head: [['User / Email', 'Assessment', 'Type', 'Status', 'IP', 'Date']],
        body: tableData,
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 2, valign: 'middle', font: 'helvetica', textColor: [51, 65, 85] as [number, number, number] },
        headStyles: { 
          fillColor: [241, 245, 249] as [number, number, number],
          textColor: [71, 85, 105] as [number, number, number],
          fontStyle: 'bold',
          halign: 'left',
          lineWidth: 0.1,
          lineColor: [226, 232, 240] as [number, number, number]
        },
        alternateRowStyles: { fillColor: [250, 251, 252] as [number, number, number] },
        margin: { top: 45, bottom: 20 },
        didDrawPage: (data) => {
          const pageSize = doc.internal.pageSize;
          const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
          
          doc.setFontSize(9);
          doc.setTextColor(148, 163, 184);
          
          const str = `Page ${data.pageNumber} of ${doc.internal.pages.length - 1}`;
          doc.text(str, data.settings.margin.left, pageHeight - 10);
          
          doc.text(
            'Confidential Intake Document - DocDashboard',
            pageWidth - 14,
            pageHeight - 10,
            { align: 'right' }
          );
        },
      });

      doc.save(`drop_offs_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) {
      console.error(e);
      Swal.fire('Error', 'Failed to export PDF', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadSingle = (dropOff: DropOffItem) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Drop-Off Details', 20, 20);
    
    doc.setFontSize(12);
    let y = 40;
    const addRow = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 60, y);
      y += 10;
    };

    addRow('User Name', dropOff.userName || 'N/A');
    addRow('Email', dropOff.email || 'N/A');
    addRow('Assessment', dropOff.assessmentName || 'N/A');
    addRow('User Type', dropOff.userType);
    addRow('Status', dropOff.status);
    addRow('IP Address', dropOff.ipAddress || 'N/A');
    addRow('Date', fmtDate(dropOff.timeStamp));
    
    doc.save(`dropoff_${dropOff.id}.pdf`);
  };

  const DATE_OPTIONS = [
    { value: '', label: '--' },
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_year', label: 'Last Year' }
  ];

  const TYPE_OPTIONS_DROPOFF = [
    { value: '', label: 'All Type' },
    { value: 'New Patient', label: 'New Patient' },
    { value: 'Repeat Patient', label: 'Repeat Patient' }
  ];

  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[17px] font-bold text-slate-800">Intake Drop-Off</h3>
        <button 
          onClick={handleExportPDF}
          disabled={isExporting}
          className="flex items-center gap-2 bg-[#1447E6] hover:bg-[#1038b3] disabled:opacity-70 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {isExporting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Download size={16} />}
          Export PDF
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debounce(setDebouncedSearch, e.target.value, 'search', () => setCurrentPage(1));
            }}
            placeholder="Search by name or email" 
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto shrink-0">
          <SelectDropdown
            value={categoryFilter}
            onChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}
            options={[
              { value: '', label: 'All Category' },
              ...categories.map((c: { id: string | number; name: string }) => ({ value: String(c.id), label: c.name }))
            ]}
            placeholder="All Category"
            minWidth="min-w-[180px]"
          />
          <SelectDropdown
            value={typeFilter}
            onChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}
            options={TYPE_OPTIONS_DROPOFF}
            placeholder="All Type"
            minWidth="min-w-[160px]"
          />
          <SelectDropdown
            value={dateFilter}
            onChange={(v) => { setDateFilter(v); setCurrentPage(1); }}
            options={DATE_OPTIONS}
            placeholder="--"
            minWidth="min-w-[130px]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f1f5f9] text-slate-600 font-semibold text-[13px]">
              <tr>
                <th className="px-4 py-4 whitespace-nowrap rounded-tl-xl">User Name</th>
                <th className="px-4 py-4 whitespace-nowrap">Email</th>
                <th className="px-4 py-4 whitespace-nowrap">Assessment Name</th>
                <th className="px-4 py-4 whitespace-nowrap">User Type</th>
                <th className="px-4 py-4 whitespace-nowrap">Status</th>
                <th className="px-4 py-4 whitespace-nowrap">IP Address</th>
                <th className="px-4 py-4 whitespace-nowrap">Time Stamp</th>
                <th className="px-4 py-4 whitespace-nowrap rounded-tr-xl text-center min-w-[110px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-slate-500">Loading...</td></tr>
              ) : dropOffs.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-slate-500">No drop-offs found.</td></tr>
              ) : dropOffs.map((row: DropOffItem) => {
                const displayName = row.userName || 'Unknown';
                const initials = row.userName ? row.userName.substring(0, 2).toUpperCase() : (row.email ? row.email.substring(0, 2).toUpperCase() : 'NA');
                return (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#E0E7FF] text-[#4F46E5] flex items-center justify-center font-medium text-xs shrink-0">
                          {initials}
                        </div>
                        <span className="font-medium text-slate-700">{displayName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-500 max-w-[160px] truncate">{row.email}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-600">{row.assessmentName}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {row.userType === 'New Patient' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#E0E7FF] text-[#4F46E5]">
                          {row.userType}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F3E8FF] text-[#9333EA]">
                          <Repeat size={10} /> {row.userType}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">{row.ipAddress}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-500">{fmtDate(row.timeStamp)}</td>
                    <td className="px-4 py-4 whitespace-nowrap min-w-[110px]">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setViewDropOffId(row.id)} className="text-slate-400 hover:text-[#1447E6] p-1.5 rounded-lg hover:bg-blue-50 transition-colors" title="View">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => handleDownloadSingle(row)} className="text-slate-400 hover:text-emerald-600 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors" title="Download">
                          <Download size={15} />
                        </button>
                        <button onClick={() => handleDelete(row.id)} className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 size={15} />
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
      <Pagination currentPage={currentPage} totalPages={totalPages} total={meta?.total ?? 0} handlePageChange={setCurrentPage} />
      
      <DropOffDetailModal 
        isOpen={!!viewDropOffId} 
        dropOffId={viewDropOffId} 
        onClose={() => setViewDropOffId(null)} 
      />
    </div>
  );
}
