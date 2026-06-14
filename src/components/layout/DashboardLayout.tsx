import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { ProfileDropdown } from './ProfileDropdown';
import { getContactLeads } from '@/api/endpoints/contact-leads.api';
import {
  LayoutGrid,
  Folders,
  ShoppingBag,
  Stethoscope,
  Users,
  Globe,
  UserCog,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Package,
  MessageSquare,
  BadgeDollarSign,
  Star,
  Tag,
  ClipboardList,
  ShieldCheck,
  ScrollText,
  FileText,
  AlertTriangle,
  Map,
  Pill,
  BarChart2,
  Folder,
  Activity,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar, setPageHeader } from '@/store/uiSlice';



// Route to title mapping for cleaner code
const routeTitleMap: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your medical practice metrics' },
  '/dashboard/': { title: 'Dashboard', subtitle: 'Overview of your medical practice metrics' },
  '/dashboard/providers': { title: 'Doctor Management', subtitle: 'Manage doctors, schedules, and clinical staff' },
  '/dashboard/patients': { title: 'Patient Management', subtitle: 'View patient records, profiles, and history' },
  '/dashboard/orders': { title: 'Orders', subtitle: 'Manage patient orders and prescriptions' },
  '/dashboard/contact-leads': { title: 'Contact Leads', subtitle: 'Manage contact inquiries and leads' },
  '/dashboard/payments': { title: 'Payments', subtitle: 'Manage transactions and billing' },
  '/dashboard/categories': { title: 'Categories', subtitle: 'Manage assessment and product categories' },
  '/dashboard/assessments': { title: 'Assessments', subtitle: 'Create and manage user assessments for services' },
  '/dashboard/assessment-table': { title: 'Assessment Table', subtitle: 'Manage patient assessments and records' },
  '/dashboard/assessment-table/$assessmentId/preview': { title: 'Preview Details', subtitle: 'Review consultation details before submitting for medical review' },
  '/dashboard/checkout': { title: 'Checkout', subtitle: 'Review your order and complete your purchase' },
  '/dashboard/products': { title: 'Products', subtitle: 'Manage inventory, pricing, and details' },
  '/dashboard/testimonials': { title: 'Testimonials', subtitle: 'Manage patient testimonials and reviews' },
  '/dashboard/discounts': { title: 'Discounts & Marketing', subtitle: 'Manage promotional campaigns and discounts' },
  '/dashboard/website-management': { title: 'Website Management', subtitle: 'Manage your website' },
  '/dashboard/pages': { title: 'Website Management', subtitle: 'Manage your website' },
  '/dashboard/employee-permissions': { title: 'Employee Permissions', subtitle: 'Manage system administrators, roles, and permissions' },
  '/dashboard/compliance-center': { title: 'Compliance Center', subtitle: 'Monitor regulatory compliance checks and audit results' },
  '/dashboard/audit-logs': { title: 'Audit Logs', subtitle: 'Track all system activity and user actions for compliance' },
  '/dashboard/consent-management': { title: 'Consent Management', subtitle: 'Manage and track patient consent forms and authorizations' },
  '/dashboard/incident-management': { title: 'Incident Management', subtitle: 'Track, investigate and resolve compliance and system incidents' },
  '/dashboard/state-coverage': { title: 'State Coverage', subtitle: 'Overview of service coverage and provider availability by state' },
  '/dashboard/prescription-oversight': { title: 'Prescription Oversight', subtitle: 'Monitor and manage active patient prescriptions and medications' },
  '/dashboard/business-intelligence': { title: 'Business Intelligence', subtitle: 'Key performance metrics and data-driven insights for decision making' },
  '/dashboard/communication-center': { title: 'Communication Center', subtitle: 'Manage patient messages, internal communications, and notifications' },
  '/dashboard/document-center': { title: 'Document Center', subtitle: 'Centralized storage for policies, forms, reports, and compliance documents' },
  '/dashboard/system-health': { title: 'System Health', subtitle: 'Real-time status and performance monitoring for all platform services' },
  '/dashboard/profile': { title: 'Profile', subtitle: 'Manage your profile and settings' },
};

