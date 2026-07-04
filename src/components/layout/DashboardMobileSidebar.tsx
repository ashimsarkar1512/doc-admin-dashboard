import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  BadgeDollarSign,
  BarChart2,
  BookOpen,
  ChevronDown,
  ClipboardList,
  FileText,
  Folder,
  Folders,
  Globe,
  LayoutGrid,
  LogOut,
  Map,
  MessageSquare,
  Package,
  Pill,
  ScrollText,
  ShieldCheck,
  ShoppingBag,
  Star,
  Stethoscope,
  Tag,
  UserCog,
  Users,
  X,
} from "lucide-react";

interface Props {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  can: (perm: string) => boolean;
  hasComplianceAccess: boolean;
  handleSignOut: () => void;
  unreadCount: number;
  pendingOrdersCount: number;
  categories: any[];
}

export function DashboardMobileSidebar({
  mobileSidebarOpen,
  setMobileSidebarOpen,
  can,
  hasComplianceAccess,
  handleSignOut,
  unreadCount,
  pendingOrdersCount,
  categories,
}: Props) {
  const location = useLocation();

  const [patientMenuOpen, setPatientMenuOpen] = useState(false);
  const [websiteMenuOpen, setWebsiteMenuOpen] = useState(false);
  const [pagesMenuOpen, setPagesMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [complianceMenuOpen, setComplianceMenuOpen] = useState(true);

  if (!mobileSidebarOpen) return null;

  return (
    <>
      {/* Mobile sidebar overlay backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
        onClick={() => setMobileSidebarOpen(false)}
      />

      {/* Mobile Sidebar - fixed overlay, never affects layout */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out xl:hidden ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
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
            <div>
              <button
                onClick={() => setPatientMenuOpen(!patientMenuOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Users size={20} className="shrink-0" />
                  <span>Patient Management</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${
                    patientMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {patientMenuOpen && (
                <div className="pl-6 mt-1 space-y-1">
                  <Link
                    to="/dashboard/patients"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                  >
                    All Patients
                  </Link>
                  <Link
                    to="/dashboard/assessment-table"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                  >
                    Assessment Table
                  </Link>
                </div>
              )}
            </div>
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
              className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
            >
              <div className="flex items-center gap-3">
                <Package size={20} className="shrink-0" />
                <span>Orders</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#E88319] text-white text-[10px] font-bold">
                  {pendingOrdersCount > 99 ? "99+" : pendingOrdersCount}
                </span>
              )}
            </Link>
          )}

          {can("view:contact_leads") && (
            <Link
              to="/dashboard/contact-leads"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={20} className="shrink-0" />
                <span>Contact Leads</span>
              </div>
              {unreadCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#E88319] text-white text-[10px] font-bold">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
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

          <Link
            to="/dashboard/blogs"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <BookOpen size={20} className="shrink-0" />
            <span>Blogs</span>
          </Link>

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
            <div>
              <button
                onClick={() => setWebsiteMenuOpen(!websiteMenuOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Globe size={20} className="shrink-0" />
                  <span>Website Management</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${
                    websiteMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {websiteMenuOpen && (
                <div className="pl-6 mt-1 space-y-1">
                  <Link
                    to="/dashboard/website-management"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                  >
                    Website Setting
                  </Link>

                  <div>
                    <button
                      onClick={() => setPagesMenuOpen(!pagesMenuOpen)}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <span>Pages</span>
                      <ChevronDown
                        size={14}
                        className={`text-slate-400 transition-transform duration-200 ${
                          pagesMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {pagesMenuOpen && (
                      <div className="pl-4 mt-1 space-y-1">
                        <Link
                          to="/dashboard/pages"
                          onClick={() => setMobileSidebarOpen(false)}
                          activeOptions={{ exact: true }}
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          Home
                        </Link>
                        <Link
                          to="/dashboard/pages/eligibility"
                          onClick={() => setMobileSidebarOpen(false)}
                          activeOptions={{ exact: true }}
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          Eligibility
                        </Link>
                           <Link
                          to="/dashboard/pages/coverage"
                          onClick={() => setMobileSidebarOpen(false)}
                          activeOptions={{ exact: true }}
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          Coverage
                        </Link>
                           <Link
                          to="/dashboard/pages/faq"
                          onClick={() => setMobileSidebarOpen(false)}
                          activeOptions={{ exact: true }}
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          Faq
                        </Link>
                        <Link
                          to="/dashboard/pages/contact"
                          onClick={() => setMobileSidebarOpen(false)}
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          Contact
                        </Link>
                        <Link
                          to="/dashboard/pages/medical-team"
                          onClick={() => setMobileSidebarOpen(false)}
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          Medical Team
                        </Link>
                        <Link
                          to="/dashboard/pages/how-it-works"
                          onClick={() => setMobileSidebarOpen(false)}
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          How It Works
                        </Link>

                        <div>
                          <button
                            onClick={() =>
                              setServicesMenuOpen(!servicesMenuOpen)
                            }
                            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                          >
                            <span>Services</span>
                            <ChevronDown
                              size={14}
                              className={`text-slate-400 transition-transform duration-200 ${
                                servicesMenuOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {servicesMenuOpen && (
                            <div className="pl-4 mt-1 space-y-1">
                              {categories?.map((category) => {
                                const slug = category.name
                                  .toLowerCase()
                                  .replace(/\s*&\s*/g, "-")
                                  .replace(/\s+/g, "-");
                                const isActive = location.href.includes(
                                  `/dashboard/services?${slug}`,
                                );
                                return (
                                  <Link
                                    key={category.id}
                                    to={`/dashboard/services?${slug}` as any}
                                    onClick={() => setMobileSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                      isActive
                                        ? "bg-[#EFF6FF] text-[#1447E6] font-semibold"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                  >
                                    {category.name}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/dashboard/account-settings"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                  >
                    Account Settings
                  </Link>
                </div>
              )}
            </div>
          )}
          {hasComplianceAccess && <hr className="my-2 border-slate-100" />}

          {hasComplianceAccess && (
            <div>
              <button
                onClick={() => setComplianceMenuOpen(!complianceMenuOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-colors group"
              >
                <span>Compliance & Access</span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${
                    complianceMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {complianceMenuOpen && (
                <div className="pl-3 mt-1 space-y-1">
                  {can("view:employee_permissions") && (
                    <Link
                      to="/dashboard/employee-permissions"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <UserCog size={18} className="shrink-0" />
                      <span>Employee Permissions</span>
                    </Link>
                  )}
                  {can("view:compliance_center") && (
                    <Link
                      to="/dashboard/compliance-center"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <ShieldCheck size={18} className="shrink-0" />
                      <span>Compliance Center</span>
                    </Link>
                  )}
                  {can("view:audit_logs") && (
                    <Link
                      to="/dashboard/audit-logs"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <ScrollText size={18} className="shrink-0" />
                      <span>Audit Logs</span>
                    </Link>
                  )}
                  {can("view:consent_management") && (
                    <Link
                      to="/dashboard/consent-management"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <FileText size={18} className="shrink-0" />
                      <span>Consent Management</span>
                    </Link>
                  )}
                  {can("view:incident_management") && (
                    <Link
                      to="/dashboard/incident-management"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <AlertTriangle size={18} className="shrink-0" />
                      <span>Incident Management</span>
                    </Link>
                  )}
                  {can("view:state_coverage") && (
                    <Link
                      to="/dashboard/state-coverage"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <Map size={18} className="shrink-0" />
                      <span>State Coverage</span>
                    </Link>
                  )}
                  {can("view:prescription_oversight") && (
                    <Link
                      to="/dashboard/prescription-oversight"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <Pill size={18} className="shrink-0" />
                      <span>Side effect report</span>
                    </Link>
                  )}
                  {can("view:business_intelligence") && (
                    <Link
                      to="/dashboard/business-intelligence"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <BarChart2 size={18} className="shrink-0" />
                      <span>Business Intelligence</span>
                    </Link>
                  )}
                  {can("view:communication_center") && (
                    <Link
                      to="/dashboard/communication-center"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <MessageSquare size={18} className="shrink-0" />
                      <span>Communication Center</span>
                    </Link>
                  )}
                  {can("view:document_center") && (
                    <Link
                      to="/dashboard/document-center"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <Folder size={18} className="shrink-0" />
                      <span>Document Center</span>
                    </Link>
                  )}
                  {can("view:system_health") && (
                    <Link
                      to="/dashboard/system-health"
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <Activity size={18} className="shrink-0" />
                      <span>System Health</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
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
