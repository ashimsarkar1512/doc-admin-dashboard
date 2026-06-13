import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Discount, DiscountPayload } from "@/api/endpoints/discountsApi";

interface Props {
  isOpen: boolean;
  discount: Discount | null;
  onClose: () => void;
  onSubmit: (payload: Partial<DiscountPayload>) => void;
  isLoading: boolean;
}

export default function UpdateDiscountModal({ isOpen, discount, onClose, onSubmit, isLoading }: Props) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENTAGE" | "FIXED_AMOUNT">("PERCENTAGE");
  const [value, setValue] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (discount) {
      setCode(discount.code);
      setType(discount.type);
      setValue(String(discount.value));
      setExpiresAt(discount.expiresAt.split("T")[0]);
      setIsActive(discount.isActive);
    }
  }, [discount]);

  if (!isOpen || !discount) return null;

  const handleSubmit = () => {
    if (!code || !value || !expiresAt) return;
    onSubmit({
      code: code.toUpperCase(),
      type,
      value: Number(value),
      expiresAt: new Date(expiresAt).toISOString(),
      isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Update Discount Code</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Promo Code Name:</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Discount Type:</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="edit-type" checked={type === "PERCENTAGE"} onChange={() => setType("PERCENTAGE")} className="accent-blue-600" />
                <span className="text-sm text-slate-700">% Percentage</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="edit-type" checked={type === "FIXED_AMOUNT"} onChange={() => setType("FIXED_AMOUNT")} className="accent-blue-600" />
                <span className="text-sm text-slate-700">$ Fixed Amount</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Discount Value:</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                {type === "PERCENTAGE" ? "%" : "$"}
              </span>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Expiration Date:</label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-slate-700">Active Status</p>
              <p className="text-xs text-slate-400 mt-0.5">Toggle to activate or deactivate</p>
            </div>
            <button
              onClick={() => setIsActive((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isActive ? "bg-blue-600" : "bg-slate-200"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !code || !value || !expiresAt}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}