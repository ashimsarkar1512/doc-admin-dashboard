import { createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import LoginPage from '@/features/auth/LoginPage';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardPage from '@/features/dashboard/DashboardPage';
import DummyPage from '@/components/DummyPage';

// The root layout
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

// Dummy routes for the sidebar sections
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

import ProductsPage from '@/features/dashboard/ProductsPage';

const productsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/products',
  component: ProductsPage,
});

const providersRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/providers',
  component: () => <DummyPage title="Providers/Doctors" />,
});

const patientsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/patients',
  component: () => <DummyPage title="Patients" />,
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

const userManagementRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/user-management',
  component: () => <DummyPage title="User Management" />,
});

// Build the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardLayoutRoute.addChildren([
    dashboardIndexRoute,
    categoriesRoute,
    assessmentsRoute,
    productsRoute,
    providersRoute,
    patientsRoute,
    websiteManagementRoute,
    pagesRoute,
    siteSettingsRoute,
    userManagementRoute,
  ]),
]);

// Initialize the router
export const router = createRouter({ routeTree });

// Register it with TypeScript for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
