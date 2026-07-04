import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";
import { useMedicalTeamContext } from "../../context/MedicalTeamContext";

export function MedicalHeroSection() {
  const { form, setField } = useMedicalTeamContext();

  return (
    <SectionCard title="Hero Section">
      <div className="space-y-5">
        <FormInput
          label="Hero title:"
          value={form.heroTitle}
          onChange={(e) => setField("heroTitle", e.target.value)}
          placeholder="Meet Our Medical Team"
        />

        <FormTextarea
          label="Hero Description:"
          className="h-24"
          value={form.heroDescription}
          onChange={(e) => setField("heroDescription", e.target.value)}
          placeholder="All treatment decisions at WeightLossMD are made exclusively by board-certified, state-licensed healthcare professionals. Your health is in expert hands."
        />
      </div>
    </SectionCard>
  );
}
