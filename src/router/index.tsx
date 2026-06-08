import { createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import LoginPage from '@/features/auth/LoginPage';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardPage from '@/features/dashboard/DashboardPage';
import DummyPage from '@/components/DummyPage';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// The public login route (rendered at root "/")
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginPage,
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

const patientsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/patients',
  component: () => <DummyPage title="Patients" />,
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
  component: () => <DummyPage title="Website Management" />,
});

const pagesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/pages',
  component: () => <DummyPage title="Pages" />,
});

const siteSettingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/site-settings',
  component: () => <DummyPage title="Site Settings" />,
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

import PrescriptionOversightPage from '@/features/dashboard/PrescriptionOversightPage';
const prescriptionOversightRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/prescription-oversight',
  component: PrescriptionOversightPage,
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

// Build the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardLayoutRoute.addChildren([
    dashboardIndexRoute,
    categoriesRoute,
    assessmentsRoute,
    assessmentTableRoute,
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