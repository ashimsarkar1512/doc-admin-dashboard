import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { SaveLocalSectionButton } from './AboutUsSaveButton';
import { MediaUpload } from '../shared/MediaUpload';

export interface AboutUsBodySectionData {
  tag?: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonUrl?: string;
  targetBlank?: boolean;
  mediaUrl: string | null;
  mediaName: string | null;
  mediaFile?: File | null; // For uploading
}

interface AboutUsBodySectionProps {
  cardTitle: string;
  defaultTitle: string;
  showTag?: boolean;
  showCta?: boolean;
  acceptVideo?: boolean;
  data: AboutUsBodySectionData;
  onChange: (updates: Partial<AboutUsBodySectionData>) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function AboutUsBodySection({ 
  cardTitle, 
  defaultTitle, 
  showTag = false, 
  showCta = false,
  acceptVideo = false,
  data,
  onChange,
  onSave,
  isSaving
}: AboutUsBodySectionProps) {
  return (
    <SectionCard title={cardTitle}>
      <div className="space-y-5">
        {showTag && (
          <FormInput
            label="Section Tag:"
            value={data.tag || ''}
            onChange={(e) => onChange({ tag: e.target.value })}
            placeholder="e.g. Our Mission"
          />
        )}

        <FormInput
          label="Section Title:"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder={defaultTitle}
        />

        <FormTextarea
          label="Section Description:"
          className="h-24"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Enter description here..."
        />

        {showCta && (
          <div className="flex flex-col sm:flex-row flex-wrap sm:items-end gap-4">
            <div className="flex-1 min-w-[160px]">
              <FormInput
                label="CTA Button Text:"
                value={data.buttonText || ''}
                onChange={(e) => onChange({ buttonText: e.target.value })}
                placeholder="Contact Us"
              />
            </div>
            <div className="flex-1 min-w-[160px]">
              <FormInput
                label="URL:"
                value={data.buttonUrl || ''}
                onChange={(e) => onChange({ buttonUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <label className="block text-sm font-semibold text-[#272628]">Button target:</label>
              <label className="flex items-center gap-2 pb-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#1447E6] focus:ring-[#1447E6] border-slate-300"
                  checked={data.targetBlank ?? true}
                  onChange={(e) => onChange({ targetBlank: e.target.checked })}
                />
                <span className="text-sm font-medium text-[#272628] whitespace-nowrap">
                  Blank (open in new tab)
                </span>
              </label>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-[#272628] mb-2">Featured Media:</label>
          <MediaUpload
            mediaUrl={data.mediaUrl}
            mediaName={data.mediaName}
            onUpload={(url, name, file) => onChange({ mediaUrl: url, mediaName: name, mediaFile: file })}
            onRemove={() => onChange({ mediaUrl: null, mediaName: null, mediaFile: null })}
            recommendedText={acceptVideo ? "Recommended: JPG, PNG, WEBP, MP4, 1200 x 630 pixels" : "Recommended: JPG, PNG, WEBP, 1200 x 630 pixels"}
            acceptVideo={acceptVideo}
          />
        </div>
      </div>
      <SaveLocalSectionButton onClick={onSave} isSaving={isSaving} />
    </SectionCard>
  );
}
