import React, { useState } from 'react';
import {
  Bell,
  Search,
  Globe,
  Sparkles,
  ExternalLink,
  ShoppingBag,
  AlertTriangle,
  CheckCircle2,
  Package,
  Menu,
} from 'lucide-react';
import { Saree, Order } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  lang: 'en' | 'bn';
  setLang: (lang: 'en' | 'bn') => void;
  sarees: Saree[];
  orders: Order[];
  onNavigate: (tab: string) => void;
  onOpenCopilot: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  sarees,
  orders,
  onNavigate,
  onOpenCopilot,
  onToggleMobileMenu,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const lowStockSarees = sarees.filter((s) => s.stock <= s.reorderLevel);
  const pendingOrders = orders.filter((o) => o.status === 'pending');

  const totalAlerts = lowStockSarees.length + pendingOrders.length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white/95 px-4 backdrop-blur-md md:px-8">
      {/* Left side: Mobile menu toggle + Brand Logo & Title & Website Link */}
      <div className="flex items-center space-x-2.5 md:space-x-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
            title="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="flex items-center justify-center p-1 bg-stone-50 rounded-lg border border-stone-200">
            <Logo className="h-8 w-auto sm:h-9" color="#56181d" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="rounded-full bg-[#56181d]/10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-[#56181d] border border-[#56181d]/20">
                ADMIN
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center pl-4 border-l border-stone-200">
          <a
            href="https://aarshi-attire.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 transition-colors bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-md border border-stone-200"
          >
            <span>{lang === 'en' ? 'Live Storefront' : 'লাইভ ওয়েবসাইট'}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Right side: Notifications, Language Toggle */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {totalAlerts > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow">
                {totalAlerts}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-stone-200 bg-white p-3 shadow-xl ring-1 ring-black/5 z-50">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-2">
                <h3 className="text-sm font-bold text-stone-900">
                  {lang === 'en' ? 'Store Alerts' : 'স্টোর অ্যালার্টসমূহ'}
                </h3>
                <span className="text-[11px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                  {totalAlerts} {lang === 'en' ? 'Actionable' : 'টি বিষয়'}
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {pendingOrders.length > 0 && (
                  <div className="rounded-lg bg-amber-50 p-2.5 border border-amber-200/60">
                    <div className="flex items-start space-x-2">
                      <ShoppingBag className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-stone-900">
                          {pendingOrders.length} {lang === 'en' ? 'Pending Orders requiring review' : 'টি নতুন অর্ডার যা রিভিউ প্রয়োজন'}
                        </p>
                        <button
                          onClick={() => {
                            onNavigate('orders');
                            setShowNotifications(false);
                          }}
                          className="mt-1 text-[11px] font-medium text-[#56181d] underline hover:text-stone-900"
                        >
                          {lang === 'en' ? 'View Orders' : 'অর্ডারসমূহ দেখুন'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {lowStockSarees.length > 0 && (
                  <div className="rounded-lg bg-rose-50 p-2.5 border border-rose-200/60">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-rose-950">
                          {lowStockSarees.length} {lang === 'en' ? 'Sarees running low on stock!' : 'টি শাড়ির স্টক কমে গেছে!'}
                        </p>
                        <ul className="mt-1 text-[11px] text-rose-800 space-y-0.5">
                          {lowStockSarees.slice(0, 3).map((s) => (
                            <li key={s.id}>
                              • {s.name} ({s.stock} left)
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => {
                            onNavigate('inventory');
                            setShowNotifications(false);
                          }}
                          className="mt-1 text-[11px] font-medium text-rose-900 underline hover:text-rose-950"
                        >
                          {lang === 'en' ? 'Manage Inventory' : 'স্টক আপডেট করুন'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {totalAlerts === 0 && (
                  <div className="py-6 text-center text-xs text-stone-500">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-1" />
                    {lang === 'en' ? 'All stock levels and orders are up to date!' : 'সবকিছু ঠিকঠাক আছে!'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Language Toggle */}
        <button
          onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
          className="flex items-center space-x-1.5 rounded-lg border border-stone-200 bg-stone-100 px-2.5 py-1.5 text-xs font-medium text-stone-800 hover:bg-stone-200 transition-colors"
          title="Switch Language"
        >
          <Globe className="h-3.5 w-3.5 text-stone-600" />
          <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
        </button>
      </div>
    </header>
  );
};
