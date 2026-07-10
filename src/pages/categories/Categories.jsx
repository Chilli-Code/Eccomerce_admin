import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Tag } from "../../lib/icons.js";
import { StatusBadge, Modal } from "../../components/ui/index.jsx";
import { api } from "../../lib/api.js";
import { notify } from "../../lib/notifications.js";
import Loader from "../../components/ui/Loader.jsx";

export default function Categories() {
  const [cats,     setCats]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [editCat,  setEditCat]  = useState(null);
  const [delModal, setDelModal] = useState(null);
  const [form,     setForm]     = useState({ name: "", slug: "", parentId: "", status: "active" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { fetchCats(); }, []);

  const fetchCats = async () => {
    try {
      setLoading(true);
      const data = await api.categories.list();
      setCats(data);
    } catch {
      notify.error("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditCat(null);
    setForm({ name: "", slug: "", parentId: "", status: "active" });
    setModal(true);
  };

  const openEdit = (c) => {
    setEditCat(c);
    setForm({ name: c.name, slug: c.slug, parentId: c.parentId || "", status: c.status });
    setModal(true);
  };

  const save = async () => {
    if (!form.name.trim()) return;
    try {
      const payload = {
        name:     form.name,
        slug:     form.slug,
        parentId: form.parentId || undefined,
        status:   form.status,
      };
      if (editCat) {
        await api.categories.update(editCat.id, payload);
        notify.saved();
      } else {
        await api.categories.create(payload);
        notify.saved();
      }
      setModal(false);
      fetchCats();
    } catch (err) {
      notify.error(err.message || "Error al guardar");
    }
  };

  const handleDelete = async () => {
    try {
      await api.categories.delete(delModal.id);
      notify.deleted();
      setDelModal(null);
      fetchCats();
    } catch {
      notify.error("Error al eliminar categoría");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Loader size={80} />
      <p className="text-sm text-gray-400">Cargando categorías…</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Categorías</h1>
          <p className="text-sm text-gray-400 mt-0.5">{cats.length} categorías en total</p>
        </div>
        <button className="btn-primary" onClick={openNew}>
          <Plus size={16} /> Nueva categoría
        </button>
      </div>

      <div className="table-wrap overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Slug</th>
              <th>Categoría padre</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cats.map(c => {
              const parent = cats.find(p => p.id === c.parentId);
              return (
                <tr key={c.id}>
                  <td className="font-medium text-gray-800 dark:text-gray-200">
                    <div className="flex items-center gap-2">
                      {c.parentId && <span className="text-gray-300 dark:text-gray-600 text-xs">└</span>}
                      {c.name}
                    </div>
                  </td>
                  <td className="font-mono text-xs text-gray-400">{c.slug}</td>
                  <td className="text-sm text-gray-500">
                    {parent?.name || <span className="text-gray-300 dark:text-gray-600">—</span>}
                  </td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(c)} className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-primary-600">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDelModal(c)} className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {cats.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            <Tag size={32} className="mx-auto mb-2 opacity-30" />
            No hay categorías aún
          </div>
        )}
      </div>

      {/* Modal crear/editar */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editCat ? "Editar categoría" : "Nueva categoría"}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn-primary" onClick={save}>Guardar</button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="label">Nombre *</label>
            <input
              value={form.name}
              onChange={e => { set("name", e.target.value); if (!editCat) set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-")); }}
              className="input" placeholder="Sneakers"
            />
          </div>
          <div>
            <label className="label">Slug</label>
            <input value={form.slug} onChange={e => set("slug", e.target.value)} className="input font-mono text-sm" placeholder="sneakers" />
          </div>
          <div>
            <label className="label">Categoría padre</label>
            <select value={form.parentId} onChange={e => set("parentId", e.target.value)} className="input">
              <option value="">Ninguna (nivel superior)</option>
              {cats.filter(c => !c.parentId && c.id !== editCat?.id).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Estado</label>
            <select value={form.status} onChange={e => set("status", e.target.value)} className="input">
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Modal eliminar */}
      <Modal
        open={!!delModal}
        onClose={() => setDelModal(null)}
        title="Eliminar categoría"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setDelModal(null)}>Cancelar</button>
            <button className="btn-danger" onClick={handleDelete}>Eliminar</button>
          </>
        }
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ¿Eliminar <strong className="text-gray-900 dark:text-white">{delModal?.name}</strong>? Los productos de esta categoría quedarán sin categoría.
        </p>
      </Modal>
    </div>
  );
}