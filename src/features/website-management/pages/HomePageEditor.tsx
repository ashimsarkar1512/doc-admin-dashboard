
import { Save, Loader2 } from 'lucide-react';
import { HomepageProvider, useHomepage } from '../context/HomepageContext';
import { HeroSection } from '../components/home/HeroSection';
import { AboutUsSection } from '../components/home/AboutUsSection';
import { AssessmentSection } from '../components/home/AssessmentSection';
import { ProvidersSection } from '../components/home/ProvidersSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { TestimonialSection } from '../components/home/TestimonialSection';
import { FaqSection } from '../components/home/FaqSection';
import { useAppSelector } from '@/store/hooks';
import { useUserProfile } from '@/features/account-settings/hooks/useAccountSettings';

// ─── Inner editor — has access to context ────────────────────────────────────
function HomePageEditorInner() {
  const { isLoading, isSaving, isDirty, save } = useHomepage();
  const user = useAppSelector((state) => state.auth.user);
  const { data: profile } = useUserProfile();
  const currentUser = user || profile;
  const permissions: string[] = (currentUser as any)?.permissions ?? [];
  const isAdmin = currentUser?.roles?.includes('ADMIN') || currentUser?.role === 'ADMIN';
  const canManage = isAdmin || permissions.includes('manage:website_management');

  const SaveButton = () => {
    if (!canManage) return null;
    return (
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
        {isSaving ? 'Saving…' : 'Save Changes'}
      </button>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 size={32} className="animate-spin" />
          <p className="text-sm font-medium">Loading homepage content…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-7 max-w-7xl mx-auto space-y-8 min-h-full font-sans pb-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Home Page Content</h2>
          {isDirty && (
            <p className="text-xs text-amber-500 font-medium mt-0.5">You have unsaved changes</p>
          )}
        </div>
        <SaveButton />
      </div>

      {/* Sections */}
      <div className="space-y-6">
        <HeroSection />
        <AssessmentSection />
        <AboutUsSection />
        <ProvidersSection />
        <HowItWorksSection />
        <TestimonialSection />
        <FaqSection />
      </div>

      {/* Bottom Save */}
      <div className="pt-6">
        <SaveButton />
      </div>
    </div>
  );
}

// ─── Default export wraps with Provider ──────────────────────────────────────
export default function HomePageEditor() {
  return (
    <HomepageProvider>
      <HomePageEditorInner />
    </HomepageProvider>
  );
}
