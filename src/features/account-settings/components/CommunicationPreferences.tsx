import { Bell, Loader2, Mail, MessageSquare, Smartphone } from "lucide-react";
import { ToggleSwitch } from "../../website-management/components/shared/ToggleSwitch";
import {
  useUpdateUserPreferences,
  useUserPreferences,
} from "../hooks/useAccountSettings";

export function CommunicationPreferences() {
  const { data: preferences, isLoading } = useUserPreferences();
  const updatePreferences = useUpdateUserPreferences();

  const handleToggle = (
    key: "emailNotifications" | "smsNotifications" | "pushNotifications",
    value: boolean,
  ) => {
    if (!preferences) return;
    updatePreferences.mutate({ ...preferences, [key]: value });
  };

  if (isLoading) {
    return (
      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-500">
            <Bell size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 leading-tight">
              Communication Preferences
            </h3>
            <p className="text-[12px] text-slate-500 leading-tight mt-0.5">
              Manage your notification preferences
            </p>
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
          <h3 className="text-sm font-bold text-slate-800 leading-tight">
            Communication Preferences
          </h3>
          <p className="text-[12px] text-slate-500 leading-tight mt-0.5">
            Manage your notification preferences
          </p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Email */}
        <div className="flex items-center justify-between border border-slate-100 rounded-xl p-5 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
              <Mail size={20} />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-slate-800 leading-tight">
                Email Notifications
              </h4>
              <p className="text-sm text-slate-500 mt-1">
                Receive notifications via email
              </p>
            </div>
          </div>
          <ToggleSwitch
            checked={preferences?.emailNotifications ?? true}
            onChange={(checked) => handleToggle("emailNotifications", checked)}
            disabled={updatePreferences.isPending}
          />
        </div>

        {/* SMS */}
        <div className="flex items-center justify-between border border-slate-100 rounded-xl p-5 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
              <Smartphone size={20} />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-slate-800 leading-tight">
                SMS Notifications
              </h4>
              <p className="text-sm text-slate-500 mt-1">
                Receive notifications via SMS
              </p>
            </div>
          </div>
          <ToggleSwitch
            checked={preferences?.smsNotifications ?? true}
            onChange={(checked) => handleToggle("smsNotifications", checked)}
            disabled={updatePreferences.isPending}
          />
        </div>

        {/* Push */}
        <div className="flex items-center justify-between border border-slate-100 rounded-xl p-5 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-slate-800 leading-tight">
                Push Notifications
              </h4>
              <p className="text-sm text-slate-500 mt-1">
                Receive via push notification
              </p>
            </div>
          </div>
          <ToggleSwitch
            checked={preferences?.pushNotifications ?? true}
            onChange={(checked) => handleToggle("pushNotifications", checked)}
            disabled={updatePreferences.isPending}
          />
        </div>
      </div>
    </div>
  );
}
