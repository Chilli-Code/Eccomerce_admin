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
  pending: "#f59e0b",
  processing: "#6366f1",
  in_transit: "#06b6d4",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

const ICONS = [TrendingUp, ShoppingCart, Users, Clock];
const STAT_LABELS = ["Ingresos Totales", "Total Pedidos", "Total Clientes", "Pendientes"];

function formatCurrency(n) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(20000);
  const navigate = useNavigate();

  useEffect(() => {
    api.reports.dashboard()
      .then(d => {
        setData(d);
        if (d.monthlyTarget) setTarget(Number(d.monthlyTarget));
      })
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

  const { stats, monthlySales, statusDistribution, topProducts, recentOrders, geoData, monthlyTarget } = data;

  const statValues = [
    { label: "Ingresos Totales", value: formatCurrency(stats.revenue), change: "+12.5%" },
    { label: "Total Pedidos", value: stats.orders.toLocaleString(), change: "+8.2%" },
    { label: "Total Clientes", value: stats.customers.toLocaleString(), change: "+5.1%" },
    { label: "Pendientes", value: stats.pendingOrders.toLocaleString(), change: "-2.3%" },
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
          <h1 className="page-title">Panel de Control</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Resumen de la tienda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statValues.map((s, i) => {
              const Icon = ICONS[i];
              return (
                <div key={s.label} className="stat-card">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                    <Icon size={18} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">{s.label}</p>
                    <p className="text-xl 2xl:text-3xl font-semibold text-gray-900 dark:text-white [text-wrap:balance] leading-tight">{s.value}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-500">↑ {s.change}</span>
                </div>
              );
            })}
          </div>

          <div className="card p-5 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Ventas Mensuales</h2>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={monthlySales} barSize={16} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${v / 1000}k` : v} />
                <Tooltip
                  formatter={v => [formatCurrency(v), "Ingresos"]}
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }}
                  cursor={{ fill: "rgba(99, 102, 241, 0.15)" }}
                />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <GaugeChart target={target} revenue={stats.revenue} today={Math.round(stats.revenue / 30)} monthlySales={monthlySales} onTargetChange={setTarget} />
      </div>

      <StatisticsChart monthlySales={monthlySales} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Estado de Pedidos</h2>
          <p className="text-xs text-gray-400 mb-4">Distribución</p>
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
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Más Vendidos</h2>
            <button onClick={() => navigate("/products")} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">Ver todos</button>
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
                    <p className="text-xs text-gray-400">{p.units} vendidos · {formatCurrency(p.revenue)}</p>
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
