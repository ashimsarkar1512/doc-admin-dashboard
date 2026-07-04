import { Plus, Trash2 } from 'lucide-react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { SaveLocalSectionButton } from './AboutUsSaveButton';
import { MediaUpload } from '../shared/MediaUpload';
import type { FAQ } from '@/api/endpoints/about-us.api';

export interface AboutUsFaqSectionData {
  title: string;
  cardTitle: string;
  cardDescription: string;
  buttonText: string;
  buttonUrl: string;
  targetBlank: boolean;
  faqs: FAQ[];
  mediaUrl: string | null;
  mediaName: string | null;
  mediaFile?: File | null;
}

interface AboutUsFaqSectionProps {
  data: AboutUsFaqSectionData;
  onChange: (updates: Partial<AboutUsFaqSectionData>) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function AboutUsFaqSection({ data, onChange, onSave, isSaving }: AboutUsFaqSectionProps) {

  const addFaq = () => {
    onChange({ faqs: [...data.faqs, { question: '', answer: '' }] });
  };

  const removeFaq = (indexToRemove: number) => {
    onChange({ faqs: data.faqs.filter((_, i) => i !== indexToRemove) });
  };

  const updateFaq = (indexToUpdate: number, field: keyof FAQ, value: string) => {
    onChange({
      faqs: data.faqs.map((f, i) => (i === indexToUpdate ? { ...f, [field]: value } : f))
    });
  };

  return (
    <SectionCard title="FAQ Section">
      <div className="space-y-8">
        <div className="space-y-5">
          <FormInput
            label="Section Title:"
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Frequently Asked Questions"
          />

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-[#101828] mb-4">FAQ Card Details</h3>
            <div className="space-y-4">
              <FormInput
                label="Card Title:"
                value={data.cardTitle}
                onChange={(e) => onChange({ cardTitle: e.target.value })}
                placeholder="Need Help?"
              />
              <FormTextarea
                label="Card Description:"
                value={data.cardDescription}
                onChange={(e) => onChange({ cardDescription: e.target.value })}
                placeholder="Here are some of the most common questions..."
              />
              
              <div className="flex flex-col sm:flex-row flex-wrap sm:items-end gap-4">
                <div className="flex-1 min-w-[160px]">
                  <FormInput
                    label="Card Button Text:"
                    value={data.buttonText}
                    onChange={(e) => onChange({ buttonText: e.target.value })}
                    placeholder="Contact Us"
                  />
                </div>
                <div className="flex-1 min-w-[160px]">
                  <FormInput
                    label="URL:"
                    value={data.buttonUrl}
                    onChange={(e) => onChange({ buttonUrl: e.target.value })}
                    placeholder="/contact"
                  />
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <label className="block text-sm font-semibold text-[#272628]">Button target:</label>
                  <label className="flex items-center gap-2 pb-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded text-[#1447E6] focus:ring-[#1447E6] border-slate-300"
                      checked={data.targetBlank}
                      onChange={(e) => onChange({ targetBlank: e.target.checked })}
                    />
                    <span className="text-sm font-medium text-[#272628] whitespace-nowrap">
                      Blank (open in new tab)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#272628] mb-2">Card Image:</label>
                <MediaUpload
                  mediaUrl={data.mediaUrl}
                  mediaName={data.mediaName}
                  onUpload={(url, name, file) => onChange({ mediaUrl: url, mediaName: name, mediaFile: file })}
                  onRemove={() => onChange({ mediaUrl: null, mediaName: null, mediaFile: null })}
                  recommendedText="Recommended: JPG, PNG, WEBP, 400 x 400 pixels"
                  acceptVideo={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic FAQs List */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#101828]">FAQ Items</h3>
              <p className="text-xs text-slate-500 mt-0.5">Add the questions and answers to display on the page.</p>
            </div>
            <button
              type="button"
              onClick={addFaq}
              className="flex items-center gap-1.5 text-sm font-medium text-[#1447E6] hover:text-blue-700 transition-colors"
            >
              <Plus size={16} /> Add FAQ
            </button>
          </div>

          <div className="space-y-4">
            {data.faqs.map((faq, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex-1 space-y-4">
                  <FormInput
                    label="Question:"
                    value={faq.question}
                    onChange={(e) => updateFaq(index, 'question', e.target.value)}
                    placeholder="Enter the question..."
                  />
                  <FormTextarea
                    label="Answer:"
                    className="h-20"
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                    placeholder="Enter the answer..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  className="mt-8 text-slate-400 hover:text-red-500 transition-colors"
                  title="Remove FAQ"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            {data.faqs.length === 0 && (
              <div className="text-center py-8 text-sm text-slate-500 border border-dashed border-slate-300 rounded-lg">
                No FAQs added yet. Click "Add FAQ" to create one.
              </div>
            )}
          </div>
        </div>
      </div>
      <SaveLocalSectionButton onClick={onSave} isSaving={isSaving} />
    </SectionCard>
  );
}
