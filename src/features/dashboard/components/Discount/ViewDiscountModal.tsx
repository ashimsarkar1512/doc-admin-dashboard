import { X, Pencil, Trash2 } from "lucide-react";
import type { Discount } from "@/api/endpoints/discountsApi";

interface Props {
  isOpen: boolean;
  discount: Discount | null;
  onClose: () => void;
  onEdit: (discount: Discount) => void;
  onDelete: (id: string) => void;
}

export default function ViewDiscountModal({ isOpen, discount, onClose, onEdit, onDelete }: Props) {
  if (!isOpen || !discount) return null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const formatValue = (type: string, value: number) =>
    type === "PERCENTAGE" ? `${value}%` : `$${value}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Discount Details</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="space-y-4">
          {[
            { label: "Code", value: <span className="text-blue-600 font-semibold">{discount.code}</span> },
            { label: "Type", value: discount.type === "PERCENTAGE" ? "Percentage" : "Fixed Amount" },
            { label: "Value", value: formatValue(discount.type, discount.value) },
            {
              label: "Status",
              value: (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  discount.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                }`}>
                  {discount.isActive ? "Active" : "Inactive"}
                </span>
              ),
            },
            { label: "Created", value: formatDate(discount.createdAt) },
            { label: "Expires", value: formatDate(discount.expiresAt) },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <span className="text-sm font-medium text-slate-500">{label}</span>
              <span className="text-sm text-slate-800">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => onDelete(discount.id)}
            className="flex items-center gap-2 px-5 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={() => onEdit(discount)}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit Discount
          </button>
        </div>
      </div>
    </div>
  );
}