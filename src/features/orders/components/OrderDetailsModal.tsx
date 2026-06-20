import React from 'react';
import {  Package, User, MapPin, CreditCard, Truck } from 'lucide-react';
import Dialog from '@/components/shared/Dialog';
import type { Order } from '../types';
import { Button } from '@/components/ui/button';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Order Details"
      maxWidthClass="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Order Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">{order.orderNumber}</h3>
            <p className="text-sm text-slate-500">Placed on {formatDate(order.orderDate)}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        {/* Customer Info */}
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-slate-800">Customer</h4>
          </div>
          <p className="text-slate-700 font-medium">{order.customer.name}</p>
          <p className="text-slate-600 text-sm">{order.customer.email}</p>
        </div>

        {/* Order Items */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-5 w-5 text-slate-600" />
            <h4 className="font-semibold text-slate-800">Items</h4>
          </div>
          <div className="space-y-3">
            {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-800">{item.name}</p>
                <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-slate-800">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          </div>
          <div className="flex justify-between items-center mt-4 p-3 bg-blue-600 text-white rounded-lg">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-bold text-xl">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-slate-600" />
            <h4 className="font-semibold text-slate-800">Shipping Address</h4>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-slate-700">{order.shippingAddress.street}</p>
            <p className="text-slate-700">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p className="text-slate-700">{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Payment Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-5 w-5 text-slate-600" />
            <h4 className="font-semibold text-slate-800">Payment</h4>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-slate-700">Payment Status: <span className="font-medium">{order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</span></p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Truck className="h-4 w-4 mr-2" />
            Update Status
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
