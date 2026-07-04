import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import {
  getHeroSectionByPage,
  updateHeroSection,
} from "@/api/endpoints/hero-section.api";
import {
  getCtaSections,
  updateCtaSection,
} from "@/api/endpoints/cta-section.api";
import {
  getEligibilityContent,
  updateEligibilityContent,
} from "@/api/endpoints/eligiblity.api";
import { BmiQualificationSectionForm } from "./components/eligibility/BmiQualificationSectionForm";
import { BottomCtaSectionForm } from "./components/eligibility/BottomCtaSectionForm";
import { DisclaimerSectionForm } from "./components/eligibility/DisclaimerSectionForm";
import { FaqSectionForm } from "./components/eligibility/FaqSectionForm";
import { GeneralEligibilitySectionForm } from "./components/eligibility/GeneralEligibilitySectionForm";
import { HeroSectionForm } from "./components/eligibility/HeroSectionForm";
import { SimpleListSectionForm } from "./components/eligibility/SimpleListSectionForm";
import type { EligibilityFaqItem } from "./components/eligibility/types";
import { WeightConditionsSectionForm } from "./components/eligibility/WeightConditionsSectionForm";

const DEFAULT_POINTS = [
  "No history of MTC or MEN2 syndrome (for GLP-1 medications)",
  "BMI Ã¢â€°Â¥ 27 with at least one weight-related condition, or BMI Ã¢â€°Â¥ 30",
  "No active eating disorders",
  "Not pregnant, breastfeeding, or planning pregnancy",
  "Age 18 or older",
  "Willing to complete required monitoring",
];

