import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { useHomepage } from '../../context/HomepageContext';

export function HeroSection() {
  const { form, setField, heroImageRef, heroBadgeImageRef, isLoading } = useHomepage();

  const heroInputRef = useRef<HTMLInputElement>(null);
  const badgeInputRef = useRef<HTMLInputElement>(null);

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    heroImageRef.current = file;
    if (file) {
      // Show a local preview URL so the user sees the new image immediately
      setField('heroMediaUrl', URL.createObjectURL(file));
    }
  };

  const handleBadgeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    heroBadgeImageRef.current = file;
    if (file) {
      setField('heroBadgeImageUrl', URL.createObjectURL(file));
    }
  };

  return (
    <SectionCard title="Hero Section">
      <div className="space-y-5">
        {/* Hero Image */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Hero Media</label>
          <div className="flex items-end gap-4">
            <div className="w-48 h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
              {form.heroMediaUrl ? (
                <img src={form.heroMediaUrl} className="w-full h-full object-cover" alt="Hero" />
              ) : (
                <span className="text-xs text-slate-400">{isLoading ? 'Loading…' : 'No image'}</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[11px] text-slate-500 max-w-[150px]">
                Recommended size: 1920×1080px (16:9 ratio)
              </div>
              <button
                type="button"
                onClick={() => heroInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Upload size={16} /> Upload
              </button>
              {form.heroMediaUrl && (
                <button
                  type="button"
                  onClick={() => { heroImageRef.current = null; setField('heroMediaUrl', ''); }}
                  className="text-red-500 hover:text-red-600"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          <input
            ref={heroInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleHeroImageChange}
          />
        </div>

        {/* Badge Image */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Certificate / Badge Image:</label>
          <div className="flex items-end gap-4">
            <div className="w-48 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
              {form.heroBadgeImageUrl ? (
                <img src={form.heroBadgeImageUrl} className="w-full h-full object-contain p-2" alt="Badge" />
              ) : (
                <span className="text-xs text-slate-400">{isLoading ? 'Loading…' : 'No badge'}</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[11px] text-slate-500 max-w-[150px]">Upload transparent logos (png, svg)</div>
              <button
                type="button"
                onClick={() => badgeInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Upload size={16} /> Upload
              </button>
              {form.heroBadgeImageUrl && (
                <button
                  type="button"
                  onClick={() => { heroBadgeImageRef.current = null; setField('heroBadgeImageUrl', ''); }}
                  className="text-red-500 hover:text-red-600"
                  title="Remove badge"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          <input
            ref={badgeInputRef}
            type="file"
            accept="image/*,image/svg+xml"
            className="hidden"
            onChange={handleBadgeImageChange}
          />
        </div>



        <FormInput
          label="Hero Title:"
          value={form.heroTitle}
          onChange={(e) => setField('heroTitle', e.target.value)}
          placeholder="Medical Weight Management Program"
        />

        <FormTextarea
          label="Hero Description:"
          className="h-24"
          value={form.heroDescription}
          onChange={(e) => setField('heroDescription', e.target.value)}
          placeholder="Describe your hero section…"
        />

        {/* Hero CTA */}
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[160px]">
            <FormInput
              label="CTA Button Text:"
              value={form.heroButtonText}
              onChange={(e) => setField('heroButtonText', e.target.value)}
              placeholder="Apply Now"
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <FormInput
              label="URL:"
              value={form.heroButtonLink}
              onChange={(e) => setField('heroButtonLink', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            <label className="block text-sm font-medium text-slate-700">Button target:</label>
            <label className="flex items-center gap-2 pb-1.5 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-[#1447E6] focus:ring-[#1447E6] border-slate-300"
                checked={form.heroButtonNewTab}
                onChange={(e) => setField('heroButtonNewTab', e.target.checked)}
              />
              <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Blank (open in new tab)
              </span>
            </label>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
