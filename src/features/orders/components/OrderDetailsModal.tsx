import React, { useState, useEffect } from 'react';
import { Box, FileText, MapPin, CreditCard, Truck, Loader2 } from 'lucide-react';
import Dialog from '@/components/shared/Dialog';
import type { OrderSummary, OrderStatus } from '../types';
import { Button } from '@/components/ui/button';
import { useUpdateOrder, useOrderDetails } from '../hooks/useOrders';
import { API_BASE_URL } from '@/api/config';

interface OrderDetailsModalProps {
  order: OrderSummary | null;
  isOpen: boolean;
  onClose: () => void;
}

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'
];

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
  const [status, setStatus] = useState<OrderStatus>('PENDING');
  const [trackingCarrier, setTrackingCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isolateOrder, setIsolateOrder] = useState(false);

  const updateOrderMutation = useUpdateOrder();
  const { data: fullOrder, isLoading: isLoadingDetails } = useOrderDetails(order?.id ?? '');

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
    if (fullOrder) {
      setStatus(fullOrder.status);
      setTrackingCarrier(fullOrder.shippingInfo?.carrierName || '');
      setTrackingNumber(fullOrder.shippingInfo?.trackingNumber || '');
    }
  }, [order, fullOrder]);

  if (!order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
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

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Assuming API_BASE_URL is /api/v1, so we remove the api/v1 to get the root for uploads
    const baseUrl = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
    return `${baseUrl}/uploads/${path}`;
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Order Details"
      maxWidthClass="max-w-2xl"
    >
      <div className="space-y-6">
        
        {/* Order Information */}
        <div className="bg-[#F8FAFC] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Box className="h-5 w-5 text-blue-800" />
            <h4 className="font-semibold text-slate-800 text-[15px]">Order Information</h4>
          </div>
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            <div>
              <p className="text-[13px] text-slate-400 mb-0.5">Order ID</p>
              <p className="font-medium text-slate-800 text-[15px]">{fullOrder?.orderNumber || order.orderNumber}</p>
            </div>
            <div>
              <p className="text-[13px] text-slate-400 mb-0.5">Order Date</p>
              <p className="font-medium text-slate-800 text-[15px]">
                {fullOrder ? formatDate(fullOrder.orderDate) : formatDate(order.date)}
              </p>
            </div>
            <div>
              <p className="text-[13px] text-slate-400 mb-0.5">Patient Name</p>
              <p className="font-medium text-slate-800 text-[15px]">{fullOrder?.patientName || order.patientName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[13px] text-slate-400 mb-0.5">Prescribing Doctor</p>
              <p className="font-medium text-slate-800 text-[15px]">{fullOrder?.doctorName || order.doctorName || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-800" />
              <h4 className="font-semibold text-slate-800 text-[15px]">Order Items</h4>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isolateOrder} 
                onChange={(e) => setIsolateOrder(e.target.checked)} 
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4" 
              />
              <span className="text-[13px]">Isolate Order</span>
            </label>
          </div>

          {isLoadingDetails ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : fullOrder?.items && fullOrder.items.length > 0 ? (
            <div className="space-y-3">
              {fullOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-[#F8FAFC] rounded-xl border border-transparent">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      {item.productImage ? (
                        <img 
                          src={getImageUrl(item.productImage)} 
                          alt={item.productName} 
                          className="h-full w-full object-cover" 
                          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/48'; }} 
                        />
                      ) : (
                        <Box className="h-5 w-5 text-slate-300" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="font-medium text-slate-800 text-[14px] leading-tight">{item.productName}</p>
                      <p className="text-[12px] text-slate-400 mt-0.5">{item.variantSize}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-center">
                    <p className="font-semibold text-slate-800 text-[14px] leading-tight">${item.unitPrice.toFixed(2)}</p>
                    <p className="text-[12px] text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 bg-[#F8FAFC] rounded-xl p-4">{order.itemCount} item(s)</p>
          )}

          <div className="flex justify-between items-center mt-3 px-4 py-3 bg-[#2563EB] text-white rounded-xl shadow-sm">
            <span className="font-medium text-[15px]">Total Amount</span>
            <span className="font-semibold text-[15px]">${(fullOrder?.totalAmount || order.total).toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping Address */}
        {fullOrder?.shippingAddress && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-blue-800" />
              <h4 className="font-semibold text-slate-800 text-[15px]">Shipping Address</h4>
            </div>
            <div className="p-4 bg-[#F8FAFC] rounded-xl space-y-1.5">
              <p className="text-slate-700 text-[14px]">{fullOrder.shippingAddress.name}</p>
              <p className="text-slate-500 text-[13px]">{fullOrder.shippingAddress.phone}</p>
              <p className="text-slate-500 text-[13px]">{fullOrder.shippingAddress.address}</p>
              <p className="text-slate-500 text-[13px]">
                {fullOrder.shippingAddress.city}, {fullOrder.shippingAddress.state} {fullOrder.shippingAddress.zip}, {fullOrder.shippingAddress.country || 'USA'}
              </p>
            </div>
          </div>
        )}

        {/* Payment Details */}
        {fullOrder?.paymentDetails && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-blue-800" />
              <h4 className="font-semibold text-slate-800 text-[15px]">Payment Details</h4>
            </div>
            <div className="p-4 bg-[#F8FAFC] rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[13px]">Payment Method</span>
                <span className="text-slate-800 font-medium text-[13px]">
                  {fullOrder.paymentDetails.method === 'CLOVER' ? 'Debit Card' : fullOrder.paymentDetails.method}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[13px]">Card Details</span>
                <span className="text-slate-800 font-medium text-[13px]">
                  {fullOrder.paymentDetails.brand} **** {fullOrder.paymentDetails.last4}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[13px]">Total Amount</span>
                <span className="text-slate-800 font-medium text-[13px]">${fullOrder.paymentDetails.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-[13px]">Payment Status</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                  fullOrder.paymentDetails.status === 'COMPLETED' ? 'bg-[#D1FAE5] text-[#047857]' : 'bg-amber-100 text-amber-700'
                }`}>
                  {fullOrder.paymentDetails.status === 'COMPLETED' ? 'Paid' : fullOrder.paymentDetails.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Update Section */}
        <div className="space-y-4">
           <div>
             <label className="block text-[13px] font-semibold text-slate-800 mb-2">Order Status:</label>
             <select
               value={status}
               onChange={(e) => setStatus(e.target.value as OrderStatus)}
               className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
             >
               {ORDER_STATUSES.map(s => (
                 <option key={s} value={s}>
                   {s === 'PROCESSING' ? 'In progress' : s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
                 </option>
               ))}
             </select>
           </div>
           
           <div>
             <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 text-[15px]">
               <Truck className="h-5 w-5 text-blue-800" />
               Shipping Information
             </h4>
             <div className="space-y-3">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Carrier Name</label>
                  <input
                    type="text"
                    value={trackingCarrier}
                    onChange={(e) => setTrackingCarrier(e.target.value)}
                    placeholder="e.g. FedEx"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. FX8734523421"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
                  />
                </div>
             </div>
           </div>
        </div>

      </div>
      
      {/* Actions */}
      <div className="flex gap-3 pt-4 mt-2">
        <Button 
          variant="outline" 
          className="flex-1 text-slate-700 h-10 rounded-lg border border-slate-200 font-medium" 
          onClick={onClose} 
          disabled={updateOrderMutation.isPending}
        >
          Cancel
        </Button>
        <Button 
          className="flex-1 bg-[#2563EB] hover:bg-blue-700 text-white h-10 rounded-lg font-medium shadow-none" 
          onClick={handleSave} 
          disabled={updateOrderMutation.isPending}
        >
          {updateOrderMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Save Changes 
        </Button>
      </div>
    </Dialog>
  );
};
