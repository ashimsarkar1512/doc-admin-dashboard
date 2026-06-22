import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Dialog from '@/components/shared/Dialog';
import { getAllDoctors, assignDoctor, type Assessment, type Doctor } from '@/api/endpoints/dashboard/patientManagement';
import Swal from 'sweetalert2';

interface AssignDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: Assessment | null;
}

export default function AssignDoctorModal({ isOpen, onClose, assessment }: AssignDoctorModalProps) {
  const queryClient = useQueryClient();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: doctors, isLoading: doctorsLoading } = useQuery({
    queryKey: ['allDoctors'],
    queryFn: getAllDoctors,
  });

  const handleAssign = async () => {
    if (!assessment || !selectedDoctorId) return;

    setIsSubmitting(true);
    try {
      await assignDoctor({ submissionId: assessment.submissionId, doctorId: selectedDoctorId });
      Swal.fire('Success!', 'Doctor assigned successfully!', 'success');
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to assign doctor';
      Swal.fire('Error!', message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Assign doctor"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Category:
          </label>
          <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
            {assessment?.categoryName}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Provider:
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
            value={selectedDoctorId || ''}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            disabled={doctorsLoading}
          >
            <option value="">Select provider</option>
            {doctors?.map((doctor: Doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAssign}
            disabled={!selectedDoctorId || isSubmitting}
            className="flex-1 px-6 py-3 rounded-xl bg-[#1447E6] text-white font-medium hover:bg-[#1338C3] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
