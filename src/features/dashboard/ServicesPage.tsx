import React from 'react';
import { useLocation } from "@tanstack/react-router";
import { Save } from 'lucide-react';

import ServicesHeroSection from '../website-management/pages/components/ServicesHeroSection';
import ServicesSecondSection from '../website-management/pages/components/ServicesSecondSection';
import ServicesFAQSection from '../website-management/pages/components/ServicesFAQSection';
import ServicesBottomCTASection from '../website-management/pages/components/ServicesBottomCTASection';

export default function ServicesPage() {
  const location = useLocation();
  let serviceSlug = location.href.split('?')[1] || "weight-loss";
  serviceSlug = serviceSlug.replace(/=.*$/, '');

  // Format slug back to title case for display
  const serviceTitle = serviceSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="p-6 mx-auto space-y-6 bg-slate-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="text-[15px] text-slate-800 font-medium flex items-center gap-2">
          <span className="text-slate-700 font-semibold">Pages</span>
          <span className="text-slate-500 font-normal">&gt;</span>
          <span className="text-slate-700 font-semibold">Services</span>
          <span className="text-slate-500 font-normal">&gt;</span>
          <span className="text-slate-900 font-bold">{serviceTitle}</span>
        </div>
        <button className="flex items-center gap-2 bg-[#1447E6] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 w-max transition-colors">
          <Save size={16} />
          Save Changes
        </button>
      </div>

      {/* Sections */}
      <ServicesHeroSection />
      <ServicesSecondSection />
      <ServicesFAQSection />
      <ServicesBottomCTASection />
      
      {/* Bottom Save Button */}
      <div className="pt-2 flex justify-start">
        <button className="flex items-center gap-2 bg-[#1447E6] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 w-max transition-colors">
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
