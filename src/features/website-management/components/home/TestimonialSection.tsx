import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { useHomepage } from '../../context/HomepageContext';

export function TestimonialSection() {
  const { form, setField } = useHomepage();

  return (
    <SectionCard title="Testimonial Section">
      <div className="space-y-5">
        <FormInput
          label="Section Title"
          value={form.testimonialTitle}
          onChange={(e) => setField('testimonialTitle', e.target.value)}
          placeholder="Don't just take our word for it"
        />
        <FormInput
          label="Card Title"
          value={form.testimonialCardTitle}
          onChange={(e) => setField('testimonialCardTitle', e.target.value)}
          placeholder="Real stories"
        />
        <FormTextarea
          label="Card Description"
          className="h-20"
          value={form.testimonialCardDescription}
          onChange={(e) => setField('testimonialCardDescription', e.target.value)}
          placeholder="I have achieved my goals…"
        />

        {/* CTA */}
        <div className="pt-3 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-600 mb-3">Button</p>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[160px]">
              <FormInput
                label="Button Text:"
                value={form.testimonialButtonText}
                onChange={(e) => setField('testimonialButtonText', e.target.value)}
                placeholder="Read More"
              />
            </div>
            <div className="flex-1 min-w-[160px]">
              <FormInput
                label="CTA URL:"
                value={form.testimonialButtonLink}
                onChange={(e) => setField('testimonialButtonLink', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <label className="block text-sm font-medium text-slate-700">Button target:</label>
              <label className="flex items-center gap-2 pb-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#1447E6] border-slate-300"
                  checked={form.testimonialButtonNewTab}
                  onChange={(e) => setField('testimonialButtonNewTab', e.target.checked)}
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
