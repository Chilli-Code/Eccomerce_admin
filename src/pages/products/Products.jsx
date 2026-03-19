import { useState } from "react";
import { Plus, Edit2, Trash2, Package, Eye, Tag, AlertCircle, FileText  } from "../../lib/icons.js";
import { Link } from "react-router-dom";
import { allProducts } from "../../data/mock.js";
import { StatusBadge, SearchInput, Pagination, Modal } from "../../components/ui/index.jsx";

const PER_PAGE = 6;

export default function Products() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [delModal, setDelModal] = useState(null);
  const [selected, setSelected] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortBy === "price") return (a[sortBy] - b[sortBy]) * dir;
    return a[sortBy]?.localeCompare(b[sortBy]) * dir;
  });

  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map(p => p.id));

  function SortTh({ label, field }) {
    const active = sortBy === field;
    return (
      <th
        className="cursor-pointer select-none hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        onClick={() => {
          if (active) setSortDir(d => d === "asc" ? "desc" : "asc");
          else { setSortBy(field); setSortDir("asc"); }
        }}
      >
        <span className="flex items-center gap-1">
          {label}
          <span className="text-[10px] opacity-50">
            {active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
          </span>
        </span>
      </th>
    );
  }

  function Checkbox({ checked, onChange, onClick }) {
  return (
    <label className="cursor-pointer select-none" onClick={onClick}>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <span className={`flex h-4 w-4 items-center justify-center rounded-sm border-[1.25px] transition-colors ${
        checked
          ? "bg-primary-600 border-primary-600"
          : "bg-transparent border-gray-300 dark:border-gray-700"
      }`}>
        <span className={`transition-opacity ${checked ? "opacity-100" : "opacity-0"}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.6666" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </span>
    </label>
  );
}

  return (
    <div className="space-y-5">

      
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">{allProducts.length} products total</p>
        </div>
        <Link to="/products/new" className="btn-primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>
      {/* Stat cards */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {[
    {
      label: "Total productos",
      value: allProducts.length,
      sub: `${allProducts.filter(p => p.status === "active").length} activos`,
      color: "text-primary-600 dark:text-primary-400",
      bg: "bg-primary-50 dark:bg-primary-900/30",
      icon: Package,
    },
    {
      label: "Categorías",
      value: [...new Set(allProducts.map(p => p.category))].length,
      sub: "categorías distintas",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      icon: Tag,
    },
    {
      label: "Sin stock",
      value: allProducts.filter(p => p.stock === 0).length,
      sub: "requieren restock",
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-900/20",
      icon: AlertCircle,
    },
    {
      label: "Borradores",
      value: allProducts.filter(p => p.status === "draft").length,
      sub: "sin publicar",
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      icon: FileText,
    },
  ].map(s => (
    <div key={s.label} className="card px-4 py-3 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.bg}`}>
        <s.icon size={16} className={s.color} />
      </div>
      <div>
        <p className="text-xs text-gray-400">{s.label}</p>
        <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
        <p className="text-[11px] text-gray-400">{s.sub}</p>
      </div>
    </div>
  ))}
</div>

      {selected.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl">
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
            {selected.length} producto{selected.length > 1 ? "s" : ""} seleccionado{selected.length > 1 ? "s" : ""}
          </span>
          <div className="flex gap-2 ml-auto">
            <button className="btn-secondary text-xs py-1.5" onClick={() => setSelected([])}>
              Deseleccionar
            </button>
            <button className="btn-secondary text-xs py-1.5">
              Cambiar estado
            </button>
            <button className="btn-danger text-xs py-1.5" onClick={() => setDelModal({ bulk: true })}>
              <Trash2 size={13} /> Eliminar selección
            </button>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-64">
            <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search products…" />
          </div>
          <div className="ml-auto flex gap-2">
            <select className="input py-2 text-sm w-auto">
              <option>All categories</option>
              <option>Sneakers</option>
              <option>Apparel</option>
              <option>Accessories</option>
            </select>
            <select className="input py-2 text-sm w-auto">
              <option>All status</option>
              <option>Active</option>
              <option>Draft</option>
              <option>Out of stock</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th className="w-10">
                  <Checkbox
                    checked={paginated.length > 0 && selected.length === paginated.length}
                    onChange={toggleAll}
                  />
                </th>
                <SortTh label="Producto"  field="name" />
                <SortTh label="SKU"       field="sku" />
                <SortTh label="Categoría" field="category" />
                <SortTh label="Precio"    field="price" />
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => (
                <tr key={p.id} className={selected.includes(p.id) ? "bg-primary-50/50 dark:bg-primary-900/10" : ""}>
                  <td>
  <Checkbox
    checked={selected.includes(p.id)}
    onChange={() => toggleSelect(p.id)}
    onClick={e => e.stopPropagation()}
  />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">
                        {p.image}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{p.name}</span>
                    </div>
                  </td>
                  <td className="font-mono text-xs text-gray-400">{p.sku}</td>
                  <td>{p.category}</td>
                  <td className="font-medium">${p.price}</td>
                  <td>
                    <span className={p.stock === 0 ? "text-red-500 font-medium" : "text-gray-700 dark:text-gray-300"}>
                      {p.stock === 0 ? "Sin stock" : p.stock}
                    </span>
                  </td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Link to={`/products/${p.id}/edit`} className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-primary-600">
                        <Edit2 size={14} />
                      </Link>
   <Link to={`/products/${p.id}/stats`} className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-primary-600">
      <Eye size={14} />
    </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            <Package size={32} className="mx-auto mb-2 opacity-30" />
            No products found
          </div>
        )}

        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </div>

      <Modal
        open={!!delModal}
        onClose={() => setDelModal(null)}
        title={delModal?.bulk ? "Eliminar productos" : "Eliminar producto"}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setDelModal(null)}>Cancelar</button>
            <button className="btn-danger" onClick={() => { setDelModal(null); setSelected([]); }}>Eliminar</button>
          </>
        }
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {delModal?.bulk
            ? `¿Eliminar los ${selected.length} productos seleccionados? Esta acción no se puede deshacer.`
            : <>¿Eliminar <strong className="text-gray-900 dark:text-white">{delModal?.name}</strong>? Esta acción no se puede deshacer.</>
          }
        </p>
      </Modal>
    </div>
  );
}