import { useState, useRef, useCallback } from 'react';
import { Search, ChevronDown, Eye, Download, X, Check, Loader2, ChevronLeft, ChevronRight, FileText, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  getDocumentStats,
  getDocuments,
  getDocumentDetails,
  type DocumentItem,
  type DocumentStatsItem,
} from '@/api/endpoints/documents.api';

const ITEMS_PER_PAGE = 10;
const PRESET_DATE_VALUES = ['today', 'last_7_days', 'last_month', 'last_year', 'all'];
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = bytes / Math.pow(k, i);
  return `${val.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function typeDisplayName(type: string): string {
  return type
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function typeBadgeClass(type: string): string {
  const lower = type.toLowerCase();
  if (lower.includes('icon') || lower.includes('category')) return 'bg-blue-50 text-blue-600';
  if (lower.includes('avatar') || lower.includes('doctor')) return 'bg-violet-50 text-violet-600';
  if (lower.includes('product') || lower.includes('image')) return 'bg-emerald-50 text-emerald-600';
  if (lower.includes('lab')) return 'bg-cyan-50 text-cyan-600';
  if (lower.includes('prescription')) return 'bg-amber-50 text-amber-600';
  if (lower.includes('consent')) return 'bg-green-50 text-green-600';
  if (lower.includes('invoice')) return 'bg-rose-50 text-rose-600';
  if (lower.includes('note')) return 'bg-slate-100 text-slate-600';
  return 'bg-gray-50 text-gray-600';
}

function extractFileUrl(doc: DocumentItem): string | null {
  const d = doc as DocumentItem & {
    fileUrl?: string;
    url?: string;
    downloadUrl?: string;
    filePath?: string;
    file_url?: string;
    path?: string;
  };
  return d.fileUrl || d.url || d.downloadUrl || d.filePath || d.file_url || d.path || null;
}

// ── Direct file download (used from table row) ───────────────────────────────
function getFilenameFromUrl(fileUrl: string, docName: string): string {
  const raw = fileUrl.split('/').pop()?.split('?')[0] ?? '';
  return raw || docName;
}

function downloadBlob(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
}

async function downloadFileDirectly(doc: DocumentItem): Promise<void> {
  const fileUrl = extractFileUrl(doc);
  if (!fileUrl) {
    downloadDocumentReceipt(doc);
    return;
  }

  const filename = getFilenameFromUrl(fileUrl, doc.documentName);
  const isImage = /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(fileUrl);

  // ── Attempt 1: fetch with cors ──────────────────────────────────────────
  try {
    const res = await fetch(fileUrl, { mode: 'cors' });
    if (res.ok) {
      const blob = await res.blob();
      downloadBlob(blob, filename);
      return;
    }
  } catch {
    // cors blocked — try next strategy
  }

  // ── Attempt 2: for images use canvas to extract pixel data ─────────────
  if (isImage) {
    try {
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) { reject(new Error('canvas ctx')); return; }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (!blob) { reject(new Error('toBlob failed')); return; }
            downloadBlob(blob, filename);
            resolve();
          }, 'image/png');
        };
        img.onerror = () => reject(new Error('img load failed'));
        img.src = fileUrl;
      });
      return;
    } catch {
      // canvas also failed — fall through
    }
  }

  // ── Attempt 3: open in new tab (last resort) ────────────────────────────
  const a = document.createElement('a');
  a.href = fileUrl;
  a.download = filename;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ── Receipt HTML download (used only from PreviewPanel) ─────────────────────
function downloadDocumentReceipt(doc: DocumentItem) {
  const fileUrl = extractFileUrl(doc);
  const isImage = fileUrl && /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(fileUrl);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${doc.documentName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f1f5f9;
      min-height: 100vh;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 40px 20px;
    }
    .card {
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.10);
      width: 100%;
      max-width: 600px;
      overflow: hidden;
    }
    .header {
      background: #1e293b;
      color: #fff;
      padding: 32px 32px 24px;
      border-bottom: 3px solid #1447E6;
    }
    .header-top {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    .header-icon {
      width: 44px; height: 44px;
      background: #334155;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
      border: 1px solid #475569;
    }
    .header-brand { font-size: 13px; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase; }
    .doc-title { font-size: 22px; font-weight: 700; word-break: break-word; color: #f8fafc; }
    .doc-subtitle { font-size: 13px; color: #94a3b8; margin-top: 4px; }
    .badge {
      display: inline-block;
      margin-top: 14px;
      padding: 4px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      background: rgba(20, 71, 230, 0.2);
      color: #60a5fa;
      border: 1px solid rgba(20, 71, 230, 0.3);
      letter-spacing: 0.3px;
    }
    .details {
      padding: 28px 32px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .detail-item label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #94a3b8;
      margin-bottom: 4px;
    }
    .detail-item span {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
    }
    .divider { height: 1px; background: #f1f5f9; margin: 0 32px; }
    .image-section { padding: 24px 32px; }
    .image-section p {
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.8px; color: #94a3b8; margin-bottom: 12px;
    }
    .image-wrapper {
      width: 100%;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      min-height: 200px;
    }
    .image-section img {
      max-width: 100%;
      max-height: 400px;
      width: 100%;
      height: auto;
      object-fit: contain;
      border-radius: 6px;
      display: block;
    }
    .url-section { padding: 20px 32px; }
    .url-section p {
      font-size: 12px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.6px; color: #94a3b8; margin-bottom: 6px;
    }
    .url-box {
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;
      padding: 10px 14px; font-size: 12px; color: #1447E6;
      word-break: break-all; font-family: monospace;
    }
    .footer {
      background: #f8fafc; border-top: 1px solid #f1f5f9;
      padding: 16px 32px; display: flex;
      align-items: center; justify-content: space-between;
    }
    .footer-left { font-size: 12px; color: #94a3b8; }
    .footer-right { font-size: 12px; color: #cbd5e1; }
    @media print {
      body { background: white; padding: 0; }
      .card { box-shadow: none; border-radius: 0; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="header-top">
        <div class="header-icon">📄</div>
        <div><div class="header-brand">Document Center</div></div>
      </div>
      <div class="doc-title">${doc.documentName}</div>
      <div class="doc-subtitle">Document ID: ${doc.id}</div>
      <span class="badge">${typeDisplayName(doc.type)}</span>
    </div>
    <div class="details">
      <div class="detail-item">
        <label>Uploaded By</label>
        <span>${doc.uploadedBy || '—'}</span>
      </div>
      <div class="detail-item">
        <label>Upload Date</label>
        <span>${formatDate(doc.date)}</span>
      </div>
      <div class="detail-item">
        <label>File Size</label>
        <span>${formatSize(doc.size)}</span>
      </div>
      <div class="detail-item">
        <label>Document Type</label>
        <span>${typeDisplayName(doc.type)}</span>
      </div>
    </div>
    ${fileUrl ? `
    <div class="divider"></div>
    ${isImage ? `
    <div class="image-section">
      <p>File Preview</p>
      <div class="image-wrapper">
        <img src="${fileUrl}" alt="${doc.documentName}" />
      </div>
    </div>` : `
    <div class="url-section">
      <p>File Location</p>
      <div class="url-box">${fileUrl}</div>
    </div>`}` : ''}
    <div class="footer">
      <span class="footer-left">Generated on ${new Date().toLocaleString()}</span>
      <span class="footer-right">Document Center</span>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${doc.documentName.replace(/[^a-z0-9_\-. ]/gi, '_')}_receipt.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── Toast type ───────────────────────────────────────────────────────────────
type ToastItem = {
  id: string;
  title: string;
  message?: string;
  variant: 'success' | 'error';
};

// ── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-[#15181F] rounded-2xl px-5 py-4 flex-1 min-w-[140px] max-w-[200px]">
      <p className="text-slate-400 text-sm font-medium truncate">{label}</p>
      <p className="text-white text-3xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${typeBadgeClass(type)}`}>
      {typeDisplayName(type)}
    </span>
  );
}

