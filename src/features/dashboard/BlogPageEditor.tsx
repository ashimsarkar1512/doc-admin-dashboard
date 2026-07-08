import { useState, useEffect } from "react";
import { Save, Loader2, ImagePlus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { getHeroSections, updateHeroSection } from "@/api/endpoints/hero-section.api";
import { getCtaSections, updateCtaSection } from "@/api/endpoints/cta-section.api";
import { getSideWidgetByPage, updateSideWidget } from "@/api/endpoints/side-widget.api";
import { uploadAttachment } from "@/api/endpoints/attachments.api";

export default function BlogPageEditor() {
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- Hero Section ---
  const [heroId, setHeroId] = useState<string | null>(null);
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");

  // --- Side Widget ---
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [widgetTitle, setWidgetTitle] = useState("");
  const [widgetButtonText, setWidgetButtonText] = useState("");
  const [widgetButtonUrl, setWidgetButtonUrl] = useState("");
  const [widgetIsBlank, setWidgetIsBlank] = useState(true);
  const [widgetImageId, setWidgetImageId] = useState<string | null>(null);
  const [widgetImagePreview, setWidgetImagePreview] = useState<string | null>(null);
  const [widgetImageFile, setWidgetImageFile] = useState<File | null>(null);

  // --- CTA Section ---
  const [ctaId, setCtaId] = useState<string | null>(null);
  const [ctaSectionTitle, setCtaSectionTitle] = useState("");
  const [ctaButtonText, setCtaButtonText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [ctaOpenInNewTab, setCtaOpenInNewTab] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const [heroRes, ctaRes, widgetRes] = await Promise.all([
          getHeroSections("Blog"),
          getCtaSections("Blog"),
          getSideWidgetByPage("Blog"),
        ]);

        // Hero
        if (heroRes && heroRes.length > 0) {
          const hero = heroRes[0];
          setHeroId(hero.id);
          setHeroTitle(hero.title || "");
          setHeroDescription(hero.description || "");
        }

        // CTA
        const cta = Array.isArray(ctaRes) ? ctaRes[0] : ctaRes?.data?.[0];
        if (cta) {
          setCtaId(cta.id);
          setCtaSectionTitle(cta.sectionTitle || "");
          setCtaButtonText(cta.ctaButtonText || "");
          setCtaUrl(cta.url || "");
          setCtaOpenInNewTab(cta.openInNewTab ?? true);
        }

        // Side Widget
        if (widgetRes && widgetRes.length > 0) {
          const w = widgetRes[0];
          setWidgetId(w.id);
          setWidgetTitle(w.title || "");
          setWidgetButtonText(w.buttonText || "");
          setWidgetButtonUrl(w.buttonUrl || "");
          setWidgetIsBlank(w.isBlank ?? true);
          setWidgetImageId(w.imageId || null);
          setWidgetImagePreview(w.image?.fileUrl || null);
        }
      } catch (err) {
        console.error("Failed to fetch blog page data", err);
        toast.error("Failed to load page data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const promises: Promise<any>[] = [];

      // Hero
      if (heroId) {
        promises.push(
          updateHeroSection(heroId, {
            page: "Blog",
            title: heroTitle,
            description: heroDescription,
          })
        );
      }

      // CTA
      if (ctaId) {
        promises.push(
          updateCtaSection(ctaId, {
            sectionTitle: ctaSectionTitle,
            ctaButtonText: ctaButtonText,
            url: ctaUrl,
            openInNewTab: ctaOpenInNewTab,
          })
        );
      }

      // Side Widget — upload image first if a new file was selected
      if (widgetId) {
        let imageId = widgetImageId;
        if (widgetImageFile) {
          const uploaded = await uploadAttachment(widgetImageFile, "PUBLIC");
          imageId = uploaded.id;
          setWidgetImageId(imageId);
          setWidgetImageFile(null);
        }
        promises.push(
          updateSideWidget(widgetId, {
            page: "Blog",
            title: widgetTitle,
            buttonText: widgetButtonText,
            buttonUrl: widgetButtonUrl,
            isBlank: widgetIsBlank,
            imageId: imageId,
          })
        );
      }

      await Promise.all(promises);
      setIsDirty(false);
      toast.success("Blog page settings saved!");
    } catch (err) {
      console.error("Failed to save blog page settings", err);
      toast.error("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleWidgetImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setWidgetImageFile(file);
      setWidgetImagePreview(URL.createObjectURL(file));
      setIsDirty(true);
    }
  };

  const mark = () => setIsDirty(true);

  const inputCls =
    "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all";
  const labelCls = "block text-sm font-semibold text-[#272628] mb-1.5";
  const sectionCls = "border border-slate-200 rounded-xl p-6 bg-white shadow-sm space-y-5";

  return (
    <div className="p-4 sm:p-7 w-full space-y-6 min-h-full font-sans pb-20 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="text-[15px] text-slate-800 font-medium flex items-center gap-2">
            <span className="text-slate-700 font-semibold">Pages</span>
            <span className="text-slate-500 font-normal">&gt;</span>
            <span className="text-slate-900 font-bold">Blogs</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-28">
          <Loader2 className="animate-spin text-[#1447E6]" size={40} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* ─── Hero Section ─── */}
          <div className={sectionCls}>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Hero Section</h3>
            <div>
              <label className={labelCls}>Hero title:</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => { setHeroTitle(e.target.value); mark(); }}
                placeholder="e.g. Our Latest Health Insights"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Hero Description:</label>
              <textarea
                value={heroDescription}
                onChange={(e) => { setHeroDescription(e.target.value); mark(); }}
                placeholder="e.g. Stay up to date with expert medical advice..."
                rows={3}
                className={`${inputCls} resize-y`}
              />
            </div>
          </div>

          {/* ─── Side Widget ─── */}
          <div className={sectionCls}>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Side Widget</h3>

            <div>
              <label className={labelCls}>Title:</label>
              <input
                type="text"
                value={widgetTitle}
                onChange={(e) => { setWidgetTitle(e.target.value); mark(); }}
                placeholder="e.g. Get Started Today"
                className={inputCls}
              />
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[160px]">
                <label className={labelCls}>CTA Action Text:</label>
                <input
                  type="text"
                  value={widgetButtonText}
                  onChange={(e) => { setWidgetButtonText(e.target.value); mark(); }}
                  placeholder="e.g. Contact Us"
                  className={inputCls}
                />
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className={labelCls}>URL:</label>
                <input
                  type="text"
                  value={widgetButtonUrl}
                  onChange={(e) => { setWidgetButtonUrl(e.target.value); mark(); }}
                  placeholder="https://..."
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <label className="block text-sm font-medium text-slate-700">Action target:</label>
                <label className="flex items-center gap-2 pb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={widgetIsBlank}
                    onChange={(e) => { setWidgetIsBlank(e.target.checked); mark(); }}
                    className="w-4 h-4 rounded text-[#1447E6] focus:ring-[#1447E6] border-slate-300"
                  />
                  <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                    Blank (open in new tab)
                  </span>
                </label>
              </div>
            </div>

            {/* Widget Image */}
            <div>
              <label className={labelCls}>Widget Image:</label>
              {widgetImagePreview ? (
                <div className="flex items-center gap-4 mt-1">
                  {/* Thumbnail */}
                  <div className="relative w-28 h-[72px] rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 group">
                    <img src={widgetImagePreview} alt="Widget" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} className="text-white drop-shadow" />
                    </div>
                  </div>
                  {/* Controls */}
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-colors shadow-sm w-fit">
                      <ImagePlus size={14} className="text-slate-500" />
                      Replace Image
                      <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleWidgetImageChange} className="hidden" />
                    </label>
                    <p className="text-xs text-slate-400">Recommended: JPG, PNG, WEBP, 1200 × 630 pixels</p>
                    <button
                      onClick={() => { setWidgetImagePreview(null); setWidgetImageId(null); setWidgetImageFile(null); mark(); }}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors text-left"
                    >
                      Remove image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 mt-1">
                  <label className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-colors shadow-sm">
                    <ImagePlus size={15} className="text-slate-500" />
                    Upload
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleWidgetImageChange} className="hidden" />
                  </label>
                  <p className="text-sm text-slate-400">Recommended: JPG, PNG, WEBP, 1200 × 630 pixels</p>
                </div>
              )}
            </div>
          </div>

          {/* ─── Bottom CTA Section ─── */}
          <div className={sectionCls}>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Bottom CTA Section</h3>

            <div>
              <label className={labelCls}>Section Title:</label>
              <input
                type="text"
                value={ctaSectionTitle}
                onChange={(e) => { setCtaSectionTitle(e.target.value); mark(); }}
                placeholder="e.g. Ready to start your health journey?"
                className={inputCls}
              />
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[160px]">
                <label className={labelCls}>CTA Action Text:</label>
                <input
                  type="text"
                  value={ctaButtonText}
                  onChange={(e) => { setCtaButtonText(e.target.value); mark(); }}
                  placeholder="e.g. Contact Us"
                  className={inputCls}
                />
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className={labelCls}>URL:</label>
                <input
                  type="text"
                  value={ctaUrl}
                  onChange={(e) => { setCtaUrl(e.target.value); mark(); }}
                  placeholder="https://..."
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <label className="block text-sm font-medium text-slate-700">Action target:</label>
                <label className="flex items-center gap-2 pb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ctaOpenInNewTab}
                    onChange={(e) => { setCtaOpenInNewTab(e.target.checked); mark(); }}
                    className="w-4 h-4 rounded text-[#1447E6] focus:ring-[#1447E6] border-slate-300"
                  />
                  <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                    Blank (open in new tab)
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save */}
      {!isLoading && (
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
