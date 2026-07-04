import { useState, useEffect } from "react";
import { Save, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { getHeroSections, updateHeroSection } from "@/api/endpoints/hero-section.api";
import { getShippingInfoPage, updateShippingInfoPage } from "@/api/endpoints/shipping-info.api";
import { uploadAttachment } from "@/api/endpoints/attachments.api";
import { getFaqByPageType, updateFaq } from "@/api/endpoints/faq.api";
import { getCtaSections, updateCtaSection } from "@/api/endpoints/cta-section.api";

export default function ShippingInformationPageEditor() {
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Hero Section State
  const [heroId, setHeroId] = useState<string | null>(null);
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await getHeroSections("ShippingInfo");
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
        const response = await getShippingInfoPage();
        const data = response.data;
        if (data) {
          if (data.partnerPharmacySection) {
            setPartnerTitle(data.partnerPharmacySection.title || "");
            setPartnerDescription(data.partnerPharmacySection.description || "");
            if (data.partnerPharmacySection.partners) {
              setPharmacies(data.partnerPharmacySection.partners.map(p => ({
                id: p.id || Math.random().toString(),
                name: p.name,
                address: p.address,
                logoId: p.logoId || null,
                logoUrl: p.logo || ""
              })));
            }
          }
          if (data.shippingTimelineSection) {
            setTimelineTitle(data.shippingTimelineSection.title || "");
            setTimelineDescription(data.shippingTimelineSection.description || "");
            if (data.shippingTimelineSection.steps) {
              setTimelineSteps(data.shippingTimelineSection.steps.map(s => ({
                id: s.id || Math.random().toString(),
                step: s.title,
                description: s.description
              })));
            }
          }
          if (data.shippingPolicySection) {
            setPoliciesTitle(data.shippingPolicySection.title || "");
            setPoliciesDescription(data.shippingPolicySection.description || "");
            setDisclaimerTitle(data.shippingPolicySection.disclaimerTitle || "");
            setDisclaimerDescription(data.shippingPolicySection.disclaimerDescription || "");
            if (data.shippingPolicySection.policies) {
              setPolicyNotes(data.shippingPolicySection.policies.map(p => ({
                id: p.id || Math.random().toString(),
                content: p.text
              })));
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch page data", error);
      }
    };

    const fetchFaq = async () => {
      try {
        const response = await getFaqByPageType("ShippingInfo");
        const data = response.data;
        if (data) {
          setFaqId(data.id);
          setFaqTitle(data.sectionTitle || "");
          if (data.faqs) {
            setFaqs(data.faqs.map(f => ({
              id: f.id || Math.random().toString(),
              question: f.question,
              answer: f.answer
            })));
          }
        }
      } catch (error) {
        console.error("Failed to fetch FAQ data", error);
      }
    };

    const fetchCta = async () => {
      try {
        const response = await getCtaSections("ShippingInfo");
        if (response.data && response.data.length > 0) {
          const cta = response.data[0];
          setCtaId(cta.id);
          setCtaTitle(cta.sectionTitle || "");
          setCtaButtonText(cta.ctaButtonText || "");
          setCtaLink(cta.url || "");
          setCtaBlankTarget(cta.openInNewTab || false);
        }
      } catch (error) {
        console.error("Failed to fetch CTA section", error);
      }
    };

    fetchHero();
    fetchPageData();
    fetchFaq();
    fetchCta();
  }, []);

  // Partner Pharmacy Section State
  const [partnerTitle, setPartnerTitle] = useState("");
  const [partnerDescription, setPartnerDescription] = useState("");
  const [pharmacies, setPharmacies] = useState<{ id: string; name: string; address: string; logoUrl: string; logoId?: string | null }>([
    { id: "1", name: "", address: "", logoUrl: "", logoId: null },
    { id: "2", name: "", address: "", logoUrl: "", logoId: null },
    { id: "3", name: "", address: "", logoUrl: "", logoId: null },
    { id: "4", name: "", address: "", logoUrl: "", logoId: null },
    { id: "5", name: "", address: "", logoUrl: "", logoId: null }
  ]);

  // Shipping Timeline Section State
  const [timelineTitle, setTimelineTitle] = useState("");
  const [timelineDescription, setTimelineDescription] = useState("");
  const [timelineSteps, setTimelineSteps] = useState([
    { id: "1", step: "Rx Received", description: "Day 0" },
    { id: "2", step: "Processing", description: "Day 1-2" },
    { id: "3", step: "Shipped", description: "Day 2-4" },
    { id: "4", step: "In Transit", description: "Day 2-7" },
    { id: "5", step: "Delivered", description: "Day 3-7" }
  ]);

  // Shipping Policy Section State
  const [policiesTitle, setPoliciesTitle] = useState("");
  const [policiesDescription, setPoliciesDescription] = useState("");
  const [policyNewNote, setPolicyNewNote] = useState("");
  const [policyNotes, setPolicyNotes] = useState([
    { id: "1", content: "Tracking number emailed when shipped" },
    { id: "2", content: "Track in your patient portal" },
    { id: "3", content: "SMS notifications available" },
    { id: "4", content: "Only ships within the US" },
    { id: "5", content: "Cannot ship to states without licensed providers" },
    { id: "6", content: "P.O. boxes may not be eligible for cold-chain meds" },
    { id: "7", content: "No international shipments" }
  ]);
  const [disclaimerTitle, setDisclaimerTitle] = useState("");
  const [disclaimerDescription, setDisclaimerDescription] = useState("");

  // FAQs Section State
  const [faqId, setFaqId] = useState<string | null>(null);
  const [faqTitle, setFaqTitle] = useState("");
  const [faqs, setFaqs] = useState([
    { id: "1", question: "", answer: "" },
    { id: "2", question: "", answer: "" },
    { id: "3", question: "", answer: "" }
  ]);

  // Bottom CTA State
  const [ctaId, setCtaId] = useState<string | null>(null);
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaButtonText, setCtaButtonText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [ctaBlankTarget, setCtaBlankTarget] = useState(true);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (heroId) {
        await updateHeroSection(heroId, {
          page: "ShippingInfo",
          title: heroTitle,
          description: heroDescription
        });
      }
      
      await updateShippingInfoPage({
        partnerPharmacySection: {
          title: partnerTitle,
          description: partnerDescription,
          partners: pharmacies.map(p => ({
            name: p.name,
            address: p.address,
            logoId: p.logoUrl || null
          }))
        },
        shippingTimelineSection: {
          title: timelineTitle,
          description: timelineDescription,
          steps: timelineSteps.map(s => ({
            title: s.step,
            description: s.description
          }))
        },
        shippingPolicySection: {
          title: policiesTitle,
          description: policiesDescription,
          disclaimerTitle,
          disclaimerDescription,
          policies: policyNotes.map(n => ({
            text: n.content
          }))
        }
      });
      
      await updateFaq({
        pageType: "ShippingInfo",
        sectionTitle: faqTitle,
        faqs: faqs.map(f => ({
          question: f.question,
          answer: f.answer
        }))
      });
      
      if (ctaId) {
        await updateCtaSection(ctaId, {
          page: "ShippingInfo",
          sectionTitle: ctaTitle,
          ctaButtonText,
          url: ctaLink,
          openInNewTab: ctaBlankTarget
        });
      }
      
      // Add other API updates here if needed in the future
      setIsDirty(false);
      toast.success("Changes saved successfully!");
    } catch (error) {
      console.error("Failed to save changes", error);
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPharmacy = () => {
    setPharmacies(prev => [...prev, { id: Math.random().toString(36).substring(7), name: "", address: "", logoUrl: "", logoId: null }]);
    setIsDirty(true);
  };

  const removePharmacy = (id: string) => {
    setPharmacies(prev => prev.filter(p => p.id !== id));
    setIsDirty(true);
  };

  const handleAddPolicyNote = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && policyNewNote.trim()) {
      e.preventDefault();
      setPolicyNotes(prev => [...prev, { id: Math.random().toString(36).substring(7), content: policyNewNote.trim() }]);
      setPolicyNewNote("");
      setIsDirty(true);
    }
  };

  const removePolicyNote = (id: string) => {
    setPolicyNotes(prev => prev.filter(n => n.id !== id));
    setIsDirty(true);
  };

  const handleAddFaq = () => {
    setFaqs(prev => [...prev, { id: Math.random().toString(36).substring(7), question: "", answer: "" }]);
    setIsDirty(true);
  };

  const removeFaq = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    setIsDirty(true);
  };

  return (
    <div className="p-4 sm:p-7 w-full space-y-8 min-h-full font-sans pb-20 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101828]">Shipping Information</h2>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
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
                placeholder="Pharmacy & Shipping Information"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">Hero Description:</label>
              <textarea
                value={heroDescription}
                onChange={(e) => { setHeroDescription(e.target.value); setIsDirty(true); }}
                placeholder="Complete transparency on how your prescription is filled and delivered."
                className="w-full h-24 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all resize-y"
              />
            </div>
          </div>
        </div>

        {/* Partner Pharmacy Section */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-5">Partner Pharmacy Section</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">Title:</label>
              <input
                type="text"
                value={partnerTitle}
                onChange={(e) => { setPartnerTitle(e.target.value); setIsDirty(true); }}
                placeholder="Partner Pharmacy Network"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">Description:</label>
              <input
                type="text"
                value={partnerDescription}
                onChange={(e) => { setPartnerDescription(e.target.value); setIsDirty(true); }}
                placeholder="Pharmacy assignment is based on your state, medication type, and current provider relationships."
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
            
            <div className="space-y-4">
              {pharmacies.map((pharmacy, index) => (
                <div key={pharmacy.id} className="p-4 border border-slate-200 rounded-lg space-y-4 bg-white relative">
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-[#272628] mb-1.5">Partner Name:</label>
                          <input
                            type="text"
                            value={pharmacy.name}
                            onChange={(e) => {
                              setPharmacies(prev => prev.map(p => p.id === pharmacy.id ? { ...p, name: e.target.value } : p));
                              setIsDirty(true);
                            }}
                            placeholder={index === 0 ? "Olympia Pharmaceuticals" : index === 1 ? "CasaPharma RX" : index === 2 ? "Vios Compounding Pharmacy" : index === 3 ? "AnazaoHealth" : index === 4 ? "Belmar" : "Write here..."}
                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removePharmacy(pharmacy.id)}
                          className="mt-7 text-red-500 hover:text-red-700 hover:bg-red-50 w-8 h-8 flex items-center justify-center rounded-md transition-colors shrink-0"
                          title="Remove Pharmacy"
                        >
                          <Trash2 size={16} strokeWidth={2} />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#272628] mb-1.5">Address:</label>
                        <input
                          type="text"
                          value={pharmacy.address}
                          onChange={(e) => {
                            setPharmacies(prev => prev.map(p => p.id === pharmacy.id ? { ...p, address: e.target.value } : p));
                            setIsDirty(true);
                          }}
                          placeholder={index === 0 ? "503B Outsourcer + 503A Pharmacy" : "503A Pharmacy"}
                          className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-[#272628] mb-1.5">Pharmacy Logo:</label>
                        <div className="relative">
                          <label className="h-10 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-500 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors w-full">
                            <span className="truncate mr-2">
                              {pharmacy.logoUrl ? "Change logo..." : "Upload image..."}
                            </span>
                            <Upload size={16} className="text-slate-400 shrink-0" />
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*,video/mp4"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const uploadedFile = await uploadAttachment(file, 'OTHERS');
                                    setPharmacies(prev => prev.map(p => p.id === pharmacy.id ? { ...p, logoUrl: uploadedFile.fileUrl, logoId: uploadedFile.id } : p));
                                    setIsDirty(true);
                                  } catch (error) {
                                    toast.error("Failed to upload image.");
                                  }
                                }
                                if (e.target) e.target.value = '';
                              }}
                            />
                          </label>
                        </div>
                        {pharmacy.logoUrl && (
                          <div className="mt-3 relative inline-block">
                            <div className="h-14 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-2 overflow-hidden">
                              <img src={pharmacy.logoUrl} alt="Logo" className="h-full w-auto object-contain max-w-[120px]" />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setPharmacies(prev => prev.map(p => p.id === pharmacy.id ? { ...p, logoUrl: "", logoId: null } : p));
                                setIsDirty(true);
                              }}
                              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-slate-100 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div>
                <button type="button" onClick={handleAddPharmacy} className="text-sm font-medium text-[#1447E6] hover:text-blue-700 transition-colors">
                  + Add Another
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Timeline Section */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-5">Shipping Timeline Section</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">Section Title:</label>
              <input
                type="text"
                value={timelineTitle}
                onChange={(e) => { setTimelineTitle(e.target.value); setIsDirty(true); }}
                placeholder="Shipping Timeline"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">Description:</label>
              <input
                type="text"
                value={timelineDescription}
                onChange={(e) => { setTimelineDescription(e.target.value); setIsDirty(true); }}
                placeholder="Timelines are estimates. Expedited options may be available. Cold-chain medications may require signature."
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                {timelineSteps.map((item, index) => (
                  <div key={item.id} className="col-span-2 flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-[#272628] mb-1.5">Step {index === 4 ? 4 : index + 1}:</label>
                      <input
                        type="text"
                        value={item.step}
                        onChange={(e) => {
                          setTimelineSteps(prev => prev.map(s => s.id === item.id ? { ...s, step: e.target.value } : s));
                          setIsDirty(true);
                        }}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-[#272628] mb-1.5">Description:</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          setTimelineSteps(prev => prev.map(s => s.id === item.id ? { ...s, description: e.target.value } : s));
                          setIsDirty(true);
                        }}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Policy Section */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-5">Shipping Policy Section</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">Section Title:</label>
              <input
                type="text"
                value={policiesTitle}
                onChange={(e) => { setPoliciesTitle(e.target.value); setIsDirty(true); }}
                placeholder="Shipping Policy"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">Description:</label>
              <textarea
                value={policiesDescription}
                onChange={(e) => { setPoliciesDescription(e.target.value); setIsDirty(true); }}
                placeholder="Write..."
                className="w-full h-24 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all resize-y"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#272628] mb-1.5">Add Policy:</label>
                <input
                  type="text"
                  value={policyNewNote}
                  onChange={(e) => setPolicyNewNote(e.target.value)}
                  onKeyDown={handleAddPolicyNote}
                  placeholder="Write here.."
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                />
              </div>
              
              <div className="space-y-3 pt-2">
                {policyNotes.map((note) => (
                  <div key={note.id} className="flex items-center gap-4">
                    <span 
                      className="flex-1 text-[#272628]"
                      style={{ 
                        fontFamily: 'Quicksand', 
                        fontWeight: 400, 
                        fontStyle: 'normal', 
                        fontSize: '14px', 
                        lineHeight: '100%', 
                        letterSpacing: '0px',
                        width: '309px',
                        height: '18px',
                        opacity: 1
                      }}
                    >
                      {note.content}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePolicyNote(note.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 w-8 h-8 flex items-center justify-center rounded-md transition-colors shrink-0"
                      title="Remove Note"
                    >
                      <Trash2 size={16} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#272628] mb-1.5">Disclaimer Title:</label>
                <input
                  type="text"
                  value={disclaimerTitle}
                  onChange={(e) => { setDisclaimerTitle(e.target.value); setIsDirty(true); }}
                  placeholder="Prescription & Pharmacy Disclosure:"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#272628] mb-1.5">Description:</label>
                <textarea
                  value={disclaimerDescription}
                  onChange={(e) => { setDisclaimerDescription(e.target.value); setIsDirty(true); }}
                  placeholder="All medications dispensed through our platform require a valid prescription from a licensed provider..."
                  className="w-full h-24 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all resize-y"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ's Section */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-5">FAQ's Section</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">Section Title:</label>
              <input
                type="text"
                value={faqTitle}
                onChange={(e) => { setFaqTitle(e.target.value); setIsDirty(true); }}
                placeholder="Shipping Questions"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={faq.id} className="p-4 border border-slate-200 rounded-lg space-y-4 bg-white relative">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-[#272628] mb-1.5">Question:</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          setFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, question: e.target.value } : f));
                          setIsDirty(true);
                        }}
                        placeholder={index === 0 ? "Can I ship to a P.O. box?" : index === 1 ? "What if my medication is damaged during shipping?" : index === 2 ? "Do you ship internationally?" : "Write here..."}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                      />
                    </div>
                    <div className="w-10 shrink-0"></div>
                  </div>
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-[#272628] mb-1.5">Answer:</label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => {
                          setFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, answer: e.target.value } : f));
                          setIsDirty(true);
                        }}
                        placeholder={index === 0 ? "Medications requiring cold storage cannot be shipped to P.O. boxes. Standard medications may be shipped to P.O. boxes depending on the pharmacy." : "Write..."}
                        className="w-full h-20 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all resize-y"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFaq(faq.id)}
                      className="mb-1 text-red-500 hover:text-red-700 hover:bg-red-50 w-10 h-10 flex items-center justify-center rounded-md transition-colors shrink-0"
                      title="Remove FAQ"
                    >
                      <Trash2 size={18} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ))}
              <div>
                <button type="button" onClick={handleAddFaq} className="text-sm font-medium text-[#1447E6] hover:text-blue-700 transition-colors">
                  + Add More
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-5">Bottom CTA Section:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-4">
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">Section Title:</label>
              <input
                type="text"
                value={ctaTitle}
                onChange={(e) => { setCtaTitle(e.target.value); setIsDirty(true); }}
                placeholder="Contact Us at Weight Loss MD Today"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">CTA Button Text:</label>
              <input
                type="text"
                value={ctaButtonText}
                onChange={(e) => { setCtaButtonText(e.target.value); setIsDirty(true); }}
                placeholder="Book a consultation"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">URL:</label>
              <input
                type="text"
                value={ctaLink}
                onChange={(e) => { setCtaLink(e.target.value); setIsDirty(true); }}
                placeholder="https://weightlossmd.com/contact"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
            <div className="lg:col-span-2 flex items-center gap-3 pt-7">
              <label className="block text-sm font-semibold text-[#272628]">Button target:</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ctaBlankTarget}
                  onChange={(e) => { setCtaBlankTarget(e.target.checked); setIsDirty(true); }}
                  className="w-4 h-4 text-[#1447E6] border-slate-300 rounded focus:ring-[#1447E6]"
                />
                <span className="text-sm text-slate-600">Blank (open in new tab)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Save */}
      <div className="pt-6 flex justify-start">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
