export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED' | 'PROCESSING';

export interface PaymentSummary {
  id: string;
  patientName: string;
  last4: string;
  brand: string;
  transactionId: string;
  paymentType: string;
  amount: number;
  date: string;
  status: PaymentStatus;
}

export interface PaymentMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaymentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  payments: PaymentSummary[];
  meta: PaymentMeta;
}

// Detail types
export interface PaymentPatient {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productName: string;
  variantSize: string | null;
}

export interface PaymentOrder {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  total: number;
  items: OrderItem[];
}

export interface PaymentSubscription {
  id: string;
  status: string;
  startDate: string;
  endDate: string | null;
  nextBillingDate: string;
  categoryName: string;
  paymentPlanName: string;
}

export interface PaymentDetail {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string;
  last4: string;
  brand: string;
  paymentType: string;
  paidAt: string | null;
  failedAt: string | null;
  refundedAt: string | null;
  createdAt: string;
  patient: PaymentPatient;
  order: PaymentOrder | null;
  subscription: PaymentSubscription | null;
}

export interface PaymentDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PaymentDetail;
}
