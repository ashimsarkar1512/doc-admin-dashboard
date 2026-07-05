import React from 'react';

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, children, className = '' }: SectionCardProps) {
  return (
    <div className={`border border-slate-200 rounded-xl p-6 bg-white shadow-sm ${className}`}>
      {title && <h3 className="text-lg font-semibold text-slate-800 mb-5">{title}</h3>}
      {children}
    </div>
  );
}
