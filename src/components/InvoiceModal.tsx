import React from 'react';
import { X, Printer, Phone, MapPin, Globe, CheckCircle2, QrCode } from 'lucide-react';
import { Order } from '../types';
import { Logo } from './Logo';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  lang: 'en' | 'bn';
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, order, lang }) => {
  if (!isOpen || !order) return null;

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('BDT', '৳');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-stone-200 my-8">
        {/* Action Controls Bar - Hidden during window.print() */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-6 print:hidden">
          <div className="flex items-center space-x-2">
            <h2 className="font-serif text-lg font-bold text-stone-900">Official Print Invoice</h2>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-800 border border-stone-200">
              {order.orderNumber}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 rounded-lg bg-[#56181d] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#3d1115] transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE AREA */}
        <div id="printable-area" className="space-y-6 text-stone-800 p-2">
          {/* Invoice Header */}
          <div className="flex items-start justify-between border-b-2 border-[#56181d]/20 pb-4">
            <div>
              <div className="flex items-center space-x-3">
                <Logo className="h-10 w-auto" color="#56181d" />
              </div>
              <p className="text-xs font-medium text-stone-700 mt-2">
                Luxury Bangladeshi Sarees • House 42, Road 11, Banani, Dhaka
              </p>
              <p className="text-[11px] text-stone-500">
                Hotline: +880 1700-000000 | Website: aarshi-attire.vercel.app
              </p>
            </div>

            <div className="text-right">
              <div className="font-serif text-xl font-bold text-[#56181d] uppercase">INVOICE</div>
              <p className="font-mono text-xs font-bold text-stone-900">{order.orderNumber}</p>
              <p className="text-xs text-stone-500 mt-1">
                Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}
              </p>
              <span className="inline-block mt-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                {order.paymentStatus === 'paid' ? 'Paid In Full' : 'Cash on Delivery'}
              </span>
            </div>
          </div>

          {/* Customer & Courier Details */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-amber-50/50 p-4 rounded-xl border border-amber-100">
            <div>
              <p className="font-bold uppercase tracking-wider text-amber-950 mb-1">
                Customer Delivery Address:
              </p>
              <p className="font-bold text-gray-900">{order.customerName}</p>
              <p className="text-gray-700">{order.address}</p>
              <p className="text-gray-700 font-semibold">{order.city}, {order.district}</p>
              <p className="font-mono text-amber-900 font-bold mt-1">Phone: {order.phone}</p>
            </div>

            <div className="border-l border-amber-200/60 pl-4">
              <p className="font-bold uppercase tracking-wider text-amber-950 mb-1">
                Shipment & Payment Info:
              </p>
              <p className="text-gray-700">Courier Partner: <span className="font-bold">{order.courierName}</span></p>
              {order.trackingNumber && (
                <p className="text-gray-700 font-mono">Tracking Code: <span className="font-bold">{order.trackingNumber}</span></p>
              )}
              <p className="text-gray-700 mt-1">Method: <span className="font-bold">{order.paymentMethod}</span></p>
              {order.bKashTxnId && (
                <p className="text-gray-700 font-mono">bKash TxnID: <span className="font-bold text-amber-900">{order.bKashTxnId}</span></p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-950 text-amber-100 font-bold uppercase">
                <tr>
                  <th className="p-3">Saree Description</th>
                  <th className="p-3 text-center">SKU</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Price (৳)</th>
                  <th className="p-3 text-right">Total (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-semibold text-gray-900">
                      {item.sareeName}
                      <span className="block text-[10px] text-gray-500 font-normal">
                        Fabric: {item.fabric} | Color: {item.color}
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-amber-900">{item.sareeCode}</td>
                    <td className="p-3 text-center font-bold">{item.quantity}</td>
                    <td className="p-3 text-right font-serif">{formatBDT(item.price)}</td>
                    <td className="p-3 text-right font-serif font-bold">{formatBDT(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-between items-end pt-2">
            <div className="text-[11px] text-gray-500 max-w-xs space-y-1">
              <p className="font-bold text-amber-950">Thank you for shopping with Aarshi Attire!</p>
              <p>For return/exchange queries, please preserve this invoice and contact customer service within 3 days.</p>
            </div>

            <div className="w-56 space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-serif">{formatBDT(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount:</span>
                  <span className="font-serif">-{formatBDT(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Courier Shipping:</span>
                <span className="font-serif">{formatBDT(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between border-t-2 border-amber-950 pt-1 text-sm font-bold font-serif text-amber-950">
                <span>Total Amount:</span>
                <span>{formatBDT(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Seals */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100 text-[10px] text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 border border-amber-800/30 rounded-lg flex items-center justify-center font-serif text-[9px] font-bold text-amber-900 text-center leading-tight">
                AARSHI<br />SEAL
              </div>
              <span>Authorized Signature & Quality Checked</span>
            </div>
            <div>Generated electronically via Aarshi Attire Control Panel</div>
          </div>
        </div>
      </div>
    </div>
  );
};
