import React, { useRef } from 'react';
import { Calendar } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
  wrapperClassName?: string;
  iconClassName?: string;
}

export default function DatePicker({
  className,
  wrapperClassName,
  iconClassName,
  onClick,
  ...props
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent triggering if clicked on the input itself since it handles its own focus/click
    if (e.target !== inputRef.current) {
      try {
        if (inputRef.current && 'showPicker' in HTMLInputElement.prototype) {
          inputRef.current.showPicker();
        } else if (inputRef.current) {
          inputRef.current.focus();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div 
      className={twMerge("relative inline-block w-full cursor-pointer", wrapperClassName)}
      onClick={handleContainerClick}
    >
      <input
        ref={inputRef}
        type="date"
        className={twMerge(
          "w-full pl-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition cursor-pointer",
          "[&::-webkit-calendar-picker-indicator]:hidden",
          className
        )}
        onClick={(e) => {
          // If the user clicks the input, also try to show picker for convenience
          try {
             if ('showPicker' in HTMLInputElement.prototype) {
                (e.target as HTMLInputElement).showPicker();
             }
          } catch(err) {}
          onClick?.(e);
        }}
        {...props}
      />
      <Calendar
        className={twMerge(
          "absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none",
          iconClassName
        )}
      />
    </div>
  );
}
