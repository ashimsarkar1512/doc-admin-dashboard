import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Pencil, Trash2, X, Loader2, Search, ChevronLeft, ChevronRight, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import { getContactLeads, getContactLeadById, updateContactLead, deleteContactLead } from '@/api/endpoints/contactLeads.api';
import type { ContactLead, ContactLeadsParams } from '@/types/contactLeads.types';

// ─── View Modal ──────────────────────────────────────────────────────────────
function ViewModal({ id, onClose }: { id: string; onClose: () => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['contact-lead', id],
    queryFn: () => getContactLeadById(id),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Lead Details</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
            <X size={18} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#1447E6]" />
          </div>
        ) : data ? (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Full Name" value={data.fullName} />
              <DetailItem label="Email" value={data.email} />
              <DetailItem label="Phone" value={data.phone} />
              <DetailItem label="Service" value={data.service} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Message</p>
              <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3 leading-relaxed">{data.message}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Read</p>
                <StatusBadge value={data.read} trueLabel="Read" falseLabel="Unread" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Responded</p>
                <StatusBadge value={data.responded} trueLabel="Responded" falseLabel="Pending" />
              </div>
            </div>
            {data.attachments && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Attachment</p>
                <a
                  href={data.attachments}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#1447E6] hover:underline font-medium"
                >
                  <Paperclip size={14} /> View Attachment
                </a>
              </div>
            )}
            <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
              Created: {new Date(data.createdAt).toLocaleString()}
            </p>
          </div>
        ) : null}

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ lead, onClose }: { lead: ContactLead; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    fullName: lead.fullName,
    email: lead.email,
    phone: lead.phone,
    service: lead.service,
    message: lead.message,
    read: lead.read,
    responded: lead.responded,
  });
  const [file, setFile] = useState<File | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: FormData) => updateContactLead({ id: lead.id, formData: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-leads'] });
      queryClient.invalidateQueries({ queryKey: ['contact-lead', lead.id] });
      toast.success('Contact lead updated successfully');
      onClose();
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(error?.response?.data?.message || error?.message || 'Failed to update lead');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('fullName', form.fullName);
    fd.append('email', form.email);
    fd.append('phone', form.phone);
    fd.append('service', form.service);
    fd.append('message', form.message);
    fd.append('read', String(form.read));
    fd.append('responded', String(form.responded));
    if (file) fd.append('attachments', file);
    mutate(fd);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-slate-800">Edit Lead</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Full Name" value={form.fullName} onChange={(v) => setForm((f) => ({ ...f, fullName: v }))} />
            <FormField label="Email" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
            <FormField label="Phone" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
            <FormField label="Service" value={form.service} onChange={(v) => setForm((f) => ({ ...f, service: v }))} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={3}
              placeholder="Enter message..."
              className="w-full bg-gray-200 border border-gray-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1447E6]/30 focus:border-[#1447E6] transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ToggleField label="Read" value={form.read} onChange={(v) => setForm((f) => ({ ...f, read: v }))} />
            <ToggleField label="Responded" value={form.responded} onChange={(v) => setForm((f) => ({ ...f, responded: v }))} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Replace Attachment</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#EFF6FF] file:text-[#1447E6] hover:file:bg-blue-100 transition-all"
            />
            {lead.attachments && !file && (
              <a href={lead.attachments} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#1447E6] hover:underline mt-1">
                <Paperclip size={12} /> Current attachment
              </a>
            )}
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2.5 rounded-lg bg-[#1447E6] text-white text-sm font-semibold hover:bg-[#1035C9] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isPending ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirmation ──────────────────────────────────────────────────────
function DeleteModal({ lead, onClose }: { lead: ContactLead; onClose: () => void }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteContactLead(lead.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-leads'] });
      toast.success('Lead deleted successfully');
      onClose();
    },
    onError: () => toast.error('Failed to delete lead'),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95">
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">Delete Lead</h2>
          <p className="text-sm text-slate-500 mb-2">
            Are you sure you want to delete the lead from <span className="font-semibold text-slate-700">{lead.fullName}</span>?
          </p>
          <p className="text-xs text-red-500 font-medium">This action cannot be undone.</p>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => mutate()}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isPending ? <><Loader2 size={16} className="animate-spin" /> Deleting...</> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-slate-800 font-medium">{value}</p>
    </div>
  );
}

function StatusBadge({ value, trueLabel, falseLabel }: { value: boolean; trueLabel: string; falseLabel: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${value ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
      {value ? trueLabel : falseLabel}
    </span>
  );
}

function FormField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-200 border border-gray-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1447E6]/30 focus:border-[#1447E6] transition-all"
      />
    </div>
  );
}

