import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { SectionSaveButton } from '../shared/SectionSaveButton';

export interface LabCtaData {
  sectionTitle: string;
  buttonText: string;
  buttonLink: string;
  newTab: boolean;
}

interface Props {
  data: LabCtaData;
  onChange: (data: Partial<LabCtaData>) => void;
  onSave?: () => void;
  isSaving?: boolean;
}

export function LabTestingCtaSection({ data, onChange, onSave, isSaving }: Props) {
  return (
    <SectionCard title="Bottom CTA Section:">
      <div className="space-y-5">
        <FormInput
          label="Section Title:"
          value={data.sectionTitle}
          onChange={(e) => onChange({ sectionTitle: e.target.value })}
          placeholder="Ready to get your lab tests?"
        />

        <div className="flex flex-col sm:flex-row flex-wrap sm:items-end gap-4">
          <div className="flex-1 min-w-[160px]">
            <FormInput
              label="CTA Button Text:"
              value={data.buttonText}
              onChange={(e) => onChange({ buttonText: e.target.value })}
              placeholder="Contact Us"
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
            <label className="block text-sm font-medium text-slate-700">Button target:</label>
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
