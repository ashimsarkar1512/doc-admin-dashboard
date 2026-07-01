import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

export function useDebouncedFilter(delay = 400) {
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  return useCallback((setter: (v: string) => void, value: string, key: string, onSet?: () => void) => {
    if (timers.current[key]) clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(() => {
      setter(value);
      onSet?.();
    }, delay);
  }, [delay]);
}

export function SelectDropdown({ value, options, onChange, placeholder, minWidth = 'min-w-[130px]' }: { value: string; options: { value: string; label: string }[]; onChange: (v: string) => void; placeholder: string; minWidth?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const label = options.find((o) => String(o.value) === String(value))?.label || placeholder;

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div className={`relative ${minWidth} flex-1 sm:flex-none min-w-[120px]`} ref={ref}>
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white">
        <span className="truncate">{label}</span> <ChevronDown size={16} className="text-slate-400 ml-2 shrink-0" />
      </button>
      {open && (
        <div className="absolute z-20 top-full mt-1 right-0 w-full min-w-full bg-white border border-slate-200 rounded-lg shadow-lg py-1 max-h-[300px] overflow-y-auto">
          {options.map((opt) => (
            <button key={String(opt.value)} onClick={() => { onChange(String(opt.value)); setOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 text-slate-600">
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Failed', value: 'FAILED' },
  { label: 'Refunded', value: 'REFUNDED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export const TYPE_OPTIONS = [
  { label: 'All Type', value: '' },
  { label: 'Product', value: 'PRODUCT' },
  { label: 'Fees', value: 'FEES' },
  { label: 'Subscription', value: 'SUBSCRIPTION' },
];

export function statusLabel(type: string) {
  return TYPE_OPTIONS.find(o => o.value === type)?.label ?? (type.charAt(0).toUpperCase() + type.slice(1).toLowerCase());
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    COMPLETED: 'bg-emerald-100 text-emerald-600',
    PENDING: 'bg-amber-100 text-amber-600',
    FAILED: 'bg-red-100 text-red-600',
    REFUNDED: 'bg-[#FFEDD5] text-[#9A3412]',
    CANCELLED: 'bg-slate-100 text-slate-500',
    PROCESSING: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-500'}`}>
      {status ? (status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()) : ''}
    </span>
  );
}

export function Pagination({
  currentPage,
  totalPages,
  total,
  handlePageChange,
}: {
  currentPage: number;
  totalPages: number;
  total: number;
  handlePageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between px-1 py-2 mt-4">
      <span className="text-xs text-slate-500">
        Page {currentPage} of {totalPages} ({total} total)
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
        >
          Prev
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={`px-3 py-1.5 text-xs rounded-lg border ${
              p === currentPage
                ? 'bg-[#1447E6] text-white border-[#1447E6]'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
