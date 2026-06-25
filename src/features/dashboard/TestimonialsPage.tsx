import React, { useState, useCallback, useMemo, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Search, Plus, Download, ChevronDown, Star } from "lucide-react";
import type {
  Testimonial,
  CreateTestimonialPayload,
  UpdateTestimonialPayload,
} from "@/types";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/api/endpoints/testimonials.api";
import {
  TestimonialCard,
  TestimonialCardSkeleton,
} from "@/components/shared/cards/TestimonialCard";
import { TestimonialFormDialog } from "@/features/dashboard/components/TestimonialFormDialog";

// ── Constants ─────────────────────────────────────────────────────────────────

const RATING_FILTERS = [
  { label: "All Testimonials", minRating: undefined, maxRating: undefined },
  { label: "5 Stars", minRating: 5, maxRating: 5 },
  { label: "4+ Stars", minRating: 4, maxRating: undefined },
  { label: "3+ Stars", minRating: 3, maxRating: undefined },
  { label: "Below 3", minRating: undefined, maxRating: 2 },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TestimonialsPage() {
  const queryClient = useQueryClient();

  // Filter state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterIdx, setFilterIdx] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  // Per-card toggling tracker
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const activeFilter = RATING_FILTERS[filterIdx];

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      minRating: activeFilter.minRating,
      maxRating: activeFilter.maxRating,
      page: 1,
      limit: 20,
    }),
    [debouncedSearch, activeFilter],
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["testimonials", queryParams],
    queryFn: () => getTestimonials(queryParams),
    staleTime: 30_000,
  });

  const testimonials: Testimonial[] = data?.data ?? [];

  // ── Mutations ─────────────────────────────────────────────────────────────

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["testimonials"] });

  const createMutation = useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => {
      toast.success("Testimonial added!");
      setIsModalOpen(false);
      invalidate();
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to add testimonial."),
  });

  const updateMutation = useMutation({
    mutationFn: updateTestimonial,
    onSuccess: () => {
      toast.success("Testimonial updated!");
      setIsModalOpen(false);
      invalidate();
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to update testimonial."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      toast.success("Testimonial deleted.");
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message || "Failed to delete."),
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(
      () => setDebouncedSearch(e.target.value),
      400,
    );
  };

  const handleOpenCreate = () => {
    setEditing(null);
    setIsModalOpen(true);
  };
  const handleOpenEdit = useCallback((t: Testimonial) => {
    setEditing(t);
    setIsModalOpen(true);
  }, []);
  const handleDelete = useCallback(
    (id: string) => {
      if (!confirm("Delete this testimonial?")) return;
      deleteMutation.mutate(id);
    },
    [deleteMutation],
  );

  const handleTogglePublish = useCallback(async (t: Testimonial) => {
    setTogglingId(t.id);
    try {
      await updateTestimonial({
        id: t.id,
        payload: { isPublished: !t.isPublished },
      });
      toast.success(
        t.isPublished ? "Hidden from website." : "Published to website!",
      );
      invalidate();
    } catch {
      toast.error("Failed to update publish status.");
    } finally {
      setTogglingId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Called by TestimonialFormDialog — routing to create or update */
  const handleSave = useCallback(
    (
      payload: CreateTestimonialPayload | UpdateTestimonialPayload,
      id?: string,
    ) => {
      if (id) {
        updateMutation.mutate({
          id,
          payload: payload as UpdateTestimonialPayload,
        });
      } else {
        createMutation.mutate(payload as CreateTestimonialPayload);
      }
    },
    [createMutation, updateMutation],
  );

  const handleExport = () => {
    if (!testimonials.length) return toast.info("No data to export.");
    const headers = ["Client Name", "Feedback", "Rating", "Date", "Published"];
    const rows = testimonials.map((t) => [
      `"${t.clientName}"`,
      `"${t.feedback.replace(/"/g, '""')}"`,
      t.rating,
      new Date(t.date).toLocaleDateString("en-US"),
      t.isPublished ? "Yes" : "No",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), {
      href: url,
      download: `testimonials-${Date.now()}.csv`,
    }).click();
    URL.revokeObjectURL(url);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 w-full space-y-6 font-sans">
      {/* Header */}
     

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            id="testimonials-search"
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Rating Filter */}
        <div className="relative">
          <button
            id="testimonials-filter"
            type="button"
            onClick={() => setFilterOpen((o) => !o)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            {activeFilter.label}
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${filterOpen ? "rotate-180" : ""}`}
            />
          </button>
          {filterOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setFilterOpen(false)}
              />
              <div className="absolute left-0 top-full mt-1.5 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                {RATING_FILTERS.map((f, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setFilterIdx(i);
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      i === filterIdx
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex-1" />

        {/* Export */}
        <button
          id="testimonials-export"
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Data
        </button>

        {/* Add New */}
        <button
          id="testimonials-add"
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add new testimonial
        </button>
      </div>

      {/* Grid */}
      {isError ? (
        <p className="text-center py-20 text-red-500 text-sm">
          Failed to load testimonials. Please refresh.
        </p>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <TestimonialCardSkeleton key={i} />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Star className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-gray-800 font-semibold text-lg mb-1">
            No testimonials found
          </p>
          <p className="text-gray-500 text-sm mb-5">
            {debouncedSearch
              ? `No results for "${debouncedSearch}"`
              : "Start by adding your first testimonial."}
          </p>
          {!debouncedSearch && (
            <button
              onClick={handleOpenCreate}
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              + Add new testimonial
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {testimonials.map((t) => (
            <TestimonialCard
              key={t.id}
              testimonial={t}
              isToggling={togglingId === t.id}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onTogglePublish={handleTogglePublish}
            />
          ))}
        </div>
      )}

      {/* Pagination meta */}
      {data?.meta && testimonials.length > 0 && (
        <div className="flex justify-between text-xs text-gray-400 pt-2">
          <span>
            Showing {testimonials.length} of {data.meta.total} testimonials
          </span>
          <span>
            Page {data.meta.page} of {data.meta.totalPages}
          </span>
        </div>
      )}

      {/* Form Dialog */}
      <TestimonialFormDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingTestimonial={editing}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
