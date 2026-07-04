import React, { useRef, useState } from 'react';
import { Upload, X, Plus, Trash2, FileText } from 'lucide-react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { SaveLocalSectionButton } from './AboutUsSaveButton';

export function AboutUsFeaturesSection() {
  const [tag, setTag] = useState('Why WLMD');
  const [title, setTitle] = useState('Why Patients Choose Weight Loss MD?');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaName, setMediaName] = useState('');
  const [buttonText, setButtonText] = useState('Book a consultation');
  const [buttonLink, setButtonLink] = useState('https://weightlossmd.com/Contact us');
  const [newTab, setNewTab] = useState(true);
  const [points, setPoints] = useState([
    { id: 1, text: 'Personalized treatment plans tailored to individual goals' },
    { id: 2, text: 'Licensed healthcare providers and medically supervised programs' },
    { id: 3, text: 'In-person and telehealth appointment options' },
    { id: 4, text: 'Ongoing monitoring and support throughout the journey' }
  ]);
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

  const addPoint = () => {
    setPoints([...points, { id: Date.now(), text: '' }]);
  };

  const removePoint = (id: number) => {
    setPoints(points.filter((p) => p.id !== id));
  };

  const updatePoint = (id: number, text: string) => {
    setPoints(points.map((p) => (p.id === id ? { ...p, text } : p)));
  };

  return (
    <SectionCard title="Body Section 3:">
      <div className="space-y-5">
        <FormInput
          label="Section Tag:"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="e.g. Why WLMD"
        />

        <FormInput
          label="Section Title:"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Why Patients Choose Weight Loss MD?"
        />

        <FormTextarea
          label="Section Description:"
          className="h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Our mission is to help you..."
        />

        {/* Dynamic Points */}
        <div className="space-y-4 pt-2 pb-2 border-t border-b border-slate-100 mt-4 mb-4 rounded-lg p-4 bg-white border">
          {points.map((point, index) => (
            <div key={point.id} className="flex items-center gap-3">
              <div className="flex-1">
                <FormInput
                  label={`Point ${index + 1}:`}
                  value={point.text}
                  onChange={(e) => updatePoint(point.id, e.target.value)}
                  placeholder="e.g. Personalized approach to..."
                />
              </div>
              <button
                type="button"
                onClick={() => removePoint(point.id)}
                className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove point"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPoint}
            className="flex items-center gap-2 text-sm font-medium text-[#1447E6] hover:text-blue-800 transition-colors mt-2"
          >
            <Plus size={16} /> Add More
          </button>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap sm:items-end gap-4">
          <div className="flex-1 min-w-[160px]">
            <FormInput
              label="CTA Button Text:"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="Book a consultation"
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
