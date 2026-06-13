import React from 'react';
import Dialog from '@/components/shared/Dialog';
import { Mail, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getContactLeadById } from '@/api/endpoints/contact-leads.api';
import type { ContactLead } from '@/api/endpoints/contact-leads.api';

interface ViewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string | null;
  onDelete: (id: string) => void;
  onRespond: (lead: ContactLead) => void;
}

export default function ViewMessageModal({
  isOpen,
  onClose,
  leadId,
  onDelete,
  onRespond,
}: ViewMessageModalProps) {
  const { data: lead, isLoading, isError } = useQuery({
    queryKey: ['contact-lead', leadId],
    queryFn: () => getContactLeadById(leadId as string),
    enabled: !!leadId && isOpen,
  });

  if (!isOpen) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="View Message" maxWidthClass="max-w-2xl">
      {isLoading ? (
        <div className="p-8 flex justify-center items-center">
          <p className="text-slate-500">Loading details...</p>
        </div>
      ) : isError || !lead ? (
        <div className="p-8 flex justify-center items-center">
          <p className="text-red-500">Failed to load lead details.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-slate-900 block mb-1">Full Name:</label>
            <p className="text-slate-600 text-sm">{lead.fullName}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-1">Email:</label>
              <p className="text-slate-600 text-sm">{lead.email}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900 block mb-1">Contact number:</label>
              <p className="text-slate-600 text-sm">{lead.phone}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-900 block mb-1">What service you are interested in?</label>
            <p className="text-slate-600 text-sm">{lead.service}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-900 block mb-1">Message:</label>
            <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{lead.message}</p>
          </div>

          <div className="flex gap-4 pt-4 mt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onDelete(lead.id);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors font-medium text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete lead
            </button>
            <button
              onClick={() => {
                onRespond(lead);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Send response
              <Mail className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
