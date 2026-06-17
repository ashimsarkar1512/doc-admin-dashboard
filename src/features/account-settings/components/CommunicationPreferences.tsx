
import { Bell } from 'lucide-react';
import { ToggleSwitch } from '../../website-management/components/shared/ToggleSwitch';

export function CommunicationPreferences() {
  return (
    <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-500">
          <Bell size={16} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 leading-tight">Communication Preferences</h3>
          <p className="text-[12px] text-slate-500 leading-tight mt-0.5">Manage your notification preferences</p>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {/* Email */}
        <div className="flex items-center justify-between border border-slate-100 rounded-xl p-4 bg-slate-50/30">
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 leading-tight">Email Notifications</h4>
            <p className="text-sm text-slate-500 mt-0.5">Receive notifications via email</p>
          </div>
          <ToggleSwitch defaultChecked={true} />
        </div>

        {/* SMS */}
        <div className="flex items-center justify-between border border-slate-100 rounded-xl p-4 bg-slate-50/30">
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 leading-tight">SMS Notifications</h4>
            <p className="text-sm text-slate-500 mt-0.5">Receive notifications via SMS</p>
          </div>
          <ToggleSwitch defaultChecked={true} />
        </div>

        {/* Push */}
        <div className="flex items-center justify-between border border-slate-100 rounded-xl p-4 bg-slate-50/30">
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 leading-tight">Push Notifications</h4>
            <p className="text-sm text-slate-500 mt-0.5">Receive via push notification</p>
          </div>
          <ToggleSwitch defaultChecked={true} />
        </div>

        <div className="pt-2">
          <button className="px-6 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
