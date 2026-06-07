import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import Dialog from '@/components/shared/Dialog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const INPUT_CLS =
  'w-full px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400';
const SELECT_CLS = `${INPUT_CLS} appearance-none cursor-pointer pr-10`;

function ChevronDown() {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

export default function AddDoctorModal({ isOpen, onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fullName, setFullName] = useState('');
  const [shortBio, setShortBio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('Active');
  const [isFeatured, setIsFeatured] = useState(false);
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setThumbnailPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, it's a static modal. Later we will integrate the API.
    // We can just close the modal and reset form
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFullName('');
    setShortBio('');
    setEmail('');
    setPassword('');
    setStatus('Active');
    setIsFeatured(false);
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Doctor"
      maxWidthClass="max-w-[720px]"
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Thumbnail */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            Thumbnail <span className="text-red-500">*</span>
          </label>
          <div className="flex items-start gap-5">
            <div className="w-[140px] h-[160px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center">
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-300 text-xs">No image</span>
              )}
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 bg-[#1447E6] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer w-fit"
              >
                <Upload className="h-4 w-4" />
                <span>Choose a File</span>
              </button>
              {thumbnailFile && (
                <button
                  type="button"
                  onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); }}
                  className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-medium"
                >
                  <X className="h-3 w-3" /> Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            Full Name: (required)
          </label>
          <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Dr. Runa Pradhan NP" className={INPUT_CLS} />
        </div>

        {/* Short Bio */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            Short Bio:
          </label>
          <input type="text" value={shortBio} onChange={(e) => setShortBio(e.target.value)} placeholder="Licensed Colorado-Nurse Practitioner - Family" className={INPUT_CLS} />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            Email: (required)
          </label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="runa.pradhannp@gmail.com" className={INPUT_CLS} />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">
            Password: (required)
          </label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" className={INPUT_CLS} />
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-800">Status:</label>
          <div className="relative">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={SELECT_CLS}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* Featured Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input 
            type="checkbox" 
            id="isFeatured" 
            checked={isFeatured} 
            onChange={(e) => setIsFeatured(e.target.checked)} 
            className="w-4 h-4 text-[#1447E6] bg-white border-gray-300 rounded focus:ring-[#1447E6]"
          />
          <label htmlFor="isFeatured" className="text-sm text-gray-800 font-medium cursor-pointer">
            Featured in website
          </label>
        </div>

        <div className="pt-4 border-t border-gray-100 flex gap-3 mt-4">
          <button type="button" onClick={handleClose} className="flex-1 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 py-2.5 bg-[#1447E6] hover:bg-blue-700 text-white rounded-[10px] text-sm font-medium transition-colors">
            Add Doctor
          </button>
        </div>
      </form>
    </Dialog>
  );
}
