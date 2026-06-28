// import { getContactLeads } from "@/api/endpoints/contact-leads.api";
// import { useUserProfile } from "@/features/account-settings/hooks/useAccountSettings";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { setPageHeader, toggleSidebar } from "@/store/uiSlice";
// import { useQuery } from "@tanstack/react-query";
// import { useOrders } from "@/features/orders/hooks/useOrders";
// import { Link, Outlet, useLocation } from "@tanstack/react-router";
// import {
//   Activity,
//   AlertTriangle,
//   BadgeDollarSign,
//   BarChart2,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   ClipboardList,
//   FileText,
//   Folder,
//   Folders,
//   Globe,
//   LayoutGrid,
//   LogOut,
//   Map,
//   Menu,
//   MessageSquare,
//   Package,
//   Pill,
//   ScrollText,
//   ShieldCheck,
//   ShoppingBag,
//   Star,
//   Stethoscope,
//   Tag,
//   UserCog,
//   Users,
//   X,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { ProfileDropdown } from "./ProfileDropdown";
// import { NotificationDropdown } from "./NotificationDropdown";
// import { useNotificationSocket } from "@/features/notifications/hooks/useNotifications";

// // Route to title mapping for cleaner code
// const routeTitleMap: Record<string, { title: string; subtitle: string }> = {
//   "/dashboard": {
//     title: "Dashboard",
//     subtitle: "Overview of your medical practice metrics",
//   },
//   "/dashboard/": {
//     title: "Dashboard",
//     subtitle: "Overview of your medical practice metrics",
//   },
//   "/dashboard/providers": {
//     title: "Doctor Management",
//     subtitle: "Manage doctors, schedules, and clinical staff",
//   },
//   "/dashboard/patients": {
//     title: "Patient Management",
//     subtitle: "View patient records, profiles, and history",
//   },
//   "/dashboard/orders": {
//     title: "Orders",
//     subtitle: "Manage patient orders and prescriptions",
//   },
//   "/dashboard/contact-leads": {
//     title: "Contact Leads",
//     subtitle: "Manage contact inquiries and leads",
//   },
//   "/dashboard/payments": {
//     title: "Payments",
//     subtitle: "Manage transactions and billing",
//   },
//   "/dashboard/categories": {
//     title: "Service Categories",
//     subtitle: "Manage your categories",
//   },
//   "/dashboard/assessments": {
//     title: "Assessments",
//     subtitle: "Create and manage user assessments for services",
//   },
//   "/dashboard/assessment-table": {
//     title: "Assessment Table",
//     subtitle: "Manage patient assessments and records",
//   },
//   "/dashboard/assessment-table/$assessmentId/preview": {
//     title: "Preview Details",
//     subtitle:
//       "Review consultation details before submitting for medical review",
//   },
//   // "/dashboard/checkout": {
//   //   title: "Checkout",
//   //   subtitle: "Review your order and complete your purchase",
//   // },
//   "/dashboard/products": {
//     title: "Products",
//     subtitle: "Manage inventory, pricing, and details",
//   },
//   "/dashboard/testimonials": {
//     title: "Testimonials",
//     subtitle: "Manage patient testimonials and reviews",
//   },
//   "/dashboard/discounts": {
//     title: "Discounts & Marketing",
//     subtitle: "Manage promotional campaigns and discounts",
//   },
//   "/dashboard/website-management": {
//     title: "Website Management",
//     subtitle: "Manage your website",
//   },
//   "/dashboard/pages": {
//     title: "Website Management",
//     subtitle: "Manage your website",
//   },
//   "/dashboard/account-settings": {
//     title: "Account Settings",
//     subtitle: "Manage your account",
//   },
//   "/dashboard/employee-permissions": {
//     title: "Employee Permissions",
//     subtitle: "Manage system administrators, roles, and permissions",
//   },
//   "/dashboard/compliance-center": {
//     title: "Compliance Center",
//     subtitle: "Monitor regulatory compliance checks and audit results",
//   },
//   "/dashboard/audit-logs": {
//     title: "Audit Logs",
//     subtitle: "Track all system activity and user actions for compliance",
//   },
//   "/dashboard/consent-management": {
//     title: "Consent Management",
//     subtitle: "Manage and track patient consent forms and authorizations",
//   },
//   "/dashboard/incident-management": {
//     title: "Incident Management",
//     subtitle: "Track, investigate and resolve compliance and system incidents",
//   },
//   "/dashboard/state-coverage": {
//     title: "State Coverage",
//     subtitle: "Overview of service coverage and provider availability by state",
//   },
//   "/dashboard/prescription-oversight": {
//     title: "Side effect report",
//     subtitle: "Medical director prescription review and approval",
//   },
//   "/dashboard/business-intelligence": {
//     title: "Business Intelligence",
//     subtitle:
//       "Key performance metrics and data-driven insights for decision making",
//   },
//   "/dashboard/communication-center": {
//     title: "Communication Center",
//     subtitle:
//       "Manage patient messages, internal communications, and notifications",
//   },
//   "/dashboard/document-center": {
//     title: "Document Center",
//     subtitle:
//       "Centralized storage for policies, forms, reports, and compliance documents",
//   },
//   "/dashboard/system-health": {
//     title: "System Health",
//     subtitle:
//       "Real-time status and performance monitoring for all platform services",
//   },
//   "/dashboard/profile": {
//     title: "Profile",
//     subtitle: "Manage your profile and settings",
//   },
// };

