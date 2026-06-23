import { useState, useRef, useCallback } from 'react';
import { Search, ChevronDown, Eye, CreditCard, FileDown, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { usePayments } from '../hooks/usePayments';
import { getPayments, getPaymentById } from '@/api/endpoints/payments.api';
import PaymentDetailModal from '../components/PaymentDetailModal';
import type { PaymentSummary, PaymentStatus, PaymentDetail } from '../types';

const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Refunded', value: 'REFUNDED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const PAGE_SIZE = 10;

function StatusBadge({ status }: { status: PaymentStatus | string }) {
  const map: Record<string, string> = {
    COMPLETED: 'bg-emerald-50 text-emerald-700',
    PENDING: 'bg-amber-50 text-amber-700',
    FAILED: 'bg-red-50 text-red-600',
    REFUNDED: 'bg-purple-50 text-purple-700',
    CANCELLED: 'bg-slate-100 text-slate-500',
    PROCESSING: 'bg-blue-50 text-blue-700',
  };
  const cls = map[status] ?? 'bg-slate-100 text-slate-500';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${cls}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function statusLabel(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

function fmtAmt(val: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
}

function fmtDateStr(d: string | null | undefined) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ─── Export ALL payments PDF ──────────────────────────────────────────────────

async function exportPaymentsPDF(search: string, status: string) {
  const allData = await getPayments({
    limit: 1000,
    search: search || undefined,
    status: status || undefined,
  });
  const rows = allData.payments;

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Clean neutral header — no brand blue
  doc.setFillColor(248, 249, 250); // very light gray
  doc.rect(0, 0, 297, 38, 'F');
  // Left accent bar — dark slate
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(0, 0, 4, 38, 'F');
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.setFont('helvetica', 'bold');
  doc.text('Payments Report', 12, 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Generated: ${new Date().toLocaleString()}`, 12, 23);
  doc.text(`Total Records: ${rows.length}`, 12, 29);
  if (status || search) {
    const parts: string[] = [];
    if (status) parts.push(`Status: ${statusLabel(status)}`);
    if (search) parts.push(`Search: "${search}"`);
    doc.text(`Filters: ${parts.join('  ·  ')}`, 12, 35);
  }
  // Bottom border
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(0, 38, 297, 38);

  autoTable(doc, {
    startY: 44,
    head: [['Patient Name', 'Card', 'Transaction ID', 'Payment Type', 'Amount', 'Date', 'Status']],
    body: rows.map((p) => [
      p.patientName || '—',
      `${p.brand} ···· ${p.last4}`,
      p.transactionId,
      p.paymentType,
      fmtAmt(p.amount),
      fmtDateStr(p.date),
      statusLabel(p.status),
    ]),
    theme: 'striped',
    styles: { fontSize: 9, cellPadding: 4, textColor: [51, 65, 85] as [number, number, number] },
    headStyles: {
      fillColor: [51, 65, 85] as [number, number, number],   // slate-700
      textColor: [255, 255, 255] as [number, number, number],
      fontStyle: 'bold',
      lineWidth: 0,
    },
    alternateRowStyles: { fillColor: [250, 251, 253] as [number, number, number] },
    columnStyles: { 4: { halign: 'right', fontStyle: 'bold' } },
    didDrawPage: (hookData) => {
      const ph = doc.internal.pageSize.getHeight();
      const pw = doc.internal.pageSize.getWidth();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Page ${hookData.pageNumber}`, hookData.settings.margin.left, ph - 8);
      doc.text('Confidential · DocDashboard', pw - 14, ph - 8, { align: 'right' });
    },
  });

  doc.save(`payments_${new Date().toISOString().split('T')[0]}.pdf`);
}

// ─── Download SINGLE payment PDF ─────────────────────────────────────────────

