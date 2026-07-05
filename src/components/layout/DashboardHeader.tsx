import { Menu } from "lucide-react";
import { ProfileDropdown } from "./ProfileDropdown";
import { NotificationDropdown } from "./NotificationDropdown";

interface Props {
  setMobileSidebarOpen: (open: boolean) => void;
  pageTitle: string;
  pageSubtitle: string;
  profile: any;
  user: any;
}

export function DashboardHeader({
  setMobileSidebarOpen,
  pageTitle,
  pageSubtitle,
  profile,
  user,
}: Props) {
  return (
    <header className="border-b border-slate-100 bg-white flex items-center justify-between px-3 sm:px-4 md:px-6 z-10 shrink-0 h-16 sm:h-20">
      {/* Hamburger for mobile/tablet */}
      <button
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-150 mr-3 shrink-0"
        onClick={() => setMobileSidebarOpen(true)}
      >
        <Menu size={18} strokeWidth={2} />
      </button>

      {/* Page Title */}
      <div className="flex flex-col justify-center h-20 flex-1 min-w-0">
        <h1 className="m-0 text-[#101828] font-['Quicksand'] text-[16px] md:text-[20px] font-[600] leading-[30px] tracking-[-0.2px] truncate">
          {pageTitle}
        </h1>
        <p className="m-0 mt-0.5 text-[#6A7282] font-['Quicksand'] text-[12px] md:text-[14px] font-[400] leading-[20px] truncate">
          {pageSubtitle}
        </p>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <NotificationDropdown />

        {/* Divider */}
        <div className="w-px h-7 bg-slate-200 mx-1" />

        {/* User info + avatar */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[13px] font-semibold text-slate-800 leading-none">
              {profile?.profile?.name || user?.name || "N/A"}
            </span>
            <span className="text-[11px] text-slate-400 leading-none mt-0.5 font-medium">
              {profile?.role || user?.role || "Admin"}
            </span>
          </div>
          <ProfileDropdown user={user ?? undefined} />
        </div>
      </div>
    </header>
  );
}
