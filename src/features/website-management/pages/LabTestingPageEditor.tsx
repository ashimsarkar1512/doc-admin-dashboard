import { Loader2, Save, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SectionSaveButton } from "../components/shared/SectionSaveButton";

import {
  LabTestingHeroSection,
  type LabHeroData,
} from "../components/lab-testing/LabTestingHeroSection";
import {
  LabTestingOverviewSection,
  type LabOverviewData,
} from "../components/lab-testing/LabTestingOverviewSection";
import {
  LabTestingServiceCard,
  type LabServiceData,
} from "../components/lab-testing/LabTestingServiceCard";
import {
  LabTestingCtaSection,
  type LabCtaData,
} from "../components/lab-testing/LabTestingCtaSection";

import { 
  getLabTestingHero, 
  updateLabTestingHero, 
  getLabTestingSection, 
  updateLabTestingSection 
} from "@/api/endpoints/lab-testing.api";
import { getCtaSections, updateCtaSection } from "@/api/endpoints/cta-section.api";
import { uploadAttachment } from "@/api/endpoints/attachments.api";

const defaultHero: LabHeroData = {
  mediaUrl: null,
  mediaName: null,
  pageTitle: "",
  pageDescription: "",
  buttonText: "",
  buttonLink: "",
  newTab: false,
};

const defaultOverview: LabOverviewData = {
  sectionTitle: "",
  sectionDescription: "",
};

const defaultCta: LabCtaData = {
  sectionTitle: "",
  buttonText: "",
  buttonLink: "",
  newTab: false,
};

