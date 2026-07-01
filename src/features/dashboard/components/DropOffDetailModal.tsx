import { useQuery } from '@tanstack/react-query';
import { X, Calendar, FileText, Globe, CheckCircle, Tag } from 'lucide-react';
import { getDropOffById } from '@/api/endpoints/businessIntelligence.api';

interface Props {
  isOpen: boolean;
  dropOffId: string | null;
  onClose: () => void;
}

export default function DropOffDetailModal({ isOpen, dropOffId, onClose }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['drop-off-detail', dropOffId],
    queryFn: () => getDropOffById(dropOffId!),
    enabled: !!dropOffId && isOpen,
  });

  if (!isOpen) return null;

  const dropOff = data?.data;

  const fmtDate = (d: string | undefined) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-slate-800">Drop-Off Details</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1447E6]" />
            </div>
          ) : !dropOff ? (
            <div className="py-20 text-center text-slate-500">
              Failed to load drop-off details.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#E0E7FF] text-[#4F46E5] flex items-center justify-center font-bold text-xl shrink-0">
                    {dropOff.userName ? dropOff.userName.substring(0, 2).toUpperCase() : (dropOff.email ? dropOff.email.substring(0, 2).toUpperCase() : 'NA')}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{dropOff.userName || 'Unknown'}</h3>
                    <p className="text-slate-500">{dropOff.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600">
                      <Tag size={12} className="text-[#1447E6]" />
                      {dropOff.userType}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText size={14} /> Assessment
                  </label>
                  <p className="font-medium text-slate-800">{dropOff.assessmentName || 'N/A'}</p>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle size={14} /> Status
                  </label>
                  <p className="font-medium text-slate-800">{dropOff.status}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe size={14} /> IP Address
                  </label>
                  <p className="font-medium text-slate-800">{dropOff.ipAddress || 'N/A'}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={14} /> Timestamp
                  </label>
                  <p className="font-medium text-slate-800">{fmtDate(dropOff.timeStamp)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
