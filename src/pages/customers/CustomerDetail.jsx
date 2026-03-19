import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit2, Mail, Phone, MapPin, ShoppingCart, TrendingUp, Clock, Star } from "lucide-react";
import { allCustomers, allOrders } from "../../data/mock.js";
import { StatusBadge } from "../../components/ui/index.jsx";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const MONTHLY_SPEND = [
  { month: "Sep", spent: 0 },
  { month: "Oct", spent: 89 },
  { month: "Nov", spent: 0 },
  { month: "Dec", spent: 340 },
  { month: "Ene", spent: 0 },
  { month: "Feb", spent: 129 },
  { month: "Mar", spent: 210 },
];

const CUSTOMER_ORDERS = [
  { id: "#ORD-1042", date: "Mar 14, 2026", total: 129.90, status: "completed", items: 3 },
  { id: "#ORD-1038", date: "Mar 12, 2026", total: 210.00, status: "processing", items: 4 },
  { id: "#ORD-1031", date: "Feb 28, 2026", total: 89.00,  status: "completed",  items: 2 },
  { id: "#ORD-1020", date: "Dec 15, 2025", total: 340.50, status: "completed",  items: 5 },
  { id: "#ORD-1010", date: "Oct 3, 2025",  total: 89.00,  status: "completed",  items: 1 },
];

const FAVORITE_PRODUCTS = [
  { name: "Air Force 1 Low", purchases: 3, image: "👟" },
  { name: "Classic Hoodie",  purchases: 2, image: "👕" },
  { name: "Slim Chinos",     purchases: 1, image: "👖" },
];

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = allCustomers.find(c => c.id === Number(id)) || allCustomers[0];

  const totalSpent    = MONTHLY_SPEND.reduce((s, m) => s + m.spent, 0);
  const avgOrder      = (totalSpent / CUSTOMER_ORDERS.length).toFixed(2);
  const completedOrders = CUSTOMER_ORDERS.filter(o => o.status === "completed").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/customers")} className="btn-ghost p-2 rounded-lg">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-lg font-bold flex-shrink-0">
              {customer.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <h1 className="page-title">{customer.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm text-gray-400">{customer.email}</p>
                <span className="text-gray-300">·</span>
                <StatusBadge status={customer.status} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary gap-2"><Mail size={14} /> Enviar email</button>
          <button className="btn-primary gap-2"><Edit2 size={14} /> Editar</button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total gastado",    value: customer.spent,              icon: TrendingUp, color: "text-primary-600 dark:text-primary-400",   bg: "bg-primary-50 dark:bg-primary-900/30" },
          { label: "Órdenes totales",  value: customer.orders,             icon: ShoppingCart, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Valor promedio",   value: `$${avgOrder}`,              icon: Star,       color: "text-amber-500",                           bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Cliente desde",    value: customer.joined,             icon: Clock,      color: "text-purple-600 dark:text-purple-400",      bg: "bg-purple-50 dark:bg-purple-900/20" },
        ].map(k => (
          <div key={k.label} className="card px-5 py-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${k.bg}`}>
              <k.icon size={18} className={k.color} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{k.label}</p>
              <p className={`text-xl font-semibold ${k.color}`}>{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfica + Info personal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Gasto mensual */}
        <div className="card p-5 xl:col-span-2">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Historial de gasto</h2>
          <p className="text-xs text-gray-400 mb-4">Dinero gastado por mes</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY_SPEND}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip
                formatter={v => [`$${v}`, "Gasto"]}
                contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }}
              />
              <Area type="monotone" dataKey="spent" stroke="#4f46e5" strokeWidth={2} fill="url(#spendGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Info personal */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Información</h2>
          <div className="space-y-3">
            {[
              { icon: Mail,     label: "Email",      value: customer.email },
              { icon: Phone,    label: "Teléfono",   value: "+57 300 000 0000" },
              { icon: MapPin,   label: "Ciudad",     value: "Bogotá, Colombia" },
              { icon: Clock,    label: "Última compra", value: CUSTOMER_ORDERS[0].date },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400">{label}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Segmento */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[11px] text-gray-400 mb-2">Segmento</p>
            <div className="flex flex-wrap gap-1.5">
              {["Cliente VIP", "Recurrente", "Bogotá"].map(tag => (
                <span key={tag} className="badge badge-blue">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Historial órdenes + Productos favoritos */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Órdenes */}
        <div className="table-wrap xl:col-span-2">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Historial de órdenes</h2>
            <p className="text-xs text-gray-400 mt-0.5">{completedOrders} de {CUSTOMER_ORDERS.length} completadas</p>
          </div>
          <table className="table-base">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Artículos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {CUSTOMER_ORDERS.map(o => (
                <tr key={o.id} className="cursor-pointer" onClick={() => navigate(`/orders/${o.id.replace("#", "")}`)}>
                  <td className="font-mono text-xs text-primary-600 dark:text-primary-400">{o.id}</td>
                  <td className="text-center">{o.items}</td>
                  <td className="font-semibold">${o.total.toFixed(2)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className="text-xs text-gray-400">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Productos favoritos */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Productos favoritos</h2>
          <div className="space-y-3">
            {FAVORITE_PRODUCTS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center text-2xl shadow-sm">
                  {p.image}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.purchases} compras</p>
                </div>
                <span className="text-xs font-bold text-gray-400">#{i + 1}</span>
              </div>
            ))}
          </div>

          {/* Stats rápidas */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400">Tasa retorno</p>
              <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">84%</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400">NPS Score</p>
              <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">9/10</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}