import { useUserProfile } from "@/features/account-settings/hooks/useAccountSettings";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Link, useNavigate } from "@tanstack/react-router";
import { queryClient } from "@/lib/queryClient";
import { ShieldCheck, User, Settings, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ProfileDropdownProps {
  user?: {
    name?: string;
    email?: string;
  };
}

export function ProfileDropdown({ user: storeUser }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: profile } = useUserProfile();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get user info - first check if profile has nested profile, else use store user
  const profileName = profile?.profile?.name;
  const profileEmail = profile?.email;
  const userName = profileName || storeUser?.name || "N/A";
  const userEmail = profileEmail || storeUser?.email || "admin@telemed.com";
  const mfaEnabled = profile?.mfaEnabled || false;

  const handleSignOut = () => {
    setIsOpen(false);
    queryClient.clear();
    dispatch(logout())
      .unwrap()
      .then(() => {
        navigate({ to: "/" });
      });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-[#1447E6] flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 overflow-hidden"
      >
        {profile?.profile?.avatar ? (
          <img src={profile.profile.avatar} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <User className="text-white w-5 h-5" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in duration-150">
          <div className="p-4 pb-3 relative border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 mb-0.5 truncate">
              {userName}
            </h3>
            <p className="text-xs text-slate-500 mb-2.5 truncate">{userEmail}</p>

            <div className="flex items-center gap-1 bg-[#ECFDF3] text-[#027A48] px-2 py-1 rounded-md font-medium text-[11px] w-fit border border-[#D1FADF]">
              <ShieldCheck size={12} />
              <span>{mfaEnabled ? "MFA Enabled" : "MFA Disabled"}</span>
            </div>
          </div>

          <div className="p-1.5 flex flex-col gap-0.5">
            <Link
              to="/dashboard/account-settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Settings size={14} className="text-slate-400" />
              <span>Settings</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[13px] font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-left"
            >
              <LogOut size={14} className="text-red-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
