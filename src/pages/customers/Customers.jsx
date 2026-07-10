import { useState, useEffect } from "react";
import { Users, Eye, Plus, Trash2 } from "../../lib/icons.js";
import { StatusBadge, SearchInput, Pagination, Modal } from "../../components/ui/index.jsx";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api.js";
import { notify } from "../../lib/notifications.js";
import Loader from "../../components/ui/Loader.jsx";

const PER_PAGE = 6;

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [page,      setPage]      = useState(1);
  const [delModal,  setDelModal]  = useState(null);
  const [modal,     setModal]     = useState(false);
  const [form,      setForm]      = useState({ name: "", email: "", phone: "" });
  const navigate = useNavigate();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await api.customers.list({ limit: 100 });
      setCustomers(data);
    } catch {
      notify.error("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    try {
      await api.customers.create(form);
      notify.customerCreated(form.name);
      setModal(false);
      setForm({ name: "", email: "", phone: "" });
      fetchCustomers();
    } catch (err) {
      notify.error(err.message || "Error al crear cliente");
    }
  };

  const handleDelete = async () => {
    try {
      await api.customers.delete(delModal.id);
      notify.customerDeleted(delModal.name);
      setDelModal(null);
      fetchCustomers();
    } catch {
      notify.error("Error al eliminar cliente");
    }
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Loader size={80} />
      <p className="text-sm text-gray-400">Cargando clientes…</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="text-sm text-gray-400 mt-0.5">{customers.length} clientes</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">Exportar CSV</button>
          <button className="btn-primary" onClick={() => setModal(true)}>
            <Plus size={16} /> Nuevo cliente
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total clientes",  value: customers.length,                                        color: "text-primary-600 dark:text-primary-400", bg: "bg-primary-50 dark:bg-primary-900/30"  },
          { label: "Activos",         value: customers.filter(c => c.status === "active").length,     color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20"  },
          { label: "Inactivos",       value: customers.filter(c => c.status === "inactive").length,   color: "text-red-500",   bg: "bg-red-50 dark:bg-red-900/20"   },
          { label: "Total gastado",   value: `$${customers.reduce((s, c) => s + Number(c.totalSpent || 0), 0).toLocaleString()}`, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
        ].map(s => (
          <div key={s.label} className="card px-4 py-3 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}>
              <Users size={16} className={s.color} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-64">
            <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Buscar clientes…" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Total gastado</th>
                <th>Registrado</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xs font-semibold flex-shrink-0">
                        {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-gray-500">{c.phone || "—"}</td>
                  <td className="font-semibold">${Number(c.totalSpent || 0).toFixed(2)}</td>
                  <td className="text-xs text-gray-400">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => navigate(`/customers/${c.id}`)} className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-primary-600">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => setDelModal(c)} className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            <Users size={32} className="mx-auto mb-2 opacity-30" />No se encontraron clientes
          </div>
        )}
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </div>

      {/* Modal crear cliente */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Nuevo cliente"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn-primary" onClick={handleCreate}>Crear cliente</button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="label">Nombre *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} className="input" placeholder="Laura Gómez" />
          </div>
          <div>
            <label className="label">Email *</label>
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} className="input" placeholder="laura@email.com" />
          </div>
          <div>
            <label className="label">Teléfono</label>
            <input value={form.phone} onChange={e => set("phone", e.target.value)} className="input" placeholder="+57 311 000 0000" />
          </div>
        </div>
      </Modal>

      {/* Modal eliminar */}
      <Modal
        open={!!delModal}
        onClose={() => setDelModal(null)}
        title="Eliminar cliente"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setDelModal(null)}>Cancelar</button>
            <button className="btn-danger" onClick={handleDelete}>Eliminar</button>
          </>
        }
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿Eliminar a <strong className="text-gray-900 dark:text-white">{delModal?.name}</strong>? Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
}