function ToastStack({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div aria-live="polite" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-[300px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg bg-white animate-[fadeIn_0.2s_ease-out] ${
            t.variant === 'error' ? 'border-red-200' : 'border-green-200'
          }`}
        >
          <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
            t.variant === 'error' ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'
          }`}>
            {t.variant === 'error' ? <X className="w-3 h-3" /> : <Check className="w-3 h-3" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{t.title}</p>
            {t.message && <p className="text-xs text-slate-500 mt-0.5">{t.message}</p>}
          </div>
          <button onClick={() => onDismiss(t.id)} className="text-slate-300 hover:text-slate-500 shrink-0" aria-label="Dismiss">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-400 shrink-0">{label}</span>
      <span className="text-slate-700 font-medium text-right break-words">{value}</span>
    </div>
  );
}

function DateInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    try {
      if (dateInputRef.current && 'showPicker' in HTMLInputElement.prototype) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current?.focus();
        dateInputRef.current?.click();
      }
    } catch (err) {
      dateInputRef.current?.focus();
      dateInputRef.current?.click();
    }
  };

  return (
    <div className="relative group">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200 w-[160px] transition-all"
      />
      <button
        type="button"
        onClick={handleIconClick}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1447E6] transition-colors p-1"
        aria-label="Open date picker"
      >
        <Calendar className="w-4 h-4" />
      </button>
      <input
        type="date"
        ref={dateInputRef}
        value={DATE_REGEX.test(value) ? value : ''}
        onChange={(e) => onChange(e.target.value)}
        className="absolute left-0 bottom-0 w-full h-0 opacity-0 pointer-events-none"
        tabIndex={-1}
      />
    </div>
  );
}

