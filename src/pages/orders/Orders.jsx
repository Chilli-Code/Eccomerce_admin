import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ShoppingCart, Clock, Settings, CheckCircle, Calendar, CreditCard, X, ChevronDown } from "../../lib/icons.js";
import { StatusBadge, SearchInput, Pagination } from "../../components/ui/index.jsx";
import { api } from "../../lib/api.js";
import { notify } from "../../lib/notifications.js";

const TABS = ["All", "Pending", "Processing", "In Transit", "Delivered", "Cancelled"];

const fmtDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("es-CO", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const fmtDay = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toISOString().slice(0, 10);
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");
  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const navigate = useNavigate();
  const PER_PAGE = 6;

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

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const statusMap = { "Pending": "pending", "Processing": "processing", "In Transit": "in_transit", "Delivered": "delivered", "Cancelled": "cancelled" };
      const matchTab = tab === "All" || o.status === (statusMap[tab] || tab.toLowerCase());
      const matchSearch =
        o.id?.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        o.customerEmail?.toLowerCase().includes(search.toLowerCase());
      const matchDate = !dateFilter || fmtDay(o.createdAt) === dateFilter;
      const matchPayment = !paymentFilter || (o.paymentMethod || "").toLowerCase() === paymentFilter.toLowerCase();
      return matchTab && matchSearch && matchDate && matchPayment;
    });
  }, [orders, tab, search, dateFilter, paymentFilter]);

  const toggleSort = (col) => {
    if (sortBy === col) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
    setPage(1);
  };

  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    return [...filtered].sort((a, b) => {
      let va, vb;
      if (sortBy === "total") { va = Number(a.total); vb = Number(b.total); }
      else if (sortBy === "items") { va = a.itemsCount ?? 0; vb = b.itemsCount ?? 0; }
      else if (sortBy === "date") { va = new Date(a.createdAt).getTime(); vb = new Date(b.createdAt).getTime(); }
      else if (sortBy === "customer") { va = (a.customerName || "").toLowerCase(); vb = (b.customerName || "").toLowerCase(); }
      else { va = a[sortBy]; vb = b[sortBy]; }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortBy, sortDir]);

  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    delivered: orders.filter(o => o.status === "delivered").length,
  };

  const paymentMethods = useMemo(() => {
    const methods = new Set(orders.map(o => o.paymentMethod).filter(Boolean));
    return [...methods];
  }, [orders]);

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
          <p className="text-sm text-gray-400 mt-0.5">
            {orders.length} órdenes
            {filtered.length < orders.length && (
              <span> · <span className="text-primary-600 font-medium">{filtered.length}</span> filtradas</span>
            )}
          </p>
        </div>
        <button className="btn-secondary" onClick={() => {}}>Export CSV</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total órdenes",  value: stats.total, color: "text-gray-900 dark:text-white", bg: "bg-gray-100 dark:bg-gray-800", icon: ShoppingCart },
          { label: "Pendientes",     value: stats.pending, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", icon: Clock },
          { label: "En proceso",     value: stats.processing, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", icon: Settings },
          { label: "Entregadas",     value: stats.delivered, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: CheckCircle },
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
        <div className="overflow-x-auto px-5 pt-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex gap-1 min-w-max">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setPage(1); }}
                className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px whitespace-nowrap ${
                  tab === t
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-gray-100 dark:border-gray-800">
          <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search orders…" />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={14} />
            <input
              type="date"
              value={dateFilter}
              onChange={e => { setDateFilter(e.target.value); setPage(1); }}
              className="input py-1.5 text-sm w-40"
            />
            {dateFilter && (
              <button onClick={() => setDateFilter("")} className="btn-ghost p-1.5 rounded-lg text-xs gap-1"><X size={12} /> Limpiar</button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CreditCard size={14} />
            <select
              value={paymentFilter}
              onChange={e => { setPaymentFilter(e.target.value); setPage(1); }}
              className="input py-1.5 text-sm w-36"
            >
              <option value="">Todos</option>
              {paymentMethods.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Order ID</th>
                <th onClick={() => toggleSort("customer")} className="cursor-pointer select-none hover:text-primary-600">
                  <span className="inline-flex items-center gap-1">
                    Customer
                    {sortBy === "customer" && <ChevronDown size={12} className={sortDir === "asc" ? "rotate-180" : ""} />}
                  </span>
                </th>
                <th onClick={() => toggleSort("items")} className="cursor-pointer select-none hover:text-primary-600">
                  <span className="inline-flex items-center gap-1">
                    Items
                    {sortBy === "items" && <ChevronDown size={12} className={sortDir === "asc" ? "rotate-180" : ""} />}
                  </span>
                </th>
                <th onClick={() => toggleSort("total")} className="cursor-pointer select-none hover:text-primary-600">
                  <span className="inline-flex items-center gap-1">
                    Total
                    {sortBy === "total" && <ChevronDown size={12} className={sortDir === "asc" ? "rotate-180" : ""} />}
                  </span>
                </th>
                <th>Payment</th>
                <th>Status</th>
                <th onClick={() => toggleSort("date")} className="cursor-pointer select-none hover:text-primary-600">
                  <span className="inline-flex items-center gap-1">
                    Date
                    {sortBy === "date" && <ChevronDown size={12} className={sortDir === "asc" ? "rotate-180" : ""} />}
                  </span>
                </th>
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
                  <td className="text-center">{o.itemsCount ?? 0}</td>
                  <td className="font-semibold">${Number(o.total).toLocaleString("es-CO")}</td>
                  <td className="capitalize text-sm text-gray-500">{o.paymentMethod || "No especificado"}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className="text-xs text-gray-400 whitespace-nowrap">{fmtDate(o.createdAt)}</td>
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