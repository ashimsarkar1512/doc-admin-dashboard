
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";

interface Props {
  setIsDirty: (dirty: boolean) => void;
  title: string;
  setTitle: (t: string) => void;
  description: string;
  setDescription: (d: string) => void;
}

export function ReportSideEffectHeroSection({ setIsDirty, title, setTitle, description, setDescription }: Props) {
  const handleChange = (setter: (val: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
    setIsDirty(true);
  };

  return (
    <SectionCard title="Hero Section">
      <div className="space-y-5">
        <FormInput
          label="Hero title:"
          value={title}
          onChange={handleChange(setTitle)}
          placeholder="Report a Side Effect"
        />
        <FormTextarea
          label="Hero Description:"
          className="h-24"
          value={description}
          onChange={handleChange(setDescription)}
          placeholder="Your safety is our top priority. Report any adverse reactions to your medication using the form below. A member of our clinical team will follow up within 24 hours."
        />
      </div>
    </SectionCard>
  );
}
