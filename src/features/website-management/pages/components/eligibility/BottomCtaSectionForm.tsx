import { FieldLabel, SectionCard, TextInput } from "./shared";

interface BottomCtaSectionFormProps {
  bottomCtaTitle: string;
  setBottomCtaTitle: (value: string) => void;
  bottomCtaButtonText: string;
  setBottomCtaButtonText: (value: string) => void;
  bottomCtaUrl: string;
  setBottomCtaUrl: (value: string) => void;
  bottomCtaNewTab: boolean;
  setBottomCtaNewTab: (value: boolean) => void;
}

export function BottomCtaSectionForm({
  bottomCtaTitle,
  setBottomCtaTitle,
  bottomCtaButtonText,
  setBottomCtaButtonText,
  bottomCtaUrl,
  setBottomCtaUrl,
  bottomCtaNewTab,
  setBottomCtaNewTab,
}: BottomCtaSectionFormProps) {
  return (
    <SectionCard title="Bottom CTA Section:">
      <div className="flex flex-col gap-y-2">
        <FieldLabel>Section Title:</FieldLabel>
        <TextInput value={bottomCtaTitle} onChange={setBottomCtaTitle} />
      </div>

      <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-y-2">
          <FieldLabel>CTA Button Text:</FieldLabel>
          <TextInput
            value={bottomCtaButtonText}
            onChange={setBottomCtaButtonText}
          />
        </div>

        <div className="flex flex-col gap-y-2">
          <FieldLabel>URL:</FieldLabel>
          <TextInput value={bottomCtaUrl} onChange={setBottomCtaUrl} />
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
  );
}
