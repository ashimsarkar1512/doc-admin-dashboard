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
    ordersRoute,
    contactLeadsRoute,
    paymentsRoute,
    testimonialsRoute,
    discountsRoute,
    employeePermissionsRoute,
    websiteManagementRoute,
    pagesRoute,
    siteSettingsRoute,
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