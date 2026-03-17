import { useState } from "react";
import { Plus, Edit2, Trash2, Tag } from "../../lib/icons.js";
import { allCategories } from "../../data/mock.js";
import { StatusBadge, Modal } from "../../components/ui/index.jsx";

export default function Categories() {
  const [cats, setCats] = useState(allCategories);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", parent: "", status: "active" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = () => {
    if (!form.name.trim()) return;
    setCats(c => [...c, { ...form, id: Date.now(), products: 0 }]);
    setForm({ name: "", slug: "", parent: "", status: "active" });
    setModal(false);
  };

  return (
    <div className="space-y-5">
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="text-sm text-gray-400 mt-0.5">Organize your product catalog</p>
        </div>
        <button className="btn-primary" onClick={() => setModal(true)}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="table-wrap overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Parent</th>
              <th>Products</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cats.map(c => (
              <tr key={c.id}>
                <td className="font-medium text-gray-800 dark:text-gray-200">{c.name}</td>
                <td className="font-mono text-xs text-gray-400">{c.slug}</td>
                <td className="text-sm text-gray-500">{c.parent || <span className="text-gray-300 dark:text-gray-600">—</span>}</td>
                <td className="text-center">{c.products}</td>
                <td><StatusBadge status={c.status} /></td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-primary-600"><Edit2 size={14} /></button>
                    <button className="btn-ghost p-1.5 rounded-lg text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cats.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            <Tag size={32} className="mx-auto mb-2 opacity-30" />No categories yet
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="New Category"
        footer={<>
          <button className="btn-secondary" onClick={() => setModal(false)}>Cancel</button>
          <button className="btn-primary" onClick={save}>Save</button>
        </>}
      >
        <div className="space-y-3">
          <div>
            <label className="label">Name *</label>
            <input value={form.name} onChange={e => { set("name", e.target.value); set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-")); }} className="input" placeholder="e.g. Sneakers" />
          </div>
          <div>
            <label className="label">Slug</label>
            <input value={form.slug} onChange={e => set("slug", e.target.value)} className="input font-mono text-sm" placeholder="sneakers" />
          </div>
          <div>
            <label className="label">Parent category</label>
            <select value={form.parent} onChange={e => set("parent", e.target.value)} className="input">
              <option value="">None (top level)</option>
              {cats.filter(c => !c.parent).map(c => <option key={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select value={form.status} onChange={e => set("status", e.target.value)} className="input">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
