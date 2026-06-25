import React from "react";
import { Pencil, Trash2, Globe, EyeOff, Star, Loader2 } from "lucide-react";
import type { Testimonial } from "@/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

export const formatTestimonialDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

// ── Star Rating ───────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < full ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ── Google Fallback Icon ──────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-9 h-9" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface TestimonialCardProps {
  testimonial: Testimonial;
  isToggling: boolean;
  onEdit: (t: Testimonial) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (t: Testimonial) => void;
}

// ── Card ──────────────────────────────────────────────────────────────────────

export const  TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  isToggling,
  onEdit,
  onDelete,
  onTogglePublish,
}) => {
  const { isPublished, avatar, clientName, feedback, rating, date } = testimonial;
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [avatar?.fileUrl]);


  return (
    <div className="bg-white rounded-2xl  transition-shadow duration-200 flex flex-col">

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">

        {/* Avatar */}
        <div className="w-10 h-10 shrink-0">
          {avatar?.fileUrl && !imgError ? (
            <img
              src={avatar.fileUrl}
              alt={clientName}
              className="w-10 h-10 rounded-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <GoogleIcon />
          )}
        </div>

        {/* Client */}
        <div>
          <p className="text-sm font-bold text-gray-900 leading-none">Client:</p>
          <p className="text-sm text-gray-700 mt-0.5">{clientName}</p>
        </div>

        {/* Feedback */}
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900 leading-none">Feedback:</p>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed line-clamp-4">
            {feedback}
          </p>
        </div>

        {/* Rating & Date box */}
        <div className="border border-gray-100 rounded-xl px-3 py-2.5 space-y-1.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-12 shrink-0">Rating:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-800">{rating.toFixed(1)}</span>
              <StarRating rating={rating} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 w-12 shrink-0">Date:</span>
            <span className="text-gray-800">{formatTestimonialDate(date)}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 pb-5 flex items-center gap-2">
        {/* Publish / Hide — fills remaining space */}
        <button
          type="button"
          onClick={() => onTogglePublish(testimonial)}
          disabled={isToggling}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 ${
            isPublished
              ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
              : "bg-[#2563EB] hover:bg-blue-700 text-white"
          }`}
        >
          {isToggling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isPublished ? (
            <><EyeOff className="w-4 h-4" /> Hide from website</>
          ) : (
            <><Globe className="w-4 h-4" /> Publish to website</>
          )}
        </button>

        {/* Edit */}
        <button
          onClick={() => onEdit(testimonial)}
          className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors"
          title="Edit"
        >
          <Pencil className="w-4 h-4" />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(testimonial.id)}
          className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

export function TestimonialCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-150 p-5 flex flex-col gap-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-200" />
      <div className="space-y-1">
        <div className="h-3 bg-gray-200 rounded w-10" />
        <div className="h-3.5 bg-gray-200 rounded w-28" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 bg-gray-200 rounded w-14" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-4/6" />
      </div>
      <div className="border border-gray-100 rounded-xl px-3 py-2.5 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-32" />
        <div className="h-3 bg-gray-100 rounded w-24" />
      </div>
      <div className="h-10 bg-gray-100 rounded-xl" />
    </div>
  );
}

export default TestimonialCard;
