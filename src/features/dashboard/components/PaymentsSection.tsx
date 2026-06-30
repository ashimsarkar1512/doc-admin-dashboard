import { useState } from 'react';
import { Search, Download, Eye } from 'lucide-react';
import Swal from 'sweetalert2';

import { usePayments } from '@/features/payments/hooks/usePayments';
import type { PaymentSummary } from '@/features/payments/types';
import { downloadSinglePaymentPDF, exportPaymentsPDF } from '@/features/payments/pages/PaymentsPage';
import PaymentDetailModal from '@/features/payments/components/PaymentDetailModal';
import DatePicker from '@/components/shared/DatePicker';
import { getPaymentById } from '@/api/endpoints/payments.api';

import { useDebouncedFilter, SelectDropdown, Pagination, StatusBadge, statusLabel, TYPE_OPTIONS, STATUS_OPTIONS } from './BiShared';

export function PaymentsSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [viewPaymentId, setViewPaymentId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const debounce = useDebouncedFilter(400);

  const { data, isLoading, isError, error } = usePayments({
    page: currentPage,
    limit: 5,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    paymentType: typeFilter || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const payments = data?.payments ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 0;

  const fmt = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/');

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      await exportPaymentsPDF(debouncedSearch, statusFilter);
    } catch (e) {
      console.error(e);
      Swal.fire('Error', 'Failed to export PDF', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadSingle = async (id: string) => {
    setDownloadingId(id);
    try {
      const res = await getPaymentById(id);
      await downloadSinglePaymentPDF(res.data);
    } catch (e) {
      console.error(e);
      Swal.fire('Error', 'Failed to download PDF', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[17px] font-bold text-slate-800">Payments</h3>
        <button disabled={isExporting} onClick={handleExportAll} className="flex items-center gap-2 bg-[#1447E6] hover:bg-[#1038b3] disabled:opacity-70 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
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
            placeholder="Search by name, transaction ID" 
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto shrink-0">
          <SelectDropdown
            value={typeFilter}
            onChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}
            options={TYPE_OPTIONS}
            placeholder="All Type"
            minWidth="min-w-[160px]"
          />
          <SelectDropdown
            value={statusFilter}
            onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
            options={STATUS_OPTIONS}
            placeholder="All Status"
            minWidth="min-w-[160px]"
          />

          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden h-[42px] min-w-[280px]">
            <DatePicker 
              value={startDate} 
              onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }} 
              className="border-none rounded-none border-r border-slate-200 bg-transparent text-slate-600 focus:ring-0 w-[140px]" 
              wrapperClassName="w-[140px]"
            />
            <DatePicker 
              value={endDate} 
              onChange={e => { setEndDate(e.target.value); setCurrentPage(1); }} 
              className="border-none rounded-none bg-transparent text-slate-600 focus:ring-0 w-[140px]" 
              wrapperClassName="w-[140px]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f1f5f9] text-slate-600 font-semibold text-[13px]">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap rounded-tl-xl">Payment From</th>
                <th className="px-6 py-4 whitespace-nowrap">Card Number</th>
                <th className="px-6 py-4 whitespace-nowrap">Transaction ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Payment Type</th>
                <th className="px-6 py-4 whitespace-nowrap">Payment</th>
                <th className="px-6 py-4 whitespace-nowrap">Date</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap rounded-tr-xl text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isError ? (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-red-500">Error: {(error as Error)?.message || 'Something went wrong'}</td></tr>
              ) : isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-500">Loading...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-500">No payments found.</td>
                </tr>
              ) : payments.map((row: PaymentSummary) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E0E7FF] text-[#4F46E5] flex items-center justify-center font-medium text-xs shrink-0">
                        {row.patientName?.substring(0, 2).toUpperCase() || 'NA'}
                      </div>
                      <span className="font-medium text-slate-700">{row.patientName || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">**** **** {row.last4}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">{row.transactionId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">{statusLabel(row.paymentType)}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">{fmt(row.amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">{fmtDate(row.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => setViewPaymentId(row.id)} className="text-slate-400 hover:text-slate-600"><Eye size={16} /></button>
                      <button disabled={downloadingId === row.id} onClick={() => handleDownloadSingle(row.id)} className="text-emerald-500 hover:text-emerald-600 disabled:opacity-50">
                        {downloadingId === row.id ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600" /> : <Download size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} total={meta?.total ?? 0} handlePageChange={setCurrentPage} />
      
      <PaymentDetailModal
        isOpen={!!viewPaymentId}
        paymentId={viewPaymentId}
        onClose={() => setViewPaymentId(null)}
      />
    </div>
  );
}
