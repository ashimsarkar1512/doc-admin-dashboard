
import { Lock, EyeOff } from 'lucide-react';
import { FormInput } from '../../website-management/components/shared/FormInput';

export function PasswordManagement() {
  return (
    <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
          <Lock size={16} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 leading-tight">Password Management</h3>
          <p className="text-[12px] text-slate-500 leading-tight mt-0.5">Update passwords for admin and other roles</p>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <FormInput label="New Password" type="password" placeholder="Enter new password" />
            <button className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600">
              <EyeOff size={16} />
            </button>
          </div>
          <div className="relative">
            <FormInput label="Confirm Password" type="password" placeholder="Confirm new password" />
            <button className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600">
              <EyeOff size={16} />
            </button>
          </div>
        </div>

        <button className="px-6 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          Update Password
        </button>

        {/* Requirements Box */}
        <div className="border border-amber-200 bg-amber-50 rounded-lg p-5">
          <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <ShieldAlertIcon /> Password Requirements:
          </h4>
          <ul className="text-[13px] text-amber-700 space-y-1.5 pl-6 list-disc">
            <li>At least 8 characters long</li>
            <li>Include uppercase and lowercase letters</li>
            <li>Include at least one number</li>
            <li>Include at least one special character</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ShieldAlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M12 8v4"/>
      <path d="M12 16h.01"/>
    </svg>
  );
}
