import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X, Upload } from "../../lib/icons.js";
import { notify } from "../../lib/notifications.js";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
const handleSave = () => {
  notify.productSaved(form.name);
  navigate("/products");
};
  const [form, setForm] = useState({
    name: isEdit ? "Air Force 1 Low" : "",
    sku: isEdit ? "AF1-001" : "",
    price: isEdit ? "399" : "",
    compare_price: isEdit ? "450" : "",
    category: isEdit ? "Sneakers" : "",
    description: isEdit ? "Classic sneaker with premium materials." : "",
    status: isEdit ? "active" : "draft",
    stock: isEdit ? "48" : "",
    weight: isEdit ? "0.9" : "",
    tags: isEdit ? ["sneakers", "classic", "men"] : [],
    newTag: "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addTag = () => {
    if (form.newTag.trim() && !form.tags.includes(form.newTag.trim())) {
      set("tags", [...form.tags, form.newTag.trim()]);
      set("newTag", "");
    }
  };

  return (
    <div className="max-w-10xl">
      <div className="page-header mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/products")} className="btn-ghost p-2 rounded-lg">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-title">{isEdit ? "Edit Product" : "New Product"}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{isEdit ? `Editing: ${form.name}` : "Fill in the details below"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => navigate("/products")}>Cancel</button>
          <button className="btn-primary"onClick={handleSave}>Save Product</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Main col */}
        <div className="col-span-2 space-y-5">
          {/* Basic info */}
          <div className="card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Basic Information</h2>
            <div>
              <label className="label">Product name *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)} className="input" placeholder="e.g. Air Force 1 Low" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">SKU</label>
                <input value={form.sku} onChange={e => set("sku", e.target.value)} className="input font-mono" placeholder="AF1-001" />
              </div>
              <div>
                <label className="label">Category</label>
                <select value={form.category} onChange={e => set("category", e.target.value)} className="input">
                  <option value="">Select category</option>
                  <option>Sneakers</option>
                  <option>Apparel</option>
                  <option>Accessories</option>
                  <option>Bags</option>
                  <option>Outerwear</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                value={form.description}
                onChange={e => set("description", e.target.value)}
                rows={4}
                className="input resize-none"
                placeholder="Product description…"
              />
            </div>
          </div>

          {/* Media */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">Media</h2>
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
              <Upload size={24} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-500">Drag & drop images or <span className="text-primary-600 dark:text-primary-400">browse</span></p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
            </div>
          </div>

          {/* Variants */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Variants</h2>
              <button className="btn-secondary text-xs py-1.5 px-3">
                <Plus size={13} /> Add variant
              </button>
            </div>
            <div className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
              No variants added. Add size, color, or other options.
            </div>
          </div>
        </div>

        {/* Sidebar col */}
        <div className="space-y-5">
          {/* Status */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Status</h2>
            <select value={form.status} onChange={e => set("status", e.target.value)} className="input">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Pricing */}
          <div className="card p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Pricing</h2>
            <div>
              <label className="label">Price *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input value={form.price} onChange={e => set("price", e.target.value)} className="input pl-7" placeholder="0.00" type="number" />
              </div>
            </div>
            <div>
              <label className="label">Compare-at price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input value={form.compare_price} onChange={e => set("compare_price", e.target.value)} className="input pl-7" placeholder="0.00" type="number" />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="card p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Inventory</h2>
            <div>
              <label className="label">Stock quantity</label>
              <input value={form.stock} onChange={e => set("stock", e.target.value)} className="input" placeholder="0" type="number" />
            </div>
            <div>
              <label className="label">Weight (kg)</label>
              <input value={form.weight} onChange={e => set("weight", e.target.value)} className="input" placeholder="0.0" type="number" />
            </div>
          </div>

          {/* Tags */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Tags</h2>
            <div className="flex gap-2 mb-2">
              <input
                value={form.newTag}
                onChange={e => set("newTag", e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTag()}
                className="input text-sm py-1.5 flex-1"
                placeholder="Add tag…"
              />
              <button onClick={addTag} className="btn-secondary px-3 py-1.5">
                <Plus size={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map(t => (
                <span key={t} className="badge badge-blue gap-1">
                  {t}
                  <button onClick={() => set("tags", form.tags.filter(x => x !== t))} className="ml-0.5">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
