import React from 'react';
import {
  Banknote,
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  Users,
  Plus,
  Printer,
  Sparkles,
  ArrowUpRight,
  Truck,
  CheckCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { Saree, Order, Customer, DashboardMetrics } from '../types';

interface DashboardViewProps {
  metrics: DashboardMetrics;
  sarees: Saree[];
  orders: Order[];
  customers: Customer[];
  lang: 'en' | 'bn';
  onNavigate: (tab: string) => void;
  onOpenAddSaree: () => void;
  onOpenCopilot: () => void;
  onViewOrderInvoice: (order: Order) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  sarees,
  orders,
  customers,
  lang,
  onNavigate,
  onOpenAddSaree,
  onOpenCopilot,
  onViewOrderInvoice,
}) => {
  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('BDT', '৳');
  };

  const lowStockList = sarees.filter((s) => s.stock <= s.reorderLevel);
  const recentOrders = orders.slice(0, 5);

  // Fabric popularity counter
  const fabricStats: Record<string, number> = {};
  sarees.forEach((s) => {
    fabricStats[s.fabric] = (fabricStats[s.fabric] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#56181d] p-6 text-white shadow-sm border border-[#3d1115]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-[#3d1115] px-3 py-1 text-xs font-semibold text-amber-200 border border-[#722027]">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>{lang === 'en' ? 'Aarshi Attire Control Center' : 'আরশি অ্যাটায়ার কন্ট্রোল সেন্টার'}</span>
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-white">
              {lang === 'en' ? 'Welcome back, Store Director!' : 'স্বাগতম, আরশি অ্যাটায়ার ড্যাশবোর্ডে'}
            </h2>
            <p className="text-xs text-rose-100/80 max-w-xl">
              {lang === 'en'
                ? 'Manage your luxury saree inventory, track Pathao & Steadfast courier shipments, print bKash invoices, and leverage AI copy generation.'
                : 'আপনার শাড়ির ক্যাটালগ পরিচালনা করুন, পেমেন্ট ট্র্যacking করুন, ইনভয়েস প্রিন্ট করুন এবং এআই এর সাহায্যে মার্কেটিং কন্টেন্ট তৈরি করুন।'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenAddSaree}
              className="inline-flex items-center space-x-1.5 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-[#56181d] shadow hover:bg-stone-100 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>{lang === 'en' ? 'Add New Saree' : 'নতুন শাড়ি যোগ করুন'}</span>
            </button>
            <button
              onClick={onOpenCopilot}
              className="inline-flex items-center space-x-1.5 rounded-lg bg-[#3d1115] px-4 py-2.5 text-xs font-bold text-amber-200 border border-[#722027] hover:bg-[#2e0c0f] transition-colors"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>{lang === 'en' ? 'AI Caption Writer' : 'এআই ক্যাপশন রাইটার'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900/70 uppercase tracking-wide">
              {lang === 'en' ? 'Total Sales Revenue' : 'মোট বিক্রি'}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Banknote className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-amber-950">
              {formatBDT(metrics.totalRevenue)}
            </div>
            <div className="mt-1 flex items-center text-xs text-emerald-600 font-medium">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              <span>
                +18.4% {lang === 'en' ? 'vs last month' : 'গত মাসের চেয়ে বেশি'}
              </span>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div
          onClick={() => onNavigate('orders')}
          className="cursor-pointer rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900/70 uppercase tracking-wide">
              {lang === 'en' ? 'Pending Orders' : 'পেন্ডিং অর্ডার'}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-amber-950">
              {metrics.pendingOrders} {lang === 'en' ? 'Orders' : 'টি'}
            </div>
            <p className="mt-1 text-xs text-amber-800/80">
              {lang === 'en' ? 'Requires packing & courier dispatch' : 'কুরিয়ারে শিপমেন্ট করা প্রয়োজন'}
            </p>
          </div>
        </div>

        {/* Active Sarees in Stock */}
        <div
          onClick={() => onNavigate('inventory')}
          className="cursor-pointer rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900/70 uppercase tracking-wide">
              {lang === 'en' ? 'Active Sarees' : 'অ্যাক্টিভ শাড়ি'}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-amber-950">
              {metrics.totalSarees} {lang === 'en' ? 'Designs' : 'টি ডিজাইন'}
            </div>
            <div className="mt-1 flex items-center text-xs text-rose-600 font-medium">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              <span>
                {metrics.lowStockCount} {lang === 'en' ? 'Low stock alert' : 'টির স্টক কম'}
              </span>
            </div>
          </div>
        </div>

        {/* Estimated Gross Profit */}
        <div className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-900/70 uppercase tracking-wide">
              {lang === 'en' ? 'Gross Profit' : 'আনুমানিক মোট লাভ'}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-amber-950">
              {formatBDT(metrics.grossProfit)}
            </div>
            <p className="mt-1 text-xs text-blue-600 font-medium">
              ~42% {lang === 'en' ? 'Average Profit Margin' : 'গড় প্রফিট মার্জিন'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Recent Orders Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div>
                <h3 className="font-serif text-base font-bold text-amber-950">
                  {lang === 'en' ? 'Recent Customer Orders' : 'সাম্প্রতিক গ্রাহক অর্ডারসমূহ'}
                </h3>
                <p className="text-xs text-gray-500">
                  {lang === 'en' ? 'Live order stream from website and Facebook inbox' : 'ওয়েবসাইট ও পেইজ থেকে পাওয়া অর্ডারের তালিকা'}
                </p>
              </div>
              <button
                onClick={() => onNavigate('orders')}
                className="inline-flex items-center text-xs font-semibold text-amber-900 hover:text-amber-700"
              >
                <span>{lang === 'en' ? 'View All Orders' : 'সব অর্ডার দেখুন'}</span>
                <ChevronRight className="h-4 w-4 ml-0.5" />
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <div key={order.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-amber-50/50 rounded-xl px-2 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100/70 text-amber-900 font-bold text-xs">
                      {order.paymentMethod === 'bKash' ? 'bK' : order.paymentMethod === 'Nagad' ? 'NG' : 'COD'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-amber-950">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs font-semibold text-gray-800">
                          {order.customerName}
                        </span>
                        <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {order.district}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                        {order.items.map((i) => `${i.quantity}x ${i.sareeName}`).join(', ')}
                      </p>
                      <div className="flex items-center space-x-2 text-[11px] text-gray-500 mt-1">
                        <span>Courier: {order.courierName}</span>
                        <span>•</span>
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
                    <span className="font-serif font-bold text-sm text-amber-950">
                      {formatBDT(order.total)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'processing'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() => onViewOrderInvoice(order)}
                        className="p-1 text-gray-500 hover:text-amber-900 hover:bg-amber-100 rounded transition-colors"
                        title="Print Invoice"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Fabric Popularity & Low Stock Widget */}
        <div className="space-y-6">
          {/* Fabric Collection Breakdown */}
          <div className="rounded-2xl border border-amber-900/10 bg-white p-5 shadow-sm">
            <h3 className="font-serif text-base font-bold text-amber-950 mb-3">
              {lang === 'en' ? 'Fabric & Craft Distribution' : 'ফ্যাব্রিক ক্যাটালগ পরিসংখ্যান'}
            </h3>
            <div className="space-y-3">
              {Object.entries(fabricStats).map(([fabric, count]) => {
                const percentage = Math.round((count / sarees.length) * 100);
                return (
                  <div key={fabric} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-gray-800">
                      <span>{fabric}</span>
                      <span className="text-amber-900 font-bold">{count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-amber-100 overflow-hidden">
                      <div
                        className="h-full bg-amber-800 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Low Stock Warning Box */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5 shadow-sm">
            <div className="flex items-center space-x-2 text-rose-900 font-bold text-sm mb-2">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              <span>{lang === 'en' ? 'Reorder Warning' : 'তাঁতিকে অর্ডার দিন (কম স্টক)'}</span>
            </div>
            <p className="text-xs text-rose-800 mb-3">
              {lang === 'en'
                ? 'These sarees are almost sold out. Notify master weavers in Demra/Tangail for new weaves.'
                : 'নিচের শাড়িগুলোর স্টক শেষপর্যায়ে। তাঁতিদের নতুন তাাঁত বোনার জন্য তাগাদা দিন।'}
            </p>
            <div className="space-y-2">
              {lowStockList.map((saree) => (
                <div
                  key={saree.id}
                  className="flex items-center justify-between rounded-xl bg-white p-2.5 text-xs border border-rose-100"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <img
                      src={saree.imageUrl}
                      alt={saree.name}
                      className="h-8 w-8 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-gray-900 truncate">{saree.name}</p>
                      <p className="text-[10px] text-gray-500">{saree.code}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 shrink-0">
                    {saree.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
