import { useLocation } from "@tanstack/react-router";
import { Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import ServicesHeroSection from '../website-management/pages/components/ServicesHeroSection';


import { getCtaSections, updateCtaSection } from '@/api/endpoints/cta-section.api';
import { getServicePage, updateServicePage } from '@/api/endpoints/service-page.api';
import { getAllCategories } from '@/api/endpoints/stateCoverage.api';
import ServicesBottomCTASection, { type CtaData } from '../website-management/pages/components/ServicesBottomCTASection';
import ServicesFAQSection, { type FaqData } from '../website-management/pages/components/ServicesFAQSection';
import ServicesSecondSection, { type SecondData } from '../website-management/pages/components/ServicesSecondSection';

const defaultHero = { pageTitle: '', bannerImageId: '', mediaUrl: null as string | null, mediaType: null as 'image' | 'video' | null };
const defaultSecond: SecondData = { sectionTitle: '', sectionDescription: '', ctaButtonText: '', url: '', buttonTarget: false, featuredMediaId: '', featuredMediaName: null, featuredMediaType: null };
const defaultFaq: FaqData = { sectionTitle: '', faqs: [] };
const defaultCta: CtaData = { sectionTitle: '', ctaButtonText: '', url: '', openInNewTab: false };

export default function ServicesPage() {
  const location = useLocation();
  let serviceSlug = location.href.split('?')[1] || "weight-loss";
  serviceSlug = serviceSlug.replace(/=.*$/, '');

  const serviceTitle = serviceSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const [heroData, setHeroData] = useState(defaultHero);
  const [secondData, setSecondData] = useState<SecondData>(defaultSecond);
  const [faqData, setFaqData] = useState<FaqData>(defaultFaq);
  const [ctaData, setCtaData] = useState<CtaData>(defaultCta);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const categories = await getAllCategories();
        const matchedCategory = categories.find((cat: any) =>
          cat.name.toLowerCase().replace(/\s*&\s*/g, '-').replace(/\s+/g, '-') === serviceSlug
        );

        if (!matchedCategory) {
          toast.error("Category not found");
          setIsLoading(false);
          return;
        }
        setCategoryId(matchedCategory.id);

        const [servicePageRes, ctaRes] = await Promise.all([
          getServicePage(matchedCategory.id).catch(() => null),
          getCtaSections("ServiceCategory", matchedCategory.id).catch(() => null)
        ]);

        if (servicePageRes?.data) {
          const sp = servicePageRes.data;
          setHeroData(sp.heroSection ? {
            pageTitle: sp.heroSection.pageTitle || '',
            bannerImageId: sp.heroSection.bannerImageId || '',
            mediaUrl: sp.heroSection.bannerImage?.fileUrl || null,
            mediaType: sp.heroSection.bannerImage?.fileType?.startsWith('video/') ? 'video' : (sp.heroSection.bannerImage ? 'image' : null)
          } : defaultHero);

          setSecondData(sp.secondSection ? {
            sectionTitle: sp.secondSection.sectionTitle || '',
            sectionDescription: sp.secondSection.sectionDescription || '',
            ctaButtonText: sp.secondSection.ctaButtonText || '',
            url: sp.secondSection.url || '',
            buttonTarget: !!sp.secondSection.buttonTarget,
            featuredMediaId: sp.secondSection.featuredMediaId || '',
            featuredMediaName: sp.secondSection.featuredMedia?.fileName || null,
            featuredMediaType: sp.secondSection.featuredMedia?.fileType?.startsWith('video/') ? 'video' : (sp.secondSection.featuredMedia ? 'image' : null)
          } : defaultSecond);

          setFaqData(sp.faqSection ? {
            sectionTitle: sp.faqSection.sectionTitle || '',
            faqs: sp.faqSection.faqs?.map((f: any) => ({ ...f, id: f.id || crypto.randomUUID() })) || []
          } : defaultFaq);
        } else {
          setHeroData(defaultHero);
          setSecondData(defaultSecond);
          setFaqData(defaultFaq);
        }

        if (ctaRes?.data && ctaRes.data.length > 0) {
          const cta = ctaRes.data[0];
          setCtaData({
            id: cta.id,
            sectionTitle: cta.sectionTitle || '',
            ctaButtonText: cta.ctaButtonText || '',
            url: cta.url || '',
            openInNewTab: !!cta.openInNewTab
          });
        } else {
          setCtaData(defaultCta);
        }

      } catch (error) {
        console.error("Error fetching services page data:", error);
        toast.error("Failed to load page data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [serviceSlug]);

  const handleSave = async () => {
    if (!categoryId) return;

    setIsSaving(true);
    try {
      const spPayload = {
        heroSection: {
          bannerImageId: heroData.bannerImageId || undefined,
          pageTitle: heroData.pageTitle
        },
        secondSection: {
          sectionTitle: secondData.sectionTitle,
          sectionDescription: secondData.sectionDescription,
          ctaButtonText: secondData.ctaButtonText,
          url: secondData.url,
          buttonTarget: secondData.buttonTarget,
          featuredMediaId: secondData.featuredMediaId || undefined
        },
        faqSection: {
          sectionTitle: faqData.sectionTitle,
          faqs: faqData.faqs.map(({ question, answer }) => ({ question, answer }))
        }
      };

      const promises = [updateServicePage(categoryId, spPayload)];

      if (ctaData.id) {
        promises.push(updateCtaSection(ctaData.id, {
          page: "ServiceCategory",
          sectionTitle: ctaData.sectionTitle,
          ctaButtonText: ctaData.ctaButtonText,
          url: ctaData.url,
          openInNewTab: ctaData.openInNewTab,
          categoryId: categoryId
        }));
      }

      await Promise.all(promises);
      toast.success("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="animate-spin text-[#1447E6]" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto space-y-6 bg-slate-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="text-[15px] text-slate-800 font-medium flex items-center gap-2">
          <span className="text-slate-700 font-semibold">Website Management</span>
          <span className="text-slate-500 font-normal">&gt;</span>
          <span className="text-slate-700 font-semibold">Pages</span>
          <span className="text-slate-500 font-normal">&gt;</span>
          <span className="text-slate-900 font-bold">{serviceTitle}</span>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#1447E6] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 w-max transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        <ServicesHeroSection
          data={heroData}
          onChange={(data) => setHeroData(prev => ({ ...prev, ...data }))}
        />
        <ServicesSecondSection
          data={secondData}
          onChange={(data) => setSecondData(prev => ({ ...prev, ...data }))}
        />
        <ServicesFAQSection
          data={faqData}
          onChange={(data) => setFaqData(prev => ({ ...prev, ...data }))}
        />
        <ServicesBottomCTASection
          data={ctaData}
          onChange={(data) => setCtaData(prev => ({ ...prev, ...data }))}
        />
      </div>

      {/* Bottom Save Button */}
      <div className="pt-2 flex justify-start">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#1447E6] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 w-max transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
