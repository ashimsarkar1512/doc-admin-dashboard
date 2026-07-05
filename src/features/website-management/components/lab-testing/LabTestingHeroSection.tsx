
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";
import { MediaUpload } from "../shared/MediaUpload";
import { SectionSaveButton } from "../shared/SectionSaveButton";

export interface LabHeroData {
  mediaUrl: string | null;
  mediaName: string | null;
  mediaFile?: File | null;
  pageTitle: string;
  pageDescription: string;
  buttonText: string;
  buttonLink: string;
  newTab: boolean;
}

interface Props {
  data: LabHeroData;
  onChange: (data: Partial<LabHeroData>) => void;
  onSave?: () => void;
  isSaving?: boolean;
}

export function LabTestingHeroSection({ data, onChange, onSave, isSaving }: Props) {
  return (
    <SectionCard title="Hero Section">
      <div className="space-y-5">
        <MediaUpload
          label="Hero Media"
          mediaUrl={data.mediaUrl}
          mediaName={data.mediaName}
          onUpload={(url, name, file) => onChange({ mediaUrl: url, mediaName: name, mediaFile: file })}
          onRemove={() => onChange({ mediaUrl: null, mediaName: null, mediaFile: null })}
          recommendedText="Recommended: JPG, PNG, MP4, 1200 x 630 pixels"
        />
        <FormInput
          label="Page Title:"
          value={data.pageTitle}
          onChange={(e) => onChange({ pageTitle: e.target.value })}
          placeholder="Hero page Title"
        />
        <FormTextarea
          label="Page Description:"
          className="h-24"
          value={data.pageDescription}
          onChange={(e) => onChange({ pageDescription: e.target.value })}
          placeholder="Hero Description..."
        />

        <div className="flex flex-col sm:flex-row flex-wrap sm:items-end gap-4">
          <div className="flex-1 min-w-[160px]">
            <FormInput
              label="CTA Button Text:"
              value={data.buttonText}
              onChange={(e) => onChange({ buttonText: e.target.value })}
              placeholder="Book a consultation"
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <FormInput
              label="URL:"
              value={data.buttonLink}
              onChange={(e) => onChange({ buttonLink: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            <label className="block text-sm font-medium text-slate-700">
              Button target:
            </label>
            <label className="flex items-center gap-2 pb-1.5 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-[#1447E6] focus:ring-[#1447E6] border-slate-300"
                checked={data.newTab}
                onChange={(e) => onChange({ newTab: e.target.checked })}
              />
              <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Blank Target (in new tab)
              </span>
            </label>
          </div>
        </div>
      </div>
      {onSave && <SectionSaveButton onSave={onSave} isSaving={isSaving} />}
    </SectionCard>
  );
}
