
import { Plus, X } from 'lucide-react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { useHomepage } from '../../context/HomepageContext';

export function AboutUsSection() {
  const { form, setField, updateBullet, addBullet, removeBullet } = useHomepage();

  return (
    <SectionCard title="About Us Section">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Subtitle"
            value={form.aboutSubtitle}
            onChange={(e) => setField('aboutSubtitle', e.target.value)}
            placeholder="e.g. Why choose us"
          />
          <FormInput
            label="Section Title"
            value={form.aboutTitle}
            onChange={(e) => setField('aboutTitle', e.target.value)}
            placeholder="About Us"
          />
        </div>

        <FormTextarea
          label="Description"
          className="h-20"
          value={form.aboutDescription}
          onChange={(e) => setField('aboutDescription', e.target.value)}
          placeholder="Describe the About section…"
        />

        {/* About Bullets */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Feature Bullets</label>
          {form.aboutBullets.map((bullet, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                value={bullet}
                onChange={(e) => updateBullet(i, e.target.value)}
                placeholder={`Bullet point ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => removeBullet(i)}
                className="text-red-400 hover:text-red-600 transition-colors shrink-0"
                title="Remove bullet"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addBullet}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-500 hover:border-[#1447E6] hover:text-[#1447E6] transition-colors"
          >
            <Plus size={14} /> Add Bullet
          </button>
        </div>

        {/* Primary CTA */}
        <div className="pt-3 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-600 mb-3">Primary Button</p>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[160px]">
              <FormInput
                label="Button Text:"
                value={form.aboutPrimaryButtonText}
                onChange={(e) => setField('aboutPrimaryButtonText', e.target.value)}
                placeholder="Apply Now"
              />
            </div>
            <div className="flex-1 min-w-[160px]">
              <FormInput
                label="URL:"
                value={form.aboutPrimaryButtonLink}
                onChange={(e) => setField('aboutPrimaryButtonLink', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <label className="block text-sm font-medium text-slate-700">Button target:</label>
              <label className="flex items-center gap-2 pb-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#1447E6] border-slate-300"
                  checked={form.aboutPrimaryButtonNewTab}
                  onChange={(e) => setField('aboutPrimaryButtonNewTab', e.target.checked)}
                />
                <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Open in new tab</span>
              </label>
            </div>
          </div>
        </div>

        {/* Secondary CTA */}
        <div className="pt-3 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-600 mb-3">Secondary Button</p>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[160px]">
              <FormInput
                label="Button Text:"
                value={form.aboutSecondaryButtonText}
                onChange={(e) => setField('aboutSecondaryButtonText', e.target.value)}
                placeholder="Learn More"
              />
            </div>
            <div className="flex-1 min-w-[160px]">
              <FormInput
                label="URL:"
                value={form.aboutSecondaryButtonLink}
                onChange={(e) => setField('aboutSecondaryButtonLink', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <label className="block text-sm font-medium text-slate-700">Button target:</label>
              <label className="flex items-center gap-2 pb-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#1447E6] border-slate-300"
                  checked={form.aboutSecondaryButtonNewTab}
                  onChange={(e) => setField('aboutSecondaryButtonNewTab', e.target.checked)}
                />
                <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Open in new tab</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
