import { FieldLabel, SectionCard, TextAreaInput, TextInput } from "./shared";

interface HeroSectionFormProps {
  heroTitle: string;
  heroDescription: string;
  setHeroTitle: (value: string) => void;
  setHeroDescription: (value: string) => void;
}

export function HeroSectionForm({
  heroTitle,
  heroDescription,
  setHeroTitle,
  setHeroDescription,
}: HeroSectionFormProps) {
  return (
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
  );
}
