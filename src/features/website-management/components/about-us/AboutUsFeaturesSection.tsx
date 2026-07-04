import { Plus, Trash2 } from 'lucide-react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { SaveLocalSectionButton } from './AboutUsSaveButton';
import { MediaUpload } from '../shared/MediaUpload';

export interface AboutUsFeaturesSectionData {
  tag: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  targetBlank: boolean;
  points: string[];
  mediaUrl: string | null;
  mediaName: string | null;
  mediaFile?: File | null;
}

interface AboutUsFeaturesSectionProps {
  data: AboutUsFeaturesSectionData;
  onChange: (updates: Partial<AboutUsFeaturesSectionData>) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function AboutUsFeaturesSection({ data, onChange, onSave, isSaving }: AboutUsFeaturesSectionProps) {
  
  const addPoint = () => {
    onChange({ points: [...data.points, ''] });
  };

  const removePoint = (indexToRemove: number) => {
    onChange({ points: data.points.filter((_, i) => i !== indexToRemove) });
  };

  const updatePoint = (indexToUpdate: number, text: string) => {
    onChange({ points: data.points.map((p, i) => (i === indexToUpdate ? text : p)) });
  };

  return (
    <SectionCard title="Body Section 3">
      <div className="space-y-5">
        <FormInput
          label="Section Tag:"
          value={data.tag}
          onChange={(e) => onChange({ tag: e.target.value })}
          placeholder="e.g. Why Choose Us"
        />

        <FormInput
          label="Section Title:"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Enter title here..."
        />

        <FormTextarea
          label="Section Description:"
          className="h-24"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Enter description here..."
        />

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-[#272628]">Key Points:</label>
            <button
              type="button"
              onClick={addPoint}
              className="flex items-center gap-1.5 text-sm font-medium text-[#1447E6] hover:text-blue-700 transition-colors"
            >
              <Plus size={16} /> Add point
            </button>
          </div>
          <div className="space-y-3">
            {data.points.map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-1">
                  <FormInput
                    label={`Point ${index + 1}:`}
                    value={point}
                    onChange={(e) => updatePoint(index, e.target.value)}
                    placeholder="Enter key point..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePoint(index)}
                  className="mt-8 text-slate-400 hover:text-red-500 transition-colors"
                  title="Remove point"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

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
              value={data.buttonUrl}
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
                checked={data.targetBlank}
                onChange={(e) => onChange({ targetBlank: e.target.checked })}
              />
              <span className="text-sm font-medium text-[#272628] whitespace-nowrap">
                Blank (open in new tab)
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#272628] mb-2">Featured Media:</label>
          <MediaUpload
            mediaUrl={data.mediaUrl}
            mediaName={data.mediaName}
            onUpload={(url, name, file) => onChange({ mediaUrl: url, mediaName: name, mediaFile: file })}
            onRemove={() => onChange({ mediaUrl: null, mediaName: null, mediaFile: null })}
            recommendedText="Recommended: JPG, PNG, WEBP, 1200 x 630 pixels"
            acceptVideo={false}
          />
        </div>
      </div>
      <SaveLocalSectionButton onClick={onSave} isSaving={isSaving} />
    </SectionCard>
  );
}
