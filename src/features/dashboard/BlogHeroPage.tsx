import { useState, useEffect } from "react";
import { Save, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { getHeroSections, updateHeroSection } from "@/api/endpoints/hero-section.api";

export default function BlogHeroPage() {
  const [heroId, setHeroId] = useState<string | null>(null);
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await getHeroSections("Blog");
        if (res && res.length > 0) {
          const hero = res[0];
          setHeroId(hero.id);
          setHeroTitle(hero.title || "");
          setHeroDescription(hero.description || "");
        }
      } catch (err) {
        console.error("Failed to fetch hero section", err);
        toast.error("Failed to load hero section.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHero();
  }, []);

  const handleSave = async () => {
    if (!heroId) return;
    setIsSaving(true);
    try {
      await updateHeroSection(heroId, {
        page: "Blog",
        title: heroTitle,
        description: heroDescription,
      });
      setIsDirty(false);
      toast.success("Hero section updated successfully!");
    } catch (err) {
      console.error("Failed to save hero section", err);
      toast.error("Failed to save hero section.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 md:pt-4 mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Blog Hero Section</h1>
          <p className="text-sm text-slate-500 mt-1">Edit the hero title and description shown at the top of the blog page</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="flex items-center gap-2 bg-[#1447E6] hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed self-start sm:self-auto"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="animate-spin text-[#1447E6]" size={36} />
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-5">
          {/* Icon header */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-[#1447E6]/10 flex items-center justify-center shrink-0">
              <ImageIcon size={18} className="text-[#1447E6]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Hero Content</p>
              <p className="text-xs text-slate-500">This appears as the banner/hero area on the public Blog page</p>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Hero Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => { setHeroTitle(e.target.value); setIsDirty(true); }}
              placeholder="e.g. Our Latest Health Insights"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hero Description</label>
            <textarea
              value={heroDescription}
              onChange={(e) => { setHeroDescription(e.target.value); setIsDirty(true); }}
              placeholder="e.g. Stay up to date with expert medical advice and wellness tips from our team."
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all resize-y"
            />
          </div>

          {/* Preview card */}
          {(heroTitle || heroDescription) && (
            <div className="mt-2 rounded-xl bg-gradient-to-br from-[#1447E6]/5 to-blue-50 border border-[#1447E6]/10 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#1447E6] mb-2">Preview</p>
              {heroTitle && (
                <h2 className="text-xl font-bold text-slate-900 mb-1">{heroTitle}</h2>
              )}
              {heroDescription && (
                <p className="text-sm text-slate-600">{heroDescription}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom Save */}
      {!isLoading && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className="flex items-center gap-2 bg-[#1447E6] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