function ToggleField({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-[#1447E6]' : 'bg-slate-300'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ContactLeadsPage() {
  const [params, setParams] = useState<ContactLeadsParams>({ page: 1, limit: 10 });
  const [search, setSearch] = useState('');
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('all');
  const [filterResponded, setFilterResponded] = useState<'all' | 'responded' | 'pending'>('all');

  const [viewId, setViewId] = useState<string | null>(null);
  const [editLead, setEditLead] = useState<ContactLead | null>(null);
  const [deleteLead, setDeleteLead] = useState<ContactLead | null>(null);

  const queryParams: ContactLeadsParams = {
    ...params,
    search: search || undefined,
    read: filterRead === 'all' ? undefined : filterRead === 'read',
    responded: filterResponded === 'all' ? undefined : filterResponded === 'responded',
  };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['contact-leads', queryParams],
    queryFn: () => getContactLeads(queryParams),
    placeholderData: (prev) => prev,
    refetchInterval: 5000, // Auto-refetch every 5 seconds to stay updated
    refetchOnWindowFocus: true, // Refetch when the user returns to this browser tab
  });

  const leads = data?.data ?? [];
  const meta = data?.meta;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams((p) => ({ ...p, page: 1 }));
  };

  return (
    <div className="w-full p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Contact Leads</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Manage all incoming contact inquiries and leads</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, service..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-200 border border-gray-200 rounded-lg text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1447E6]/30 focus:border-[#1447E6] transition-all"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-[#1447E6] text-white text-sm font-medium rounded-lg hover:bg-[#1035C9] transition-colors">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterRead}
            onChange={(e) => { setFilterRead(e.target.value as typeof filterRead); setParams((p) => ({ ...p, page: 1 })); }}
            className="text-sm bg-gray-200 border border-gray-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1447E6]/30 focus:border-[#1447E6] transition-all"
          >
            <option value="all">All Read Status</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>
          <select
            value={filterResponded}
            onChange={(e) => { setFilterResponded(e.target.value as typeof filterResponded); setParams((p) => ({ ...p, page: 1 })); }}
            className="text-sm bg-gray-200 border border-gray-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1447E6]/30 focus:border-[#1447E6] transition-all"
          >
            <option value="all">All Response Status</option>
            <option value="responded">Responded</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Service</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Read</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Responded</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#1447E6] mx-auto" />
                    <p className="text-sm text-slate-400 mt-2">Loading leads...</p>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <p className="text-sm text-slate-400 font-medium">No contact leads found.</p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className={`hover:bg-slate-50 transition-colors ${isFetching ? 'opacity-60' : ''}`}>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">{lead.fullName}</div>
                      {lead.attachments && (
                        <a href={lead.attachments} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[#1447E6] hover:underline mt-0.5">
                          <Paperclip size={10} /> Attachment
                        </a>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-slate-700">{lead.email}</div>
                      <div className="text-xs text-slate-400">{lead.phone}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {lead.service}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge value={lead.read} trueLabel="Read" falseLabel="Unread" />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge value={lead.responded} trueLabel="Responded" falseLabel="Pending" />
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewId(lead.id)}
                          title="View"
                          className="p-2 rounded-lg text-slate-400 hover:text-[#1447E6] hover:bg-blue-50 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setEditLead(lead)}
                          title="Edit"
                          className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteLead(lead)}
                          title="Delete"
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-700">{(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)}</span> of <span className="font-semibold text-slate-700">{meta.total}</span> leads
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
                disabled={meta.page <= 1}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium text-slate-700">
                {meta.page} / {meta.totalPages}
              </span>
              <button
                onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
                disabled={meta.page >= meta.totalPages}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {viewId && <ViewModal id={viewId} onClose={() => setViewId(null)} />}
      {editLead && <EditModal lead={editLead} onClose={() => setEditLead(null)} />}
      {deleteLead && <DeleteModal lead={deleteLead} onClose={() => setDeleteLead(null)} />}
    </div>
  );
}
