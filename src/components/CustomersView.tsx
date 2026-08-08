import React, { useState } from 'react';
import { Search, Users, Crown, Phone, MapPin, Award, ShoppingBag } from 'lucide-react';
import { Customer } from '../types';

interface CustomersViewProps {
  customers: Customer[];
  lang: 'en' | 'bn';
}

export const CustomersView: React.FC<CustomersViewProps> = ({ customers, lang }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('BDT', '৳');
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold text-amber-950">
            {lang === 'en' ? 'Customer Database & VIP Tiers' : 'গ্রাহক ডাটাবেজ ও ভিআইপি ক্লাব'}
          </h2>
          <p className="text-xs text-gray-500">
            {lang === 'en'
              ? 'Track repeat clients, total purchase history, and preference notes.'
              : 'গ্রাহকদের ক্রয়ের ইতিহাস এবং ভিআইপি স্ট্যাটাস দেখুন।'}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-900/10 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={
              lang === 'en'
                ? 'Search by Customer Name, Phone number, District...'
                : 'গ্রাহকের নাম, ফোন বা জেলা দিয়ে খুঁজুন...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2 text-xs focus:border-amber-800 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-950 font-bold font-serif text-base">
                  {cust.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-amber-950 text-sm">{cust.name}</h3>
                  <p className="font-mono text-xs text-amber-900 font-semibold">{cust.phone}</p>
                </div>
              </div>

              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  cust.vipTier === 'VIP'
                    ? 'bg-amber-500 text-white shadow'
                    : cust.vipTier === 'Gold'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {cust.vipTier}
              </span>
            </div>

            <div className="text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-100">
              <p className="flex items-center space-x-1">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                <span>{cust.address}</span>
              </p>
              {cust.notes && (
                <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg italic">
                  "{cust.notes}"
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
              <div>
                <span className="text-gray-500 text-[10px]">Total Orders:</span>
                <p className="font-bold text-gray-900">{cust.totalOrders} Orders</p>
              </div>

              <div className="text-right">
                <span className="text-gray-500 text-[10px]">Lifetime Spend:</span>
                <p className="font-serif font-bold text-amber-950 text-sm">
                  {formatBDT(cust.totalSpent)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
