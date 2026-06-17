
import { LogOut } from 'lucide-react';
import { AccountInformation } from '../components/AccountInformation';
import { PasswordManagement } from '../components/PasswordManagement';
import { SecurityAndDevice } from '../components/SecurityAndDevice';
import { CommunicationPreferences } from '../components/CommunicationPreferences';

export default function AccountSettingsPage() {
  return (
    <div className="p-6 max-w-4xl space-y-6 bg-[#FAFAFA] min-h-full font-sans pb-20">
      
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Account Settings</h2>
        <p className="text-sm font-medium text-slate-500">Manage your account</p>
      </div>

      <div className="space-y-6">
        <AccountInformation />
        <PasswordManagement />
        <SecurityAndDevice />
        <CommunicationPreferences />
      </div>

      {/* Bottom Log Out */}
      <div className="pt-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors">
          <LogOut size={16} /> Log Out
        </button>
      </div>

    </div>
  );
}
