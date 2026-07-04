import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";
import { useHowItWorksContext } from "../../context/HowItWorksContext";

export function HowItWorksDisclaimerSection() {
  const { form, setField } = useHowItWorksContext();

  return (
    <SectionCard title="Disclaimer Section">
      <div className="space-y-5">
        <FormInput
          label="Disclaimer Title:"
          value={form.disclaimerTitle}
          onChange={(e) => setField("disclaimerTitle", e.target.value)}
          placeholder="Provider Review Disclaimer"
        />

        <FormTextarea
          label="Description:"
          className="h-20"
          value={form.disclaimerDescription}
          onChange={(e) => setField("disclaimerDescription", e.target.value)}
          placeholder="All treatment decisions are made exclusively by licensed healthcare providers. Payment of any membership fee does not guarantee a prescription or approval for treatment."
        />
      </div>
    </SectionCard>
  );
}
