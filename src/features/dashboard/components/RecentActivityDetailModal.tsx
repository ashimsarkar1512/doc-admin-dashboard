import Dialog from '@/components/shared/Dialog';
import type { RecentActivity } from '@/api/endpoints/dashboard/overview';
import { Repeat, Hash, CalendarDays, Tag, ClipboardList, Stethoscope } from 'lucide-react';

interface Props {
  activity: RecentActivity | null;
  onClose: () => void;
}

function Avatar({ image, name }: { image: string | null; name: string | null }) {
  if (image)
    return (
      <img
        src={image}
        alt={name ?? ''}
        className="h-14 w-14 rounded-full object-cover shrink-0 shadow-sm"
      />
    );
  return (
    <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" aria-hidden="true">
        <circle cx="12" cy="8" r="4" fill="#94a3b8" />
        <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" fill="#94a3b8" />
      </svg>
    </div>
  );
}

function Field({
  label,
  value,
  icon: Icon,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md bg-slate-50 border border-slate-100 shrink-0">
        <Icon className="h-3.5 w-3.5 text-slate-400" />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{label}</span>
        <span className={`text-sm font-medium text-slate-700 break-words ${mono ? 'font-mono text-xs' : ''}`}>
          {value || '—'}
        </span>
      </div>
    </div>
  );
}

export default function RecentActivityDetailModal({ activity, onClose }: Props) {
  if (!activity) return null;

  const status = activity.status.toUpperCase();
  const statusStyle =
    status === 'APPROVED'
      ? 'bg-[#DCFCE7] text-[#016630]'
      : status === 'DECLINED'
      ? 'bg-[#FFE2E2] text-[#9F0712]'
      : 'bg-[#FFEDD4] text-[#9F2D00]';

  const formattedDate = new Date(activity.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Dialog isOpen={!!activity} onClose={onClose} title="Assessment Details" maxWidthClass="max-w-lg">
      {/* Patient header */}
      <div className="flex items-center gap-4 pb-5 border-b border-slate-100 mb-5">
        <Avatar image={activity.patientImage} name={activity.patientName} />
        <div className="min-w-0">
          <p className="text-base font-semibold text-slate-800 truncate">{activity.patientName ?? '—'}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {activity.patientType === 'New Patient' ? (
              <span className="inline-flex items-center rounded-lg bg-[#DBEAFE] px-2.5 py-0.5 text-xs font-medium text-[#2563EB]">
                New Patient
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#F3E8FF] px-2.5 py-0.5 text-xs font-medium text-[#6E11B0]">
                <Repeat size={11} /> Repeat Patient
              </span>
            )}
            <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium ${statusStyle}`}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Submission details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        <Field label="Submission Code" value={activity.submissionCode} icon={Hash} mono />
        <Field label="Date" value={formattedDate} icon={CalendarDays} />
        <Field label="Category" value={activity.categoryName} icon={Tag} />
        <Field label="Assessment" value={activity.assessmentName} icon={ClipboardList} />
      </div>

      {/* Provider — called out on its own row */}
      <div className="mt-5 pt-5 border-t border-slate-100">
        <Field label="Provider" value={activity.provider} icon={Stethoscope} />
      </div>

  
    </Dialog>
  );
}