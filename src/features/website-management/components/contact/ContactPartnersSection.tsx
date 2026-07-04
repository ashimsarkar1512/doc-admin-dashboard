import React, { useRef } from "react";
import { Upload, Trash2 } from "lucide-react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { useContactPageContext } from "../../context/ContactPageContext";

export function ContactPartnersSection() {
  const { form, setField, addPartners, removePartner } = useContactPageContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    addPartners(files);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <SectionCard title="Partners Section">
      <div className="space-y-6">
        <FormInput
          label="Section Title:"
          value={form.partnersSectionTitle}
          onChange={(e) => setField("partnersSectionTitle", e.target.value)}
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
              multiple
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

          {/* List of uploaded logos */}
          {form.partners.length > 0 && (
            <div className="flex flex-col border-t border-slate-100">
              {form.partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex items-center gap-6 py-4 border-b border-slate-100"
                >
                  <div className="w-40 h-12 flex items-center justify-start overflow-hidden">
                    <img
                      src={partner.imageUrl}
                      alt="Partner Logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <button
                    onClick={() => removePartner(partner.id)}
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
