import React, { useRef, useState } from "react";
import { Upload, Trash2 } from "lucide-react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";

interface Props {
  setIsDirty: (dirty: boolean) => void;
}

interface PartnerLogo {
  id: string;
  url: string;
  name: string;
}

export function ContactPartnersSection({ setIsDirty }: Props) {
  const [title, setTitle] = useState("Our partner pharmacies");
  const [logos, setLogos] = useState<PartnerLogo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsDirty(true);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      const objectUrl = URL.createObjectURL(file);
      setLogos((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          url: objectUrl,
          name: file.name,
        },
      ]);
      setIsUploading(false);
      setIsDirty(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 1000);
  };

  const removeLogo = (id: string) => {
    setLogos((prev) => prev.filter((logo) => logo.id !== id));
    setIsDirty(true);
  };

  return (
    <SectionCard title="Partners Section">
      <div className="space-y-6">
        <FormInput
          label="Section Title:"
          value={title}
          onChange={handleTitleChange}
          placeholder="Our partner pharmacies"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Partner Logo Image:
          </label>
          <div className="flex items-center gap-3 mb-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="flex items-center gap-2 bg-[#1447E6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 w-max transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={16} />
              {isUploading ? "Uploading..." : "Upload"}
            </button>
            <span className="text-xs text-slate-400">
              Recommended: JPG, PNG, MP4, 1200 x 630 pixels
            </span>
          </div>

          {/* List of uploaded logos */}
          {logos.length > 0 && (
            <div className="flex flex-col border-t border-slate-100">
              {logos.map((logo) => (
                <div
                  key={logo.id}
                  className="flex items-center gap-6 py-4 border-b border-slate-100"
                >
                  <div className="w-40 h-12 flex items-center justify-start overflow-hidden">
                    <img
                      src={logo.url}
                      alt={logo.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <button
                    onClick={() => removeLogo(logo.id)}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
