import React, { useRef } from "react";
import { Upload, X } from "lucide-react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { useContactPageContext } from "../../context/ContactPageContext";

export function ContactWidgetSection() {
  const { form, setField, widgetImageRef } = useContactPageContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    widgetImageRef.current = file;
    const objectUrl = URL.createObjectURL(file);
    setField("widgetImageUrl", objectUrl);
    setField("widgetImageName", file.name);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearMedia = () => {
    widgetImageRef.current = null;
    setField("widgetImageUrl", "");
    setField("widgetImageId", "");
    setField("widgetImageName", "");
  };

  return (
    <SectionCard title="Side Widget">
      <div className="space-y-5">
        <FormInput
          label="Title:"
          value={form.widgetTitle}
          onChange={(e) => setField("widgetTitle", e.target.value)}
          placeholder="Office Hours"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Opening:"
            value={form.widgetOpening}
            onChange={(e) => setField("widgetOpening", e.target.value)}
            placeholder="Monday - Friday: 9 AM - 6 PM"
          />
          <FormInput
            label="Off Day:"
            value={form.widgetOffDay}
            onChange={(e) => setField("widgetOffDay", e.target.value)}
            placeholder="Our Office is closed..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormInput
            label="Phone number:"
            value={form.widgetPhone}
            onChange={(e) => setField("widgetPhone", e.target.value)}
            placeholder="(720) 279-1164"
          />
          <FormInput
            label="Email:"
            value={form.widgetEmail}
            onChange={(e) => setField("widgetEmail", e.target.value)}
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
                className="flex items-center gap-2 bg-[#1447E6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 w-max transition-colors"
              >
                <Upload size={16} />
                Upload
              </button>
              <span className="text-xs text-slate-400">
                Recommended: JPG, PNG, MP4, 1200 x 630 pixels
              </span>
            </div>

            {form.widgetImageUrl && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded border border-slate-100">
                  <span className="truncate max-w-[200px]" title={form.widgetImageName}>
                    {form.widgetImageName || "Uploaded Image"}
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
