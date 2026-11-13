import { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { AddProductModal } from './components/AddProductModal';
import { AnalyticsView } from './components/AnalyticsView';
import { CustomersView } from './components/CustomersView';
import { DashboardView } from './components/DashboardView';
import { DiscountsView } from './components/DiscountsView';
import { OrderDetailModal } from './components/OrderDetailModal';
import { OrdersView } from './components/OrdersView';
import { ProductsView } from './components/ProductsView';
import { RestockModal } from './components/RestockModal';
import { SettingsView } from './components/SettingsView';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import {
  INITIAL_CUSTOMERS,
  INITIAL_DISCOUNTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
} from './data/mockData';
import {
  DateRange,
  DiscountCode,
  NavPage,
  NotificationItem,
  Order,
  OrderStatus,
  Product,
  StoreSettings,
} from './types/dashboard';

export default function App() {
  const [activePage, setActivePage] = useState<NavPage>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [globalSearch, setGlobalSearch] = useState('');

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customers] = useState(INITIAL_CUSTOMERS);
  const [discounts, setDiscounts] = useState<DiscountCode[]>(INITIAL_DISCOUNTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);

  const [addProductOpen, setAddProductOpen] = useState(false);
  const [restockTarget, setRestockTarget] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAddProductOpen(false);
        setRestockTarget(null);
        setSelectedOrder(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleAddProduct = (newProduct: Omit<Product, 'id' | 'unitsSold'>) => {
    const created: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      unitsSold: 0,
    };
    setProducts((prev) => [created, ...prev]);
    showToast(`Added "${created.name}" to NovaMart catalog.`);
  };

  const handleConfirmRestock = (productId: string, addUnits: number) => {
    let updatedName = '';
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          updatedName = p.name;
          return { ...p, stock: p.stock + addUnits };
        }
        return p;
      })
    );
    showToast(`Restocked ${updatedName} (+${addUnits} units).`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    setSelectedOrder((prev) => (prev && prev.id === orderId ? { ...prev, status } : prev));
    showToast(`Order #${orderId} updated to ${status}.`);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
    setActivePage(item.targetPage);
  };

  const handleToggleDiscount = (id: string) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
    );
  };

  const handleCreateDiscount = (
    discount: Omit<DiscountCode, 'id' | 'redemptions' | 'revenueGenerated'>
  ) => {
    const created: DiscountCode = {
      ...discount,
      id: `disc-${Date.now()}`,
      redemptions: 0,
      revenueGenerated: 0,
    };
    setDiscounts((prev) => [created, ...prev]);
    showToast(`Created promo code ${created.code}.`);
  };

  const handleSaveSettings = (next: StoreSettings) => {
    setSettings(next);
    showToast('Store settings saved.');
  };

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Processing'
  ).length;
  const lowStockCount = products.filter(
    (p) => p.stock <= settings.lowStockThreshold
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <Sidebar
        activePage={activePage}
        onSelectPage={setActivePage}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        pendingOrdersCount={pendingOrdersCount}
        lowStockCount={lowStockCount}
      />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopBar
          activePage={activePage}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenAddProduct={() => setAddProductOpen(true)}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onNotificationClick={handleNotificationClick}
          onNavigate={setActivePage}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardView
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              globalSearch={globalSearch}
              orders={orders}
              products={products}
              customers={customers}
              lowStockThreshold={settings.lowStockThreshold}
              onSelectOrder={setSelectedOrder}
              onRestockProduct={setRestockTarget}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'orders' && (
            <OrdersView
              orders={orders}
              globalSearch={globalSearch}
              onSelectOrder={setSelectedOrder}
            />
          )}

          {activePage === 'products' && (
            <ProductsView
              products={products}
              globalSearch={globalSearch}
              lowStockThreshold={settings.lowStockThreshold}
              onRestockProduct={setRestockTarget}
              onOpenAddProduct={() => setAddProductOpen(true)}
            />
          )}

          {activePage === 'customers' && (
            <CustomersView
              customers={customers}
              globalSearch={globalSearch}
            />
          )}

          {activePage === 'analytics' && (
            <AnalyticsView
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          )}

          {activePage === 'discounts' && (
            <DiscountsView
              discounts={discounts}
              onToggleDiscount={handleToggleDiscount}
              onCreateDiscount={handleCreateDiscount}
            />
          )}

          {activePage === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <AddProductModal
        open={addProductOpen}
        onClose={() => setAddProductOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <RestockModal
        product={restockTarget}
        onClose={() => setRestockTarget(null)}
        onConfirmRestock={handleConfirmRestock}
      />

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateOrderStatus}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-slate-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg border border-slate-800"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss notification"
            className="ml-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
