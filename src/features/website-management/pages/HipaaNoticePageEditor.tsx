import { Loader2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PolicyHeroSection, type PolicyHeroData } from "../components/policy-pages/PolicyHeroSection";
import { PolicyContentSection, type PolicyContentData } from "../components/policy-pages/PolicyContentSection";
import { PolicyWidgetSection, type PolicyWidgetData } from "../components/policy-pages/PolicyWidgetSection";

import { getHeroSectionByPage, updateHeroSection } from "@/api/endpoints/hero-section.api";
import { getSideWidgetByPage, updateSideWidget } from "@/api/endpoints/side-widget.api";
import { getPolicyPageContent, updatePolicyPageContent } from "@/api/endpoints/policy-pages.api";
import { uploadAttachment } from "@/api/endpoints/attachments.api";

const defaultHero: PolicyHeroData = {
  title: "HIPAA Notice",
  description: "",
};

const defaultContent: PolicyContentData = {
  content: "",
};

const defaultWidget: PolicyWidgetData = {
  title: "",
  buttonText: "",
  buttonLink: "",
  newTab: false,
  mediaUrl: null,
  mediaName: null,
};

export default function HipaaNoticePageEditor() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);

  // Store IDs for updates
  const [heroId, setHeroId] = useState<string | null>(null);
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [widgetImageId, setWidgetImageId] = useState<string | null>(null);

  const [heroData, setHeroData] = useState<PolicyHeroData>(defaultHero);
  const [contentData, setContentData] = useState<PolicyContentData>(defaultContent);
  const [widgetData, setWidgetData] = useState<PolicyWidgetData>(defaultWidget);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [heroes, widget, contentRes] = await Promise.all([
        getHeroSectionByPage("HippaNotice").catch(() => []),
        getSideWidgetByPage("HippaNotice").catch(() => []),
        getPolicyPageContent("hippa-notice").catch(() => null)
      ]);

      if (heroes && heroes.length > 0) {
        setHeroId(heroes[0].id);
        setHeroData({
          title: heroes[0].title || "",
          description: heroes[0].description || ""
        });
      }

      if (widget && widget.length > 0) {
        setWidgetId(widget[0].id);
        setWidgetImageId(widget[0].imageId);
        setWidgetData({
          title: widget[0].title || "",
          buttonText: widget[0].buttonText || "",
          buttonLink: widget[0].buttonUrl || "",
          newTab: widget[0].isBlank || false,
          mediaUrl: widget[0].image?.fileUrl || null,
          mediaName: widget[0].image?.fileName || null
        });
      }

      if (contentRes) {
        setContentData({ content: contentRes.content || "" });
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load page data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (sectionName?: string) => {
    if (sectionName) {
      setSavingSection(sectionName);
    } else {
      setIsSaving(true);
    }
    
    try {
      const tasks = [];
      
      // Save Hero Section
      if ((!sectionName || sectionName === "Hero Section") && heroId) {
        tasks.push(updateHeroSection(heroId, {
          page: "HippaNotice",
          title: heroData.title,
          description: heroData.description
        }));
      }

      // Save Content
      if (!sectionName || sectionName === "HIPAA Notice Content") {
        tasks.push(updatePolicyPageContent("hippa-notice", {
          content: contentData.content
        }));
      }

      // Save Side Widget
      if ((!sectionName || sectionName === "Side Widget") && widgetId) {
        let finalImageId = widgetImageId;
        
        // Upload new image if there is one
        if (widgetData.mediaFile) {
          const uploadRes = await uploadAttachment(widgetData.mediaFile, "PUBLIC");
          finalImageId = uploadRes.id;
          setWidgetImageId(finalImageId); // update local state
          
          // Clear the file so we don't re-upload
          setWidgetData(prev => ({ ...prev, mediaFile: null }));
        } else if (!widgetData.mediaUrl) {
          // If the user removed the image
          finalImageId = null;
          setWidgetImageId(null);
        }

        tasks.push(updateSideWidget(widgetId, {
          page: "HippaNotice",
          title: widgetData.title,
          buttonText: widgetData.buttonText,
          buttonUrl: widgetData.buttonLink,
          isBlank: widgetData.newTab,
          imageId: finalImageId
        }));
      }

      await Promise.all(tasks);
      toast.success(sectionName ? `${sectionName} saved successfully!` : "Changes saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
      setSavingSection(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1447E6]" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-7  space-y-8 min-h-full font-sans pb-20 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="text-[15px] text-slate-800 font-medium flex items-center gap-2">
          <span className="text-slate-900 text-xl font-bold">
            Page: HIPAA Notice
          </span>
        </div>
        <button
          onClick={() => handleSave()}
          disabled={isSaving || savingSection !== null}
          className="flex items-center gap-2 bg-[#1447E6] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 w-max transition-colors disabled:opacity-50"
        >
          {isSaving && !savingSection ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isSaving && !savingSection ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      <div className="space-y-6">
        <PolicyHeroSection
          data={heroData}
          onChange={(data) => setHeroData((prev) => ({ ...prev, ...data }))}
          onSave={() => handleSave("Hero Section")}
          isSaving={savingSection === "Hero Section"}
        />

        <PolicyContentSection
          title="HIPAA Notice Content"
          data={contentData}
          onChange={(data) => setContentData((prev) => ({ ...prev, ...data }))}
          onSave={() => handleSave("HIPAA Notice Content")}
          isSaving={savingSection === "HIPAA Notice Content"}
        />

        <PolicyWidgetSection
          data={widgetData}
          onChange={(data) => setWidgetData((prev) => ({ ...prev, ...data }))}
          onSave={() => handleSave("Side Widget")}
          isSaving={savingSection === "Side Widget"}
        />
      </div>

      {/* Bottom Save Button */}
      <div className="pt-2 flex justify-start">
        <button
          onClick={() => handleSave()}
          disabled={isSaving || savingSection !== null}
          className="flex items-center gap-2 bg-[#1447E6] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 w-max transition-colors disabled:opacity-50"
        >
          {isSaving && !savingSection ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isSaving && !savingSection ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
