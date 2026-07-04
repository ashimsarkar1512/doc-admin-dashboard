import { useEffect, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import {
    getHeroSections,
    updateHeroSection,
} from "@/api/endpoints/hero-section.api";
import {
    getCtaSections,
    updateCtaSection,
} from "@/api/endpoints/cta-section.api";
import {
    getCoverageSection,
    updateCoverageSection,
} from "@/api/endpoints/coverage.api";

function SectionCard({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="rounded-[10px] border border-[#D1D5DC] bg-white p-4 md:p-5">
            <div className="font-['Quicksand'] text-[18px] font-semibold leading-[20px] tracking-[0px] text-[#272628]">
                {title}
            </div>
            <div className="mt-4 font-['Quicksand'] text-[14px] font-normal leading-none tracking-[0px] text-[#272628]">
                {children}
            </div>
        </section>
    );
}

function FieldLabel({ children }: { children: ReactNode }) {
    return (
        <label className="block font-['Quicksand'] text-[14px] font-semibold leading-[20px] tracking-[0px] text-[#272628]">
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

function SaveButton({
    onClick,
    isSaving,
}: {
    onClick: () => void;
    isSaving: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isSaving}
            className="flex w-fit items-center gap-2 rounded-lg bg-[#1447E6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
        </button>
    );
}

export default function CoveragePage() {
    const queryClient = useQueryClient();
    const [heroTitle, setHeroTitle] = useState("Where We Provide Care");
    const [heroDescription, setHeroDescription] = useState(
        "WeightLossMD providers are licensed to practice in your state. Care is only available in states where our providers hold an active license."
    );
    const [disclaimerTitle, setDisclaimerTitle] = useState(
        "Licensing Disclaimer:"
    );
    const [disclaimerDescription, setDisclaimerDescription] = useState(
        "Care through WeightLossMD is only available in states where our providers are licensed to practice medicine. State licensing requirements vary. Availability may change as we add new providers and expand our network."
    );
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
    const [isInitialized, setIsInitialized] = useState(false);

    const COVERAGE_HERO_QUERY_KEY = ["coverage-hero-section"];
    const COVERAGE_CTA_QUERY_KEY = ["coverage-cta-section"];
    const COVERAGE_SECTION_QUERY_KEY = ["coverage-section"];

    const { data: heroData } = useQuery({
        queryKey: COVERAGE_HERO_QUERY_KEY,
        queryFn: () => getHeroSections("Coverage"),
        staleTime: 5 * 60 * 1000,
    });

    const { data: ctaData } = useQuery({
        queryKey: COVERAGE_CTA_QUERY_KEY,
        queryFn: () => getCtaSections("Coverage"),
        staleTime: 5 * 60 * 1000,
    });

    const { data: coverageSectionData } = useQuery({
        queryKey: COVERAGE_SECTION_QUERY_KEY,
        queryFn: getCoverageSection,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (!heroData?.data || !ctaData?.data || !coverageSectionData?.data || isInitialized) return;

        const hero = Array.isArray(heroData.data) ? heroData.data[0] : heroData.data;
        const cta = Array.isArray(ctaData.data) ? ctaData.data[0] : ctaData.data;
        const coverageSection = coverageSectionData.data;

        setHeroId(hero?.id || "");
        setHeroTitle(hero?.title || "");
        setHeroDescription(hero?.description || "");
        setDisclaimerTitle(coverageSection?.title || "");
        setDisclaimerDescription(coverageSection?.description || "");
        setCtaId(cta?.id || "");
        setBottomCtaTitle(cta?.sectionTitle || "");
        setBottomCtaButtonText(cta?.ctaButtonText || "");
        setBottomCtaUrl(cta?.url || "");
        setBottomCtaNewTab(cta?.openInNewTab ?? true);
        setIsInitialized(true);
    }, [heroData, ctaData, coverageSectionData, isInitialized]);

    const saveMutation = useMutation({
        mutationFn: async () => {
            const promises: Promise<unknown>[] = [];

            if (heroId) {
                promises.push(
                    updateHeroSection(heroId, {
                        page: "Coverage",
                        title: heroTitle,
                        description: heroDescription,
                    })
                );
            }

            if (ctaId) {
                promises.push(
                    updateCtaSection(ctaId, {
                        page: "Coverage",
                        sectionTitle: bottomCtaTitle,
                        ctaButtonText: bottomCtaButtonText,
                        url: bottomCtaUrl,
                        openInNewTab: bottomCtaNewTab,
                        categoryId: null,
                    })
                );
            }

            promises.push(
                updateCoverageSection({
                    title: disclaimerTitle,
                    description: disclaimerDescription,
                })
            );

            await Promise.all(promises);
        },
        onSuccess: async () => {
            toast.success("Coverage page updated successfully");
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: COVERAGE_HERO_QUERY_KEY }),
                queryClient.invalidateQueries({ queryKey: COVERAGE_CTA_QUERY_KEY }),
                queryClient.invalidateQueries({ queryKey: COVERAGE_SECTION_QUERY_KEY }),
            ]);
        },
        onError: () => {
            toast.error("Failed to update coverage page");
        },
    });

    const handleSave = () => {
        saveMutation.mutate();
    };

    return (
        <div className="w-full bg-[#f8fafc] p-4 md:p-6">
            <div className="mx-auto">
                <div className="min-w-0 space-y-3">
                    <div className="flex flex-col gap-y-3 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="font-['Quicksand'] text-[18px] font-semibold leading-[28px] tracking-[0px] text-[#101828] md:text-[20px] md:leading-[30px]">
                            Page: Coverage
                        </h1>
                        <SaveButton onClick={handleSave} isSaving={saveMutation.isPending} />
                    </div>

                    <div className="flex flex-col gap-y-5 lg:gap-y-6.5">
                        <SectionCard title="Hero Section">
                            <div className="space-y-2">
                                <FieldLabel>Hero title:</FieldLabel>
                                <TextInput value={heroTitle} onChange={setHeroTitle} />
                            </div>

                            <div className="mt-2 space-y-2">
                                <FieldLabel>Hero Description:</FieldLabel>
                                <TextAreaInput
                                    value={heroDescription}
                                    onChange={setHeroDescription}
                                    rows={4}
                                />
                            </div>
                        </SectionCard>

                        <SectionCard title="Disclaimer Section">
                            <div className="space-y-2">
                                <FieldLabel>Disclaimer Title:</FieldLabel>
                                <TextInput
                                    value={disclaimerTitle}
                                    onChange={setDisclaimerTitle}
                                />
                            </div>

                            <div className="mt-2 space-y-2">
                                <FieldLabel>Description:</FieldLabel>
                                <TextAreaInput
                                    value={disclaimerDescription}
                                    onChange={setDisclaimerDescription}
                                    rows={3}
                                />
                            </div>
                        </SectionCard>

                        <SectionCard title="Bottom CTA Section:">
                            <div className="space-y-2">
                                <FieldLabel>Section Title:</FieldLabel>
                                <TextInput
                                    value={bottomCtaTitle}
                                    onChange={setBottomCtaTitle}
                                />
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <FieldLabel>CTA Button Text:</FieldLabel>
                                    <TextInput
                                        value={bottomCtaButtonText}
                                        onChange={setBottomCtaButtonText}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <FieldLabel>URL:</FieldLabel>
                                    <TextInput value={bottomCtaUrl} onChange={setBottomCtaUrl} />
                                </div>

                                <div className="space-y-2">
                                    <FieldLabel>Button target:</FieldLabel>
                                    <label className="mt-3 inline-flex items-center gap-3 font-['Quicksand'] text-[14px] font-normal leading-[20px] tracking-[0px] text-[#272628]">
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

                        <div className="pt-1">
                            <SaveButton onClick={handleSave} isSaving={saveMutation.isPending} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
