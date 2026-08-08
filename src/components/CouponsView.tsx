import React, { useState } from 'react';
import { TicketPercent, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { Coupon } from '../types';

interface CouponsViewProps {
  coupons: Coupon[];
  lang: 'en' | 'bn';
  onAddCoupon: (coupon: Coupon) => void;
  onToggleCouponStatus: (id: string) => void;
  onDeleteCoupon: (id: string) => void;
}

export const CouponsView: React.FC<CouponsViewProps> = ({
  coupons,
  lang,
  onAddCoupon,
  onToggleCouponStatus,
  onDeleteCoupon,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('fixed');
  const [discountValue, setDiscountValue] = useState(1000);
  const [minSpend, setMinSpend] = useState(10000);
  const [usageLimit, setUsageLimit] = useState(100);
  const [expiryDate, setExpiryDate] = useState('2026-10-01');

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('BDT', '৳');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    const newCoupon: Coupon = {
      id: `coup-${Date.now()}`,
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      minSpend: Number(minSpend),
      usageLimit: Number(usageLimit),
      timesUsed: 0,
      expiryDate,
      status: 'active',
    };
    onAddCoupon(newCoupon);
    setCode('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-amber-950">
            {lang === 'en' ? 'Coupons & Promotional Discounts' : 'কুপন ও প্রোমো কোড কন্ট্রোল'}
          </h2>
          <p className="text-xs text-gray-500">
            {lang === 'en'
              ? 'Create discount promo codes for Eid, Wedding, or seasonal marketing campaigns.'
              : 'ঈদ ও সামাজিক উৎসব উপলক্ষে নতুন ডিসকাউন্ট কুপন তৈরি করুন।'}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center space-x-1.5 rounded-xl bg-amber-900 px-4 py-2.5 text-xs font-bold text-amber-50 shadow hover:bg-amber-950 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{lang === 'en' ? 'Create Coupon' : 'নতুন কুপন তৈরি করুন'}</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-amber-900/20 bg-amber-50/50 p-5 space-y-4">
          <h3 className="font-serif text-sm font-bold text-amber-950">Create New Promo Code</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Coupon Code</label>
              <input
                type="text"
                required
                placeholder="e.g. EID2026"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-mono font-bold focus:border-amber-800 focus:outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-amber-800 focus:outline-none bg-white"
              >
                <option value="fixed">Flat Amount Off (৳ BDT)</option>
                <option value="percent">Percentage Off (%)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Discount Value ({discountType === 'percent' ? '%' : '৳ BDT'})
              </label>
              <input
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold focus:border-amber-800 focus:outline-none bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Min Order Amount (৳)</label>
              <input
                type="number"
                value={minSpend}
                onChange={(e) => setMinSpend(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-amber-800 focus:outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Usage Limit</label>
              <input
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-amber-800 focus:outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:border-amber-800 focus:outline-none bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 rounded-xl bg-white border border-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-amber-50 rounded-xl bg-amber-900 hover:bg-amber-950"
            >
              Save Promo Code
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-base font-bold text-amber-950 bg-amber-100 px-3 py-1 rounded-xl border border-amber-200">
                {c.code}
              </span>
              <button
                onClick={() => onToggleCouponStatus(c.id)}
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  c.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {c.status.toUpperCase()}
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-serif font-bold text-xl text-amber-900">
                {c.discountType === 'percent'
                  ? `${c.discountValue}% OFF`
                  : `৳${c.discountValue} FLAT OFF`}
              </p>
              <p className="text-gray-500">Min spend: {formatBDT(c.minSpend)}</p>
              <p className="text-gray-500">
                Used {c.timesUsed} / {c.usageLimit} times
              </p>
              <p className="text-gray-400 text-[10px]">Expires: {c.expiryDate}</p>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                onClick={() => onDeleteCoupon(c.id)}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
              >
                Delete Code
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
