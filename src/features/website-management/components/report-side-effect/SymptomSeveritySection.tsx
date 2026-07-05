import { useState } from "react";
import { Trash2 } from "lucide-react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";

interface Props {
  setIsDirty: (dirty: boolean) => void;
}

export function SymptomSeveritySection({ setIsDirty }: Props) {
  const [newSymptom, setNewSymptom] = useState("");
  const [symptoms, setSymptoms] = useState([
    { id: "1", content: "Mild - Manageable, not affecting daily life" },
    { id: "2", content: "Moderate - Affecting daily activities" },
    { id: "3", content: "Severe - Significant impact, may need medical attention" },
    { id: "4", content: "Life-threatening - Requires immediate emergency care" }
  ]);

  const handleAddSymptom = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSymptom.trim()) {
      e.preventDefault();
      setSymptoms(prev => [...prev, { id: Math.random().toString(36).substring(7), content: newSymptom.trim() }]);
      setNewSymptom("");
      setIsDirty(true);
    }
  };

  const removeSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== id));
    setIsDirty(true);
  };

  return (
    <SectionCard title="Symptom Severity">
      <div className="space-y-4">
        <FormInput 
          label="Write Symptom:" 
          value={newSymptom} 
          onChange={(e) => setNewSymptom(e.target.value)} 
          onKeyDown={handleAddSymptom}
          placeholder="Write here..." 
        />
        
        <div className="space-y-3 pt-2">
          {symptoms.map((symptom) => (
            <div key={symptom.id} className="flex items-center gap-4">
              <span className="text-sm text-slate-600 flex-1">{symptom.content}</span>
              <button
                type="button"
                onClick={() => removeSymptom(symptom.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 w-8 h-8 flex items-center justify-center rounded-md transition-colors shrink-0"
                title="Remove Symptom"
              >
                <Trash2 size={16} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
