import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export default function Dialog({ isOpen, onClose, title, children, maxWidthClass = 'max-w-lg' }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 transition-opacity">
      <div 
        className="fixed inset-0 z-[9998]" 
        onClick={onClose} 
        aria-hidden="true"
      />
      <div 
        ref={dialogRef}
        className={`relative z-[9999] w-full ${maxWidthClass} bg-white rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-4 py-3.5 sm:p-6 border-b border-gray-100">
          <h2 className="text-base sm:text-xl font-semibold text-gray-900">{title}</h2>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="px-4 py-4 sm:p-6 overflow-y-auto flex-1 scrollbar-hide">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
