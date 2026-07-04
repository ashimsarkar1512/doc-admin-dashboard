import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  className?: string;
  containerClassName?: string;
}

export function FormTextarea({ label, className = '', containerClassName = '', ...props }: FormTextareaProps) {
  return (
    <div className={containerClassName}>
      <label className="block text-sm font-semibold text-[#272628] mb-1.5">{label}</label>
      <textarea
        className={`w-full border border-slate-200 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6] transition-all ${className}`}
        {...props}
      />
    </div>
  );
}
