import DashboardLayout from "@/components/layout/DashboardLayout";
import ForgotPasswordPage from "@/features/auth/ForgotPasswordPage";
import LoginPage from "@/features/auth/LoginPage";
import ReceiveOtpPage from "@/features/auth/ReceiveOtpPage";
import VerifyOtpPage from "@/features/auth/VerifyOtpPage";
import DashboardPage from "@/features/dashboard/DashboardPage";
import { store } from "@/store";
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// The public login route (rendered at root "/")
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
  beforeLoad: () => {
    const { isAuthenticated } = store.getState().auth;
    const token = localStorage.getItem("token");
    if (isAuthenticated && token) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

// Forgot password route
const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  component: ForgotPasswordPage,
});

// Receive OTP route
const receiveOtpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/receive-otp",
  component: ReceiveOtpPage,
});

// Verify OTP route
const verifyOtpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verify-otp",
  component: VerifyOtpPage,
});

// Reset password route
import ResetPasswordPage from "@/features/auth/ResetPasswordPage";
const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  component: ResetPasswordPage,
});

// The protected dashboard layout
const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardLayout,
  beforeLoad: () => {
    const { isAuthenticated } = store.getState().auth;
    const token = localStorage.getItem("token");
    if (!isAuthenticated || !token) {
      throw redirect({ to: "/" });
    }
  },
});

// The dashboard overview page (rendered inside DashboardLayout)
const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/",
  component: DashboardPage,
});

import CategoriesPage from "@/features/dashboard/CategoriesPage";
const categoriesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/categories",
  component: CategoriesPage,
});

import AssessmentsPage from "@/features/dashboard/AssessmentsPage";
const assessmentsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/assessments",
  component: AssessmentsPage,
});

import AssessmentTablePage from "@/features/dashboard/AssessmentTablePage";
const assessmentTableRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/assessment-table",
  component: AssessmentTablePage,
});

import PreviewDetailsPage from "@/features/dashboard/PreviewDetailsPage";
const previewDetailsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/assessment-table/$assessmentId/preview",
  component: PreviewDetailsPage,
});

import PatientDetailsPage from "@/features/dashboard/PatientDetailsPage";
const patientDetailsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/patient-management/$assessmentId/preview",
  component: PatientDetailsPage,
});

import CheckoutPage from "@/features/dashboard/CheckoutPage";
const checkoutRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/checkout",
  component: CheckoutPage,
});

import ProductsPage from "@/features/dashboard/ProductsPage";
const productsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/products",
  component: ProductsPage,
});

import BlogPage from "@/features/dashboard/BlogPage";
const blogsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/blogs",
  component: BlogPage,
});

import BlogHeroPage from "@/features/dashboard/BlogHeroPage";
const blogsHeroRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/blogs/hero",
  component: BlogHeroPage,
});

import BlogCtaPage from "@/features/dashboard/BlogCtaPage";
const blogsCtaRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/blogs/cta",
  component: BlogCtaPage,
});

import BlogPageEditor from "@/features/dashboard/BlogPageEditor";
const blogSettingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/blogs/settings",
  component: BlogPageEditor,
});

import ProvidersPage from "@/features/dashboard/ProvidersPage";
const providersRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/providers",
  component: ProvidersPage,
});

import AllPatientsPage from "@/features/patient-management/pages/AllPatientsPage";
const patientsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/patients",
  component: AllPatientsPage,
});

import OrdersPage from "@/features/orders/pages/OrdersPage";
const ordersRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/orders",
  component: OrdersPage,
});

import ContactLeadsPage from "@/features/dashboard/ContactLeadsPage";
const contactLeadsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/contact-leads",
  component: ContactLeadsPage,
});

import PaymentsPage from "@/features/payments/pages/PaymentsPage";
const paymentsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/payments",
  component: PaymentsPage,
});

import TestimonialsPage from "@/features/dashboard/TestimonialsPage";
const testimonialsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/testimonials",
  component: TestimonialsPage,
});

import DiscountsPage from "@/features/dashboard/DiscountsPage";
const discountsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/discounts",
  component: DiscountsPage,
});

import EmployeePermissionsPage from "@/features/dashboard/EmployeePermissionsPage";
const employeePermissionsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/employee-permissions",
  component: EmployeePermissionsPage,
});

const employeePermissionsActionRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/employee-permissions/$action",
  component: EmployeePermissionsPage,
});

const employeePermissionsIdRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/employee-permissions/$action/$id",
  component: EmployeePermissionsPage,
});

const websiteManagementRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/website-management",
  component: SiteSettingsPage,
});

import HomePageEditor from "@/features/website-management/pages/HomePageEditor";
const pagesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/pages",
  component: HomePageEditor,
});

import AboutUsPageEditor from "@/features/website-management/pages/AboutUsPageEditor";
const aboutUsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/pages/about-us",
  component: AboutUsPageEditor,
});

import EligibilityPage from "@/features/website-management/pages/EligibilityPage";
const eligibilityRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/pages/eligibility",
  component: EligibilityPage,
});

import CoveragePage from "@/features/website-management/pages/CoveragePage";
const coverageRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/pages/coverage",
  component: CoveragePage,
});

import FaqPage from "@/features/website-management/pages/FaqPage";
const faqRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/pages/faq",
  component: FaqPage,
});

import ContactPageEditor from "@/features/website-management/pages/ContactPageEditor";
const contactRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/pages/contact",
  component: ContactPageEditor,
});

import MedicalTeamPageEditor from "@/features/website-management/pages/MedicalTeamPageEditor";
const medicalTeamRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/pages/medical-team",
  component: MedicalTeamPageEditor,
});

