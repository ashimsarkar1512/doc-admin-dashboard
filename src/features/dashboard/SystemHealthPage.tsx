import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import {
  Server,
  Mail,
  MessageSquare,
  CreditCard,
  Database,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,

  Clock,
  Loader2,
} from 'lucide-react';
import {
  getSystemHealthOverview,
  type ServiceStatus,
  type SystemService,
  type SystemMetricItem,
} from '@/api/endpoints/systemHealth.api';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCheckedAt(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 10) return 'Just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min${Math.floor(diff / 60) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function normalizeStatus(s: ServiceStatus): 'Operational' | 'Degraded' | 'Down' {
  if (s === 'OPERATIONAL') return 'Operational';
  if (s === 'DEGRADED') return 'Degraded';
  return 'Down';
}

function serviceIcon(key: string) {
  const cls = 'w-4 h-4';
  if (key === 'server_status') return <Server className={cls} />;
  if (key === 'email_delivery') return <Mail className={cls} />;
  if (key === 'sms_delivery') return <MessageSquare className={cls} />;
  if (key === 'payment_gateway') return <CreditCard className={cls} />;
  if (key === 'database_health') return <Database className={cls} />;
  if (key === 'login_error_rate') return <AlertCircle className={cls} />;
  return <AlertTriangle className={cls} />;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: 'Operational' | 'Degraded' | 'Down' }) {
  const cfg = {
    Operational: 'bg-green-100 text-green-700',
    Degraded: 'bg-amber-100 text-amber-700',
    Down: 'bg-red-100 text-red-700',
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg}`}>
      {status}
    </span>
  );
}

function StatusIcon({ status }: { status: 'Operational' | 'Degraded' | 'Down' }) {
  if (status === 'Operational') return <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />;
  if (status === 'Degraded') return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
  return <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
}

function UptimeBar({ percent, status }: { percent: number; status: 'Operational' | 'Degraded' | 'Down' }) {
  const color =
    status === 'Operational' ? 'bg-green-500' :
    status === 'Degraded' ? 'bg-amber-400' : 'bg-red-500';
  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
      />
    </div>
  );
}

function ServiceCardComponent({ svc }: { svc: SystemService }) {
  const status = normalizeStatus(svc.status);
  const hasUptime = svc.uptimePercent != null;
  const hasAlert = status !== 'Operational' && !!svc.message;

  const cardBg =
    status === 'Degraded' ? 'bg-amber-50 border-amber-200' :
    status === 'Down' ? 'bg-red-50 border-red-200' :
    'bg-white border-slate-200';

  const iconColor =
    status === 'Degraded' ? 'text-amber-500' :
    status === 'Down' ? 'text-red-500' : 'text-slate-500';

  const nameColor =
    status === 'Degraded' ? 'text-amber-800' :
    status === 'Down' ? 'text-red-800' : 'text-slate-700';

  const checkedColor =
    status === 'Degraded' ? 'text-amber-400' :
    status === 'Down' ? 'text-red-400' : 'text-slate-400';

  return (
    <div className={`rounded-xl border p-5 flex flex-col gap-3 transition-shadow hover:shadow-sm ${cardBg}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 ${iconColor}`}>
          {serviceIcon(svc.key)}
          <span className={`text-sm font-semibold ${nameColor}`}>{svc.name}</span>
        </div>
        <StatusIcon status={status} />
      </div>

      {/* Status + Response time */}
      <div className="flex items-center gap-2">
        <StatusBadge status={status} />
        {svc.responseTimeMs != null && (
          <span className="text-xs text-slate-500 font-mono">
            {svc.responseTimeMs >= 1000
              ? `${(svc.responseTimeMs / 1000).toFixed(1)}s`
              : `${svc.responseTimeMs}ms`}
          </span>
        )}
      </div>

      {/* Alert message */}
      {hasAlert && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700 leading-snug">
          {svc.message}
        </div>
      )}

      {/* Uptime bar */}
      {hasUptime && (
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Uptime</span>
            <span className="font-semibold text-slate-700">{svc.uptimePercent}%</span>
          </div>
          <UptimeBar percent={svc.uptimePercent} status={status} />
        </div>
      )}

      {/* Footer */}
      <p className={`text-xs flex items-center gap-1 ${checkedColor}`}>
        <Clock className="w-3 h-3" />
        Checked: {formatCheckedAt(svc.checkedAt)}
      </p>
    </div>
  );
}

function MetricCell({ item }: { item: SystemMetricItem }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-3 flex flex-col gap-1.5">
      <span className="text-xs text-slate-400 font-medium">{item.label}</span>
      <span className="text-2xl font-bold text-slate-800 leading-none">{item.displayValue}</span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SystemHealthPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['system-health-overview'],
    queryFn: getSystemHealthOverview,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const counts = data?.counts;
  const services = data?.services ?? [];
  const metrics = data?.metrics ?? [];

  const allOk = counts ? counts.degraded === 0 && counts.down === 0 : true;
  const hasDegraded = (counts?.degraded ?? 0) > 0;
  const hasDown = (counts?.down ?? 0) > 0;

  const bannerTitle =
    hasDown ? `${counts!.down} Service${counts!.down > 1 ? 's' : ''} Down` :
    hasDegraded ? (data?.title ?? 'Some Services Degraded') :
    'All Systems Operational';

  const bannerBg =
    hasDown ? 'bg-red-50 border-red-200' :
    hasDegraded ? 'bg-amber-50 border-amber-200' :
    'bg-green-50 border-green-200';

  const topMetrics = metrics.slice(0, 4);
  const bottomMetrics = metrics.slice(4);

  // ── Last-refreshed tracker ────────────────────────────────────────────────
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [refreshLabel, setRefreshLabel] = useState<string>('Just now');

  // Update label every 10 s
  useEffect(() => {
    const tick = () => {
      const diff = Math.floor((Date.now() - lastRefreshed.getTime()) / 1000);
      if (diff < 10) setRefreshLabel('Just now');
      else if (diff < 60) setRefreshLabel(`${diff}s ago`);
      else setRefreshLabel(`${Math.floor(diff / 60)} min ago`);
    };
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, [lastRefreshed]);

  const handleRefresh = useCallback(async () => {
    await refetch();
    setLastRefreshed(new Date());
  }, [refetch]);

  return (
    <>
      {/* Hide scrollbar but keep scroll working */}
      <style>{`
        main:has(> div[data-page="system-health"]) {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        main:has(> div[data-page="system-health"])::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
    <div
      data-page="system-health"
      className="w-full min-h-screen bg-slate-50 p-4 sm:p-6"
    >


      {/* Loading skeleton */}
      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 flex items-center gap-3">
          <XCircle className="w-5 h-5 shrink-0" />
          Failed to load system health data.
          <button onClick={() => refetch()} className="ml-auto text-xs font-medium underline">
            Retry
          </button>
        </div>
      )}

      {/* Content */}
      {!isLoading && !isError && data && (
        <>
          {/* Status banner */}
          <div className={`rounded-xl border px-5 py-4 flex items-center justify-between mb-6 ${bannerBg}`}>
            <div className="flex items-center gap-3">
              {allOk ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              ) : (
                <AlertTriangle className={`w-5 h-5 shrink-0 ${hasDown ? 'text-red-500' : 'text-amber-400'}`} />
              )}
              <div>
                <p className={`font-semibold text-sm ${
                  allOk ? 'text-green-700' : hasDown ? 'text-red-700' : 'text-amber-700'
                }`}>
                  {bannerTitle}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {counts?.operational ?? 0} operational · {counts?.degraded ?? 0} degraded · {counts?.down ?? 0} down
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isFetching}
              className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Refreshing...' : `Refresh · ${refreshLabel}`}
            </button>
          </div>

          {/* Service cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {services.map((svc) => (
              <ServiceCardComponent key={svc.id} svc={svc} />
            ))}
          </div>

          {/* Real-time metrics panel */}
          {metrics.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-800 text-sm">Real-time System Metrics</h2>
               
              </div>

              {/* Top 4 metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-3 border-b border-slate-100">
                {topMetrics.map((m) => (
                  <MetricCell key={m.id} item={m} />
                ))}
              </div>

              {/* Bottom metrics */}
              {bottomMetrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                  {bottomMetrics.map((m) => (
                    <MetricCell key={m.id} item={m} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
    </>
  );
}

