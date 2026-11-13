import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  Calendar,
  Check,
  Menu,
  Plus,
  Search,
  Settings,
  X,
} from 'lucide-react';
import { ADMIN_PROFILE } from '../data/mockData';
import { DateRange, NavPage, NotificationItem } from '../types/dashboard';

interface TopBarProps {
  activePage: NavPage;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onOpenMobileMenu: () => void;
  onOpenAddProduct: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onNotificationClick: (item: NotificationItem) => void;
  onNavigate: (page: NavPage) => void;
}

const PAGE_TITLES: Record<NavPage, string> = {
  dashboard: 'Dashboard',
  orders: 'Orders',
  products: 'Products',
  customers: 'Customers',
  analytics: 'Analytics',
  discounts: 'Discounts',
  settings: 'Settings',
};

const DATE_LABELS: { value: DateRange; label: string }[] = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '1y', label: '1 Year' },
];

export function TopBar({
  activePage,
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  onOpenMobileMenu,
  onOpenAddProduct,
  notifications,
  onMarkAllRead,
  onNotificationClick,
  onNavigate,
}: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Trigger + Page Title + Global Search */}
      <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 -ml-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight whitespace-nowrap shrink-0">
          {PAGE_TITLES[activePage]}
        </h1>

        <div className="hidden md:flex items-center relative flex-1 max-w-sm">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search orders, customers, or products..."
            aria-label="Global search"
            className="w-full h-9 pl-9 pr-8 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Date Filter + Add Product + Notifications + Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Date Filter */}
        <div className="relative hidden sm:flex items-center">
          <Calendar
            className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none"
            aria-hidden="true"
          />
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value as DateRange)}
            aria-label="Select date range"
            className="h-9 pl-9 pr-7 text-xs sm:text-sm font-medium bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 cursor-pointer transition-colors"
          >
            {DATE_LABELS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Primary Action: Add Product */}
        <button
          type="button"
          onClick={onOpenAddProduct}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Add Product</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
            aria-expanded={notifOpen}
            className="relative w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-indigo-600 text-white text-[10px] font-semibold flex items-center justify-center tabular-nums">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-lg py-2 z-40">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-900">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={onMarkAllRead}
                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onNotificationClick(item);
                      setNotifOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${
                      item.unread ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {item.detail}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setNotifOpen(false);
            }}
            aria-label="Account menu"
            aria-expanded={profileOpen}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {avatarFailed ? (
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center justify-center">
                CL
              </div>
            ) : (
              <img
                src={ADMIN_PROFILE.avatar}
                alt={ADMIN_PROFILE.name}
                referrerPolicy="no-referrer"
                onError={() => setAvatarFailed(true)}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
            )}
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-tight whitespace-nowrap">
                {ADMIN_PROFILE.name}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight whitespace-nowrap">
                {ADMIN_PROFILE.role}
              </p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-slate-200 shadow-lg py-2 z-40">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-900">
                  {ADMIN_PROFILE.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {ADMIN_PROFILE.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onNavigate('settings');
                  setProfileOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Store Settings</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
