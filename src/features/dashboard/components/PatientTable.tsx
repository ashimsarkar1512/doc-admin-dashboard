import { PATIENTS } from '@/features/dashboard/data/patients';
import { Eye, Repeat } from 'lucide-react';

export function PatientTable() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-3 font-medium text-slate-500 text-sm">Patient</th>
              <th className="px-6 py-3 font-medium text-slate-500 text-sm">Assessment</th>
              <th className="px-6 py-3 font-medium text-slate-500 text-sm">Patient Type</th>
              <th className="px-6 py-3 font-medium text-slate-500 text-sm">Payment</th>
              <th className="px-6 py-3 font-medium text-slate-500 text-sm">Status</th>
              <th className="px-6 py-3 font-medium text-slate-500 text-sm">Date</th>
              <th className="px-6 py-3 font-medium text-slate-500 text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {PATIENTS.map((row) => {
              const isPending = row.status === 'Pending';

              return (
                <tr key={row.id} className="border-b border-slate-100 last:border-b-0">
                  {/* Patient – initials circle + name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#C4B5FD] flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-semibold text-white">
                          {row.patient.initials}
                        </span>
                      </div>
                      <span className="font-medium text-slate-700 whitespace-nowrap">
                        {row.patient.name}
                      </span>
                    </div>
                  </td>

                  {/* Assessment */}
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                    {row.assessment}
                  </td>

                  {/* Patient Type badge */}
                  <td className="px-6 py-4">
                    {row.patientType === 'New Patient' ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#2563EB] whitespace-nowrap">
                        New Patient
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-[#F3E8FF] px-3 py-1 text-xs font-medium text-[#6E11B0] whitespace-nowrap">
                        <Repeat size={12} />
                        Repeat Patient
                      </span>
                    )}
                  </td>

                  {/* Payment */}
                  <td className="px-6 py-4 text-slate-700 whitespace-nowrap">{row.payment}</td>

                  {/* Status pill */}
                  <td className="px-6 py-4">
                    {row.status === 'Approved' && (
                      <span className="inline-block rounded-lg bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#016630]">
                        Approved
                      </span>
                    )}
                    {row.status === 'Declined' && (
                      <span className="inline-block rounded-lg bg-[#FFE2E2] px-3 py-1 text-xs font-medium text-[#9F0712]">
                        Declined
                      </span>
                    )}
                    {row.status === 'Pending' && (
                      <span className="inline-block rounded-lg bg-[#FFEDD4] px-3 py-1 text-xs font-medium text-[#9F2D00]">
                        Pending
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{row.date}</td>

                  {/* Action */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label={`View ${row.patient.name}`}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        disabled={!isPending}
                        className={
                          isPending
                            ? 'rounded-lg bg-[#1447E6] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#1338C3] transition-colors whitespace-nowrap'
                            : 'rounded-lg bg-[#EFF6FF] px-4 py-1.5 text-xs font-medium text-[#90A1B9] cursor-not-allowed whitespace-nowrap'
                        }
                      >
                        {isPending ? 'Assign' : 'Assigned'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}