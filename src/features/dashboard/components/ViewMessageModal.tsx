
import Dialog from '@/components/shared/Dialog';
import { Mail, Trash2, User, Phone, Briefcase, MessageSquare } from 'lucide-react';
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
          {/* Contact Details Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 sm:p-5 space-y-3 sm:space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Information</h4>


             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">


              <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-white p-2 rounded-lg shadow-sm border border-slate-100 text-blue-500">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-0.5">Full Name</p>
                <p className="text-sm font-medium text-slate-800">{lead.fullName}</p>
              </div>
            </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-white p-2 rounded-lg shadow-sm border border-slate-100 text-amber-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-500 mb-0.5">Email Address</p>
                  <p className="text-sm font-medium text-slate-800 truncate" title={lead.email}>{lead.email}</p>
                </div>
              </div>
              
            </div>
            
            
           <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-white p-2 rounded-lg shadow-sm border border-slate-100 text-green-500 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-0.5">Contact Number</p>
                  <p className="text-sm font-medium text-slate-800">{lead.phone}</p>
                </div>
              </div>
           
          </div>

          {/* Inquiry Details Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-5 shadow-sm space-y-4 sm:space-y-5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Inquiry Details</h4>
            
            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-blue-50 p-2 rounded-lg text-blue-600">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-0.5">Service of Interest</p>
                <p className="text-sm font-medium text-slate-800">{lead.service}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-purple-50 p-2 rounded-lg text-purple-600">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 mb-0.5">Message</p>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mt-1.5">
                  <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">{lead.message}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2">
            <button
              onClick={() => {
                onDelete(lead.id);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-red-100 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors font-medium text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete lead
            </button>
            <button
              onClick={() => {
                onRespond(lead);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-md transition-all font-medium text-sm shadow-sm"
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
