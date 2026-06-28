import React, { useState } from "react";
import { Plus, Search, AlertCircle, Upload, Trash2, ChevronDown } from "lucide-react";
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
import { axiosInstance } from "@/api/axiosInstance";
import { usePermissions } from '@/hooks/usePermissions';

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const { canManage } = usePermissions();
  const canManageProducts = canManage('products');
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'DISABLED'>('ALL');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formSize, setFormSize] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageFile, setFormImageFile] = useState<File | null>(null);
  const [formImagePreview, setFormImagePreview] = useState<string>("");
  const [formImageId, setFormImageId] = useState<string>("");
  const [formStock, setFormStock] = useState<number | "">("");
  const [variants, setVariants] = useState<
    { size: string; price: string; stockQuantity: number | "" }[]
  >([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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

  // Client-side filter by status
  const filteredProducts = products.filter((product) => {
    if (statusFilter === 'ALL') return true;
    // Assuming products have a status field similar to categories, or we can check stock
    // For now, let's filter based on status if it exists, otherwise return all
    const s = (product as any).status?.toUpperCase();
    return s === statusFilter;
  });

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

  const handleAddVariant = () => {
    setVariants([...variants, { size: "ml", price: "", stockQuantity: "" }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategory(categories.length > 0 ? String(categories[0].id) : "");
    setFormPrice("");
    setFormSize("");
    setFormDescription("");
    setFormImageFile(null);
    setFormImagePreview("");
    setFormImageId("");
    setFormStock("");
    setVariants([]);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.categoryId);
    setFormPrice(String(product.price));
    setFormSize("");
    setFormDescription(product.description || "");
    setFormImageFile(null);
    setFormImagePreview(product.images?.[0]?.fileUrl || "");
    setFormImageId(product.images?.[0]?.id || "");
    setFormStock(product.stockQuantity);

    if (product.variants && product.variants.length > 0) {
      setVariants(
        product.variants.map((v) => ({
          size: v.size,
          price: String(v.price),
          stockQuantity: v.stockQuantity,
        })),
      );
    } else {
      setVariants([]);
    }

    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      toast.error("Please enter a product name.");
      return;
    }

    if (!editingProduct && !formImageId && !formImageFile) {
      toast.error("Please upload a product image.");
      return;
    }

    if (!formCategory) {
      toast.error("Please select a category.");
      return;
    }

    for (let i = 0; i < variants.length; i++) {
      if (!variants[i].price || variants[i].stockQuantity === "") {
        toast.error("Please fill all variant fields completely.");
        return;
      }
    }

    let finalImageId = formImageId;
    if (formImageFile) {
      setIsUploadingImage(true);
      try {
        const formData = new FormData();
        formData.append("context", "PRODUCT_IMAGE");
        formData.append("files", formImageFile);

        const response = await axiosInstance.post(
          "/attachments/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        if (response.data?.success) {
          finalImageId = response.data.data.id;
          setFormImageId(finalImageId);
        } else {
          throw new Error(response.data?.message || "Failed to upload image");
        }
      } catch (error: any) {
        toast.error(error.message || "Image upload failed");
        setIsUploadingImage(false);
        return;
      }
      setIsUploadingImage(false);
    }

    const payload: CreateProductPayload | UpdateProductPayload = {
      name: formName,
      price: Number(formPrice),
      stockQuantity: Number(formStock),
      description: formDescription,
      categoryId: formCategory,
      images: finalImageId ? [finalImageId] : undefined,
      variants: variants.map((v) => ({
        size: v.size,
        price: Number(v.price),
        stockQuantity: Number(v.stockQuantity),
      })),
    };

    saveMutation.mutate(payload);
  };

  return (
    <div className="p-6 md:p-6 w-full space-y-10 font-sans">
      {/* Control Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 ">
        <div className="flex flex-1 items-center gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-black placeholder-gray-400"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'DISABLED')}
              className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer shadow-sm"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="DISABLED">Disabled</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>

        {canManageProducts && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm shadow-blue-600/10 cursor-pointer self-start md:self-auto"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add new product</span>
          </button>
        )}
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
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              canManage={canManageProducts}
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
              We couldn't find any products matching your filters.
            </p>
          </div>
          {(searchQuery || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm underline underline-offset-4"
            >
              Clear all filters
            </button>
          )}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-600 font-medium">
                  Size Variable:
                </label>
                <div className="flex bg-white rounded-[10px] border border-gray-200 overflow-hidden">
                  <input
                    type="number"
                    min={0}
                    placeholder="e.g., 10"
                    value={formSize?.split(" ")[0] || ""}
                    onChange={(e) =>
                      setFormSize(
                        `${e.target.value} ${formSize?.split(" ")[1] || "ml"}`,
                      )
                    }
                    className="w-full px-3 py-2 text-sm focus:outline-none text-black"
                  />
                  <select
                    value={formSize?.split(" ")[1] || "ml"}
                    onChange={(e) =>
                      setFormSize(
                        `${formSize?.split(" ")[0] || ""} ${e.target.value}`,
                      )
                    }
                    className="bg-gray-50 border-l border-gray-200 px-2 py-2 text-sm text-gray-700 outline-none cursor-pointer"
                  >
                    <option value="ml">ml</option>
                    <option value="mg">mg</option>
                    <option value="g">g</option>
                    <option value="oz">oz</option>
                  </select>
                </div>
              </div>
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

            {/* Variants Section */}
            <div className="space-y-3 pt-2">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 items-end   rounded-xl "
                >
                  <div className="col-span-4 space-y-1.5">
                    <label className="text-xs text-gray-600 font-medium">
                      Size Variable:
                    </label>
                    <div className="flex bg-white rounded-[10px] border border-gray-200 overflow-hidden">
                      <input
                        type="number"
                        min={0}
                        placeholder="e.g., 10"
                        value={variant.size.split(" ")[0] || ""}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "size",
                            `${e.target.value} ${variant.size.split(" ")[1] || "ml"}`,
                          )
                        }
                        className="w-full px-3 py-2 text-sm focus:outline-none text-black"
                      />
                      <select
                        value={variant.size.split(" ")[1] || "ml"}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "size",
                            `${variant.size.split(" ")[0] || ""} ${e.target.value}`,
                          )
                        }
                        className="bg-gray-50 border-l border-gray-200 px-2 py-2 text-sm text-gray-700 outline-none cursor-pointer"
                      >
                        <option value="ml">ml</option>
                        <option value="mg">mg</option>
                        <option value="g">g</option>
                        <option value="oz">oz</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-span-3 space-y-1.5">
                    <label className="text-xs text-gray-600 font-medium">
                      Price ($): (required)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={0.01}
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(index, "price", e.target.value)
                      }
                      placeholder="0.00"
                      className="w-full px-3 py-2 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:border-blue-500 text-sm text-black"
                    />
                  </div>

                  <div className="col-span-4 space-y-1.5">
                    <label className="text-xs text-gray-600 font-medium">
                      Stock Quantity: (required)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={variant.stockQuantity}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "stockQuantity",
                          e.target.value === "" ? "" : parseInt(e.target.value),
                        )
                      }
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-[10px] border border-gray-200 bg-white focus:outline-none focus:border-blue-500 text-sm text-black"
                    />
                  </div>

                  <div className="col-span-1 flex justify-center pb-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Variable"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddVariant}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1.5"
              >
                + Add Variable
              </button>
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
              disabled={saveMutation.isPending || isUploadingImage}
              className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-[10px] text-sm font-medium transition-colors"
            >
              {saveMutation.isPending || isUploadingImage
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
