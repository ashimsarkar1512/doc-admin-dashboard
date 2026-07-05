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
      <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-500 shrink-0">
            <Bell size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 leading-tight">
              Communication Preferences
            </h3>
            <p className="text-[12px] text-slate-400 leading-tight mt-0.5">
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
    <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-500 shrink-0">
          <Bell size={16} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800 leading-tight">
            Communication Preferences
          </h3>
          <p className="text-[12px] text-slate-400 leading-tight mt-0.5">
            Manage your notification preferences
          </p>
        </div>
      </div>

      <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
        {/* Email */}
        <div className="flex items-center justify-between border border-slate-100 rounded-xl p-3 sm:p-5 bg-slate-50/50 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
              <Mail size={18} />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm sm:text-[15px] font-bold text-slate-800 leading-tight">
                Email Notifications
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
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
        <div className="flex items-center justify-between border border-slate-100 rounded-xl p-3 sm:p-5 bg-slate-50/50 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
              <Smartphone size={18} />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm sm:text-[15px] font-bold text-slate-800 leading-tight">
                SMS Notifications
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
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
        <div className="flex items-center justify-between border border-slate-100 rounded-xl p-3 sm:p-5 bg-slate-50/50 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
              <MessageSquare size={18} />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm sm:text-[15px] font-bold text-slate-800 leading-tight">
                Push Notifications
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
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
