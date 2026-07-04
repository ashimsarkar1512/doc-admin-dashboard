import { Save, Loader2 } from "lucide-react";
import { HowItWorksHeroSection } from "../components/how-it-works/HowItWorksHeroSection";
import { HowItWorksJourneySection } from "../components/how-it-works/HowItWorksJourneySection";
import { HowItWorksDisclaimerSection } from "../components/how-it-works/HowItWorksDisclaimerSection";
import { HowItWorksFaqSection } from "../components/how-it-works/HowItWorksFaqSection";
import { HowItWorksCtaSection } from "../components/how-it-works/HowItWorksCtaSection";

import { HowItWorksProvider, useHowItWorksContext } from "../context/HowItWorksContext";

function HowItWorksPageEditorContent() {
  const { isSaving, isDirty, save } = useHowItWorksContext();

  return (
    <div className="p-4 sm:p-7 w-full space-y-8 min-h-full font-sans pb-20 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <div className="text-[15px] text-slate-800 font-medium flex items-center gap-2">
            <span className="text-slate-700 font-semibold">Pages</span>
            <span className="text-slate-500 font-normal">&gt;</span>
            <span className="text-slate-900 font-bold">How It Works</span>
          </div>
          {isDirty && (
            <p className="text-xs text-amber-500 font-medium mt-1">
              You have unsaved changes
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={save}
          disabled={isSaving || !isDirty}
          className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        <HowItWorksHeroSection />
        <HowItWorksJourneySection />
        <HowItWorksDisclaimerSection />
        <HowItWorksFaqSection />
        <HowItWorksCtaSection />
      </div>

      {/* Bottom Save */}
      <div className="pt-6">
        <button
          type="button"
          onClick={save}
          disabled={isSaving || !isDirty}
          className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default function HowItWorksPageEditor() {
  return (
    <HowItWorksProvider>
      <HowItWorksPageEditorContent />
    </HowItWorksProvider>
  );
}