// export default function DashboardLayout() {
//   const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
//   const pageTitle = useAppSelector((state) => state.ui.pageTitle);
//   const pageSubtitle = useAppSelector((state) => state.ui.pageSubtitle);
//   const user = useAppSelector((state) => state.auth.user);
//   const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
//   const { data: profile } = useUserProfile();

//   // Initialize Notification Socket
//   useNotificationSocket();

//   // Fetch unread contact leads count for sidebar badge
//   const { data: unreadData } = useQuery({
//     queryKey: ["contact-leads-unread-count"],
//     queryFn: () => getContactLeads({ read: false, limit: 1 }),
//     enabled: isAuthenticated,
//     refetchInterval: 30000, // Refresh every 30 seconds instead of 5
//     staleTime: 1000 * 60 * 2, // 2 minutes
//     refetchOnWindowFocus: false, // Don't refetch on window focus
//     retry: 0, // Don't retry on failure since it's causing CORS errors
//   });
//   const unreadCount = unreadData?.meta?.total ?? 0;

//   const dispatch = useAppDispatch();
//   const location = useLocation();

//   const { data: pendingOrdersData } = useOrders({ status: "PENDING", limit: 1 });
//   const pendingOrdersCount = pendingOrdersData?.meta?.total ?? 0;

//   // Local state for submenus
//   const [patientMenuOpen, setPatientMenuOpen] = useState(false);
//   const [complianceMenuOpen, setComplianceMenuOpen] = useState(true);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

//   // Synchronize route changes to Redux Page Header State
//   useEffect(() => {
//     const path = location.pathname;
//     const routeInfo = routeTitleMap[path] || routeTitleMap["/dashboard"];

//     dispatch(setPageHeader(routeInfo));
//   }, [location.pathname, dispatch]);

//   return (
//     <div className="flex h-screen w-full overflow-hidden bg-primaryBg font-sans">
//       {/* Mobile sidebar overlay backdrop */}
//       {mobileSidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
//           onClick={() => setMobileSidebarOpen(false)}
//         />
//       )}

//       {/* Mobile Sidebar - fixed overlay, never affects layout */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
//           mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         {/* Mobile sidebar header */}
//         <div className="flex items-center justify-between px-5 h-20 border-b border-slate-100 shrink-0">
//           <img
//             src="/images/AdminLogo.png"
//             alt="WeightLoss MD Logo"
//             className="w-32 h-14 object-contain"
//           />
//           <button
//             onClick={() => setMobileSidebarOpen(false)}
//             className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Mobile sidebar nav - reuse same nav content */}
//         <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 scrollbar-hide">
//           <Link
//             to="/dashboard"
//             activeOptions={{ exact: true }}
//             onClick={() => setMobileSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <LayoutGrid size={20} className="shrink-0" />
//             <span>Dashboard</span>
//           </Link>
//           <Link
//             to="/dashboard/providers"
//             onClick={() => setMobileSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <Stethoscope size={20} className="shrink-0" />
//             <span>Doctor Management</span>
//           </Link>
//           <Link
//             to="/dashboard/patients"
//             onClick={() => setMobileSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <Users size={20} className="shrink-0" />
//             <span>Patient Management</span>
//           </Link>
//           <Link
//             to="/dashboard/assessments"
//             onClick={() => setMobileSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <ClipboardList size={20} className="shrink-0" />
//             <span>Assessments</span>
//           </Link>
//           <Link
//             to="/dashboard/orders"
//             onClick={() => setMobileSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <Package size={20} className="shrink-0" />
//             <span>Orders</span>
//           </Link>
      
//           <Link
//             to="/dashboard/contact-leads"
//             onClick={() => setMobileSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <MessageSquare size={20} className="shrink-0" />
//             <span>Contact Leads</span>
//           </Link>
//           <Link
//             to="/dashboard/payments"
//             onClick={() => setMobileSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <BadgeDollarSign size={20} className="shrink-0" />
//             <span>Payments</span>
//           </Link>
//           <Link
//             to="/dashboard/categories"
//             onClick={() => setMobileSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <Folders size={20} className="shrink-0" />
//             <span>Service Category & Plan</span>
//           </Link>
//           <Link
//             to="/dashboard/products"
//             onClick={() => setMobileSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <ShoppingBag size={20} className="shrink-0" />
//             <span>Products</span>
//           </Link>
//           <Link
//             to="/dashboard/testimonials"
//             onClick={() => setMobileSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <Star size={20} className="shrink-0" />
//             <span>Testimonials</span>
//           </Link>
//           <Link
//             to="/dashboard/discounts"
//             onClick={() => setMobileSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <Tag size={20} className="shrink-0" />
//             <span>Discounts & Marketing</span>
//           </Link>
//           <Link
//             to="/dashboard/website-management"
//             onClick={() => setMobileSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <Globe size={20} className="shrink-0" />
//             <span>Website Management</span>
//           </Link>
//           <Link
//             to="/dashboard/account-settings"
//             onClick={() => setMobileSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <UserCog size={20} className="shrink-0" />
//             <span>Account Settings</span>
//           </Link>
//           <hr className="my-2 border-slate-100" />
//           <Link
//             to="/dashboard/employee-permissions"
//             onClick={() => setMobileSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <UserCog size={20} className="shrink-0" />
//             <span>Employee Permissions</span>
//           </Link>
//           <Link
//             to="/dashboard/compliance-center"
//             onClick={() => setMobileSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <ShieldCheck size={20} className="shrink-0" />
//             <span>Compliance Center</span>
//           </Link>
//           <Link
//             to="/dashboard/audit-logs"
//             onClick={() => setMobileSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <ScrollText size={20} className="shrink-0" />
//             <span>Audit Logs</span>
//           </Link>
//           <Link
//             to="/dashboard/system-health"
//             onClick={() => setMobileSidebarOpen(false)}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <Activity size={20} className="shrink-0" />
//             <span>System Health</span>
//           </Link>
//         </nav>

