export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  orderDate: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingCarrier?: string;
  trackingNumber?: string;
}

export interface OrderResponse {
  data: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
