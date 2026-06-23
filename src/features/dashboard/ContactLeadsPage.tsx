import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getContactLeads, respondContactLead, deleteContactLead, exportContactLeads } from '@/api/endpoints/contact-leads.api';
import type { ContactLead } from '@/api/endpoints/contact-leads.api';
import ContactLeadsTable from './components/ContactLeadsTable';
import ViewMessageModal from './components/ViewMessageModal';
import ResponseQuoteModal from './components/ResponseQuoteModal';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ContactLeadsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  const [viewLeadId, setViewLeadId] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [respondLead, setRespondLead] = useState<ContactLead | null>(null);
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['contact-leads', page, limit],
    queryFn: () => getContactLeads({ page, limit }),
  });


console.log(data,"contact data")



  const deleteMutation = useMutation({
    mutationFn: deleteContactLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-leads'] });
      setIsViewModalOpen(false);
      setViewLeadId(null);
    },
  });

  const respondMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => respondContactLead(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-leads'] });
      setIsRespondModalOpen(false);
      setRespondLead(null);
    },
  });

  const handleView = (lead: ContactLead) => {
    setViewLeadId(lead.id);
    setIsViewModalOpen(true);
  };

  const handleRespond = (lead: ContactLead) => {
    setRespondLead(lead);
    setIsRespondModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact lead?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSendResponse = (id: string, formData: FormData) => {
    respondMutation.mutate({ id, formData });
  };

const handleExport = async () => {
  try {
    const blob = await exportContactLeads();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contact-leads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export failed:', error);
    alert('Failed to export data. Please try again.');
  }
};

  return (
    <div className="w-full p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-end  mb-8 gap-4">
      
        <div className="flex justify-end items-center gap-3 w-full sm:w-auto">
          {/* <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>All services</option>
          </select>
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>Today</option>
          </select> */}
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors ml-auto sm:ml-0"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
        {isError ? (
          <div className="p-8 text-center text-red-500">Failed to load contact leads.</div>
        ) : (
          <>
            <ContactLeadsTable
              leads={data?.data || []}
              isLoading={isLoading}
              onView={handleView}
              onRespond={handleRespond}
              onDelete={handleDelete}
            />

            {!isLoading && data?.meta && data.meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
                <span className="text-sm text-slate-500">
                  Showing {((data.meta.page - 1) * data.meta.limit) + 1} to {Math.min(data.meta.page * data.meta.limit, data.meta.total)} of {data.meta.total} results
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-slate-700">
                    Page {page} of {data.meta.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
                    disabled={page === data.meta.totalPages}
                    className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ViewMessageModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewLeadId(null);
        }}
        leadId={viewLeadId}
        onDelete={(id) => {
          handleDelete(id);
        }}
        onRespond={(lead) => {
          setIsViewModalOpen(false);
          handleRespond(lead);
        }}
      />

      <ResponseQuoteModal
        isOpen={isRespondModalOpen}
        onClose={() => {
          setIsRespondModalOpen(false);
          setRespondLead(null);
        }}
        lead={respondLead}
        onSend={handleSendResponse}
        isSending={respondMutation.isPending}
      />
    </div>
  );
}
