import { useRef } from 'react';
import { Upload, X, Plus, Trash2, FileText } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { FormInput } from './FormInput';
import { FormTextarea } from './FormTextarea';

export interface ServiceItemData {
  id: string;
  name: string;
  details: string;
}

export interface ServiceSectionData {
  id: string;
  tag: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaName: string;
  items: ServiceItemData[];
}

interface ServiceItemCardProps {
  cardTitle: string;
  data: ServiceSectionData;
  onChange: (data: ServiceSectionData) => void;
  onRemove?: () => void;
  itemNameLabel?: string;
  itemDetailsLabel?: string;
  addButtonLabel?: string;
}

export function ServiceItemCard({
  cardTitle,
  data,
  onChange,
  onRemove,
  itemNameLabel = 'Name',
  itemDetailsLabel = 'Details',
  addButtonLabel = 'Add Item',
}: ServiceItemCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof ServiceSectionData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField('mediaUrl', URL.createObjectURL(file));
      updateField('mediaName', file.name);
    }
  };

  const addItem = () => {
    const newItem: ServiceItemData = { id: Date.now().toString(), name: '', details: '' };
    updateField('items', [...data.items, newItem]);
  };

  const removeItem = (id: string) => {
    updateField('items', data.items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ServiceItemData, value: string) => {
    updateField(
      'items',
      data.items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <SectionCard title={cardTitle}>
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
        <FormInput
          label="Section Tag :"
          value={data.tag}
          onChange={(e) => updateField('tag', e.target.value)}
          placeholder="e.g. Lab Testing"
        />

        <FormInput
          label="Section Title :"
          value={data.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Enter title"
        />

        <FormTextarea
          label="Section Description :"
          className="h-24"
          value={data.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Enter description here..."
        />

        {/* Dynamic Items */}
        <div className="space-y-4 pt-2 pb-2 border-t border-b border-slate-100 mt-4 mb-4 rounded-lg p-4 bg-white border">
          {data.items.map((item, index) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1 w-full">
                <FormInput
                  label={`${itemNameLabel}:`}
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  placeholder={`e.g. Comprehensive Blood Panel`}
                />
              </div>
              <div className="flex-1 w-full">
                <FormInput
                  label={`${itemDetailsLabel} ${index + 1}:`}
                  value={item.details}
                  onChange={(e) => updateItem(item.id, 'details', e.target.value)}
                  placeholder={`e.g. Checks cholesterol...`}
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 self-end sm:self-auto"
                title={`Remove ${itemNameLabel}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 text-sm font-medium text-[#1447E6] hover:text-blue-800 transition-colors mt-2"
          >
            <Plus size={16} /> {addButtonLabel}
          </button>
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
          {data.mediaUrl && (
            <div className="flex items-center gap-2 mt-3 pl-1">
              <FileText size={14} className="text-[#1447E6]" />
              <span className="text-sm text-slate-600">{data.mediaName}</span>
              <button
                type="button"
                onClick={() => {
                  updateField('mediaUrl', '');
                  updateField('mediaName', '');
                }}
                className="text-red-500 hover:text-red-600 ml-1"
                title="Remove media"
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
    </SectionCard>
  );
}
