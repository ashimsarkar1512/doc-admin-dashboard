import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import { ChevronDown, ArrowUpRight, AlertCircle } from 'lucide-react';
import {
  getBiStats, getRevenueTrend,
  getPatientGrowth, getApprovalVsDenial, getRevenueByService,
  type BiFilter,
} from '@/api/endpoints/businessIntelligence.api';

// ─── helpers ─────────────────────────────────────────────────────────────────

const fmtUSD = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const fmtPct = (n: number) => `${n % 1 === 0 ? n : n.toFixed(1)}%`;

const FILTER_OPTIONS: { label: string; value: BiFilter }[] = [
  { label: 'Last 7 Days', value: 'last_7_days' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Last Year', value: 'last_year' },
];

const SERVICE_COLORS = ['#2563eb', '#a855f7', '#22c55e', '#f59e0b', '#06b6d4', '#ec4899'];

type TooltipPayloadItem = {
  dataKey: string;
  name: string;
  value: number;
  color: string;
};

// ─── tiny components ─────────────────────────────────────────────────────────

function FilterDropdown({ value, onChange }: { value: BiFilter; onChange: (v: BiFilter) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const label = FILTER_OPTIONS.find((o) => o.value === value)?.label ?? '';

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
      >
        {label} <ChevronDown size={11} />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[130px]"
        >
          {FILTER_OPTIONS.map((o) => (
            <button
              key={o.value}
              role="option"
              aria-selected={value === o.value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 ${value === o.value ? 'text-blue-600 font-semibold' : 'text-slate-600'}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Skeleton({ h = 'h-8' }: { h?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-100 ${h}`} />;
}

function ErrorState({ message = 'Could not load this data.' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 h-44 text-slate-400">
      <AlertCircle size={20} />
      <span className="text-xs text-center max-w-[200px]">{message}</span>
    </div>
  );
}

function EmptyState({ message = 'No data for this period yet.' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-44 text-xs text-slate-400">
      {message}
    </div>
  );
}

// Dark KPI card matching screenshot
function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-900 rounded-xl p-4 flex flex-col justify-between min-h-[88px]">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">{label}</span>
        <ArrowUpRight size={12} className="text-slate-500" />
      </div>
      <div>
        <div className="text-2xl font-bold text-white leading-none mt-1">{value}</div>
        <div className="text-[10px] text-slate-500 mt-1">This month</div>
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadItem[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value >= 1000 ? fmtUSD(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BusinessIntelligencePage() {
  const [trendFilter, setTrendFilter] = useState<BiFilter>('last_7_days');
  const [growthFilter, setGrowthFilter] = useState<BiFilter>('last_7_days');

  const { data: stats, isLoading: l1, isError: e1 } =
    useQuery({ queryKey: ['bi-stats'], queryFn: getBiStats });

  const { data: revenueTrend, isLoading: l2, isError: e2 } =
    useQuery({ queryKey: ['bi-trend', trendFilter], queryFn: () => getRevenueTrend(trendFilter) });

  const { data: patientGrowth, isLoading: l3, isError: e3 } =
    useQuery({ queryKey: ['bi-growth', growthFilter], queryFn: () => getPatientGrowth(growthFilter) });

  const { data: approvalData, isLoading: l4, isError: e4 } =
    useQuery({ queryKey: ['bi-approval'], queryFn: getApprovalVsDenial });

  const { data: revenueByService, isLoading: l5, isError: e5 } =
    useQuery({ queryKey: ['bi-by-service'], queryFn: getRevenueByService });

  const maxService = useMemo(
    () => Math.max(...(revenueByService?.map((s) => s.totalAmount) ?? [1]), 1),
    [revenueByService]
  );

  const hasApprovalData = !!(approvalData && (approvalData.approved > 0 || approvalData.rejected > 0));

  const approvalPie = useMemo(() => {
    if (!approvalData || !hasApprovalData) return [];
    const approved = approvalData.approvedPercentage || 0;
    const rejected = approvalData.rejectedPercentage || 0;
    return [
      { name: 'Approved', value: approved, color: '#22c55e' },
      { name: 'Denied',   value: rejected, color: '#ef4444' },
    ];
  }, [approvalData, hasApprovalData]);

  // KPI cards are built only from fields the API actually returns.
  // getBiStats() response shape: totalRevenue, totalRefund, newPatients,
  // activePatients, approvalRate, denialRate, subscriptionChurn, avgLTV.
  const kpis = stats
    ? [
        { label: 'Total Revenue', value: fmtUSD(stats.totalRevenue) },
        { label: 'Total Refund', value: fmtUSD(stats.totalRefund) },
        { label: 'Approval Rate', value: fmtPct(stats.approvalRate) },
        { label: 'Denial Rate', value: fmtPct(stats.denialRate) },
        { label: 'New Patients', value: String(stats.newPatients) },
        { label: 'Active Patients', value: String(stats.activePatients) },
        { label: 'Subscription Churn', value: fmtPct(stats.subscriptionChurn) },
        { label: 'Avg LTV', value: fmtUSD(stats.avgLTV) },
      ]
    : null;

  return (
    <div className="w-full bg-slate-50 p-5 md:p-8 min-h-screen space-y-6">

      {/* ── KPI grid ── */}
      {l1 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} h="h-20" />)}
        </div>
      ) : e1 ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <ErrorState message="Couldn't load your KPI stats. Try refreshing the page." />
        </div>
      ) : kpis ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kpis.map((k) => <KpiCard key={k.label} label={k.label} value={k.value} />)}
        </div>
      ) : null}

      {/* ── 3-chart row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue vs Refund */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-slate-800">Revenue vs Refund Trends</h3>
            <FilterDropdown value={trendFilter} onChange={setTrendFilter} />
          </div>
          <div className="flex gap-4 text-[11px] text-slate-500 mb-3">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-blue-600 inline-block" /> Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-amber-400 inline-block" /> Refund</span>
          </div>
          {l2 ? (
            <Skeleton h="h-44" />
          ) : e2 ? (
            <ErrorState message="Couldn't load revenue trends." />
          ) : !revenueTrend?.length ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={revenueTrend} margin={{ left: -15, right: 8, top: 4, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  ticks={[0, 20000, 40000, 60000, 80000]}
                  domain={[0, 80000]}
                  tickFormatter={(v) => `$${v === 0 ? '0k' : `${v / 1000}k`}`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2.5} dot={false} activeDot={{ r: 3 }} />
                <Line type="monotone" dataKey="refund" name="Refund" stroke="#f59e0b" strokeWidth={2.5} dot={false} activeDot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Patient Growth */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Patient Growth</h3>
            <FilterDropdown value={growthFilter} onChange={setGrowthFilter} />
          </div>
          {l3 ? (
            <Skeleton h="h-44" />
          ) : e3 ? (
            <ErrorState message="Couldn't load patient growth." />
          ) : !patientGrowth?.length ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={patientGrowth} margin={{ left: -15, right: 8, top: 4, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  ticks={[0, 350, 700, 1050, 1400]}
                  domain={[0, 1400]}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Patients" fill="#2563eb" radius={[3, 3, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Approval vs Denial */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Approval vs Denial</h3>
            <span className="flex items-center gap-1 text-xs text-slate-400 cursor-default">
              This year <ChevronDown size={12} />
            </span>
          </div>
          {l4 ? (
            <Skeleton h="h-52" />
          ) : e4 ? (
            <ErrorState message="Couldn't load approval data." />
          ) : approvalData ? (
            !hasApprovalData ? (
              /* ── No data yet: side-by-side layout ── */
              <div className="flex items-center justify-between gap-4">
                {/* Greyed-out placeholder donut */}
                <div className="flex-1 min-w-0 flex items-center justify-center">
                  <div className="relative w-[180px] h-[180px]">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      <circle cx="60" cy="60" r="38" fill="none" stroke="#f1f5f9" strokeWidth="18" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                      <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wide">No data</span>
                      <span className="text-slate-300 text-[10px]">yet</span>
                    </div>
                  </div>
                </div>
                {/* Legend */}
                <div className="flex flex-col gap-4 shrink-0 pr-2 justify-center">
                  {[
                    { label: 'Approved', color: '#22c55e', colorClass: 'bg-emerald-500', textClass: 'text-emerald-600' },
                    { label: 'Denied',   color: '#ef4444', colorClass: 'bg-red-500',     textClass: 'text-red-600'     },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-2.5">
                      <span className={`w-4 h-4 rounded-sm shrink-0 mt-0.5 opacity-40 ${item.colorClass}`} />
                      <div>
                        <p className={`text-sm font-bold ${item.textClass}`}>{item.label}</p>
                        <p className="text-[12px] font-semibold text-slate-800 mt-0.5">— &nbsp;<span className="text-slate-500 font-normal">(0%)</span></p>
                      </div>
                    </div>
                  ))}
                  <p className="text-[11px] text-slate-500 font-medium leading-snug mt-1 max-w-[130px] border-l-2 border-slate-200 pl-2">
                    No approvals or denials recorded yet.
                  </p>
                </div>
              </div>
            ) : (
              /* ── Has real data: show the donut ── */
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={approvalPie}
                        dataKey="value"
                        innerRadius={64}
                        outerRadius={100}
                        paddingAngle={2}
                        strokeWidth={0}
                        startAngle={90}
                        endAngle={-270}
                      >
                        {approvalPie.map((e) => (
                          <Cell key={e.name} fill={e.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
                        formatter={(v: number, name: string) => [`${(v as number).toFixed(1)}%`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-4 shrink-0 pr-2 justify-center">
                  {/* Approved */}
                  <div className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-sm shrink-0 mt-0.5 bg-emerald-500" />
                    <div>
                      <p className="text-sm font-bold text-emerald-600">Approved</p>
                      <p className="text-[12px] font-semibold text-slate-900 mt-0.5">
                        {approvalData.approved}&nbsp;
                        <span className="text-slate-500 font-normal">({approvalData.approvedPercentage.toFixed(1)}%)</span>
                      </p>
                    </div>
                  </div>
                  {/* Denied */}
                  <div className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-sm shrink-0 mt-0.5 bg-red-500" />
                    <div>
                      <p className="text-sm font-bold text-red-600">Denied</p>
                      <p className="text-[12px] font-semibold text-slate-900 mt-0.5">
                        {approvalData.rejected}&nbsp;
                        <span className="text-slate-500 font-normal">({approvalData.rejectedPercentage.toFixed(1)}%)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : null}
        </div>
      </div>

      {/* ── Top Services by Revenue ── */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-base font-semibold text-slate-800 mb-5">Top Services by Revenue</h3>
        {l5 ? (
          <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} h="h-5" />)}</div>
        ) : e5 ? (
          <ErrorState message="Couldn't load revenue by service." />
        ) : revenueByService?.length ? (
          <div className="space-y-4">
            {revenueByService.map((s, idx) => (
              <div key={s.categoryName} className="flex items-center gap-4">
                <span className="text-sm text-slate-600 w-44 shrink-0 truncate">{s.categoryName}</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(s.totalAmount / maxService) * 100}%`,
                      backgroundColor: SERVICE_COLORS[idx % SERVICE_COLORS.length],
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-700 w-20 text-right shrink-0">
                  {fmtUSD(s.totalAmount)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-6">No service data available</p>
        )}
      </div>

    </div>
  );
}