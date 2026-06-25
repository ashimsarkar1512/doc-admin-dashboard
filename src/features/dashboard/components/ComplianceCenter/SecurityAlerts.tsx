import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { SecurityAlert } from './types';

interface SecurityAlertsProps {
  alerts: SecurityAlert[];
}

const getSeverityBadge = (severity: SecurityAlert['severity']) => {
  switch (severity) {
    case 'Critical':
      return <span className="px-2 py-0.5 bg-[#FFF1F1] text-[#F34D4D] rounded text-[11px] font-semibold tracking-wide uppercase">Critical</span>;
    case 'High':
      return <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-[11px] font-semibold tracking-wide uppercase">High</span>;
    case 'Medium':
      return <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded text-[11px] font-semibold tracking-wide uppercase">Medium</span>;
    case 'Low':
      return <span className="px-2 py-0.5 bg-blue-50 text-blue-500 rounded text-[11px] font-semibold tracking-wide uppercase">Low</span>;
  }
};

export const SecurityAlerts: React.FC<SecurityAlertsProps> = ({ alerts }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-semibold text-slate-800">Security & Risk Alerts</h3>
        <a href="#" className="flex items-center gap-1 text-[13px] text-[#1447E6] font-medium hover:underline">
          View All <ExternalLink size={14} />
        </a>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl flex-1 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-5 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getSeverityBadge(alert.severity)}
                  <span className="font-semibold text-[14px] text-slate-800 tracking-tight">{alert.title}</span>
                </div>
                <span className="text-[12px] text-slate-400 font-medium">{alert.timeAgo}</span>
              </div>
              <div className="pl-[76px]">
                <p className="text-[13px] text-slate-400 mb-0.5">{alert.detailLine1}</p>
                <p className="text-[13px] text-slate-500">{alert.detailLine2}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
