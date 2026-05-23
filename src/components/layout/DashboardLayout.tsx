import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from '@tanstack/react-router';
import {
  LayoutGrid,
  Folders,
  FileQuestion,
  ShoppingBag,
  Stethoscope,
  Users,
  Globe,
  UserCog,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar, setPageHeader } from '@/store/uiSlice';

// Route to title mapping for cleaner code
const routeTitleMap: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your medical practice metrics' },
  '/dashboard/': { title: 'Dashboard', subtitle: 'Overview of your medical practice metrics' },
  '/dashboard/categories': { title: 'Categories', subtitle: 'Manage assessment and product categories' },
  '/dashboard/assessments': { title: 'Assessments', subtitle: 'Create and manage user assessments for services' },
  '/dashboard/products': { title: 'Products', subtitle: 'Manage inventory, pricing, and details' },
  '/dashboard/providers': { title: 'Providers/Doctors', subtitle: 'Manage doctors, schedules, and clinical staff' },
  '/dashboard/patients': { title: 'Patients', subtitle: 'View patient records, profiles, and history' },
  '/dashboard/website-management': { title: 'Website Management', subtitle: 'Configure website layout, pages, and components' },
  '/dashboard/pages': { title: 'Pages', subtitle: 'Manage website pages and static content' },
  '/dashboard/site-settings': { title: 'Site Settings', subtitle: 'Configure global site parameters and variables' },
  '/dashboard/user-management': { title: 'User Management', subtitle: 'Manage system administrators, roles, and permissions' },
};

export default function DashboardLayout() {
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const pageTitle = useAppSelector((state) => state.ui.pageTitle);
  const pageSubtitle = useAppSelector((state) => state.ui.pageSubtitle);
  
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Local state for submenus
  const [websiteMenuOpen, setWebsiteMenuOpen] = useState(true);
  const [pagesMenuOpen, setPagesMenuOpen] = useState(true);

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
        <nav className={`flex-1 overflow-y-auto py-6 space-y-1.5 ${collapsed ? 'px-2' : 'px-4'}`}>
          {/* Dashboard */}
          <Link
            to="/dashboard"
            activeOptions={{ exact: true }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
          >
            <LayoutGrid size={20} className="text-slate-500 shrink-0" />
            {!collapsed && <span>Dashboard</span>}
          </Link>

          {/* Categories */}
          <Link
            to="/dashboard/categories"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
          >
            <Folders size={20} className="text-slate-500 shrink-0" />
            {!collapsed && <span>Categories</span>}
          </Link>

          {/* Assessments */}
          <Link
            to="/dashboard/assessments"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
          >
            <FileQuestion size={20} className="text-slate-500 shrink-0" />
            {!collapsed && <span>Assessments</span>}
          </Link>

          {/* Products */}
          <Link
            to="/dashboard/products"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
          >
            <ShoppingBag size={20} className="text-slate-500 shrink-0" />
            {!collapsed && <span>Products</span>}
          </Link>

          {/* Providers/Doctors */}
          <Link
            to="/dashboard/providers"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
          >
            <Stethoscope size={20} className="text-slate-500 shrink-0" />
            {!collapsed && <span>Providers/Doctors</span>}
          </Link>

          {/* Patients */}
          <Link
            to="/dashboard/patients"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
          >
            <Users size={20} className="text-slate-500 shrink-0" />
            {!collapsed && <span>Patients</span>}
          </Link>

          {/* Website Management (with expandable submenu when expanded) */}
          {collapsed ? (
            <Link
              to="/dashboard/website-management"
              className="flex items-center justify-center p-2.5 rounded-lg text-slate-700 hover:bg-slate-50 [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active_svg]:text-[#1447E6]"
              title="Website Management"
            >
              <Globe size={20} className="text-slate-500 shrink-0" />
            </Link>
          ) : (
            <div>
              <button
                onClick={() => setWebsiteMenuOpen(!websiteMenuOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Globe size={20} className="text-slate-500 group-hover:text-slate-700 shrink-0" />
                  <span>Website Management</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-200 ${
                    websiteMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Submenus */}
              {websiteMenuOpen && (
                <div className="pl-6 mt-1 space-y-1">
                  {/* Pages sub-category */}
                  <div>
                    <button
                      onClick={() => setPagesMenuOpen(!pagesMenuOpen)}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors group"
                    >
                      <span>Pages</span>
                      <ChevronDown
                        size={14}
                        className={`text-slate-400 transition-transform duration-200 ${
                          pagesMenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {pagesMenuOpen && (
                      <div className="pl-4 mt-1 space-y-1">
                        <Link
                          to="/dashboard/pages"
                          className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                        >
                          All Pages
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Site Settings */}
                  <Link
                    to="/dashboard/site-settings"
                    className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                  >
                    <span>Site Settings</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* User Management */}
          <Link
            to="/dashboard/user-management"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
          >
            <UserCog size={20} className="text-slate-500 shrink-0" />
            {!collapsed && <span>User Management</span>}
          </Link>
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
              <span className="text-sm font-bold text-slate-700 leading-none mb-1">Admin User</span>
              <span className="text-xs font-medium text-slate-400 leading-none">admin@ektahealth.com</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1447E6] flex items-center justify-center shadow-sm">
              <span className="text-sm font-bold text-white tracking-wide">AU</span>
            </div>
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