export interface OrderItem {
  id: string;
  productName: string;
  variantSize: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  productImage: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  patientName: string;
  doctorName: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  totalAmount: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string | null;
  };
  paymentDetails: {
    method: string;
    last4: string;
    brand: string;
    totalAmount: number;
    status: string;
    transactionId: string;
  };
  shippingInfo: {
    carrierName: string | null;
    trackingNumber: string | null;
  };
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  itemCount: number;
  total: number;
  patientName: string;
  doctorName: string;
  date: string;
  status: OrderStatus;
}

export interface OrderResponse {
  success?: boolean;
  statusCode?: number;
  message?: string;
  orders: OrderSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
