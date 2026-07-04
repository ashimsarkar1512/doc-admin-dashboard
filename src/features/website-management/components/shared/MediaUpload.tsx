import { useRef, useState } from "react";
import { Upload, X, AlertCircle } from "lucide-react";

export interface MediaUploadProps {
  label?: string;
  mediaUrl: string | null;
  mediaName: string | null;
  onUpload: (url: string, name: string, file?: File) => void;
  onRemove: () => void;
  recommendedText?: string;
  className?: string;
  maxSizeMB?: number;
  maxVideoSizeMB?: number;
  acceptVideo?: boolean;
}

export function MediaUpload({
  label,
  mediaUrl,
  mediaName,
  onUpload,
  onRemove,
  recommendedText,
  className = "",
  maxSizeMB = 1,
  maxVideoSizeMB = 10,
  acceptVideo = true,
}: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const isVideo = mediaName?.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) || 
                  mediaUrl?.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    
    if (file) {
      const isVideoFile = file.type.startsWith('video/');
      
      if (!acceptVideo && isVideoFile) {
        setError('Only images are allowed here.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      
      const limitMB = isVideoFile ? maxVideoSizeMB : maxSizeMB;
      
      if (file.size > limitMB * 1024 * 1024) {
        setError(`${isVideoFile ? 'Video' : 'Image'} must be smaller than ${limitMB}MB.`);
        // Clear the input so they can try again with the same file if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      
      const url = URL.createObjectURL(file);
      onUpload(url, file.name, file);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="w-48 h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
          {mediaUrl ? (
            isVideo ? (
              <video
                src={mediaUrl}
                className="w-full h-full object-cover"
                controls
                muted
              />
            ) : (
              <img
                src={mediaUrl}
                className="w-full h-full object-cover"
                alt={mediaName || "media preview"}
              />
            )
          ) : (
            <span className="text-xs text-slate-400">No media</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            {recommendedText && (
              <div className="text-[11px] text-slate-500 max-w-[150px]">
                {recommendedText}
              </div>
            )}
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
                onClick={() => {
                  setError(null);
                  onRemove();
                }}
                className="text-red-500 hover:text-red-600"
                title="Remove media"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {error && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-red-500">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptVideo ? "image/*,video/*" : "image/*"}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
