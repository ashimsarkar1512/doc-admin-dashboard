import React, { useRef, useState } from 'react';
import { Upload, X, FileVideo, FileImage } from 'lucide-react';
import { toast } from 'sonner';
import { uploadAttachment } from '@/api/endpoints/attachments.api';

export interface SecondData {
  sectionTitle: string;
  sectionDescription: string;
  ctaButtonText: string;
  url: string;
  buttonTarget: boolean;
  featuredMediaId: string;
  featuredMediaName?: string | null;
  featuredMediaType?: 'image' | 'video' | null;
}

interface Props {
  data: SecondData;
  onChange: (data: Partial<SecondData>) => void;
}

export default function ServicesSecondSection({ data, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const isVideo = file.type.startsWith('video/');
      const context = isVideo ? 'SECOND_SECTION_VIDEO' : 'SECOND_SECTION_IMAGE';
      
      const uploadedFile = await uploadAttachment(file, context);
      
      onChange({
        featuredMediaId: uploadedFile.id,
        featuredMediaName: uploadedFile.fileName,
        featuredMediaType: isVideo ? 'video' : 'image',
      });
      
      toast.success(`${isVideo ? 'Video' : 'Image'} uploaded successfully.`);
    } catch (error) {
      toast.error('Failed to upload file.');
      console.error(error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearMedia = () => {
    onChange({
      featuredMediaId: '',
      featuredMediaName: null,
      featuredMediaType: null,
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Second Section</h2>

      <div className="mb-5">
        <label className="block text-sm font-medium text-slate-700 mb-2">Section Title:</label>
        <input
          type="text"
          value={data.sectionTitle}
          onChange={(e) => onChange({ sectionTitle: e.target.value })}
          placeholder="Weight Loss Shots at WLMD"
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#1447E6] focus:ring-1 focus:ring-[#1447E6] transition-shadow"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-slate-700 mb-2">Section Description:</label>
        <textarea
          rows={5}
          value={data.sectionDescription}
          onChange={(e) => onChange({ sectionDescription: e.target.value })}
          placeholder="Enter description here..."
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#1447E6] focus:ring-1 focus:ring-[#1447E6] resize-none transition-shadow"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">CTA Button Text:</label>
          <input
            type="text"
            value={data.ctaButtonText}
            onChange={(e) => onChange({ ctaButtonText: e.target.value })}
            placeholder="Book Appointment"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#1447E6] focus:ring-1 focus:ring-[#1447E6] transition-shadow"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">URL:</label>
          <input
            type="text"
            value={data.url}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="https://weightlossmd.com/contact"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#1447E6] focus:ring-1 focus:ring-[#1447E6] transition-shadow"
          />
        </div>
        <div className="flex flex-col justify-end pb-3">
          <label className="block text-sm font-medium text-slate-700 mb-2 md:hidden">Button target:</label>
          <span className="hidden md:block text-sm font-medium text-slate-700 mb-2">Button target:</span>
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="blank-target-second" 
              checked={data.buttonTarget}
              onChange={(e) => onChange({ buttonTarget: e.target.checked })}
              className="w-4 h-4 text-[#1447E6] rounded border-slate-300 focus:ring-[#1447E6] focus:ring-offset-0 cursor-pointer" 
            />
            <label htmlFor="blank-target-second" className="text-sm text-slate-700 cursor-pointer select-none">Blank (open in new tab)</label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Featured Media:</label>
        <div className="flex items-center gap-4 mb-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          <button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="flex items-center gap-2 bg-[#1447E6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={16} />
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
          <span className="text-xs text-slate-500">Recommended: JPG, PNG, MP4, 1200 x 630 pixels</span>
        </div>
        
        {data.featuredMediaName && (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-max">
            {data.featuredMediaType === 'video' ? (
              <FileVideo size={16} className="text-[#1447E6]" />
            ) : (
              <FileImage size={16} className="text-[#1447E6]" />
            )}
            <span className="text-sm text-slate-700 font-medium">{data.featuredMediaName}</span>
            <button 
              onClick={clearMedia}
              className="text-red-500 hover:text-red-600 transition-colors ml-2" 
              title="Remove file"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
