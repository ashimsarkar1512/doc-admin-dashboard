import {
  ChevronDown,
  ChevronRight,
  Laptop,
  Loader2,
  MonitorSmartphone,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { ToggleSwitch } from "../../website-management/components/shared/ToggleSwitch";
import {
  useSessions,
  useToggleMfa,
  useUserProfile,
} from "../hooks/useAccountSettings";

export function SecurityAndDevice() {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: sessions, isLoading: sessionsLoading } = useSessions();
  const toggleMfa = useToggleMfa();
  const [expandedDevices, setExpandedDevices] = useState<string[]>([
    "Unknown device",
  ]);

  const toggleDeviceExpand = (deviceName: string) => {
    setExpandedDevices((prev) =>
      prev.includes(deviceName)
        ? prev.filter((d) => d !== deviceName)
        : [...prev, deviceName],
    );
  };

  const handleToggleMfa = () => {
    toggleMfa.mutate();
  };

  if (profileLoading || sessionsLoading) {
    return (
      <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
            <MonitorSmartphone size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 leading-tight">
              Security & Device
            </h3>
            <p className="text-[12px] text-slate-500 leading-tight mt-0.5">
              The security checkup of your account
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
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
          <MonitorSmartphone size={16} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 leading-tight">
            Security & Device
          </h3>
          <p className="text-[12px] text-slate-500 leading-tight mt-0.5">
            The security checkup of your account
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 2 Step Verification */}
        <div className="flex items-center justify-between border border-slate-100 rounded-xl p-5 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-slate-800 leading-tight">
                2 Step Verification
              </h4>
              <p className="text-sm text-slate-500 mt-1">
                {profile?.mfaEnabled
                  ? "2FA is currently enabled"
                  : "2FA is currently disabled"}
              </p>
            </div>
          </div>
          <ToggleSwitch
            checked={profile?.mfaEnabled || false}
            onChange={handleToggleMfa}
            disabled={toggleMfa.isPending}
          />
        </div>

        {/* Device & Active Sessions */}
        <div className="border border-amber-200 rounded-xl overflow-hidden">
          <div className="p-5 bg-amber-50/30">
            <h4 className="text-[15px] font-bold text-amber-900 mb-4">
              Your Device & active sessions
            </h4>

            <div className="space-y-3">
              {sessions && sessions.length > 0 ? (
                sessions.map((device) => (
                  <div
                    key={device.deviceName}
                    className="border border-amber-200 rounded-lg bg-amber-50/50 p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {device.deviceName.toLowerCase().includes("mobile") ? (
                          <Smartphone size={18} className="text-amber-700" />
                        ) : (
                          <Laptop size={18} className="text-amber-700" />
                        )}
                        <span className="font-bold text-amber-900 text-[15px]">
                          {device.deviceName}{" "}
                          {device.isActiveNow ? "- Active now" : ""}
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-2 text-sm font-medium text-amber-700 cursor-pointer"
                        onClick={() => toggleDeviceExpand(device.deviceName)}
                      >
                        {expandedDevices.includes(device.deviceName) ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </div>
                    </div>

                    {expandedDevices.includes(device.deviceName) && (
                      <div className="space-y-2 pl-7">
                        {device.sessions.map((session) => (
                          <div
                            key={session.sessionId}
                            className="flex flex-col gap-1 border-b border-amber-200/50 pb-2 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center gap-2 text-sm">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full font-medium ${session.isCurrentSession ? "bg-green-500/10 text-green-700" : "bg-slate-200 text-slate-600"}`}
                              >
                                {session.isCurrentSession
                                  ? "Current Session"
                                  : "Previous"}
                              </span>
                              <span className="text-amber-800">
                                IP Address: {session.ipAddress}
                              </span>
                            </div>
                            <div className="text-xs text-amber-700">
                              Last login:{" "}
                              {new Date(session.lastLogin).toLocaleString()} •
                              Expires: {session.sessionDue}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-amber-700 py-4">
                  No active sessions
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
