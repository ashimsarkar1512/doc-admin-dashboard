import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { useHomepage } from '../../context/HomepageContext';
import { SaveSectionButton } from '../shared/SaveSectionButton';

export function HowItWorksSection() {
  const { form, setField } = useHomepage();

  return (
    <SectionCard title="How It Works Section">
      <div className="space-y-5">
        <FormInput
          label="Section Title"
          value={form.howItWorksTitle}
          onChange={(e) => setField('howItWorksTitle', e.target.value)}
          placeholder="How It Works"
        />

        <div className="space-y-4 pt-2 border-t border-slate-100">
          {/* Step 1 */}
          <div className="border border-slate-100 rounded-lg p-4 bg-slate-50 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">Step 1</div>
            <FormInput
              label="Title"
              value={form.howItWorksStep1Title}
              onChange={(e) => setField('howItWorksStep1Title', e.target.value)}
              placeholder="Step 1 title…"
            />
            <FormTextarea
              label="Description"
              className="h-16"
              value={form.howItWorksStep1Description}
              onChange={(e) => setField('howItWorksStep1Description', e.target.value)}
              placeholder="Step 1 description…"
            />
          </div>

          {/* Step 2 */}
          <div className="border border-slate-100 rounded-lg p-4 bg-slate-50 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">Step 2</div>
            <FormInput
              label="Title"
              value={form.howItWorksStep2Title}
              onChange={(e) => setField('howItWorksStep2Title', e.target.value)}
              placeholder="Step 2 title…"
            />
            <FormTextarea
              label="Description"
              className="h-16"
              value={form.howItWorksStep2Description}
              onChange={(e) => setField('howItWorksStep2Description', e.target.value)}
              placeholder="Step 2 description…"
            />
          </div>

          {/* Step 3 */}
          <div className="border border-slate-100 rounded-lg p-4 bg-slate-50 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">Step 3</div>
            <FormInput
              label="Title"
              value={form.howItWorksStep3Title}
              onChange={(e) => setField('howItWorksStep3Title', e.target.value)}
              placeholder="Step 3 title…"
            />
            <FormTextarea
              label="Description"
              className="h-16"
              value={form.howItWorksStep3Description}
              onChange={(e) => setField('howItWorksStep3Description', e.target.value)}
              placeholder="Step 3 description…"
            />
          </div>

          {/* Step 4 */}
          <div className="border border-slate-100 rounded-lg p-4 bg-slate-50 space-y-4">
            <div className="text-sm font-bold text-slate-600">Step 4</div>
            <FormInput
              label="Title"
              value={form.howItWorksStep4Title}
              onChange={(e) => setField('howItWorksStep4Title', e.target.value)}
              placeholder="Step 4 title…"
            />
            <FormTextarea
              label="Description"
              className="h-16"
              value={form.howItWorksStep4Description}
              onChange={(e) => setField('howItWorksStep4Description', e.target.value)}
              placeholder="Step 4 description…"
            />
          </div>
        </div>
      </div>
      <SaveSectionButton section="HOW_IT_WORKS" />
    </SectionCard>
  );
}
