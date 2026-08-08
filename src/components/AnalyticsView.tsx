import React from 'react';
import { BarChart3, TrendingUp, DollarSign, MapPin, PieChart, ShieldCheck } from 'lucide-react';
import { Saree, Order } from '../types';

interface AnalyticsViewProps {
  sarees: Saree[];
  orders: Order[];
  lang: 'en' | 'bn';
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ sarees, orders, lang }) => {
  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('BDT', '৳');
  };

  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);

  // Sales by district
  const districtMap: Record<string, number> = {};
  orders.forEach((o) => {
    districtMap[o.district] = (districtMap[o.district] || 0) + o.total;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-bold text-amber-950">
          {lang === 'en' ? 'Sales Analytics & Profit Margins' : 'বিক্রয় ও লাভ মার্জিন বিশ্লেষণ'}
        </h2>
        <p className="text-xs text-gray-500">
          {lang === 'en'
            ? 'Financial performance, Saree weaver cost vs profit margin, and district-wise sales in Bangladesh.'
            : 'বাংলাদেশের বিভিন্ন জেলায় মোট শাড়ি বিক্রি ও লাভের পরিমাপ।'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* District Sales Breakdown */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-amber-950 text-base flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-amber-800" />
            <span>Sales Revenue by Bangladesh District</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(districtMap).map(([dist, total]) => {
              const pct = Math.round((total / (totalSales || 1)) * 100);
              return (
                <div key={dist} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-800 font-bold">{dist}</span>
                    <span className="font-serif text-amber-950 font-bold">{formatBDT(total)} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-amber-100 overflow-hidden">
                    <div className="h-full bg-amber-900 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Profitability Overview */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-amber-950 text-base flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-amber-800" />
            <span>Fabric Profit Margin Structure</span>
          </h3>

          <div className="space-y-3 divide-y divide-gray-100">
            {sarees.slice(0, 4).map((saree) => {
              const margin = saree.price - saree.sourcingCost;
              const marginPct = Math.round((margin / saree.price) * 100);

              return (
                <div key={saree.id} className="pt-2 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-gray-900 line-clamp-1">{saree.name}</p>
                    <p className="text-[10px] text-gray-500">
                      Sourcing: {formatBDT(saree.sourcingCost)} | Price: {formatBDT(saree.price)}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-serif font-bold text-emerald-700 text-sm">+{formatBDT(margin)}</span>
                    <span className="block text-[10px] text-emerald-600 font-semibold">{marginPct}% Margin</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
