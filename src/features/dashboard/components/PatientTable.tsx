import { PATIENTS } from '@/features/dashboard/data/patients';
import { ShieldCheck } from 'lucide-react';

export function PatientTable() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-t border-b border-slate-200">
            <th className="px-6 py-3 font-medium text-slate-500 text-sm">Patient</th>
            <th className="px-6 py-3 font-medium text-slate-500 text-sm">Assessment</th>
            <th className="px-6 py-3 font-medium text-slate-500 text-sm">User Type</th>
            <th className="px-6 py-3 font-medium text-slate-500 text-sm">Status</th>
            <th className="px-6 py-3 font-medium text-slate-500 text-sm">Payment</th>
            <th className="px-6 py-3 font-medium text-slate-500 text-sm">Date</th>
          </tr>
        </thead>
        <tbody>
          {PATIENTS.map((row) => (
            <tr
              key={row.id}
              className="border-b border-slate-100"
            >
              {/* Patient – initials circle + name */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#C4B5FD] flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-semibold text-white">{row.patient.initials}</span>
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

              {/* User Type badge */}
              <td className="px-6 py-4">
                {row.userType === 'New Patient' ? (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#2563EB]">
                    New Patient
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#F3E8FF] px-3 py-1 text-xs font-medium text-[#6E11B0]">
                    <ShieldCheck size={12} />
                    Repeat Patient
                  </span>
                )}
              </td>

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

              {/* Payment */}
              <td className="px-6 py-4 text-slate-700">
                {row.payment}
              </td>

              {/* Date */}
              <td className="px-6 py-4 text-slate-500">
                {row.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
