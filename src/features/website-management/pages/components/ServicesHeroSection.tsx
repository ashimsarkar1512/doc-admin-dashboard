import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ServicesHeroSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video/');

    if (isVideo) {
      setMediaUrl(url);
      setMediaType('video');
      toast.success('Video uploaded successfully.');
    } else {
      setMediaUrl(url);
      setMediaType('image');
      toast.success('Image uploaded successfully.');
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearMedia = () => {
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    setMediaUrl(null);
    setMediaType(null);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Hero Section</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Banner Image:</label>
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="w-[300px] h-[160px] bg-slate-100 rounded-[16px] overflow-hidden relative border border-slate-200">
            {mediaUrl ? (
              <>
                {mediaType === 'video' ? (
                  <video src={mediaUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                ) : (
                  <div 
                    className="w-full h-full"
                    style={{
                      borderRadius: '16px',
                      background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.70) 100%), url(${mediaUrl}) lightgray 50% / cover no-repeat`
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
              <div className="w-full h-full bg-gradient-to-tr from-cyan-600 to-cyan-300 flex items-center justify-center relative">
                <div className="absolute transform -rotate-12 inset-0 m-auto w-3/4 h-3/4 opacity-30 bg-white rounded-full blur-xl"></div>
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
              className="flex items-center gap-2 bg-[#1447E6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 w-max transition-colors"
            >
              <Upload size={16} />
              Upload
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Page title:</label>
        <input
          type="text"
          defaultValue="Take control of your body with our weight loss service"
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#1447E6] focus:ring-1 focus:ring-[#1447E6] transition-shadow"
        />
      </div>
    </div>
  );
}
