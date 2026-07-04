import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
  containerClassName?: string;
}

export function FormInput({ label, className = '', containerClassName = '', ...props }: FormInputProps) {
  return (
    <div className={containerClassName}>
      <label className="block text-sm font-semibold text-[#272628] mb-1.5">{label}</label>
      <input
        type="text"
        className={`w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all ${className}`}
        {...props}
      />
    </div>
  );
}
