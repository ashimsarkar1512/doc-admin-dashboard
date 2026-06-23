import React from 'react';
import { Package, User, Calendar, DollarSign, Eye } from 'lucide-react';
import type { OrderSummary } from '../types';
import { Button } from '@/components/ui/button';

interface OrderCardProps {
  order: OrderSummary;
  onViewDetails: (order: OrderSummary) => void;
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

export const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-base">{order.orderNumber}</h3>
            <p className="text-xs text-slate-500">{order.itemCount} item{order.itemCount > 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="grid grid-cols-1 items-center gap-2 text-sm text-slate-600">
          <div className='flex gap-2'>
            <User className="h-4 w-4" />
          <span>Patient : {order.patientName }</span>
          </div>
          
          <div className='flex gap-2'>
            <User className="h-4 w-4" />
          <span>Doctor : { order.doctorName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(order.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <DollarSign className="h-4 w-4" />
          <span className="font-semibold">${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 text-white">
        <Button 
          variant="default" 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={() => onViewDetails(order)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </div>
    </div>
  );
};
