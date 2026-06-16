import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { dummyAssessments } from "./data/assessmentTable";

// ── Dummy consultation data keyed by assessment id ─────────────────────────
const consultationData: Record<string, ConsultationData> = {
  asmnt_1: {
    patientName: "Alan Cattach",
    consultationId: "#001237",
    avatar: "AC",
    heroImage: "/images/ff0ed5953d764599150e436aa467be8281ce6ecc.png",
    heroCaption:
      "Weight loss is about more than diet and exercise alone. Weight Loss MD provides medical support to help you overcome these challenges.",
    weightGoal: "< 20 lbs",
    age: "26 years",
    height: "6 feet",
    weight: "220 lbs",
    bmi: "29.8 (Overweight)",
    bmiColor: "text-[#C0392B]",
    bmiBg: "bg-[#FAF0EE]",
    goals: [
      "Lose weight",
      "Improve my general physical health",
      "Increase confidence about my appearance",
    ],
    heartConditions: [
      "Atrial fibrillation or flutter",
      "Heart failure",
      "Heart disease, stroke, or peripheral vascular disease",
      "Hypertension (high blood pressure)",
    ],
    hormoneConditions: [
      "Multiple Endocrine Neoplasia syndrome type 2 (MEN2)",
      "Family history of thyroid cancer",
      "Type 2 Diabetes",
    ],
    gastrointestinalConditions: [
      "Pancreatitis",
      "GERD / Acid Reflux requiring insulin",
    ],
    additionalConditions: [
      "Chronic candidiasis (fungal infection)",
      "Eating disorder",
      "Metabolic syndrome",
    ],
    glp1Allergy: "No, I do not have an allergy to GLP-1 medication",
    glp1Recent:
      "No, I am not currently taking a GLP-1 medication in the past 30 days.",
    currentMedications: [
      "Insulin",
      "Diuretics such as (but not limited to) furosemide (Lasix), bumetanide (Bumex) Hydrochlorothiazide/HCTZ",
    ],
    otherMedications: "I don't take any medications",
    additionalInfo1: "No",
    additionalInfo2: "No",
    products: [
      {
        name: "Phentermine",
        detail: "Medium, Rare, Bone Marrow Butter",
        size: "Intro",
        price: "$48",
        image: "/images/a2224651025069a6bda773c9a4c36bb3ce2cc1d1.png",
      },
      {
        name: "Vitamin C Ascorbic Acid",
        detail: "Medium, Rare, Bone Marrow Butter",
        size: "2lb",
        price: "$48",
        image: "/images/a2224651025069a6bda773c9a4c36bb3ce2cc1d1.png",
      },
    ],
    subtotal: "$96.00",
    serviceDuration: "1 month",
    serviceFees: "$50.00",
    shippingCharge: "$20.00",
    discount: "- $15.00",
    total: "$151.00",
  },
};

// Fallback for any assessment without custom data
function buildFallback(id: string): ConsultationData {
  const row = dummyAssessments.find((r) => r.id === id);
  return {
    patientName: row?.patientName ?? "Unknown Patient",
    consultationId: `#${id.replace("asmnt_", "").padStart(6, "0")}`,
    avatar: row?.patientInitials ?? "??",
    heroImage: "/images/ff0ed5953d764599150e436aa467be8281ce6ecc.png",
    heroCaption: "Weight loss is about more than diet and exercise alone.",
    weightGoal: "< 20 lbs",
    age: "30 years",
    height: "5 feet 10 inches",
    weight: "200 lbs",
    bmi: "28.7 (Overweight)",
    bmiColor: "text-[#C0392B]",
    bmiBg: "bg-[#FAF0EE]",
    goals: ["Lose weight", "Improve overall health"],
    heartConditions: [],
    hormoneConditions: [],
    gastrointestinalConditions: [],
    additionalConditions: [],
    glp1Allergy: "No, I do not have an allergy to GLP-1 medication",
    glp1Recent:
      "No, I am not currently taking a GLP-1 medication in the past 30 days.",
    currentMedications: [],
    otherMedications: "I don't take any medications",
    additionalInfo1: "No",
    additionalInfo2: "No",
    products: [
      {
        name: "Phentermine",
        detail: "Medium, Rare, Bone Marrow Butter",
        size: "Intro",
        price: "$48",
        image: "/images/a2224651025069a6bda773c9a4c36bb3ce2cc1d1.png",
      },
    ],
    subtotal: "$48.00",
    serviceDuration: "1 month",
    serviceFees: "$50.00",
    shippingCharge: "$20.00",
    discount: "- $0.00",
    total: "$118.00",
  };
}

interface Product {
  name: string;
  detail: string;
  size: string;
  price: string;
  image: string;
}