//         {/* Mobile logout */}
//         <div className="border-t border-slate-100 p-4">
//           <Link
//             to="/"
//             className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
//           >
//             <LogOut size={18} className="shrink-0" />
//             <span>Logout</span>
//           </Link>
//         </div>
//       </div>

//       {/* Sidebar – desktop only */}
//       <aside
//         className={`hidden md:flex ${
//           collapsed ? "md:w-16" : "md:w-64"
//         } h-full border-r border-slate-200 bg-white flex-col shrink-0 transition-all duration-300 relative`}
//       >
//         {/* Floating collapse toggle */}
//         <button
//           onClick={() => dispatch(toggleSidebar())}
//           title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//           className="absolute -right-3 top-[30px] z-30 bg-white text-slate-300 hover:text-[#1447E6] transition-colors duration-200"
//         >
//           {collapsed ? (
//             <ChevronRight size={18} strokeWidth={2} />
//           ) : (
//             <ChevronLeft size={18} strokeWidth={2} />
//           )}
//         </button>

//         {/* Logo at top of sidebar */}
//         <div
//           className={`flex items-center border-b border-slate-100 h-20 shrink-0 ${collapsed ? "justify-center px-2" : "px-5"} transition-all duration-200`}
//         >
//           <img
//             src="/images/AdminLogo.png"
//             alt="WeightLoss MD Logo"
//             className={`object-contain transition-all duration-300 ${collapsed ? "w-10 h-10" : "w-32 h-14"}`}
//           />
//         </div>

//         {/* Nav links */}
//         <nav
//           className={`flex-1 overflow-y-auto py-6 space-y-0.5 ${collapsed ? "px-2" : "px-3"} scrollbar-hide`}
//         >
//           {/* Dashboard */}
//           <Link
//             to="/dashboard"
//             activeOptions={{ exact: true }}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-all duration-150 [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active]:shadow-sm [&.active_svg]:text-[#1447E6] group"
//           >
//             <LayoutGrid
//               size={20}
//               className="text-[#272628] group-hover:text-slate-600 shrink-0 transition-colors"
//             />
//             {!collapsed && <span className="tracking-wide">Dashboard</span>}
//           </Link>

