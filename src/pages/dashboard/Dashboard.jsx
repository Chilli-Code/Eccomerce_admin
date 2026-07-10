import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "../../lib/charts.js";
import { TrendingUp, ShoppingCart, Users, Clock } from "../../lib/icons.js";
import GaugeChart from "../../components/charts/GaugeChart.jsx";
import StatisticsChart from "../../components/charts/StatisticsChart.jsx";
import CustomerMap from "../../components/charts/CustomerMap.jsx";
import RecentOrdersWidget from "../../components/charts/RecentOrdersWidget.jsx";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api.js";

const STATUS_COLORS = {
  completed: "#10b981",
  processing: "#6366f1",
  pending: "#f59e0b",
  cancelled: "#ef4444",
  shipped: "#3b82f6",
  delivered: "#8b5cf6",
};

const ICONS = [TrendingUp, ShoppingCart, Users, Clock];
const STAT_LABELS = ["Total Revenue", "Total Orders", "Total Customers", "Pending Orders"];

function formatCurrency(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.reports.dashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-sm text-gray-400 p-4">Error al cargar datos</p>;
  }

  const { stats, monthlySales, statusDistribution, topProducts, recentOrders, geoData } = data;

  const statValues = [
    { label: "Total Revenue", value: formatCurrency(stats.revenue), change: "+12.5%" },
    { label: "Total Orders", value: stats.orders.toLocaleString(), change: "+8.2%" },
    { label: "Total Customers", value: stats.customers.toLocaleString(), change: "+5.1%" },
    { label: "Pending Orders", value: stats.pendingOrders.toLocaleString(), change: "-2.3%" },
  ];

  const totalOrders = statusDistribution.reduce((sum, s) => sum + Number(s.count), 0) || 1;
  const pieData = statusDistribution.map(s => ({
    name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    value: Math.round((Number(s.count) / totalOrders) * 100),
    color: STATUS_COLORS[s.status] || "#6b7280",
  }));

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Resumen de la tienda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-4">
            {statValues.map((s, i) => {
              const Icon = ICONS[i];
              return (
                <div key={s.label} className="stat-card">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                    <Icon size={18} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">{s.label}</p>
                    <p className="text-3xl font-semibold text-gray-900 dark:text-white">{s.value}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-500">↑ {s.change}</span>
                </div>
              );
            })}
          </div>

          <div className="card p-5 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Monthly Sales</h2>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={monthlySales} barSize={16} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${v / 1000}k` : v} />
                <Tooltip
                  formatter={v => [`$${Number(v).toLocaleString()}`, "Revenue"]}
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }}
                  cursor={{ fill: "rgba(99, 102, 241, 0.15)" }}
                />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <GaugeChart value={75.55} change="+10%" target={20000} revenue={stats.revenue} today={Math.round(stats.revenue / 30)} />
      </div>

      <StatisticsChart monthlySales={monthlySales} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Order Status</h2>
          <p className="text-xs text-gray-400 mb-4">Distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: d.color }} />
                  <span className="text-gray-600 dark:text-gray-400">{d.name}</span>
                </span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
        <CustomerMap cities={geoData} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <RecentOrdersWidget orders={recentOrders} />
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Best Sellers</h2>
            <button onClick={() => navigate("/products")} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">View all</button>
          </div>
          {topProducts.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">No hay productos vendidos aún</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.productId} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.units} sold · {formatCurrency(p.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
