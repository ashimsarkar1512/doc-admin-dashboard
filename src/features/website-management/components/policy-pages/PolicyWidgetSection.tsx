import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { MediaUpload } from '../shared/MediaUpload';
import { SectionSaveButton } from '../shared/SectionSaveButton';

export interface PolicyWidgetData {
  title: string;
  buttonText: string;
  buttonLink: string;
  newTab: boolean;
  mediaUrl: string | null;
  mediaName: string | null;
  mediaFile?: File | null;
}

interface Props {
  data: PolicyWidgetData;
  onChange: (data: Partial<PolicyWidgetData>) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function PolicyWidgetSection({ data, onChange, onSave, isSaving }: Props) {
  return (
    <SectionCard title="Side Widget:">
      <div className="space-y-5">
        <FormInput
          label="Title:"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Write..."
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
              placeholder="https://example.com/contact"
            />
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            <label className="block text-sm font-medium text-slate-700">Button target:</label>
            <label className="flex items-center gap-2 pb-1.5 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-[#1447E6] focus:ring-[#1447E6] border-slate-300"
                checked={data.newTab}
                onChange={(e) => onChange({ newTab: e.target.checked })}
              />
              <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Blank (open in new tab)
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Widget Image:</label>
          <MediaUpload
            mediaUrl={data.mediaUrl}
            mediaName={data.mediaName}
            onUpload={(url, name, file) => onChange({ mediaUrl: url, mediaName: name, mediaFile: file })}
            onRemove={() => onChange({ mediaUrl: null, mediaName: null, mediaFile: null })}
            recommendedText="Recommended: JPG, PNG, MP4, 1200 x 630 pixels"
          />
        </div>
      </div>
      <SectionSaveButton onSave={onSave} isSaving={isSaving} />
    </SectionCard>
  );
}