//           {/* Doctor Management */}
//           <Link
//             to="/dashboard/providers"
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-all duration-150 [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active]:shadow-sm [&.active_svg]:text-[#1447E6] group"
//           >
//             <Stethoscope
//               size={20}
//               className="text-[#272628] group-hover:text-slate-600 shrink-0 transition-colors"
//             />
//             {!collapsed && (
//               <span className="tracking-wide">Doctor Management</span>
//             )}
//           </Link>

//           {/* Patient Management */}
//           {collapsed ? (
//             <Link
//               to="/dashboard/patients"
//               className="flex items-center justify-center p-2.5 rounded-md text-slate-600 hover:bg-slate-100 [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active_svg]:text-[#1447E6]"
//               title="Patient Management"
//             >
//               <Users size={20} className="text-slate-400 shrink-0" />
//             </Link>
//           ) : (
//             <div>
//               <button
//                 onClick={() => setPatientMenuOpen(!patientMenuOpen)}
//                 className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-colors group"
//               >
//                 <div className="flex items-center gap-3">
//                   <Users
//                     size={20}
//                     className="text-[#272628] group-hover:text-slate-600 shrink-0"
//                   />
//                   <span className="tracking-wide">Patient Management</span>
//                 </div>
//                 <ChevronDown
//                   size={16}
//                   className={`text-slate-400 transition-transform duration-200 ${
//                     patientMenuOpen ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {/* Submenus */}
//               {patientMenuOpen && (
//                 <div className="pl-6 mt-1 space-y-1">
//                   <Link
//                     to="/dashboard/patients"
//                     className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
//                   >
//                     All Patients
//                   </Link>
//                   <Link
//                     to="/dashboard/assessment-table"
//                     className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
//                   >
//                     Assessment Table
//                   </Link>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Assessments */}
//           <Link
//             to="/dashboard/assessments"
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <ClipboardList size={20} className="text-[#272628] shrink-0" />
//             {!collapsed && <span className="tracking-wide">Assessments</span>}
//           </Link>

//           {/* Orders */}
//           <Link
//             to="/dashboard/orders"
//             className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <div className="flex items-center gap-3">
//               <Package size={20} className="text-[#272628] shrink-0" />
//               {!collapsed && <span className="tracking-wide">Orders</span>}
//             </div>
//             {!collapsed && pendingOrdersCount > 0 && (
//               <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#E88319] text-white text-[10px] font-bold">
//                 {pendingOrdersCount > 99 ? "99+" : pendingOrdersCount}
//               </span>
//             )}
//           </Link>

//           {/* Checkout */}
         

//           {/* Contact Leads */}
//           <Link
//             to="/dashboard/contact-leads"
//             className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <div className="flex items-center gap-3">
//               <MessageSquare size={20} className="text-[#272628] shrink-0" />
//               {!collapsed && (
//                 <span className="tracking-wide">Contact Leads</span>
//               )}
//             </div>
//             {!collapsed && unreadCount > 0 && (
//               <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#E88319] text-white text-[10px] font-bold">
//                 {unreadCount > 99 ? "99+" : unreadCount}
//               </span>
//             )}
//           </Link>

//           {/* Payments */}
//           <Link
//             to="/dashboard/payments"
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <BadgeDollarSign size={20} className="text-[#272628] shrink-0" />
//             {!collapsed && <span className="tracking-wide">Payments</span>}
//           </Link>

//           {/* Categories */}
//           <Link
//             to="/dashboard/categories"
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <Folders size={20} className="text-[#272628] shrink-0" />
//             {!collapsed && (
//               <span className="tracking-wide">Service Category & Plan</span>
//             )}
//           </Link>

//           {/* Products */}
//           <Link
//             to="/dashboard/products"
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <ShoppingBag size={20} className="text-[#272628] shrink-0" />
//             {!collapsed && <span className="tracking-wide">Products</span>}
//           </Link>

//           {/* Testimonials */}
//           <Link
//             to="/dashboard/testimonials"
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <Star size={20} className="text-[#272628] shrink-0" />
//             {!collapsed && <span className="tracking-wide">Testimonials</span>}
//           </Link>

//           {/* Discounts & Marketing */}
//           <Link
//             to="/dashboard/discounts"
//             className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
//           >
//             <Tag size={20} className="text-[#272628] shrink-0" />
//             {!collapsed && (
//               <span className="tracking-wide">Discounts & Marketing</span>
//             )}
//           </Link>

//           {/* Website Management – direct link, no dropdown */}
//           <Link
//             to="/dashboard/website-management"
//             className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6] ${collapsed ? "justify-center" : ""}`}
//             title={collapsed ? "Website Management" : undefined}
//           >
//             <Globe size={20} className="text-[#272628] shrink-0" />
//             {!collapsed && (
//               <span className="tracking-wide">Website Management</span>
//             )}
//           </Link>

//           {/* Pages – single Home Page entry (no dropdown) */}
//           {!collapsed && (
//             <div className="pl-6 space-y-1">
//               <Link
//                 to="/dashboard/pages"
//                 className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
//               >
//                 Home Page
//               </Link>
//               <Link
//                 to="/dashboard/account-settings"
//                 className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
//               >
//                 Account Settings
//               </Link>
//             </div>
//           )}

//           <hr className="sidebar-divider" />

//           {/* Compliance & Access */}
//           {collapsed ? (
//             <Link
//               to="/dashboard/employee-permissions"
//               className="flex items-center justify-center p-2.5 rounded-md text-slate-600 hover:bg-slate-100 [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active_svg]:text-[#1447E6]"
//               title="Compliance & Access"
//             >
//               <ShieldCheck size={20} className="text-slate-400 shrink-0" />
//             </Link>
//           ) : (
//             <div>
//               <button
//                 onClick={() => setComplianceMenuOpen(!complianceMenuOpen)}
//                 className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-colors group"
//               >
//                 <span>Compliance & Access</span>
//                 <ChevronDown
//                   size={16}
//                   className={`text-slate-400 transition-transform duration-200 ${
//                     complianceMenuOpen ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {/* Submenus */}
//               {complianceMenuOpen && (
//                 <div className="pl-3 mt-1 space-y-1">
//                   <Link
//                     to="/dashboard/employee-permissions"
//                     className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
//                   >
//                     <UserCog size={18} className="text-slate-500 shrink-0" />
//                     <span>Employee Permissions</span>
//                   </Link>
//                   <Link
//                     to="/dashboard/compliance-center"
//                     className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
//                   >
//                     <ShieldCheck
//                       size={18}
//                       className="text-slate-500 shrink-0"
//                     />
//                     <span>Compliance Center</span>
//                   </Link>
//                   <Link
//                     to="/dashboard/audit-logs"
//                     className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
//                   >
//                     <ScrollText size={18} className="text-slate-500 shrink-0" />
//                     <span>Audit Logs</span>
//                   </Link>
//                   <Link
//                     to="/dashboard/consent-management"
//                     className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
//                   >
//                     <FileText size={18} className="text-slate-500 shrink-0" />
//                     <span>Consent Management</span>
//                   </Link>
//                   <Link
//                     to="/dashboard/incident-management"
//                     className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
//                   >
//                     <AlertTriangle
//                       size={18}
//                       className="text-slate-500 shrink-0"
//                     />
//                     <span>Incident Management</span>
//                   </Link>
//                   <Link
//                     to="/dashboard/state-coverage"
//                     className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
//                   >
//                     <Map size={18} className="text-slate-500 shrink-0" />
//                     <span>State Coverage</span>
//                   </Link>
//                   <Link
//                     to="/dashboard/prescription-oversight"
//                     className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
//                   >
//                     <Pill size={18} className="text-slate-500 shrink-0" />
//                     <span>Side effect report</span>
//                   </Link>
//                   <Link
//                     to="/dashboard/business-intelligence"
//                     className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
//                   >
//                     <BarChart2 size={18} className="text-slate-500 shrink-0" />
//                     <span>Business Intelligence</span>
//                   </Link>
//                   <Link
//                     to="/dashboard/communication-center"
//                     className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
//                   >
//                     <MessageSquare
//                       size={18}
//                       className="text-slate-500 shrink-0"
//                     />
//                     <span>Communication Center</span>
//                   </Link>
//                   <Link
//                     to="/dashboard/document-center"
//                     className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
//                   >
//                     <Folder size={18} className="text-slate-500 shrink-0" />
//                     <span>Document Center</span>
//                   </Link>
//                   <Link
//                     to="/dashboard/system-health"
//                     className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
//                   >
//                     <Activity size={18} className="text-slate-500 shrink-0" />
//                     <span>System Health</span>
//                   </Link>
//                 </div>
//               )}
//             </div>
//           )}
//         </nav>

//         {/* Logout */}
//         <div
//           className={`border-t border-slate-100 ${collapsed ? "p-2" : "p-4"} hover:bg-red-50 transition-colors duration-200`}
//         >
//           <Link
//             to="/"
//             className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-100 transition-all duration-200 group"
//           >
//             <LogOut
//               size={18}
//               className="shrink-0 group-hover:scale-110 transition-transform"
//             />
//             {!collapsed && <span>Logout</span>}
//           </Link>
//         </div>
//       </aside>

//       {/* Right side: header + content */}
//       <div className="flex flex-col flex-1 overflow-hidden">
//         {/* Top Navbar - Professional */}
//         <header className="border-b border-slate-100 bg-white flex items-center justify-between px-4 md:px-6 z-10 shrink-0 h-20">
//           {/* Hamburger for mobile */}
//           <button
//             className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-150 mr-3 shrink-0"
//             onClick={() => setMobileSidebarOpen(true)}
//           >
//             <Menu size={18} strokeWidth={2} />
//           </button>

//           {/* Page Title */}
//           <div className="flex flex-col justify-center h-20 flex-1 min-w-0">
//             <h1
//               className="text-[14px] md:text-[20px] font-semibold text-slate-900 tracking-[-0.2px] truncate"
//               style={{ margin: 0, lineHeight: "1.2" }}
//             >
//               {pageTitle}
//             </h1>
//             <p
//               className="text-[11px] md:text-[13px] text-slate-400 truncate"
//               style={{ margin: 0, marginTop: "4px", lineHeight: "1.2" }}
//             >
//               {pageSubtitle}
//             </p>
//           </div>

//           {/* Right section */}
//           <div className="flex items-center gap-2">
//             {/* Notification Bell */}
//             <NotificationDropdown />

//             {/* Divider */}
//             <div className="w-px h-7 bg-slate-200 mx-1" />

//             {/* User info + avatar */}
//             <div className="flex items-center gap-2.5">
//               <div className="hidden sm:flex flex-col text-right">
//                 <span className="text-[13px] font-semibold text-slate-800 leading-none">
//                   {profile?.profile?.name || user?.name || "Dr. Darren"}
//                 </span>
//                 <span className="text-[11px] text-slate-400 leading-none mt-0.5 font-medium">
//                   {profile?.role || user?.role || "Admin"}
//                 </span>
//               </div>
//               <ProfileDropdown user={user ?? undefined} />
//             </div>
//           </div>
//         </header>

//         {/* Scrollable Content */}
//         <main className="flex-1 overflow-y-auto w-full bg-[#FAFAFA]">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }



// new code import { getContactLeads } from "@/api/endpoints/contact-leads.api";
import { useUserProfile } from "@/features/account-settings/hooks/useAccountSettings";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPageHeader, toggleSidebar } from "@/store/uiSlice";
import { useQuery } from "@tanstack/react-query";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  BadgeDollarSign,
  BarChart2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Folder,
  Folders,
  Globe,
  LayoutGrid,
  LogOut,
  Map,
  Menu,
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
import { useEffect, useState } from "react";
import { ProfileDropdown } from "./ProfileDropdown";
import { NotificationDropdown } from "./NotificationDropdown";
import { useNotificationSocket } from "@/features/notifications/hooks/useNotifications";
import { getContactLeads } from "@/api/endpoints/contact-leads.api";

