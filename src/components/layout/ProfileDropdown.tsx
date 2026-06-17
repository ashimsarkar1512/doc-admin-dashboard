import  { useState, useRef, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { ShieldCheck, X } from 'lucide-react';

interface ProfileDropdownProps {
  user?: {
    name?: string;
    email?: string;
  };
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = user?.name || 'Admin Darren';
  const userEmail = user?.email || 'admin@telemed.com';
  const initials = userName.substring(0, 2).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-[#1447E6] flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <span className="text-sm font-bold text-white tracking-wide">{initials}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 z-50 overflow-hidden">
          <div className="p-6 pb-4 relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-lg font-bold text-[#1A1F36] mb-1">{userName}</h3>
            <p className="text-[15px] text-slate-500 mb-4">{userEmail}</p>

            <div className="flex items-center gap-2 bg-[#ECFDF3] text-[#027A48] px-4 py-2.5 rounded-xl font-medium text-sm mb-6">
              <ShieldCheck size={18} />
              <span>MFA Enabled</span>
            </div>

            <div className="flex flex-col gap-1">
              <Link
                to="/dashboard/account-settings"
                onClick={() => setIsOpen(false)}
                className="block px-2 py-2 text-[15px] font-medium text-[#1A1F36] hover:bg-slate-50 rounded-lg transition-colors"
              >
                Settings
              </Link>
              
              <button
                onClick={() => {
                  console.log('Static Sign Out clicked');
                  setIsOpen(false);
                }}
                className="block w-full text-left px-2 py-2 text-[15px] font-medium text-[#F04438] hover:bg-red-50 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