export default function EligibilityPage() {
  const PAGE_TYPE = "Eligiblity";
  const queryClient = useQueryClient();
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
    "Severe renal impairment (eGFR < 30 mL/min/1.73 mÃ‚Â²)",
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
  const [faqs, setFaqs] = useState<EligibilityFaqItem[]>([
    {
      question: "How is BMI calculated?",
      answer:
        "BMI is weight (kg) ÃƒÂ· height (mÃ‚Â²). You can use our free BMI calculator during your assessment. Providers may also consider waist circumference and body composition.",
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
  const [heroId, setHeroId] = useState("");
  const [ctaId, setCtaId] = useState("");
  const [isHeroInitialized, setIsHeroInitialized] = useState(false);
  const [isCtaInitialized, setIsCtaInitialized] = useState(false);
  const [isEligibilityInitialized, setIsEligibilityInitialized] = useState(false);

  const ELIGIBILITY_HERO_QUERY_KEY = ["eligibility-hero-section"];
  const ELIGIBILITY_CTA_QUERY_KEY = ["eligibility-cta-section"];
  const ELIGIBILITY_CONTENT_QUERY_KEY = ["eligibility-content"];

  const { data: heroData, refetch: refetchHeroData } = useQuery({
    queryKey: ELIGIBILITY_HERO_QUERY_KEY,
    queryFn: () => getHeroSectionByPage(PAGE_TYPE),
    staleTime: 5 * 60 * 1000,
  });

  const { data: ctaData, refetch: refetchCtaData } = useQuery({
    queryKey: ELIGIBILITY_CTA_QUERY_KEY,
    queryFn: () => getCtaSections(PAGE_TYPE),
    staleTime: 5 * 60 * 1000,
  });

  const { data: eligibilityContentData, refetch: refetchEligibilityContent } =
    useQuery({
      queryKey: ELIGIBILITY_CONTENT_QUERY_KEY,
      queryFn: getEligibilityContent,
      staleTime: 5 * 60 * 1000,
    });

  useEffect(() => {
    if (!heroData || isHeroInitialized) return;

    const hero = Array.isArray(heroData) ? heroData[0] : heroData;
    if (!hero) return;

    setHeroId(hero.id || "");
    setHeroTitle(hero.title || "");
    setHeroDescription(hero.description || "");
    setIsHeroInitialized(true);
  }, [heroData, isHeroInitialized]);

  useEffect(() => {
    if (!ctaData?.data || isCtaInitialized) return;

    const cta = Array.isArray(ctaData.data) ? ctaData.data[0] : ctaData.data;
    if (!cta) return;

    setCtaId(cta.id || "");
    setBottomCtaTitle(cta.sectionTitle || "");
    setBottomCtaButtonText(cta.ctaButtonText || "");
    setBottomCtaUrl(cta.url || "");
    setBottomCtaNewTab(cta.openInNewTab ?? true);
    setIsCtaInitialized(true);
  }, [ctaData, isCtaInitialized]);

  useEffect(() => {
    if (!eligibilityContentData?.data || isEligibilityInitialized) return;

    const eligibility = eligibilityContentData.data;

    setSectionTitle(eligibility.generalTitle || "");
    setPoints(
      eligibility.generalPoints?.length
        ? eligibility.generalPoints.map((item) => item.point || "")
        : [""]
    );
    setReminder(eligibility.generalBottomDesc || "");
    setBmiSectionTitle(eligibility.qualificationTitle || "");
    setBmi27Title(eligibility.qualificationbmi27Text || "");
    setBmi27Description(eligibility.qualification27Description || "");
    setBmi30Title(eligibility.qualificationbmi30Text || "");
    setBmi30Description(eligibility.qualification30Description || "");
    setWeightConditionsTitle(eligibility.weightConditionSecTitle || "");
    setWeightConditions(eligibility.weightConditions || []);
    setContraindicationsTitle(eligibility.contraindicationsSectionTitle || "");
    setContraindications(eligibility.contraindicationsSectionWrite || []);
    setRequiredLabWorkTitle(eligibility.requiredlabWorkSectionTitle || "");
    setRequiredLabWorkItems(
      eligibility.requiredlabWorkSectionContraindications || []
    );
    setOngoingMonitoringTitle(eligibility.ongoingMonitoringSectionTitle || "");
    setOngoingMonitoringItems(
      eligibility.ongoingMonitoringSectionContraindication || []
    );
    setDisclaimerTitle(eligibility.disclaimerSectionTitle || "");
    setDisclaimerDescription(eligibility.disclaimerSectionDes || "");
    setFaqSectionTitle(eligibility.faqTitle || "");
    setFaqs(eligibility.faqs || []);
    setIsEligibilityInitialized(true);
  }, [eligibilityContentData, isEligibilityInitialized]);

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

  const addCondition = () => {
    const value = newCondition.trim();
    if (!value) return;

    setWeightConditions((current) => [...current, value]);
    setNewCondition("");
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

  const addContraindication = () => {
    const value = newContraindication.trim();
    if (!value) return;

    setContraindications((current) => [...current, value]);
    setNewContraindication("");
  };

  const removeRequiredLabWork = (index: number) => {
    setRequiredLabWorkItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const addRequiredLabWork = () => {
    const value = newLabWork.trim();
    if (!value) return;

    setRequiredLabWorkItems((current) => [...current, value]);
    setNewLabWork("");
  };

  const removeOngoingMonitoring = (index: number) => {
    setOngoingMonitoringItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const addOngoingMonitoring = () => {
    const value = newOngoingMonitoring.trim();
    if (!value) return;

    setOngoingMonitoringItems((current) => [...current, value]);
    setNewOngoingMonitoring("");
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

  const saveMutation = useMutation({
    mutationFn: async () => {
      const promises: Promise<unknown>[] = [];

      if (heroId) {
        promises.push(
          updateHeroSection(heroId, {
            page: PAGE_TYPE,
            title: heroTitle,
            description: heroDescription,
          })
        );
      }

      if (ctaId) {
        promises.push(
          updateCtaSection(ctaId, {
            page: PAGE_TYPE,
            sectionTitle: bottomCtaTitle,
            ctaButtonText: bottomCtaButtonText,
            url: bottomCtaUrl,
            openInNewTab: bottomCtaNewTab,
            categoryId: null,
          })
        );
      }

      promises.push(
        updateEligibilityContent({
          generalTitle: sectionTitle,
          generalPoints: points.map((point) => ({
            point,
            status: true,
          })),
          generalBottomDesc: reminder,
          qualificationTitle: bmiSectionTitle,
          qualificationbmi27Text: bmi27Title,
          qualification27Description: bmi27Description,
          qualificationbmi30Text: bmi30Title,
          qualification30Description: bmi30Description,
          weightConditionSecTitle: weightConditionsTitle,
          weightConditions,
          contraindicationsSectionTitle: contraindicationsTitle,
          contraindicationsSectionWrite: contraindications,
          requiredlabWorkSectionTitle: requiredLabWorkTitle,
          requiredlabWorkSectionContraindications: requiredLabWorkItems,
          ongoingMonitoringSectionTitle: ongoingMonitoringTitle,
          ongoingMonitoringSectionContraindication: ongoingMonitoringItems,
          disclaimerSectionTitle: disclaimerTitle,
          disclaimerSectionDes: disclaimerDescription,
          faqTitle: faqSectionTitle,
          faqs,
        })
      );

      await Promise.all(promises);
    },
    onSuccess: async () => {
      toast.success("Eligibility page updated successfully");
      setIsHeroInitialized(false);
      setIsCtaInitialized(false);
      setIsEligibilityInitialized(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ELIGIBILITY_HERO_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ELIGIBILITY_CTA_QUERY_KEY }),
        queryClient.invalidateQueries({
          queryKey: ELIGIBILITY_CONTENT_QUERY_KEY,
        }),
        refetchHeroData(),
        refetchCtaData(),
        refetchEligibilityContent(),
      ]);
    },
    onError: () => {
      toast.error("Failed to update eligibility page");
    },
  });

  const handleSave = () => {
    saveMutation.mutate();
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
                type="button"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="flex items-center gap-2 px-6 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                Save Changes
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-y-5 lg:gap-y-6.5">
            <HeroSectionForm
              heroTitle={heroTitle}
              heroDescription={heroDescription}
              setHeroTitle={setHeroTitle}
              setHeroDescription={setHeroDescription}
            />
            <GeneralEligibilitySectionForm
              sectionTitle={sectionTitle}
              setSectionTitle={setSectionTitle}
              points={points}
              updatePoint={updatePoint}
              removePoint={removePoint}
              addPoint={addPoint}
              reminder={reminder}
              setReminder={setReminder}
            />
            <BmiQualificationSectionForm
              bmiSectionTitle={bmiSectionTitle}
              setBmiSectionTitle={setBmiSectionTitle}
              bmi27Title={bmi27Title}
              setBmi27Title={setBmi27Title}
              bmi27Description={bmi27Description}
              setBmi27Description={setBmi27Description}
              bmi30Title={bmi30Title}
              setBmi30Title={setBmi30Title}
              bmi30Description={bmi30Description}
              setBmi30Description={setBmi30Description}
            />
            <WeightConditionsSectionForm
              weightConditionsTitle={weightConditionsTitle}
              setWeightConditionsTitle={setWeightConditionsTitle}
              newCondition={newCondition}
              setNewCondition={setNewCondition}
              weightConditions={weightConditions}
              addCondition={addCondition}
              removeCondition={removeCondition}
            />
            <SimpleListSectionForm
              cardTitle="Contraindications Section"
              sectionLabel="Section Title:"
              sectionTitle={contraindicationsTitle}
              setSectionTitle={setContraindicationsTitle}
              inputLabel="Write Contraindications:"
              inputValue={newContraindication}
              setInputValue={setNewContraindication}
              addItemLabel="Add Contraindication"
              addItem={addContraindication}
              items={contraindications}
              removeItem={removeContraindication}
            />
            <SimpleListSectionForm
              cardTitle="Required Lab Work Section"
              sectionLabel="Section Title:"
              sectionTitle={requiredLabWorkTitle}
              setSectionTitle={setRequiredLabWorkTitle}
              inputLabel="Write Contraindications:"
              inputValue={newLabWork}
              setInputValue={setNewLabWork}
              addItemLabel="Add Required Lab Work"
              addItem={addRequiredLabWork}
              items={requiredLabWorkItems}
              removeItem={removeRequiredLabWork}
            />
            <SimpleListSectionForm
              cardTitle="Ongoing Monitoring Section"
              sectionLabel="Section Title:"
              sectionTitle={ongoingMonitoringTitle}
              setSectionTitle={setOngoingMonitoringTitle}
              inputLabel="Write Contraindications:"
              inputValue={newOngoingMonitoring}
              setInputValue={setNewOngoingMonitoring}
              addItemLabel="Add Ongoing Monitoring"
              addItem={addOngoingMonitoring}
              items={ongoingMonitoringItems}
              removeItem={removeOngoingMonitoring}
            />
            <DisclaimerSectionForm
              disclaimerTitle={disclaimerTitle}
              setDisclaimerTitle={setDisclaimerTitle}
              disclaimerDescription={disclaimerDescription}
              setDisclaimerDescription={setDisclaimerDescription}
            />
            <FaqSectionForm
              faqSectionTitle={faqSectionTitle}
              setFaqSectionTitle={setFaqSectionTitle}
              faqs={faqs}
              updateFaq={updateFaq}
              removeFaq={removeFaq}
              addFaq={addFaq}
            />
            <BottomCtaSectionForm
              bottomCtaTitle={bottomCtaTitle}
              setBottomCtaTitle={setBottomCtaTitle}
              bottomCtaButtonText={bottomCtaButtonText}
              setBottomCtaButtonText={setBottomCtaButtonText}
              bottomCtaUrl={bottomCtaUrl}
              setBottomCtaUrl={setBottomCtaUrl}
              bottomCtaNewTab={bottomCtaNewTab}
              setBottomCtaNewTab={setBottomCtaNewTab}
            />
            <button
                type="button"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="flex items-center gap-2 px-6 py-2 bg-[#1447E6] w-fit text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                Save Changes
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
