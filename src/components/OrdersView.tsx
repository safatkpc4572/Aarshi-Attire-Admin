import React, { useState } from 'react';
import {
  Search,
  Filter,
  Printer,
  MessageSquare,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { Order, OrderStatus, CourierService } from '../types';

interface OrdersViewProps {
  orders: Order[];
  lang: 'en' | 'bn';
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  onUpdateCourierInfo: (id: string, courierName: CourierService, trackingNumber: string) => void;
  onViewInvoice: (order: Order) => void;
  onOpenSMSModal: (order: Order) => void;
}

const COURIER_OPTIONS: CourierService[] = [
  'Pathao',
  'Steadfast',
  'RedX',
  'Paperfly',
  'In-House Dhaka Delivery',
];

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  lang,
  onUpdateOrderStatus,
  onUpdateCourierInfo,
  onViewInvoice,
  onOpenSMSModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('BDT', '৳');
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.bKashTxnId && order.bKashTxnId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-amber-950">
            {lang === 'en' ? 'Orders & Courier Fulfillment' : 'অর্ডার লিস্ট ও কুরিয়ার ট্র্যাকিং'}
          </h2>
          <p className="text-xs text-gray-500">
            {lang === 'en'
              ? 'Process customer orders, verify bKash payments, assign Pathao/Steadfast couriers, and print invoices.'
              : 'অর্ডার স্টেটাস আপডেট করুন, বিকাশ ট্রানজেকশন ভেরিফাই করুন এবং ইনভয়েস প্রিন্ট করুন।'}
          </p>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="rounded-2xl border border-amber-900/10 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={
                lang === 'en'
                  ? 'Search by Order #, Customer Name, Phone (017...), bKash Txn ID...'
                  : 'অর্ডার নং, কাস্টমারের নাম, ফোন নম্বর, বিকাশ ট্রানজেকশন দিয়ে খুঁজুন...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2 text-xs focus:border-amber-800 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-colors shrink-0 ${
                  statusFilter === st
                    ? 'bg-amber-900 text-amber-50 shadow'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-amber-900/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-amber-50/80 text-[11px] uppercase font-bold text-amber-950 border-b border-amber-900/10">
              <tr>
                <th className="p-3.5">Order # & Date</th>
                <th className="p-3.5">Customer & Location</th>
                <th className="p-3.5">Items Purchased</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Courier & Tracking</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-amber-50/40 transition-colors">
                  {/* Order Number & Date */}
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-amber-950 text-xs">
                      {order.orderNumber}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Customer Info */}
                  <td className="p-3.5">
                    <div className="font-bold text-gray-900">{order.customerName}</div>
                    <div className="font-mono text-[11px] text-amber-900 font-semibold">
                      {order.phone}
                    </div>
                    <div className="text-[10px] text-gray-500">{order.district}</div>
                  </td>

                  {/* Items */}
                  <td className="p-3.5">
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="text-xs font-semibold text-gray-800">
                          {item.quantity}x {item.sareeName}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Payment */}
                  <td className="p-3.5">
                    <div className="font-serif font-bold text-amber-950 text-sm">
                      {formatBDT(order.total)}
                    </div>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-900">
                        {order.paymentMethod}
                      </span>
                      {order.bKashTxnId && (
                        <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded">
                          Txn: {order.bKashTxnId}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Courier & Tracking */}
                  <td className="p-3.5 space-y-1">
                    <select
                      value={order.courierName}
                      onChange={(e) =>
                        onUpdateCourierInfo(
                          order.id,
                          e.target.value as CourierService,
                          order.trackingNumber || ''
                        )
                      }
                      className="rounded-lg border border-gray-200 px-2 py-1 text-[11px] font-semibold text-gray-800 bg-white focus:border-amber-800 focus:outline-none"
                    >
                      {COURIER_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Tracking Code"
                      value={order.trackingNumber || ''}
                      onChange={(e) =>
                        onUpdateCourierInfo(order.id, order.courierName, e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-200 px-2 py-1 text-[10px] font-mono focus:border-amber-800 focus:outline-none"
                    />
                  </td>

                  {/* Status Dropdown */}
                  <td className="p-3.5">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                      }
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold border focus:outline-none ${
                        order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : order.status === 'processing'
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      <option value="pending">PENDING</option>
                      <option value="processing">PROCESSING</option>
                      <option value="shipped">SHIPPED</option>
                      <option value="delivered">DELIVERED</option>
                      <option value="cancelled">CANCELLED</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right space-x-1">
                    <button
                      onClick={() => onViewInvoice(order)}
                      className="inline-flex items-center space-x-1 rounded-lg bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-950 hover:bg-amber-200 transition-colors"
                      title="Print Official Invoice"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Invoice</span>
                    </button>
                    <button
                      onClick={() => onOpenSMSModal(order)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors inline-block"
                      title="Send SMS / WhatsApp"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
