import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { useHomepage } from '../../context/HomepageContext';

export function AssessmentSection() {
  const { form, setField } = useHomepage();

  return (
    <SectionCard title="Assessment / Banner Section">
      <div className="space-y-5">
        <FormInput
          label="Section Title:"
          value={form.assessmentTitle}
          onChange={(e) => setField('assessmentTitle', e.target.value)}
          placeholder="Start from a tailored assessment"
        />
        <FormTextarea
          label="Section Description:"
          className="h-20"
          value={form.assessmentDescription}
          onChange={(e) => setField('assessmentDescription', e.target.value)}
          placeholder="Comprehensive care for a wide range of everyday conditions…"
        />
      </div>
    </SectionCard>
  );
}
