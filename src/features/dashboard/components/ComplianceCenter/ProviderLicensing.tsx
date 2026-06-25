import React from 'react';
import { Search, ChevronDown, Calendar } from 'lucide-react';
import type { ProviderLicense } from './types';

interface ProviderLicensingProps {
  providers: ProviderLicense[];
}

export const ProviderLicensing: React.FC<ProviderLicensingProps> = ({ providers }) => {
  return (
    <div className="mt-8">
      <h3 className="text-[16px] font-semibold text-slate-800 mb-4">Provider Licensing</h3>
      
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, email,"
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 bg-white placeholder-slate-400"
          />
        </div>
        
        <div className="relative">
          <select className="appearance-none pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 bg-white focus:outline-none focus:border-blue-500 cursor-pointer min-w-[110px]">
            <option>All Role</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>

        <div className="relative">
          <select className="appearance-none pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 bg-white focus:outline-none focus:border-blue-500 cursor-pointer min-w-[110px]">
            <option>All Type</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>

        <div className="relative">
          <select className="appearance-none pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 bg-white focus:outline-none focus:border-blue-500 cursor-pointer min-w-[110px]">
            <option>All Status</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>

        <div className="relative">
          <select className="appearance-none pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 bg-white focus:outline-none focus:border-blue-500 cursor-pointer min-w-[110px]">
            <option>All Source</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>

        <div className="relative">
          <input
            type="text"
            defaultValue="2026-06-01"
            className="pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 bg-white focus:outline-none focus:border-blue-500 min-w-[130px]"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="//-//-//"
            className="pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-400 bg-white focus:outline-none focus:border-blue-500 min-w-[130px]"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {providers.map((provider) => (
          <div key={provider.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[#1A1F36] text-white flex items-center justify-center text-[13px] font-semibold shrink-0">
                {provider.initials}
              </div>
              <div>
                <div className="font-semibold text-slate-800 text-[14px] leading-tight mb-1.5">{provider.name}</div>
                <div className="flex flex-wrap gap-1">
                  {provider.states.map((state) => (
                    <span key={state} className="px-1.5 py-0.5 bg-[#EFF3FF] text-[#1447E6] rounded text-[10px] font-semibold">
                      {state}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <div className="text-[11px] text-slate-400 font-medium mb-0.5">NPI</div>
                <div className="text-[13px] font-semibold text-slate-700">{provider.npi}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium mb-0.5">DEA</div>
                <div className="text-[13px] font-semibold text-slate-700">{provider.dea}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-500">License Expires</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  provider.licenseStatus === 'warning' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                }`}>
                  {provider.licenseExpires}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-500">Insurance Expires</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  provider.insuranceStatus === 'warning' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                }`}>
                  {provider.insuranceExpires}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
