import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus, Eye, Ban, Trash2, ChevronDown } from 'lucide-react';
import { dummyDoctors, type Doctor } from './data/doctors';
import AddDoctorModal from './components/AddDoctorModal';

export default function ProvidersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Using React Query to simulate an API call fetching the dummy data
  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ['doctors'],
    queryFn: async (): Promise<Doctor[]> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return dummyDoctors;
    }
  });

  // Basic filtering for the UI
  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.office.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="w-full p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Doctors</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-[#1447E6] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add New Doctor
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50 text-black placeholder:text-gray-400"
              placeholder="Search by name, email, job ID, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
            <button className="flex items-center justify-between gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white hover:bg-slate-50 min-w-[100px] shadow-sm">
              All
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            <button className="flex items-center justify-between gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white hover:bg-slate-50 min-w-[100px] shadow-sm">
              Roles
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            <button className="flex items-center justify-between gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white hover:bg-slate-50 min-w-[100px] shadow-sm">
              Office
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm overflow-x-auto">
          {isLoading ? (
            <div className="p-12 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1447E6]"></div>
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F3F4F6] text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-[13px]">Doctors</th>
                  <th className="px-6 py-4 font-semibold text-[13px]">Office</th>
                  <th className="px-6 py-4 font-semibold text-[13px]">Role/Title</th>
                  <th className="px-6 py-4 font-semibold text-[13px]">Email</th>
                  <th className="px-6 py-4 font-semibold text-[13px]">Active Consultation</th>
                  <th className="px-6 py-4 font-semibold text-[13px]">Status</th>
                  <th className="px-6 py-4 font-semibold text-[13px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-500">
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <img src={doctor.avatar} alt={doctor.name} className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm" />
                        <span className="font-medium text-slate-700">{doctor.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">{doctor.office}</td>
                    <td className="px-6 py-3">{doctor.role}</td>
                    <td className="px-6 py-3">{doctor.email}</td>
                    <td className="px-6 py-3">{doctor.activeConsultation}</td>
                    <td className="px-6 py-3">
                      <span className="px-3 py-1 text-[11px] font-medium bg-[#EEF2FF] text-[#1447E6] rounded-full">
                        {doctor.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-4 text-slate-400">
                        <button className="hover:text-slate-800 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="hover:text-slate-800 transition-colors">
                          <Ban size={16} />
                        </button>
                        <button className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {/* Empty state if search returns nothing */}
                {filteredDoctors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No doctors found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddDoctorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}
