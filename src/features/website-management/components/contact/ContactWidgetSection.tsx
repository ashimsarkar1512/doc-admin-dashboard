import React, { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";

interface Props {
  setIsDirty: (dirty: boolean) => void;
}

export function ContactWidgetSection({ setIsDirty }: Props) {
  const [title, setTitle] = useState("Office Hours");
  const [opening, setOpening] = useState("Monday - Friday: 9 AM - 6 PM");
  const [offDay, setOffDay] = useState(
    "Our Office is closed from 2 PM to 3 PM for lunch during the week.",
  );
  const [phone, setPhone] = useState("(720) 279-1164");
  const [email, setEmail] = useState("Info@wlmd.net");

  // Local state for image preview
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaName, setMediaName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
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
      setMediaUrl(objectUrl);
      setMediaName(file.name);
      setIsUploading(false);
      setIsDirty(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 1000);
  };

  const clearMedia = () => {
    setMediaUrl(null);
    setMediaName(null);
    setIsDirty(true);
  };

  return (
    <SectionCard title="Side Widget:">
      <div className="space-y-5">
        <FormInput
          label="Title:"
          value={title}
          onChange={handleChange(setTitle)}
          placeholder="Office Hours"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Opening:"
            value={opening}
            onChange={handleChange(setOpening)}
            placeholder="Monday - Friday: 9 AM - 6 PM"
          />
          <FormInput
            label="Off Day:"
            value={offDay}
            onChange={handleChange(setOffDay)}
            placeholder="Our Office is closed..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Phone number:"
            value={phone}
            onChange={handleChange(setPhone)}
            placeholder="(720) 279-1164"
          />
          <FormInput
            label="Email:"
            value={email}
            onChange={handleChange(setEmail)}
            placeholder="Info@wlmd.net"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Widget Image:
          </label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/mp4"
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

            {mediaUrl && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded border border-slate-100">
                  <span className="truncate max-w-[200px]">
                    {mediaName || "Section image.webp"}
                  </span>
                  <button
                    onClick={clearMedia}
                    className="text-red-500 hover:text-red-700 transition-colors p-0.5 rounded-md hover:bg-red-50"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
