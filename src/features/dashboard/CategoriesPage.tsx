/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { Plus, Search, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Category } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api/endpoints/categories.api';
import CategoryCard from '@/components/shared/cards/CategoryCard';
import Dialog from '@/components/shared/Dialog';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [page] = useState(1);
  const limit = 10;

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'ACTIVE' | 'DISABLED'>('ACTIVE');

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
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create category.');
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
      toast.error(error.message || 'Failed to update category.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete category.');
    }
  });

  const filteredCategories = categoriesData?.data || [];

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormName('');
    setFormDescription('');
    setFormStatus('ACTIVE');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormDescription(category.description || '');
    // Map existing status gracefully, including DISABLED
    const s = category.status?.toUpperCase();
    const mappedStatus = s === 'DISABLED' ? 'DISABLED' : 'ACTIVE';
    setFormStatus(mappedStatus);
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDelete = (id: number | string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  // Handle Form Submit (Create/Edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      toast.error('Please enter a category name.');
      return;
    }

    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        payload: {
          name: formName,
          description: formDescription,
          status: formStatus,
        }
      });
    } else {
      createMutation.mutate({
        name: formName,
        description: formDescription,
        status: formStatus,
      });
    }
  };

  return (
    <div className="p-6 md:p-10 w-full space-y-8 font-sans">
      {/* Top Header Control Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm shadow-blue-600/10 cursor-pointer self-start md:self-auto"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Add new category</span>
        </button>
      </div>

      {/* Categories Cards Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-gray-500">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
           <span className="ml-3 font-medium">Loading categories...</span>
        </div>
      ) : isError ? (
         <div className="flex justify-center items-center py-20 text-red-500">
           <AlertCircle className="h-6 w-6 mr-2" />
           <span className="font-medium">Failed to load categories. Please try again.</span>
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-150 text-center p-6 space-y-4">
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900 text-base">No categories found</h3>
            <p className="text-gray-400 text-sm max-w-sm">
              We couldn't find any categories matching search "{searchQuery}".
            </p>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm underline underline-offset-4"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Reusable Dialog Modal for Category Create/Edit */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div className="space-y-5">
            {/* Category Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-normal text-gray-800">Category Name: (required)</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Weight loss"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-normal text-gray-800">Description: (optional)</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Write here..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black resize-none placeholder-gray-400"
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-sm font-normal text-gray-800">Category status:</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as 'ACTIVE' | 'DISABLED')}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black cursor-pointer"
              >
                <option value="ACTIVE">Active</option>
                <option value="DISABLED">Disabled</option>
              </select>
            </div>
          </div>

          {/* Submit Panel */}
          <div className="pt-6 border-t border-gray-100 flex gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1 py-3 bg-[#1D4ED8] hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-sm font-medium transition-colors shadow-xs cursor-pointer"
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingCategory ? 'Save changes' : 'Add category'}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