import HowItWorksPageEditor from "@/features/website-management/pages/HowItWorksPageEditor";
const howItWorksRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/pages/how-it-works",
  component: HowItWorksPageEditor,
});

import BillingCancellationPageEditor from "@/features/website-management/pages/BillingCancellationPageEditor";
const billingCancellationRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/pages/billing-and-cancellation",
  component: BillingCancellationPageEditor,
});

import ReportSideEffectPageEditor from "@/features/website-management/pages/ReportSideEffectPageEditor";
const reportSideEffectRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/pages/report-side-effect",
  component: ReportSideEffectPageEditor,
});

import RequestRecordPageEditor from "@/features/website-management/pages/RequestRecordPageEditor";
const requestRecordRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/pages/request-record",
  component: RequestRecordPageEditor,
});

import ShippingInformationPageEditor from "@/features/website-management/pages/ShippingInformationPageEditor";
const shippingInformationRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/pages/shipping-information",
  component: ShippingInformationPageEditor,
});

import LabTestingPageEditor from "@/features/website-management/pages/LabTestingPageEditor";
const labTestingRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/pages/lab-testing",
  component: LabTestingPageEditor,
});

import PrivacyPolicyPageEditor from "@/features/website-management/pages/PrivacyPolicyPageEditor";
const privacyPolicyRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/pages/privacy-policy",
  component: PrivacyPolicyPageEditor,
});

import TermsOfServicePageEditor from "@/features/website-management/pages/TermsOfServicePageEditor";
const termsOfServiceRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/pages/terms-of-service",
  component: TermsOfServicePageEditor,
});

import HipaaNoticePageEditor from "@/features/website-management/pages/HipaaNoticePageEditor";
const hipaaNoticeRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/pages/hipaa-notice",
  component: HipaaNoticePageEditor,
});

import ServicesPage from "@/features/dashboard/ServicesPage";
const servicesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/services",
  component: ServicesPage,
});

import SiteSettingsPage from "@/features/website-management/pages/SiteSettingsPage";
const siteSettingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/site-settings",
  component: SiteSettingsPage,
});

import ComplianceCenterPage from "@/features/dashboard/ComplianceCenterPage";
const complianceCenterRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/compliance-center",
  component: ComplianceCenterPage,
});

import AuditLogsPage from "@/features/dashboard/AuditLogsPage";
const auditLogsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/audit-logs",
  component: AuditLogsPage,
});

import ConsentManagementPage from "@/features/dashboard/ConsentManagementPage";
const consentManagementRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/consent-management",
  component: ConsentManagementPage,
});

import IncidentManagementPage from "@/features/dashboard/IncidentManagementPage";
const incidentManagementRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/incident-management",
  component: IncidentManagementPage,
});

import StateCoveragePage from "@/features/dashboard/StateCoveragePage";
const stateCoverageRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/state-coverage",
  component: StateCoveragePage,
});

import SideEffectReportPage from "@/features/dashboard/SideEffectReportPage";
const prescriptionOversightRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/prescription-oversight",
  component: SideEffectReportPage,
});

import RequestRecordsPage from "@/features/dashboard/RequestRecordsPage";
const requestRecordsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/request-records",
  component: RequestRecordsPage,
});

import BusinessIntelligencePage from "@/features/dashboard/BusinessIntelligencePage";
const businessIntelligenceRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/business-intelligence",
  component: BusinessIntelligencePage,
});

import CommunicationCenterPage from "@/features/communication-center/pages/CommunicationCenterPage";
const communicationCenterRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/communication-center",
  component: CommunicationCenterPage,
});

import DocumentCenterPage from "@/features/dashboard/DocumentCenterPage";
const documentCenterRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/document-center",
  component: DocumentCenterPage,
});

import SystemHealthPage from "@/features/dashboard/SystemHealthPage";
const systemHealthRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/system-health",
  component: SystemHealthPage,
});

import NewsletterPage from "@/features/dashboard/NewsletterPage";
const newsletterRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/newsletter",
  component: NewsletterPage,
});

import AccountSettingsPage from "@/features/account-settings/pages/AccountSettingsPage";
const accountSettingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/account-settings",
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
    patientDetailsRoute,
    checkoutRoute,
    productsRoute,
    blogsRoute,
    blogsHeroRoute,
    blogsCtaRoute,
    blogSettingsRoute,
    providersRoute,
    patientsRoute,
    ordersRoute,
    contactLeadsRoute,
    paymentsRoute,
    testimonialsRoute,
    discountsRoute,
    employeePermissionsRoute,
    employeePermissionsActionRoute,
    employeePermissionsIdRoute,
    websiteManagementRoute,
    pagesRoute,
    aboutUsRoute,
    eligibilityRoute,
    coverageRoute,
    faqRoute,
    contactRoute,
    medicalTeamRoute,
    howItWorksRoute,
    billingCancellationRoute,
    reportSideEffectRoute,
    requestRecordRoute,
    shippingInformationRoute,
    labTestingRoute,
    privacyPolicyRoute,
    termsOfServiceRoute,
    hipaaNoticeRoute,
    servicesRoute,
    siteSettingsRoute,
    complianceCenterRoute,
    auditLogsRoute,
    consentManagementRoute,
    incidentManagementRoute,
    stateCoverageRoute,
    prescriptionOversightRoute,
    requestRecordsRoute,
    businessIntelligenceRoute,
    communicationCenterRoute,
    documentCenterRoute,
    systemHealthRoute,
    newsletterRoute,
    accountSettingsRoute,
  ]),
]);

import NotFoundPage from "@/components/NotFoundPage";

// Initialize the router
export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
});

// Register it with TypeScript for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