export default function LabTestingPageEditor() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);

  const [heroData, setHeroData] = useState<LabHeroData>(defaultHero);
  const [heroImageId, setHeroImageId] = useState<string | null>(null);

  const [overviewData, setOverviewData] = useState<LabOverviewData>(defaultOverview);
  const [ctaData, setCtaData] = useState<LabCtaData>(defaultCta);
  const [ctaId, setCtaId] = useState<string | null>(null);

  // For services, we add an internal `imageId` to track existing images.
  const [services, setServices] = useState<(LabServiceData & { imageId: string | null })[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, sectionRes, ctaRes] = await Promise.all([
          getLabTestingHero(),
          getLabTestingSection(),
          getCtaSections("LabTest")
        ]);

        // Map Hero Data
        if (heroRes) {
          setHeroData({
            pageTitle: heroRes.title || "",
            pageDescription: heroRes.description || "",
            buttonText: heroRes.buttonText || "",
            buttonLink: heroRes.buttonUrl || "",
            newTab: heroRes.isBlank || false,
            mediaUrl: heroRes.image?.fileUrl || null,
            mediaName: heroRes.image?.fileName || null,
          });
          setHeroImageId(heroRes.imageId || null);
        }

        // Map Section Data
        if (sectionRes) {
          setOverviewData({
            sectionTitle: sectionRes.sectionTitle || "",
            sectionDescription: sectionRes.sectionDescription || "",
          });

          if (sectionRes.services && sectionRes.services.length > 0) {
            const mappedServices = sectionRes.services.map((s, index) => ({
              id: index.toString(),
              title: s.title || "",
              description: s.description || "",
              mediaUrl: s.image?.fileUrl || "",
              mediaName: s.image?.fileName || "",
              imageId: s.imageId || null,
              items: (s.tests || []).map((t, tIndex) => ({
                id: `${index}-${tIndex}`,
                name: t.name || "",
                details: t.duration || "",
                description: t.description || ""
              }))
            }));
            setServices(mappedServices);
          } else {
            // Default 1 empty service if none
            setServices([{
              id: "0",
              title: "",
              description: "",
              mediaUrl: "",
              mediaName: "",
              imageId: null,
              items: [],
            }]);
          }
        }

        // Map CTA Data
        if (ctaRes && ctaRes.data && ctaRes.data.length > 0) {
          const cta = ctaRes.data[0];
          setCtaData({
            sectionTitle: cta.sectionTitle || "",
            buttonText: cta.ctaButtonText || "",
            buttonLink: cta.url || "",
            newTab: cta.openInNewTab || false,
          });
          setCtaId(cta.id);
        }
      } catch (error) {
        console.error("Error fetching Lab Testing data:", error);
        toast.error("Failed to load page data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addService = () => {
    const newService = {
      id: Date.now().toString(),
      title: "",
      description: "",
      mediaUrl: "",
      mediaName: "",
      imageId: null,
      items: [],
    };
    setServices([...services, newService]);
  };

  const updateService = (id: string, updatedService: LabServiceData) => {
    setServices(services.map((s) => (s.id === id ? { ...s, ...updatedService } : s)));
  };

  const removeService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const handleSave = async (sectionName?: string) => {
    if (sectionName) {
      setSavingSection(sectionName);
    } else {
      setIsSaving(true);
    }

    try {
      // 1. Upload Hero Image if new
      let finalHeroImageId = heroImageId;
      if (heroData.mediaFile) {
        const uploadRes = await uploadAttachment(heroData.mediaFile, 'PUBLIC');
        finalHeroImageId = uploadRes.id;
        setHeroImageId(finalHeroImageId);
      } else if (heroData.mediaUrl === null) {
        finalHeroImageId = null;
        setHeroImageId(null);
      }

      // 2. Upload Services Images if new
      const processedServices = await Promise.all(
        services.map(async (service) => {
          let currentImageId = service.imageId;
          if (service.mediaFile) {
            const uploadRes = await uploadAttachment(service.mediaFile, 'PUBLIC');
            currentImageId = uploadRes.id;
          } else if (service.mediaUrl === '' || service.mediaUrl === null) {
            currentImageId = null;
          }
          return {
            ...service,
            imageId: currentImageId
          };
        })
      );
      // Update local state with new image IDs
      setServices(processedServices);

      // 3. Send API Requests
      const promises: Promise<any>[] = [
        updateLabTestingHero({
          title: heroData.pageTitle,
          description: heroData.pageDescription,
          buttonText: heroData.buttonText,
          buttonUrl: heroData.buttonLink,
          isBlank: heroData.newTab,
          imageId: finalHeroImageId
        }),
        updateLabTestingSection({
          sectionTitle: overviewData.sectionTitle,
          sectionDescription: overviewData.sectionDescription,
          services: processedServices.map(s => ({
            title: s.title,
            description: s.description,
            imageId: s.imageId,
            tests: s.items.map(t => ({
              name: t.name,
              duration: t.details,
              description: t.description
            }))
          }))
        })
      ];

      if (ctaId) {
        promises.push(
          updateCtaSection(ctaId, {
            page: "LabTest",
            sectionTitle: ctaData.sectionTitle,
            ctaButtonText: ctaData.buttonText,
            url: ctaData.buttonLink,
            openInNewTab: ctaData.newTab,
          })
        );
      }

      await Promise.all(promises);
      
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
          <div className="text-[15px] text-slate-800 font-medium flex items-center gap-2">
            <span className="text-slate-700 font-semibold">Pages</span>
            <span className="text-slate-500 font-normal">&gt;</span>
            <span className="text-slate-900 font-bold">
              Lab Testing
            </span>
          </div>
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
        <LabTestingHeroSection
          data={heroData}
          onChange={(data) => setHeroData((prev) => ({ ...prev, ...data }))}
          onSave={() => handleSave("Hero Section")}
          isSaving={savingSection === "Hero Section"}
        />

        <LabTestingOverviewSection
          data={overviewData}
          onChange={(data) => setOverviewData((prev) => ({ ...prev, ...data }))}
          onSave={() => handleSave("Lab Tests Section")}
          isSaving={savingSection === "Lab Tests Section"}
        />

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">
              Lab Test Services
            </h3>
          </div>

          <div className="space-y-8">
            {services.map((service, index) => (
              <div key={service.id}>
                <LabTestingServiceCard
                  cardTitle={`Lab Test Service ${index + 1}`}
                  data={service}
                  onChange={(data) => updateService(service.id, data)}
                  onRemove={
                    services.length > 1
                      ? () => removeService(service.id)
                      : undefined
                  }
                />
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={addService}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1447E6] text-[#1447E6] rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors shadow-sm"
            >
              <Plus size={16} /> Add New Service
            </button>
          </div>
          <SectionSaveButton 
            onSave={() => handleSave("Lab Test Services")} 
            isSaving={savingSection === "Lab Test Services"} 
          />
        </div>

        <LabTestingCtaSection
          data={ctaData}
          onChange={(data) => setCtaData((prev) => ({ ...prev, ...data }))}
          onSave={() => handleSave("Bottom CTA Section")}
          isSaving={savingSection === "Bottom CTA Section"}
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
