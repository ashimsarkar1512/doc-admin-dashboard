import { SectionCard } from '../shared/SectionCard';
import { RichTextEditor } from '../shared/RichTextEditor';
import { SectionSaveButton } from '../shared/SectionSaveButton';

export interface PolicyContentData {
  content: string;
}

interface Props {
  title: string;
  data: PolicyContentData;
  onChange: (data: Partial<PolicyContentData>) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function PolicyContentSection({ title, data, onChange, onSave, isSaving }: Props) {
  return (
    <SectionCard title={title}>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-[#272628]">Write Content:</label>
        <RichTextEditor
          value={data.content}
          onChange={(val) => onChange({ content: val })}
        />
      </div>
      <SectionSaveButton onSave={onSave} isSaving={isSaving} />
    </SectionCard>
  );
}
