import { useState, useEffect } from "react";
import { Save, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getHeroSections,
  updateHeroSection,
} from "@/api/endpoints/hero-section.api";
import {
  getRequestRecordsPage,
  updateRequestRecordsPage,
} from "@/api/endpoints/request-records.api";

export default function RequestRecordPageEditor() {
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Hero Section State
  const [heroId, setHeroId] = useState<string | null>(null);
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await getHeroSections("RequestRecord");
        if (response && response.length > 0) {
          const hero = response[0];
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
        const pageResponse = await getRequestRecordsPage();
        if (pageResponse.data) {
          const w1 = pageResponse.data[0];
          const w2 = pageResponse.data[1];
          const w3 = pageResponse.data[2];

          if (w1) {
            setWidget1Title(w1.title || "");
            setWidget1Items(
              w1.items?.map((i) => ({
                id: i.id || Math.random().toString(),
                content: i.text,
              })) || [],
            );
          }
          if (w2) {
            setWidget2Title(w2.title || "");
            setWidget2Items(
              w2.items?.map((i) => ({
                id: i.id || Math.random().toString(),
                content: i.text,
              })) || [],
            );
          }
          if (w3) {
            setWidget3Title(w3.title || "");
            setWidget3Items(
              w3.items?.map((i) => ({
                id: i.id || Math.random().toString(),
                content: i.text,
              })) || [],
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch page data", error);
      }
    };

    fetchHero();
    fetchPageData();
  }, []);

  // Widget 1 State
  const [widget1Title, setWidget1Title] = useState("");
  const [widget1NewItem, setWidget1NewItem] = useState("");
  const [widget1Items, setWidget1Items] = useState([
    { id: "1", content: "Medical Records: Up to 30 days" },
    { id: "2", content: "Prescription History: 3-5 business days" },
    { id: "3", content: "Billing Records: 1-3 business days" },
    { id: "4", content: "Account Deletion: Up to 45 days" },
  ]);

  // Widget 2 State
  const [widget2Title, setWidget2Title] = useState("");
  const [widget2NewItem, setWidget2NewItem] = useState("");
  const [widget2Items, setWidget2Items] = useState([
    { id: "1", content: "Right to access your medical records" },
    { id: "2", content: "Right to request corrections" },
    { id: "3", content: "Right to receive an accounting of disclosures" },
    { id: "4", content: "Right to restrict certain uses" },
    { id: "5", content: "Right to receive records in electronic format" },
  ]);

  // Widget 3 State
  const [widget3Title, setWidget3Title] = useState("");
  const [widget3NewItem, setWidget3NewItem] = useState("");
  const [widget3Items, setWidget3Items] = useState([
    {
      id: "1",
      content:
        "Contact our Privacy Officer for assistance with records requests.",
    },
    { id: "2", content: "privacy@weightlossmd.com" },
    { id: "3", content: "1-800-555-0177" },
  ]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (heroId) {
        await updateHeroSection(heroId, {
          page: "RequestRecord",
          title: heroTitle,
          description: heroDescription,
        });
      }

      const widgets = [];
      if (widget1Title || widget1Items.length > 0) {
        widgets.push({
          title: widget1Title,
          items: widget1Items.map((i) => ({ text: i.content })),
        });
      }
      if (widget2Title || widget2Items.length > 0) {
        widgets.push({
          title: widget2Title,
          items: widget2Items.map((i) => ({ text: i.content })),
        });
      }
      if (widget3Title || widget3Items.length > 0) {
        widgets.push({
          title: widget3Title,
          items: widget3Items.map((i) => ({ text: i.content })),
        });
      }

      await updateRequestRecordsPage({ widgets });

      setIsDirty(false);
      toast.success("Changes saved successfully!");
    } catch (error) {
      console.error("Failed to save changes", error);
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddWidget1Item = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && widget1NewItem.trim()) {
      e.preventDefault();
      setWidget1Items((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          content: widget1NewItem.trim(),
        },
      ]);
      setWidget1NewItem("");
      setIsDirty(true);
    }
  };

  const handleAddWidget2Item = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && widget2NewItem.trim()) {
      e.preventDefault();
      setWidget2Items((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          content: widget2NewItem.trim(),
        },
      ]);
      setWidget2NewItem("");
      setIsDirty(true);
    }
  };

  const handleAddWidget3Item = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && widget3NewItem.trim()) {
      e.preventDefault();
      setWidget3Items((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          content: widget3NewItem.trim(),
        },
      ]);
      setWidget3NewItem("");
      setIsDirty(true);
    }
  };

  return (
    <div className="p-4 sm:p-7 w-full space-y-8 min-h-full font-sans pb-20 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <div className="text-[15px] text-slate-800 font-medium flex items-center gap-2">
            <span className="text-slate-700 font-semibold">Pages</span>
            <span className="text-slate-500 font-normal">&gt;</span>
            <span className="text-slate-900 font-bold">
              Request Your Records
            </span>
          </div>
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

      {/* Sections */}
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-5">
            Hero Section
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                Hero title:
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => {
                  setHeroTitle(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Request Your Records"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                Hero Description:
              </label>
              <textarea
                value={heroDescription}
                onChange={(e) => {
                  setHeroDescription(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="You have the right to access, receive a copy of, and request corrections to your medical records under HIPAA."
                className="w-full h-24 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all resize-y"
              />
            </div>
          </div>
        </div>

        {/* Side Widget 1 */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-5">
            Side Widget 1
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                Title:
              </label>
              <input
                type="text"
                value={widget1Title}
                onChange={(e) => {
                  setWidget1Title(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Processing Time"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                  Items:
                </label>
                <input
                  type="text"
                  value={widget1NewItem}
                  onChange={(e) => setWidget1NewItem(e.target.value)}
                  onKeyDown={handleAddWidget1Item}
                  placeholder="Write here.."
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                />
              </div>

              <div className="space-y-3 pt-2">
                {widget1Items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <span className="text-sm text-slate-600 flex-1">
                      {item.content}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setWidget1Items((prev) =>
                          prev.filter((i) => i.id !== item.id),
                        );
                        setIsDirty(true);
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 w-8 h-8 flex items-center justify-center rounded-md transition-colors shrink-0"
                      title="Remove Item"
                    >
                      <Trash2 size={16} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Side Widget 2 */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-5">
            Side Widget 2
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                Title:
              </label>
              <input
                type="text"
                value={widget2Title}
                onChange={(e) => {
                  setWidget2Title(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="HIPAA Rights"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                  Items:
                </label>
                <input
                  type="text"
                  value={widget2NewItem}
                  onChange={(e) => setWidget2NewItem(e.target.value)}
                  onKeyDown={handleAddWidget2Item}
                  placeholder="Write here.."
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                />
              </div>

              <div className="space-y-3 pt-2">
                {widget2Items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <span className="text-sm text-slate-600 flex-1">
                      {item.content}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setWidget2Items((prev) =>
                          prev.filter((i) => i.id !== item.id),
                        );
                        setIsDirty(true);
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 w-8 h-8 flex items-center justify-center rounded-md transition-colors shrink-0"
                      title="Remove Item"
                    >
                      <Trash2 size={16} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Side Widget 3 (Titled Side Widget 2 as requested) */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-5">
            Side Widget 2
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                Title:
              </label>
              <input
                type="text"
                value={widget3Title}
                onChange={(e) => {
                  setWidget3Title(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Need Help?"
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                  Items:
                </label>
                <input
                  type="text"
                  value={widget3NewItem}
                  onChange={(e) => setWidget3NewItem(e.target.value)}
                  onKeyDown={handleAddWidget3Item}
                  placeholder="Write here.."
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                />
              </div>

              <div className="space-y-3 pt-2">
                {widget3Items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <span className="text-sm text-slate-600 flex-1">
                      {item.content}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setWidget3Items((prev) =>
                          prev.filter((i) => i.id !== item.id),
                        );
                        setIsDirty(true);
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 w-8 h-8 flex items-center justify-center rounded-md transition-colors shrink-0"
                      title="Remove Item"
                    >
                      <Trash2 size={16} strokeWidth={2} />
                    </button>
                  </div>
                ))}
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
