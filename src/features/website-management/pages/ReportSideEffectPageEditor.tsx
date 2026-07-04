import { useState, useEffect } from "react";
import { Save, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getHeroSections, updateHeroSection } from "@/api/endpoints/hero-section.api";
import { getReportSideEffectPage, updateReportSideEffectPage } from "@/api/endpoints/report-side-effect.api";

export default function ReportSideEffectPageEditor() {
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Hero Section State
  const [heroId, setHeroId] = useState<string | null>(null);
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");

  // Symptom Severity Section
  const [newSymptom, setNewSymptom] = useState("");
  const [symptoms, setSymptoms] = useState<{ id: string; content: string }[]>([
    { id: "1", content: "Mild - Manageable, not affecting daily life" },
    { id: "2", content: "Moderate - Affecting daily activities" },
    { id: "3", content: "Severe - Significant impact, may need medical attention" },
    { id: "4", content: "Life-threatening - Requires immediate emergency care" }
  ]);

  // Emergency Contact Widget
  const [widgetTitle, setWidgetTitle] = useState("Billing FAQ");
  const [contacts, setContacts] = useState<{ id: string; title: string; contact: string; notes: string }[]>([
    { id: "1", title: "", contact: "", notes: "" },
    { id: "2", title: "", contact: "", notes: "" },
    { id: "3", title: "", contact: "", notes: "" },
    { id: "4", title: "", contact: "", notes: "" }
  ]);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await getHeroSections("ReportSideEffect");
        if (response.data && response.data.length > 0) {
          const hero = response.data[0];
          setHeroId(hero.id);
          setHeroTitle(hero.title);
          setHeroDescription(hero.description);
        }
      } catch (error) {
        console.error("Failed to fetch hero section", error);
      }
    };
    
    const fetchPageData = async () => {
      try {
        const response = await getReportSideEffectPage();
        const data = response.data;
        if (data) {
          if (data.symptoms) {
            setSymptoms(data.symptoms.map((s, i) => ({ id: s.id || String(i), content: s.text })));
          }
          if (data.emergencyWidget) {
            setWidgetTitle(data.emergencyWidget.sectionTitle || "");
            if (data.emergencyWidget.contacts) {
              setContacts(data.emergencyWidget.contacts.map((c, i) => ({
                id: c.id || String(i),
                title: c.title,
                contact: c.contact,
                notes: c.notes
              })));
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch page data", error);
      }
    };

    fetchHero();
    fetchPageData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (heroId) {
        await updateHeroSection(heroId, {
          page: "ReportSideEffect",
          title: heroTitle,
          description: heroDescription
        });
      }
      
      await updateReportSideEffectPage({
        symptoms: symptoms.map(s => ({ text: s.content })),
        emergencyWidget: {
          sectionTitle: widgetTitle,
          contacts: contacts.map(c => ({
            title: c.title,
            contact: c.contact,
            notes: c.notes
          }))
        }
      });
      
      setIsDirty(false);
      toast.success("Changes saved successfully!");
    } catch (error) {
      console.error("Failed to save changes", error);
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

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

  const handleContactChange = (id: string, field: "title" | "contact" | "notes", val: string) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));
    setIsDirty(true);
  };

  const addContact = () => {
    setContacts(prev => [...prev, { id: Math.random().toString(36).substring(7), title: "", contact: "", notes: "" }]);
    setIsDirty(true);
  };

  const removeContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    setIsDirty(true);
  };

  return (
    <div className="p-4 sm:p-7 w-full space-y-8 min-h-full font-sans pb-20 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101828]">Report a Side Effect</h2>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-5">Hero Section</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">Hero title:</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => { setHeroTitle(e.target.value); setIsDirty(true); }}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                placeholder="Report a Side Effect"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">Hero Description:</label>
              <textarea
                value={heroDescription}
                onChange={(e) => { setHeroDescription(e.target.value); setIsDirty(true); }}
                className="w-full h-24 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all resize-y"
                placeholder="Your safety is our top priority. Report any adverse reactions to your medication using the form below. A member of our clinical team will follow up within 24 hours."
              />
            </div>
          </div>
        </div>

        {/* Symptom Severity Section */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-5">Symptom Severity</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">Write Symptom:</label>
              <input
                type="text"
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
                onKeyDown={handleAddSymptom}
                placeholder="Write here... (Press Enter to add)"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
            
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
        </div>

        {/* Emergency Contact Widget Section */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-5">Emergency Contact Widget</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">Section Title:</label>
              <input
                type="text"
                value={widgetTitle}
                onChange={(e) => { setWidgetTitle(e.target.value); setIsDirty(true); }}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                placeholder="Billing FAQ"
              />
            </div>

            <div className="space-y-4">
              {contacts.map((contact, index) => (
                <div key={contact.id} className="p-4 border border-slate-200 rounded-lg space-y-4 bg-white relative">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-[#272628] mb-1.5">Title:</label>
                        <input
                          type="text"
                          value={contact.title}
                          onChange={(e) => handleContactChange(contact.id, "title", e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                          placeholder={index === 0 ? "Emergency Line" : index === 1 ? "Clinical Support" : index === 2 ? "Secure Message" : index === 3 ? "FDA Reporting" : ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#272628] mb-1.5">Contact At:</label>
                        <input
                          type="text"
                          value={contact.contact}
                          onChange={(e) => handleContactChange(contact.id, "contact", e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                          placeholder={index === 0 ? "911" : index === 1 ? "1-800-555-0199" : index === 2 ? "safety@weightlossmd.com" : index === 3 ? "FDA MedWatch: 1-800-FDA-1088" : ""}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#272628] mb-1.5">Notes:</label>
                        <input
                          type="text"
                          value={contact.notes}
                          onChange={(e) => handleContactChange(contact.id, "notes", e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                          placeholder={index === 0 ? "For life-threatening emergencies" : index === 1 ? "Mon-Sun, 7AM-10PM CT" : index === 2 ? "Monitored 7 days a week" : index === 3 ? "You may also report adverse events directly to the FDA's MedWatch program" : ""}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeContact(contact.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 w-10 h-10 flex items-center justify-center rounded-md transition-colors shrink-0 mt-7"
                      title="Remove Contact"
                    >
                      <Trash2 size={18} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={addContact} type="button" className="text-sm font-medium text-[#1447E6] hover:text-blue-700">
                + Add More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Save */}
      <div className="pt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
