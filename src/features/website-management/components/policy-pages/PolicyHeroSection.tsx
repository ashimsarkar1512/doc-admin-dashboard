import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { SectionSaveButton } from '../shared/SectionSaveButton';

export interface PolicyHeroData {
  title: string;
  description: string;
}

interface Props {
  data: PolicyHeroData;
  onChange: (data: Partial<PolicyHeroData>) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function PolicyHeroSection({ data, onChange, onSave, isSaving }: Props) {
  return (
    <SectionCard title="Hero Section">
      <div className="space-y-5">
        <FormInput
          label="Hero title:"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Enter title..."
        />
        <FormTextarea
          label="Hero Description:"
          className="h-24"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Write..."
        />
      </div>
      <SectionSaveButton onSave={onSave} isSaving={isSaving} />
    </SectionCard>
  );
}
