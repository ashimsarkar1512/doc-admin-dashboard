import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";
import { useHowItWorksContext } from "../../context/HowItWorksContext";

export function HowItWorksHeroSection() {
  const { form, setField } = useHowItWorksContext();

  return (
    <SectionCard title="Hero Section">
      <div className="space-y-5">
        <FormInput
          label="Hero title:"
          value={form.heroTitle}
          onChange={(e) => setField("heroTitle", e.target.value)}
          placeholder="How WeightLoss MD Works"
        />

        <FormTextarea
          label="Hero Description:"
          className="h-24"
          value={form.heroDescription}
          onChange={(e) => setField("heroDescription", e.target.value)}
          placeholder="A clear, transparent process from your first health question to ongoing medical support - all from licensed providers."
        />
      </div>
    </SectionCard>
  );
}
