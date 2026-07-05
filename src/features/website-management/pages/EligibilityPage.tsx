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

function buildEligibilitySnapshot({
  heroTitle,
  heroDescription,
  sectionTitle,
  points,
  reminder,
  bmiSectionTitle,
  bmi27Title,
  bmi27Description,
  bmi30Title,
  bmi30Description,
  weightConditionsTitle,
  weightConditions,
  contraindicationsTitle,
  contraindications,
  requiredLabWorkTitle,
  requiredLabWorkItems,
  ongoingMonitoringTitle,
  ongoingMonitoringItems,
  disclaimerTitle,
  disclaimerDescription,
  faqSectionTitle,
  faqs,
  bottomCtaTitle,
  bottomCtaButtonText,
  bottomCtaUrl,
  bottomCtaNewTab,
}: {
  heroTitle: string;
  heroDescription: string;
  sectionTitle: string;
  points: string[];
  reminder: string;
  bmiSectionTitle: string;
  bmi27Title: string;
  bmi27Description: string;
  bmi30Title: string;
  bmi30Description: string;
  weightConditionsTitle: string;
  weightConditions: string[];
  contraindicationsTitle: string;
  contraindications: string[];
  requiredLabWorkTitle: string;
  requiredLabWorkItems: string[];
  ongoingMonitoringTitle: string;
  ongoingMonitoringItems: string[];
  disclaimerTitle: string;
  disclaimerDescription: string;
  faqSectionTitle: string;
  faqs: EligibilityFaqItem[];
  bottomCtaTitle: string;
  bottomCtaButtonText: string;
  bottomCtaUrl: string;
  bottomCtaNewTab: boolean;
}) {
  return JSON.stringify({
    heroTitle,
    heroDescription,
    sectionTitle,
    points,
    reminder,
    bmiSectionTitle,
    bmi27Title,
    bmi27Description,
    bmi30Title,
    bmi30Description,
    weightConditionsTitle,
    weightConditions,
    contraindicationsTitle,
    contraindications,
    requiredLabWorkTitle,
    requiredLabWorkItems,
    ongoingMonitoringTitle,
    ongoingMonitoringItems,
    disclaimerTitle,
    disclaimerDescription,
    faqSectionTitle,
    faqs,
    bottomCtaTitle,
    bottomCtaButtonText,
    bottomCtaUrl,
    bottomCtaNewTab,
  });
}

