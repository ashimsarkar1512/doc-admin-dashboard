import React from 'react';
import { Save } from 'lucide-react';
import { HeroSection } from '../components/home/HeroSection';
import { AboutUsSection } from '../components/home/AboutUsSection';
import { AssessmentSection } from '../components/home/AssessmentSection';
import { ProvidersSection } from '../components/home/ProvidersSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { TestimonialSection } from '../components/home/TestimonialSection';
import { FaqSection } from '../components/home/FaqSection';

export default function HomePageEditor() {
  return (
    <div className="p-7 max-w-7xl mx-auto space-y-8 min-h-full font-sans pb-20">
      {/* Header with Save Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Home Page's Content</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        <HeroSection />
        <AssessmentSection />
        <AboutUsSection />
        <ProvidersSection />
        <HowItWorksSection />
        <TestimonialSection />
        <FaqSection />
      </div>

      {/* Bottom Save Changes */}
      <div className="pt-6">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
