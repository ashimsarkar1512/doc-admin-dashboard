import React from 'react';
import type { ComplianceStatusItem } from './types';

interface ComplianceStatusProps {
  items: ComplianceStatusItem[];
}

const getStatusBadge = (statusText: string, type: ComplianceStatusItem['statusType']) => {
  if (type === 'success') {
    return <span className="px-2.5 py-0.5 bg-green-50 text-green-600 rounded text-[11px] font-semibold tracking-wide">{statusText}</span>;
  }
  if (type === 'warning') {
    return <span className="px-2.5 py-0.5 bg-orange-50 text-orange-600 rounded text-[11px] font-semibold tracking-wide">{statusText}</span>;
  }
  return <span className="px-2.5 py-0.5 bg-red-50 text-red-600 rounded text-[11px] font-semibold tracking-wide">{statusText}</span>;
};

const getProgressBarColor = (type: ComplianceStatusItem['statusType']) => {
  if (type === 'success') return 'bg-green-500';
  if (type === 'warning') return 'bg-orange-400';
  return 'bg-red-500';
};

export const ComplianceStatus: React.FC<ComplianceStatusProps> = ({ items }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 h-[22px]">
        <h3 className="text-[16px] font-semibold text-slate-800">Compliance Status</h3>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl flex-1 shadow-sm p-6">
        <div className="flex flex-col gap-6">
          {items.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[13px] font-medium text-slate-800">{item.label}</span>
                {getStatusBadge(item.statusText, item.statusType)}
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                <div 
                  className={`h-full rounded-full ${getProgressBarColor(item.statusType)} transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                {item.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
