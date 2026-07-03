import React, { useRef, useState } from 'react';
import { Upload, X, FileVideo, FileImage } from 'lucide-react';
import { toast } from 'sonner';

export default function ServicesSecondSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video/');

    if (isVideo) {
      setFileName(file.name);
      setMediaType('video');
      setMediaUrl(url);
      toast.success('Video uploaded successfully.');
    } else {
      setFileName(file.name);
      setMediaType('image');
      setMediaUrl(url);
      toast.success('Image uploaded successfully.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearMedia = () => {
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    setFileName(null);
    setMediaType(null);
    setMediaUrl(null);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Second Section</h2>

      <div className="mb-5">
        <label className="block text-sm font-medium text-slate-700 mb-2">Section Title:</label>
        <input
          type="text"
          defaultValue="Weight Loss Shots at WLMD"
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#1447E6] focus:ring-1 focus:ring-[#1447E6] transition-shadow"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-slate-700 mb-2">Section Description:</label>
        <textarea
          rows={5}
          defaultValue="We provide injectable treatments as part of our medically supervised weight management programs in Colorado. Options may include lipotropic injections and vitamin B-12, available to eligible patients after evaluation by a licensed provider. Treatment plans are tailored to individual medical histories and goals. If suitable, injectable therapies can be part of a comprehensive program that includes nutrition guidance and ongoing support. Hormone therapy may also be considered based on clinical evaluation. All treatments are supervised and comply with federal and state regulations. Results vary by individual, and no specific outcomes are guaranteed. This information is for educational purposes and does not constitute medical advice."
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#1447E6] focus:ring-1 focus:ring-[#1447E6] resize-none transition-shadow"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">CTA Button Text:</label>
          <input
            type="text"
            defaultValue="Book Appointment"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#1447E6] focus:ring-1 focus:ring-[#1447E6] transition-shadow"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">URL:</label>
          <input
            type="text"
            defaultValue="https://weightlossmd.com/contact"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-[#1447E6] focus:ring-1 focus:ring-[#1447E6] transition-shadow"
          />
        </div>
        <div className="flex flex-col justify-end pb-3">
          <label className="block text-sm font-medium text-slate-700 mb-2 md:hidden">Button target:</label>
          <span className="hidden md:block text-sm font-medium text-slate-700 mb-2">Button target:</span>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="blank-target-second" defaultChecked className="w-4 h-4 text-[#1447E6] rounded border-slate-300 focus:ring-[#1447E6] focus:ring-offset-0 cursor-pointer" />
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
            className="flex items-center gap-2 bg-[#1447E6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Upload size={16} />
            Upload
          </button>
          <span className="text-xs text-slate-500">Recommended: JPG, PNG, MP4, 1200 x 630 pixels</span>
        </div>
        
        {fileName && (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 w-max">
            {mediaType === 'video' ? (
              <FileVideo size={16} className="text-[#1447E6]" />
            ) : (
              <FileImage size={16} className="text-[#1447E6]" />
            )}
            <span className="text-sm text-slate-700 font-medium">{fileName}</span>
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
