import React, { useEffect, useState, useMemo } from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import BreadcrumbsNav from "../../components/common/BreadcrumbsNav/BreadcrumbsNav";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiTruck,
  FiActivity,
  FiTrendingUp,
} from "react-icons/fi";
import { getDashboardData } from "../../apis/SuperAdmin";

// Brand Colors
const COLORS = {
  primary: "#3d9bc7",
  secondary: "#6366f1",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  dark: "#1f2937",
  light: "#f3f4f6",
  grid: "#e5e7eb",
};

const CHART_COLORS = [
  "#3d9bc7",
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

const ORDER_STATUS_MAPPING = {
  1: "New",
  2: "Pick up",
  3: "In Wash",
  4: "Drying/Folding",
  5: "Out for Delivery",
  6: "Delivered",
  7: "Cancelled",
};

const StatCard = ({ title, value, icon: Icon, color, subValue, subLabel }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{value}</h3>
        {subValue && (
          <p className="mt-2 text-xs flex items-center gap-1">
            <span className="text-green-500 font-semibold bg-green-50 px-1.5 py-0.5 rounded-md">
              {subValue}
            </span>
            <span className="text-gray-400">{subLabel}</span>
          </p>
        )}
      </div>
      <div
        className={`p-3 rounded-xl flex items-center justify-center shadow-sm`}
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        <Icon size={24} />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardData();
        // handling structure from apiRequest wrapper
        if (response && response.status === 200) {
          // Sometimes the data is directly in response.data or response is the data object
          // based on ApiService, response is response.data from axios.
          if (response.data) {
            setData(response.data);
          } else {
            setData(response);
          }
        } else {
          // Fallback
          if (response?.kpis) {
            setData(response);
          } else {
            throw new Error(response?.message || "Failed to fetch data");
          }
        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare Chart Data
  const orderTrendData = useMemo(() => {
    return data?.ordersAnalytics?.ordersTrend.map(item => ({
      date: item.date,
      Orders: parseInt(item.count)
    })) || [];
  }, [data]);

  const revenueTrendData = useMemo(() => {
    return data?.revenueAnalytics?.revenueTrend.map(item => ({
      date: item.date,
      Revenue: parseFloat(item.amount)
    })) || [];
  }, [data]);

  const orderStatusData = useMemo(() => {
    return data?.ordersAnalytics?.orderStatusBreakdown.map((item) => ({
      name: ORDER_STATUS_MAPPING[item.order_status] || `Status ${item.order_status}`,
      value: parseInt(item.count),
    })) || [];
  }, [data]);

  const revenueByServiceData = useMemo(() => {
    return data?.revenueAnalytics?.revenueByService.map(item => ({
      name: item.category_name,
      value: parseFloat(item.revenue)
    })) || [];
  }, [data]);

  const formattedRevenue = useMemo(() => {
    if (!data?.kpis?.totalRevenue) return "₹0";
    // Basic formatting if Intl not desired, but Intl is better for currency
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(data.kpis.totalRevenue);
  }, [data]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-transparent border-[#3d9bc7] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-xl m-6 border border-red-200">
        <p className="font-bold">Error loading dashboard</p>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 main main_page min-h-screen bg-gray-50/50">
      <div className="mb-6">
        <BreadcrumbsNav />
        <PageTitle title="Dashboard Overview" />
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Orders"
          value={data?.kpis?.totalOrders || 0}
          icon={FiShoppingBag}
          color={COLORS.primary}
          subValue={data?.kpis?.newOrders ? `+${data.kpis.newOrders}` : "0"}
          subLabel="New Orders"
        />
        <StatCard
          title="Total Revenue"
          value={formattedRevenue}
          icon={FiDollarSign}
          color={COLORS.success}
          subValue={`₹${data?.kpis?.todayRevenue || 0}`}
          subLabel="Today's Revenue"
        />
        <StatCard
          title="Active Customers"
          value={data?.kpis?.activeCustomers || 0}
          icon={FiUsers}
          color={COLORS.warning}
          subValue={data?.customerAnalytics?.newVsReturning?.returningCustomers || 0}
          subLabel="Returning"
        />
        <StatCard
          title="Active Drivers"
          value={data?.kpis?.activeDrivers || 0}
          icon={FiTruck}
          color={COLORS.secondary}
          subValue={data?.driverAnalytics?.ordersPerDriver?.length || 0}
          subLabel="Drivers with orders"
        />
      </div>

      {/* Charts Row 1: Trends */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Order Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FiActivity className="text-blue-500" />
              Orders Trend
            </h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="Orders"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FiTrendingUp className="text-green-500" />
              Revenue Trend
            </h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="Revenue"
                  stroke={COLORS.success}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2: Breakdown & Service Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Order Status Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Order Status</h3>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
              <p className="text-gray-400 text-xs">Total</p>
              <p className="text-2xl font-bold text-gray-800">{data?.kpis?.totalOrders}</p>
            </div>
          </div>
        </div>

        {/* Revenue by Service */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue by Service</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueByServiceData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                barSize={30}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={COLORS.grid} />
                <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 500 }} width={100} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px' }} />
                <Bar dataKey="value" name="Revenue" radius={[0, 4, 4, 0]}>
                  {revenueByServiceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? COLORS.primary : COLORS.secondary} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Customers Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Top Customers</h3>
            <p className="text-sm text-gray-500">Highest spending customers</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Orders</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Total Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.customerAnalytics?.topCustomers?.map((customer, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {customer.name ? customer.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <span className="font-medium text-gray-800">{customer.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{customer.email || 'N/A'}</td>
                  <td className="p-4 text-sm text-gray-600 text-center">
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium border border-gray-200">
                      {customer.orders_count} orders
                    </span>
                  </td>
                  <td className="p-4 text-sm font-bold text-gray-800 text-right">
                    {customer.total_spend ? (
                      `₹${customer.total_spend}`
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {(!data?.customerAnalytics?.topCustomers || data.customerAnalytics.topCustomers.length === 0) && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-400">
                    No customer data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
