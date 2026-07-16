import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit2, Mail, Phone, MapPin, ShoppingCart, TrendingUp, Clock, Star } from "../../lib/icons.js";
import { StatusBadge, Modal } from "../../components/ui/index.jsx";
import { api } from "../../lib/api.js";
import { notify } from "../../lib/notifications.js";
import Loader from "../../components/ui/Loader.jsx";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function CustomerDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    Promise.all([
      api.customers.get(id),
      api.orders.list({ limit: 100 }),
    ]).then(([c, o]) => {
      setCustomer(c);
      setForm({ name: c.name, email: c.email, phone: c.phone || "" });
      // filtra órdenes del cliente
      setOrders(o.filter(order => order.customerId === id));
    }).catch(() => {
      notify.error("Error al cargar cliente");
      navigate("/customers");
    }).finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async () => {
    try {
      const updated = await api.customers.update(id, form);
      setCustomer(updated);
      notify.customerUpdated?.(form.name) || notify.saved();
      setEditModal(false);
    } catch (err) {
      notify.error(err.message || "Error al actualizar");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Loader size={80} />
      <p className="text-sm text-gray-400">Cargando cliente…</p>
    </div>
  );

  if (!customer) return null;

  const totalSpent  = Number(customer.totalSpent || 0);
  const avgOrder    = orders.length > 0 ? (orders.reduce((s, o) => s + Number(o.total), 0) / orders.length).toFixed(2) : "0.00";
  const completed   = orders.filter(o => o.status === "delivered" || o.status === "in_transit").length;

  // Gasto mensual basado en órdenes reales
  const monthlySpend = orders.reduce((acc, o) => {
    const month = new Date(o.createdAt).toLocaleDateString("es-CO", { month: "short" });
    acc[month] = (acc[month] || 0) + Number(o.total);
    return acc;
  }, {});
  const spendData = Object.entries(monthlySpend).map(([month, spent]) => ({ month, spent }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="page-header flex-col md:flex-row gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/customers")} className="btn-ghost p-2 rounded-lg">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-lg font-bold flex-shrink-0">
              {customer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
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
          <a href={`mailto:${customer.email}`} className="btn-secondary gap-2">
            <Mail size={14} /> Enviar email
          </a>
          <button className="btn-primary gap-2" onClick={() => setEditModal(true)}>
            <Edit2 size={14} /> Editar
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total gastado",  value: `$${totalSpent.toFixed(2)}`, icon: TrendingUp,   color: "text-primary-600 dark:text-primary-400", bg: "bg-primary-50 dark:bg-primary-900/30" },
          { label: "Órdenes",        value: orders.length,               icon: ShoppingCart, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Valor promedio", value: `$${avgOrder}`,              icon: Star,         color: "text-amber-500",  bg: "bg-amber-50 dark:bg-amber-900/20"  },
          { label: "Cliente desde",  value: new Date(customer.createdAt).toLocaleDateString("es-CO", { month: "short", year: "numeric" }), icon: Clock, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Gráfica gasto */}
        <div className="card p-5 xl:col-span-2">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Historial de gasto</h2>
          <p className="text-xs text-gray-400 mb-4">Dinero gastado por mes</p>
          {spendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={spendData}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip formatter={v => [`$${v}`, "Gasto"]} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Area type="monotone" dataKey="spent" stroke="#4f46e5" strokeWidth={2} fill="url(#spendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              Sin órdenes registradas
            </div>
          )}
        </div>

        {/* Info personal */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Información</h2>
          <div className="space-y-3">
            {[
              { icon: Mail,   label: "Email",    value: customer.email },
              { icon: Phone,  label: "Teléfono", value: customer.phone || "—" },
              { icon: Clock,  label: "Última compra", value: orders[0] ? new Date(orders[0].createdAt).toLocaleDateString("es-CO") : "—" },
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
        </div>
      </div>

      {/* Órdenes */}
      <div className="table-wrap">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Historial de órdenes</h2>
          <p className="text-xs text-gray-400 mt-0.5">{completed} de {orders.length} completadas</p>
        </div>
        {orders.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">
            <ShoppingCart size={32} className="mx-auto mb-2 opacity-30" />
            Sin órdenes registradas
          </div>
        ) : (
          <table className="table-base">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="cursor-pointer" onClick={() => navigate(`/orders/${o.id}`)}>
                  <td className="font-mono text-xs text-primary-600 dark:text-primary-400">{o.id.slice(0, 8)}…</td>
                  <td className="font-semibold">${Number(o.total).toFixed(2)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString("es-CO")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal editar */}
      <Modal
        open={editModal}
        onClose={() => setEditModal(false)}
        title="Editar cliente"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setEditModal(false)}>Cancelar</button>
            <button className="btn-primary" onClick={handleUpdate}>Guardar</button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="label">Nombre</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">Teléfono</label>
            <input value={form.phone} onChange={e => set("phone", e.target.value)} className="input" placeholder="+57 311 000 0000" />
          </div>
        </div>
      </Modal>
    </div>
  );
}