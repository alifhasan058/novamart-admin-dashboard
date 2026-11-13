import {
  CATEGORY_DATA_BY_RANGE,
  KPI_DATA_BY_RANGE,
  SALES_SERIES_BY_RANGE,
} from '../data/mockData';
import {
  Customer,
  DateRange,
  NavPage,
  Order,
  Product,
} from '../types/dashboard';
import { CategoryDonutChart } from './CategoryDonutChart';
import { KpiCards } from './KpiCards';
import { LowStockAlertCard } from './LowStockAlertCard';
import { RecentOrdersTable } from './RecentOrdersTable';
import { SalesOverviewChart } from './SalesOverviewChart';
import { TopCustomersCard } from './TopCustomersCard';
import { TopSellingProducts } from './TopSellingProducts';

interface DashboardViewProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  globalSearch: string;
  orders: Order[];
  products: Product[];
  customers: Customer[];
  lowStockThreshold: number;
  onSelectOrder: (order: Order) => void;
  onRestockProduct: (product: Product) => void;
  onNavigate: (page: NavPage) => void;
}

export function DashboardView({
  dateRange,
  onDateRangeChange,
  globalSearch,
  orders,
  products,
  customers,
  lowStockThreshold,
  onSelectOrder,
  onRestockProduct,
  onNavigate,
}: DashboardViewProps) {
  const kpis = KPI_DATA_BY_RANGE[dateRange];
  const salesSeries = SALES_SERIES_BY_RANGE[dateRange];
  const categorySlices = CATEGORY_DATA_BY_RANGE[dateRange];

  return (
    <div className="space-y-6">
      {/* 1. Top KPI Cards */}
      <KpiCards metrics={kpis} />

      {/* 2 & 3. Sales Overview Chart + Revenue by Category Donut */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="xl:col-span-8 flex flex-col">
          <div className="flex-1 flex flex-col [&>div]:flex-1">
            <SalesOverviewChart
              data={salesSeries}
              dateRange={dateRange}
              onDateRangeChange={onDateRangeChange}
            />
          </div>
        </div>
        <div className="xl:col-span-4 flex flex-col">
          <div className="flex-1 flex flex-col [&>div]:flex-1">
            <CategoryDonutChart slices={categorySlices} />
          </div>
        </div>
      </div>

      {/* 4 & 5. Recent Orders Table + Top Selling Products */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-8">
          <RecentOrdersTable
            orders={orders}
            globalSearch={globalSearch}
            onSelectOrder={onSelectOrder}
            onViewAllOrders={() => onNavigate('orders')}
            compact
          />
        </div>
        <div className="xl:col-span-4">
          <TopSellingProducts
            products={products}
            onViewAllProducts={() => onNavigate('products')}
          />
        </div>
      </div>

      {/* 6. Top Customers & Low Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <TopCustomersCard
          customers={customers}
          onViewAllCustomers={() => onNavigate('customers')}
        />
        <LowStockAlertCard
          products={products}
          threshold={lowStockThreshold}
          onRestockClick={onRestockProduct}
        />
      </div>
    </div>
  );
}