export default function EligibilityPage() {
  const PAGE_TYPE = "Eligiblity";
  const queryClient = useQueryClient();
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [sectionTitle, setSectionTitle] = useState("");
  const [points, setPoints] = useState<string[]>([]);
  const [reminder, setReminder] = useState("");
  const [bmiSectionTitle, setBmiSectionTitle] = useState("");
  const [bmi27Title, setBmi27Title] = useState("");
  const [bmi27Description, setBmi27Description] = useState("");
  const [bmi30Title, setBmi30Title] = useState("");
  const [bmi30Description, setBmi30Description] = useState("");
  const [weightConditionsTitle, setWeightConditionsTitle] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [weightConditions, setWeightConditions] = useState<string[]>([]);
  const [contraindicationsTitle, setContraindicationsTitle] = useState("");
  const [newContraindication, setNewContraindication] = useState("");
  const [contraindications, setContraindications] = useState<string[]>([]);
  const [requiredLabWorkTitle, setRequiredLabWorkTitle] = useState("");
  const [newLabWork, setNewLabWork] = useState("");
  const [requiredLabWorkItems, setRequiredLabWorkItems] = useState<string[]>([]);
  const [ongoingMonitoringTitle, setOngoingMonitoringTitle] = useState("");
  const [newOngoingMonitoring, setNewOngoingMonitoring] = useState("");
  const [ongoingMonitoringItems, setOngoingMonitoringItems] = useState<string[]>(
    []
  );
  const [disclaimerTitle, setDisclaimerTitle] = useState("");
  const [disclaimerDescription, setDisclaimerDescription] = useState("");
  const [faqSectionTitle, setFaqSectionTitle] = useState("");
  const [faqs, setFaqs] = useState<EligibilityFaqItem[]>([]);
  const [bottomCtaTitle, setBottomCtaTitle] = useState("");
  const [bottomCtaButtonText, setBottomCtaButtonText] = useState("");
  const [bottomCtaUrl, setBottomCtaUrl] = useState("");
  const [bottomCtaNewTab, setBottomCtaNewTab] = useState(false);
  const [heroId, setHeroId] = useState("");
  const [ctaId, setCtaId] = useState("");
  const [isHeroInitialized, setIsHeroInitialized] = useState(false);
  const [isCtaInitialized, setIsCtaInitialized] = useState(false);
  const [isEligibilityInitialized, setIsEligibilityInitialized] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState<string | null>(null);

  const ELIGIBILITY_HERO_QUERY_KEY = ["eligibility-hero-section"];
  const ELIGIBILITY_CTA_QUERY_KEY = ["eligibility-cta-section"];
  const ELIGIBILITY_CONTENT_QUERY_KEY = ["eligibility-content"];

  const { data: heroData } = useQuery({
    queryKey: ELIGIBILITY_HERO_QUERY_KEY,
    queryFn: () => getHeroSectionByPage(PAGE_TYPE),
    staleTime: 5 * 60 * 1000,
  });

  const { data: ctaData } = useQuery({
    queryKey: ELIGIBILITY_CTA_QUERY_KEY,
    queryFn: () => getCtaSections(PAGE_TYPE),
    staleTime: 5 * 60 * 1000,
  });

  const { data: eligibilityContentData } =
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

  useEffect(() => {
    if (!isHeroInitialized || !isCtaInitialized || !isEligibilityInitialized) return;

    setInitialSnapshot(
      buildEligibilitySnapshot({
        heroTitle,
        heroDescription,
        sectionTitle,
        points,
        reminder,
        bmiSectionTitle,
        bmi27Title,
        bmi27Description,
        bmi30Title,
        bmi30Description,
        weightConditionsTitle,
        weightConditions,
        contraindicationsTitle,
        contraindications,
        requiredLabWorkTitle,
        requiredLabWorkItems,
        ongoingMonitoringTitle,
        ongoingMonitoringItems,
        disclaimerTitle,
        disclaimerDescription,
        faqSectionTitle,
        faqs,
        bottomCtaTitle,
        bottomCtaButtonText,
        bottomCtaUrl,
        bottomCtaNewTab,
      })
    );
  }, [isHeroInitialized, isCtaInitialized, isEligibilityInitialized]);

  const currentSnapshot = buildEligibilitySnapshot({
    heroTitle,
    heroDescription,
    sectionTitle,
    points,
    reminder,
    bmiSectionTitle,
    bmi27Title,
    bmi27Description,
    bmi30Title,
    bmi30Description,
    weightConditionsTitle,
    weightConditions,
    contraindicationsTitle,
    contraindications,
    requiredLabWorkTitle,
    requiredLabWorkItems,
    ongoingMonitoringTitle,
    ongoingMonitoringItems,
    disclaimerTitle,
    disclaimerDescription,
    faqSectionTitle,
    faqs,
    bottomCtaTitle,
    bottomCtaButtonText,
    bottomCtaUrl,
    bottomCtaNewTab,
  });
  const isDirty = initialSnapshot !== null && currentSnapshot !== initialSnapshot;

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
      const heroPromise = heroId
        ? updateHeroSection(heroId, {
            page: PAGE_TYPE,
            title: heroTitle,
            description: heroDescription,
          })
        : Promise.resolve(null);

      const ctaPromise = ctaId
        ? updateCtaSection(ctaId, {
            page: PAGE_TYPE,
            sectionTitle: bottomCtaTitle,
            ctaButtonText: bottomCtaButtonText,
            url: bottomCtaUrl,
            openInNewTab: bottomCtaNewTab,
            categoryId: null,
          })
        : Promise.resolve(null);

      const eligibilityPromise = updateEligibilityContent({
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
        });

      const [updatedHero, updatedCta, updatedEligibility] = await Promise.all([
        heroPromise,
        ctaPromise,
        eligibilityPromise,
      ]);

      return {
        updatedHero,
        updatedCta,
        updatedEligibility,
      };
    },
    onSuccess: async ({ updatedHero, updatedCta, updatedEligibility }) => {
      if (updatedHero) {
        setHeroId(updatedHero.id || "");
        setHeroTitle(updatedHero.title || "");
        setHeroDescription(updatedHero.description || "");
        queryClient.setQueryData(ELIGIBILITY_HERO_QUERY_KEY, [updatedHero]);
      }

      if (updatedCta?.data) {
        const cta = updatedCta.data;
        setCtaId(cta.id || "");
        setBottomCtaTitle(cta.sectionTitle || "");
        setBottomCtaButtonText(cta.ctaButtonText || "");
        setBottomCtaUrl(cta.url || "");
        setBottomCtaNewTab(cta.openInNewTab ?? true);
        queryClient.setQueryData(ELIGIBILITY_CTA_QUERY_KEY, { data: [cta] });
      }

      if (updatedEligibility?.data) {
        const eligibility = updatedEligibility.data;
        const normalizedPoints = eligibility.generalPoints?.length
          ? eligibility.generalPoints.map((item) => item.point || "")
          : [""];
        const normalizedFaqs = eligibility.faqs || [];

        setSectionTitle(eligibility.generalTitle || "");
        setPoints(normalizedPoints);
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
        setFaqs(normalizedFaqs);
        queryClient.setQueryData(ELIGIBILITY_CONTENT_QUERY_KEY, {
          success: true,
          message: updatedEligibility.message,
          data: eligibility,
        });
      }

      setInitialSnapshot(
        buildEligibilitySnapshot({
          heroTitle: updatedHero?.title || heroTitle,
          heroDescription: updatedHero?.description || heroDescription,
          sectionTitle: updatedEligibility?.data?.generalTitle || sectionTitle,
          points:
            updatedEligibility?.data?.generalPoints?.length
              ? updatedEligibility.data.generalPoints.map((item) => item.point || "")
              : points,
          reminder: updatedEligibility?.data?.generalBottomDesc || reminder,
          bmiSectionTitle:
            updatedEligibility?.data?.qualificationTitle || bmiSectionTitle,
          bmi27Title:
            updatedEligibility?.data?.qualificationbmi27Text || bmi27Title,
          bmi27Description:
            updatedEligibility?.data?.qualification27Description || bmi27Description,
          bmi30Title:
            updatedEligibility?.data?.qualificationbmi30Text || bmi30Title,
          bmi30Description:
            updatedEligibility?.data?.qualification30Description || bmi30Description,
          weightConditionsTitle:
            updatedEligibility?.data?.weightConditionSecTitle || weightConditionsTitle,
          weightConditions:
            updatedEligibility?.data?.weightConditions || weightConditions,
          contraindicationsTitle:
            updatedEligibility?.data?.contraindicationsSectionTitle ||
            contraindicationsTitle,
          contraindications:
            updatedEligibility?.data?.contraindicationsSectionWrite ||
            contraindications,
          requiredLabWorkTitle:
            updatedEligibility?.data?.requiredlabWorkSectionTitle ||
            requiredLabWorkTitle,
          requiredLabWorkItems:
            updatedEligibility?.data?.requiredlabWorkSectionContraindications ||
            requiredLabWorkItems,
          ongoingMonitoringTitle:
            updatedEligibility?.data?.ongoingMonitoringSectionTitle ||
            ongoingMonitoringTitle,
          ongoingMonitoringItems:
            updatedEligibility?.data?.ongoingMonitoringSectionContraindication ||
            ongoingMonitoringItems,
          disclaimerTitle:
            updatedEligibility?.data?.disclaimerSectionTitle || disclaimerTitle,
          disclaimerDescription:
            updatedEligibility?.data?.disclaimerSectionDes || disclaimerDescription,
          faqSectionTitle: updatedEligibility?.data?.faqTitle || faqSectionTitle,
          faqs: updatedEligibility?.data?.faqs || faqs,
          bottomCtaTitle: updatedCta?.data?.sectionTitle || bottomCtaTitle,
          bottomCtaButtonText:
            updatedCta?.data?.ctaButtonText || bottomCtaButtonText,
          bottomCtaUrl: updatedCta?.data?.url || bottomCtaUrl,
          bottomCtaNewTab: updatedCta?.data?.openInNewTab ?? bottomCtaNewTab,
        })
      );

      toast.success("Eligibility page updated successfully");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ELIGIBILITY_HERO_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ELIGIBILITY_CTA_QUERY_KEY }),
        queryClient.invalidateQueries({
          queryKey: ELIGIBILITY_CONTENT_QUERY_KEY,
        }),
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
             <div className="text-[15px] text-slate-800 font-medium flex items-center gap-2">
            <span className="text-slate-700 font-semibold">Pages</span>
            <span className="text-slate-500 font-normal">&gt;</span>
            <span className="text-slate-900 font-bold">Eligiblity</span>
          </div>
            <div className="">
              <button
                type="button"
                onClick={handleSave}
                disabled={saveMutation.isPending || !isDirty}
                className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={saveMutation.isPending || !isDirty}
                className="flex items-center gap-2 px-6 py-2 bg-[#1447E6] w-fit text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
