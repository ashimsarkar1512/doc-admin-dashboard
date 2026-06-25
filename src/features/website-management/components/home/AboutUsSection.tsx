import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { useHomepage } from '../../context/HomepageContext';

export function AboutUsSection() {
  const { form, setField, aboutMediaRef, isLoading } = useHomepage();
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    aboutMediaRef.current = file;
    if (file) {
      setField('aboutMediaUrl', URL.createObjectURL(file));
    }
  };

  return (
    <SectionCard title="About Us Section">
      <div className="space-y-5">
        <FormInput
          label="Section Title"
          value={form.aboutTitle}
          onChange={(e) => setField('aboutTitle', e.target.value)}
          placeholder="About Us"
        />

        <FormTextarea
          label="Description"
          className="h-20"
          value={form.aboutDescription}
          onChange={(e) => setField('aboutDescription', e.target.value)}
          placeholder="Describe the About section…"
        />

        {/* About Media */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">About Media</label>
          <div className="flex items-end gap-4">
            <div className="w-48 h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
              {form.aboutMediaUrl ? (
                <img src={form.aboutMediaUrl} className="w-full h-full object-cover" alt="About Media" />
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
              {form.aboutMediaUrl && (
                <button
                  type="button"
                  onClick={() => { aboutMediaRef.current = null; setField('aboutMediaUrl', ''); }}
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

        {/* Featured Services */}
        <div className="pt-3 border-t border-slate-100 space-y-4">
          <p className="text-sm font-semibold text-slate-600 mb-3">Featured Services</p>
          <FormInput
            label="Featured Service 1 ID"
            value={form.aboutFeaturedService1Id}
            onChange={(e) => setField('aboutFeaturedService1Id', e.target.value)}
            placeholder="Service ID"
          />
          <FormInput
            label="Featured Service 2 ID"
            value={form.aboutFeaturedService2Id}
            onChange={(e) => setField('aboutFeaturedService2Id', e.target.value)}
            placeholder="Service ID"
          />
          <FormInput
            label="Featured Service 3 ID"
            value={form.aboutFeaturedService3Id}
            onChange={(e) => setField('aboutFeaturedService3Id', e.target.value)}
            placeholder="Service ID"
          />
        </div>

        {/* CTA */}
        <div className="pt-3 border-t border-slate-100">
          <p className="text-sm font-semibold text-slate-600 mb-3">Button</p>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[160px]">
              <FormInput
                label="Button Text:"
                value={form.aboutButtonText}
                onChange={(e) => setField('aboutButtonText', e.target.value)}
                placeholder="Apply Now"
              />
            </div>
            <div className="flex-1 min-w-[160px]">
              <FormInput
                label="URL:"
                value={form.aboutButtonLink}
                onChange={(e) => setField('aboutButtonLink', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <label className="block text-sm font-medium text-slate-700">Button target:</label>
              <label className="flex items-center gap-2 pb-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#1447E6] border-slate-300"
                  checked={form.aboutButtonNewTab}
                  onChange={(e) => setField('aboutButtonNewTab', e.target.checked)}
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
