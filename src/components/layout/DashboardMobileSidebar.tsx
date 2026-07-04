import { Link } from "@tanstack/react-router";
import {
  Activity,
  BadgeDollarSign,
  BookOpen,
  ClipboardList,
  Folders,
  Globe,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Package,
  ScrollText,
  ShieldCheck,
  ShoppingBag,
  Star,
  Stethoscope,
  Tag,
  UserCog,
  Users,
  X
} from "lucide-react";

interface Props {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  can: (perm: string) => boolean;
  hasComplianceAccess: boolean;
  handleSignOut: () => void;
}

export function DashboardMobileSidebar({
  mobileSidebarOpen,
  setMobileSidebarOpen,
  can,
  hasComplianceAccess,
  handleSignOut,
}: Props) {
  if (!mobileSidebarOpen) return null;

  return (
    <>
      {/* Mobile sidebar overlay backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        onClick={() => setMobileSidebarOpen(false)}
      />

      {/* Mobile Sidebar - fixed overlay, never affects layout */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Mobile sidebar header */}
        <div className="flex items-center justify-between px-5 h-20 border-b border-slate-100 shrink-0">
          <img
            src="/images/AdminLogo.png"
            alt="WeightLoss MD Logo"
            className="w-32 h-14 object-contain"
          />
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mobile sidebar nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 scrollbar-hide">
          <Link
            to="/dashboard"
            activeOptions={{ exact: true }}
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <LayoutGrid size={20} className="shrink-0" />
            <span>Dashboard</span>
          </Link>
          {can("view:doctor_management") && (
            <Link
              to="/dashboard/providers"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
            >
              <Stethoscope size={20} className="shrink-0" />
              <span>Doctor Management</span>
            </Link>
          )}
          {can("view:patient_management") && (
            <Link
              to="/dashboard/patients"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
            >
              <Users size={20} className="shrink-0" />
              <span>Patient Management</span>
            </Link>
          )}
          {can("view:assessments") && (
            <Link
              to="/dashboard/assessments"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
            >
              <ClipboardList size={20} className="shrink-0" />
              <span>Assessments</span>
            </Link>
          )}
          {can("view:orders") && (
            <Link
              to="/dashboard/orders"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
            >
              <Package size={20} className="shrink-0" />
              <span>Orders</span>
            </Link>
          )}
          {can("view:contact_leads") && (
            <Link
              to="/dashboard/contact-leads"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
            >
              <MessageSquare size={20} className="shrink-0" />
              <span>Contact Leads</span>
            </Link>
          )}
          {can("view:payments") && (
            <Link
              to="/dashboard/payments"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
            >
              <BadgeDollarSign size={20} className="shrink-0" />
              <span>Payments</span>
            </Link>
          )}
          {can("view:service_categories_and_plans") && (
            <Link
              to="/dashboard/categories"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
            >
              <Folders size={20} className="shrink-0" />
              <span>Service Category & Plan</span>
            </Link>
          )}
          {can("view:products") && (
            <Link
              to="/dashboard/products"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
            >
              <ShoppingBag size={20} className="shrink-0" />
              <span>Products</span>
            </Link>
          )}
          {can("view:website_management") && (
            <Link
              to="/dashboard/blogs"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
            >
              <BookOpen size={20} className="shrink-0" />
              <span>Blogs</span>
            </Link>
          )}
          {can("view:testimonials") && (
            <Link
              to="/dashboard/testimonials"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
            >
              <Star size={20} className="shrink-0" />
              <span>Testimonials</span>
            </Link>
          )}
          {can("view:discounts_and_marketing") && (
            <Link
              to="/dashboard/discounts"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
            >
              <Tag size={20} className="shrink-0" />
              <span>Discounts & Marketing</span>
            </Link>
          )}
          {can("view:website_management") && (
            <Link
              to="/dashboard/website-management"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
            >
              <Globe size={20} className="shrink-0" />
              <span>Website Management</span>
            </Link>
          )}
          {can("view:website_management") && (
            <Link
              to="/dashboard/pages"
              activeOptions={{ exact: true }}
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600"
            >
              <span>Home</span>
            </Link>
          )}
          {can("view:website_management") && (
            <Link
              to="/dashboard/pages/eligibility"
              activeOptions={{ exact: true }}
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600"
            >
              <span>Eligibility</span>
            </Link>
          )}
          <Link
            to="/dashboard/account-settings"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <UserCog size={20} className="shrink-0" />
            <span>Account Settings</span>
          </Link>
          {hasComplianceAccess && <hr className="my-2 border-slate-100" />}
          {can("view:employee_permissions") && (
            <Link
              to="/dashboard/employee-permissions"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
            >
              <UserCog size={20} className="shrink-0" />
              <span>Employee Permissions</span>
            </Link>
          )}
          {can("view:compliance_center") && (
            <Link
              to="/dashboard/compliance-center"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
            >
              <ShieldCheck size={20} className="shrink-0" />
              <span>Compliance Center</span>
            </Link>
          )}
          {can("view:audit_logs") && (
            <Link
              to="/dashboard/audit-logs"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
            >
              <ScrollText size={20} className="shrink-0" />
              <span>Audit Logs</span>
            </Link>
          )}
          {can("view:system_health") && (
            <Link
              to="/dashboard/system-health"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
            >
              <Activity size={20} className="shrink-0" />
              <span>System Health</span>
            </Link>
          )}
        </nav>

        {/* Mobile logout */}
        <div className="border-t border-slate-100 p-4">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-all text-left"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
