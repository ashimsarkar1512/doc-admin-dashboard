import { useState, type ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";

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
    <section className="rounded-xl border border-[#D1D5DC] bg-white rounded-[10px] p-4 md:p-5 flex flex-col gap-y-4 lg:gap-y-5">
      <div className="font-['Quicksand'] text-[18px] leading-[20px] font-semibold tracking-[0px] text-[#272628]">{title}</div>

      <div className="font-['Quicksand'] text-[14px] leading-none border-[#D1D5DC] font-normal tracking-[0px] text-[#272628] mt-2">{children}</div>
    </section>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="block font-['Quicksand'] text-[14px] leading-[20px] font-semibold tracking-[0px] text-[#272628]">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  );
}

function TextAreaInput({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  );
}

export default function EligibilityPage() {
  const [heroTitle, setHeroTitle] = useState("Am I Eligible?");
  const [heroDescription, setHeroDescription] = useState(
    "Learn the medical criteria our licensed providers use to evaluate candidacy for GLP-1 weight loss treatment."
  );
  const [sectionTitle, setSectionTitle] = useState("General Eligibility Criteria");
  const [points, setPoints] = useState(DEFAULT_POINTS);
  const [reminder, setReminder] = useState(
    "Final eligibility is determined solely by your licensed provider after reviewing your complete health history. Meeting these general criteria does not guarantee approval."
  );
  const [bmiSectionTitle, setBmiSectionTitle] = useState("BMI Qualification");
  const [bmi27Title, setBmi27Title] = useState("BMI 27-29.9");
  const [bmi27Description, setBmi27Description] = useState(
    "Eligible if accompanied by at least one weight-related health condition such as hypertension, type 2 diabetes, dyslipidemia, or sleep apnea."
  );
  const [bmi30Title, setBmi30Title] = useState("BMI 30+");
  const [bmi30Description, setBmi30Description] = useState(
    "Eligible for treatment regardless of presence of comorbid conditions. GLP-1 medications are FDA-approved for this BMI category."
  );
  const [weightConditionsTitle, setWeightConditionsTitle] = useState(
    "Weight-Related Conditions Considered"
  );
  const [newCondition, setNewCondition] = useState("");
  const [weightConditions, setWeightConditions] = useState([
    "Type 2 Diabetes",
    "Prediabetes",
    "Hypertension",
    "High Cholesterol",
    "Sleep Apnea",
    "Non-alcoholic Fatty Liver Disease",
    "Osteoarthritis",
    "Cardiovascular Disease",
    "Polycystic Ovary Syndrome (PCOS)",
  ]);
  const [contraindicationsTitle, setContraindicationsTitle] = useState(
    "Contraindications"
  );
  const [newContraindication, setNewContraindication] = useState("");
  const [contraindications, setContraindications] = useState([
    "Prior serious hypersensitivity to GLP-1/GIP receptor agonists",
    "Personal or family history of medullary thyroid carcinoma (MTC)",
    "Active pancreatitis or history of chronic pancreatitis",
    "Multiple Endocrine Neoplasia syndrome type 2 (MEN2)",
    "Severe renal impairment (eGFR < 30 mL/min/1.73 m²)",
    "Current use of insulin (in some cases)",
    "Current or recent pregnancy",
    "Current use of insulin (in some cases)",
  ]);
  const [requiredLabWorkTitle, setRequiredLabWorkTitle] = useState(
    "Required Lab Work"
  );
  const [newLabWork, setNewLabWork] = useState("");
  const [requiredLabWorkItems, setRequiredLabWorkItems] = useState([
    "Comprehensive Metabolic Panel (CMP)",
    "Hemoglobin A1c (HbA1c)",
    "Thyroid Stimulating Hormone (TSH)",
    "Lipid Panel",
    "Complete Blood Count (CBC)",
  ]);
  const [ongoingMonitoringTitle, setOngoingMonitoringTitle] = useState(
    "Ongoing Monitoring"
  );
  const [newOngoingMonitoring, setNewOngoingMonitoring] = useState("");
  const [ongoingMonitoringItems, setOngoingMonitoringItems] = useState([
    "Quarterly metabolic panel (Comprehensive plan)",
    "HbA1c monitoring for diabetic patients",
    "Pancreatic enzyme monitoring if indicated",
    "Renal function for at-risk patients",
  ]);
  const [disclaimerTitle, setDisclaimerTitle] = useState(
    "Provider Review Disclaimer:"
  );
  const [disclaimerDescription, setDisclaimerDescription] = useState(
    "Eligibility criteria presented here are general guidelines. All final treatment decisions are made exclusively by licensed healthcare providers. Meeting criteria on this page does not guarantee prescription approval."
  );
  const [faqSectionTitle, setFaqSectionTitle] = useState(
    "Eligibility Questions"
  );
  const [faqs, setFaqs] = useState([
    {
      question: "How is BMI calculated?",
      answer:
        "BMI is weight (kg) ÷ height (m²). You can use our free BMI calculator during your assessment. Providers may also consider waist circumference and body composition.",
    },
    {
      question: "Do I need labs before starting?",
      answer: "",
    },
    {
      question: "What if I have a contraindication?",
      answer: "",
    },
  ]);
  const [bottomCtaTitle, setBottomCtaTitle] = useState(
    "Contact Us at Weight Loss MD Today"
  );
  const [bottomCtaButtonText, setBottomCtaButtonText] = useState(
    "Book a consultation"
  );
  const [bottomCtaUrl, setBottomCtaUrl] = useState(
    "https://weightlossmd.com/contact"
  );
  const [bottomCtaNewTab, setBottomCtaNewTab] = useState(true);

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

  const removeCondition = (index: number) => {
    setWeightConditions((current) =>
      current.filter((_, conditionIndex) => conditionIndex !== index)
    );
  };

  // const addContraindication = () => {
  //   const value = newContraindication.trim();
  //   if (!value) return;
  //   setContraindications((current) => [...current, value]);
  //   setNewContraindication("");
  // };

  const removeContraindication = (index: number) => {
    setContraindications((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const removeRequiredLabWork = (index: number) => {
    setRequiredLabWorkItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const removeOngoingMonitoring = (index: number) => {
    setOngoingMonitoringItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const updateFaq = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    setFaqs((current) =>
      current.map((faq, faqIndex) =>
        faqIndex === index ? { ...faq, [field]: value } : faq
      )
    );
  };

  const addFaq = () => {
    setFaqs((current) => [...current, { question: "", answer: "" }]);
  };

  const removeFaq = (index: number) => {
    setFaqs((current) => current.filter((_, faqIndex) => faqIndex !== index));
  };

  return (
    <div className="w-full bg-[#f8fafc] p-4 md:p-6">
      <div className="mx-auto flex flex-col gap-4 lg:flex-row">


        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-col gap-y-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-['Quicksand'] text-[18px] leading-[28px] font-semibold text-[#101828] tracking-[0px] md:text-[20px] md:leading-[30px]">
              Page: Eligibility
            </h1>
            <div className="">
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
          <div className="flex flex-col gap-y-5 lg:gap-y-6.5">
            <SectionCard title="Hero Section">
              <div className="space-y-2">
                <FieldLabel>Hero title:</FieldLabel>
                <TextInput
                  value={heroTitle}
                  onChange={setHeroTitle}
                />
              </div>

              <div className="space-y-2 mt-2">
                <FieldLabel>Hero Description:</FieldLabel>
                <TextAreaInput
                  value={heroDescription}
                  onChange={setHeroDescription}
                  rows={4}
                />
              </div>
            </SectionCard>

            <SectionCard title="General Eligibility Criteria Section">
              <div className="flex flex-col gap-y-2">
                <FieldLabel>Section Title:</FieldLabel>
                <TextInput
                  value={sectionTitle}
                  onChange={setSectionTitle}
                />
              </div>
              <div className="w-full h-px bg-[#D1D5DC] mt-4 mb-4"></div>

              <div className="space-y-3">
                {points.map((point, index) => (
                  <div key={`${index}-${point}`} className="flex items-end gap-2">
                    <div className="flex flex-col gap-y-2 w-full">
                      <FieldLabel>{`Point ${index + 1}:`}</FieldLabel>
                      <TextInput
                        value={point}
                        onChange={(value) => updatePoint(index, value)}
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
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2563eb] transition hover:text-[#1d4ed8] mt-4 mb-4"
              >
                <Plus className="h-4 w-4" />
                Add More
              </button>
              <div className="w-full h-px bg-[#D1D5DC] mb-4"></div>
              <div className="flex flex-col gap-y-2">
                <FieldLabel>Reminder:</FieldLabel>
                <TextAreaInput
                  value={reminder}
                  onChange={setReminder}
                  rows={3}
                />
              </div>
            </SectionCard>

            <SectionCard title="BMI Qualification Section">
              <div className="flex flex-col gap-y-2">
                <FieldLabel>Section Title:</FieldLabel>
                <TextInput
                  value={bmiSectionTitle}
                  onChange={setBmiSectionTitle}
                />
              </div>

              <div className="flex flex-col gap-y-2 mt-2">
                <FieldLabel>BMI 27+:</FieldLabel>
                <TextInput value={bmi27Title} onChange={setBmi27Title} />
              </div>

              <div className="flex flex-col gap-y-2 mt-2">
                <FieldLabel>Description:</FieldLabel>
                <TextAreaInput
                  value={bmi27Description}
                  onChange={setBmi27Description}
                  rows={2}
                />
              </div>

              <div className="w-full h-px bg-[#D1D5DC] mb-4 mt-4" />

              <div className="flex flex-col gap-y-2">
                <FieldLabel>BMI 30+:</FieldLabel>
                <TextInput value={bmi30Title} onChange={setBmi30Title} />
              </div>

              <div className="flex flex-col gap-y-2 mt-2">
                <FieldLabel>Description:</FieldLabel>
                <TextAreaInput
                  value={bmi30Description}
                  onChange={setBmi30Description}
                  rows={2}
                />
              </div>
            </SectionCard>

            <SectionCard title="Weight Conditions Section">
              <div className="flex flex-col gap-y-2">
                <FieldLabel>Section Title:</FieldLabel>
                <TextInput
                  value={weightConditionsTitle}
                  onChange={setWeightConditionsTitle}
                />
              </div>
              <div className="w-full h-px bg-[#D1D5DC] mb-4 mt-4" />
              <div className="flex flex-col gap-y-2 ">
                <FieldLabel>Write Condition:</FieldLabel>
                <TextInput
                  value={newCondition}
                  onChange={setNewCondition}
                  placeholder="Write here..."
                />
              </div>

              <div className="flex flex-wrap gap-2 mt-2.5">
                {weightConditions.map((condition, index) => (
                  <div
                    key={`${condition}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[#1A5C8A1F/0.12] bg-[#EBEEF2] px-[18px] py-2.5"
                  >
                    <span className="font-['Quicksand'] text-[12px] leading-[16px] font-normal tracking-[0px] text-[#667085]">
                      {condition}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCondition(index)}
                      className="text-[#E7000B] transition hover:text-rose-600"
                      aria-label={`Remove ${condition}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* <button
                type="button"
                onClick={addCondition}
                className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[#2563eb] transition hover:text-[#1d4ed8]"
              >
                <Plus className="h-4 w-4" />
                Add Condition
              </button> */}
            </SectionCard>

            <SectionCard title="Contraindications Section">
              <div className="flex flex-col gap-y-2">
                <FieldLabel>Section Title:</FieldLabel>
                <TextInput
                  value={contraindicationsTitle}
                  onChange={setContraindicationsTitle}
                />
              </div>
              <div className="w-full h-px bg-[#D1D5DC] mb-4 mt-4" />
              <div className="flex flex-col gap-y-2">
                <FieldLabel>Write Contraindications:</FieldLabel>
                <TextInput
                  value={newContraindication}
                  onChange={setNewContraindication}
                  placeholder="Write here..."
                />
              </div>

              <div className="mt-2.5 flex flex-col gap-y-5">
                {contraindications.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex items-center gap-3"
                  >
                    <span className="font-['Quicksand'] text-[14px] leading-[20px] font-normal tracking-[0px] text-[#272628]">
                      {item}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeContraindication(index)}
                      className="shrink-0 text-[#E7000B] transition hover:text-rose-600"
                      aria-label={`Remove ${item}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* <button
                type="button"
                onClick={addContraindication}
                className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[#2563eb] transition hover:text-[#1d4ed8]"
              >
                <Plus className="h-4 w-4" />
                Add Contraindication
              </button> */}
            </SectionCard>

            <SectionCard title="Required Lab Work Section">
              <div className="flex flex-col gap-y-2">
                <FieldLabel>Section Title:</FieldLabel>
                <TextInput
                  value={requiredLabWorkTitle}
                  onChange={setRequiredLabWorkTitle}
                />
              </div>
              <div className="w-full h-px bg-[#D1D5DC] mb-2 mt-4" />
              <div className="flex flex-col gap-y-2">
                <FieldLabel>Write Contraindications:</FieldLabel>
                <TextInput
                  value={newLabWork}
                  onChange={setNewLabWork}
                  placeholder="Write here..."
                />
              </div>

              <div className="mt-2.5 flex flex-col gap-y-5">
                {requiredLabWorkItems.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex items-center gap-3"
                  >
                    <span className="font-['Quicksand'] text-[14px] leading-[20px] font-normal tracking-[0px] text-[#272628]">
                      {item}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeRequiredLabWork(index)}
                      className="shrink-0 text-[#E7000B] transition hover:text-rose-600"
                      aria-label={`Remove ${item}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* <button
                type="button"
                onClick={addRequiredLabWork}
                className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[#2563eb] transition hover:text-[#1d4ed8]"
              >
                <Plus className="h-4 w-4" />
                Add Required Lab Work
              </button> */}
            </SectionCard>

            <SectionCard title="Ongoing Monitoring Section">
              <div className="flex flex-col gap-y-2">
                <FieldLabel>Section Title:</FieldLabel>
                <TextInput
                  value={ongoingMonitoringTitle}
                  onChange={setOngoingMonitoringTitle}
                />
              </div>
              <div className="w-full h-px bg-[#D1D5DC] mb-2 mt-4" />
              <div className="flex flex-col gap-y-2">
                <FieldLabel>Write Contraindications:</FieldLabel>
                <TextInput
                  value={newOngoingMonitoring}
                  onChange={setNewOngoingMonitoring}
                  placeholder="Write here..."
                />
              </div>

              <div className="mt-2.5 flex flex-col gap-y-5">
                {ongoingMonitoringItems.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex items-center gap-3"
                  >
                    <span className="font-['Quicksand'] text-[14px] leading-[20px] font-normal tracking-[0px] text-[#272628]">
                      {item}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeOngoingMonitoring(index)}
                      className="shrink-0 text-[#E7000B] transition hover:text-rose-600"
                      aria-label={`Remove ${item}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Disclaimer Section">
              <div className="flex flex-col gap-y-2">
                <FieldLabel>Disclaimer Title:</FieldLabel>
                <TextInput
                  value={disclaimerTitle}
                  onChange={setDisclaimerTitle}
                />
              </div>

              <div className="flex flex-col gap-y-2 mt-2">
                <FieldLabel>Description:</FieldLabel>
                <TextAreaInput
                  value={disclaimerDescription}
                  onChange={setDisclaimerDescription}
                  rows={3}
                />
              </div>
            </SectionCard>

            <SectionCard title="FAQ’s Section">
              <div className="flex flex-col gap-y-2">
                <FieldLabel>Section Title:</FieldLabel>
                <TextInput
                  value={faqSectionTitle}
                  onChange={setFaqSectionTitle}
                />
              </div>

              <div className="w-full h-px bg-[#D1D5DC] mb-4 mt-4" />

              <div className="flex flex-col gap-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={`${index}-${faq.question}`}
                    className="rounded-[10px] border border-[#D1D5DC] p-3 md:p-4"
                  >
                    <div className="flex items-end gap-2">
                      <div className="flex-1 space-y-2">
                        <FieldLabel>Question:</FieldLabel>
                        <TextInput
                          value={faq.question}
                          onChange={(value) => updateFaq(index, "question", value)}
                          placeholder="Write..."
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-end gap-2">
                      <div className="flex-1 space-y-2">
                        <FieldLabel>Answer:</FieldLabel>
                        <TextAreaInput
                          value={faq.answer}
                          onChange={(value) => updateFaq(index, "answer", value)}
                          rows={2}
                          placeholder="Write..."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="mb-1 shrink-0 text-[#E7000B] transition hover:text-rose-600"
                        aria-label={`Remove FAQ ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addFaq}
                className="inline-flex w-fit items-center gap-1 text-sm font-medium text-[#2563eb] transition hover:text-[#1d4ed8] mt-4"
              >
                <Plus className="h-4 w-4" />
                Add More
              </button>
            </SectionCard>

            <SectionCard title="Bottom CTA Section:">
              <div className="flex flex-col gap-y-2">
                <FieldLabel>Section Title:</FieldLabel>
                <TextInput
                  value={bottomCtaTitle}
                  onChange={setBottomCtaTitle}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-2">
                <div className="flex flex-col gap-y-2">
                  <FieldLabel>CTA Button Text:</FieldLabel>
                  <TextInput
                    value={bottomCtaButtonText}
                    onChange={setBottomCtaButtonText}
                  />
                </div>

                <div className="flex flex-col gap-y-2">
                  <FieldLabel>URL:</FieldLabel>
                  <TextInput
                    value={bottomCtaUrl}
                    onChange={setBottomCtaUrl}
                  />
                </div>

                <div className="flex flex-col gap-y-2">
                  <FieldLabel>Button target:</FieldLabel>
                  <label className="mt-3 inline-flex items-center gap-3 font-['Quicksand'] text-[14px] leading-[20px] font-normal tracking-[0px] text-[#272628]">
                    <input
                      type="checkbox"
                      checked={bottomCtaNewTab}
                      onChange={(event) => setBottomCtaNewTab(event.target.checked)}
                      className="h-5 w-5 rounded border border-[#D1D5DC] text-[#1447E6] focus:ring-2 focus:ring-blue-100"
                    />
                    Blank (open in new tab)
                  </label>
                </div>
              </div>
            </SectionCard>
            <button
                type="submit"
                // disabled={updateProfile.isPending}
                className="flex items-center gap-2 px-6 py-2 bg-[#1447E6] w-fit text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {/* {updateProfile.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}  */}

                Save Changes
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
