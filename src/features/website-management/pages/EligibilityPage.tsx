import { useState, type ReactNode } from "react";
import { Plus, Save, Trash2 } from "lucide-react";


const SERVICE_ITEMS = [
  "Weight Loss",
  "Hair Care",
  "Sexual Health",
  "Hormone Therapy",
];

const DEFAULT_POINTS = [
  "No history of MTC or MEN2 syndrome (for GLP-1 medications)",
  "BMI ≥ 27 with at least one weight-related condition, or BMI ≥ 30",
  "No active eating disorders",
  "Not pregnant, breastfeeding, or planning pregnancy",
  "Age 18 or older",
  "Willing to complete required monitoring",
];

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
      </div>
      <div className="space-y-4 p-4">{children}</div>
    </section>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-medium text-slate-600">
      {children}
    </label>
  );
}

export default function EligibilityPage() {
  const [servicesOpen] = useState(true);
  const [heroTitle, setHeroTitle] = useState("Am I Eligible?");
  const [heroDescription, setHeroDescription] = useState(
    "Learn the medical criteria our licensed providers use to evaluate candidacy for GLP-1 weight loss treatment."
  );
  const [sectionTitle, setSectionTitle] = useState("General Eligibility Criteria");
  const [points, setPoints] = useState(DEFAULT_POINTS);
  const [reminder, setReminder] = useState(
    "Final eligibility is determined solely by your licensed provider after reviewing your complete health history. Meeting these general criteria does not guarantee approval."
  );

  const updatePoint = (index: number, value: string) => {
    setPoints((current) =>
      current.map((point, pointIndex) => (pointIndex === index ? value : point))
    );
  };

  const removePoint = (index: number) => {
    setPoints((current) => current.filter((_, pointIndex) => pointIndex !== index));
  };

  const addPoint = () => {
    setPoints((current) => [...current, ""]);
  };

  return (
    <div className="w-full bg-[#f8fafc] p-4 md:p-6">
      <div className="mx-auto flex flex-col gap-4 lg:flex-row">
    

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-lg font-semibold text-slate-800">
              Page: Eligibility
            </h1>
            <div className="pt-2">
            <button 
              type="submit"
              // disabled={updateProfile.isPending}
              className="flex items-center gap-2 px-6 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {/* {updateProfile.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}  */}
              Save Changes
            </button>
          </div>
          </div>

          <SectionCard title="Hero Section">
            <div>
              <FieldLabel>Hero title:</FieldLabel>
              <input
                type="text"
                value={heroTitle}
                onChange={(event) => setHeroTitle(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <FieldLabel>Hero Description:</FieldLabel>
              <textarea
                value={heroDescription}
                onChange={(event) => setHeroDescription(event.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </SectionCard>

          <SectionCard title="General Eligibility Criteria Section">
            <div>
              <FieldLabel>Section Title:</FieldLabel>
              <input
                type="text"
                value={sectionTitle}
                onChange={(event) => setSectionTitle(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="space-y-3">
              {points.map((point, index) => (
                <div key={`${index}-${point}`} className="flex items-end gap-2">
                  <div className="flex-1">
                    <FieldLabel>{`Point ${index + 1}:`}</FieldLabel>
                    <input
                      type="text"
                      value={point}
                      onChange={(event) => updatePoint(index, event.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePoint(index)}
                    className="mb-0.5 inline-flex h-10 w-10 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={points.length === 1}
                    aria-label={`Remove point ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addPoint}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2563eb] transition hover:text-[#1d4ed8]"
            >
              <Plus className="h-4 w-4" />
              Add More
            </button>

            <div className="border-t border-slate-100 pt-4">
              <FieldLabel>Reminder:</FieldLabel>
              <textarea
                value={reminder}
                onChange={(event) => setReminder(event.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
