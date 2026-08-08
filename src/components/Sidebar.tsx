import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  PackageCheck,
  Users,
  TicketPercent,
  Image as ImageIcon,
  Scissors,
  BarChart3,
  Sparkles,
  Settings,
  ChevronRight,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'en' | 'bn';
  pendingOrdersCount: number;
  lowStockCount: number;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  pendingOrdersCount,
  lowStockCount,
  isMobileOpen,
  onMobileClose,
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      labelEn: 'Dashboard Overview',
      labelBn: 'ড্যাশবোর্ড ওভারভিউ',
      icon: LayoutDashboard,
    },
    {
      id: 'inventory',
      labelEn: 'Saree Inventory & Stock',
      labelBn: 'শাড়ি ক্যাটালগ ও স্টক',
      icon: ShoppingBag,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
      badgeColor: 'bg-rose-900/40 text-rose-200 border-rose-700/50',
    },
    {
      id: 'orders',
      labelEn: 'Orders & Couriers',
      labelBn: 'অর্ডার ও কুরিয়ার ট্র্যাকিং',
      icon: PackageCheck,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} New` : undefined,
      badgeColor: 'bg-amber-900/40 text-amber-200 border-amber-700/50',
    },
    {
      id: 'customers',
      labelEn: 'Customers & VIPs',
      labelBn: 'গ্রাহক তালিকা ও ভিআইপি',
      icon: Users,
    },
    {
      id: 'coupons',
      labelEn: 'Coupons & Promos',
      labelBn: 'কুপন ও ডিসকাউন্ট',
      icon: TicketPercent,
    },
    {
      id: 'banners',
      labelEn: 'Website Banners & Ticker',
      labelBn: 'ওয়েবসাইট ব্যানার ও নোটিশ',
      icon: ImageIcon,
    },
    {
      id: 'weavers',
      labelEn: 'Artisans & Weavers',
      labelBn: 'তাঁতি ও কারিগর পে-আউট',
      icon: Scissors,
    },
    {
      id: 'analytics',
      labelEn: 'Sales & Profit Margin',
      labelBn: 'বিক্রয় ও লাভ বিশ্লেষণ',
      icon: BarChart3,
    },
    {
      id: 'copilot',
      labelEn: 'Aarshi AI Studio',
      labelBn: 'আরশি এআই স্টুডিও',
      icon: Sparkles,
      highlight: true,
    },
    {
      id: 'settings',
      labelEn: 'Store Settings',
      labelBn: 'স্টোর সেটিংস',
      icon: Settings,
    },
  ];

  const navContent = (
    <div className="flex flex-col justify-between h-full p-3 select-none">
      <div className="space-y-1">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-200/70">
            {lang === 'en' ? 'Store Management' : 'ম্যানেজমেন্ট মেনু'}
          </span>
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="md:hidden p-1 text-stone-300 hover:text-white rounded-md hover:bg-[#3d1115]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onMobileClose) onMobileClose();
                }}
                className={`group relative flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-[#56181d] font-semibold shadow-sm'
                    : item.highlight
                    ? 'bg-[#3d1115] text-amber-200 hover:bg-[#2e0c0f] border border-[#722027]'
                    : 'text-stone-200 hover:bg-[#3d1115] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-[#56181d]' : item.highlight ? 'text-amber-300' : 'text-stone-300'
                    }`}
                  />
                  <span className="truncate">{lang === 'en' ? item.labelEn : item.labelBn}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <ChevronRight className="h-3.5 w-3.5 text-[#56181d] shrink-0 ml-1" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer info widget */}
      <div className="rounded-lg bg-[#3d1115] p-3 border border-[#722027] text-stone-200 text-[11px] space-y-1 mt-4">
        <div className="flex items-center justify-between font-bold text-white">
          <span>Aarshi Attire HQ</span>
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>
        <p className="text-[10px] text-stone-300">
          Banani, Dhaka • Hotline: 01700-000000
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-[#3d1115] bg-[#56181d] text-stone-100 flex-col min-h-[calc(100vh-4rem)]">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />
          <aside className="relative w-72 max-w-[80vw] bg-[#56181d] text-stone-100 flex flex-col h-full shadow-2xl z-10 overflow-y-auto">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
};
