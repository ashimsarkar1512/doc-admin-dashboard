import React from 'react';
import type { SummaryMetric } from './types';

interface SummaryCardsProps {
  metrics: SummaryMetric[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {metrics.map((metric, idx) => (
        <div key={idx} className="bg-[#2A2B2D] text-white rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[120px]">
          <div className="text-[13px] text-gray-300 font-medium">{metric.title}</div>
          <div>
            <div className="text-[28px] font-bold tracking-tight mt-2 mb-1">{metric.value}</div>
            <div className="text-[12px] text-gray-400">{metric.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
