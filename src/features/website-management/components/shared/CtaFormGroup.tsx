import React from 'react';
import { FormInput } from './FormInput';

interface CtaFormGroupProps {
  defaultText?: string;
  defaultUrl?: string;
  defaultOpenInNewTab?: boolean;
}

export function CtaFormGroup({ defaultText = '', defaultUrl = '', defaultOpenInNewTab = true }: CtaFormGroupProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormInput label="CTA Button Text" defaultValue={defaultText} />
      <FormInput label="URL" defaultValue={defaultUrl} />
      <div className="flex flex-col justify-end pb-2.5">
        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <input
            type="checkbox"
            className="w-4 h-4 rounded text-[#1447E6] focus:ring-[#1447E6] border-slate-300"
            defaultChecked={defaultOpenInNewTab}
          />
          <span className="text-sm font-medium text-slate-700">Open in new tab</span>
        </label>
      </div>
    </div>
  );
}
