import {
  ChevronDown,
  ChevronRight,
  Laptop,
  Loader2,
  MonitorSmartphone,
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

  const formatLastLogin = (dateStr: string) => {
    const d = new Date(dateStr);
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    // const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = d.getHours() >= 12 ? "pm" : "am";
    const hour12 = d.getHours() % 12 || 12;
    return `${month} ${day} - ${hour12.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  };

  if (profileLoading || sessionsLoading) {
    return (
      <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="p-5 flex items-center gap-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
            <MonitorSmartphone size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 leading-tight">
              Security &amp; Device
            </h3>
            <p className="text-[12px] text-slate-400 leading-tight mt-0.5">
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
    <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
          <MonitorSmartphone size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800 leading-tight">
            Security &amp; Device
          </h3>
          <p className="text-[12px] text-slate-400 leading-tight mt-0.5">
            The security checkup of your account
          </p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* 2 Step Verification — Figma style: plain row, no icon box */}
        <div className="flex items-center justify-between py-1">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 leading-tight">
              2 Step Verification
            </h4>
            <p className="text-[12px] text-slate-400 mt-0.5">
              {profile?.mfaEnabled
                ? `Activated on phone ${profile?.profile?.phone?.replace(/(\d{3})\d+(\d{2})/, "$1*********$2") ?? "***"} since 20 May, 2026`
                : "2FA is currently disabled"}
            </p>
          </div>
          <ToggleSwitch
            checked={profile?.mfaEnabled || false}
            onChange={handleToggleMfa}
            disabled={toggleMfa.isPending}
          />
        </div>

        {/* Device & Active Sessions — warm cream box */}
        <div className="border border-amber-200 rounded-xl overflow-hidden">
          <div className="bg-amber-50 px-4 pt-4 pb-2">
            <h4 className="text-[13px] font-semibold text-amber-800 mb-3">
              Your Device &amp; active sessions
            </h4>

            <div className="space-y-2">
              {sessions && sessions.length > 0 ? (
                sessions.map((device) => {
                  const isExpanded = expandedDevices.includes(device.deviceName);
                  const isMobile = device.deviceName.toLowerCase().includes("mobile")
                    || device.deviceName.toLowerCase().includes("ios")
                    || device.deviceName.toLowerCase().includes("android");

                  return (
                    <div
                      key={device.deviceName}
                      className="border border-amber-200 rounded-lg bg-white/60"
                    >
                      {/* Device row header */}
                      <div
                        className="flex items-center justify-between px-4 py-3 cursor-pointer"
                        onClick={() => toggleDeviceExpand(device.deviceName)}
                      >
                        <div className="flex items-center gap-2">
                          {isMobile ? (
                            <Smartphone size={16} className="text-amber-700" />
                          ) : (
                            <Laptop size={16} className="text-amber-700" />
                          )}
                          <span className="text-[13px] font-semibold text-amber-900">
                            {device.deviceName}
                            {device.isActiveNow && (
                              <span className="font-normal"> - Active now</span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-amber-700 font-medium">
                          <span>
                            {device.sessions.length} session
                            {device.sessions.length !== 1 ? "s" : ""} on{" "}
                            {isMobile ? "iOS iPhone(s)" : "Windows computer(s)"}
                          </span>
                          {isExpanded ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                        </div>
                      </div>

                      {/* Expanded sessions rows */}
                      {isExpanded && device.sessions.length > 0 && (
                        <div className="border-t border-amber-100">
                          {device.sessions.map((session) => (
                            <div
                              key={session.sessionId}
                              className="grid grid-cols-3 gap-2 px-4 py-2.5 border-b border-amber-100/60 last:border-0"
                            >
                              {/* Last login */}
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[11px] text-amber-600 font-medium">
                                  Last login:
                                </span>
                                <span className="text-[11px] text-amber-800">
                                  {formatLastLogin(session.lastLogin)}
                                </span>
                              </div>
                              {/* IP Address */}
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[11px] text-amber-600 font-medium">
                                  IP Address:
                                </span>
                                <span className="text-[11px] text-amber-800">
                                  {session.ipAddress}
                                </span>
                              </div>
                              {/* Session Due */}
                              <div className="flex flex-col gap-0.5 items-end">
                                <span className="text-[11px] text-amber-600 font-medium">
                                  Session Due:
                                </span>
                                <span className="text-[11px] font-semibold text-amber-700">
                                  {session.sessionDue}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-amber-700 py-4 text-sm">
                  No active sessions
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Update Password button — matches Figma bottom placement */}
        <div className="pt-1">
          <button
            type="button"
            className="px-5 py-2 bg-[#1447E6] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
