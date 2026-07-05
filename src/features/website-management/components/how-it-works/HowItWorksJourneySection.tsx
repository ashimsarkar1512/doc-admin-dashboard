import { Trash2 } from "lucide-react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";
import { useHowItWorksContext } from "../../context/HowItWorksContext";
import type { StepItem } from "../../context/HowItWorksContext";

export function HowItWorksJourneySection() {
  const { form, setField } = useHowItWorksContext();

  const handleStepChange = (
    id: string,
    field: keyof Omit<StepItem, "id">,
    value: string,
  ) => {
    setField(
      "steps",
      form.steps.map((step) => (step.id === id ? { ...step, [field]: value } : step))
    );
  };

  const addStep = () => {
    setField("steps", [
      ...form.steps,
      {
        id: crypto.randomUUID(),
        title: "",
        timeline: "",
        description: "",
      },
    ]);
  };

  const removeStep = (id: string) => {
    setField(
      "steps",
      form.steps.filter((step) => step.id !== id)
    );
  };

  return (
    <SectionCard title="How It Work Section">
      <div className="space-y-6">
        <FormInput
          label="Section Title:"
          value={form.sectionTitle}
          onChange={(e) => setField("sectionTitle", e.target.value)}
          placeholder="Your Patient Journey"
        />

        <FormTextarea
          label="Section Description:"
          className="h-20"
          value={form.sectionDescription}
          onChange={(e) => setField("sectionDescription", e.target.value)}
          placeholder="Six structured steps from assessment to ongoing care."
        />

        <div className="space-y-4">
          {form.steps.map((step, index) => (
            <div
              key={step.id}
              className="p-5 border border-slate-200 rounded-xl space-y-4 bg-white"
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-1">
                  <div className="flex-1">
                    <FormInput
                      label={`Step ${index + 1}:`}
                      value={step.title}
                      onChange={(e) =>
                        handleStepChange(step.id, "title", e.target.value)
                      }
                      placeholder="Step Title"
                    />
                  </div>
                  <div className="flex-1">
                    <FormInput
                      label="Timeline:"
                      value={step.timeline}
                      onChange={(e) =>
                        handleStepChange(step.id, "timeline", e.target.value)
                      }
                      placeholder="e.g. < 10 minutes"
                    />
                  </div>
                </div>
                {/* Spacer to perfectly align top inputs with bottom textarea */}
                <div className="hidden sm:block w-10 shrink-0"></div>
              </div>

              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <FormTextarea
                    label="Description:"
                    className="h-[84px]"
                    value={step.description}
                    onChange={(e) =>
                      handleStepChange(step.id, "description", e.target.value)
                    }
                    placeholder="Step description..."
                  />
                </div>
                <button
                  onClick={() => removeStep(step.id)}
                  className="mb-1 text-red-500 hover:text-red-700 hover:bg-red-50 w-10 h-10 flex items-center justify-center rounded-md transition-colors shrink-0"
                  title="Remove Step"
                >
                  <Trash2 size={18} strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <button
            onClick={addStep}
            className="text-sm font-medium text-[#1447E6] hover:text-blue-700 transition-colors"
          >
            + Add Step
          </button>
        </div>
      </div>
    </SectionCard>
  );
}
