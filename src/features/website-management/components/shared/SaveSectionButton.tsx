import { Save, Loader2 } from 'lucide-react';
import { useHomepage } from '../../context/HomepageContext';
import type { SectionName } from '../../context/HomepageContext';

interface SaveSectionButtonProps {
  section: SectionName;
}

export function SaveSectionButton({ section }: SaveSectionButtonProps) {
  const { isDirty, saveSection, savingSection } = useHomepage();
  const isSaving = savingSection === section;

  return (
    <div className="pt-4 flex justify-end border-t border-slate-100 mt-6">
      <button
        type="button"
        onClick={() => saveSection(section)}
        disabled={isSaving || !isDirty}
        className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Save size={16} />
        )}
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