// Route to title mapping for cleaner code
const routeTitleMap: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Overview of your medical practice metrics",
  },
  "/dashboard/": {
    title: "Dashboard",
    subtitle: "Overview of your medical practice metrics",
  },
  "/dashboard/providers": {
    title: "Doctor Management",
    subtitle: "Manage doctors, schedules, and clinical staff",
  },
  "/dashboard/patients": {
    title: "Patient Management",
    subtitle: "View patient records, profiles, and history",
  },
  "/dashboard/orders": {
    title: "Orders",
    subtitle: "Manage patient orders and prescriptions",
  },
  "/dashboard/contact-leads": {
    title: "Contact Leads",
    subtitle: "Manage contact inquiries and leads",
  },
  "/dashboard/payments": {
    title: "Payments",
    subtitle: "Manage transactions and billing",
  },
  "/dashboard/categories": {
    title: "Service Categories",
    subtitle: "Manage your categories",
  },
  "/dashboard/assessments": {
    title: "Assessments",
    subtitle: "Create and manage user assessments for services",
  },
  "/dashboard/assessment-table": {
    title: "Assessment Table",
    subtitle: "Manage patient assessments and records",
  },
  "/dashboard/assessment-table/$assessmentId/preview": {
    title: "Preview Details",
    subtitle:
      "Review consultation details before submitting for medical review",
  },
  // "/dashboard/checkout": {
  //   title: "Checkout",
  //   subtitle: "Review your order and complete your purchase",
  // },
  "/dashboard/products": {
    title: "Products",
    subtitle: "Manage inventory, pricing, and details",
  },
  "/dashboard/testimonials": {
    title: "Testimonials",
    subtitle: "Manage patient testimonials and reviews",
  },
  "/dashboard/discounts": {
    title: "Discounts & Marketing",
    subtitle: "Manage promotional campaigns and discounts",
  },
  "/dashboard/website-management": {
    title: "Website Management",
    subtitle: "Manage your website",
  },
  "/dashboard/pages": {
    title: "Website Management",
    subtitle: "Manage your website",
  },
  "/dashboard/account-settings": {
    title: "Account Settings",
    subtitle: "Manage your account",
  },
  "/dashboard/employee-permissions": {
    title: "Employee Permissions",
    subtitle: "Manage system administrators, roles, and permissions",
  },
  "/dashboard/compliance-center": {
    title: "Compliance Center",
    subtitle: "Monitor regulatory compliance checks and audit results",
  },
  "/dashboard/audit-logs": {
    title: "Audit Logs",
    subtitle: "Track all system activity and user actions for compliance",
  },
  "/dashboard/consent-management": {
    title: "Consent Management",
    subtitle: "Manage and track patient consent forms and authorizations",
  },
  "/dashboard/incident-management": {
    title: "Incident Management",
    subtitle: "Track, investigate and resolve compliance and system incidents",
  },
  "/dashboard/state-coverage": {
    title: "State Coverage",
    subtitle: "Overview of service coverage and provider availability by state",
  },
  "/dashboard/prescription-oversight": {
    title: "Side effect report",
    subtitle: "Medical director prescription review and approval",
  },
  "/dashboard/business-intelligence": {
    title: "Business Intelligence",
    subtitle:
      "Key performance metrics and data-driven insights for decision making",
  },
  "/dashboard/communication-center": {
    title: "Communication Center",
    subtitle:
      "Manage patient messages, internal communications, and notifications",
  },
  "/dashboard/document-center": {
    title: "Document Center",
    subtitle:
      "Centralized storage for policies, forms, reports, and compliance documents",
  },
  "/dashboard/system-health": {
    title: "System Health",
    subtitle:
      "Real-time status and performance monitoring for all platform services",
  },
  "/dashboard/profile": {
    title: "Profile",
    subtitle: "Manage your profile and settings",
  },
};

