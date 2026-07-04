import React, { useRef, useState } from 'react';
import { Upload, X, Plus, Trash2 } from 'lucide-react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { SaveLocalSectionButton } from './AboutUsSaveButton';


export function AboutUsFaqSection() {
  const [title, setTitle] = useState('Frequently Asked Questions');
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  const [newTab, setNewTab] = useState(true);
  const [faqs, setFaqs] = useState([
    { id: 1, question: '', answer: '' },
    { id: 2, question: '', answer: '' },
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
    }
  };

  const addFaq = () => {
    setFaqs([...faqs, { id: Date.now(), question: '', answer: '' }]);
  };

  const removeFaq = (id: number) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  const updateFaq = (id: number, field: 'question' | 'answer', value: string) => {
    setFaqs(faqs.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  return (
    <SectionCard title="FAQ Section">
      <div className="space-y-5">
        <FormInput
          label="Section Title:"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Frequently Asked Questions"
        />

        <div className="pt-4 border-t border-slate-100">
          <FormInput
            label="Card Title:"
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            placeholder="e.g. Have more questions?"
          />
        </div>

        <FormTextarea
          label="Card Description:"
          className="h-20"
          value={cardDescription}
          onChange={(e) => setCardDescription(e.target.value)}
          placeholder="e.g. Can't find the answer you're looking for..."
        />

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
            <label className="block text-sm font-medium text-slate-700">Button target:</label>
            <label className="flex items-center gap-2 pb-1.5 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-[#1447E6] focus:ring-[#1447E6] border-slate-300"
                checked={newTab}
                onChange={(e) => setNewTab(e.target.checked)}
              />
              <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Blank Target (in new tab)
              </span>
            </label>
          </div>
        </div>

        <div className="pt-4 pb-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Card Image</label>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="w-48 h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
              {mediaUrl ? (
                <img src={mediaUrl} className="w-full h-full object-cover" alt="Media" />
              ) : (
                <span className="text-xs text-slate-400">No image</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Upload size={16} /> Upload
              </button>
              {mediaUrl && (
                <button
                  type="button"
                  onClick={() => setMediaUrl('')}
                  className="text-red-500 hover:text-red-600"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Dynamic FAQs */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="block text-sm font-medium text-slate-700">Questions & Answers:</label>
          {faqs.map((faq, index) => (
            <div key={faq.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
              <button
                type="button"
                onClick={() => removeFaq(faq.id)}
                className="absolute top-2 right-2 p-1.5  hover:bg-red-50 text-red-500 rounded-md transition-colors"
                title="Remove FAQ"
              >
                <Trash2 size={16} />
              </button>
              <div className="space-y-4 pr-6">
                <FormInput
                  label={`Question ${index + 1}:`}
                  value={faq.question}
                  onChange={(e) => updateFaq(faq.id, 'question', e.target.value)}
                  placeholder="e.g. What is WeightLossMD?"
                />
                <FormTextarea
                  label="Answer:"
                  className="h-20"
                  value={faq.answer}
                  onChange={(e) => updateFaq(faq.id, 'answer', e.target.value)}
                  placeholder="e.g. WeightLossMD is a specialized program..."
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addFaq}
            className="flex items-center gap-2 text-sm font-medium text-[#1447E6] hover:text-blue-800 transition-colors pt-2"
          >
            <Plus size={16} /> Add More FAQ
          </button>
        </div>
      </div>
      <SaveLocalSectionButton onClick={handleSave} isSaving={isSaving} />
    </SectionCard>
  );
}
