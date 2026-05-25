import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Product } from '@/types';

export interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  return (
    <div className="group bg-white rounded-2xl border border-gray-150 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden h-full">
      <div>
        {/* Dark Charcoal Image Header */}
        <div className="relative h-[200px] w-full bg-[#2A2D31] flex items-center justify-center overflow-hidden rounded-t-2xl">
          {product.images && product.images.length > 0 && (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>

        {/* Card Details Body */}
        <div className="p-5 space-y-3 flex flex-col">
          {/* Category Badge */}
          <div className="flex">
            <span className="bg-[#f4f4f5] text-gray-600 px-3 py-1 rounded-full text-[11px] font-medium border border-gray-100/50">
              {product.category?.name || 'Uncategorized'}
            </span>
          </div>

          {/* Title and Description */}
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900 text-base md:text-lg tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-500 font-light text-[13px] leading-relaxed line-clamp-2">
              {product.description}
            </p>
          </div>

          {/* Two-Column Price & Stock Inventory Box */}
          <div className="bg-[#f9fafb] rounded-xl p-3 border border-gray-100 flex justify-between items-center text-xs mt-2">
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Price:</span>
              <span className="text-[#2563EB] font-semibold text-sm mt-0.5">
                ${parseFloat(product.price).toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-gray-500 font-medium">Stock:</span>
              <span className="text-gray-800 font-semibold text-sm mt-0.5">
                {product.stockQuantity} units
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="px-5 pb-5 flex items-center gap-3">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 inline-flex items-center justify-center bg-[#F4F4F5] hover:bg-gray-200 active:bg-gray-300 text-gray-800 font-medium text-sm py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          <span>Edit</span>
        </button>

        <button
          onClick={() => onDelete(product.id)}
          className="bg-[#FEF2F2] hover:bg-red-100 active:bg-red-200 text-red-500 p-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
          title="Delete Product"
        >
          <Trash2 className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
