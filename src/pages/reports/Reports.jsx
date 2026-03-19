import { useState } from "react";
import clsx from "clsx";
import {
  BarChart, Bar, LineChart, Line, FunnelChart, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import { Download, TrendingUp, TrendingDown, Users, ShoppingBag, CreditCard, Tag, Package, BarChart2, Trash2   } from "lucide-react";

// ── Mock data exclusivo para reportes (no repetido en otros módulos) ──

const SALES_TREND = [
  { week: "S1 Ene", revenue: 8200,  orders: 68,  avg: 120 },
  { week: "S2 Ene", revenue: 9400,  orders: 74,  avg: 127 },
  { week: "S3 Ene", revenue: 7800,  orders: 61,  avg: 127 },
  { week: "S4 Ene", revenue: 11200, orders: 89,  avg: 125 },
  { week: "S1 Feb", revenue: 10500, orders: 82,  avg: 128 },
  { week: "S2 Feb", revenue: 12800, orders: 98,  avg: 130 },
  { week: "S3 Feb", revenue: 11900, orders: 91,  avg: 130 },
  { week: "S4 Feb", revenue: 14200, orders: 109, avg: 130 },
  { week: "S1 Mar", revenue: 13100, orders: 99,  avg: 132 },
  { week: "S2 Mar", revenue: 15600, orders: 118, avg: 132 },
  { week: "S3 Mar", revenue: 14800, orders: 112, avg: 132 },
  { week: "S4 Mar", revenue: 17200, orders: 130, avg: 132 },
];

const TOP_PRODUCTS = [
  { name: "Air Force 1 Low", category: "Sneakers", units: 192, revenue: 76608, growth: 18.4 },
  { name: "Classic Hoodie",  category: "Apparel",  units: 143, revenue: 12727, growth: 12.1 },
  { name: "Slim Chinos",     category: "Pants",    units: 98,  revenue: 6370,  growth: -3.2 },
  { name: "Leather Wallet",  category: "Accesorios", units: 77, revenue: 3465, growth: 8.7 },
  { name: "Canvas Backpack", category: "Bags",     units: 64,  revenue: 8256,  growth: 22.3 },
  { name: "Crew Neck Tee",   category: "Apparel",  units: 58,  revenue: 2030,  growth: 5.6 },
  { name: "Denim Jacket",    category: "Outerwear",units: 41,  revenue: 6109,  growth: -1.8 },
];

const CUSTOMER_SEGMENTS = [
  { segment: "Nuevos",      count: 1240, revenue: 87400,  avgTicket: 70,  pct: 32 },
  { segment: "Recurrentes", count: 1580, revenue: 198200, avgTicket: 125, pct: 41 },
  { segment: "VIP (5+ compras)", count: 620, revenue: 148800, avgTicket: 240, pct: 16 },
  { segment: "Inactivos",   count: 480,  revenue: 0,      avgTicket: 0,   pct: 11 },
];

const FUNNEL = [
  { stage: "Visitas",      value: 12400, pct: 100, color: "#4f46e5" },
  { stage: "Vieron producto", value: 6820, pct: 55, color: "#6366f1" },
  { stage: "Agregaron al carrito", value: 2890, pct: 23, color: "#818cf8" },
  { stage: "Iniciaron checkout", value: 1240, pct: 10, color: "#a5b4fc" },
  { stage: "Completaron compra",  value: 820,  pct: 6.6, color: "#c7d2fe" },
];

const PAYMENT_METHODS = [
  { method: "Tarjeta crédito", value: 58, color: "#4f46e5" },
  { method: "PSE",             value: 22, color: "#10b981" },
  { method: "PayPal",          value: 12, color: "#f59e0b" },
  { method: "Contraentrega",   value: 8,  color: "#8b5cf6" },
];

const FAILED_PAYMENTS = [
  { reason: "Fondos insuficientes", count: 48, pct: 41 },
  { reason: "Tarjeta rechazada",    count: 32, pct: 27 },
  { reason: "Timeout",              count: 21, pct: 18 },
  { reason: "Datos incorrectos",    count: 17, pct: 14 },
];

const COUPON_PERF = [
  { code: "SUMMER20",  uses: 48,  revenue: 6220,  discount: 1555, roi: 3.0 },
  { code: "WELCOME10", uses: 203, revenue: 18270, discount: 2030, roi: 8.0 },
  { code: "FLAT15",    uses: 19,  revenue: 1900,  discount: 285,  roi: 5.7 },
];

const INVENTORY_RISK = [
  { name: "Canvas Backpack", stock: 0,  sold30d: 18, daysLeft: 0,  risk: "agotado" },
  { name: "Running Shorts",  stock: 4,  sold30d: 12, daysLeft: 10, risk: "critico" },
  { name: "Denim Jacket",    stock: 18, sold30d: 14, daysLeft: 38, risk: "bajo" },
  { name: "Slim Chinos",     stock: 34, sold30d: 24, daysLeft: 42, risk: "bajo" },
  { name: "Air Force 1 Low", stock: 48, sold30d: 65, daysLeft: 22, risk: "bajo" },
  { name: "Classic Hoodie",  stock: 120,sold30d: 48, daysLeft: 75, risk: "ok" },
];

const CATEGORY_RADAR = [
  { category: "Sneakers",  ventas: 85, margen: 62, devolucion: 3,  crecimiento: 78 },
  { category: "Apparel",   ventas: 70, margen: 55, devolucion: 8,  crecimiento: 65 },
  { category: "Bags",      ventas: 45, margen: 70, devolucion: 2,  crecimiento: 88 },
  { category: "Outerwear", ventas: 38, margen: 48, devolucion: 5,  crecimiento: 42 },
  { category: "Accesorios",ventas: 55, margen: 75, devolucion: 1,  crecimiento: 60 },
];

const TABS = [
  { key: "sales",     label: "Ventas",      icon: TrendingUp  },
  { key: "products",  label: "Productos",   icon: ShoppingBag },
  { key: "customers", label: "Clientes",    icon: Users       },
  { key: "payments",  label: "Pagos",       icon: CreditCard  },
  { key: "coupons",   label: "Cupones",     icon: Tag         },
  { key: "inventory", label: "Inventario",  icon: Package     },
];

// ── Helpers ──
function KpiCard({ label, value, sub, up, icon: Icon, color, bg }) {
  return (
    <div className="card px-4 py-3 flex items-center gap-3">
      <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", bg)}>
        <Icon size={18} className={color} />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className={clsx("text-xl font-semibold", color)}>{value}</p>
        {sub && (
          <p className="text-[11px] text-gray-400 flex items-center gap-1">
            {up !== undefined && (
              up ? <TrendingUp size={10} className="text-emerald-500" />
                 : <TrendingDown size={10} className="text-red-400" />
            )}
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

const RISK_BADGE = {
  agotado: "badge badge-red",
  critico: "badge badge-yellow",
  bajo:    "badge badge-blue",
  ok:      "badge badge-green",
};
const RISK_LABEL = { agotado: "Agotado", critico: "Crítico", bajo: "Stock bajo", ok: "OK" };

// ── Tabs de contenido ──

function SalesTab() {
  const [period, setPeriod] = useState("12w");

  const filteredData = {
    "4w":  SALES_TREND.slice(-4),
    "8w":  SALES_TREND.slice(-8),
    "12w": SALES_TREND,
  }[period];

  const totalRevenue = filteredData.reduce((s, w) => s + w.revenue, 0);
  const totalOrders  = filteredData.reduce((s, w) => s + w.orders, 0);
  const avgTicket    = Math.round(totalRevenue / totalOrders);
  const lastWeek     = filteredData.at(-1);
  const prevWeek     = filteredData.at(-2);
  const growth       = (((lastWeek.revenue - prevWeek.revenue) / prevWeek.revenue) * 100).toFixed(1);
const [dateFilter, setDateFilter] = useState("");

  // comparativa periodo anterior
  const prevPeriodData = {
    "4w":  SALES_TREND.slice(-8, -4),
    "8w":  SALES_TREND.slice(-12, -4),  // aproximado
    "12w": SALES_TREND.slice(0, 6),
  }[period];
  const prevRevenue = prevPeriodData.reduce((s, w) => s + w.revenue, 0);
  const revenueGrowth = (((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1);

  return (
    <div className="space-y-5">

      {/* Filtro de período */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Mostrando datos de las últimas <br /><strong className="text-gray-700 dark:text-gray-300">
            {{ "4w": "4", "8w": "8", "12w": "12" }[period]} semanas
          </strong>
        </p>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { key: "4w",  label: "4 sem" },
            { key: "8w",  label: "8 sem" },
            { key: "12w", label: "12 sem" },
          ].map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={clsx(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                period === p.key
                  ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
  <input
    type="date"
    value={dateFilter}
    onChange={e => setDateFilter(e.target.value)}
    className="input text-sm py-1.5 w-auto"
  />
  {dateFilter && (
    <button onClick={() => setDateFilter("")} className="text-xs text-gray-400 hover:text-gray-600">
      <Trash2  size={14} className="text-red-500" />
    </button>
  )}
</div>
      </div>

{dateFilter && (
  <div className="card p-5">
    <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
      Órdenes del {new Date(dateFilter + "T12:00:00").toLocaleDateString("es-CO", { weekday:"long", day:"numeric", month:"long" })}
    </h3>
    {/* filtra tus órdenes mock por fecha */}
    <p className="text-xs text-gray-400">3 órdenes · $420 en revenue</p>
  </div>
)}
      {/* KPI cards con comparativa */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Revenue total"    value={`$${(totalRevenue/1000).toFixed(1)}K`} sub={`${revenueGrowth > 0 ? "+" : ""}${revenueGrowth}% vs período anterior`} up={revenueGrowth > 0} icon={TrendingUp}  color="text-primary-600 dark:text-primary-400" bg="bg-primary-50 dark:bg-primary-900/30" />
        <KpiCard label="Órdenes totales" value={totalOrders} sub="en el período"                    icon={ShoppingBag} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-900/20" />
        <KpiCard label="Ticket promedio" value={`$${avgTicket}`} sub="por orden"                   icon={CreditCard}  color="text-amber-500"   bg="bg-amber-50 dark:bg-amber-900/20" />
        <KpiCard label="Mejor semana"    value={`$${(Math.max(...filteredData.map(w => w.revenue))/1000).toFixed(1)}K`} sub={filteredData.reduce((a,b) => a.revenue > b.revenue ? a : b).week} icon={TrendingUp} color="text-purple-600 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-900/20" />
      </div>

      {/* Banner comparativa vs período anterior */}
      <div className={clsx(
        "rounded-xl px-5 py-3 flex items-center justify-between border",
        revenueGrowth > 0
          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
          : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
      )}>
        <div className="flex items-center gap-3">
          {revenueGrowth > 0
            ? <TrendingUp size={18} className="text-emerald-600 dark:text-emerald-400" />
            : <TrendingDown size={18} className="text-red-500" />
          }
          <div>
            <p className={clsx("text-sm font-semibold", revenueGrowth > 0 ? "text-emerald-700 dark:text-emerald-300" : "text-red-600 dark:text-red-400")}>
              {revenueGrowth > 0 ? "📈" : "📉"} Revenue {revenueGrowth > 0 ? "arriba" : "abajo"} {Math.abs(revenueGrowth)}% vs período anterior
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Período actual: ${totalRevenue.toLocaleString()} · Período anterior: ${prevRevenue.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Diferencia</p>
          <p className={clsx("text-sm font-bold", revenueGrowth > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500")}>
            {revenueGrowth > 0 ? "+" : ""} ${(totalRevenue - prevRevenue).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Día de la semana con más ventas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Patrón semanal</h3>
          <p className="text-xs text-gray-400 mb-4">Días con mayor volumen de ventas</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={[
              { dia: "Lun", ventas: 18 },
              { dia: "Mar", ventas: 22 },
              { dia: "Mié", ventas: 19 },
              { dia: "Jue", ventas: 25 },
              { dia: "Vie", ventas: 31 },
              { dia: "Sáb", ventas: 28 },
              { dia: "Dom", ventas: 14 },
            ]} barSize={20}>
              <XAxis dataKey="dia" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Bar dataKey="ventas" name="Órdenes" radius={[4,4,0,0]}>
                {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map((_, i) => (
                  <Cell key={i} fill={i === 4 ? "#4f46e5" : i === 5 ? "#6366f1" : "#e0e7ff"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-center text-gray-400 mt-1">
            <span className="font-semibold text-primary-600 dark:text-primary-400">Viernes</span> es el día con más ventas
          </p>
        </div>

        {/* Gráficas de revenue y órdenes */}
        <div className="xl:col-span-2 card p-5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Revenue semanal</h3>
          <p className="text-xs text-gray-400 mb-4">Ingresos del período seleccionado</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
              <XAxis dataKey="week" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip formatter={v => [`$${v.toLocaleString()}`, "Revenue"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fill="url(#rg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Órdenes vs ticket */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Órdenes vs ticket promedio</h3>
        <p className="text-xs text-gray-400 mb-4">Volumen de órdenes y valor promedio — período seleccionado</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
            <XAxis dataKey="week" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left"  tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="left"  type="monotone" dataKey="orders" name="Órdenes"      stroke="#10b981" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="avg"    name="Ticket prom." stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Funnel */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Funnel de conversión</h3>
        <p className="text-xs text-gray-400 mb-5">Dónde se pierden los clientes en el proceso de compra</p>
        <div className="space-y-3">
          {FUNNEL.map((f, i) => (
            <div key={f.stage}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 w-4">{i + 1}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{f.stage}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{f.value.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-10 text-right">{f.pct}%</span>
                </div>
              </div>
              <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="h-full rounded-lg flex items-center px-2 transition-all duration-700"
                  style={{ width: `${f.pct}%`, background: f.color }}>
                  {f.pct > 10 && <span className="text-[10px] text-white font-semibold">{f.pct}%</span>}
                </div>
              </div>
              {i < FUNNEL.length - 1 && (
                <p className="text-[11px] text-red-400 mt-0.5 pl-6">
                  -{(100 - (FUNNEL[i+1].pct / f.pct * 100)).toFixed(0)}% abandona aquí
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsTab() {
    const [dateRange, setDateRange] = useState({ from: "", to: "" });
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Productos activos"    value="8"    sub="2 sin stock"        icon={Package}    color="text-primary-600 dark:text-primary-400" bg="bg-primary-50 dark:bg-primary-900/30" />
        <KpiCard label="Unidades vendidas"    value="673"  sub="últimos 30 días"    icon={ShoppingBag} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-900/20" />
        <KpiCard label="Producto estrella"    value="Air Force 1" sub="+18.4% vs mes ant." up icon={TrendingUp} color="text-amber-500" bg="bg-amber-50 dark:bg-amber-900/20" />
        <KpiCard label="Revenue top producto" value="$76.6K" sub="Air Force 1 Low"  icon={CreditCard} color="text-purple-600 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-900/20" />
      </div>

      {/* Tabla top productos */}
      <div className="table-wrap">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Top productos por revenue</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Unidades</th>
                <th>Revenue</th>
                <th>Crecimiento</th>
                <th>% del total</th>
              </tr>
            </thead>
            <tbody>
              {TOP_PRODUCTS.map((p, i) => {
                const totalRev = TOP_PRODUCTS.reduce((s, x) => s + x.revenue, 0);
                const pct = ((p.revenue / totalRev) * 100).toFixed(1);
                return (
                  <tr key={p.name}>
                    <td className="text-gray-400 font-semibold">#{i + 1}</td>
                    <td className="font-medium text-gray-800 dark:text-gray-200">{p.name}</td>
                    <td><span className="badge badge-gray">{p.category}</span></td>
                    <td className="font-semibold text-primary-600 dark:text-primary-400">{p.units}</td>
                    <td className="font-semibold">${p.revenue.toLocaleString()}</td>
                    <td>
                      <span className={clsx("flex items-center gap-1 text-xs font-semibold",
                        p.growth > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
                      )}>
                        {p.growth > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {p.growth > 0 ? "+" : ""}{p.growth}%
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-8">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
      </div>

      {/* Radar por categoría */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Análisis por categoría</h3>
        <p className="text-xs text-gray-400 mb-4">Ventas, margen, devoluciones y crecimiento — score 0-100</p>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={CATEGORY_RADAR}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
            <Radar name="Ventas"      dataKey="ventas"      stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.15} />
            <Radar name="Margen"      dataKey="margen"      stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
            <Radar name="Crecimiento" dataKey="crecimiento" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="card p-5">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Productos vendidos por fecha</h3>
      <p className="text-xs text-gray-400 mt-0.5">Filtra qué productos se compraron en un rango específico</p>
    </div>
    <div className="flex items-center gap-2">
      <input type="date" value={dateRange.from} onChange={e => setDateRange(r => ({...r, from: e.target.value}))} className="input text-sm py-1.5 w-auto" />
      <span className="text-xs text-gray-400">→</span>
      <input type="date" value={dateRange.to} onChange={e => setDateRange(r => ({...r, to: e.target.value}))} className="input text-sm py-1.5 w-auto" />
      {(dateRange.from || dateRange.to) && (
        <button onClick={() => setDateRange({ from: "", to: "" })} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
      )}
    </div>
  </div>

  {dateRange.from && dateRange.to ? (
    <table className="table-base">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Categoría</th>
          <th>Unidades</th>
          <th>Revenue</th>
        </tr>
      </thead>
      <tbody>
        {TOP_PRODUCTS.map(p => (
          <tr key={p.name}>
            <td className="font-medium text-gray-800 dark:text-gray-200">{p.name}</td>
            <td><span className="badge badge-gray">{p.category}</span></td>
            <td className="font-semibold text-primary-600 dark:text-primary-400">{Math.round(p.units * 0.3)}</td>
            <td className="font-semibold">${Math.round(p.revenue * 0.3).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div className="py-8 text-center text-gray-400 text-sm">
      Selecciona un rango de fechas para ver los productos vendidos
    </div>
  )}
</div>
    </div>
  );
}

function CustomersTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total clientes"    value="3,920"  sub="+5.1% este mes" up icon={Users}      color="text-primary-600 dark:text-primary-400" bg="bg-primary-50 dark:bg-primary-900/30" />
        <KpiCard label="Tasa retención"    value="41%"    sub="clientes recurrentes" icon={TrendingUp} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-900/20" />
        <KpiCard label="LTV promedio"      value="$127"   sub="lifetime value"  icon={CreditCard}  color="text-amber-500"   bg="bg-amber-50 dark:bg-amber-900/20" />
        <KpiCard label="Clientes VIP"      value="620"    sub="5+ compras"      icon={Users}       color="text-purple-600 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-900/20" />
      </div>

      {/* Segmentos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Segmentos de clientes</h3>
          <div className="space-y-4">
            {CUSTOMER_SEGMENTS.map((s, i) => {
              const colors = ["#4f46e5","#10b981","#f59e0b","#94a3b8"];
              return (
                <div key={s.segment}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{s.segment}</span>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{s.count.toLocaleString()} clientes</span>
                      <span className="font-semibold">{s.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: colors[i] }} />
                  </div>
                  <div className="flex justify-between mt-0.5 text-[11px] text-gray-400">
                    <span>Revenue: ${s.revenue.toLocaleString()}</span>
                    <span>Ticket prom: {s.avgTicket > 0 ? `$${s.avgTicket}` : "—"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Revenue por segmento</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CUSTOMER_SEGMENTS.filter(s => s.revenue > 0)} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
              <XAxis dataKey="segment" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip formatter={v => [`$${v.toLocaleString()}`, "Revenue"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {CUSTOMER_SEGMENTS.filter(s => s.revenue > 0).map((_, i) => (
                  <Cell key={i} fill={["#4f46e5","#10b981","#f59e0b"][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function PaymentsTab() {
  const totalFailed = FAILED_PAYMENTS.reduce((s, f) => s + f.count, 0);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Tasa de éxito"    value="94.2%" sub="+0.8% vs mes ant." up icon={TrendingUp}  color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-900/20" />
        <KpiCard label="Pagos fallidos"   value={totalFailed} sub="este mes"         icon={TrendingDown} color="text-red-500"    bg="bg-red-50 dark:bg-red-900/20" />
        <KpiCard label="Método principal" value="T. Crédito" sub="58% del total"   icon={CreditCard}  color="text-primary-600 dark:text-primary-400" bg="bg-primary-50 dark:bg-primary-900/30" />
        <KpiCard label="Reembolsos"       value="$1,240" sub="8 reembolsos"        icon={TrendingDown} color="text-amber-500"   bg="bg-amber-50 dark:bg-amber-900/20" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Métodos de pago */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Métodos de pago</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={PAYMENT_METHODS} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {PAYMENT_METHODS.map((m, i) => <Cell key={i} fill={m.color} />)}
                </Pie>
                <Tooltip formatter={v => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5">
              {PAYMENT_METHODS.map(m => (
                <div key={m.method} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: m.color }} />
                    {m.method}
                  </span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{m.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Razones de fallo */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Razones de pagos fallidos</h3>
          <p className="text-xs text-gray-400 mb-4">{totalFailed} fallos este mes</p>
          <div className="space-y-3">
            {FAILED_PAYMENTS.map(f => (
              <div key={f.reason}>
                <div className="flex justify-between mb-1 text-xs">
                  <span className="text-gray-600 dark:text-gray-400">{f.reason}</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{f.count} ({f.pct}%)</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 rounded-full" style={{ width: `${f.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CouponsTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Cupones activos"  value="3"      sub="1 por vencer"     icon={Tag}         color="text-primary-600 dark:text-primary-400" bg="bg-primary-50 dark:bg-primary-900/30" />
        <KpiCard label="Usos totales"     value="270"    sub="este mes"         icon={ShoppingBag} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-900/20" />
        <KpiCard label="Revenue generado" value="$26.4K" sub="por cupones"      icon={TrendingUp}  color="text-amber-500"   bg="bg-amber-50 dark:bg-amber-900/20" />
        <KpiCard label="Descuento dado"   value="$3,870" sub="costo total"      icon={TrendingDown} color="text-red-500"   bg="bg-red-50 dark:bg-red-900/20" />
      </div>

      <div className="table-wrap">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Efectividad por cupón</h3>
        </div>
        <table className="table-base">
          <thead>
            <tr>
              <th>Código</th>
              <th>Usos</th>
              <th>Revenue generado</th>
              <th>Descuento dado</th>
              <th>ROI</th>
              <th>Rentabilidad</th>
            </tr>
          </thead>
          <tbody>
            {COUPON_PERF.map(c => (
              <tr key={c.code}>
                <td className="font-mono font-semibold text-primary-600 dark:text-primary-400">{c.code}</td>
                <td>{c.uses}</td>
                <td className="font-semibold text-emerald-600 dark:text-emerald-400">${c.revenue.toLocaleString()}</td>
                <td className="text-red-500">-${c.discount.toLocaleString()}</td>
                <td className="font-semibold">{c.roi}x</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(c.roi / 10 * 100, 100)}%` }} />
                    </div>
                    <span className={clsx("badge", c.roi >= 5 ? "badge-green" : "badge-yellow")}>
                      {c.roi >= 5 ? "Alto ROI" : "Medio"}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Productos sin stock" value="1"   sub="acción inmediata" icon={Package}      color="text-red-500"    bg="bg-red-50 dark:bg-red-900/20" />
        <KpiCard label="Stock crítico"       value="1"   sub="menos de 10 uds"  icon={TrendingDown} color="text-amber-500"   bg="bg-amber-50 dark:bg-amber-900/20" />
        <KpiCard label="Rotación promedio"   value="32d" sub="días sin restock"  icon={TrendingUp}  color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-900/20" />
        <KpiCard label="Valor en inventario" value="$48.2K" sub="costo estimado" icon={CreditCard} color="text-primary-600 dark:text-primary-400" bg="bg-primary-50 dark:bg-primary-900/30" />
      </div>

      <div className="table-wrap">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Riesgo de inventario</h3>
          <p className="text-xs text-gray-400 mt-0.5">Productos ordenados por urgencia de restock</p>
        </div>
        <table className="table-base">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Stock actual</th>
              <th>Vendidos (30d)</th>
              <th>Días restantes</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {INVENTORY_RISK.sort((a, b) => a.daysLeft - b.daysLeft).map(p => (
              <tr key={p.name}>
                <td className="font-medium text-gray-800 dark:text-gray-200">{p.name}</td>
                <td className={clsx("font-semibold", p.stock === 0 ? "text-red-500" : p.stock < 10 ? "text-amber-500" : "text-gray-700 dark:text-gray-300")}>
                  {p.stock}
                </td>
                <td>{p.sold30d}</td>
                <td>
                  {p.daysLeft === 0
                    ? <span className="text-red-500 font-semibold">Agotado</span>
                    : <span className={p.daysLeft < 20 ? "text-amber-500 font-semibold" : "text-gray-500"}>{p.daysLeft}d</span>
                  }
                </td>
                <td><span className={RISK_BADGE[p.risk]}>{RISK_LABEL[p.risk]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TAB_CONTENT = {
  sales: SalesTab, products: ProductsTab, customers: CustomersTab,
  payments: PaymentsTab, coupons: CouponsTab, inventory: InventoryTab,
};

// ── Main ──
export default function Reports() {
  const [activeTab, setActiveTab] = useState("sales");
  const Content = TAB_CONTENT[activeTab];

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reportes</h1>
          <p className="text-sm text-gray-400 mt-0.5">Análisis profundo de tu ecommerce</p>
        </div>
        <button className="btn-secondary gap-2">
          <Download size={15} /> Exportar PDF
        </button>
      </div>

      {/* Tabs */}
      <div className="card p-1.5">
        <div className="flex gap-1 flex-wrap">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === t.key
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Content />
    </div>
  );
}