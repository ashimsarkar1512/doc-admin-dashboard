import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Loader2, Tag } from 'lucide-react';
import Dialog from '@/components/shared/Dialog';
import {
  updateTemplate,
  type CommunicationTemplate,
  type UpdateTemplatePayload,
} from '@/api/endpoints/communicationTemplates.api';

interface EditActionTemplateModalProps {
  template: CommunicationTemplate;
  variables: string[];
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updated: CommunicationTemplate) => void;
}

export const EditActionTemplateModal: React.FC<EditActionTemplateModalProps> = ({
  template, variables, isOpen, onClose, onSaved,
}) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateTemplatePayload>({
    defaultValues: {
      subject: template.subject ?? '',
      headerTitle: template.headerTitle,
      headerSubtitle: template.headerSubtitle,
      content: template.content,
      infoCard1Title: template.infoCard1Title ?? '',
      infoCard1Text: template.infoCard1Text ?? '',
      infoCard2Title: template.infoCard2Title ?? '',
      infoCard2Text: template.infoCard2Text ?? '',
      showInfoCards: template.showInfoCards,
      isActive: template.isActive,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset({
        subject: template.subject ?? '',
        headerTitle: template.headerTitle,
        headerSubtitle: template.headerSubtitle,
        content: template.content,
        infoCard1Title: template.infoCard1Title ?? '',
        infoCard1Text: template.infoCard1Text ?? '',
        infoCard2Title: template.infoCard2Title ?? '',
        infoCard2Text: template.infoCard2Text ?? '',
        showInfoCards: template.showInfoCards,
        isActive: template.isActive,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(null);
    }
  }, [isOpen, template, reset]);

  const onSubmit = async (data: UpdateTemplatePayload) => {
    setSaving(true); setError(null);
    try {
      const res = await updateTemplate(template.id, {
        ...data,
        infoCard1Title: data.infoCard1Title || null,
        infoCard1Text: data.infoCard1Text || null,
        infoCard2Title: data.infoCard2Title || null,
        infoCard2Text: data.infoCard2Text || null,
      });
      onSaved(res.data);
      onClose();
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-slate-800 transition-all';
  const labelCls = 'block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5';

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit — ${template.action}`}
      maxWidthClass="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Variables hint */}
        {variables.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">Available Variables</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {variables.map((v) => (
                <code key={v} className="px-1.5 py-0.5 bg-white text-amber-700 border border-amber-300 text-xs rounded">
                  {`{{${v}}}`}
                </code>
              ))}
            </div>
          </div>
        )}

        {/* Subject */}
        {template.subject !== undefined && (
          <div>
            <label className={labelCls}>Subject</label>
            <input {...register('subject')} className={inputCls} placeholder="Email subject line" />
          </div>
        )}

        {/* Header */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Header Title</label>
            <input {...register('headerTitle', { required: true })} className={inputCls} />
            {errors.headerTitle && <p className="text-xs text-red-500 mt-1">Required</p>}
          </div>
          <div>
            <label className={labelCls}>Header Subtitle</label>
            <input {...register('headerSubtitle')} className={inputCls} />
          </div>
        </div>

        {/* Content */}
        <div>
          <label className={labelCls}>Email Content</label>
          <textarea
            {...register('content', { required: true })}
            rows={7}
            className={`${inputCls} resize-none`}
          />
          {errors.content && <p className="text-xs text-red-500 mt-1">Content is required</p>}
        </div>

        {/* Info cards */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
          <div className="flex items-center justify-between">
            <p className={labelCls} style={{ marginBottom: 0 }}>Info Cards</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-slate-600">Show info cards</span>
              <input type="checkbox" {...register('showInfoCards')} className="w-4 h-4 rounded accent-blue-600" />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <input {...register('infoCard1Title')} className={inputCls} placeholder="Card 1 title (e.g. SECURE ACCESS)" />
              <textarea {...register('infoCard1Text')} rows={2} className={`${inputCls} resize-none`} placeholder="Card 1 text…" />
            </div>
            <div className="space-y-2">
              <input {...register('infoCard2Title')} className={inputCls} placeholder="Card 2 title (e.g. NEED HELP?)" />
              <textarea {...register('infoCard2Text')} rows={2} className={`${inputCls} resize-none`} placeholder="Card 2 text…" />
            </div>
          </div>
        </div>

        {/* Active toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-sm font-medium text-slate-700">Template Active</span>
          <input type="checkbox" {...register('isActive')} className="w-5 h-5 rounded accent-blue-600" />
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};