async function downloadSinglePaymentPDF(payment: PaymentDetail) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();

  // Soft brand header
  doc.setFillColor(235, 241, 255); // #EBF1FF
  doc.rect(0, 0, pw, 38, 'F');
  doc.setFillColor(30, 41, 59); // slate-800 left accent
  doc.rect(0, 0, 4, 38, 'F');
  doc.setFontSize(18);
  doc.setTextColor(20, 71, 230);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Receipt', 12, 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(payment.transactionId, 12, 23);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 12, 29);
  // Status on right
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 71, 230);
  doc.text(statusLabel(payment.status), pw - 14, 20, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  // Bottom accent line
  doc.setDrawColor(20, 71, 230);
  doc.setLineWidth(0.4);
  doc.line(4, 38, pw, 38);

  let y = 46;

  const sectionTitle = (title: string) => {
    doc.setFontSize(10);
    doc.setTextColor(20, 71, 230);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, y);
    doc.setDrawColor(20, 71, 230);
    doc.setLineWidth(0.3);
    doc.line(14, y + 1.5, pw - 14, y + 1.5);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(9);
  };

  const row = (label: string, value: string) => {
    doc.setTextColor(107, 114, 128);
    doc.text(label, 14, y);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text(value, 70, y);
    doc.setFont('helvetica', 'normal');
    y += 6;
  };

  // Amount hero box
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(14, y, pw - 28, 20, 3, 3, 'F');
  doc.setFontSize(22);
  doc.setTextColor(20, 71, 230);
  doc.setFont('helvetica', 'bold');
  doc.text(fmtAmt(payment.amount), 20, y + 13);
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(`${payment.currency} · ${payment.method} · ${payment.paymentType}`, pw - 20, y + 13, { align: 'right' });
  y += 27;

  sectionTitle('Transaction Info');
  row('Transaction ID', payment.transactionId);
  row('Method', payment.method);
  row('Card', `${payment.brand} ···· ${payment.last4}`);
  row('Payment Type', payment.paymentType);
  row('Status', statusLabel(payment.status));
  row('Paid At', fmtDateStr(payment.paidAt));
  if (payment.failedAt) row('Failed At', fmtDateStr(payment.failedAt));
  if (payment.refundedAt) row('Refunded At', fmtDateStr(payment.refundedAt));
  y += 4;

  sectionTitle('Patient Info');
  row('Name', payment.patient.name || '—');
  row('Email', payment.patient.email);
  if (payment.patient.phone) row('Phone', payment.patient.phone);
  const loc = [payment.patient.city, payment.patient.state, payment.patient.zip].filter(Boolean).join(', ');
  if (loc) row('Location', loc);
  y += 4;

  if (payment.order) {
    sectionTitle('Order Info');
    row('Order Number', payment.order.orderNumber);
    row('Status', statusLabel(payment.order.status));
    row('Subtotal', fmtAmt(payment.order.subtotal));
    if (payment.order.discountAmount > 0) row('Discount', `-${fmtAmt(payment.order.discountAmount)}`);
    row('Shipping', fmtAmt(payment.order.shippingAmount));
    row('Total', fmtAmt(payment.order.total));
    y += 4;

    if (payment.order.items.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Product', 'Qty', 'Unit Price', 'Total']],
        body: payment.order.items.map((i) => [
          i.productName + (i.variantSize ? ` (${i.variantSize})` : ''),
          String(i.quantity),
          fmtAmt(i.unitPrice),
          fmtAmt(i.totalPrice),
        ]),
        theme: 'striped',
        styles: { fontSize: 8.5, cellPadding: 3, textColor: [51, 65, 85] as [number, number, number] },
        headStyles: {
          fillColor: [20, 71, 230] as [number, number, number],
          textColor: [255, 255, 255] as [number, number, number],
          fontStyle: 'bold',
        },
        columnStyles: { 1: { halign: 'center' }, 2: { halign: 'right' }, 3: { halign: 'right', fontStyle: 'bold' } },
        margin: { left: 14, right: 14 },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      y = (doc as any).lastAutoTable.finalY + 8;
    }
  }

  if (payment.subscription) {
    sectionTitle('Subscription Info');
    row('Category', payment.subscription.categoryName);
    row('Plan', payment.subscription.paymentPlanName);
    row('Status', statusLabel(payment.subscription.status));
    row('Start Date', fmtDateStr(payment.subscription.startDate));
    row('Next Billing', fmtDateStr(payment.subscription.nextBillingDate));
  }

  const ph = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('DocDashboard · Confidential Payment Receipt', pw / 2, ph - 8, { align: 'center' });

  doc.save(`payment_${payment.transactionId}.pdf`);
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [statusOpen, setStatusOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewPaymentId, setViewPaymentId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const debounce = useCallback(
    (setter: (v: string) => void, value: string, key: string) => {
      if (debounceTimers.current[key]) clearTimeout(debounceTimers.current[key]);
      debounceTimers.current[key] = setTimeout(() => {
        setter(value);
        setCurrentPage(1);
      }, 400);
    },
    []
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debounce(setDebouncedSearch, value, 'search');
  };

  const { data, isLoading, isFetching } = usePayments({
    page: currentPage,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
  });

  const payments = data?.payments ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      await exportPaymentsPDF(debouncedSearch, statusFilter);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadSingle = async (id: string) => {
    setDownloadingId(id);
    try {
      const res = await getPaymentById(id);
      await downloadSinglePaymentPDF(res.data);
    } finally {
      setDownloadingId(null);
    }
  };

  const fmt = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6 md:p-8">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by patient name"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 w-64"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className="flex items-center gap-5 px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 w-40 justify-between"
            >
              <span>{STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? 'All Status'}</span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${statusOpen ? 'rotate-180' : ''}`} />
            </button>
            {statusOpen && (
              <div className="absolute z-20 top-full mt-1.5 left-0 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-40">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setStatusFilter(opt.value); setStatusOpen(false); setCurrentPage(1); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors ${statusFilter === opt.value ? 'text-blue-700 font-medium bg-blue-50' : 'text-slate-600'}`}
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
              Total: <span className="font-medium text-slate-700">{meta.total}</span>
            </span>
          )}
          {/* Export All button */}
          <button
            onClick={handleExportAll}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1447E6] rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px] justify-center"
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

      {/* Table */}
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-[#F3F4F6] border-b border-slate-200">
                <th className="px-6 py-3.5 text-left font-semibold text-slate-600 text-[13px]">Payment From</th>
                <th className="px-6 py-3.5 text-left font-semibold text-slate-600 text-[13px]">Card Number</th>
                <th className="px-6 py-3.5 text-left font-semibold text-slate-600 text-[13px]">Transaction ID</th>
                <th className="px-6 py-3.5 text-left font-semibold text-slate-600 text-[13px]">Payment Type</th>
                <th className="px-6 py-3.5 text-left font-semibold text-slate-600 text-[13px]">Amount</th>
                <th className="px-6 py-3.5 text-left font-semibold text-slate-600 text-[13px]">Date</th>
                <th className="px-6 py-3.5 text-center font-semibold text-slate-600 text-[13px]">Status</th>
                <th className="px-6 py-3.5 text-center font-semibold text-slate-600 text-[13px]">Action</th>
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
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <CreditCard size={18} className="text-slate-400" />
                      </div>
                      <p className="text-slate-400 text-sm">No payments found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((payment: PaymentSummary) => (
                  <tr key={payment.id} className={`hover:bg-slate-50/70 transition-colors ${isFetching ? 'opacity-60' : ''}`}>
                    {/* Patient — no avatar, just name */}
                    <td className="px-6 py-3.5 font-medium text-slate-800">
                      {payment.patientName || <span className="text-slate-400 italic">Unknown</span>}
                    </td>

                    {/* Card */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1 text-slate-600">
                        <span className="text-slate-400 text-xs tracking-widest">**** **** ****</span>
                        <span className="font-medium text-slate-700 ml-1">{payment.last4}</span>
                        <span className="ml-1.5 text-[11px] text-slate-400">{payment.brand}</span>
                      </div>
                    </td>

                    {/* Transaction ID */}
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded">
                        {payment.transactionId}
                      </span>
                    </td>

                    {/* Payment Type */}
                    <td className="px-6 py-3.5 text-slate-600">{payment.paymentType}</td>

                    {/* Amount */}
                    <td className="px-6 py-3.5 font-semibold text-slate-800">{fmt(payment.amount)}</td>

                    {/* Date */}
                    <td className="px-6 py-3.5 text-slate-600">{fmtDate(payment.date)}</td>

                    {/* Status */}
                    <td className="px-6 py-3.5 text-center">
                      <StatusBadge status={payment.status} />
                    </td>

                    {/* Action: View + Download */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewPaymentId(payment.id)}
                          className="text-slate-500 hover:text-[#1447E6] transition-colors p-1.5 rounded-lg hover:bg-blue-50"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadSingle(payment.id)}
                          disabled={downloadingId === payment.id}
                          className="text-slate-500 hover:text-emerald-600 transition-colors p-1.5 rounded-lg hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Download PDF"
                        >
                          {downloadingId === payment.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600" />
                          ) : (
                            <Download size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination — outside the table card ── */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-medium text-slate-700">{(currentPage - 1) * PAGE_SIZE + 1}</span>
            {' – '}
            <span className="font-medium text-slate-700">{Math.min(currentPage * PAGE_SIZE, meta?.total ?? 0)}</span>
            {' of '}
            <span className="font-medium text-slate-700">{meta?.total ?? 0}</span>
            {' results'}
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >«</button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >‹ Prev</button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) {
                  acc.push('...');
                }
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === '...' ? (
                  <span key={`e-${idx}`} className="px-2 py-1.5 text-xs text-slate-400">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => handlePageChange(item as number)}
                    aria-current={currentPage === item ? 'page' : undefined}
                    className={`w-8 h-8 rounded-lg border text-xs font-semibold transition-colors ${
                      currentPage === item
                        ? 'bg-[#1447E6] border-[#1447E6] text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >{item}</button>
                )
              )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >Next ›</button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >»</button>
          </div>
        </div>
      )}

      <PaymentDetailModal
        isOpen={!!viewPaymentId}
        paymentId={viewPaymentId}
        onClose={() => setViewPaymentId(null)}
      />
    </div>
  );
}
