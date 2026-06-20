
import { Plus, X } from 'lucide-react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { useHomepage } from '../../context/HomepageContext';

export function FaqSection() {
  const { form, setField, updateFaq, addFaq, removeFaq } = useHomepage();

  return (
    <SectionCard title="FAQ Section">
      <div className="space-y-5">
        <FormInput
          label="Section Title"
          value={form.pricingTitle}
          onChange={(e) => setField('pricingTitle', e.target.value)}
          placeholder="Frequently Asked Questions"
        />
        <FormInput
          label="Sub Title"
          value={form.pricingSubtitle}
          onChange={(e) => setField('pricingSubtitle', e.target.value)}
          placeholder="Still have questions?"
        />
        <FormInput
          label="CTA Description"
          value={form.pricingDescription}
          onChange={(e) => setField('pricingDescription', e.target.value)}
          placeholder="If you have any questions, feel free to reach out."
        />

        {/* CTA */}
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[160px]">
            <FormInput
              label="CTA URL:"
              value={form.pricingButtonLink}
              onChange={(e) => setField('pricingButtonLink', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            <label className="block text-sm font-medium text-slate-700">Button target:</label>
            <label className="flex items-center gap-2 pb-1.5 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-[#1447E6] border-slate-300"
                checked={form.pricingButtonNewTab}
                onChange={(e) => setField('pricingButtonNewTab', e.target.checked)}
              />
              <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Open in new tab</span>
            </label>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          {form.faqs.length === 0 && (
            <p className="text-sm text-slate-400 italic">No FAQ items yet. Add one below.</p>
          )}
          {form.faqs.map((faq, i) => (
            <div key={faq.id ?? `new-${i}`} className="border border-slate-100 rounded-lg p-4 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-slate-600">Question {i + 1}</div>
                <button
                  type="button"
                  onClick={() => removeFaq(i)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                  title="Remove FAQ"
                >
                  <X size={16} />
                </button>
              </div>
              <FormInput
                label="Question"
                value={faq.question}
                onChange={(e) => updateFaq(i, { question: e.target.value })}
                placeholder="What is medical weight loss?"
              />
              <FormTextarea
                label="Answer"
                className="h-16"
                value={faq.answer}
                onChange={(e) => updateFaq(i, { answer: e.target.value })}
                placeholder="Your answer here…"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addFaq}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Add Question
        </button>
      </div>
    </SectionCard>
  );
}
