import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SareeInventoryView } from './components/SareeInventoryView';
import { SareeModal } from './components/SareeModal';
import { OrdersView } from './components/OrdersView';
import { InvoiceModal } from './components/InvoiceModal';
import { SMSModal } from './components/SMSModal';
import { CustomersView } from './components/CustomersView';
import { CouponsView } from './components/CouponsView';
import { BannersView } from './components/BannersView';
import { WeaversView } from './components/WeaversView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';

import {
  INITIAL_SAREES,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
  INITIAL_WEAVERS,
} from './data/mockData';

import { Saree, Order, Customer, Coupon, Banner, Weaver, OrderStatus, CourierService, DashboardMetrics } from './types';

export default function App() {
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Data States
  const [sarees, setSarees] = useState<Saree[]>(INITIAL_SAREES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [weavers, setWeavers] = useState<Weaver[]>(INITIAL_WEAVERS);

  // Modal States
  const [isSareeModalOpen, setIsSareeModalOpen] = useState(false);
  const [editingSaree, setEditingSaree] = useState<Saree | null>(null);

  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const [selectedSMSOrder, setSelectedSMSOrder] = useState<Order | null>(null);
  const [isSMSModalOpen, setIsSMSModalOpen] = useState(false);

  // Calculate live KPIs
  const metrics: DashboardMetrics = useMemo(() => {
    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
    const todayRevenue = orders
      .filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString())
      .reduce((acc, o) => acc + o.total, 0);

    const monthRevenue = totalRevenue;
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const shippedOrders = orders.filter((o) => o.status === 'shipped').length;
    const lowStockCount = sarees.filter((s) => s.stock <= s.reorderLevel).length;

    // Calculate gross profit
    let totalCost = 0;
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const foundSaree = sarees.find((s) => s.id === item.sareeId);
        if (foundSaree) {
          totalCost += foundSaree.sourcingCost * item.quantity;
        } else {
          totalCost += item.price * 0.55 * item.quantity;
        }
      });
    });

    const grossProfit = totalRevenue - totalCost;

    return {
      totalRevenue,
      todayRevenue,
      monthRevenue,
      totalOrders: orders.length,
      pendingOrders,
      shippedOrders,
      totalSarees: sarees.length,
      lowStockCount,
      totalCustomers: customers.length,
      grossProfit,
    };
  }, [sarees, orders, customers]);

  // Handlers for Sarees
  const handleSaveSaree = (sareeData: Partial<Saree>) => {
    if (editingSaree) {
      setSarees((prev) =>
        prev.map((s) => (s.id === editingSaree.id ? ({ ...s, ...sareeData } as Saree) : s))
      );
      setEditingSaree(null);
    } else {
      const newSaree: Saree = {
        id: `saree-${Date.now()}`,
        code: sareeData.code || `AA-JAM-${Math.floor(100 + Math.random() * 900)}`,
        name: sareeData.name || 'Untitled Saree',
        nameBn: sareeData.nameBn || 'নতুন শাড়ি',
        price: sareeData.price || 15000,
        salePrice: sareeData.salePrice,
        sourcingCost: sareeData.sourcingCost || 9000,
        fabric: sareeData.fabric || 'Dhakai Muslin',
        craft: sareeData.craft || 'Hand Woven',
        color: sareeData.color || 'Royal Blue',
        colorHex: sareeData.colorHex || '#1E3A8A',
        blouseOption: sareeData.blouseOption || 'Unstitched Included',
        stock: sareeData.stock !== undefined ? sareeData.stock : 5,
        reorderLevel: sareeData.reorderLevel || 2,
        isFeatured: sareeData.isFeatured || false,
        isNewArrival: sareeData.isNewArrival || true,
        isBestSeller: sareeData.isBestSeller || false,
        description: sareeData.description || '',
        descriptionBn: sareeData.descriptionBn || '',
        careInstructions: sareeData.careInstructions || 'Dry Clean Only',
        imageUrl:
          sareeData.imageUrl ||
          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
        tags: sareeData.tags || ['Traditional'],
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      setSarees((prev) => [newSaree, ...prev]);
    }
  };

  const handleDeleteSaree = (id: string) => {
    setSarees((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateStock = (id: string, newStock: number) => {
    setSarees((prev) => prev.map((s) => (s.id === id ? { ...s, stock: newStock } : s)));
  };

  // Handlers for Orders
  const handleUpdateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const handleUpdateCourierInfo = (
    id: string,
    courierName: CourierService,
    trackingNumber: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, courierName, trackingNumber } : o))
    );
  };

  return (
    <div className="min-h-screen bg-amber-50/40 text-gray-900 font-sans flex flex-col">
      {/* Header */}
      <Header
        lang={lang}
        setLang={setLang}
        sarees={sarees}
        orders={orders}
        onNavigate={setActiveTab}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Body */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lang={lang}
          pendingOrdersCount={metrics.pendingOrders}
          lowStockCount={metrics.lowStockCount}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />

        {/* View Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              metrics={metrics}
              sarees={sarees}
              orders={orders}
              customers={customers}
              lang={lang}
              onNavigate={setActiveTab}
              onOpenAddSaree={() => {
                setEditingSaree(null);
                setIsSareeModalOpen(true);
              }}
              onViewOrderInvoice={(order) => {
                setSelectedInvoiceOrder(order);
                setIsInvoiceModalOpen(true);
              }}
            />
          )}

          {activeTab === 'inventory' && (
            <SareeInventoryView
              sarees={sarees}
              lang={lang}
              onAddSaree={() => {
                setEditingSaree(null);
                setIsSareeModalOpen(true);
              }}
              onEditSaree={(saree) => {
                setEditingSaree(saree);
                setIsSareeModalOpen(true);
              }}
              onDeleteSaree={handleDeleteSaree}
              onUpdateStock={handleUpdateStock}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView
              orders={orders}
              lang={lang}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onUpdateCourierInfo={handleUpdateCourierInfo}
              onViewInvoice={(order) => {
                setSelectedInvoiceOrder(order);
                setIsInvoiceModalOpen(true);
              }}
              onOpenSMSModal={(order) => {
                setSelectedSMSOrder(order);
                setIsSMSModalOpen(true);
              }}
            />
          )}

          {activeTab === 'customers' && <CustomersView customers={customers} lang={lang} />}

          {activeTab === 'coupons' && (
            <CouponsView
              coupons={coupons}
              lang={lang}
              onAddCoupon={(newC) => setCoupons((prev) => [newC, ...prev])}
              onToggleCouponStatus={(id) =>
                setCoupons((prev) =>
                  prev.map((c) =>
                    c.id === id
                      ? { ...c, status: c.status === 'active' ? 'disabled' : 'active' }
                      : c
                  )
                )
              }
              onDeleteCoupon={(id) => setCoupons((prev) => prev.filter((c) => c.id !== id))}
            />
          )}

          {activeTab === 'banners' && (
            <BannersView
              banners={banners}
              lang={lang}
              onAddBanner={(newB) => setBanners((prev) => [...prev, newB])}
              onToggleBanner={(id) =>
                setBanners((prev) =>
                  prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
                )
              }
            />
          )}

          {activeTab === 'weavers' && <WeaversView weavers={weavers} lang={lang} />}

          {activeTab === 'analytics' && (
            <AnalyticsView sarees={sarees} orders={orders} lang={lang} />
          )}

          {activeTab === 'settings' && <SettingsView lang={lang} />}
        </main>
      </div>

      {/* Modals */}
      <SareeModal
        isOpen={isSareeModalOpen}
        onClose={() => {
          setIsSareeModalOpen(false);
          setEditingSaree(null);
        }}
        onSave={handleSaveSaree}
        editingSaree={editingSaree}
        lang={lang}
      />

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setSelectedInvoiceOrder(null);
        }}
        order={selectedInvoiceOrder}
        lang={lang}
      />

      <SMSModal
        isOpen={isSMSModalOpen}
        onClose={() => {
          setIsSMSModalOpen(false);
          setSelectedSMSOrder(null);
        }}
        order={selectedSMSOrder}
        lang={lang}
      />
    </div>
  );
}
