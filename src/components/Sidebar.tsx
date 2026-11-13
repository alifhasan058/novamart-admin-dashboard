import {
  BarChart3,
  LayoutDashboard,
  Package,
  Percent,
  Settings,
  ShoppingBag,
  Users,
  X,
} from 'lucide-react';
import { NavPage } from '../types/dashboard';

interface SidebarProps {
  activePage: NavPage;
  onSelectPage: (page: NavPage) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  pendingOrdersCount: number;
  lowStockCount: number;
}

const NAV_ITEMS: { id: NavPage; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'discounts', label: 'Discounts', icon: Percent },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({
  activePage,
  onSelectPage,
  mobileOpen,
  onCloseMobile,
  pendingOrdersCount,
  lowStockCount,
}: SidebarProps) {
  const handleNavigate = (page: NavPage) => {
    onSelectPage(page);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800/80 shrink-0">
        <button
          type="button"
          onClick={() => handleNavigate('dashboard')}
          className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-sm shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-4.5 h-4.5 text-white"
              aria-hidden="true"
            >
              <path
                d="M4 17V7l8 6 8-6v10"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap">
            NovaMart
          </span>
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav aria-label="Primary Sidebar" className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          const count =
            item.id === 'orders'
              ? pendingOrdersCount
              : item.id === 'products'
                ? lowStockCount
                : 0;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                isActive
                  ? 'bg-indigo-500/15 text-white'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon
                  className={`w-4.5 h-4.5 shrink-0 ${
                    isActive ? 'text-indigo-400' : 'text-slate-400'
                  }`}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </span>

              {count > 0 && (
                <span
                  className={`text-xs tabular-nums font-medium ${
                    isActive ? 'text-indigo-300' : 'text-slate-500'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quiet Store Context Footer */}
      <div className="px-5 py-4 border-t border-slate-800/80 shrink-0">
        <p className="text-xs font-medium text-slate-300">NovaMart North America</p>
        <p className="text-xs text-slate-500 mt-0.5">USD · Tax & shipping active</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64 border-r border-slate-800">
        {navContent}
      </aside>

      {/* Mobile / Tablet Slide-over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-64 max-w-[80vw] shadow-xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
