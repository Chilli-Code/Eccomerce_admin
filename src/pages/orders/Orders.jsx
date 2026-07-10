import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ShoppingCart, Clock, Settings, CheckCircle } from "../../lib/icons.js";
import { StatusBadge, SearchInput, Pagination } from "../../components/ui/index.jsx";
import { api } from "../../lib/api.js";
import { notify } from "../../lib/notifications.js";

const TABS = ["All", "Pending", "Processing", "Completed", "Cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const PER_PAGE = 6;

  // Cargar órdenes desde el backend
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.orders.list();
      setOrders(data);
    } catch (err) {
      notify.error("Error al cargar órdenes");
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter(o => {
    const matchTab = tab === "All" || o.status === tab.toLowerCase();
    const matchSearch =
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    completed: orders.filter(o => o.status === "completed").length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="text-sm text-gray-400 mt-0.5">{orders.length} orders total</p>
        </div>
        <button className="btn-secondary" onClick={() => {}}>Export CSV</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total órdenes",  value: stats.total, color: "text-gray-900 dark:text-white", bg: "bg-gray-100 dark:bg-gray-800", icon: ShoppingCart },
          { label: "Pendientes",     value: stats.pending, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", icon: Clock },
          { label: "En proceso",     value: stats.processing, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", icon: Settings },
          { label: "Completadas",    value: stats.completed, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: CheckCircle },
        ].map(s => (
          <div key={s.label} className="card px-5 py-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}>
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-4 border-b border-gray-100 dark:border-gray-800">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setPage(1); }}
              className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px ${
                tab === t
                  ? "border-primary-600 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="px-5 py-3">
          <div className="w-64">
            <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search orders…" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(o => (
                <tr key={o.id} className="cursor-pointer" onClick={() => navigate(`/orders/${o.id}`)}>
                  <td className="font-mono text-xs text-primary-600 dark:text-primary-400">{o.id?.slice(0, 8)}</td>
                  <td>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{o.customerName || "Cliente"}</p>
                      <p className="text-xs text-gray-400">{o.customerEmail || "sin email"}</p>
                    </div>
                  </td>
                  <td className="text-center">{o.items?.length || 0}</td>
                  <td className="font-semibold">${Number(o.total).toLocaleString("es-CO")}</td>
                  <td className="capitalize text-sm text-gray-500">{o.paymentMethod || "No especificado"}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-primary-600">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            <ShoppingCart size={32} className="mx-auto mb-2 opacity-30" />
            No orders found
          </div>
        )}

        {totalPages > 1 && (
          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
        )}
      </div>
    </div>
  );
}