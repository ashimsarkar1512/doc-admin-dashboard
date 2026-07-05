import { useState } from "react";
import { Trash2 } from "lucide-react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";

interface Props {
  setIsDirty: (dirty: boolean) => void;
}

export function EligibleForRefundSection({ setIsDirty }: Props) {
  const [title, setTitle] = useState("");
  const [conditions, setConditions] = useState([
    { id: "1", content: "" },
    { id: "2", content: "" },
    { id: "3", content: "" }
  ]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setIsDirty(true);
  };

  const handleChange = (id: string, val: string) => {
    setConditions(prev => prev.map(c => c.id === id ? { ...c, content: val } : c));
    setIsDirty(true);
  };

  const addCondition = () => {
    setConditions(prev => [...prev, { id: Math.random().toString(36).substring(7), content: "" }]);
    setIsDirty(true);
  };

  const removeCondition = (id: string) => {
    setConditions(prev => prev.filter(c => c.id !== id));
    setIsDirty(true);
  };

  return (
    <SectionCard title="Eligible for Refund Section">
      <div className="space-y-6">
        <FormInput label="Section Title:" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Eligible for Refund" />

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="block text-sm font-medium text-slate-700">Write Condition:</label>
          {conditions.map((condition, index) => (
            <div key={condition.id} className="flex items-center gap-4">
              <div className="flex-1">
                <FormInput
                  label=""
                  value={condition.content}
                  onChange={(e) => handleChange(condition.id, e.target.value)}
                  placeholder={index === 0 ? "Medical team determines you are not eligible for treatment" : index === 1 ? "Billing error or duplicate charges" : "Write here..."}
                />
              </div>
              <button
                onClick={() => removeCondition(condition.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 w-10 h-10 flex items-center justify-center rounded-md transition-colors shrink-0"
                title="Remove Condition"
              >
                <Trash2 size={18} strokeWidth={2} />
              </button>
            </div>
          ))}
          
          <div>
            <button onClick={addCondition} className="text-sm font-medium text-[#1447E6] hover:text-blue-700 transition-colors">
              + Add More
            </button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
