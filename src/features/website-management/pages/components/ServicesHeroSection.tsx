import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { uploadAttachment, deleteAttachment } from '@/api/endpoints/attachments.api';

interface HeroData {
  pageTitle: string;
  bannerImageId: string;
  mediaUrl: string | null;
  mediaType: 'image' | 'video' | null;
}

interface Props {
  data: HeroData;
  onChange: (data: Partial<HeroData>) => void;
}

export default function ServicesHeroSection({ data, onChange }: Props) {
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
      const context = 'HERO_IMAGE'; // Context identifier for backend
      
      const uploadedFile = await uploadAttachment(file, context);
      
      onChange({
        bannerImageId: uploadedFile.id,
        mediaUrl: uploadedFile.fileUrl,
        mediaType: isVideo ? 'video' : 'image',
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

  const clearMedia = async () => {
    if (data.bannerImageId) {
      try {
        await deleteAttachment(data.bannerImageId);
      } catch (error) {
        console.error('Failed to delete media:', error);
        toast.error('Failed to delete media from server.');
      }
    }

    onChange({
      bannerImageId: '',
      mediaUrl: null,
      mediaType: null,
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Hero Section</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Banner Image:</label>
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="w-[300px] h-[160px] bg-slate-100 rounded-[16px] overflow-hidden relative border border-slate-200">
            {data.mediaUrl ? (
              <>
                {data.mediaType === 'video' ? (
                  <video src={data.mediaUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                ) : (
                  <div 
                    className="w-full h-full"
                    style={{
                      borderRadius: '16px',
                      background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.70) 100%), url(${data.mediaUrl}) lightgray 50% / cover no-repeat`
                    }}
                  />
                )}
                <button 
                  onClick={clearMedia}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-slate-100 transition-colors"
                >
                  <X size={14} className="text-slate-700" />
                </button>
              </>
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center relative">
                <span className="text-slate-500 font-semibold text-xl">No Image</span>
              </div>
            )}
            
            {isUploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <span className="text-sm font-medium text-slate-700">Uploading...</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-slate-500">Recommended: JPG, PNG, MP4, 1200 x 630 pixels</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
            <button 
              onClick={handleUploadClick}
              disabled={isUploading}
              className="flex items-center gap-2 bg-[#1447E6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 w-max transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={16} />
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Page title:</label>
        <input
          type="text"
          value={data.pageTitle}
          onChange={(e) => onChange({ pageTitle: e.target.value })}
          placeholder="Take control of your body with our weight loss service"
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#1447E6] focus:ring-1 focus:ring-[#1447E6] transition-shadow"
        />
      </div>
    </div>
  );
}
