import { useState } from "react";
import { Trash2 } from "lucide-react";
import { SectionCard } from "../shared/SectionCard";
import { FormInput } from "../shared/FormInput";
import { FormTextarea } from "../shared/FormTextarea";

interface Props {
  setIsDirty: (dirty: boolean) => void;
}

interface Step {
  id: string;
  title: string;
  timeline: string;
  description: string;
}

export function HowItWorksJourneySection({ setIsDirty }: Props) {
  const [title, setTitle] = useState("Your Patient Journey");
  const [description, setDescription] = useState(
    "Six structured steps from assessment to ongoing care.",
  );

  const [steps, setSteps] = useState<Step[]>([
    {
      id: "1",
      title: "Medical Review by Provider",
      timeline: "< 10 minutes",
      description:
        "Fill out a comprehensive health questionnaire covering your medical history, current medications, weight history, and health goals. Your information is protected by HIPAA encryption.",
    },
    {
      id: "2",
      title: "Complete Assessment",
      timeline: "Within 24 hours",
      description:
        "A licensed provider in your state reviews your consultation details (and may request additional information), and determines medical appropriateness for treatment.",
    },
    {
      id: "3",
      title: "Treatment Approval",
      timeline: "Within 24 hours",
      description:
        "If medically appropriate, your provider issues an e-prescription to our partner pharmacy. Payment does not guarantee approval -- all decisions are clinical.",
    },
  ]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setIsDirty(true);
  };

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    setIsDirty(true);
  };

  const handleStepChange = (
    id: string,
    field: keyof Omit<Step, "id">,
    value: string,
  ) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, [field]: value } : step)),
    );
    setIsDirty(true);
  };

  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        title: "",
        timeline: "",
        description: "",
      },
    ]);
    setIsDirty(true);
  };

  const removeStep = (id: string) => {
    setSteps((prev) => prev.filter((step) => step.id !== id));
    setIsDirty(true);
  };

  return (
    <SectionCard title="How It Work Section">
      <div className="space-y-6">
        <FormInput
          label="Section Title:"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Your Patient Journey"
        />

        <FormTextarea
          label="Section Description:"
          className="h-20"
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Six structured steps from assessment to ongoing care."
        />

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="p-5 border border-slate-200 rounded-xl space-y-4 bg-white"
            >
              <div className="flex items-start gap-4">
                <div className="flex gap-6 flex-1">
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
                <div className="w-10 shrink-0"></div>
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
