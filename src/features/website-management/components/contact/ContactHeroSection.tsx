import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";
import { useContactPageContext } from "../../context/ContactPageContext";

export function ContactHeroSection() {
  const { form, setField } = useContactPageContext();

  return (
    <SectionCard title="Hero Section">
      <div className="space-y-5">
        <FormInput
          label="Hero title:"
          value={form.heroTitle}
          onChange={(e) => setField("heroTitle", e.target.value)}
          placeholder="Contact Us"
        />

        <FormTextarea
          label="Hero Description:"
          className="h-24"
          value={form.heroDescription}
          onChange={(e) => setField("heroDescription", e.target.value)}
          placeholder="Contact us to schedule a consultation with our medical team and explore personalized options to support your weight management goals."
        />
      </div>
    </SectionCard>
  );
}