export default function DashboardLayout() {
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const pageTitle = useAppSelector((state) => state.ui.pageTitle);
  const pageSubtitle = useAppSelector((state) => state.ui.pageSubtitle);
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Fetch unread contact leads count for sidebar badge
  const { data: unreadData } = useQuery({
    queryKey: ['contact-leads-unread-count'],
    queryFn: () => getContactLeads({ read: false, limit: 1 }),
    enabled: isAuthenticated,
    refetchInterval: 5000, // refresh every 5 seconds to match leads table
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
  const unreadCount = unreadData?.meta?.total ?? 0;
  
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Local state for submenus
  const [patientMenuOpen, setPatientMenuOpen] = useState(false);
  const [complianceMenuOpen, setComplianceMenuOpen] = useState(true);

  // Synchronize route changes to Redux Page Header State
  useEffect(() => {
    const path = location.pathname;
    const routeInfo = routeTitleMap[path] || routeTitleMap['/dashboard'];
    
    dispatch(setPageHeader(routeInfo));
  }, [location.pathname, dispatch]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-primaryBg font-sans">
      {/* Sidebar – full height, includes logo */}
      <aside
        className={`${
          collapsed ? 'w-[68px]' : 'w-64'
        } h-full border-r border-slate-200 bg-white flex flex-col shrink-0 z-20 transition-all duration-300 relative`}
      >
        {/* Toggle arrow button */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors z-30 text-slate-500"
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>

        {/* Logo at top of sidebar */}
        <div className={`flex items-center border-b border-slate-100 h-20 shrink-0 ${collapsed ? 'justify-center px-3' : 'px-6'}`}>
          <img
            src="/images/AdminLogo.png"
            alt="WeightLoss MD Logo"
            className={`object-contain transition-all duration-300 ${collapsed ? 'w-[40px] h-[40px]' : 'w-[12rem] h-[68px]'}`}
          />
        </div>

        {/* Nav links */}
        <nav className={`flex-1 overflow-y-auto py-6 space-y-1.5 ${collapsed ? 'px-2' : 'px-4'} custom-scrollbar`}>
          {/* Dashboard */}
          <Link
            to="/dashboard"
            activeOptions={{ exact: true }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
          >
            <LayoutGrid size={20} className="text-slate-500 shrink-0" />
            {!collapsed && <span>Dashboard</span>}
          </Link>

          {/* Doctor Management */}
          <Link
            to="/dashboard/providers"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
          >
            <Stethoscope size={20} className="text-slate-500 shrink-0" />
            {!collapsed && <span>Doctor Management</span>}
          </Link>

          {/* Patient Management */}
          {collapsed ? (
            <Link
              to="/dashboard/patients"
              className="flex items-center justify-center p-2.5 rounded-lg text-slate-700 hover:bg-slate-50 [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active_svg]:text-[#1447E6]"
              title="Patient Management"
            >
              <Users size={20} className="text-slate-500 shrink-0" />
            </Link>
          ) : (
            <div>
              <button
                onClick={() => setPatientMenuOpen(!patientMenuOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-slate-500 group-hover:text-slate-700 shrink-0" />
                  <span>Patient Management</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${
                    patientMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Submenus */}
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
          )}

          {/* Assessments */}
          <Link
            to="/dashboard/assessments"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
          >
            <ClipboardList size={20} className="text-slate-500 shrink-0" />
            {!collapsed && <span>Assessments</span>}
          </Link>

          {/* Orders */}
          <Link
            to="/dashboard/orders"
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
          >
            <div className="flex items-center gap-3">
              <Package size={20} className="text-slate-500 shrink-0" />
              {!collapsed && <span>Orders</span>}
            </div>
            {!collapsed && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#E88319] text-white text-[10px] font-bold">
                3
              </span>
            )}
          </Link>

          {/* Checkout */}
          <Link
            to="/dashboard/checkout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
          >
            <ShoppingBag size={20} className="text-slate-500 shrink-0" />
            {!collapsed && <span>Checkout</span>}
          </Link>

          {/* Contact Leads */}
          <Link
            to="/dashboard/contact-leads"
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={20} className="text-slate-500 shrink-0" />
              {!collapsed && <span>Contact Leads</span>}
            </div>
            {!collapsed && unreadCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#E88319] text-white text-[10px] font-bold">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Payments */}
          <Link
            to="/dashboard/payments"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
          >
            <BadgeDollarSign size={20} className="text-slate-500 shrink-0" />
            {!collapsed && <span>Payments</span>}
          </Link>

          {/* Categories */}
          <Link
            to="/dashboard/categories"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
          >
            <Folders size={20} className="text-slate-500 shrink-0" />
            {!collapsed && <span>Categories</span>}
          </Link>



          {/* Products */}
          <Link
            to="/dashboard/products"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
          >
            <ShoppingBag size={20} className="text-slate-500 shrink-0" />
            {!collapsed && <span>Products</span>}
          </Link>
          
          {/* Testimonials */}
          <Link
            to="/dashboard/testimonials"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
          >
            <Star size={20} className="text-slate-500 shrink-0" />
            {!collapsed && <span>Testimonials</span>}
          </Link>

          {/* Discounts & Marketing */}
          <Link
            to="/dashboard/discounts"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
          >
            <Tag size={20} className="text-slate-500 shrink-0" />
            {!collapsed && <span>Discounts & Marketing</span>}
          </Link>

          {/* Website Management – direct link, no dropdown */}
          <Link
            to="/dashboard/website-management"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6] ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Website Management' : undefined}
          >
            <Globe size={20} className="text-slate-500 shrink-0" />
            {!collapsed && <span>Website Management</span>}
          </Link>

          {/* Pages – single Home Page entry (no dropdown) */}
          {!collapsed && (
            <div className="pl-6">
              <Link
                to="/dashboard/pages"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
              >
                Home Page
              </Link>
            </div>
          )}

          <hr className="my-2 border-slate-200" />

          {/* Compliance & Access */}
          {collapsed ? (
            <Link
              to="/dashboard/employee-permissions"
              className="flex items-center justify-center p-2.5 rounded-lg text-slate-700 hover:bg-slate-50 [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active_svg]:text-[#1447E6]"
              title="Compliance & Access"
            >
              <ShieldCheck size={20} className="text-slate-500 shrink-0" />
            </Link>
          ) : (
            <div>
              <button
                onClick={() => setComplianceMenuOpen(!complianceMenuOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-50 transition-colors group"
              >
                <span>Compliance & Access</span>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${
                    complianceMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Submenus */}
              {complianceMenuOpen && (
                <div className="pl-3 mt-1 space-y-1">
                  <Link
                    to="/dashboard/employee-permissions"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <UserCog size={20} className="text-slate-500 shrink-0" />
                    <span>Employee Permissions</span>
                  </Link>
                  <Link
                    to="/dashboard/compliance-center"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <ShieldCheck size={20} className="text-slate-500 shrink-0" />
                    <span>Compliance Center</span>
                  </Link>
                  <Link
                    to="/dashboard/audit-logs"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <ScrollText size={20} className="text-slate-500 shrink-0" />
                    <span>Audit Logs</span>
                  </Link>
                  <Link
                    to="/dashboard/consent-management"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <FileText size={20} className="text-slate-500 shrink-0" />
                    <span>Consent Management</span>
                  </Link>
                  <Link
                    to="/dashboard/incident-management"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <AlertTriangle size={20} className="text-slate-500 shrink-0" />
                    <span>Incident Management</span>
                  </Link>
                  <Link
                    to="/dashboard/state-coverage"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <Map size={20} className="text-slate-500 shrink-0" />
                    <span>State Coverage</span>
                  </Link>
                  <Link
                    to="/dashboard/prescription-oversight"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <Pill size={20} className="text-slate-500 shrink-0" />
                    <span>Prescription Oversight</span>
                  </Link>
                  <Link
                    to="/dashboard/business-intelligence"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <BarChart2 size={20} className="text-slate-500 shrink-0" />
                    <span>Business Intelligence</span>
                  </Link>
                  <Link
                    to="/dashboard/communication-center"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <MessageSquare size={20} className="text-slate-500 shrink-0" />
                    <span>Communication Center</span>
                  </Link>
                  <Link
                    to="/dashboard/document-center"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <Folder size={20} className="text-slate-500 shrink-0" />
                    <span>Document Center</span>
                  </Link>
                  <Link
                    to="/dashboard/system-health"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <Activity size={20} className="text-slate-500 shrink-0" />
                    <span>System Health</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Logout */}
        <div className={`border-t border-slate-100 ${collapsed ? 'p-2' : 'p-4'}`}>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </Link>
        </div>
      </aside>

      {/* Right side: header + content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header with dynamic title and subtitle from Redux */}
        <header className="h-20 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-10 shrink-0 shadow-sm">
          {/* Dynamic Page Title & Subtitle */}
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none mb-1.5">{pageTitle}</h1>
            <p className="text-sm font-medium text-slate-400 leading-none">{pageSubtitle}</p>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-bold text-slate-700 leading-none mb-1">{user?.name || 'Admin Darren'}</span>
              <span className="text-xs font-medium text-slate-400 leading-none">{user?.email || 'admin@telemed.com'}</span>
            </div>
            <ProfileDropdown user={user ?? undefined} />
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto w-full bg-[#FAFAFA]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}