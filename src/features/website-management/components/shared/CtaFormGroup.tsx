import React from 'react';
import { FormInput } from './FormInput';

interface CtaFormGroupProps {
  defaultText?: string;
  defaultUrl?: string;
  defaultOpenInNewTab?: boolean;
}

export function CtaFormGroup({ defaultText = '', defaultUrl = '', defaultOpenInNewTab = true }: CtaFormGroupProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex-1 min-w-[160px]">
        <FormInput label="CTA Button Text:" defaultValue={defaultText} />
      </div>
      <div className="flex-1 min-w-[160px]">
        <FormInput label="URL:" defaultValue={defaultUrl} />
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        <label className="block text-sm font-medium text-slate-700">Button target:</label>
        <label className="flex items-center gap-2 pb-1.5 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded text-[#1447E6] focus:ring-[#1447E6] border-slate-300"
            defaultChecked={defaultOpenInNewTab}
          />
          <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Blank (open in new tab)</span>
        </label>
      </div>
    </div>
  );
}
