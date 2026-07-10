import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit2, TrendingUp, ShoppingCart, Eye, Star, MapPin, Users, Package } from "../../lib/icons.js";
import { allProducts, allOrders, allCustomers } from "../../data/mock.js";
import { StatusBadge } from "../../components/ui/index.jsx";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "../../lib/charts.js";

const MONTHLY_SALES = [
  { month: "Sep", units: 8,  revenue: 3192 },
  { month: "Oct", units: 14, revenue: 5586 },
  { month: "Nov", units: 22, revenue: 8778 },
  { month: "Dec", units: 31, revenue: 12369 },
  { month: "Ene", units: 18, revenue: 7182 },
  { month: "Feb", units: 25, revenue: 9975 },
  { month: "Mar", units: 38, revenue: 15162 },
];

const CITIES = [
  { city: "Bogotá",       pct: 42, orders: 80, color: "#4f46e5" },
  { city: "Medellín",     pct: 18, orders: 35, color: "#10b981" },
  { city: "Cali",         pct: 14, orders: 27, color: "#f59e0b" },
  { city: "Barranquilla", pct: 10, orders: 19, color: "#8b5cf6" },
  { city: "Bucaramanga",  pct: 8,  orders: 15, color: "#ec4899" },
  { city: "Pereira",      pct: 8,  orders: 16, color: "#06b6d4" },
];

const TOP_CUSTOMERS = [
  { name: "Laura Gómez",   orders: 12, spent: "$4,788", initials: "LG", color: "#4f46e5" },
  { name: "Ana Martínez",  orders: 8,  spent: "$3,192", initials: "AM", color: "#10b981" },
  { name: "Carlos Ruiz",   orders: 5,  spent: "$1,995", initials: "CR", color: "#f59e0b" },
  { name: "Sofia López",   orders: 4,  spent: "$1,596", initials: "SL", color: "#8b5cf6" },
  { name: "David Chen",    orders: 3,  spent: "$1,197", initials: "DC", color: "#ec4899" },
];

const VARIANTS = [
  { name: "Talla 8",  sold: 45, stock: 12 },
  { name: "Talla 9",  sold: 62, stock: 8  },
  { name: "Talla 10", sold: 51, stock: 15 },
  { name: "Talla 11", sold: 34, stock: 6  },
];

export default function ProductStats() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = allProducts.find(p => p.id === Number(id)) || allProducts[0];

  const totalUnits   = MONTHLY_SALES.reduce((s, m) => s + m.units, 0);
  const totalRevenue = MONTHLY_SALES.reduce((s, m) => s + m.revenue, 0);
  const bestMonth    = MONTHLY_SALES.reduce((a, b) => a.units > b.units ? a : b);
  const convRate     = 12.4;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/products")} className="btn-ghost p-2 rounded-lg">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl flex-shrink-0">
              {product.image}
            </div>
            <div>
              <h1 className="page-title">{product.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm text-gray-400">{product.category}</p>
                <span className="text-gray-300">·</span>
                <p className="text-sm font-mono text-gray-400">{product.sku}</p>
                <StatusBadge status={product.status} />
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => navigate(`/products/${product.id}/edit`)} className="btn-primary gap-2">
          <Edit2 size={15} /> Editar producto
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Ingresos totales", value: `$${totalRevenue.toLocaleString()}`, sub: "últimos 7 meses", icon: TrendingUp, color: "text-primary-600 dark:text-primary-400", bg: "bg-primary-50 dark:bg-primary-900/30" },
          { label: "Unidades vendidas", value: totalUnits, sub: `mejor mes: ${bestMonth.month}`, icon: ShoppingCart, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Tasa conversión", value: `${convRate}%`, sub: "visitas → compra", icon: Eye, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Rating promedio", value: "4.8 ⭐", sub: "142 reseñas", icon: Star, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
        ].map(k => (
          <div key={k.label} className="card px-5 py-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${k.bg}`}>
              <k.icon size={18} className={k.color} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{k.label}</p>
              <p className={`text-xl font-semibold ${k.color}`}>{k.value}</p>
              <p className="text-[11px] text-gray-400">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Ventas mensuales */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Ventas mensuales</h2>
          <p className="text-xs text-gray-400 mb-4">Unidades vendidas por mes</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY_SALES}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={v => [`${v} uds`, "Unidades"]}
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }}
              />
              <Area type="monotone" dataKey="units" stroke="#4f46e5" strokeWidth={2} fill="url(#salesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue mensual */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Ingresos mensuales</h2>
          <p className="text-xs text-gray-400 mb-4">Revenue generado por mes</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_SALES} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip
                formatter={v => [`$${v.toLocaleString()}`, "Ingresos"]}
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }}
                cursor={{ fill: "rgba(99,102,241,0.08)" }}
              />
              <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ciudades + Variantes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Top ciudades */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={15} className="text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Ventas por ciudad</h2>
          </div>
          <div className="space-y-3">
            {CITIES.map((c, i) => (
              <div key={c.city}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-400 w-4">#{i + 1}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{c.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{c.orders} órdenes</span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-8 text-right">{c.pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${c.pct}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Variantes */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package size={15} className="text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Rendimiento por variante</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Variante</th>
                  <th>Vendidos</th>
                  <th>Stock</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {VARIANTS.map(v => (
                  <tr key={v.name}>
                    <td className="font-medium text-gray-700 dark:text-gray-300">{v.name}</td>
                    <td className="font-semibold text-primary-600 dark:text-primary-400">{v.sold}</td>
                    <td className={v.stock <= 8 ? "text-red-500 font-medium" : "text-gray-500"}>{v.stock}</td>
                    <td>
                      <span className={`badge ${v.stock <= 8 ? "badge-red" : "badge-green"}`}>
                        {v.stock <= 8 ? "Stock bajo" : "OK"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top clientes */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users size={15} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Top clientes</h2>
          <span className="text-xs text-gray-400 ml-1">— clientes que más han comprado este producto</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {TOP_CUSTOMERS.map((c, i) => (
            <div key={c.name} className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 text-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto mb-2"
                style={{ background: c.color }}>
                {c.initials}
              </div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{c.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{c.orders} compras</p>
              <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-0.5">{c.spent}</p>
              {i === 0 && <span className="badge badge-yellow mt-1">Top comprador</span>}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}