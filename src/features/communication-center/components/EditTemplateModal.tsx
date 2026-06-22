import Dialog from "@/components/shared/Dialog";
import { Save } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import type { Template } from "../types";

interface EditTemplateModalProps {
  template: Template;
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Template) => void;
}

export const EditTemplateModal: React.FC<EditTemplateModalProps> = ({
  template,
  isOpen,
  onClose,
  onSave,
}) => {
  const { register, handleSubmit, reset } = useForm<Template>({
    defaultValues: template,
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(template);
    }
  }, [isOpen, reset, template]);

  const onSubmit = (data: Template) => {
    onSave({
      ...data,
      id: template.id,
      type: template.type,
    });
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${template.name}`}
      maxWidthClass="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800">
            Template Name
          </label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800">
            Description
          </label>
          <input
            type="text"
            {...register("description")}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800"
          />
        </div>

        {template.type === "Email" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-800">
              Subject
            </label>
            <input
              type="text"
              {...register("subject")}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-800">Body</label>
          <textarea
            {...register("body", { required: true })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 resize-none"
            rows={6}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </form>
    </Dialog>
  );
};