interface ConsultationData {
  patientName: string;
  consultationId: string;
  avatar: string;
  heroImage: string;
  heroCaption: string;
  weightGoal: string;
  age: string;
  height: string;
  weight: string;
  bmi: string;
  bmiColor: string;
  bmiBg: string;
  goals: string[];
  heartConditions: string[];
  hormoneConditions: string[];
  gastrointestinalConditions: string[];
  additionalConditions: string[];
  glp1Allergy: string;
  glp1Recent: string;
  currentMedications: string[];
  otherMedications: string;
  additionalInfo1: string;
  additionalInfo2: string;
  products: Product[];
  subtotal: string;
  serviceDuration: string;
  serviceFees: string;
  shippingCharge: string;
  discount: string;
  total: string;
}

// ── Sub-components ──────────────────────────────────────────────────────────

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3">
      {children}
    </div>
  );
}

function Question({ text }: { text: string }) {
  return <p className="text-sm font-semibold text-slate-800">{text}</p>;
}

function RadioAnswer({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-4 h-4 rounded-full border-2 border-[#1447E6] flex items-center justify-center shrink-0">
        <div className="w-2 h-2 rounded-full bg-[#1447E6]" />
      </div>
      <span className="text-sm text-slate-600">{text}</span>
    </div>
  );
}

function CheckboxAnswer({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-4 h-4 rounded bg-[#1447E6] flex items-center justify-center shrink-0">
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-sm text-slate-600">{text}</span>
    </div>
  );
}

function GrayCheckbox({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5 py-2 border border-[#E5E7EB] rounded-lg px-4">
      <div className="w-4 h-4 rounded border border-gray-300 bg-gray-100 shrink-0" />
      <span className="text-sm text-slate-600">{text}</span>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function PreviewDetailsPage() {
  const { assessmentId } = useParams({
    from: "/dashboard/assessment-table/$assessmentId/preview",
  });
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const data = consultationData[assessmentId] ?? buildFallback(assessmentId);

  const handleSubmit = () => {
    setSubmitted(true);
    // Navigate back to assessment table after a brief success flash
    setTimeout(() => {
      navigate({ to: "/dashboard/assessment-table" });
    }, 1800);
  };

  const handleCancel = () => {
    navigate({ to: "/dashboard/assessment-table" });
  };

  const handleEdit = () => {
    navigate({ to: "/dashboard/assessment-table" });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <CheckCircle2 size={56} className="text-green-500" />
        <h2 className="text-xl font-bold text-slate-800">
          Submitted for Medical Review
        </h2>
        <p className="text-sm text-slate-500">
          Redirecting back to assessments…
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate({ to: "/dashboard/assessment-table" })}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Assessments
      </button>

      <h1 className="text-xl font-bold text-slate-800 mb-6">Preview details</h1>

      <div className="space-y-4">
        {/* Patient Header Card */}
        <SectionCard>
          <div className="flex items-center gap-3 mb-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-white">
                {data.avatar}
              </span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">
                Patient: {data.patientName}
              </p>
              <p className="text-xs text-slate-400">
                Consultation id: {data.consultationId}
              </p>
            </div>
          </div>
          {/* Hero Image */}
          <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-100">
            <img
              src={data.heroImage}
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">{data.heroCaption}</p>
        </SectionCard>

        {/* Weight goal */}
        <SectionCard>
          <Question text="How much weight are you looking to lose?" />
          <RadioAnswer text={data.weightGoal} />
        </SectionCard>

        {/* Age / height / weight */}
        <SectionCard>
          <Question text="What is your age, current weight & height?" />
          <div className="space-y-1 text-sm text-slate-600">
            <div className="flex gap-2">
              <span className="text-slate-400 w-16">Age</span>
              <span>{data.age}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-400 w-16">Height:</span>
              <span>{data.height}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-slate-400 w-16">Weight:</span>
              <span>{data.weight}</span>
            </div>
          </div>
          <div className={`${data.bmiBg} rounded-lg px-4 py-2.5 mt-1`}>
            <p className="text-xs font-semibold text-slate-700">
              Health Snapshot:
            </p>
            <p className={`text-sm font-semibold ${data.bmiColor}`}>
              BMI: {data.bmi}
            </p>
          </div>
        </SectionCard>

        {/* Goals */}
        {data.goals.length > 0 && (
          <SectionCard>
            <Question text="What do you want to accomplish with the Weight Loss MD Body Program I want to…" />
            <div className="space-y-2">
              {data.goals.map((g) => (
                <CheckboxAnswer key={g} text={g} />
              ))}
            </div>
          </SectionCard>
        )}

        {/* Heart conditions */}
        {data.heartConditions.length > 0 && (
          <SectionCard>
            <Question text="Do you currently have, or have you ever been diagnosed with, any of the following heart or heart-related conditions?" />
            <div className="space-y-2">
              {data.heartConditions.map((c) => (
                <CheckboxAnswer key={c} text={c} />
              ))}
            </div>
          </SectionCard>
        )}

        {/* Hormone conditions */}
        {data.hormoneConditions.length > 0 && (
          <SectionCard>
            <Question text="Do you currently have, or have you ever been diagnosed with, any of these hormone, kidney, or liver conditions?" />
            <div className="space-y-2">
              {data.hormoneConditions.map((c) => (
                <CheckboxAnswer key={c} text={c} />
              ))}
            </div>
          </SectionCard>
        )}

        {/* GI conditions */}
        {data.gastrointestinalConditions.length > 0 && (
          <SectionCard>
            <Question text="Do you currently have, or have history of, any of these gastrointestinal conditions or procedures?" />
            <div className="space-y-2">
              {data.gastrointestinalConditions.map((c) => (
                <CheckboxAnswer key={c} text={c} />
              ))}
            </div>
          </SectionCard>
        )}

        {/* Additional conditions */}
        {data.additionalConditions.length > 0 && (
          <SectionCard>
            <Question text="Do you currently have, or have you ever been diagnosed with, any of these additional following conditions?" />
            <div className="space-y-2">
              {data.additionalConditions.map((c) => (
                <CheckboxAnswer key={c} text={c} />
              ))}
            </div>
          </SectionCard>
        )}

        {/* GLP-1 allergy */}
        <SectionCard>
          <Question text="Do you have an ALLERGY to GLP-1 agonist medications?" />
          <RadioAnswer text={data.glp1Allergy} />
        </SectionCard>

        {/* GLP-1 recent */}
        <SectionCard>
          <Question text="Are you currently taking a GLP-1 medication in the past 30 days?" />
          <RadioAnswer text={data.glp1Recent} />
        </SectionCard>

        {/* Current medications */}
        {data.currentMedications.length > 0 && (
          <SectionCard>
            <Question text="Do you currently take any of the following medications?" />
            <div className="space-y-2">
              {data.currentMedications.map((m) => (
                <CheckboxAnswer key={m} text={m} />
              ))}
            </div>
          </SectionCard>
        )}

        {/* Other medications */}
        <SectionCard>
          <Question text="Do you take any medications?" />
          <RadioAnswer text={data.otherMedications} />
        </SectionCard>

        {/* Additional info 1 */}
        <SectionCard>
          <Question text="Is there anything else you want your healthcare provider to know about your health?" />
          <RadioAnswer text={data.additionalInfo1} />
        </SectionCard>

        {/* Additional info 2 */}
        <SectionCard>
          <Question text="Is there anything else you want your healthcare provider to know about your health?" />
          <RadioAnswer text={data.additionalInfo2} />
        </SectionCard>

        {/* Compliance Confirmation */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
            <p className="text-sm font-semibold text-slate-800">
              Compliance Confirmation:
            </p>
          </div>
          <GrayCheckbox text="I have reviewed and agree to the Terms of Service and Privacy Policy." />
          <GrayCheckbox text="I certify that all information provided is accurate and complete." />
          <GrayCheckbox text="I understand that providing false or misleading information may result in denial of treatment." />
          <GrayCheckbox text="I understand that treatment recommendations are based on the information I have provided." />
          <GrayCheckbox text="I understand that additional information may be requested before treatment is approved" />
        </div>

        {/* Payment Summary */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <p className="font-semibold text-slate-800 mb-1">Payment Summery</p>
          <p className="text-xs text-slate-500 mb-4">
            Patient selected{" "}
            {data.products.length === 1 ? "one product" : "two products"}:
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Product list */}
            <div className="flex-1 space-y-3">
              {data.products.map((p) => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#2A2D31] rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-slate-400">{p.detail}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#1447E6] text-white text-[10px] rounded-full font-medium">
                      {p.size}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[#1447E6] shrink-0">
                    {p.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="sm:w-52 space-y-2 text-sm border-t sm:border-t-0 sm:border-l border-[#E5E7EB] sm:pl-6 pt-4 sm:pt-0">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{data.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Service Duration</span>
                <span>{data.serviceDuration}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Service Fees</span>
                <span>{data.serviceFees}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping charge</span>
                <span>{data.shippingCharge}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Discount</span>
                <span className="text-red-500">{data.discount}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800 border-t border-[#E5E7EB] pt-2 mt-1">
                <span>Total</span>
                <span className="text-[#1447E6]">{data.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2 pb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 bg-[#1447E6] hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Submit for medical review
            </button>
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 border border-[#E5E7EB] text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
          <button
            onClick={handleEdit}
            className="px-5 py-2.5 border border-[#E5E7EB] text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            Edit before submitting
          </button>
        </div>
      </div>
    </div>
  );
}
