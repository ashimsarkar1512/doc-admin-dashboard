import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Dialog from "@/components/shared/Dialog";
import { axiosInstance } from "@/api/axiosInstance";
import type {
  Testimonial,
  CreateTestimonialPayload,
  UpdateTestimonialPayload,
} from "@/types";

// ── Avatar upload helper ──────────────────────────────────────────────────────

const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("context", "PROFILE_PICTURE");
  formData.append("files", file);
  const { data } = await axiosInstance.post("/attachments/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!data?.success) throw new Error(data?.message || "Avatar upload failed");
  const result = Array.isArray(data.data) ? data.data[0] : data.data;
  return result.id as string;
};

// ── Date helpers ──────────────────────────────────────────────────────────────

const toInputDate = (iso: string) => iso?.split("T")[0] ?? "";
const toISODate = (local: string) =>
  local ? new Date(local).toISOString() : "";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface TestimonialFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  /** null = create mode, Testimonial = edit mode */
  editingTestimonial: Testimonial | null;
  onSave: (
    payload: CreateTestimonialPayload | UpdateTestimonialPayload,
    id?: string,
  ) => void;
  isSaving: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TestimonialFormDialog({
  isOpen,
  onClose,
  editingTestimonial,
  onSave,
  isSaving,
}: TestimonialFormDialogProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Local form state
  const [clientName, setClientName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [date, setDate] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [existingAvatarId, setExistingAvatarId] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Populate form when opening in edit mode (or reset for create)
  useEffect(() => {
    if (!isOpen) return;

    if (editingTestimonial) {
      setClientName(editingTestimonial.clientName);
      setFeedback(editingTestimonial.feedback);
      setRating(editingTestimonial.rating);
      setDate(toInputDate(editingTestimonial.date));
      setIsPublished(editingTestimonial.isPublished);
      setAvatarPreview(editingTestimonial.avatar?.fileUrl ?? "");
      setExistingAvatarId(editingTestimonial.avatar?.id ?? "");
    } else {
      setClientName("");
      setFeedback("");
      setRating(5);
      setDate(toInputDate(new Date().toISOString()));
      setIsPublished(false);
      setAvatarPreview("");
      setExistingAvatarId("");
    }

    // Always clear file picker when dialog opens
    setAvatarFile(null);
  }, [isOpen, editingTestimonial]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim()) return toast.error("Client name is required.");
    if (!feedback.trim()) return toast.error("Feedback text is required.");
    if (!date) return toast.error("Date is required.");

    // Upload new avatar if selected
    let finalAvatarId: string | null | undefined =
      existingAvatarId || undefined;
    if (avatarFile) {
      setIsUploadingAvatar(true);
      try {
        finalAvatarId = await uploadAvatar(avatarFile);
      } catch (err: any) {
        toast.error(err.message || "Avatar upload failed.");
        setIsUploadingAvatar(false);
        return;
      }
      setIsUploadingAvatar(false);
    }

    const full: CreateTestimonialPayload = {
      clientName: clientName.trim(),
      feedback: feedback.trim(),
      rating,
      date: toISODate(date),
      isPublished,
      avatarId: finalAvatarId ?? null,
    };

    if (editingTestimonial) {
      // Only send changed fields to PATCH
      const patch: UpdateTestimonialPayload = {};
      if (full.clientName !== editingTestimonial.clientName)
        patch.clientName = full.clientName;
      if (full.feedback !== editingTestimonial.feedback)
        patch.feedback = full.feedback;
      if (full.rating !== editingTestimonial.rating) patch.rating = full.rating;
      if (full.date !== editingTestimonial.date) patch.date = full.date;
      if (full.isPublished !== editingTestimonial.isPublished)
        patch.isPublished = full.isPublished;
      if (finalAvatarId !== (editingTestimonial.avatar?.id ?? undefined))
        patch.avatarId = finalAvatarId ?? null;

      onSave(patch, editingTestimonial.id);
    } else {
      onSave(full);
    }
  };

  const busy = isSaving || isUploadingAvatar;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
      maxWidthClass="max-w-[500px]"
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Avatar Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-800">
            Client avatar:{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl text-gray-300">👤</span>
              )}
            </div>
            <div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <Upload className="w-4 h-4" />
                Choose a File
              </button>
              {avatarFile && (
                <p className="text-xs text-gray-500 mt-1 truncate max-w-[180px]">
                  {avatarFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Client Name */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-800">
            Client name:
          </label>
          <input
            id="testimonial-client-name"
            type="text"
            required
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400 transition-colors"
          />
        </div>

        {/* Feedback */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-800">
            Feedback:
          </label>
          <textarea
            id="testimonial-feedback"
            required
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write here..."
            className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400 resize-none transition-colors"
          />
        </div>

        {/* Rating & Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-800">
              Rating:
            </label>
            <div className="relative">
              <select
                id="testimonial-rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black appearance-none pr-10 cursor-pointer transition-colors"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r}.0
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-800">
              Date:
            </label>
            <input
              id="testimonial-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black transition-colors"
            />
          </div>
        </div>

        {/* Published toggle */}
        <div className="flex items-center gap-3 py-1">
          <button
            type="button"
            id="testimonial-publish-toggle"
            onClick={() => setIsPublished((v) => !v)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
              isPublished ? "bg-[#2563EB]" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                isPublished ? "translate-x-[18px]" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className="text-sm font-medium text-gray-800 select-none">
            {isPublished ? "Published on website" : "Hidden from website"}
          </span>
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="testimonial-submit"
            disabled={busy}
            className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-[10px] text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            {busy
              ? isUploadingAvatar
                ? "Uploading avatar..."
                : "Saving..."
              : editingTestimonial
                ? "Save Changes"
                : "Add Testimonial"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export default TestimonialFormDialog;
