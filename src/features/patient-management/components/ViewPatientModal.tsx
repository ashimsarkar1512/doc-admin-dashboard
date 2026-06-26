import { useQuery } from '@tanstack/react-query';
import { X,  Calendar, Mail, Phone, Activity,} from 'lucide-react';
import { getPatientDetails } from '@/api/endpoints/dashboard/patientManagement';

interface ViewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string | null;
}

export default function ViewPatientModal({ isOpen, onClose, patientId }: ViewPatientModalProps) {
  const { data: patient, isLoading, error } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => getPatientDetails(patientId!),
    enabled: !!patientId && isOpen,
  });

  if (!isOpen) return null;

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  console.log(patient)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Patient Details </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1447E6] mb-4" />
              <p className="text-sm text-slate-500">Loading patient data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 font-medium">Failed to load patient details</p>
              <button
                onClick={onClose}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Close
              </button>
            </div>
          ) : patient ? (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm">
                  {patient.image ? (
                    <img
                      src={patient.image}
                      alt={patient.name || "anonymous"}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-blue-700">
                      {getInitials(patient.name || "N/A")}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{patient.name|| "N/A "}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      patient.status === 'ACTIVE' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {patient.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3 p-3 border border-slate-100 rounded-lg">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Email Address</p>
                    <p className="text-sm text-slate-700 font-semibold break-all">{patient.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 border border-slate-100 rounded-lg">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Contact Number</p>
                      <p className="text-sm text-slate-700 font-semibold">{patient.contactNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border border-slate-100 rounded-lg">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                      <Activity size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Consultations</p>
                      <p className="text-sm text-slate-700 font-semibold">{patient.activeConsultation}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border border-slate-100 rounded-lg">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Joining Date</p>
                      <p className="text-sm text-slate-700 font-semibold">
                        {new Date(patient.joiningDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-semibold text-slate-600 hover:bg-gray-600 hover:text-white rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
