import { X, CreditCard, User, ShoppingBag, CalendarCheck, Package } from 'lucide-react';
import { usePaymentDetail } from '../hooks/usePayments';
import type { PaymentStatus } from '../types';

interface Props {
  isOpen: boolean;
  paymentId: string | null;
  onClose: () => void;
}

function StatusBadge({ status }: { status: PaymentStatus | string }) {
  const map: Record<string, string> = {
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    PENDING:   'bg-amber-50 text-amber-700 border-amber-200',
    FAILED:    'bg-red-50 text-red-700 border-red-200',
    REFUNDED:  'bg-purple-50 text-purple-700 border-purple-200',
    CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200',
    PROCESSING:'bg-blue-50 text-blue-700 border-blue-200',
  };
  const cls = map[status] ?? 'bg-slate-100 text-slate-600 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-medium text-slate-800 leading-snug">{value ?? <span className="text-slate-300">—</span>}</span>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
          <Icon size={13} className="text-slate-500" />
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{title}</span>
      </div>
      {children}
    </div>
  );
}

export default function PaymentDetailModal({ isOpen, paymentId, onClose }: Props) {
  const { data, isLoading } = usePaymentDetail(isOpen ? paymentId : null);
  const payment = data?.data;

  if (!isOpen) return null;

  const fmt = (val: number, currency = 'USD') =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(val);

  const fmtDate = (d: string | null | undefined) =>
    d ? new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-w-[680px] bg-white rounded-2xl shadow-2xl flex flex-col"
           style={{ maxHeight: 'calc(100vh - 2rem)' }}>

        {/* ── Header ── */}
        <div className="shrink-0 flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Payment Details</p>
            {payment
              ? <h2 className="text-base font-bold text-slate-800 font-mono">{payment.transactionId}</h2>
              : <h2 className="text-base font-bold text-slate-800">Loading…</h2>
            }
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Body — hidden scrollbar ── */}
        <div
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`.payment-modal-body::-webkit-scrollbar { display: none; }`}</style>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1447E6]" />
            </div>
          ) : !payment ? (
            <div className="text-center py-20 text-slate-400 text-sm">Failed to load payment details.</div>
          ) : (
            <>
              {/* ── Amount hero ── */}
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-[32px] font-bold text-slate-900 leading-none">
                    {fmt(payment.amount, payment.currency)}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">{payment.currency} · {payment.method}</p>
                </div>
                <div className="text-right shrink-0">
                  <StatusBadge status={payment.status} />
                  <p className="text-xs text-slate-400 mt-2">{payment.paymentType}</p>
                </div>
              </div>

              {/* ── Divider ── */}
              <hr className="border-slate-100" />

              {/* ── Transaction Info ── */}
              <Section icon={CreditCard} title="Transaction Info">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <InfoRow label="Transaction ID" value={<span className="font-mono text-xs text-slate-700">{payment.transactionId}</span>} />
                  <InfoRow label="Method" value={payment.method} />
                  <InfoRow
                    label="Card"
                    value={
                      <span className="flex items-center gap-1.5">
                        <span>{payment.brand}</span>
                        <span className="text-slate-300 tracking-widest text-xs">····</span>
                        <span>{payment.last4}</span>
                      </span>
                    }
                  />
                  <InfoRow label="Payment Type" value={payment.paymentType} />
                  <InfoRow label="Paid At" value={fmtDate(payment.paidAt)} />
                  <InfoRow label="Created At" value={fmtDate(payment.createdAt)} />
                  {payment.failedAt && (
                    <InfoRow label="Failed At" value={<span className="text-red-500">{fmtDate(payment.failedAt)}</span>} />
                  )}
                  {payment.refundedAt && (
                    <InfoRow label="Refunded At" value={<span className="text-purple-500">{fmtDate(payment.refundedAt)}</span>} />
                  )}
                </div>
              </Section>

              <hr className="border-slate-100" />

              {/* ── Patient Info ── */}
              <Section icon={User} title="Patient Info">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <InfoRow label="Name"  value={payment.patient.name || '—'} />
                  <InfoRow label="Email" value={payment.patient.email} />
                  <InfoRow label="Phone" value={payment.patient.phone} />
                  <InfoRow label="City"  value={payment.patient.city} />
                  <InfoRow label="State" value={payment.patient.state} />
                  <InfoRow label="ZIP"   value={payment.patient.zip} />
                  {payment.patient.address && (
                    <div className="col-span-2">
                      <InfoRow label="Address" value={payment.patient.address} />
                    </div>
                  )}
                </div>
              </Section>

              {/* ── Order Info ── */}
              {payment.order && (
                <>
                  <hr className="border-slate-100" />
                  <Section icon={ShoppingBag} title="Order Info">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-4">
                      <InfoRow label="Order Number" value={<span className="font-mono text-xs">{payment.order.orderNumber}</span>} />
                      <InfoRow label="Status"   value={<StatusBadge status={payment.order.status} />} />
                      <InfoRow label="Subtotal" value={fmt(payment.order.subtotal)} />
                      <InfoRow label="Discount" value={payment.order.discountAmount > 0 ? `-${fmt(payment.order.discountAmount)}` : '—'} />
                      <InfoRow label="Shipping" value={fmt(payment.order.shippingAmount)} />
                      <InfoRow label="Total"    value={<span className="font-bold text-slate-900">{fmt(payment.order.total)}</span>} />
                    </div>

                    {payment.order.items.length > 0 && (
                      <div className="space-y-2 mt-1">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Items</p>
                        {payment.order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3.5 py-3 border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                <Package size={12} className="text-slate-400" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-slate-800">{item.productName}</p>
                                {item.variantSize && <p className="text-[11px] text-slate-400 mt-0.5">Size: {item.variantSize}</p>}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-slate-800">{fmt(item.totalPrice)}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">{item.quantity} × {fmt(item.unitPrice)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Section>
                </>
              )}

              {/* ── Subscription Info ── */}
              {payment.subscription && (
                <>
                  <hr className="border-slate-100" />
                  <Section icon={CalendarCheck} title="Subscription Info">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <InfoRow label="Category"     value={payment.subscription.categoryName} />
                      <InfoRow label="Plan"         value={payment.subscription.paymentPlanName} />
                      <InfoRow label="Status"       value={<StatusBadge status={payment.subscription.status} />} />
                      <InfoRow label="Start Date"   value={fmtDate(payment.subscription.startDate)} />
                      <InfoRow label="End Date"     value={fmtDate(payment.subscription.endDate)} />
                      <InfoRow label="Next Billing" value={fmtDate(payment.subscription.nextBillingDate)} />
                    </div>
                  </Section>
                </>
              )}

              {/* bottom breathing room */}
              <div className="h-1" />
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-100 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
