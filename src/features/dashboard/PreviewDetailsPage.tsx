import { useParams, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAssessmentDetails } from "@/api/endpoints/dashboard/assessments";
import type { ReactNode } from "react";

// --- Sub-components ---

function SectionCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-4 sm:p-6 md:p-[30px] ${className}`}
    >
      {children}
    </div>
  );
}

function Question({ text }: { text?: string | null }) {
  if (!text) return null;
  return <p className="text-[18px] md:text-[24px] font-[700] text-[#272628] font-['Quicksand'] leading-snug sm:leading-none">{text}</p>;
}

function RadioAnswer({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-4 h-4 rounded-full border-2 border-[#1447E6] flex items-center justify-center shrink-0">
        <div className="w-2 h-2 rounded-full bg-[#1447E6]" />
      </div>
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}

function CheckboxAnswer({ label }: { label: string }) {
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
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}

function GrayCheckbox({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5 py-2 border border-[#E5E7EB] rounded-lg px-4 bg-slate-50">
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

// --- Health Vitals Parser ---
function HealthVitalsDisplay({ text }: { text: string }) {
  const parts = text.split(",").map((s) => s.trim());
  let age = parts[0] || "N/A";
  let height = parts[1] || "N/A";
  let weight = parts[2] || "N/A";

  let bmiStr = "";
  let bmiCategory = "";
  let isOverweight = false;

  try {
    let w = parseFloat(weight.replace(/[^0-9.]/g, ""));
    let hInches = 0;
    
    // Parse height (e.g. "5'8", "6 feet", "68")
    if (height.includes("'")) {
      const hParts = height.split("'");
      const feet = parseFloat(hParts[0] || "0");
      const inches = parseFloat(hParts[1]?.replace(/[^0-9.]/g, "") || "0");
      hInches = feet * 12 + inches;
    } else if (
      height.toLowerCase().includes("feet") ||
      height.toLowerCase().includes("ft")
    ) {
      const feet = parseFloat(height.replace(/[^0-9.]/g, ""));
      hInches = feet * 12;
    } else {
      const num = parseFloat(height.replace(/[^0-9.]/g, ""));
      if (num < 10) hInches = num * 12; // e.g. "6"
      else hInches = num; // e.g. "72"
    }

    if (w > 0 && hInches > 0) {
      const bmi = (w * 703) / (hInches * hInches);
      bmiStr = bmi.toFixed(1);
      if (bmi < 18.5) {
        bmiCategory = "Underweight";
      } else if (bmi < 25) {
        bmiCategory = "Normal weight";
      } else if (bmi < 30) {
        bmiCategory = "Overweight";
        isOverweight = true;
      } else {
        bmiCategory = "Obese";
        isOverweight = true;
      }
    }
  } catch (e) {
    // Ignore parse errors
  }

  const formatUnit = (val: string, unit: string) => {
    if (val === "N/A") return val;
    if (val.toLowerCase().includes(unit.toLowerCase().substring(0, 2))) return val;
    return `${val} ${unit}`;
  };

  return (
    <div className="w-full">
      <table className="w-full text-sm text-slate-700 mb-4">
        <tbody>
          <tr>
            <td className="py-2 w-24 text-slate-500">Age:</td>
            <td className="py-2 font-medium">{formatUnit(age, "years")}</td>
          </tr>
          <tr>
            <td className="py-2 text-slate-500">Height:</td>
            <td className="py-2 font-medium">{height}</td>
          </tr>
          <tr>
            <td className="py-2 text-slate-500">Weight:</td>
            <td className="py-2 font-medium">{formatUnit(weight, "lbs")}</td>
          </tr>
        </tbody>
      </table>

      {bmiStr && (
        <div
          className={`p-4 rounded-lg ${
            isOverweight ? "bg-[#FDE8E8]" : "bg-[#E6F4EA]"
          }`}
        >
          <p className="text-xs font-semibold text-slate-800 mb-1">
            Health Snapshot:
          </p>
          <p
            className={`text-sm font-medium ${
              isOverweight ? "text-[#E02424]" : "text-[#137333]"
            }`}
          >
            BMI: {bmiStr} ({bmiCategory})
          </p>
        </div>
      )}
    </div>
  );
}

// --- Helper to render dynamic questions ---
function RenderQuestion({
  question,
  isSubQuestion = false,
}: {
  question: any;
  isSubQuestion?: boolean;
}) {
  // Skip if it's just info only with no patient answer needed
  if (question.type === "INFORMATION_ONLY") {
    return (
      <div
        className={isSubQuestion ? "mt-4 pl-4 border-l-2 border-slate-200" : ""}
      >
        {!isSubQuestion ? (
          <SectionCard key={question.id}>
            {question.heading && (
              <p className="text-xs text-slate-500 font-medium mb-1">
                {question.heading}
              </p>
            )}
            <Question text={question.questionText} />
            {question.description && (
              <p className="text-xs text-slate-500">{question.description}</p>
            )}
          </SectionCard>
        ) : (
          <div key={question.id}>
            {question.heading && (
              <p className="text-xs text-slate-500 font-medium mb-1">
                {question.heading}
              </p>
            )}
            <Question text={question.questionText} />
            {question.description && (
              <p className="text-xs text-slate-500">{question.description}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  const isSingleChoice =
    question.type === "SINGLE_CHOICE" ||
    question.type === "RADIO" ||
    question.type === "YES_NO";
  const hasOptions =
    question.patientAnswer?.selectedOptions &&
    question.patientAnswer.selectedOptions.length > 0;
  const hasTextResponse = !!question.patientAnswer?.textResponse;

  // Handle file URL parsing (it can be an object with fileUrl or a direct string)
  let fileUrl = "";
  let fileName = "View attached file";
  let isImage = false;

  if (question.patientAnswer?.file) {
    if (
      typeof question.patientAnswer.file === "object" &&
      question.patientAnswer.file.fileUrl
    ) {
      fileUrl = question.patientAnswer.file.fileUrl;
      fileName = question.patientAnswer.file.fileName || fileName;
      if (
        question.patientAnswer.file.fileType?.startsWith("image/") ||
        /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(fileName) ||
        /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(fileUrl)
      ) {
        isImage = true;
      }
    } else if (typeof question.patientAnswer.file === "string") {
      fileUrl = question.patientAnswer.file.replace(/`/g, "");
      if (/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(fileUrl)) {
        isImage = true;
      }
    }
  }

  const content = (
    <div key={question.id}>
      {question.heading && (
        <p className="text-xs text-slate-500 font-medium mb-1">
          {question.heading}
        </p>
      )}
      <Question text={question.questionText} />
      {question.description && (
        <p className="text-xs text-slate-500">{question.description}</p>
      )}

      <div className="space-y-2 mt-4">
        {/* Text Response */}
        {hasTextResponse &&
          (question.questionText
            ?.toLowerCase()
            .includes("age, current weight & height") ? (
            <HealthVitalsDisplay text={question.patientAnswer?.textResponse} />
          ) : (
            <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">
              {question.patientAnswer?.textResponse}
            </div>
          ))}
        {/* File Attachment - Show if present */}
        {fileUrl && (
          <div className="mt-3">
            {isImage ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="block w-full max-w-[320px] rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group relative bg-white"
              >
                <div className="h-44 bg-slate-50/80 flex items-center justify-center relative overflow-hidden p-3">
                  <img
                    src={fileUrl}
                    alt={fileName}
                    className="w-full h-full object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors flex items-center justify-center">
                    <div className="bg-white/95 text-slate-800 text-[11px] font-semibold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-sm backdrop-blur-sm">
                      Click to expand
                    </div>
                  </div>
                </div>
                <div className="px-3 py-2.5 flex items-center justify-between gap-3 border-t border-slate-100 bg-white">
                  <span className="text-xs font-medium text-slate-700 truncate">
                    {fileName}
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-slate-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
              </a>
            ) : (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 p-2.5 pr-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm transition-all max-w-[280px] group outline-none"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-600 flex items-center justify-center shrink-0 transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700 truncate flex-1">
                  {fileName}
                </span>
              </a>
            )}
          </div>
        )}
        {/* Selected Options (Checkboxes/Radio) */}
        {hasOptions && (
          <div className="space-y-4">
            {question.patientAnswer?.selectedOptions.map(
              (opt: any, idx: number) => {
                const displayLabel = opt.label || opt.id || "Unknown";

                // Find the original option to check for subQuestions
                const originalOption = question.options?.find(
                  (o: any) => o.id === opt.id,
                );
                const subQuestions = originalOption?.subQuestions || [];

                return (
                  <div key={idx} className="space-y-3">
                    {isSingleChoice ? (
                      <RadioAnswer label={displayLabel} />
                    ) : (
                      <CheckboxAnswer label={displayLabel} />
                    )}

                    {/* Recursively render sub-questions if they exist */}
                    {subQuestions.length > 0 && (
                      <div className="ml-6 space-y-4">
                        {subQuestions.map((subQ: any) => (
                          <RenderQuestion
                            key={subQ.id}
                            question={subQ}
                            isSubQuestion={true}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={isSubQuestion ? "pl-4 border-l-2 border-slate-200" : ""}>
      {isSubQuestion ? content : <SectionCard>{content}</SectionCard>}
    </div>
  );
}

// --- Main Page ---
export default function PreviewDetailsPage() {
  const { assessmentId } = useParams({
    from: "/dashboard/assessment-table/$assessmentId/preview",
  });
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["assessment-details", assessmentId],
    queryFn: () => getAssessmentDetails(assessmentId),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1447E6]"></div>
        <p className="text-sm text-slate-500">Loading details...</p>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <p className="text-lg font-semibold text-red-600">
          Failed to load details
        </p>
        <p className="text-sm text-slate-500">Please try again</p>
        <button
          onClick={() => navigate({ to: "/dashboard/assessment-table" })}
          className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
        >
          Back to Assessments
        </button>
      </div>
    );
  }

  const details = data.data;
  const statusDisplay = (details?.status || "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
  const isRejected =
    details?.status === "REJECTED" || details?.status === "DECLINED";

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const complianceChecks = [
    "I have reviewed and agree to the Terms of Service and Privacy Policy.",
    "I certify that all information provided is accurate and complete.",
    "I understand that providing false or misleading information may result in denial of treatment.",
    "I understand that treatment recommendations are based on the information I have provided.",
    "I understand that additional information may be requested before treatment is approved.",
  ];

  const pName =
    details.patient?.name ||
    details.patientName ||
    sessionStorage.getItem("currentPatientName") ||
    "Unknown Patient";
  const pImage =
    details.patient?.image ||
    details.patientImage ||
    sessionStorage.getItem("currentPatientImage") ||
    null;
  const pInitials =
    pName
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "??";

  // Extract any INFORMATION_ONLY questions that might be intended for the header
  const headerInfoQuestions: any[] = [];
  const remainingQuestions: any[] = [];
  let foundSubtitleInApi = false;

  (details.questions || []).forEach((q: any) => {
    if (
      q.type === "INFORMATION_ONLY" &&
      (q.questionText?.includes("Weight loss is about") ||
        q.description?.includes("Weight loss is about"))
    ) {
      headerInfoQuestions.push(q);
      foundSubtitleInApi = true;
    } else {
      remainingQuestions.push(q);
    }
  });

  return (
    <div className="w-full mx-auto px-4 py-8 bg-[#FFFFFF] min-h-screen">
      {/* Back button */}
      <button
        onClick={() => navigate({ to: "/dashboard/assessment-table" })}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Assessments
      </button>

      <div className="space-y-[20px]">
        {/* Patient Header Card */}
        <SectionCard>
          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 sm:w-[50px] sm:h-[50px] rounded-full bg-blue-100 flex items-center justify-center shrink-0 overflow-hidden">
                {pImage ? (
                  <img
                    src={pImage}
                    alt={pName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm sm:text-base font-medium text-blue-700">
                    {pInitials}
                  </span>
                )}
              </div>
              <div>
                <p className="text-[20px] sm:text-[24px] font-semibold text-[#272628] font-['Quicksand'] leading-tight mb-2">
                  Patient: {pName}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 text-[15px] sm:text-[20px] font-normal text-[#272628] font-['Quicksand'] leading-tight">
                  <p>Consultation id: {details.submissionCode}</p>
                  <p>
                    Submitted:{" "}
                    {(details as any).submittedAt || (details as any).createdAt
                      ? new Date(
                          (details as any).submittedAt || (details as any).createdAt
                        )
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                          .replace(/ (\d{4})$/, ", $1")
                      : "18 May, 2026"}
                  </p>
                </div>
                {details.reviewedBy && (
                  <p className="text-[14px] sm:text-[16px] text-slate-500 mt-2 font-['Quicksand']">
                    Reviewed by: {details.reviewedBy.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                {details.assessment.category}
              </span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  isRejected
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : details.status === "APPROVED"
                      ? "bg-green-50 text-green-600 border border-green-100"
                      : "bg-orange-50 text-orange-600 border border-orange-100"
                }`}
              >
                {statusDisplay}
              </span>
            </div>
          </div>

          {/* Hero Image */}
          {details.assessment.thumbnail && (
            <div className="w-full mt-[28px] mb-[28px] rounded-xl overflow-hidden border border-slate-100">
              <img
                src={details.assessment.thumbnail.replace(/`/g, "")}
                alt={details.assessment.title}
                className="w-full h-auto object-cover max-h-[600px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
          <p className="text-sm text-slate-500">
            {details.assessment.title}
          </p>
          {(details.assessment as any).description && (
            <p className="text-[16px] sm:text-[20px] font-normal text-[#2B2922] font-['Quicksand'] leading-snug sm:leading-[30px] mt-3 sm:mt-[20px]">
              {(details.assessment as any).description}
            </p>
          )}
          {(details.assessment as any).subtitle && (
            <p className="text-[16px] sm:text-[20px] font-normal text-[#2B2922] font-['Quicksand'] leading-snug sm:leading-[30px] mt-3 sm:mt-[20px]">
              {(details.assessment as any).subtitle}
            </p>
          )}
          
          {/* Fallback hardcoded subtitle if API doesn't provide it */}
          {!foundSubtitleInApi && details.assessment.title?.includes("Weight Loss") && (
            <p className="text-[16px] sm:text-[20px] font-normal text-[#2B2922] font-['Quicksand'] leading-snug sm:leading-[30px] mt-3 sm:mt-[20px]">
              Weight loss is about more than diet and exercise alone. Weight Loss MD provides medical support to help you overcome these challenges.
            </p>
          )}

          {headerInfoQuestions.map((q) => (
            <div key={q.id} className="mt-3 sm:mt-[20px]">
              {q.heading && (
                <p className="text-[18px] sm:text-[20px] font-semibold text-[#2B2922] font-['Quicksand'] leading-snug sm:leading-[30px] mb-2">
                  {q.heading}
                </p>
              )}
              {q.questionText && (
                <p className="text-[16px] sm:text-[20px] font-normal text-[#2B2922] font-['Quicksand'] leading-snug sm:leading-[30px]">
                  {q.questionText}
                </p>
              )}
              {q.description && (
                <p className="text-[16px] sm:text-[20px] font-normal text-[#2B2922] font-['Quicksand'] leading-snug sm:leading-[30px] mt-2">
                  {q.description}
                </p>
              )}
            </div>
          ))}
        </SectionCard>

        {/* Render all dynamic questions */}
        {remainingQuestions.map((q) => (
          <RenderQuestion key={q.id} question={q} />
        ))}

        {/* Compliance Confirmation */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-4 sm:p-6 md:p-[30px] space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-slate-800">
              Compliance Confirmation
            </p>
          </div>
          {complianceChecks.map((check, i) => (
            <GrayCheckbox key={i} text={check} />
          ))}
        </div>

        {/* Payment Summary */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-4 sm:p-6 md:p-[30px] space-y-4">
          <p className="font-semibold text-slate-800 mb-1">Payment Summary</p>
          <p className="text-xs text-slate-500 mb-4">
            Patient selected{" "}
            {details.paymentSummary.products.length === 1
              ? "one product"
              : `${details.paymentSummary.products.length} products`}
            :
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Product list */}
            <div className="flex-1 space-y-3">
              {details.paymentSummary.products.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#2A2D31] rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={p.image.replace(/`/g, "")}
                      alt={p.name}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">
                      {p.name}
                    </p>
                    {p.size && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#1447E6] text-white text-[10px] rounded-full font-medium">
                        {p.size}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-[#1447E6] shrink-0">
                    {formatCurrency(p.price)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="sm:w-52 space-y-2 text-sm border-t sm:border-t-0 sm:border-l border-[#E5E7EB] sm:pl-6 pt-4 sm:pt-0">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(details.paymentSummary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Service Duration</span>
                <span>{details.paymentSummary.serviceDuration}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Service Fees</span>
                <span>
                  {formatCurrency(details.paymentSummary.serviceFees)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping charge</span>
                <span>
                  {formatCurrency(details.paymentSummary.shippingCharge)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Discount</span>
                <span
                  className={
                    details.paymentSummary.discount > 0 ? "text-red-500" : ""
                  }
                >
                  {details.paymentSummary.discount > 0
                    ? `- ${formatCurrency(details.paymentSummary.discount)}`
                    : formatCurrency(details.paymentSummary.discount)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-slate-800 border-t border-[#E5E7EB] pt-2 mt-1">
                <span>Total</span>
                <span className="text-[#1447E6]">
                  {formatCurrency(details.paymentSummary.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Decline Reason (if doctorNotes exist) */}
        {details.doctorNotes && (
          <div className="bg-[#FFF8EB] border border-[#FEE685] rounded-[10px] p-[14px] flex flex-col gap-[14px]">
            <p className="font-semibold text-[#D97706] text-base">
              Assessment Decline Reason:
            </p>
            <div className="flex justify-between items-center text-sm text-[#B45309]">
              {details.reviewedBy ? (
                <span>Reviewed by: {details.reviewedBy.name}</span>
              ) : (
                <span />
              )}
              {(details as any).updatedAt && (
                <span>
                  Decline Date: {new Date((details as any).updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <p className="text-sm text-[#92400E] whitespace-pre-wrap">
              {details.doctorNotes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
