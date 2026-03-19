import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { TrendingUp, ShoppingCart, Users, Clock, ArrowRight } from "../../lib/icons.js";
import { statsData, revenueChart, topProducts, recentOrders } from "../../data/mock.js";
import GaugeChart from "../../components/charts/GaugeChart.jsx";
import StatisticsChart from "../../components/charts/StatisticsChart.jsx";
import CustomerMap from "../../components/charts/CustomerMap.jsx";
import RecentOrdersWidget from "../../components/charts/RecentOrdersWidget.jsx";
import { Link } from "react-router-dom";
import { StatCard, StatusBadge } from "../../components/ui/index.jsx";



const PIE_DATA = [
  { name: "Completed", value: 68, color: "#10b981" },
  { name: "Processing", value: 20, color: "#6366f1" },
  { name: "Pending", value: 8, color: "#f59e0b" },
  { name: "Cancelled", value: 4, color: "#ef4444" },
];
const ICONS = [TrendingUp, ShoppingCart, Users, Clock];

export default function Dashboard() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Welcome back, Super Admin</p>
        </div>
        <div className="text-sm text-gray-400">March 15, 2026</div>
      </div>

      {/* Row 1: 3 stat cards + Gauge | Monthly Sales abajo */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Columna izquierda: 3 stats + Monthly Sales */}
        <div className="xl:col-span-2 flex flex-col gap-4">

          {/* 3 stat cards en fila */}
          <div className="grid grid-cols-3 gap-4">
            {statsData.filter(s => s.label !== "Pending Orders").map((s, i) => {
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
                  <span className={`text-xs font-semibold ${s.up ? "text-emerald-500" : "text-red-500"}`}>
                    {s.up ? "↑" : "↓"} {s.change}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Monthly Sales bar chart */}
          <div className="card p-5 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Monthly Sales</h2>
              <button className="text-gray-300 hover:text-gray-400 transition-colors">•••</button>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={revenueChart}
                barSize={16}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${v / 1000}k` : v} />
                <Tooltip
                  formatter={v => [`$${v.toLocaleString()}`, "Revenue"]}
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }}
                  cursor={{ fill: "rgba(99, 102, 241, 0.15)" }}
                />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Columna derecha: Gauge */}
        <GaugeChart value={75.55} change="+10%" target={20000} revenue={20000} today={3287} />

      </div>

      {/* Row 2: Statistics double area chart */}
      <StatisticsChart />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Order Status</h2>
          <p className="text-xs text-gray-400 mb-4">Distribution this month</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {PIE_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {PIE_DATA.map(d => (
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
        <CustomerMap />

      </div>
      {/* Row 3: Customer demographic map + Recent Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        <RecentOrdersWidget />
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Best Sellers</h2>
            <Link to="/products" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg flex-shrink-0">
                  {p.image}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.sold} sold · {p.price}</p>
                </div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">#{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