export default function DashboardLayout() {
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const pageTitle = useAppSelector((state) => state.ui.pageTitle);
  const pageSubtitle = useAppSelector((state) => state.ui.pageSubtitle);
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data: profile } = useUserProfile();

  // Initialize Notification Socket
  useNotificationSocket();

  // Fetch unread contact leads count for sidebar badge
  const { data: unreadData } = useQuery({
    queryKey: ["contact-leads-unread-count"],
    queryFn: () => getContactLeads({ read: false, limit: 1 }),
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refresh every 30 seconds instead of 5
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 0, // Don't retry on failure since it's causing CORS errors
  });
  const unreadCount = unreadData?.meta?.total ?? 0;

  const dispatch = useAppDispatch();
  const location = useLocation();

  const { data: pendingOrdersData } = useOrders({ status: "PENDING", limit: 1 });
  const pendingOrdersCount = pendingOrdersData?.meta?.total ?? 0;

  // Local state for submenus
  const [patientMenuOpen, setPatientMenuOpen] = useState(false);
  const [websiteMenuOpen, setWebsiteMenuOpen] = useState(false);
  const [complianceMenuOpen, setComplianceMenuOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // ── Permission helpers ──────────────────────────────────────────────────
  const currentUser = user || profile;
  const userPermissions: string[] = (currentUser as any)?.permissions ?? [];
  const isAdmin = currentUser?.roles?.includes('ADMIN') || currentUser?.role === 'ADMIN';
  const can = (perm: string) => isAdmin || userPermissions.includes(perm);
  const hasComplianceAccess =
    can('view:employee_permissions') ||
    can('view:compliance_center') ||
    can('view:audit_logs') ||
    can('view:consent_management') ||
    can('view:incident_management') ||
    can('view:state_coverage') ||
    can('view:prescription_oversight') ||
    can('view:business_intelligence') ||
    can('view:communication_center') ||
    can('view:document_center') ||
    can('view:system_health');

  // Synchronize route changes to Redux Page Header State
  useEffect(() => {
    const path = location.pathname;
    const routeInfo = routeTitleMap[path] || routeTitleMap["/dashboard"];

    dispatch(setPageHeader(routeInfo));
  }, [location.pathname, dispatch]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-primaryBg font-sans">
      {/* Mobile sidebar overlay backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar - fixed overlay, never affects layout */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
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

        {/* Mobile sidebar nav - reuse same nav content */}
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
          {can('view:doctor_management') && (
          <Link
            to="/dashboard/providers"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <Stethoscope size={20} className="shrink-0" />
            <span>Doctor Management</span>
          </Link>
          )}
          {can('view:patient_management') && (
          <Link
            to="/dashboard/patients"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <Users size={20} className="shrink-0" />
            <span>Patient Management</span>
          </Link>
          )}
          {can('view:assessments') && (
          <Link
            to="/dashboard/assessments"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <ClipboardList size={20} className="shrink-0" />
            <span>Assessments</span>
          </Link>
          )}
          {can('view:orders') && (
          <Link
            to="/dashboard/orders"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <Package size={20} className="shrink-0" />
            <span>Orders</span>
          </Link>
          )}
          {can('view:contact_leads') && (
          <Link
            to="/dashboard/contact-leads"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <MessageSquare size={20} className="shrink-0" />
            <span>Contact Leads</span>
          </Link>
          )}
          {can('view:payments') && (
          <Link
            to="/dashboard/payments"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <BadgeDollarSign size={20} className="shrink-0" />
            <span>Payments</span>
          </Link>
          )}
          {can('view:service_categories_and_plans') && (
          <Link
            to="/dashboard/categories"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <Folders size={20} className="shrink-0" />
            <span>Service Category & Plan</span>
          </Link>
          )}
          {can('view:products') && (
          <Link
            to="/dashboard/products"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <ShoppingBag size={20} className="shrink-0" />
            <span>Products</span>
          </Link>
          )}
          {can('view:testimonials') && (
          <Link
            to="/dashboard/testimonials"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <Star size={20} className="shrink-0" />
            <span>Testimonials</span>
          </Link>
          )}
          {can('view:discounts_and_marketing') && (
          <Link
            to="/dashboard/discounts"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <Tag size={20} className="shrink-0" />
            <span>Discounts & Marketing</span>
          </Link>
          )}
          {can('view:website_management') && (
          <Link
            to="/dashboard/website-management"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <Globe size={20} className="shrink-0" />
            <span>Website Management</span>
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
          {can('view:employee_permissions') && (
          <Link
            to="/dashboard/employee-permissions"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <UserCog size={20} className="shrink-0" />
            <span>Employee Permissions</span>
          </Link>
          )}
          {can('view:compliance_center') && (
          <Link
            to="/dashboard/compliance-center"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <ShieldCheck size={20} className="shrink-0" />
            <span>Compliance Center</span>
          </Link>
          )}
          {can('view:audit_logs') && (
          <Link
            to="/dashboard/audit-logs"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 transition-all [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <ScrollText size={20} className="shrink-0" />
            <span>Audit Logs</span>
          </Link>
          )}
          {can('view:system_health') && (
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
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Logout</span>
          </Link>
        </div>
      </div>

      {/* Sidebar – desktop only */}
      <aside
        className={`hidden md:flex ${
          collapsed ? "md:w-16" : "md:w-64"
        } h-full border-r border-slate-200 bg-white flex-col shrink-0 transition-all duration-300 relative`}
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
          className={`flex items-center border-b border-slate-100 h-20 shrink-0 ${collapsed ? "justify-center px-2" : "px-5"} transition-all duration-200`}
        >
          <img
            src="/images/AdminLogo.png"
            alt="WeightLoss MD Logo"
            className={`object-contain transition-all duration-300 ${collapsed ? "w-10 h-10" : "w-32 h-14"}`}
          />
        </div>

        {/* Nav links */}
        <nav
          className={`flex-1 overflow-y-auto py-6 space-y-0.5 ${collapsed ? "px-2" : "px-3"} scrollbar-hide`}
        >
          {/* Dashboard */}
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

          {/* Doctor Management */}
          {can('view:doctor_management') && (
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

          {/* Patient Management */}
          {can('view:patient_management') && (
          collapsed ? (
            <Link
              to="/dashboard/patients"
              className="flex items-center justify-center p-2.5 rounded-md text-slate-600 hover:bg-slate-100 [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active_svg]:text-[#1447E6]"
              title="Patient Management"
            >
              <Users size={20} className="text-slate-400 shrink-0" />
            </Link>
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
          )
          )}

          {/* Assessments */}
          {can('view:assessments') && (
          <Link
            to="/dashboard/assessments"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <ClipboardList size={20} className="text-[#272628] shrink-0" />
            {!collapsed && <span className="tracking-wide">Assessments</span>}
          </Link>
          )}

          {/* Orders */}
          {can('view:orders') && (
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

          {/* Checkout */}
         

          {/* Contact Leads */}
          {can('view:contact_leads') && (
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
          {/* Payments */}
          {can('view:payments') && (
          <Link
            to="/dashboard/payments"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <BadgeDollarSign size={20} className="text-[#272628] shrink-0" />
            {!collapsed && <span className="tracking-wide">Payments</span>}
          </Link>
          )}

          {/* Categories */}
          {can('view:service_categories_and_plans') && (
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

          {/* Products */}
          {can('view:products') && (
          <Link
            to="/dashboard/products"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <ShoppingBag size={20} className="text-[#272628] shrink-0" />
            {!collapsed && <span className="tracking-wide">Products</span>}
          </Link>
          )}

          {/* Testimonials */}
          {can('view:testimonials') && (
          <Link
            to="/dashboard/testimonials"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-500 text-[#272628] hover:bg-slate-100 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-600 [&.active_svg]:text-[#1447E6]"
          >
            <Star size={20} className="text-[#272628] shrink-0" />
            {!collapsed && <span className="tracking-wide">Testimonials</span>}
          </Link>
          )}

          {/* Discounts & Marketing */}
          {can('view:discounts_and_marketing') && (
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

          {/* Website Management */}
          {can('view:website_management') && (
          collapsed ? (
            <Link
              to="/dashboard/website-management"
              className="flex items-center justify-center p-2.5 rounded-md text-slate-600 hover:bg-slate-100 [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active_svg]:text-[#1447E6]"
              title="Website Management"
            >
              <Globe size={20} className="text-slate-400 shrink-0" />
            </Link>
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

              {/* Submenus */}
              {websiteMenuOpen && (
                <div className="pl-6 mt-1 space-y-1">
                  <Link
                    to="/dashboard/website-management"
                    className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                  >
                    Website Setting
                  </Link>
                  <Link
                    to="/dashboard/pages"
                    className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                  >
                    Home Page
                  </Link>
                  <Link
                    to="/dashboard/account-settings"
                    className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold"
                  >
                    Account Settings
                  </Link>
                </div>
              )}
            </div>
          )
          )}

          {hasComplianceAccess && <hr className="sidebar-divider" />}

          {/* Compliance & Access */}
          {hasComplianceAccess && (
          collapsed ? (
            <Link
              to="/dashboard/employee-permissions"
              className="flex items-center justify-center p-2.5 rounded-md text-slate-600 hover:bg-slate-100 [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active_svg]:text-[#1447E6]"
              title="Compliance & Access "
            >
              <ShieldCheck size={20} className="text-slate-400 shrink-0" />
            </Link>
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

              {/* Submenus */}
              {complianceMenuOpen && (
                <div className="pl-3 mt-1 space-y-1">
                  <Link
                    to="/dashboard/employee-permissions"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <UserCog size={18} className="text-slate-500 shrink-0" />
                    <span>Employee Permissions</span>
                  </Link>
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
                  <Link
                    to="/dashboard/audit-logs"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <ScrollText size={18} className="text-slate-500 shrink-0" />
                    <span>Audit Logs</span>
                  </Link>
                  <Link
                    to="/dashboard/consent-management"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <FileText size={18} className="text-slate-500 shrink-0" />
                    <span>Consent Management</span>
                  </Link>
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
                  <Link
                    to="/dashboard/state-coverage"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <Map size={18} className="text-slate-500 shrink-0" />
                    <span>State Coverage</span>
                  </Link>
                  <Link
                    to="/dashboard/prescription-oversight"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <Pill size={18} className="text-slate-500 shrink-0" />
                    <span>Side effect report</span>
                  </Link>
                  <Link
                    to="/dashboard/business-intelligence"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <BarChart2 size={18} className="text-slate-500 shrink-0" />
                    <span>Business Intelligence</span>
                  </Link>
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
                  <Link
                    to="/dashboard/document-center"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <Folder size={18} className="text-slate-500 shrink-0" />
                    <span>Document Center</span>
                  </Link>
                  <Link
                    to="/dashboard/system-health"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors [&.active]:bg-[#EFF6FF] [&.active]:text-[#1447E6] [&.active]:font-semibold [&.active_svg]:text-[#1447E6]"
                  >
                    <Activity size={18} className="text-slate-500 shrink-0" />
                    <span>System Health</span>
                  </Link>
                </div>
              )}
            </div>
          )
          )}
        </nav>

        {/* Logout */}
        <div
          className={`border-t border-slate-100 ${collapsed ? "p-2" : "p-4"} hover:bg-red-50 transition-colors duration-200`}
        >
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-100 transition-all duration-200 group"
          >
            <LogOut
              size={18}
              className="shrink-0 group-hover:scale-110 transition-transform"
            />
            {!collapsed && <span>Logout</span>}
          </Link>
        </div>
      </aside>

      {/* Right side: header + content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navbar - Professional */}
        <header className="border-b border-slate-100 bg-white flex items-center justify-between px-4 md:px-6 z-10 shrink-0 h-20">
          {/* Hamburger for mobile */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-150 mr-3 shrink-0"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu size={18} strokeWidth={2} />
          </button>

          {/* Page Title */}
          <div className="flex flex-col justify-center h-20 flex-1 min-w-0">
            <h1
              className="text-[14px] md:text-[20px] font-semibold text-slate-900 tracking-[-0.2px] truncate"
              style={{ margin: 0, lineHeight: "1.2" }}
            >
              {pageTitle}
            </h1>
            <p
              className="text-[11px] md:text-[13px] text-slate-400 truncate"
              style={{ margin: 0, marginTop: "4px", lineHeight: "1.2" }}
            >
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

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto w-full bg-[#FAFAFA]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}