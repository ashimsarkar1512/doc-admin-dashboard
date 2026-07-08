import { useState, useEffect } from "react";
import { Save, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { getCtaSections, updateCtaSection } from "@/api/endpoints/cta-section.api";

export default function BlogCtaPage() {
  const [ctaId, setCtaId] = useState<string | null>(null);
  const [sectionTitle, setSectionTitle] = useState("");
  const [ctaButtonText, setCtaButtonText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCta = async () => {
      try {
        const res = await getCtaSections("Blog");
        const cta = Array.isArray(res) ? res[0] : res?.data?.[0];
        if (cta) {
          setCtaId(cta.id);
          setSectionTitle(cta.sectionTitle || "");
          setCtaButtonText(cta.ctaButtonText || "");
          setCtaUrl(cta.url || "");
          setOpenInNewTab(cta.openInNewTab ?? true);
        }
      } catch (err) {
        console.error("Failed to fetch CTA section", err);
        toast.error("Failed to load CTA section.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCta();
  }, []);

  const handleSave = async () => {
    if (!ctaId) return;
    setIsSaving(true);
    try {
      await updateCtaSection(ctaId, {
        sectionTitle,
        ctaButtonText,
        url: ctaUrl,
        openInNewTab,
      });
      setIsDirty(false);
      toast.success("Contact CTA updated successfully!");
    } catch (err) {
      console.error("Failed to save CTA section", err);
      toast.error("Failed to save CTA section.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 md:pt-4 mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Blog Contact CTA</h1>
          <p className="text-sm text-slate-500 mt-1">Edit the call-to-action section displayed on the public Blog page</p>
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
              <ExternalLink size={18} className="text-[#1447E6]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">CTA Section Details</p>
              <p className="text-xs text-slate-500">This is the contact call-to-action banner shown on the Blog page</p>
            </div>
          </div>

          {/* Section Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Section Title</label>
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => { setSectionTitle(e.target.value); setIsDirty(true); }}
              placeholder="e.g. Ready to start your health journey?"
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
            />
          </div>

          {/* Button Text + URL row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Button Text</label>
              <input
                type="text"
                value={ctaButtonText}
                onChange={(e) => { setCtaButtonText(e.target.value); setIsDirty(true); }}
                placeholder="e.g. Contact Us"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Button URL</label>
              <input
                type="url"
                value={ctaUrl}
                onChange={(e) => { setCtaUrl(e.target.value); setIsDirty(true); }}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
          </div>

          {/* Toggle */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => { setOpenInNewTab(v => !v); setIsDirty(true); }}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  openInNewTab ? "bg-[#1447E6]" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    openInNewTab ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Open in new tab</p>
                <p className="text-xs text-slate-500">
                  {openInNewTab ? "Button link will open in a new browser tab" : "Button link will open in the same tab"}
                </p>
              </div>
            </label>
          </div>

          {/* Preview */}
          {(sectionTitle || ctaButtonText) && (
            <div className="mt-2 rounded-xl bg-gradient-to-br from-[#1447E6]/5 to-blue-50 border border-[#1447E6]/10 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#1447E6] mb-3">Preview</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {sectionTitle && (
                  <h2 className="text-lg font-bold text-slate-900">{sectionTitle}</h2>
                )}
                {ctaButtonText && (
                  <a
                    href={ctaUrl || "#"}
                    target={openInNewTab ? "_blank" : "_self"}
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1447E6] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shrink-0"
                    onClick={(e) => e.preventDefault()}
                  >
                    {ctaButtonText}
                    {openInNewTab && <ExternalLink size={14} />}
                  </a>
                )}
              </div>
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
