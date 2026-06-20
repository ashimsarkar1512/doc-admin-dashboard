
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { useHomepage } from '../../context/HomepageContext';

export function ProvidersSection() {
  const { form, setField } = useHomepage();

  return (
    <SectionCard title="Providers Section">
      <div className="space-y-5">
        <FormInput
          label="Section Title:"
          value={form.productTitle}
          onChange={(e) => setField('productTitle', e.target.value)}
          placeholder="Meet our expert providers"
        />
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[160px]">
            <FormInput
              label="CTA URL:"
              value={form.productButtonLink}
              onChange={(e) => setField('productButtonLink', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            <label className="block text-sm font-medium text-slate-700">Button target:</label>
            <label className="flex items-center gap-2 pb-1.5 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-[#1447E6] border-slate-300"
                checked={form.productButtonNewTab}
                onChange={(e) => setField('productButtonNewTab', e.target.checked)}
              />
              <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Open in new tab</span>
            </label>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
