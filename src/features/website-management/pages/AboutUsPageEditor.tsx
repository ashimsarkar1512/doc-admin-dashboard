import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AboutUsHeroSection } from '../components/about-us/AboutUsHeroSection';
import { AboutUsBodySection } from '../components/about-us/AboutUsBodySection';
import { AboutUsFeaturesSection } from '../components/about-us/AboutUsFeaturesSection';
import { AboutUsFaqSection } from '../components/about-us/AboutUsFaqSection';

import { getAboutUs, updateAboutUs } from '@/api/endpoints/about-us.api';
import type { AboutUsData } from '@/api/endpoints/about-us.api';
import { uploadAttachment } from '@/api/endpoints/attachments.api';

const defaultData: AboutUsData = {
  heroTitle: '',
  heroDescription: '',
  heroButtonText: '',
  heroButtonUrl: '',
  heroTargetBlank: true,

  bodySection1Title: '',
  bodySection1Description: '',
  bodySection1ButtonText: '',
  bodySection1ButtonUrl: '',
  bodySection1TargetBlank: true,
  bodySection1ImageId: null,

  bodySection2Tag: '',
  bodySection2Title: '',
  bodySection2Description: '',
  bodySection2ButtonText: '',
  bodySection2ButtonUrl: '',
  bodySection2TargetBlank: true,
  bodySection2ImageId: null,

  bodySection3Tag: '',
  bodySection3Title: '',
  bodySection3Description: '',
  bodySection3Points: [],
  bodySection3ButtonText: '',
  bodySection3ButtonUrl: '',
  bodySection3TargetBlank: true,
  bodySection3ImageId: null,

  faqSectionTitle: '',
  faqCardTitle: '',
  faqCardDescription: '',
  faqButtonText: '',
  faqButtonUrl: '',
  faqTargetBlank: true,
  faqCardImageId: null,
  faqs: [],
};

