import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { AboutUsHeroSection } from '../components/about-us/AboutUsHeroSection';
import { AboutUsBodySection } from '../components/about-us/AboutUsBodySection';
import { AboutUsFeaturesSection } from '../components/about-us/AboutUsFeaturesSection';
import { AboutUsFaqSection } from '../components/about-us/AboutUsFaqSection';


export default function AboutUsPageEditor() {
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(true);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
    }, 1000);
  };

  const SaveButton = () => (
    <button
      type="button"
      onClick={handleSave}
      disabled={isSaving || !isDirty}
      className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSaving ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Save size={16} />
      )}
      {isSaving ? 'Saving…' : 'Save Changes'}
    </button>
  );

  return (
    <div className="p-4 sm:p-7 max-w-7xl mx-auto space-y-8 min-h-full font-sans pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101828]">Page: About Us</h2>
          {isDirty && (
            <p className="text-xs text-amber-500 font-medium mt-0.5">You have unsaved changes</p>
          )}
        </div>
        <SaveButton />
      </div>

      {/* Sections */}
      <div className="space-y-6">
        <AboutUsHeroSection />
        <AboutUsBodySection 
          cardTitle="Body Section 1" 
          defaultTitle="About us" 
        />
        <AboutUsBodySection 
          cardTitle="Body Section 2" 
          defaultTitle="Incorporate and oversee Various Athletics, Administrators, and Trainers." 
          showTag={true} 
          showCta={true} 
        />
        <AboutUsFeaturesSection />
        <AboutUsFaqSection />
      </div>

      {/* Bottom Save */}
      <div className="pt-6">
        <SaveButton />
      </div>
    </div>
  );
}
