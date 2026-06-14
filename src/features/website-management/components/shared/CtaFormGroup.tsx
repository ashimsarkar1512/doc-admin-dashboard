import React from 'react';
import { FormInput } from './FormInput';
import { ToggleSwitch } from './ToggleSwitch';

interface CtaFormGroupProps {
  defaultText?: string;
  defaultUrl?: string;
  defaultOpenInNewTab?: boolean;
}

export function CtaFormGroup({ defaultText = '', defaultUrl = '', defaultOpenInNewTab = true }: CtaFormGroupProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex-1 min-w-[160px]">
        <FormInput label="CTA Button Text" defaultValue={defaultText} />
      </div>
      <div className="flex-1 min-w-[160px]">
        <FormInput label="URL" defaultValue={defaultUrl} />
      </div>
      <div className="flex items-center gap-2 pb-2.5 shrink-0">
        <ToggleSwitch defaultChecked={defaultOpenInNewTab} />
        <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Open in new tab</span>
      </div>
    </div>
  );
}
