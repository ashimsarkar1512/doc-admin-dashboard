import { createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import LoginPage from '@/features/auth/LoginPage';
import ForgotPasswordPage from '@/features/auth/ForgotPasswordPage';
import ReceiveOtpPage from '@/features/auth/ReceiveOtpPage';
import VerifyOtpPage from '@/features/auth/VerifyOtpPage';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardPage from '@/features/dashboard/DashboardPage';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// The public login route (rendered at root "/")
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginPage,
});

// Forgot password route
const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
});

// Receive OTP route
const receiveOtpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/receive-otp',
  component: ReceiveOtpPage,
});

// Verify OTP route
const verifyOtpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/verify-otp',
  component: VerifyOtpPage,
});

// Reset password route
import ResetPasswordPage from '@/features/auth/ResetPasswordPage';
const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  component: ResetPasswordPage,
});

// The protected dashboard layout
const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardLayout,
});

// The dashboard overview page (rendered inside DashboardLayout)
const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/',
  component: DashboardPage,
});

import CategoriesPage from '@/features/dashboard/CategoriesPage';
const categoriesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/categories',
  component: CategoriesPage,
});

import AssessmentsPage from '@/features/dashboard/AssessmentsPage';
const assessmentsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/assessments',
  component: AssessmentsPage,
});

import AssessmentTablePage from '@/features/dashboard/AssessmentTablePage';
const assessmentTableRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/assessment-table',
  component: AssessmentTablePage,
});

import PreviewDetailsPage from '@/features/dashboard/PreviewDetailsPage';
const previewDetailsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/assessment-table/$assessmentId/preview',
  component: PreviewDetailsPage,
});

import CheckoutPage from '@/features/dashboard/CheckoutPage';
const checkoutRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/checkout',
  component: CheckoutPage,
});

import ProductsPage from '@/features/dashboard/ProductsPage';
const productsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/products',
  component: ProductsPage,
});

import ProvidersPage from '@/features/dashboard/ProvidersPage';
const providersRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/providers',
  component: ProvidersPage,
});

import AllPatientsPage from '@/features/patient-management/pages/AllPatientsPage';
const patientsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/patients',
  component: AllPatientsPage,
});

import OrdersPage from '@/features/dashboard/OrdersPage';
const ordersRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/orders',
  component: OrdersPage,
});

import ContactLeadsPage from '@/features/dashboard/ContactLeadsPage';
const contactLeadsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/contact-leads',
  component: ContactLeadsPage,
});

import PaymentsPage from '@/features/dashboard/PaymentsPage';
const paymentsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/payments',
  component: PaymentsPage,
});

import TestimonialsPage from '@/features/dashboard/TestimonialsPage';
const testimonialsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/testimonials',
  component: TestimonialsPage,
});

import DiscountsPage from '@/features/dashboard/DiscountsPage';
const discountsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/discounts',
  component: DiscountsPage,
});

import EmployeePermissionsPage from '@/features/dashboard/EmployeePermissionsPage';
const employeePermissionsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/employee-permissions',
  component: EmployeePermissionsPage,
});

const websiteManagementRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/website-management',
  component: SiteSettingsPage,
});

import HomePageEditor from '@/features/website-management/pages/HomePageEditor';
const pagesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/pages',
  component: HomePageEditor,
});

import SiteSettingsPage from '@/features/website-management/pages/SiteSettingsPage';
const siteSettingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/site-settings',
  component: SiteSettingsPage,
});

import ComplianceCenterPage from '@/features/dashboard/ComplianceCenterPage';
const complianceCenterRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/compliance-center',
  component: ComplianceCenterPage,
});

import AuditLogsPage from '@/features/dashboard/AuditLogsPage';
const auditLogsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/audit-logs',
  component: AuditLogsPage,
});

import ConsentManagementPage from '@/features/dashboard/ConsentManagementPage';
const consentManagementRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/consent-management',
  component: ConsentManagementPage,
});

import IncidentManagementPage from '@/features/dashboard/IncidentManagementPage';
const incidentManagementRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/incident-management',
  component: IncidentManagementPage,
});

import StateCoveragePage from '@/features/dashboard/StateCoveragePage';
const stateCoverageRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/state-coverage',
  component: StateCoveragePage,
});

import SideEffectReportPage from '@/features/dashboard/SideEffectReportPage';
const prescriptionOversightRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/prescription-oversight',
  component: SideEffectReportPage,
});

import BusinessIntelligencePage from '@/features/dashboard/BusinessIntelligencePage';
const businessIntelligenceRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/business-intelligence',
  component: BusinessIntelligencePage,
});

import CommunicationCenterPage from '@/features/dashboard/CommunicationCenterPage';
const communicationCenterRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/communication-center',
  component: CommunicationCenterPage,
});

import DocumentCenterPage from '@/features/dashboard/DocumentCenterPage';
const documentCenterRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/document-center',
  component: DocumentCenterPage,
});

import SystemHealthPage from '@/features/dashboard/SystemHealthPage';
const systemHealthRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/system-health',
  component: SystemHealthPage,
});

import AccountSettingsPage from '@/features/account-settings/pages/AccountSettingsPage';
const accountSettingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/account-settings',
  component: AccountSettingsPage,
});

// const profileRoute = createRoute({
//   getParentRoute: () => dashboardLayoutRoute,
//   path: '/profile',
//   component: () => <DummyPage title="Profile" />,
// });

// Build the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  forgotPasswordRoute,
  receiveOtpRoute,
  verifyOtpRoute,
  resetPasswordRoute,
  dashboardLayoutRoute.addChildren([
    dashboardIndexRoute,
    categoriesRoute,
    assessmentsRoute,
    assessmentTableRoute,
    previewDetailsRoute,
    checkoutRoute,
    productsRoute,
    providersRoute,
    patientsRoute,
    ordersRoute,
    contactLeadsRoute,
    paymentsRoute,
    testimonialsRoute,
    discountsRoute,
    employeePermissionsRoute,
    websiteManagementRoute,
    pagesRoute,
    siteSettingsRoute,
    complianceCenterRoute,
    auditLogsRoute,
    consentManagementRoute,
    incidentManagementRoute,
    stateCoverageRoute,
    prescriptionOversightRoute,
    businessIntelligenceRoute,
    communicationCenterRoute,
    documentCenterRoute,
    systemHealthRoute,
    accountSettingsRoute,
  ]),
]);

import NotFoundPage from '@/components/NotFoundPage';

// Initialize the router
export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
});

// Register it with TypeScript for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}