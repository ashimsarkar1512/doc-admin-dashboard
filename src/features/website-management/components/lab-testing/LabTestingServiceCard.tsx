import { Trash2 } from 'lucide-react';
import { SectionCard } from '../shared/SectionCard';
import { FormInput } from '../shared/FormInput';
import { FormTextarea } from '../shared/FormTextarea';
import { MediaUpload } from '../shared/MediaUpload';

export interface LabTestItem {
  id: string;
  name: string;
  details: string;
  description: string;
}

export interface LabServiceData {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaName: string;
  mediaFile?: File | null;
  items: LabTestItem[];
}

interface Props {
  cardTitle: string;
  data: LabServiceData;
  onChange: (data: LabServiceData) => void;
  onRemove?: () => void;
}

export function LabTestingServiceCard({

  data,
  onChange,
  onRemove,
}: Props) {


  const updateField = (field: keyof LabServiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };



  const addItem = () => {
    const newItem: LabTestItem = { id: Date.now().toString(), name: '', details: '', description: '' };
    updateField('items', [...data.items, newItem]);
  };

  const removeItem = (id: string) => {
    updateField('items', data.items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof LabTestItem, value: string) => {
    updateField(
      'items',
      data.items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

 

  return (
    <SectionCard>
      {onRemove && (
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
          >
            <Trash2 size={16} /> Remove Section
          </button>
        </div>
      )}

      <div className="space-y-5">
        <MediaUpload

          mediaUrl={data.mediaUrl}
          mediaName={data.mediaName}
          onUpload={(url, name, file) => {
            onChange({ ...data, mediaUrl: url, mediaName: name, mediaFile: file });
          }}
          onRemove={() => {
            onChange({ ...data, mediaUrl: '', mediaName: '', mediaFile: null });
          }}
          recommendedText="Recommended: JPG, PNG, MP4, 1200 x 630 pixels"
        />

        <FormInput
          label="Section Title:"
          value={data.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="e.g. Health Packages"
        />

        <FormTextarea
          label="Section Description:"
          className="h-24"
          value={data.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Enter section description here..."
        />

        {/* Dynamic Items */}
        <div className="space-y-6 pt-4 mt-4">
          {data.items.map((item) => {

            return (
              <div key={item.id} className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="flex-1 w-full">
                    <FormInput
                      label={`Test Name :`}
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      placeholder="e.g. Full Body Panel"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <FormInput
                      label={`Test Duration:`}
                      value={item.details}
                      onChange={(e) => updateItem(item.id, 'details', e.target.value)}
                      placeholder="Test 2 year"
                    />
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <FormTextarea
                      label={`Test Description:`}
                      className="h-20"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Description"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="mb-1 text-red-500 hover:text-red-600 p-2"
                    title="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })}
          
          <div>
            <button
              type="button"
              onClick={addItem}
              className="text-[#1447E6] text-sm font-medium hover:underline"
            >
              + Add Field
            </button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
