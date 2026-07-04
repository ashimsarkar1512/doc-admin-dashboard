import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/uiSlice";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  Stethoscope,
  Users,
  ClipboardList,
  Package,
  MessageSquare,
  BadgeDollarSign,
  Folders,
  ShoppingBag,
  BookOpen,
  Star,
  Tag,
  Globe,
  UserCog,
  ShieldCheck,
  ScrollText,
  FileText,
  AlertTriangle,
  Map,
  Pill,
  BarChart2,
  Folder,
  Activity,
  LogOut,
} from "lucide-react";

interface Props {
  can: (perm: string) => boolean;
  hasComplianceAccess: boolean;
  handleSignOut: () => void;
  unreadCount: number;
  pendingOrdersCount: number;
  categories: any[];
}

export function DashboardSidebar({
  can,
  hasComplianceAccess,
  handleSignOut,
  unreadCount,
  pendingOrdersCount,
  categories,
}: Props) {
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const [patientMenuOpen, setPatientMenuOpen] = useState(false);
  const [websiteMenuOpen, setWebsiteMenuOpen] = useState(false);
  const [pagesMenuOpen, setPagesMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [complianceMenuOpen, setComplianceMenuOpen] = useState(true);

  return (
    <aside
      className={`hidden xl:flex ${
        collapsed ? "xl:w-16" : "xl:w-64"
      } h-full border-r border-slate-200 bg-white flex-col shrink-0 transition-all duration-300 relative z-20`}
    >
      {/* Floating collapse toggle */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-[30px] z-30 bg-white text-slate-300 hover:text-[#1447E6] transition-colors duration-200"
      >
        {collapsed ? (
          <ChevronRight size={18} strokeWidth={2} />
        ) : (
          <ChevronLeft size={18} strokeWidth={2} />
        )}
      </button>

      {/* Logo at top of sidebar */}
      <div
        className={`flex items-center border-b border-slate-100 h-20 shrink-0 ${
          collapsed ? "justify-center px-2" : "px-5"
        } transition-all duration-200`}
      >
        <img
          src="/images/AdminLogo.png"
          alt="WeightLoss MD Logo"
          className={`object-contain transition-all duration-300 ${
            collapsed ? "w-10 h-10" : "w-32 h-14"
          }`}
        />
      </div>

      {/* Nav links */}
      <nav
        className={`flex-1 overflow-y-auto py-6 space-y-0.5 ${
          collapsed ? "px-2" : "px-3"
        } scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300`}
      >
        <Link
          to="/dashboard"
          activeOptions={{ exact: true }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-all duration-150 [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active]:shadow-sm [&.active_svg]:text-[#1447E6] group"
        >
          <LayoutGrid
            size={20}
            className="text-[#272628] group-hover:text-slate-600 shrink-0 transition-colors"
          />
          {!collapsed && <span className="tracking-wide">Dashboard</span>}
        </Link>

        {can("view:doctor_management") && (
          <Link
            to="/dashboard/providers"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-all duration-150 [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active]:shadow-sm [&.active_svg]:text-[#1447E6] group"
          >
            <Stethoscope
              size={20}
              className="text-[#272628] group-hover:text-slate-600 shrink-0 transition-colors"
            />
            {!collapsed && (
              <span className="tracking-wide">Doctor Management</span>
            )}
          </Link>
        )}

        {can("view:patient_management") &&
          (collapsed ? (
            <button
              onClick={() => {
                dispatch(toggleSidebar());
                setPatientMenuOpen(true);
              }}
              className="flex items-center justify-center p-2.5 w-full rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
              title="Patient Management"
            >
              <Users size={20} className="text-slate-400 shrink-0" />
            </button>
          ) : (
            <div>
              <button
                onClick={() => setPatientMenuOpen(!patientMenuOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Users
                    size={20}
                    className="text-[#272628] group-hover:text-slate-600 shrink-0"
                  />
                  <span className="tracking-wide">Patient Management</span>
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
                    className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                  >
                    All Patients
                  </Link>
                  <Link
                    to="/dashboard/assessment-table"
                    className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                  >
                    Assessment Table
                  </Link>
                </div>
              )}
            </div>
          ))}

        {can("view:assessments") && (
          <Link
            to="/dashboard/assessments"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <ClipboardList size={20} className="text-[#272628] shrink-0" />
            {!collapsed && <span className="tracking-wide">Assessments</span>}
          </Link>
        )}

        {can("view:orders") && (
          <Link
            to="/dashboard/orders"
            className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <div className="flex items-center gap-3">
              <Package size={20} className="text-[#272628] shrink-0" />
              {!collapsed && <span className="tracking-wide">Orders</span>}
            </div>
            {!collapsed && pendingOrdersCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#E88319] text-white text-[10px] font-bold">
                {pendingOrdersCount > 99 ? "99+" : pendingOrdersCount}
              </span>
            )}
          </Link>
        )}

        {can("view:contact_leads") && (
          <Link
            to="/dashboard/contact-leads"
            className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={20} className="text-[#272628] shrink-0" />
              {!collapsed && (
                <span className="tracking-wide">Contact Leads</span>
              )}
            </div>
            {!collapsed && unreadCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#E88319] text-white text-[10px] font-bold">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
        )}

        {can("view:payments") && (
          <Link
            to="/dashboard/payments"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <BadgeDollarSign size={20} className="text-[#272628] shrink-0" />
            {!collapsed && <span className="tracking-wide">Payments</span>}
          </Link>
        )}

        {can("view:service_categories_and_plans") && (
          <Link
            to="/dashboard/categories"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <Folders size={20} className="text-[#272628] shrink-0" />
            {!collapsed && (
              <span className="tracking-wide">Service Category & Plan</span>
            )}
          </Link>
        )}

        {can("view:products") && (
          <Link
            to="/dashboard/products"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <ShoppingBag size={20} className="text-[#272628] shrink-0" />
            {!collapsed && <span className="tracking-wide">Products</span>}
          </Link>
        )}

        <Link
          to="/dashboard/blogs"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
        >
          <BookOpen size={20} className="text-[#272628] shrink-0" />
          {!collapsed && <span className="tracking-wide">Blogs</span>}
        </Link>

        {can("view:testimonials") && (
          <Link
            to="/dashboard/testimonials"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <Star size={20} className="text-[#272628] shrink-0" />
            {!collapsed && <span className="tracking-wide">Testimonials</span>}
          </Link>
        )}

        {can("view:discounts_and_marketing") && (
          <Link
            to="/dashboard/discounts"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <Tag size={20} className="text-[#272628] shrink-0" />
            {!collapsed && (
              <span className="tracking-wide">Discounts & Marketing</span>
            )}
          </Link>
        )}

        {can("view:website_management") &&
          (collapsed ? (
            <button
              onClick={() => {
                dispatch(toggleSidebar());
                setWebsiteMenuOpen(true);
              }}
              className="flex items-center justify-center p-2.5 w-full rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
              title="Website Management"
            >
              <Globe size={20} className="text-slate-400 shrink-0" />
            </button>
          ) : (
            <div>
              <button
                onClick={() => setWebsiteMenuOpen(!websiteMenuOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Globe
                    size={20}
                    className="text-[#272628] group-hover:text-slate-600 shrink-0"
                  />
                  <span className="tracking-wide">Website Management</span>
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
                          activeOptions={{ exact: true }}
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          Home
                        </Link>
                        <Link
                          to="/dashboard/pages/about-us"
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          About Us
                        </Link>
                        <Link
                          to="/dashboard/pages/eligibility"
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          Eligibility
                        </Link>
                        <Link
                          to="/dashboard/pages/contact"
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          Contact
                        </Link>
                        <Link
                          to="/dashboard/pages/medical-team"
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          Medical Team
                        </Link>
                        <Link
                          to="/dashboard/pages/how-it-works"
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          How It Works
                        </Link>
                        <Link
                          to="/dashboard/pages/billing-and-cancellation"
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          Billing & Cancellation
                        </Link>
                        <Link
                          to="/dashboard/pages/report-side-effect"
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          Report Side Effect
                        </Link>
                        <Link
                          to="/dashboard/pages/request-record"
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          Request Record
                        </Link>
                        <Link
                          to="/dashboard/pages/shipping-information"
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          Shipping Information
                        </Link>
                        <Link
                          to="/dashboard/pages/lab-testing"
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          Lab Testing
                        </Link>
                        <Link
                          to="/dashboard/pages/privacy-policy"
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          Privacy Policy
                        </Link>
                        <Link
                          to="/dashboard/pages/terms-of-service"
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          Terms of Service
                        </Link>
                        <Link
                          to="/dashboard/pages/hipaa-notice"
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          HIPAA Notice
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
                    className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                  >
                    Account Settings
                  </Link>
                </div>
              )}
            </div>
          ))}

        {hasComplianceAccess && <hr className="sidebar-divider" />}

        {hasComplianceAccess &&
          (collapsed ? (
            <button
              onClick={() => {
                dispatch(toggleSidebar());
                setComplianceMenuOpen(true);
              }}
              className="flex items-center justify-center p-2.5 w-full rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
              title="Compliance & Access"
            >
              <ShieldCheck size={20} className="text-slate-400 shrink-0" />
            </button>
          ) : (
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
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <UserCog size={18} className="text-slate-500 shrink-0" />
                      <span>Employee Permissions</span>
                    </Link>
                  )}
                  {can("view:compliance_center") && (
                    <Link
                      to="/dashboard/compliance-center"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <ShieldCheck
                        size={18}
                        className="text-slate-500 shrink-0"
                      />
                      <span>Compliance Center</span>
                    </Link>
                  )}
                  {can("view:audit_logs") && (
                    <Link
                      to="/dashboard/audit-logs"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <ScrollText
                        size={18}
                        className="text-slate-500 shrink-0"
                      />
                      <span>Audit Logs</span>
                    </Link>
                  )}
                  {can("view:consent_management") && (
                    <Link
                      to="/dashboard/consent-management"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <FileText size={18} className="text-slate-500 shrink-0" />
                      <span>Consent Management</span>
                    </Link>
                  )}
                  {can("view:incident_management") && (
                    <Link
                      to="/dashboard/incident-management"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <AlertTriangle
                        size={18}
                        className="text-slate-500 shrink-0"
                      />
                      <span>Incident Management</span>
                    </Link>
                  )}
                  {can("view:state_coverage") && (
                    <Link
                      to="/dashboard/state-coverage"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <Map size={18} className="text-slate-500 shrink-0" />
                      <span>State Coverage</span>
                    </Link>
                  )}
                  {can("view:prescription_oversight") && (
                    <Link
                      to="/dashboard/prescription-oversight"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <Pill size={18} className="text-slate-500 shrink-0" />
                      <span>Side effect report</span>
                    </Link>
                  )}
                  {can("view:business_intelligence") && (
                    <Link
                      to="/dashboard/business-intelligence"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <BarChart2
                        size={18}
                        className="text-slate-500 shrink-0"
                      />
                      <span>Business Intelligence</span>
                    </Link>
                  )}
                  {can("view:communication_center") && (
                    <Link
                      to="/dashboard/communication-center"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <MessageSquare
                        size={18}
                        className="text-slate-500 shrink-0"
                      />
                      <span>Communication Center</span>
                    </Link>
                  )}
                  {can("view:document_center") && (
                    <Link
                      to="/dashboard/document-center"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <Folder size={18} className="text-slate-500 shrink-0" />
                      <span>Document Center</span>
                    </Link>
                  )}
                  {can("view:system_health") && (
                    <Link
                      to="/dashboard/system-health"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                    >
                      <Activity size={18} className="text-slate-500 shrink-0" />
                      <span>System Health</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
      </nav>

      {/* Logout */}
      <div
        className={`border-t border-slate-100 ${
          collapsed ? "p-2" : "p-4"
        } hover:bg-red-50 transition-colors duration-200`}
      >
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-100 transition-all duration-200 group text-left"
        >
          <LogOut
            size={18}
            className="shrink-0 group-hover:scale-110 transition-transform"
          />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
