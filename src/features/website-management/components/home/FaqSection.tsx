import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { useHomepage } from '../../context/HomepageContext';
import { SaveSectionButton } from '../shared/SaveSectionButton';

export function FaqSection() {
  const { form, setField, faqCardMediaRef, isLoading } = useHomepage();
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    faqCardMediaRef.current = file;
    if (file) {
      setField('faqCardMediaUrl', URL.createObjectURL(file));
    }
  };

  return (
    <SectionCard title="FAQ Section">
      <div className="space-y-5">
        <FormInput
          label="Section Title"
          value={form.faqTitle}
          onChange={(e) => setField('faqTitle', e.target.value)}
          placeholder="Frequently Asked Questions"
        />

        {/* ── FAQ Card ─────────────────────────────────────── */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">FAQ Card</p>
          <FormInput
            label="Card Title"
            value={form.faqCardTitle}
            onChange={(e) => setField('faqCardTitle', e.target.value)}
            placeholder="Need more help?"
          />
          <FormTextarea
            label="Card Description"
            className="h-20"
            value={form.faqCardDescription}
            onChange={(e) => setField('faqCardDescription', e.target.value)}
            placeholder="Contact our support team…"
          />

          {/* FAQ Card Media */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Card Media</label>
            <div className="flex items-end gap-4">
              <div className="w-48 h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                {form.faqCardMediaUrl ? (
                  <img src={form.faqCardMediaUrl} className="w-full h-full object-cover" alt="FAQ Card Media" />
                ) : (
                  <span className="text-xs text-slate-400">{isLoading ? 'Loading…' : 'No image'}</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => mediaInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Upload size={16} /> Upload
                </button>
                {form.faqCardMediaUrl && (
                  <button
                    type="button"
                    onClick={() => { faqCardMediaRef.current = null; setField('faqCardMediaUrl', ''); }}
                    className="text-red-500 hover:text-red-600"
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            <input
              ref={mediaInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleMediaChange}
            />
          </div>

          {/* Card CTA */}
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[160px]">
              <FormInput
                label="Button Text:"
                value={form.faqButtonText}
                onChange={(e) => setField('faqButtonText', e.target.value)}
                placeholder="Contact Us"
              />
            </div>
            <div className="flex-1 min-w-[160px]">
              <FormInput
                label="Button URL:"
                value={form.faqButtonLink}
                onChange={(e) => setField('faqButtonLink', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* ── FAQ items ─────────────────────────────────────────────── */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">FAQ Items</p>
          
          {[1, 2, 3, 4, 5, 6].map((num) => {
            const qKey = `faqQuestion${num}` as keyof typeof form;
            const aKey = `faqAnswer${num}` as keyof typeof form;
            return (
              <div key={num} className="border border-slate-100 rounded-lg p-4 bg-slate-50 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600">Question {num}</div>
                <FormInput
                  label="Question"
                  value={form[qKey] as string}
                  onChange={(e) => setField(qKey, e.target.value)}
                  placeholder={`Question ${num}...`}
                />
                <FormTextarea
                  label="Answer"
                  className="h-16"
                  value={form[aKey] as string}
                  onChange={(e) => setField(aKey, e.target.value)}
                  placeholder={`Answer ${num}...`}
                />
              </div>
            );
          })}
        </div>
      </div>
      <SaveSectionButton section="FAQ" />
    </SectionCard>
  );
}
