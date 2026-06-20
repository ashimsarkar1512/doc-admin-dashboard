import React, { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Dialog from '@/components/shared/Dialog';
import { uploadAttachment } from '@/api/endpoints/attachments.api';
import { createDoctor } from '@/api/endpoints/dashboard/doctorManagement';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const INPUT_CLS =
  'w-full px-3.5 py-1.5 rounded-[8px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1447E6]/10 focus:border-[#1447E6] text-sm text-gray-800 placeholder-gray-400 font-normal transition-all';
const SELECT_CLS = `${INPUT_CLS} appearance-none cursor-pointer pr-10`;

function ChevronDown() {
  return (
    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

const EMPTY = {
  fullName: '',
  shortBio: '',
  email: '',
  password: '',
  roleTitle: '',
  officeLocation: '',
  status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  isFeatured: false,
};

export default function AddDoctorModal({ isOpen, onClose, onSuccess }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState(EMPTY);

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedAvatarId, setUploadedAvatarId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setThumbnailPreview(reader.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    setUploadedAvatarId(null);
    try {
      const attachment = await uploadAttachment(file, 'DOCTOR_AVATAR');
      setUploadedAvatarId(attachment.id);
      toast.success('Image uploaded successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Image upload failed';
      toast.error(message);
      setThumbnailPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedAvatarId) {
      toast.error('Please upload a doctor image first.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createDoctor({
        avatarId: uploadedAvatarId,
        featured: form.isFeatured,
        fullName: form.fullName,
        shortBio: form.shortBio,
        email: form.email,
        password: form.password,
        status: form.status,
        roleTitle: form.roleTitle,
        officeLocation: form.officeLocation,
      });
      toast.success('Doctor created successfully');
      onSuccess?.();
      handleClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create doctor';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm(EMPTY);
    setThumbnailPreview(null);
    setUploadedAvatarId(null);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Add New Doctor" maxWidthClass="max-w-[680px]">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2 overflow-hidden px-0.5">

        {/* Thumbnail */}
        <div className="space-y-1">
          <label className="text-[13px] font-medium text-gray-700">
            Thumbnail <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-5">
            <div className="w-[160px] h-[170px] bg-[#e2ecf8] rounded-[16px] overflow-hidden shrink-0 flex items-center justify-center border border-gray-100 shadow-sm relative">
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-xs">No image</span>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center gap-1.5">
                  <Loader2 size={22} className="animate-spin text-[#1447E6]" />
                  <span className="text-xs text-[#1447E6] font-medium">Uploading…</span>
                </div>
              )}
              {uploadedAvatarId && !isUploading && (
                <div className="absolute bottom-2 right-2 bg-emerald-500 text-white rounded-full p-0.5">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 bg-[#1447E6] hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-[8px] font-medium text-xs transition-all cursor-pointer shadow-sm"
              >
                {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                <span>{isUploading ? 'Uploading…' : 'Choose a File'}</span>
              </button>
              <p className="text-[11px] text-gray-400">JPG, PNG, WEBP — max 5MB</p>
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-0.5">
          <label className="text-[13px] font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
          <input type="text" required value={form.fullName} onChange={set('fullName')} placeholder="e.g. Dr. John Smith" className={INPUT_CLS} />
        </div>

        {/* Short Bio */}
        <div className="space-y-0.5">
          <label className="text-[13px] font-medium text-gray-700">Short Bio</label>
          <input type="text" value={form.shortBio} onChange={set('shortBio')} placeholder="e.g. Board-certified Family Nurse Practitioner" className={INPUT_CLS} />
        </div>

        {/* Role Title */}
        <div className="space-y-0.5">
          <label className="text-[13px] font-medium text-gray-700">Role Title <span className="text-red-500">*</span></label>
          <input type="text" required value={form.roleTitle} onChange={set('roleTitle')} placeholder="e.g. FNP-BC, MD, DO" className={INPUT_CLS} />
        </div>

        {/* Office Location */}
        <div className="space-y-0.5">
          <label className="text-[13px] font-medium text-gray-700">Office Location <span className="text-red-500">*</span></label>
          <input type="text" required value={form.officeLocation} onChange={set('officeLocation')} placeholder="e.g. New York, NY" className={INPUT_CLS} />
        </div>

        {/* Email */}
        <div className="space-y-0.5">
          <label className="text-[13px] font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
          <input type="email" required value={form.email} onChange={set('email')} placeholder="e.g. doctor@clinic.com" className={INPUT_CLS} />
        </div>

        {/* Password */}
        <div className="space-y-0.5">
          <label className="text-[13px] font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
          <input type="password" required value={form.password} onChange={set('password')} placeholder="Min. 8 characters" className={INPUT_CLS} />
        </div>

        {/* Status */}
        <div className="space-y-0.5">
          <label className="text-[13px] font-medium text-gray-700">Status</label>
          <div className="relative">
            <select value={form.status} onChange={set('status')} className={SELECT_CLS}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* Featured */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isFeatured"
            checked={form.isFeatured}
            onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
            className="w-4 h-4 bg-white border border-gray-300 rounded text-[#1447E6] focus:ring-[#1447E6]/20 cursor-pointer accent-[#1447E6]"
          />
          <label htmlFor="isFeatured" className="text-[13px] text-gray-600 font-normal cursor-pointer select-none">
            Featured in website
          </label>
        </div>

        {/* Actions */}
        <div className="pt-3 flex gap-3 mt-1 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting || isUploading}
            className="flex-1 py-2 bg-white border border-gray-200 rounded-[8px] text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="flex-1 py-2 bg-[#1447E6] hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-[8px] text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {isSubmitting ? 'Saving…' : 'Add Doctor'}
          </button>
        </div>
      </form>
    </Dialog>
  );
}