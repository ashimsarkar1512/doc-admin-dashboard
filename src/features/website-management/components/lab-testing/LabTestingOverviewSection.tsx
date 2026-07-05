import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { SectionSaveButton } from '../shared/SectionSaveButton';

export interface LabOverviewData {
  sectionTitle: string;
  sectionDescription: string;
}

interface Props {
  data: LabOverviewData;
  onChange: (data: Partial<LabOverviewData>) => void;
  onSave?: () => void;
  isSaving?: boolean;
}

export function LabTestingOverviewSection({ data, onChange, onSave, isSaving }: Props) {
  return (
    <SectionCard title="Lab Tests Section">
      <div className="space-y-5">
        <FormInput
          label="Section Title:"
          value={data.sectionTitle}
          onChange={(e) => onChange({ sectionTitle: e.target.value })}
          placeholder="Lab Test Overview"
        />
        <FormTextarea
          label="Section Description:"
          className="h-24"
          value={data.sectionDescription}
          onChange={(e) => onChange({ sectionDescription: e.target.value })}
          placeholder="Detailed description of the lab test process..."
        />
      </div>
      {onSave && <SectionSaveButton onSave={onSave} isSaving={isSaving} />}
    </SectionCard>
  );
}
