import { useState } from "react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";

interface Props {
  setIsDirty: (dirty: boolean) => void;
}

export function EmergencyContactWidgetSection({ setIsDirty }: Props) {
  const [title, setTitle] = useState("");
  
  const [contacts, setContacts] = useState([
    { id: "1", title: "", contact: "", notes: "" },
    { id: "2", title: "", contact: "", notes: "" },
    { id: "3", title: "", contact: "", notes: "" },
    { id: "4", title: "", contact: "", notes: "" }
  ]);

  const handleChange = (id: string, field: "title" | "contact" | "notes", val: string) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
    setIsDirty(true);
  };

  return (
    <SectionCard title="Emergency Contact Widget">
      <div className="space-y-6">
        <FormInput label="Section Title:" value={title} onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }} placeholder="Billing FAQ" />

        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <div key={contact.id} className="p-4 border border-slate-200 rounded-lg space-y-4 bg-white relative">
              <FormInput 
                label="Title:" 
                value={contact.title} 
                onChange={(e) => handleChange(contact.id, "title", e.target.value)} 
                placeholder={
                  index === 0 ? "Emergency Line" :
                  index === 1 ? "Clinical Support" :
                  index === 2 ? "Secure Message" :
                  index === 3 ? "FDA Reporting" : ""
                } 
              />
              <FormInput 
                label="Contact At:" 
                value={contact.contact} 
                onChange={(e) => handleChange(contact.id, "contact", e.target.value)} 
                placeholder={
                  index === 0 ? "911" :
                  index === 1 ? "1-800-555-0199" :
                  index === 2 ? "safety@weightlossmd.com" :
                  index === 3 ? "FDA MedWatch: 1-800-FDA-1088" : ""
                } 
              />
              <FormInput 
                label="Notes:" 
                value={contact.notes} 
                onChange={(e) => handleChange(contact.id, "notes", e.target.value)} 
                placeholder={
                  index === 0 ? "For life-threatening emergencies" :
                  index === 1 ? "Mon-Sun, 7AM-10PM CT" :
                  index === 2 ? "Monitored 7 days a week" :
                  index === 3 ? "You may also report adverse events directly to the FDA's MedWatch program: fda.gov/safety/medwatch" : ""
                } 
              />
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
