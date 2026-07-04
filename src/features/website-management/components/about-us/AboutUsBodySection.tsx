import React, { useRef, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { SaveLocalSectionButton } from './AboutUsSaveButton';

interface AboutUsBodySectionProps {
  cardTitle: string;
  defaultTitle: string;
  showTag?: boolean;
  showCta?: boolean;
}

export function AboutUsBodySection({ cardTitle, defaultTitle, showTag = false, showCta = false }: AboutUsBodySectionProps) {
  const [tag, setTag] = useState('');
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaName, setMediaName] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  const [newTab, setNewTab] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaUrl(URL.createObjectURL(file));
      setMediaName(file.name);
    }
  };

  return (
    <SectionCard title={cardTitle}>
      <div className="space-y-5">
        {showTag && (
          <FormInput
            label="Section Tag:"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="e.g. Our Mission"
          />
        )}

        <FormInput
          label="Section Title:"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={defaultTitle}
        />

        <FormTextarea
          label="Section Description:"
          className="h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description here..."
        />

        {showCta && (
          <div className="flex flex-col sm:flex-row flex-wrap sm:items-end gap-4">
            <div className="flex-1 min-w-[160px]">
              <FormInput
                label="CTA Button Text:"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Contact Us"
              />
            </div>
            <div className="flex-1 min-w-[160px]">
              <FormInput
                label="URL:"
                value={buttonLink}
                onChange={(e) => setButtonLink(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <label className="block text-sm font-semibold text-[#272628]">Button target:</label>
              <label className="flex items-center gap-2 pb-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-[#1447E6] focus:ring-[#1447E6] border-slate-300"
                  checked={newTab}
                  onChange={(e) => setNewTab(e.target.checked)}
                />
                <span className="text-sm font-medium text-[#272628] whitespace-nowrap">
                  Blank (open in new tab)
                </span>
              </label>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-[#272628] mb-2">Featured Media:</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Upload size={16} /> Upload
            </button>
            <div className="text-[11px] text-slate-500">
              Recommended: JPG, PNG, WEBP, MP4, 1200 x 630 pixels
            </div>
          </div>
          {mediaUrl && (
            <div className="flex items-center gap-2 mt-3 pl-1">
              <FileText size={14} className="text-[#1447E6]" />
              <span className="text-sm text-slate-600">{mediaName}</span>
              <button
                type="button"
                onClick={() => {
                  setMediaUrl('');
                  setMediaName('');
                }}
                className="text-red-500 hover:text-red-600 ml-1"
                title="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/mp4"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>
      <SaveLocalSectionButton onClick={handleSave} isSaving={isSaving} />
    </SectionCard>
  );
}
