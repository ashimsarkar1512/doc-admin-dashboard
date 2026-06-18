
import { Bell, Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { ToggleSwitch } from '../../website-management/components/shared/ToggleSwitch';
import { useUserPreferences, useUpdateUserPreferences } from '../hooks/useAccountSettings';
import type { UpdateUserPreferencesPayload } from '@/types/auth.types';

export function CommunicationPreferences() {
  const { data: preferences, isLoading } = useUserPreferences();
  const updatePreferences = useUpdateUserPreferences();
  const [localPrefs, setLocalPrefs] = useState<UpdateUserPreferencesPayload>({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
  });

  const handleSave = () => {
    updatePreferences.mutate(localPrefs);
  };

  if (isLoading) {
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
        <div className="p-6 flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
        </div>
      </div>
    );
  }

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
          <ToggleSwitch 
            checked={preferences?.emailNotifications ?? localPrefs.emailNotifications} 
            onChange={(checked) => setLocalPrefs(prev => ({ ...prev, emailNotifications: checked }))}
          />
        </div>

        {/* SMS */}
        <div className="flex items-center justify-between border border-slate-100 rounded-xl p-4 bg-slate-50/30">
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 leading-tight">SMS Notifications</h4>
            <p className="text-sm text-slate-500 mt-0.5">Receive notifications via SMS</p>
          </div>
          <ToggleSwitch 
            checked={preferences?.smsNotifications ?? localPrefs.smsNotifications} 
            onChange={(checked) => setLocalPrefs(prev => ({ ...prev, smsNotifications: checked }))}
          />
        </div>

        {/* Push */}
        <div className="flex items-center justify-between border border-slate-100 rounded-xl p-4 bg-slate-50/30">
          <div>
            <h4 className="text-[15px] font-bold text-slate-800 leading-tight">Push Notifications</h4>
            <p className="text-sm text-slate-500 mt-0.5">Receive via push notification</p>
          </div>
          <ToggleSwitch 
            checked={preferences?.pushNotifications ?? localPrefs.pushNotifications} 
            onChange={(checked) => setLocalPrefs(prev => ({ ...prev, pushNotifications: checked }))}
          />
        </div>

        <div className="pt-2">
          <button 
            onClick={handleSave}
            disabled={updatePreferences.isPending}
            className="flex items-center gap-2 px-6 py-2 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {updatePreferences.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
