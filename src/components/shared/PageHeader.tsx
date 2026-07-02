import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex flex-col">
        <h1 className="m-0 text-[#272628] font-['Quicksand'] text-[24px] font-[700] leading-none text-center sm:text-left">
          {title}
        </h1>
        {subtitle && (
          <p className="m-0 text-[#3B3B3B] font-['Quicksand'] text-[14px] font-[400] leading-none text-center sm:text-left mt-2">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="flex shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
