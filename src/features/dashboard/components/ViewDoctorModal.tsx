import { useQuery } from '@tanstack/react-query';
import { Loader2, Mail, MapPin, Calendar, Stethoscope } from 'lucide-react';
import Dialog from '@/components/shared/Dialog';
import { getDoctorDetails } from '@/api/endpoints/dashboard/doctorManagement';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string | null;
}

export default function ViewDoctorModal({ isOpen, onClose, doctorId }: Props) {
  const { data: doctor, isLoading, isError } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: () => getDoctorDetails(doctorId!),
    enabled: !!doctorId && isOpen,
  });

  const getInitials = (name: string | null) =>
    (name || '')
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '??';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Doctor Details" maxWidthClass="max-w-[500px]">
      <div className="w-full flex flex-col pt-2 pb-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#1447E6]" />
            <p className="text-sm font-medium text-gray-500">Loading details...</p>
          </div>
        ) : isError || !doctor ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-red-500">
            <p className="text-sm font-medium">Failed to load doctor details.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Section: Avatar & Basic Info */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="relative">
                {doctor.thumbnail ? (
                  <img
                    src={doctor.thumbnail}
                    alt={doctor.fullName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : null}
                <div
                  className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md text-2xl font-bold text-blue-700"
                  style={{ display: doctor.thumbnail ? 'none' : 'flex' }}
                >
                  {getInitials(doctor.fullName)}
                </div>
              </div>
              
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                  {doctor.fullName}
                </h3>
                <p className="text-sm font-medium text-[#1447E6]">{doctor.roleTitle || 'No Title'}</p>
                {doctor.shortBio && (
                  <p className="text-[13px] text-gray-500 max-w-sm mt-1">{doctor.shortBio}</p>
                )}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-4 px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-400">Email Address</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{doctor.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-400">Office Location</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{doctor.officeLocation || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-400">Active Consultations</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {doctor.activeConsultation} active {doctor.activeConsultation === 1 ? 'case' : 'cases'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-400">Joined On</p>
                  <p className="text-sm font-semibold text-gray-800">{formatDate(doctor.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2 mt-4 border-t border-gray-100">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-gray-50 border border-gray-200 rounded-[8px] text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
