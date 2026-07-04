import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { useMedicalTeamContext } from "../../context/MedicalTeamContext";

export function MedicalCtaSection() {
  const { form, setField } = useMedicalTeamContext();

  return (
    <SectionCard title="Bottom CTA Section">
      <div className="space-y-5">
        <FormInput
          label="Section Title:"
          value={form.ctaTitle}
          onChange={(e) => setField("ctaTitle", e.target.value)}
          placeholder="Get Started with MedicalTeam"
        />

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[160px]">
            <FormInput
              label="CTA Button Text:"
              value={form.ctaButtonText}
              onChange={(e) => setField("ctaButtonText", e.target.value)}
              placeholder="Contact Us"
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <FormInput
              label="URL:"
              value={form.ctaUrl}
              onChange={(e) => setField("ctaUrl", e.target.value)}
              placeholder="https://example.com/contact"
            />
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            <label className="block text-sm font-medium text-slate-700">
              Button target:
            </label>
            <label className="flex items-center gap-2 pb-1.5 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-[#1447E6] focus:ring-[#1447E6] border-slate-300"
                checked={form.ctaNewTab}
                onChange={(e) => setField("ctaNewTab", e.target.checked)}
              />
              <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Blank (open in new tab)
              </span>
            </label>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
