import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  getDiscounts,
  createDiscount,
  deleteDiscount,
  updateDiscount,
} from "@/api/endpoints/discountsApi";
import type { Discount, DiscountPayload } from "@/api/endpoints/discountsApi";
import UpdateDiscountModal from "./components/Discount/UpdateDiscountModal";
import ViewDiscountModal from "./components/Discount/ViewDiscountModal";
import CreateDiscountModal from "./components/Discount/CreateDiscountModal";
import DeleteDiscountModal from "./components/Discount/DeleteDiscountModal";
import { usePermissions } from '@/hooks/usePermissions';

export default function DiscountsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"" | "PERCENTAGE" | "FIXED_AMOUNT">("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewDiscount, setViewDiscount] = useState<Discount | null>(null);
  const [editDiscount, setEditDiscount] = useState<Discount | null>(null);
  const [deleteDiscountId, setDeleteDiscountId] = useState<string | null>(null);

  const { canManage } = usePermissions();
  const canManageDiscounts = canManage('discounts_and_marketing');

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["discounts", page, search, filterType],
    queryFn: () =>
      getDiscounts({
        page,
        limit: 10,
        search: search || undefined,
        type: filterType || undefined,
      }),
  });

  const createMutation = useMutation({
    mutationFn: createDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      setIsCreateModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<DiscountPayload> }) =>
      updateDiscount(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      setEditDiscount(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      setDeleteDiscountId(null);
    },
  });

  const handleDelete = (id: string) => {
    setDeleteDiscountId(id);
  };

  const formatValue = (type: string, value: number) =>
    type === "PERCENTAGE" ? `${value}%` : `$${value}`;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    });

  return (
    <div className="w-full p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Discounts & Marketing
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage promotional codes and marketing campaigns
          </p>
        </div>
        {canManageDiscounts && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Create Custom Discount
          </button>
        )}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by code"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value as any);
            setPage(1);
          }}
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">All Discounts</option>
          <option value="PERCENTAGE">Percentage</option>
          <option value="FIXED_AMOUNT">Fixed Amount</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {isError ? (
          <div className="p-8 text-center text-red-500">Failed to load discounts.</div>
        ) : isLoading ? (
          <div className="p-8 text-center text-slate-400">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-700">Discount Code</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Type</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Value</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Starting Date</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Expire Date</th>
                    <th className="px-6 py-4 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                        No discounts found.
                      </td>
                    </tr>
                  ) : (
                    data?.data.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-blue-600 font-medium">{item.code}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 capitalize">
                          {item.type === "PERCENTAGE" ? "percentage" : "fixed"}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {formatValue(item.type, item.value)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              item.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {formatDate(item.expiresAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            {/* View */}
                            <button
                              onClick={() => setViewDiscount(item)}
                              title="View"
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                            </button>
                            {/* Edit */}
                            {canManageDiscounts && (
                              <button
                                onClick={() => setEditDiscount(item)}
                                title="Edit"
                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                              </button>
                            )}
                            {/* Delete */}
                            {canManageDiscounts && (
                              <button
                                onClick={() => handleDelete(item.id)}
                                title="Delete"
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"/>
                                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                  <path d="M10 11v6M14 11v6"/>
                                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data?.meta && data.meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
                <span className="text-sm text-slate-500">
                  Showing {(data.meta.page - 1) * data.meta.limit + 1} to{" "}
                  {Math.min(data.meta.page * data.meta.limit, data.meta.total)} of{" "}
                  {data.meta.total} results
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-slate-700">
                    Page {page} of {data.meta.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
                    disabled={page === data.meta.totalPages}
                    className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <CreateDiscountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(payload) => createMutation.mutate(payload)}
        isLoading={createMutation.isPending}
      />

      <UpdateDiscountModal
        isOpen={!!editDiscount}
        discount={editDiscount}
        onClose={() => setEditDiscount(null)}
        onSubmit={(payload) => {
          if (editDiscount) updateMutation.mutate({ id: editDiscount.id, payload });
        }}
        isLoading={updateMutation.isPending}
      />

      <ViewDiscountModal
        isOpen={!!viewDiscount}
        discount={viewDiscount}
        onClose={() => setViewDiscount(null)}
        onEdit={(d) => {
          setViewDiscount(null);
          setEditDiscount(d);
        }}
        onDelete={(id) => {
          setViewDiscount(null);
          handleDelete(id);
        }}
      />

      <DeleteDiscountModal
        isOpen={!!deleteDiscountId}
        onClose={() => setDeleteDiscountId(null)}
        onConfirm={() => {
          if (deleteDiscountId) {
            deleteMutation.mutate(deleteDiscountId);
          }
        }}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}