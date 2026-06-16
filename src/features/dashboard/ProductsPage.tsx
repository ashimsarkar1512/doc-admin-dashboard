import React, { useState } from "react";
import { Plus, Search, AlertCircle, Upload } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product } from "@/types";
import ProductCard from "@/components/shared/cards/ProductCard";
import Dialog from "@/components/shared/Dialog";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/endpoints/products.api";
import type {
  CreateProductPayload,
  UpdateProductPayload,
} from "@/api/endpoints/products.api";
import { getCategories } from "@/api/endpoints/categories.api";

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string>("");
  const [formStock, setFormStock] = useState<number | "">("");

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({ limit: 100 }),
  });
  const categories = categoriesData?.data ?? [];

  // Fetch products
  const {
    data: productsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", { search: searchQuery }],
    queryFn: () => getProducts({ search: searchQuery || undefined, limit: 50 }),
  });
  const products = productsData?.data ?? [];

  // Mutations
  const saveMutation = useMutation({
    mutationFn: (data: CreateProductPayload | UpdateProductPayload) => {
      if (editingProduct) {
        return updateProduct(editingProduct.id, data as UpdateProductPayload);
      }
      return createProduct(data as CreateProductPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(
        editingProduct
          ? "Product updated successfully."
          : "Product created successfully.",
      );
      setIsModalOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save product.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete product.");
    },
  });

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategory(categories.length > 0 ? String(categories[0].id) : "");
    setFormPrice("");
    setFormDescription("");
    setFormImageFile(null);
    setFormImagePreview("");
    setFormStock("");
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.categoryId);
    setFormPrice(product.price);
    setFormDescription(product.description || "");
    setFormImageFile(null);
    setFormImagePreview(product.images?.[0] || "");
    setFormStock(product.stockQuantity);
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      toast.error("Please enter a product name.");
      return;
    }

    if (!editingProduct && !formImageFile) {
      toast.error("Please upload a product image.");
      return;
    }

    if (!formCategory) {
      toast.error("Please select a category.");
      return;
    }

    const payload = {
      name: formName,
      price: String(formPrice),
      stockQuantity: Number(formStock),
      description: formDescription,
      categoryId: formCategory,
      images: formImageFile ? [formImageFile] : undefined,
    };

    saveMutation.mutate(payload);
  };

  return (
    <div className="p-6 md:p-10 w-full space-y-10 font-sans">
      {/* Control Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
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
          <span>Add new product</span>
        </button>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 font-medium">Loading products...</span>
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center py-20 text-red-500">
          <AlertCircle className="h-6 w-6 mr-2" />
          <span className="font-medium">
            Failed to load products. Please try again.
          </span>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
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
            <h3 className="font-semibold text-gray-900 text-base">
              No products found
            </h3>
            <p className="text-gray-400 text-sm max-w-sm">
              We couldn't find any products matching search "{searchQuery}".
            </p>
          </div>
          <button
            onClick={() => setSearchQuery("")}
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm underline underline-offset-4"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Dialog Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        maxWidthClass="max-w-[700px]"
      >
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="space-y-3">
            {/* Product Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">
                Product image: {!editingProduct && "(required)"}
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-[120px] h-[120px] bg-[#2A2D31] rounded-[16px] flex items-center justify-center overflow-hidden shrink-0">
                  {formImagePreview ? (
                    <img
                      src={formImagePreview}
                      alt="Product preview"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-gray-400 text-xs">No image</div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="product-image-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormImageFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("product-image-upload")?.click()
                    }
                    className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer"
                  >
                    <Upload className="h-4.5 w-4.5" />
                    <span>Choose a File</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Product Name: (required)
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Blood Pressure Monitor"
                className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400"
              />
            </div>

            {/* Price & Stock side-by-side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-800">
                  Price ($): (required)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  step={0.01}
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-800">
                  Stock Quantity: (required)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formStock}
                  onChange={(e) =>
                    setFormStock(
                      e.target.value === "" ? "" : parseInt(e.target.value),
                    )
                  }
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Description:
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Write here..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400 resize-none"
              />
            </div>

            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-800">
                Category: (required)
              </label>
              <div className="relative">
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black cursor-pointer appearance-none pr-10"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Panel */}
          <div className="pt-4 border-t border-gray-100 flex gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-[10px] text-sm font-medium transition-colors"
            >
              {saveMutation.isPending
                ? "Saving..."
                : editingProduct
                  ? "Save Changes"
                  : "Add Product"}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
