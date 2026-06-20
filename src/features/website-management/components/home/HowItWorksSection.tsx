
import { Plus, X, GripVertical } from 'lucide-react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { useHomepage } from '../../context/HomepageContext';

export function HowItWorksSection() {
  const { form, setField, updateStep, addStep, removeStep } = useHomepage();

  return (
    <SectionCard title="How It Works Section">
      <div className="space-y-5">
        <FormInput
          label="Section Title"
          value={form.howItWorksTitle}
          onChange={(e) => setField('howItWorksTitle', e.target.value)}
          placeholder="Medical weight management"
        />

        <div className="space-y-4 pt-2 border-t border-slate-100">
          {form.howItWorksSteps.length === 0 && (
            <p className="text-sm text-slate-400 italic">No steps yet. Add one below.</p>
          )}
          {form.howItWorksSteps.map((step, i) => (
            <div key={step.id ?? `new-${i}`} className="border border-slate-100 rounded-lg p-4 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                  <GripVertical size={16} className="text-slate-300" />
                  Step {i + 1}
                </div>
                <button
                  type="button"
                  onClick={() => removeStep(i)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                  title="Remove step"
                >
                  <X size={16} />
                </button>
              </div>
              <FormInput
                label="Title"
                value={step.title}
                onChange={(e) => updateStep(i, { title: e.target.value })}
                placeholder="Step title…"
              />
              <FormTextarea
                label="Description"
                className="h-16"
                value={step.description}
                onChange={(e) => updateStep(i, { description: e.target.value })}
                placeholder="Step description…"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addStep}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Add Step
        </button>
      </div>
    </SectionCard>
  );
}
