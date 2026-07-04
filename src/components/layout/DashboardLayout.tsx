import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPageHeader } from "@/store/uiSlice";
import { logout } from "@/store/slices/authSlice";
import { queryClient } from "@/lib/queryClient";
import { useUserProfile } from "@/features/account-settings/hooks/useAccountSettings";
import { useNotificationSocket } from "@/features/notifications/hooks/useNotifications";
import { getContactLeads } from "@/api/endpoints/contact-leads.api";
import { getAllCategories } from "@/api/endpoints/stateCoverage.api";
import { useOrders } from "@/features/orders/hooks/useOrders";

import { routeTitleMap } from "./routeTitleMap";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardMobileSidebar } from "./DashboardMobileSidebar";
import { DashboardSidebar } from "./DashboardSidebar";

export default function DashboardLayout() {
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
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    retry: 0,
  });
  const unreadCount = unreadData?.meta?.total ?? 0;

  const { data: categories = [] } = useQuery({
    queryKey: ["categories-names"],
    queryFn: getAllCategories,
    enabled: isAuthenticated,
  });

  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    queryClient.clear();
    dispatch(logout())
      .unwrap()
      .then(() => {
        navigate({ to: "/" });
      });
  };

  const { data: pendingOrdersData } = useOrders({ status: "PENDING", limit: 1 });
  const pendingOrdersCount = pendingOrdersData?.meta?.total ?? 0;

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
      {/* Mobile Sidebar */}
      <DashboardMobileSidebar
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
        can={can}
        hasComplianceAccess={hasComplianceAccess}
        handleSignOut={handleSignOut}
        unreadCount={unreadCount}
        pendingOrdersCount={pendingOrdersCount}
        categories={categories}
      />

      {/* Desktop Sidebar */}
      <DashboardSidebar
        can={can}
        hasComplianceAccess={hasComplianceAccess}
        handleSignOut={handleSignOut}
        unreadCount={unreadCount}
        pendingOrdersCount={pendingOrdersCount}
        categories={categories}
      />

      {/* Right side: header + content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navbar */}
        <DashboardHeader
          setMobileSidebarOpen={setMobileSidebarOpen}
          pageTitle={pageTitle}
          pageSubtitle={pageSubtitle}
          profile={profile}
          user={user}
        />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full bg-[#FAFAFA]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}