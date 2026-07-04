import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";
import { useMedicalTeamContext } from "../../context/MedicalTeamContext";

export function MedicalProviderSection() {
  const { form, setField } = useMedicalTeamContext();

  return (
    <SectionCard title="Provider Section">
      <div className="space-y-5">
        <FormInput
          label="Provider Title:"
          value={form.providerTitle}
          onChange={(e) => setField("providerTitle", e.target.value)}
          placeholder="Provider Title"
        />

        <FormTextarea
          label="Provider Description:"
          className="h-24"
          value={form.providerDescription}
          onChange={(e) => setField("providerDescription", e.target.value)}
          placeholder="Provider Description"
        />
      </div>
    </SectionCard>
  );
}