function PreviewPanel({
  documentId,
  onClose,
  onDownload,
  isDownloading,
}: {
  documentId: string;
  onClose: () => void;
  onDownload: (doc: DocumentItem) => void;
  isDownloading: boolean;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['document-detail', documentId],
    queryFn: () => getDocumentDetails(documentId),
    enabled: !!documentId,
  });

  const doc = data?.data;

  return (
    <div className="w-full lg:w-[400px] shrink-0 bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Preview</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-200 rounded" aria-label="Close preview">
          <X className="w-4 h-4" />
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
        </div>
      )}

      {isError && !isLoading && (
        <p className="text-sm text-red-500 text-center py-8">Failed to load document details.</p>
      )}

      {doc && !isLoading && (
        <>
          {(() => {
            const fileUrl = extractFileUrl(doc);
            const isImage = fileUrl && /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(fileUrl);
            return isImage ? (
              <div
                className="border border-slate-100 rounded-xl bg-[#f8fafc] mb-4 w-full flex items-center justify-center p-3"
                style={{ minHeight: '200px' }}
              >
                <img
                  src={fileUrl!}
                  alt={doc.documentName}
                  style={{ maxHeight: '400px', width: '100%', height: 'auto', objectFit: 'contain', display: 'block', borderRadius: '6px' }}
                />
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-xl h-36 flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-[#1447E6]" />
              </div>
            );
          })()}

          <p className="font-semibold text-slate-800 text-sm mb-4 break-words">{doc.documentName}</p>

          <div className="space-y-3 text-sm">
            <Row label="Type" value={typeDisplayName(doc.type)} />
            <Row label="Uploaded By" value={doc.uploadedBy || '-'} />
            <Row label="Date" value={formatDate(doc.date)} />
            <Row label="Size" value={formatSize(doc.size)} />
          </div>

          {/* PreviewPanel download → receipt HTML (same as before) */}
          <button
            onClick={() => onDownload(doc)}
            disabled={isDownloading}
            className="w-full mt-5 bg-[#1447E6] hover:bg-[#1139c2] text-white rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            {isDownloading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Downloading...</>
            ) : (
              <><Download className="w-4 h-4" />Download</>
            )}
          </button>
        </>
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible + 2) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
      <p className="text-sm text-slate-400">Page {page} of {totalPages} ({total} total)</p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none" aria-label="Previous page">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-300 text-sm">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-[#1447E6] text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              {p}
            </button>
          )
        )}
        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none" aria-label="Next page">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function DocumentCenterPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Type');
  const [date, setDate] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['document-stats'],
    queryFn: getDocumentStats,
  });

  const { data: docsData, isLoading: docsLoading, isFetching: docsFetching } = useQuery({
    queryKey: ['documents', page, search, typeFilter, date],
    queryFn: () => {
      const params: any = {
        page,
        limit: ITEMS_PER_PAGE,
        search: search || undefined,
        type: typeFilter !== 'All Type' ? typeFilter : undefined,
      };

      // ── Date param logic ──────────────────────────────────────────────
      // The backend (/api/v1/admin/documents) ONLY accepts:
      //   date = today | last_7_days | last_month | last_year | all
      // It does NOT currently support a specific/custom date (no dateFrom/dateTo).
      // That mismatch was the bug: typing a custom date sent dateFrom/dateTo,
      // which the backend silently ignores -> filter appeared to "not work".
      //
      // Fix: only send `date` when it's one of the backend-supported presets.
      // If the user typed a specific YYYY-MM-DD date, we currently CANNOT
      // filter server-side (backend doesn't support it yet), so we don't send
      // an unsupported param. Once backend adds dateFrom/dateTo support,
      // uncomment the block below to wire it up.
      if (PRESET_DATE_VALUES.includes(date)) {
        if (date !== 'all') {
          params.date = date;
        }
      } else if (DATE_REGEX.test(date)) {
        // TODO: backend does not support this yet.
        // Once backend adds support, send it like this:
        // params.dateFrom = date;
        // params.dateTo = date;
      }

      return getDocuments(params);
    },
    placeholderData: (prev) => prev,
  });

  const stats = statsData?.data ?? [];
  const documents = docsData?.data ?? [];
  const meta = docsData?.meta ?? { page: 1, limit: 10, total: 0, totalPages: 0 };

  const typeOptions = ['All Type', ...stats.map((s: DocumentStatsItem) => s.type)];
  const dateOptions = [
    { label: 'All Time', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: 'last_7_days' },
    { label: 'Last Month', value: 'last_month' },
    { label: 'Last Year', value: 'last_year' },
  ];

  const isCustomDateActive = !PRESET_DATE_VALUES.includes(date) && DATE_REGEX.test(date);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const pushToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, ...toast }]);
    timersRef.current[id] = setTimeout(() => dismissToast(id), 3500);
  }, [dismissToast]);

  const handleView = (doc: DocumentItem) => {
    setSelectedId(doc.id);
    setPreviewOpen(true);
  };

  // Table row download → direct file download
  const handleRowDownload = useCallback(async (doc: DocumentItem) => {
    if (downloadingId) return;
    setDownloadingId(doc.id);
    try {
      await downloadFileDirectly(doc);
      pushToast({ title: 'Download complete', message: doc.documentName, variant: 'success' });
    } catch (err) {
      pushToast({
        title: 'Download failed',
        message: err instanceof Error ? err.message : 'Please try again.',
        variant: 'error',
      });
    } finally {
      setDownloadingId(null);
    }
  }, [downloadingId, pushToast]);

  // PreviewPanel download → receipt HTML
  const handlePreviewDownload = useCallback(async (doc: DocumentItem) => {
    if (downloadingId) return;
    setDownloadingId(doc.id);
    try {
      downloadDocumentReceipt(doc);
      pushToast({ title: 'Download complete', message: doc.documentName, variant: 'success' });
    } catch (err) {
      pushToast({
        title: 'Download failed',
        message: err instanceof Error ? err.message : 'Please try again.',
        variant: 'error',
      });
    } finally {
      setDownloadingId(null);
    }
  }, [downloadingId, pushToast]);

  const handleSearch = (value: string) => { setSearch(value); setPage(1); };
  const handleTypeFilter = (value: string) => { setTypeFilter(value); setPage(1); };

  const handleDate = (value: string) => {
    setDate(value);
    setPage(1);
    // Warn the user (instead of silently doing nothing) when they pick a
    // specific date the backend can't filter by yet.
    if (!PRESET_DATE_VALUES.includes(value) && DATE_REGEX.test(value)) {
      pushToast({
        title: 'Custom date filter not supported yet',
        message: 'Backend only supports Today / 7 Days / Month / Year / All for now.',
        variant: 'error',
      });
    }
  };

  const isLoading = statsLoading || (docsLoading && documents.length === 0);

  return (
    <div className="w-full min-h-screen bg-slate-50 p-4 sm:p-6">
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {isLoading ? (
        <div className="flex flex-wrap gap-4 mb-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[#15181F] rounded-2xl px-5 py-4 flex-1 min-w-[140px] max-w-[200px] animate-pulse">
              <div className="h-3 w-16 bg-slate-700 rounded mb-3" />
              <div className="h-8 w-12 bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      ) : stats.length > 0 ? (
        <div className="flex flex-wrap gap-4 mb-5">
          {stats.map((s: DocumentStatsItem) => (
            <StatCard key={s.type} label={typeDisplayName(s.type)} value={s.count} />
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by document name..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </div>

        {/* Type filter */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => handleTypeFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-9 py-3 text-sm text-slate-600 min-w-[130px] focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer"
          >
            {typeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt === 'All Type' ? 'All Type' : typeDisplayName(opt)}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <select
            value={dateOptions.some((opt) => opt.value === date) ? date : 'custom'}
            onChange={(e) => handleDate(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-9 py-3 text-sm text-slate-600 min-w-[130px] focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer"
          >
            {dateOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
            {date !== 'all' && !dateOptions.some((opt) => opt.value === date) && (
              <option value={date}>Custom: {date}</option>
            )}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Custom Date Input */}
        {/* <div className="relative">
          <DateInput
            value={dateOptions.some((opt) => opt.value === date) ? '' : date}
            onChange={handleDate}
            placeholder="Type date (YYYY-MM-DD)"
          />
          {isCustomDateActive && (
            <span
              className="absolute -bottom-5 left-0 text-[11px] text-amber-500 whitespace-nowrap"
              title="Backend doesn't support a specific date filter yet — showing all results"
            >
              Not supported by server yet
            </span>
          )}
        </div> */}

        {/* Clear filter button — shown when filters are active */}
        {/* {(search || typeFilter !== 'All Type' || date !== 'all') && (
          <button
            onClick={() => { setSearch(''); setTypeFilter('All Type'); setDate('all'); setPage(1); }}
            className="flex items-center gap-1.5 px-3 py-3 rounded-xl text-sm text-slate-400 hover:text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 transition-colors"
            title="Clear all filters"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )} */}
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <div className="flex-1 w-full bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex justify-center items-center text-slate-400 text-sm gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading documents...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium">
                    <th className="px-6 py-4 font-medium whitespace-nowrap">Document Name</th>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">Type</th>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">Uploaded By</th>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">Date</th>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">Size</th>
                    <th className="px-6 py-4 font-medium whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((doc) => {
                    const isSelected = previewOpen && doc.id === selectedId;
                    const isDownloading = downloadingId === doc.id;
                    return (
                      <tr key={doc.id} className={`transition-colors ${isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50/60'}`}>
                        <td className="px-6 py-4 text-slate-700 font-medium whitespace-nowrap max-w-[200px] truncate">{doc.documentName}</td>
                        <td className="px-6 py-4"><TypeBadge type={doc.type} /></td>
                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{doc.uploadedBy || '-'}</td>
                        <td className="px-6 py-4 text-slate-400 whitespace-nowrap">{formatDate(doc.date)}</td>
                        <td className="px-6 py-4 text-slate-400 whitespace-nowrap">{formatSize(doc.size)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleView(doc)}
                              className={`rounded-lg p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${isSelected ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                              aria-label={`Preview ${doc.documentName}`}
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRowDownload(doc)}
                              disabled={isDownloading}
                              className="rounded-lg p-1 text-green-500 hover:text-green-600 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-green-200"
                              aria-label={`Download ${doc.documentName}`}
                              title="Download"
                            >
                              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {documents.length === 0 && !docsFetching && (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-slate-400">No documents match your search.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && (
            <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} onPageChange={setPage} />
          )}
        </div>

        {previewOpen && selectedId && !isLoading && (
          <PreviewPanel
            documentId={selectedId}
            onClose={() => { setPreviewOpen(false); setSelectedId(null); }}
            onDownload={handlePreviewDownload}
            isDownloading={downloadingId === selectedId}
          />
        )}
      </div>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}