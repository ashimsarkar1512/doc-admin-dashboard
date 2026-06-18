import { useState } from 'react';
import { useRecentActivity } from '@/hooks/useDashboardStats';
import type { RecentActivity } from '@/api/endpoints/dashboard/overview';
import { Eye, Repeat } from 'lucide-react';
import RecentActivityDetailModal from './RecentActivityDetailModal';

function Avatar({ image, name, size = 'sm' }: { image: string | null; name: string | null; size?: 'sm' | 'lg' }) {
  const dim = size === 'lg' ? 'h-14 w-14' : 'h-8 w-8';
  const textSize = size === 'lg' ? 'text-lg font-bold' : 'text-[11px] font-semibold';
  if (image)
    return <img src={image} alt={name ?? ''} className={`${dim} rounded-full object-cover shrink-0`} />;
  return (
    <div className={`${dim} rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200`}>
      <svg viewBox="0 0 24 24" fill="none" className={size === 'lg' ? 'w-8 h-8' : 'w-5 h-5'} aria-hidden="true">
        <circle cx="12" cy="8" r="4" fill="#94a3b8" />
        <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" fill="#94a3b8" />
      </svg>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toUpperCase();
  if (s === 'APPROVED')
    return <span className="inline-block rounded-lg bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#016630]">Approved</span>;
  if (s === 'DECLINED')
    return <span className="inline-block rounded-lg bg-[#FFE2E2] px-3 py-1 text-xs font-medium text-[#9F0712]">Declined</span>;
  return <span className="inline-block rounded-lg bg-[#FFEDD4] px-3 py-1 text-xs font-medium text-[#9F2D00]">Pending</span>;
}

export function PatientTable() {
  const { data, isLoading } = useRecentActivity();
  const [selected, setSelected] = useState<RecentActivity | null>(null);

  return (
    <>
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-3 font-medium text-slate-500 text-sm">Patient</th>
              <th className="px-6 py-3 font-medium text-slate-500 text-sm">Assessment</th>
              <th className="px-6 py-3 font-medium text-slate-500 text-sm">Patient Type</th>
              <th className="px-6 py-3 font-medium text-slate-500 text-sm">Provider</th>
              <th className="px-6 py-3 font-medium text-slate-500 text-sm">Status</th>
              <th className="px-6 py-3 font-medium text-slate-500 text-sm">Date</th>
              <th className="px-6 py-3 font-medium text-slate-500 text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-slate-400">Loading...</td>
              </tr>
            )}
            {!isLoading && (!data || data.length === 0) && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-slate-400">No recent activity</td>
              </tr>
            )}
            {data?.map((row: RecentActivity) => {
              const isPending = row.status.toUpperCase() === 'PENDING';
              return (
                <tr key={row.submissionId} className="border-b border-slate-100 last:border-b-0">
                  {/* Patient */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar image={row.patientImage} name={row.patientName} />
                      <span className="font-medium text-slate-700 whitespace-nowrap">
                        {row.patientName ?? '—'}
                      </span>
                    </div>
                  </td>

                  {/* Assessment */}
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                    {row.categoryName}
                  </td>

                  {/* Patient Type */}
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

                  {/* Provider */}
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                    {row.provider ?? '—'}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={row.status} />
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    {new Date(row.date).toLocaleDateString('en-US', { year: '2-digit', month: 'numeric', day: 'numeric' })}
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        className="text-slate-600 hover:text-slate-800 transition-colors"
                        aria-label={`View ${row.patientName}`}
                        onClick={() => setSelected(row)}
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
      <RecentActivityDetailModal activity={selected} onClose={() => setSelected(null)} />
    </>
  );
}
