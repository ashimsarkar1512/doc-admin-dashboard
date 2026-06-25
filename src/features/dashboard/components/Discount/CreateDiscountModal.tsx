import { useState } from "react";
import { X } from "lucide-react";
import type { DiscountPayload } from "@/api/endpoints/discountsApi";
import DatePicker from "@/components/shared/DatePicker";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: DiscountPayload) => void;
  isLoading: boolean;
}

export default function CreateDiscountModal({ isOpen, onClose, onSubmit, isLoading }: Props) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENTAGE" | "FIXED_AMOUNT">("PERCENTAGE");
  const [value, setValue] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!code || !value || !expiresAt) return;
    onSubmit({
      code: code.toUpperCase(),
      type,
      value: Number(value),
      expiresAt: new Date(expiresAt).toISOString(),
      isActive: true,
    });
  };

  const handleClose = () => {
    setCode("");
    setType("PERCENTAGE");
    setValue("");
    setExpiresAt("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Create Discount Code</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-5">

          {/* Promo Code Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Promo Code Name:
            </label>
            <input
              type="text"
              placeholder="e.g., SUMMER2026"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Discount Type:
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="create-type"
                  checked={type === "PERCENTAGE"}
                  onChange={() => setType("PERCENTAGE")}
                  className="accent-blue-600"
                />
                <span className="text-sm text-slate-700">% Percentage</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="create-type"
                  checked={type === "FIXED_AMOUNT"}
                  onChange={() => setType("FIXED_AMOUNT")}
                  className="accent-blue-600"
                />
                <span className="text-sm text-slate-700">$ Fixed Amount</span>
              </label>
            </div>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Discount Value:
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                {type === "PERCENTAGE" ? "%" : "$"}
              </span>
              <input
                type="number"
                placeholder="10"
                min={0}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>

          {/* Expiration Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Expiration Date:
            </label>
            <DatePicker
              value={expiresAt}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !code || !value || !expiresAt}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
          >
            {isLoading ? "Creating..." : "Create Discount"}
          </button>
        </div>

      </div>
    </div>
  );
}