import { useState, useEffect } from "react";
import { Save, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getHeroSections,
  updateHeroSection,
} from "@/api/endpoints/hero-section.api";
import {
  getBillingCancellationPage,
  updateBillingCancellationPage,
} from "@/api/endpoints/billing-cancellation.api";

export default function BillingCancellationPageEditor() {
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Hero Section
  const [heroId, setHeroId] = useState<string | null>(null);
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");

  // Timeline Section
  const [timelineTitle, setTimelineTitle] = useState("");
  const [timelineSteps, setTimelineSteps] = useState<
    { id: string; step: string; description: string }[]
  >([
    { id: "1", step: "Day 1", description: "Enrollment charged" },
    { id: "2", step: "Day 1-3", description: "Provider review begins" },
    { id: "3", step: "Day 3-7", description: "Rx sent to pharmacy" },
    {
      id: "4",
      step: "Billing Monthly",
      description: "Flexible Auto-renewal billing",
    },
  ]);
  const [timelineDisclaimerTitle, setTimelineDisclaimerTitle] = useState("");
  const [timelineDisclaimerDescription, setTimelineDisclaimerDescription] =
    useState("");

  // Cancellation Section
  const [cancelTitle, setCancelTitle] = useState("");
  const [cancelDescription, setCancelDescription] = useState("");
  const [cancelSteps, setCancelSteps] = useState<
    { id: string; content: string }[]
  >([{ id: "1", content: "Log in to your WeightLossMD account" }]);

  // Eligible For Refund Section
  const [refundEligibleTitle, setRefundEligibleTitle] = useState("");
  const [refundEligibleConditions, setRefundEligibleConditions] = useState<
    { id: string; content: string }[]
  >([]);

  // Not Eligible For Refund Section
  const [refundNotEligibleTitle, setRefundNotEligibleTitle] = useState("");
  const [refundNotEligibleConditions, setRefundNotEligibleConditions] =
    useState<{ id: string; content: string }[]>([]);

  // FAQ Section
  const [faqTitle, setFaqTitle] = useState("");
  const [faqs, setFaqs] = useState<
    { id: string; question: string; answer: string }[]
  >([]);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await getHeroSections("BillingCancellation");
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
        const response = await getBillingCancellationPage();
        const data = response.data;
        if (data) {
          setTimelineTitle(data.timelineTitle || "");
          if (data.timelineSteps) {
            setTimelineSteps(
              data.timelineSteps.map((s, i) => ({
                id: String(i),
                step: s.step,
                description: s.description,
              })),
            );
          }
          setTimelineDisclaimerTitle(data.timelineDisclaimerTitle || "");
          setTimelineDisclaimerDescription(
            data.timelineDisclaimerDescription || "",
          );

          setCancelTitle(data.cancelTitle || "");
          setCancelDescription(data.cancelDescription || "");
          if (data.cancelSteps) {
            setCancelSteps(
              data.cancelSteps.map((s, i) => ({ id: String(i), content: s })),
            );
          }

          setRefundEligibleTitle(data.refundEligibleTitle || "");
          if (data.refundEligibleConditions) {
            setRefundEligibleConditions(
              data.refundEligibleConditions.map((s, i) => ({
                id: String(i),
                content: s,
              })),
            );
          }

          setRefundNotEligibleTitle(data.refundNotEligibleTitle || "");
          if (data.refundNotEligibleConditions) {
            setRefundNotEligibleConditions(
              data.refundNotEligibleConditions.map((s, i) => ({
                id: String(i),
                content: s,
              })),
            );
          }

          setFaqTitle(data.faqTitle || "");
          if (data.faqs) {
            setFaqs(
              data.faqs.map((f, i) => ({
                id: String(i),
                question: f.question,
                answer: f.answer,
              })),
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (heroId) {
        await updateHeroSection(heroId, {
          page: "BillingCancellation",
          title: heroTitle,
          description: heroDescription,
        });
      }

      await updateBillingCancellationPage({
        timelineTitle,
        timelineSteps: timelineSteps.map((s) => ({
          step: s.step,
          description: s.description,
        })),
        timelineDisclaimerTitle,
        timelineDisclaimerDescription,
        cancelTitle,
        cancelDescription,
        cancelSteps: cancelSteps.map((s) => s.content),
        refundEligibleTitle,
        refundEligibleConditions: refundEligibleConditions.map(
          (c) => c.content,
        ),
        refundNotEligibleTitle,
        refundNotEligibleConditions: refundNotEligibleConditions.map(
          (c) => c.content,
        ),
        faqTitle,
        faqs: faqs.map((f) => ({ question: f.question, answer: f.answer })),
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

  const addCancelStep = () => {
    setCancelSteps((p) => [
      ...p,
      { id: Math.random().toString(), content: "" },
    ]);
    setIsDirty(true);
  };
  const removeCancelStep = (id: string) => {
    setCancelSteps((p) => p.filter((c) => c.id !== id));
    setIsDirty(true);
  };

  const addEligibleCondition = () => {
    setRefundEligibleConditions((p) => [
      ...p,
      { id: Math.random().toString(), content: "" },
    ]);
    setIsDirty(true);
  };
  const removeEligibleCondition = (id: string) => {
    setRefundEligibleConditions((p) => p.filter((c) => c.id !== id));
    setIsDirty(true);
  };

  const addNotEligibleCondition = () => {
    setRefundNotEligibleConditions((p) => [
      ...p,
      { id: Math.random().toString(), content: "" },
    ]);
    setIsDirty(true);
  };
  const removeNotEligibleCondition = (id: string) => {
    setRefundNotEligibleConditions((p) => p.filter((c) => c.id !== id));
    setIsDirty(true);
  };

  const addFaq = () => {
    setFaqs((p) => [
      ...p,
      { id: Math.random().toString(), question: "", answer: "" },
    ]);
    setIsDirty(true);
  };
  const removeFaq = (id: string) => {
    setFaqs((p) => p.filter((f) => f.id !== id));
    setIsDirty(true);
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
              Billing Cancellation
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
                className="w-full h-24 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all resize-y"
              />
            </div>
          </div>
        </div>

        {/* Billing Timeline */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-5">
            Billing Timeline Section
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                Section Title:
              </label>
              <input
                type="text"
                value={timelineTitle}
                onChange={(e) => {
                  setTimelineTitle(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
            {timelineSteps.map((item, index) => (
              <div
                key={item.id}
                className="space-y-4 pt-4 border-t border-slate-100"
              >
                <div>
                  <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                    Step {index + 1}:
                  </label>
                  <input
                    type="text"
                    value={item.step}
                    onChange={(e) => {
                      setTimelineSteps((p) =>
                        p.map((s) =>
                          s.id === item.id ? { ...s, step: e.target.value } : s,
                        ),
                      );
                      setIsDirty(true);
                    }}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                    Description:
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => {
                      setTimelineSteps((p) =>
                        p.map((s) =>
                          s.id === item.id
                            ? { ...s, description: e.target.value }
                            : s,
                        ),
                      );
                      setIsDirty(true);
                    }}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                  />
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                  Disclaimer Title:
                </label>
                <input
                  type="text"
                  value={timelineDisclaimerTitle}
                  onChange={(e) => {
                    setTimelineDisclaimerTitle(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                  Description:
                </label>
                <textarea
                  value={timelineDisclaimerDescription}
                  onChange={(e) => {
                    setTimelineDisclaimerDescription(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full h-28 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all resize-y"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cancellation Section */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-5">
            Cancellation Section
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                Section Title:
              </label>
              <input
                type="text"
                value={cancelTitle}
                onChange={(e) => {
                  setCancelTitle(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                Description:
              </label>
              <textarea
                value={cancelDescription}
                onChange={(e) => {
                  setCancelDescription(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full h-20 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all resize-y"
              />
            </div>
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Write Process Steps:
              </label>
              {cancelSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={step.content}
                      onChange={(e) => {
                        setCancelSteps((p) =>
                          p.map((s) =>
                            s.id === step.id
                              ? { ...s, content: e.target.value }
                              : s,
                          ),
                        );
                        setIsDirty(true);
                      }}
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                    />
                  </div>
                  <button
                    onClick={() => removeCancelStep(step.id)}
                    className="text-red-500 hover:text-red-700 w-10 h-10 flex items-center justify-center shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                onClick={addCancelStep}
                className="text-sm font-medium text-[#1447E6] hover:text-blue-700"
              >
                + Add More
              </button>
            </div>
          </div>
        </div>

        {/* Eligible for Refund Section */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-5">
            Eligible for Refund Section
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                Section Title:
              </label>
              <input
                type="text"
                value={refundEligibleTitle}
                onChange={(e) => {
                  setRefundEligibleTitle(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Write Condition:
              </label>
              {refundEligibleConditions.map((cond) => (
                <div key={cond.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={cond.content}
                      onChange={(e) => {
                        setRefundEligibleConditions((p) =>
                          p.map((s) =>
                            s.id === cond.id
                              ? { ...s, content: e.target.value }
                              : s,
                          ),
                        );
                        setIsDirty(true);
                      }}
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                    />
                  </div>
                  <button
                    onClick={() => removeEligibleCondition(cond.id)}
                    className="text-red-500 hover:text-red-700 w-10 h-10 flex items-center justify-center shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                onClick={addEligibleCondition}
                className="text-sm font-medium text-[#1447E6] hover:text-blue-700"
              >
                + Add More
              </button>
            </div>
          </div>
        </div>

        {/* Not Eligible for Refund Section */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-5">
            Not Eligible for Refund Section
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                Section Title:
              </label>
              <input
                type="text"
                value={refundNotEligibleTitle}
                onChange={(e) => {
                  setRefundNotEligibleTitle(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Write Condition:
              </label>
              {refundNotEligibleConditions.map((cond) => (
                <div key={cond.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={cond.content}
                      onChange={(e) => {
                        setRefundNotEligibleConditions((p) =>
                          p.map((s) =>
                            s.id === cond.id
                              ? { ...s, content: e.target.value }
                              : s,
                          ),
                        );
                        setIsDirty(true);
                      }}
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                    />
                  </div>
                  <button
                    onClick={() => removeNotEligibleCondition(cond.id)}
                    className="text-red-500 hover:text-red-700 w-10 h-10 flex items-center justify-center shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                onClick={addNotEligibleCondition}
                className="text-sm font-medium text-[#1447E6] hover:text-blue-700"
              >
                + Add More
              </button>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-5">FAQ Section</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                Section Title:
              </label>
              <input
                type="text"
                value={faqTitle}
                onChange={(e) => {
                  setFaqTitle(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
              />
            </div>
            <div className="pt-4 border-t border-slate-100 space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="flex items-start gap-4">
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                        Question:
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => {
                          setFaqs((p) =>
                            p.map((f) =>
                              f.id === faq.id
                                ? { ...f, question: e.target.value }
                                : f,
                            ),
                          );
                          setIsDirty(true);
                        }}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#272628] mb-1.5">
                        Answer:
                      </label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => {
                          setFaqs((p) =>
                            p.map((f) =>
                              f.id === faq.id
                                ? { ...f, answer: e.target.value }
                                : f,
                            ),
                          );
                          setIsDirty(true);
                        }}
                        className="w-full h-20 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all resize-y"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeFaq(faq.id)}
                    className="mt-8 text-red-500 hover:text-red-700 w-10 h-10 flex items-center justify-center shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                onClick={addFaq}
                className="text-sm font-medium text-[#1447E6] hover:text-blue-700"
              >
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
