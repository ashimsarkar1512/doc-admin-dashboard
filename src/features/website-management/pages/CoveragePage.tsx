import { useState, type ReactNode } from "react";
import { Save } from "lucide-react";

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

function SaveButton() {
    return (
        <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-[#1447E6] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 w-fit"
        >
            <Save size={16} />
            Save Changes
        </button>
    );
}

export default function CoveragePage() {
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

    return (
        <div className="w-full bg-[#f8fafc] p-4 md:p-6">
            <div className="mx-auto">
                <div className="min-w-0 space-y-3">
                    <div className="flex flex-col gap-y-3 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="font-['Quicksand'] text-[18px] font-semibold leading-[28px] tracking-[0px] text-[#101828] md:text-[20px] md:leading-[30px]">
                            Page: Coverage
                        </h1>
                        <SaveButton />
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
                            <SaveButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
