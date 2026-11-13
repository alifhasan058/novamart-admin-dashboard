export type NavPage =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'customers'
  | 'analytics'
  | 'discounts'
  | 'settings';

export type DateRange = '7d' | '30d' | '90d' | '1y';

export type OrderStatus =
  | 'Delivered'
  | 'Processing'
  | 'Shipped'
  | 'Pending'
  | 'Cancelled';

export type ProductCategory =
  | 'Electronics'
  | 'Fashion'
  | 'Home & Living'
  | 'Beauty';

export interface KpiMetric {
  id: 'revenue' | 'orders' | 'customers' | 'aov';
  label: string;
  value: string;
  trend: string;
  isPositive: boolean;
  comparisonLabel: string;
}

export interface SalesDataPoint {
  label: string;
  fullDate: string;
  revenue: number;
  orders: number;
  visitors: number;
}

export interface CategorySlice {
  name: ProductCategory;
  percentage: number;
  revenue: number;
  color: string;
  orders: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  date: string;
  amount: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingCity: string;
  itemsCount: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  unitsSold: number;
  image?: string;
  isTopSeller?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  segment: 'VIP' | 'Repeat' | 'New';
}

export interface DiscountCode {
  id: string;
  code: string;
  description: string;
  type: 'Percentage' | 'Fixed' | 'Free Shipping';
  value: string;
  redemptions: number;
  maxRedemptions: number | null;
  revenueGenerated: number;
  expiresAt: string;
  active: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
  targetPage: NavPage;
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  currency: 'USD' | 'EUR' | 'GBP';
  lowStockThreshold: number;
  taxRate: number;
  orderAlerts: boolean;
  lowStockAlerts: boolean;
  weeklyDigest: boolean;
}
