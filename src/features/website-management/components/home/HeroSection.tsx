import React from 'react';
import { Upload } from 'lucide-react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { CtaFormGroup } from '../shared/CtaFormGroup';

export function HeroSection() {
  return (
    <SectionCard title="Hero Section">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Hero Media</label>
          <div className="flex items-end gap-4">
            <div className="w-48 h-28 rounded-lg overflow-hidden border border-slate-200">
              <img src="/images/Login.png" className="w-full h-full object-cover" alt="Main" />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[11px] text-slate-500 max-w-[150px]">Recommended size: 1920x1080px (16:9 ratio)</div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                <Upload size={16} /> Upload
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Certificate badge:</label>
          <div className="flex items-end gap-4">
            <div className="w-48 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-slate-300 rounded-full border-2 border-white shadow-sm"></div>
                <div className="w-6 h-6 bg-slate-400 rounded-full border-2 border-white shadow-sm -ml-3"></div>
                <div className="w-6 h-6 bg-slate-500 rounded-full border-2 border-white shadow-sm -ml-3"></div>
                <div className="w-6 h-6 bg-slate-600 rounded-full border-2 border-white shadow-sm -ml-3"></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[11px] text-slate-500 max-w-[150px]">Upload transparent logos (png, svg)</div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                <Upload size={16} /> Upload
              </button>
            </div>
          </div>
        </div>

        <FormInput label="Hero title:" defaultValue="Medical Weight Management Program" />

        <FormTextarea
          label="Hero Description:"
          className="h-24"
          defaultValue="Our medical weight management program is a comprehensive program designed to help you lose weight safely and effectively. We offer a variety of services to help you reach your goals, including personalized meal plans, medical supervision, and ongoing support."
        />

        <CtaFormGroup defaultText="Apply Now" defaultUrl="https://weightlossmd.com" defaultOpenInNewTab={true} />
      </div>
    </SectionCard>
  );
}
