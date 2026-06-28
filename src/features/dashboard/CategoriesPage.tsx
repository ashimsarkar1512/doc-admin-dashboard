/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useRef } from 'react';
import { Plus, Search, AlertCircle, ChevronDown, Upload, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import type { Category } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api/endpoints/categories.api';
import { axiosInstance } from '@/api/axiosInstance';
import { getErrorMessage } from '@/lib/errorHandler';
import CategoryCard from '@/components/shared/cards/CategoryCard';
import Dialog from '@/components/shared/Dialog';
import { usePermissions } from '@/hooks/usePermissions';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'DISABLED'>('ALL');
  const [page, setPage] = useState(1);
  const limit = 8;
  const { canManage } = usePermissions();
  const canManageCategories = canManage('service_categories_and_plans');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'DISABLED'>('ACTIVE');
  const [isPaymentPlanEnabled, setIsPaymentPlanEnabled] = useState(true);
  const [monthlyCharge, setMonthlyCharge] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [iconId, setIconId] = useState('');
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Query categories
  const { data: categoriesData, isLoading, isError } = useQuery({
    queryKey: ['categories', { search: searchQuery, page, limit }],
    queryFn: () => getCategories({ search: searchQuery, page, limit }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully.');
      setIsModalOpen(false);
      // Reset form
      setFormName('');
      setFormDescription('');
      setFormStatus('ACTIVE');
      setIsPaymentPlanEnabled(true);
      setMonthlyCharge('');
      setIconUrl('');
      setIconId('');
    },
    onError: (error: Error) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully.');
      setIsModalOpen(false);
    },
    onError: (error: Error) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully.');
    },
    onError: (error: Error) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    }
  });

  const allCategories = categoriesData?.data || [];
  const totalPages = categoriesData?.meta?.totalPages ?? 1;

  // Client-side filter by status dropdown
  const filteredCategories = allCategories.filter((cat) => {
    if (statusFilter === 'ALL') return true;
    const s = cat.status?.toUpperCase();
    return s === statusFilter;
  });

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormName('');
    setFormDescription('');
    setFormStatus('ACTIVE');
    setIsPaymentPlanEnabled(true);
    setMonthlyCharge('');
    setIconUrl('');
    setIconId('');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormDescription(category.description || '');

    if (category.icon) {
      setIconUrl(category.icon.fileUrl);
      setIconId(category.icon.id);
    } else {
      setIconUrl('');
      setIconId('');
    }

    if (category.paymentPlan) {
      setIsPaymentPlanEnabled(true);
      setMonthlyCharge(category.paymentPlan.price.toString());
    } else {
      setIsPaymentPlanEnabled(false);
      setMonthlyCharge('');
    }

    const s = category.status?.toUpperCase();
    const mappedStatus = s === 'DISABLED' ? 'DISABLED' : 'ACTIVE';
    setFormStatus(mappedStatus);
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDelete = (id: number | string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this category!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563EB',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-lg',
        cancelButton: 'rounded-lg'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  // Handle File Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingIcon(true);
    try {
      const formData = new FormData();
      formData.append('context', 'CATEGORY_ICON');
      formData.append('files', file);

      const response = await axiosInstance.post('/attachments/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.success) {
        toast.success('Icon uploaded successfully');
        setIconUrl(response.data.data.fileUrl);
        setIconId(response.data.data.id);
      } else {
        throw new Error(response.data?.message || 'Failed to upload icon');
      }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsUploadingIcon(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle Form Submit (Create/Edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      toast.error('Please enter a category name.');
      return;
    }

    if (!iconId && !editingCategory) {
      toast.error('Please upload an icon.');
      return;
    }

    if (isPaymentPlanEnabled && !monthlyCharge.trim()) {
      toast.error('Please enter a monthly charge for the payment plan.');
      return;
    }

    const payload: any = {
      name: formName,
      description: formDescription,
      status: formStatus,
    };

    if (isPaymentPlanEnabled) {
      payload.paymentPlan = {
        price: parseFloat(monthlyCharge) || 0,
        billingCycle: 'MONTHLY',
      };
    } else {
      payload.paymentPlan = null;
    }

    if (iconId) {
      payload.iconId = iconId;
    }

    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        payload
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="p-6 md:p-8 w-full font-sans bg-gray-50 flex flex-col gap-6" style={{ minHeight: 'calc(100vh - 64px)' }}>

      {/* ── Top Control Bar ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm text-gray-800 placeholder-gray-400 shadow-sm"
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'DISABLED')}
            className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-gray-200 bg-transparent text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Inactive</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>

        {/* Spacer */}
        <div className="flex-1 hidden sm:block" />

        {/* Add New Category Button */}
        {canManageCategories && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm shadow-blue-600/20 cursor-pointer whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>Add new category</span>
          </button>
        )}
      </div>

      {/* ── Categories Cards Grid ──────────────────────────────────── */}
      <div className="flex-1">
      {isLoading ? (
        <div className="flex justify-center items-center py-24 text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3" />
          <span className="text-sm font-medium">Loading categories...</span>
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center py-24 text-red-500 gap-2">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Failed to load categories. Please try again.</span>
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              canManage={canManageCategories}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-200 text-center px-6 space-y-4">
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900 text-base">No categories found</h3>
            <p className="text-gray-400 text-sm max-w-xs">
              {searchQuery
                ? `We couldn't find any categories matching "${searchQuery}".`
                : 'No categories are available yet.'}
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm underline underline-offset-4"
            >
              Clear filter
            </button>
          )}
        </div>
      )}
      </div>

      {/* ── Pagination ────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            Page <span className="font-medium text-gray-700">{page}</span> of{' '}
            <span className="font-medium text-gray-700">{totalPages}</span>
            {categoriesData?.meta?.total && (
              <> &mdash; <span className="font-medium text-gray-700">{categoriesData.meta.total}</span> total</>
            )}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              «
            </button>
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ‹ Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) {
                  acc.push('...');
                }
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-xs text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item as number)}
                    className={`w-8 h-8 rounded-lg border text-xs font-semibold transition-colors ${
                      page === item
                        ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-sm shadow-blue-600/20'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next ›
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* ── Dialog Modal: Create / Edit Category ─────────────────────── */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Service & Plan' : 'Add New Service & Plan'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <div className="space-y-2">
            {/* Icon */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-900">  Icon <span className="text-red-600">*</span></label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingIcon}
                  className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" />
                  {isUploadingIcon ? 'Uploading...' : 'Choose a File'}
                </button>
                {iconUrl && (
                  <img src={iconUrl} alt="Uploaded icon" className="w-16 h-16 rounded-md object-cover border border-gray-200 shadow-sm" />
                )}
              </div>
            </div>

            {/* Category Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-900">Category Name <span className="text-red-600">*</span></label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Weight loss"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm text-black placeholder-gray-400"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-900">Description: (optional)</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Write here..."
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm text-black resize-none placeholder-gray-400"
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-900">Service status:</label>
              <div className="relative">
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'ACTIVE' | 'DISABLED')}
                  className="w-full appearance-none px-3.5 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm text-black cursor-pointer"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="DISABLED">Disabled</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Payment Plan Card */}
            <div className="border border-gray-200 rounded-xl p-4 space-y-2 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="text-[#2563EB]">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Payment Plan</h4>
                    <p className="text-xs text-gray-500">Allow patients to pay monthly for this service</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPaymentPlanEnabled(!isPaymentPlanEnabled)}
                  className={`w-10 h-5 flex items-center rounded-full border-2 transition-colors shrink-0 ${
                    isPaymentPlanEnabled ? 'border-[#2563EB] bg-white' : 'border-gray-300 bg-gray-100'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full shadow-sm transform transition-transform ${
                    isPaymentPlanEnabled ? 'translate-x-[20px] bg-[#2563EB]' : 'translate-x-[2px] bg-gray-400'
                  }`} />
                </button>
              </div>
              
              <div className="space-y-1 pt-1">
                <label className="text-sm font-medium text-gray-900">Monthly charge <span className="text-red-600">*</span></label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-gray-400">$</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={monthlyCharge}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        setMonthlyCharge(value);
                      }
                    }}
                    className="w-full pl-7 pr-16 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-sm text-black"
                  />
                  <span className="absolute right-3.5 text-gray-500 text-sm">/ month</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Patients will be billed this amount every 30 days.</p>
              </div>
            </div>
          </div>

          {/* Submit Panel */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : editingCategory
                ? 'Save changes'
                : 'Add Service'}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}