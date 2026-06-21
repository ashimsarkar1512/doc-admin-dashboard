import React, { useState, useEffect } from 'react';
import { Package, User, MapPin, CreditCard, Truck, Loader2 } from 'lucide-react';
import Dialog from '@/components/shared/Dialog';
import type { Order, OrderStatus } from '../types';
import { Button } from '@/components/ui/button';
import { useUpdateOrder } from '../hooks/useOrders';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-indigo-100 text-indigo-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
};

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'
];

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
  const [status, setStatus] = useState<OrderStatus>('PENDING');
  const [trackingCarrier, setTrackingCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const updateOrderMutation = useUpdateOrder();

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setTrackingCarrier(order.trackingCarrier || '');
      setTrackingNumber(order.trackingNumber || '');
    }
  }, [order]);

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

  const handleSave = () => {
    if (!order) return;
    updateOrderMutation.mutate(
      {
        id: order.id,
        payload: {
          status,
          trackingCarrier: trackingCarrier || undefined,
          trackingNumber: trackingNumber || undefined,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
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
            {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
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

        {/* Update Section */}
        <div className="border border-slate-200 rounded-xl p-4">
           <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
             <Truck className="h-5 w-5 text-slate-600" />
             Fulfillment & Status
           </h4>
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
               <select
                 value={status}
                 onChange={(e) => setStatus(e.target.value as OrderStatus)}
                 className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
               >
                 {ORDER_STATUSES.map(s => (
                   <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}</option>
                 ))}
               </select>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Carrier Name</label>
                  <input
                    type="text"
                    value={trackingCarrier}
                    onChange={(e) => setTrackingCarrier(e.target.value)}
                    placeholder="e.g. FedEx"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. FX8734523421"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
             </div>
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
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={updateOrderMutation.isPending}>
            Cancel
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleSave} disabled={updateOrderMutation.isPending}>
            {updateOrderMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Save Changes
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