export default function AboutUsPageEditor() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Global state for the entire page
  const [data, setData] = useState<AboutUsData>(defaultData);

  // Transient state for media files that need to be uploaded
  const [mediaFiles, setMediaFiles] = useState<{
    body1?: File | null;
    body2?: File | null;
    body3?: File | null;
    faq?: File | null;
  }>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getAboutUs();
      if (res) {
        setData(res);
      }
    } catch (error) {
      console.error('Error fetching about us data:', error);
      toast.error('Failed to load page data.');
    } finally {
      setIsLoading(false);
      setIsDirty(false);
    }
  };

  const handleChange = (updates: Partial<AboutUsData>) => {
    setData((prev) => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  const handleMediaFileChange = (section: keyof typeof mediaFiles, file: File | null) => {
    setMediaFiles((prev) => ({ ...prev, [section]: file }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const payload = { ...data };

      // Upload bodySection1Image if there's a new file
      if (mediaFiles.body1) {
        const uploadRes = await uploadAttachment(mediaFiles.body1, 'PUBLIC');
        payload.bodySection1ImageId = uploadRes.id;
      }

      // Upload bodySection2Image if there's a new file
      if (mediaFiles.body2) {
        const uploadRes = await uploadAttachment(mediaFiles.body2, 'PUBLIC');
        payload.bodySection2ImageId = uploadRes.id;
      }

      // Upload bodySection3Image if there's a new file
      if (mediaFiles.body3) {
        const uploadRes = await uploadAttachment(mediaFiles.body3, 'PUBLIC');
        payload.bodySection3ImageId = uploadRes.id;
      }

      // Upload faqCardImage if there's a new file
      if (mediaFiles.faq) {
        const uploadRes = await uploadAttachment(mediaFiles.faq, 'PUBLIC');
        payload.faqCardImageId = uploadRes.id;
      }

      // Strip backend-generated properties before sending the PATCH request
      const {
        id,
        createdAt,
        updatedAt,
        bodySection1Image,
        bodySection2Image,
        bodySection3Image,
        faqCardImage,
        ...patchData
      } = payload as any;

      // Send the complete updated payload
      const updatedData = await updateAboutUs(patchData);
      
      // Update local state with the returned data to ensure IDs and URLs are synced
      setData(updatedData);
      
      // Clear pending file uploads since they are now saved
      setMediaFiles({});
      setIsDirty(false);
      toast.success('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
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
      {isSaving ? 'Saving…' : 'Save All Changes'}
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1447E6]" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-7 max-w-7xl mx-auto space-y-8 min-h-full font-sans pb-20 bg-slate-50">
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
        <AboutUsHeroSection 
          data={data}
          onChange={handleChange}
          onSave={handleSave}
          isSaving={isSaving}
        />
        
        <AboutUsBodySection 
          cardTitle="Body Section 1" 
          defaultTitle="Our Mission" 
          showCta={true}
          acceptVideo={true}
          data={{
            title: data.bodySection1Title,
            description: data.bodySection1Description,
            buttonText: data.bodySection1ButtonText,
            buttonUrl: data.bodySection1ButtonUrl,
            targetBlank: data.bodySection1TargetBlank,
            mediaUrl: data.bodySection1Image?.fileUrl || null,
            mediaName: data.bodySection1Image?.fileName || null,
          }}
          onChange={(updates) => {
            const transformed: Partial<AboutUsData> = {};
            if (updates.title !== undefined) transformed.bodySection1Title = updates.title;
            if (updates.description !== undefined) transformed.bodySection1Description = updates.description;
            if (updates.buttonText !== undefined) transformed.bodySection1ButtonText = updates.buttonText;
            if (updates.buttonUrl !== undefined) transformed.bodySection1ButtonUrl = updates.buttonUrl;
            if (updates.targetBlank !== undefined) transformed.bodySection1TargetBlank = updates.targetBlank;
            if (updates.mediaUrl === null) {
              transformed.bodySection1ImageId = null;
              transformed.bodySection1Image = null;
            } else if (updates.mediaUrl !== undefined) {
              transformed.bodySection1Image = { fileUrl: updates.mediaUrl, fileName: updates.mediaName || '' };
            }
            if (updates.mediaFile !== undefined) handleMediaFileChange('body1', updates.mediaFile);
            handleChange(transformed);
          }}
          onSave={handleSave}
          isSaving={isSaving}
        />

        <AboutUsBodySection 
          cardTitle="Body Section 2" 
          defaultTitle="Our Vision" 
          showTag={true} 
          showCta={true} 
          acceptVideo={false}
          data={{
            tag: data.bodySection2Tag,
            title: data.bodySection2Title,
            description: data.bodySection2Description,
            buttonText: data.bodySection2ButtonText,
            buttonUrl: data.bodySection2ButtonUrl,
            targetBlank: data.bodySection2TargetBlank,
            mediaUrl: data.bodySection2Image?.fileUrl || null,
            mediaName: data.bodySection2Image?.fileName || null,
          }}
          onChange={(updates) => {
            const transformed: Partial<AboutUsData> = {};
            if (updates.tag !== undefined) transformed.bodySection2Tag = updates.tag;
            if (updates.title !== undefined) transformed.bodySection2Title = updates.title;
            if (updates.description !== undefined) transformed.bodySection2Description = updates.description;
            if (updates.buttonText !== undefined) transformed.bodySection2ButtonText = updates.buttonText;
            if (updates.buttonUrl !== undefined) transformed.bodySection2ButtonUrl = updates.buttonUrl;
            if (updates.targetBlank !== undefined) transformed.bodySection2TargetBlank = updates.targetBlank;
            if (updates.mediaUrl === null) {
              transformed.bodySection2ImageId = null;
              transformed.bodySection2Image = null;
            } else if (updates.mediaUrl !== undefined) {
              transformed.bodySection2Image = { fileUrl: updates.mediaUrl, fileName: updates.mediaName || '' };
            }
            if (updates.mediaFile !== undefined) handleMediaFileChange('body2', updates.mediaFile);
            handleChange(transformed);
          }}
          onSave={handleSave}
          isSaving={isSaving}
        />

        <AboutUsFeaturesSection 
          data={{
            tag: data.bodySection3Tag,
            title: data.bodySection3Title,
            description: data.bodySection3Description,
            points: data.bodySection3Points || [],
            buttonText: data.bodySection3ButtonText,
            buttonUrl: data.bodySection3ButtonUrl,
            targetBlank: data.bodySection3TargetBlank,
            mediaUrl: data.bodySection3Image?.fileUrl || null,
            mediaName: data.bodySection3Image?.fileName || null,
          }}
          onChange={(updates) => {
            const transformed: Partial<AboutUsData> = {};
            if (updates.tag !== undefined) transformed.bodySection3Tag = updates.tag;
            if (updates.title !== undefined) transformed.bodySection3Title = updates.title;
            if (updates.description !== undefined) transformed.bodySection3Description = updates.description;
            if (updates.points !== undefined) transformed.bodySection3Points = updates.points;
            if (updates.buttonText !== undefined) transformed.bodySection3ButtonText = updates.buttonText;
            if (updates.buttonUrl !== undefined) transformed.bodySection3ButtonUrl = updates.buttonUrl;
            if (updates.targetBlank !== undefined) transformed.bodySection3TargetBlank = updates.targetBlank;
            if (updates.mediaUrl === null) {
              transformed.bodySection3ImageId = null;
              transformed.bodySection3Image = null;
            } else if (updates.mediaUrl !== undefined) {
              transformed.bodySection3Image = { fileUrl: updates.mediaUrl, fileName: updates.mediaName || '' };
            }
            if (updates.mediaFile !== undefined) handleMediaFileChange('body3', updates.mediaFile);
            handleChange(transformed);
          }}
          onSave={handleSave}
          isSaving={isSaving}
        />

        <AboutUsFaqSection 
          data={{
            title: data.faqSectionTitle,
            cardTitle: data.faqCardTitle,
            cardDescription: data.faqCardDescription,
            buttonText: data.faqButtonText,
            buttonUrl: data.faqButtonUrl,
            targetBlank: data.faqTargetBlank,
            faqs: data.faqs || [],
            mediaUrl: data.faqCardImage?.fileUrl || null,
            mediaName: data.faqCardImage?.fileName || null,
          }}
          onChange={(updates) => {
            const transformed: Partial<AboutUsData> = {};
            if (updates.title !== undefined) transformed.faqSectionTitle = updates.title;
            if (updates.cardTitle !== undefined) transformed.faqCardTitle = updates.cardTitle;
            if (updates.cardDescription !== undefined) transformed.faqCardDescription = updates.cardDescription;
            if (updates.buttonText !== undefined) transformed.faqButtonText = updates.buttonText;
            if (updates.buttonUrl !== undefined) transformed.faqButtonUrl = updates.buttonUrl;
            if (updates.targetBlank !== undefined) transformed.faqTargetBlank = updates.targetBlank;
            if (updates.faqs !== undefined) transformed.faqs = updates.faqs;
            if (updates.mediaUrl === null) {
              transformed.faqCardImageId = null;
              transformed.faqCardImage = null;
            } else if (updates.mediaUrl !== undefined) {
              transformed.faqCardImage = { fileUrl: updates.mediaUrl, fileName: updates.mediaName || '' };
            }
            if (updates.mediaFile !== undefined) handleMediaFileChange('faq', updates.mediaFile);
            handleChange(transformed);
          }}
          onSave={handleSave}
          isSaving={isSaving}
        />
      </div>

      {/* Bottom Save */}
      <div className="pt-6 pb-12">
        <SaveButton />
      </div>
    </div>
  );
}
